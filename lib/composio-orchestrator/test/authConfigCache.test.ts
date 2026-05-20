import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

vi.mock('undici', () => ({ request: vi.fn() }));

import { request } from 'undici';
import {
  recordAuthConfig,
  getCachedAuthConfigId,
  listCachedAuthConfigs,
  clearAuthConfigCache,
  pruneStaleAuthConfigs,
} from '../src/authConfigCache.js';

const mockRequest = request as unknown as ReturnType<typeof vi.fn>;
let tempStateDir: string;
let originalStateDir: string | undefined;

beforeEach(() => {
  tempStateDir = mkdtempSync(join(tmpdir(), 'composio-cache-test-'));
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

describe('authConfigCache', () => {
  it('records and reads back an entry by (toolkit, scheme)', async () => {
    await recordAuthConfig({
      toolkitSlug: 'github', authScheme: 'OAUTH2', type: 'use_composio_managed_auth', authConfigId: 'ac_1',
    });
    expect(getCachedAuthConfigId('github', 'OAUTH2')).toBe('ac_1');
    expect(getCachedAuthConfigId('slack', 'OAUTH2')).toBeUndefined();
  });

  it('clearAuthConfigCache wipes everything', async () => {
    await recordAuthConfig({
      toolkitSlug: 'github', authScheme: 'OAUTH2', type: 'use_composio_managed_auth', authConfigId: 'ac_x',
    });
    expect(listCachedAuthConfigs()).toHaveLength(1);
    const result = await clearAuthConfigCache();
    expect(result.cleared).toBe(1);
    expect(listCachedAuthConfigs()).toHaveLength(0);
  });

  it('pruneStaleAuthConfigs drops 404 entries and keeps live ones', async () => {
    await recordAuthConfig({ toolkitSlug: 'github', authScheme: 'OAUTH2', type: 'use_composio_managed_auth', authConfigId: 'ac_alive' });
    await recordAuthConfig({ toolkitSlug: 'slack', authScheme: 'OAUTH2', type: 'use_composio_managed_auth', authConfigId: 'ac_dead' });
    mockRequest
      .mockResolvedValueOnce({ statusCode: 200, body: { dump: async () => undefined } })
      .mockResolvedValueOnce({ statusCode: 404, body: { dump: async () => undefined } });
    const result = await pruneStaleAuthConfigs();
    expect(result.checked).toBe(2);
    expect(result.pruned).toEqual(['ac_dead']);
    const remaining = listCachedAuthConfigs().map((c) => c.authConfigId);
    expect(remaining).toEqual(['ac_alive']);
  });
});
