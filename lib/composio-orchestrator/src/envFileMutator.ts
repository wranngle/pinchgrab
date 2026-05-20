// Atomic read/upsert/delete of KEY=VALUE entries in ~/.agents/.env. Used for
// secrets that must survive process restarts (COMPOSIO_API_KEY,
// COMPOSIO_WEBHOOK_SECRET, COMPOSIO_WEBHOOK_URL) without growing extra
// state files. Preserves comments, blank lines, and ordering. Atomic via
// *.tmp + rename; lockfile guards concurrent writers.
import { existsSync, openSync, closeSync, readFileSync, renameSync, unlinkSync, writeFileSync, chmodSync } from 'node:fs';
import { resolveAgentsEnvFilePath } from './statePaths.js';
import { logInfo } from './logging.js';

const FILE_MODE_PRIVATE = 0o600;

interface ParsedLine {
  raw: string;
  key?: string;
  value?: string;
}

function parseEnvFile(text: string): ParsedLine[] {
  return text.split('\n').map((raw) => {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('#')) return { raw };
    const equalsIndex = raw.indexOf('=');
    if (equalsIndex === -1) return { raw };
    const key = raw.slice(0, equalsIndex).trim();
    const value = raw.slice(equalsIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    return { raw, key, value };
  });
}

function serializeLines(lines: ParsedLine[]): string {
  // Always end with a trailing newline. Without this, the next upsert that
  // reads back the file sees no final newline and the next appended entry
  // concatenates to the previous line, producing keys like
  // `LAST_KEY=value123NEXT_KEY=value456`. Incident 2026-05-14.
  const body = lines.map((line) => line.raw).join('\n');
  return body.endsWith('\n') ? body : body + '\n';
}

async function withLock<T>(filePath: string, fn: () => T): Promise<T> {
  const lockPath = `${filePath}.lock`;
  const start = Date.now();
  for (;;) {
    try {
      const fd = openSync(lockPath, 'wx');
      try {
        return fn();
      } finally {
        closeSync(fd);
        try { unlinkSync(lockPath); } catch { /* ignore */ }
      }
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'EEXIST') throw err;
      if (Date.now() - start > 5000) {
        try { unlinkSync(lockPath); } catch { /* ignore */ }
        throw new Error(`Timed out waiting for env-file lock at ${lockPath}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }
}

export function readEnvFileEntry(key: string): string | undefined {
  const filePath = resolveAgentsEnvFilePath();
  if (!existsSync(filePath)) return undefined;
  const lines = parseEnvFile(readFileSync(filePath, 'utf8'));
  for (const line of lines) {
    if (line.key === key) return line.value;
  }
  return undefined;
}

export async function upsertEnvFileEntry(key: string, value: string): Promise<void> {
  const filePath = resolveAgentsEnvFilePath();
  await withLock(filePath, () => {
    const existing = existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
    const lines = parseEnvFile(existing);
    let replaced = false;
    for (let index = 0; index < lines.length; index += 1) {
      if (lines[index]?.key === key) {
        lines[index] = { raw: `${key}=${value}`, key, value };
        replaced = true;
        break;
      }
    }
    if (!replaced) {
      if (lines.length > 0 && lines[lines.length - 1]?.raw !== '') lines.push({ raw: '' });
      lines.push({ raw: `${key}=${value}`, key, value });
    }
    const tempPath = `${filePath}.tmp`;
    writeFileSync(tempPath, serializeLines(lines));
    renameSync(tempPath, filePath);
    try { chmodSync(filePath, FILE_MODE_PRIVATE); } catch { /* ignore on platforms without chmod */ }
  });
  logInfo('composio.env.upserted', { key });
}

export async function deleteEnvFileEntry(key: string): Promise<boolean> {
  const filePath = resolveAgentsEnvFilePath();
  if (!existsSync(filePath)) return false;
  let removed = false;
  await withLock(filePath, () => {
    const lines = parseEnvFile(readFileSync(filePath, 'utf8')).filter((line) => {
      if (line.key === key) { removed = true; return false; }
      return true;
    });
    const tempPath = `${filePath}.tmp`;
    writeFileSync(tempPath, serializeLines(lines));
    renameSync(tempPath, filePath);
    try { chmodSync(filePath, FILE_MODE_PRIVATE); } catch { /* ignore */ }
  });
  if (removed) logInfo('composio.env.deleted', { key });
  return removed;
}
