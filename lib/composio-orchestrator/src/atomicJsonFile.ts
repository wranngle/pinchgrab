// Atomic JSON read/write with sorted keys + trailing newline. Determinism
// matches AGENTS.md imperative #3. Concurrent writers serialize via a
// best-effort lockfile next to the target.
import { existsSync, mkdirSync, openSync, closeSync, readFileSync, renameSync, writeFileSync, unlinkSync } from 'node:fs';
import { dirname } from 'node:path';

function sortedStringify(value: unknown): string {
  return JSON.stringify(value, (_key, val) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const sorted: Record<string, unknown> = {};
      for (const k of Object.keys(val).sort()) sorted[k] = (val as Record<string, unknown>)[k];
      return sorted;
    }
    return val;
  }, 2) + '\n';
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
      // Force-unlinking the lock here used to race with the holder finishing
      // its work — two writers could end up serialized only loosely. Now we
      // throw without touching the lock; a stale lock is recoverable by the
      // operator (rm -f path.lock) and silent double-writes are not.
      if (Date.now() - start > 5000) {
        throw new Error(`Timed out waiting for lock at ${lockPath}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }
}

// Rotate a JSON file that failed to parse into a `.corrupt-<ms>` sibling so
// the orchestrator can keep running on an empty fallback while forensics
// remain available. Best-effort — silently ignores rotation failures.
function rotateCorruptFile(filePath: string, reason: string): void {
  try {
    const stamp = Date.now();
    const dest = `${filePath}.corrupt-${stamp}`;
    renameSync(filePath, dest);
    process.stderr.write(`[atomicJsonFile] rotated corrupt ${filePath} -> ${dest} (${reason})\n`);
  } catch { /* ignore */ }
}

export function readJsonOr<T>(filePath: string, fallback: T): T {
  if (!existsSync(filePath)) return fallback;
  const text = readFileSync(filePath, 'utf8');
  if (!text.trim()) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    rotateCorruptFile(filePath, (err as Error).message);
    return fallback;
  }
}

export async function updateJsonAtomic<T>(filePath: string, mutator: (current: T) => T, fallback: T): Promise<T> {
  return withLock(filePath, () => {
    mkdirSync(dirname(filePath), { recursive: true });
    const current = readJsonOr<T>(filePath, fallback);
    const next = mutator(current);
    const tempPath = `${filePath}.tmp`;
    writeFileSync(tempPath, sortedStringify(next));
    renameSync(tempPath, filePath);
    return next;
  });
}
