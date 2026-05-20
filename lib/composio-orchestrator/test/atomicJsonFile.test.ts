// Behavior coverage for the atomic JSON file lock.
//   - corrupt-file rotation via readJsonOr (defensive parse)
//   - concurrent writers all land (lock works under contention)
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { readJsonOr } from '../src/atomicJsonFile.js';
import { appendPendingAuth, listPendingAuth } from '../src/pendingAuthStore.js';

let tempStateDir: string;
let originalStateDir: string | undefined;

beforeEach(() => {
  tempStateDir = mkdtempSync(join(tmpdir(), 'composio-atomic-test-'));
  originalStateDir = process.env.COMPOSIO_ORCH_STATE_DIR;
  process.env.COMPOSIO_ORCH_STATE_DIR = tempStateDir;
});

afterEach(() => {
  if (originalStateDir === undefined) delete process.env.COMPOSIO_ORCH_STATE_DIR;
  else process.env.COMPOSIO_ORCH_STATE_DIR = originalStateDir;
  rmSync(tempStateDir, { recursive: true, force: true });
});

describe('readJsonOr: corrupt files rotate, fallback returned', () => {
  it('returns fallback on truncated JSON and renames the bad file', () => {
    const filePath = join(tempStateDir, 'corrupt.json');
    writeFileSync(filePath, '{"version":1,"entries":[{ "incomplete":');
    const result = readJsonOr(filePath, { version: 1, entries: [] });
    expect(result).toEqual({ version: 1, entries: [] });
    expect(existsSync(filePath)).toBe(false);
    const rotated = readdirSync(tempStateDir).filter((f) => f.startsWith('corrupt.json.corrupt-'));
    expect(rotated.length).toBe(1);
  });
});

describe('pendingAuthStore lock: concurrent appends all land', () => {
  it('20 concurrent appendPendingAuth calls all persist', async () => {
    const calls = Array.from({ length: 20 }).map((_, i) =>
      appendPendingAuth({
        connectedAccountId: `ca_concurrent_${i}`,
        authConfigId: 'ac_x',
        toolkit: 'github',
        userId: 'cody',
        redirectUrl: `https://example.com/${i}`,
      }),
    );
    await Promise.all(calls);
    expect(listPendingAuth().length).toBe(20);
  });
});
