import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { upsertEnvFileEntry, deleteEnvFileEntry, readEnvFileEntry } from '../src/envFileMutator.js';

let tempDir: string;
let envPath: string;
let originalEnvPath: string | undefined;

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'composio-env-test-'));
  envPath = join(tempDir, '.env');
  originalEnvPath = process.env.COMPOSIO_ORCH_ENV_FILE;
  process.env.COMPOSIO_ORCH_ENV_FILE = envPath;
});

afterEach(() => {
  if (originalEnvPath === undefined) delete process.env.COMPOSIO_ORCH_ENV_FILE;
  else process.env.COMPOSIO_ORCH_ENV_FILE = originalEnvPath;
  rmSync(tempDir, { recursive: true, force: true });
});

describe('envFileMutator', () => {
  it('upserts a new key into an empty file', async () => {
    await upsertEnvFileEntry('FOO', 'bar');
    expect(readFileSync(envPath, 'utf8')).toContain('FOO=bar');
    expect(readEnvFileEntry('FOO')).toBe('bar');
  });

  it('replaces an existing key without duplicating', async () => {
    writeFileSync(envPath, 'FOO=old\nBAZ=keep\n');
    await upsertEnvFileEntry('FOO', 'new');
    const text = readFileSync(envPath, 'utf8');
    expect(text).toContain('FOO=new');
    expect(text).not.toContain('FOO=old');
    expect(text).toContain('BAZ=keep');
  });

  it('preserves comments and blank lines on upsert', async () => {
    writeFileSync(envPath, '# header\n\nA=1\n');
    await upsertEnvFileEntry('B', '2');
    const text = readFileSync(envPath, 'utf8');
    expect(text).toContain('# header');
    expect(text.split('\n').filter((l) => l.trim() === '').length).toBeGreaterThanOrEqual(1);
    expect(text).toContain('A=1');
    expect(text).toContain('B=2');
  });

  it('deleteEnvFileEntry removes the key and reports true; false when absent', async () => {
    writeFileSync(envPath, 'X=y\nZ=q\n');
    expect(await deleteEnvFileEntry('X')).toBe(true);
    expect(readFileSync(envPath, 'utf8')).not.toContain('X=y');
    expect(await deleteEnvFileEntry('NOPE')).toBe(false);
  });

  it('always writes a trailing newline (regression for .env concatenation bug)', async () => {
    await upsertEnvFileEntry('FOO', 'bar');
    expect(readFileSync(envPath, 'utf8').endsWith('\n')).toBe(true);
    // Second upsert: the next key must land on its own line.
    await upsertEnvFileEntry('BAZ', 'qux');
    const text = readFileSync(envPath, 'utf8');
    expect(text.endsWith('\n')).toBe(true);
    expect(text).toMatch(/FOO=bar\n/);
    expect(text).toMatch(/BAZ=qux\n/);
    // And no concatenation like FOO=barBAZ=qux:
    expect(text).not.toMatch(/FOO=[^\n]*BAZ=/);
  });

  it('repairs a file that arrived without a trailing newline', async () => {
    writeFileSync(envPath, 'OLD=value');  // no \n at EOF — the bug scenario
    await upsertEnvFileEntry('NEW', 'value2');
    const text = readFileSync(envPath, 'utf8');
    expect(text).toMatch(/OLD=value\n/);
    expect(text).toMatch(/NEW=value2\n/);
    expect(text).not.toMatch(/OLD=valueNEW=/);
  });
});
