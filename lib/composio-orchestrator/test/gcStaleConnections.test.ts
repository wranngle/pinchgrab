import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

vi.mock('undici', () => ({ request: vi.fn() }));

import { request } from 'undici';
import { gcStaleConnections } from '../src/gcStaleConnections.js';
import { syncResolvedPendingAuth } from '../src/pendingAuthSync.js';
import { appendPendingAuth, listPendingAuth } from '../src/pendingAuthStore.js';

const mockRequest = request as unknown as ReturnType<typeof vi.fn>;
let tempStateDir: string;
let originalStateDir: string | undefined;

beforeEach(() => {
  tempStateDir = mkdtempSync(join(tmpdir(), 'composio-gc-test-'));
  originalStateDir = process.env.COMPOSIO_ORCH_STATE_DIR;
  process.env.COMPOSIO_ORCH_STATE_DIR = tempStateDir;
  process.env.COMPOSIO_API_KEY = 'test-key';
  mockRequest.mockReset();
});

afterEach(() => {
  if (originalStateDir === undefined) delete process.env.COMPOSIO_ORCH_STATE_DIR;
  else process.env.COMPOSIO_ORCH_STATE_DIR = originalStateDir;
  rmSync(tempStateDir, { recursive: true, force: true });
});

function mockListByStatus(status: string, items: Array<{ id: string; created_at?: string }>): void {
  mockRequest.mockResolvedValueOnce({
    statusCode: 200,
    body: { json: async () => ({ items: items.map((i) => ({ ...i, status })) }), text: async () => '' },
  });
}

function mockDeleteOk(): void {
  mockRequest.mockResolvedValueOnce({ statusCode: 200, body: { text: async () => '' } });
}

function mockGetForOrphan(found: boolean, status?: string): void {
  mockRequest.mockResolvedValueOnce({
    statusCode: found ? 200 : 404,
    body: {
      dump: async () => undefined,
      text: async () => '',
      json: async () => ({ status: status ?? 'INITIATED' }),
    },
  });
}

