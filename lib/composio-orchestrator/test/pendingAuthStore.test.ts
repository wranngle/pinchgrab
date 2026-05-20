import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  appendPendingAuth,
  listPendingAuth,
  removePendingAuthByConnectedAccountId,
  removePendingAuthForResolvedConnection,
  reapExpiredPendingAuth,
} from '../src/pendingAuthStore.js';

let originalStateDir: string | undefined;
let tempDir: string;

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'composio-orch-test-'));
  originalStateDir = process.env.COMPOSIO_ORCH_STATE_DIR;
  process.env.COMPOSIO_ORCH_STATE_DIR = tempDir;
});

afterEach(() => {
  if (originalStateDir === undefined) delete process.env.COMPOSIO_ORCH_STATE_DIR;
  else process.env.COMPOSIO_ORCH_STATE_DIR = originalStateDir;
  rmSync(tempDir, { recursive: true, force: true });
});

describe('pendingAuthStore', () => {
  it('appends and lists entries', async () => {
    await appendPendingAuth({
      connectedAccountId: 'ca_1',
      authConfigId: 'ac_1',
      toolkit: 'github',
      userId: 'cody',
      redirectUrl: 'https://connect.composio.dev/link/lk_x',
    });
    expect(listPendingAuth()).toHaveLength(1);
    expect(listPendingAuth('cody')).toHaveLength(1);
    expect(listPendingAuth('other')).toHaveLength(0);
  });

  it('replaces an entry with the same connectedAccountId', async () => {
    await appendPendingAuth({
      connectedAccountId: 'ca_1', authConfigId: 'ac_1', toolkit: 'github', userId: 'cody',
      redirectUrl: 'https://x',
    });
    await appendPendingAuth({
      connectedAccountId: 'ca_1', authConfigId: 'ac_1', toolkit: 'github', userId: 'cody',
      redirectUrl: 'https://y',
    });
    const list = listPendingAuth();
    expect(list).toHaveLength(1);
    expect(list[0]?.redirectUrl).toBe('https://y');
  });

  it('removes by connectedAccountId', async () => {
    await appendPendingAuth({
      connectedAccountId: 'ca_2', authConfigId: 'ac_2', toolkit: 'slack', userId: 'cody',
      redirectUrl: 'https://z',
    });
    expect(await removePendingAuthByConnectedAccountId('ca_2')).toBe(true);
    expect(listPendingAuth()).toHaveLength(0);
    expect(await removePendingAuthByConnectedAccountId('ca_2')).toBe(false);
  });

  it('removes stale entries when a toolkit resolves active for that user', async () => {
    await appendPendingAuth({
      connectedAccountId: 'ca_pending_1', authConfigId: 'ac_1', toolkit: 'github', userId: 'cody',
      redirectUrl: 'https://x',
    });
    await appendPendingAuth({
      connectedAccountId: 'pending-config-env-github-cody', authConfigId: 'unset', toolkit: 'github', userId: 'cody',
      redirectUrl: 'env://set X',
    });
    await appendPendingAuth({
      connectedAccountId: 'ca_other', authConfigId: 'ac_1', toolkit: 'github', userId: 'other',
      redirectUrl: 'https://y',
    });

    const removed = await removePendingAuthForResolvedConnection({
      toolkit: 'github',
      connectedAccountId: 'ca_active',
      userIds: ['cody'],
    });

    expect(removed.map((entry) => entry.connectedAccountId).sort()).toEqual([
      'ca_pending_1',
      'pending-config-env-github-cody',
    ]);
    expect(listPendingAuth().map((entry) => entry.connectedAccountId)).toEqual(['ca_other']);
  });

  it('reaps expired entries', async () => {
    await appendPendingAuth({
      connectedAccountId: 'ca_3', authConfigId: 'ac_3', toolkit: 'gmail', userId: 'cody',
      redirectUrl: 'https://w',
    });
    const future = new Date(Date.now() + 60 * 60_000);
    expect(await reapExpiredPendingAuth(future)).toEqual(['ca_3']);
    expect(listPendingAuth()).toHaveLength(0);
  });
});
