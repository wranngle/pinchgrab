// Behavior coverage for ensureAuth — all paths through the cascade:
//   - already-ACTIVE pending cleanup
//   - managed-OAuth via link()
//   - custom-auth via initiate() (link rejects inline credentials)
//   - null/missing redirectUrl from link() → throws cleanly
//   - single-user-mode cross-user inheritance (default warn, strict isolate)
//   - multi-account tie-break: alias > recency > lexicographic id
//   - refresh()-first for existing INITIATED → fallthrough to link() when stale
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const mocks = vi.hoisted(() => ({
  composio: {
    authConfigs: { create: vi.fn() },
    connectedAccounts: { list: vi.fn(), initiate: vi.fn(), link: vi.fn() },
  },
  negotiateAuthScheme: vi.fn(),
  smokeProbeUpstreamCredential: vi.fn(),
  deleteRemoteConnectedAccount: vi.fn(),
  fetchRealUserIdForConnection: vi.fn(),
}));

vi.mock('@composio/core', () => ({ Composio: vi.fn(function Composio() { return mocks.composio; }) }));
vi.mock('../src/authSchemeNegotiator.js', () => ({ negotiateAuthScheme: mocks.negotiateAuthScheme }));
vi.mock('../src/upstreamCredentialSmoke.js', () => ({
  smokeProbeUpstreamCredential: mocks.smokeProbeUpstreamCredential,
  deleteRemoteConnectedAccount: mocks.deleteRemoteConnectedAccount,
  fetchRealUserIdForConnection: mocks.fetchRealUserIdForConnection,
}));

import { resetComposioClient } from '../src/composioClient.js';
import { ensureAuth } from '../src/ensureAuth.js';
import { appendPendingAuth, listPendingAuth } from '../src/pendingAuthStore.js';

const TRACKED_ENV = [
  'COMPOSIO_ORCH_STATE_DIR',
  'COMPOSIO_API_KEY',
  'COMPOSIO_SINGLE_USER_MODE',
  'COMPOSIO_DISABLE_SMOKE_PROBE',
  'COMPOSIO_REQUIRE_SMOKE_PROBE',
  'COMPOSIO_STRICT_USER_ISOLATION',
  'COMPOSIO_GITHUB_PREFERRED_ALIAS',
] as const;

let tempStateDir: string;
const originalEnv: Record<string, string | undefined> = {};

beforeEach(() => {
  tempStateDir = mkdtempSync(join(tmpdir(), 'composio-ensure-test-'));
  for (const key of TRACKED_ENV) originalEnv[key] = process.env[key];
  process.env.COMPOSIO_ORCH_STATE_DIR = tempStateDir;
  process.env.COMPOSIO_API_KEY = 'test-key';
  process.env.COMPOSIO_SINGLE_USER_MODE = 'false';
  resetComposioClient();
  vi.clearAllMocks();
  mocks.negotiateAuthScheme.mockResolvedValue({
    toolkitSlug: 'github',
    authScheme: 'OAUTH2',
    type: 'use_composio_managed_auth',
    authConfigCreationFields: [],
    connectedAccountInitiationFields: [],
  });
  mocks.composio.authConfigs.create.mockResolvedValue({ id: 'ac_x' });
  mocks.composio.connectedAccounts.list.mockResolvedValue({ items: [{ id: 'ca_active', status: 'ACTIVE' }] });
});

afterEach(() => {
  resetComposioClient();
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  rmSync(tempStateDir, { recursive: true, force: true });
});