describe('gcStaleConnections', () => {
  it('reaps EXPIRED on sight regardless of TTL', async () => {
    mockListByStatus('INITIALIZING', []);
    mockListByStatus('INITIATED', []);
    mockListByStatus('EXPIRED', [{ id: 'ca_dead1' }, { id: 'ca_dead2' }]);
    mockDeleteOk();
    mockDeleteOk();
    mockListByStatus('FAILED', []);
    mockListByStatus('', []); // unused; pruneStaleAuthConfigs makes its own calls

    // No local pending entries so no orphan probes will fire.
    const result = await gcStaleConnections(30);
    expect(result.byStatus.EXPIRED).toBe(2);
    expect(result.deleted).toEqual(['ca_dead1', 'ca_dead2']);
  });

  it('TTL-gates INITIATED — keeps fresh, deletes stale', async () => {
    const now = Date.now();
    const fresh = new Date(now - 10 * 60_000).toISOString();
    const stale = new Date(now - 60 * 60_000).toISOString();
    mockListByStatus('INITIALIZING', []);
    mockListByStatus('INITIATED', [
      { id: 'ca_fresh', created_at: fresh },
      { id: 'ca_stale', created_at: stale },
    ]);
    mockDeleteOk();
    mockListByStatus('EXPIRED', []);
    mockListByStatus('FAILED', []);

    const result = await gcStaleConnections(30);
    expect(result.byStatus.INITIATED).toBe(1);
    expect(result.deleted).toEqual(['ca_stale']);
  });

  it('reaps orphaned local pending entries (404 from Composio)', async () => {
    await appendPendingAuth({
      connectedAccountId: 'ca_orphan',
      authConfigId: 'ac_x',
      toolkit: 'github',
      userId: 'cody',
      redirectUrl: 'https://x',
    });
    await appendPendingAuth({
      connectedAccountId: 'ca_alive',
      authConfigId: 'ac_x',
      toolkit: 'github',
      userId: 'cody2',
      redirectUrl: 'https://y',
    });
    expect(listPendingAuth()).toHaveLength(2);

    // GC pipeline: empty status lists, then per-pending orphan probes.
    mockListByStatus('INITIALIZING', []);
    mockListByStatus('INITIATED', []);
    mockListByStatus('EXPIRED', []);
    mockListByStatus('FAILED', []);
    mockGetForOrphan(false); // ca_orphan probe -> 404
    mockGetForOrphan(true, 'INITIATED');  // ca_alive probe -> 200, still INITIATED

    const result = await gcStaleConnections(30);
    expect(result.orphanedLocal).toEqual(['ca_orphan']);
    const remainingIds = listPendingAuth().map((p) => p.connectedAccountId);
    expect(remainingIds).toEqual(['ca_alive']);
  });

  it('reaps local pending when Composio status is now ACTIVE (consent landed without webhook)', async () => {
    await appendPendingAuth({
      connectedAccountId: 'ca_consented',
      authConfigId: 'ac_x',
      toolkit: 'github',
      userId: 'cody',
      redirectUrl: 'https://z',
    });
    mockListByStatus('INITIALIZING', []);
    mockListByStatus('INITIATED', []);
    mockListByStatus('EXPIRED', []);
    mockListByStatus('FAILED', []);
    mockGetForOrphan(true, 'ACTIVE'); // ca_consented probe -> 200, now ACTIVE

    const result = await gcStaleConnections(30);
    expect(result.orphanedLocal).toEqual(['ca_consented']);
    expect(listPendingAuth()).toHaveLength(0);
  });

  it('syncs resolved pending entries without running the full GC pipeline', async () => {
    await appendPendingAuth({
      connectedAccountId: 'ca_consented_fast',
      authConfigId: 'ac_x',
      toolkit: 'github',
      userId: 'cody',
      redirectUrl: 'https://z',
    });
    mockGetForOrphan(true, 'ACTIVE');

    const result = await syncResolvedPendingAuth();

    expect(result.checked).toEqual(['ca_consented_fast']);
    expect(result.resolvedLocal).toEqual(['ca_consented_fast']);
    expect(listPendingAuth()).toHaveLength(0);
    expect(mockRequest).toHaveBeenCalledTimes(1);
  });

  it('syncs deleted remote pending entries and keeps in-flight ones', async () => {
    await appendPendingAuth({
      connectedAccountId: 'ca_deleted',
      authConfigId: 'ac_x',
      toolkit: 'github',
      userId: 'cody',
      redirectUrl: 'https://deleted',
    });
    await appendPendingAuth({
      connectedAccountId: 'ca_waiting',
      authConfigId: 'ac_x',
      toolkit: 'github',
      userId: 'cody',
      redirectUrl: 'https://waiting',
    });
    mockGetForOrphan(false);
    mockGetForOrphan(true, 'INITIATED');

    const result = await syncResolvedPendingAuth();

    expect(result.checked).toEqual(['ca_deleted', 'ca_waiting']);
    expect(result.resolvedLocal).toEqual(['ca_deleted']);
    expect(listPendingAuth().map((entry) => entry.connectedAccountId)).toEqual(['ca_waiting']);
  });

  it('never queries INACTIVE status — user-paused connections must not be reaped', async () => {
    // INACTIVE in Composio = "paused by user via enable/disable"; deleting
    // it would destroy a credential the operator explicitly kept around.
    // The contract is: gc only fetches INITIALIZING, INITIATED, EXPIRED, FAILED.
    mockListByStatus('INITIALIZING', []);
    mockListByStatus('INITIATED', []);
    mockListByStatus('EXPIRED', []);
    mockListByStatus('FAILED', []);
    await gcStaleConnections(30);
    const calledUrls = mockRequest.mock.calls.map((args) => String(args[0]));
    expect(calledUrls.some((u) => u.includes('statuses=INACTIVE'))).toBe(false);
  });

  it('skips synthetic env-pending entries during orphan probe', async () => {
    await appendPendingAuth({
      connectedAccountId: 'pending-config-env-perplexityai-cody',
      authConfigId: 'ac_x',
      toolkit: 'perplexityai',
      userId: 'cody',
      redirectUrl: 'env://set X',
    });
    mockListByStatus('INITIALIZING', []);
    mockListByStatus('INITIATED', []);
    mockListByStatus('EXPIRED', []);
    mockListByStatus('FAILED', []);
    // No mockGetForOrphan needed — synthetic entries skip the probe.

    const result = await gcStaleConnections(30);
    expect(result.orphanedLocal).toEqual([]);
    expect(listPendingAuth()).toHaveLength(1);
  });
});