// ────────────────────────────────────────────────────────────────────────────
// Pending resolution
// ────────────────────────────────────────────────────────────────────────────
describe('ensureAuth: clears stale pending entries when ACTIVE', () => {
  it('removes only the matching toolkit/user pair', async () => {
    await appendPendingAuth({
      connectedAccountId: 'ca_pending',
      authConfigId: 'ac_x',
      toolkit: 'github',
      userId: 'cody',
      redirectUrl: 'https://backend.composio.dev/api/v3/s/example',
    });
    await appendPendingAuth({
      connectedAccountId: 'ca_other_user',
      authConfigId: 'ac_x',
      toolkit: 'github',
      userId: 'other',
      redirectUrl: 'https://backend.composio.dev/api/v3/s/other',
    });

    const result = await ensureAuth('github', 'cody');

    expect(result).toMatchObject({ status: 'ACTIVE', connectedAccountId: 'ca_active', userId: 'cody' });
    expect(listPendingAuth().map((entry) => entry.connectedAccountId)).toEqual(['ca_other_user']);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// link() vs initiate() routing
// ────────────────────────────────────────────────────────────────────────────
describe('ensureAuth: managed-OAuth uses link() not initiate()', () => {
  it('routes use_composio_managed_auth schemes through connectedAccounts.link', async () => {
    mocks.composio.connectedAccounts.list.mockResolvedValue({ items: [] });
    mocks.composio.connectedAccounts.link.mockResolvedValue({
      id: 'ca_new',
      redirectUrl: 'https://backend.composio.dev/api/v3/s/managed-link',
    });

    const result = await ensureAuth('github', 'cody');

    expect(mocks.composio.connectedAccounts.link).toHaveBeenCalledTimes(1);
    expect(mocks.composio.connectedAccounts.link).toHaveBeenCalledWith('cody', 'ac_x', { allowMultiple: true });
    expect(mocks.composio.connectedAccounts.initiate).not.toHaveBeenCalled();
    expect(result).toMatchObject({ status: 'PENDING', connectedAccountId: expect.any(String) });
  });

  it('keeps use_custom_auth schemes on initiate() because link() rejects inline credentials', async () => {
    mocks.negotiateAuthScheme.mockResolvedValue({
      toolkitSlug: 'clay',
      authScheme: 'API_KEY',
      type: 'use_custom_auth',
      authConfigCreationFields: [],
      connectedAccountInitiationFields: ['api_key'],
    });
    mocks.composio.authConfigs.create.mockResolvedValue({ id: 'ac_clay' });
    mocks.composio.connectedAccounts.list.mockResolvedValue({ items: [] });
    mocks.composio.connectedAccounts.initiate.mockResolvedValue({ id: 'ca_clay', redirectUrl: null });
    mocks.smokeProbeUpstreamCredential.mockResolvedValue({ ok: true, skipped: false });
    process.env.COMPOSIO_CLAY_API_KEY = 'fake-key';

    const result = await ensureAuth('clay', 'cody');

    expect(mocks.composio.connectedAccounts.initiate).toHaveBeenCalledTimes(1);
    expect(mocks.composio.connectedAccounts.link).not.toHaveBeenCalled();
    expect(result).toMatchObject({ status: 'ACTIVE', connectedAccountId: 'ca_clay' });

    delete process.env.COMPOSIO_CLAY_API_KEY;
  });
});

// ────────────────────────────────────────────────────────────────────────────
// link() result shape: null/missing redirectUrl must throw — never crash
// silently or return a PENDING with no consent URL.
// ────────────────────────────────────────────────────────────────────────────
describe('ensureAuth: link() must return a redirect URL', () => {
  it('throws when link() returns redirectUrl=null', async () => {
    mocks.composio.connectedAccounts.list.mockResolvedValue({ items: [] });
    mocks.composio.connectedAccounts.link.mockResolvedValue({ id: 'ca_dead', redirectUrl: null });
    await expect(ensureAuth('github', 'cody')).rejects.toThrow(/redirectUrl/);
  });

  it('throws when link() omits redirectUrl entirely', async () => {
    mocks.negotiateAuthScheme.mockResolvedValue({
      toolkitSlug: 'slack', authScheme: 'OAUTH2', type: 'use_composio_managed_auth',
      authConfigCreationFields: [], connectedAccountInitiationFields: [],
    });
    mocks.composio.authConfigs.create.mockResolvedValue({ id: 'ac_slack' });
    mocks.composio.connectedAccounts.list.mockResolvedValue({ items: [] });
    mocks.composio.connectedAccounts.link.mockResolvedValue({ id: 'ca_dead2' });
    await expect(ensureAuth('slack', 'cody')).rejects.toThrow(/redirectUrl/);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Single-user-mode cross-user inheritance: default warns, strict refuses.
// ────────────────────────────────────────────────────────────────────────────
describe('ensureAuth: single-user-mode cross-user isolation', () => {
  it('strict mode falls through to fresh link() when only another user has an ACTIVE connection', async () => {
    process.env.COMPOSIO_SINGLE_USER_MODE = 'true';
    process.env.COMPOSIO_STRICT_USER_ISOLATION = 'true';
    process.env.COMPOSIO_DISABLE_SMOKE_PROBE = 'true';
    mocks.composio.connectedAccounts.list.mockImplementation(async (q: Record<string, unknown>) => {
      const userIds = (q.userIds as string[] | undefined) ?? [];
      if (userIds.includes('bob')) return { items: [] };
      return { items: [{ id: 'ca_alice_github', status: 'ACTIVE', user_id: 'alice', toolkit: { slug: 'github' }, auth_config: { id: 'ac_x' } }] };
    });
    mocks.composio.authConfigs.create.mockResolvedValue({ id: 'ac_new' });
    mocks.composio.connectedAccounts.link.mockResolvedValue({ id: 'ca_bob_new', redirectUrl: 'https://composio/connect' });

    const result = await ensureAuth('github', 'bob');
    expect(result.status).toBe('PENDING');
    if (result.status === 'PENDING') expect(result.userId).toBe('bob');
    expect(mocks.composio.connectedAccounts.link).toHaveBeenCalled();
  });

  it('non-strict default still inherits cross-user (audit-trail emitted via log)', async () => {
    process.env.COMPOSIO_SINGLE_USER_MODE = 'true';
    delete process.env.COMPOSIO_STRICT_USER_ISOLATION;
    process.env.COMPOSIO_DISABLE_SMOKE_PROBE = 'true';
    mocks.composio.connectedAccounts.list.mockResolvedValue({
      items: [{ id: 'ca_alice_github', status: 'ACTIVE', user_id: 'alice', toolkit: { slug: 'github' }, auth_config: { id: 'ac_x' } }],
    });
    const result = await ensureAuth('github', 'bob');
    expect(result.status).toBe('ACTIVE');
    if (result.status === 'ACTIVE') expect(result.userId).toBe('alice');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Multi-account tie-break: alias preference > recency > lexicographic id.
// ────────────────────────────────────────────────────────────────────────────
describe('ensureAuth: deterministic multi-account selection', () => {
  beforeEach(() => {
    process.env.COMPOSIO_DISABLE_SMOKE_PROBE = 'true';
    mocks.composio.authConfigs.create.mockResolvedValue({ id: 'ac_gh' });
  });

  it('picks the most-recent created_at when no alias preference set', async () => {
    mocks.composio.connectedAccounts.list.mockResolvedValue({
      items: [
        { id: 'ca_old',    status: 'ACTIVE', created_at: '2026-01-01T00:00:00Z' },
        { id: 'ca_newest', status: 'ACTIVE', created_at: '2026-05-12T00:00:00Z' },
        { id: 'ca_middle', status: 'ACTIVE', created_at: '2026-03-01T00:00:00Z' },
      ],
    });
    const result = await ensureAuth('github', 'cody');
    expect(result.connectedAccountId).toBe('ca_newest');
  });

  it('picks the alias matching COMPOSIO_<TOOLKIT>_PREFERRED_ALIAS even when older', async () => {
    process.env.COMPOSIO_GITHUB_PREFERRED_ALIAS = 'work';
    mocks.composio.connectedAccounts.list.mockResolvedValue({
      items: [
        { id: 'ca_personal_new', status: 'ACTIVE', alias: 'personal', created_at: '2026-05-12T00:00:00Z' },
        { id: 'ca_work_old',     status: 'ACTIVE', alias: 'work',     created_at: '2026-01-01T00:00:00Z' },
      ],
    });
    const result = await ensureAuth('github', 'cody');
    expect(result.connectedAccountId).toBe('ca_work_old');
  });

  it('falls back to lexicographically smallest id when neither alias nor created_at differ', async () => {
    mocks.composio.connectedAccounts.list.mockResolvedValue({
      items: [
        { id: 'ca_z', status: 'ACTIVE' },
        { id: 'ca_a', status: 'ACTIVE' },
        { id: 'ca_m', status: 'ACTIVE' },
      ],
    });
    const result = await ensureAuth('github', 'cody');
    expect(result.connectedAccountId).toBe('ca_a');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Orphan accumulation: re-use existing INITIATED via refresh(); only link()
// when refresh() returns no redirect_url. Stops "8th time auth'ing github"
// from minting a new pending connection on every retry.
// ────────────────────────────────────────────────────────────────────────────
describe('ensureAuth: re-uses existing INITIATED via refresh()', () => {
  it('refreshes existing INITIATED and never calls link()', async () => {
    mocks.composio.connectedAccounts.list.mockImplementation(async (q: Record<string, unknown>) => {
      const statuses = (q.statuses as string[] | undefined) ?? [];
      if (statuses.includes('ACTIVE')) return { items: [] };
      if (statuses.includes('INITIATED')) return { items: [{ id: 'ca_existing_pending', status: 'INITIATED', created_at: '2026-05-13T05:00:00Z' }] };
      return { items: [] };
    });
    (mocks.composio.connectedAccounts as { refresh?: ReturnType<typeof vi.fn> }).refresh = vi.fn().mockResolvedValue({
      id: 'ca_existing_pending',
      redirect_url: 'https://connect.composio.dev/link/lk_refreshed',
      status: 'INITIATED',
    });
    const result = await ensureAuth('github', 'cody');
    expect(result.status).toBe('PENDING');
    expect(result.connectedAccountId).toBe('ca_existing_pending');
    if (result.status === 'PENDING') expect(result.redirectUrl).toBe('https://connect.composio.dev/link/lk_refreshed');
    expect(mocks.composio.connectedAccounts.link).not.toHaveBeenCalled();
    expect((mocks.composio.connectedAccounts as { refresh?: ReturnType<typeof vi.fn> }).refresh).toHaveBeenCalledWith('ca_existing_pending');
  });

  it('falls back to link() when refresh() returns no redirect_url', async () => {
    mocks.composio.connectedAccounts.list.mockImplementation(async (q: Record<string, unknown>) => {
      const statuses = (q.statuses as string[] | undefined) ?? [];
      if (statuses.includes('INITIATED')) return { items: [{ id: 'ca_dead_pending', status: 'INITIATED' }] };
      return { items: [] };
    });
    (mocks.composio.connectedAccounts as { refresh?: ReturnType<typeof vi.fn> }).refresh = vi.fn().mockResolvedValue({
      id: 'ca_dead_pending',
      redirect_url: null,
      status: 'FAILED',
    });
    mocks.composio.connectedAccounts.link.mockResolvedValue({ id: 'ca_fresh', redirectUrl: 'https://connect.composio.dev/link/lk_fresh' });
    const result = await ensureAuth('github', 'cody');
    expect(result.connectedAccountId).toBe('ca_fresh');
    expect(mocks.composio.connectedAccounts.link).toHaveBeenCalled();
  });
});
