// Integration tests against real Composio. Each test self-cleans up the
// connection it creates AND the local pending-auth entry so successive
// `npm test` runs don't leak `int-...` users into the project inventory.
import { afterEach, describe, expect, it } from 'vitest';
import { request } from 'undici';

const HAS_KEY = Boolean(process.env.COMPOSIO_API_KEY);
const CONNECTED_ACCOUNTS_URL = 'https://backend.composio.dev/api/v3.1/connected_accounts';
const createdConnectionIds = new Set<string>();

afterEach(async () => {
  if (!HAS_KEY) return;
  const apiKey = process.env.COMPOSIO_API_KEY!;
  const { removePendingAuthByConnectedAccountId } = await import('../src/pendingAuthStore.js');
  for (const id of createdConnectionIds) {
    await request(`${CONNECTED_ACCOUNTS_URL}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'x-api-key': apiKey },
    }).catch(() => undefined);
    await removePendingAuthByConnectedAccountId(id);
  }
  createdConnectionIds.clear();
});

describe.skipIf(!HAS_KEY)('integration — orchestrator against real Composio', () => {
  it('ensureAuth with a managed-oauth toolkit returns ACTIVE or PENDING shape', async () => {
    // Disable single-user-mode inheritance for this test — otherwise the
    // test "succeeds" by reusing a real human's connection, and afterEach
    // would then delete that human's connection. We want a clean room.
    const prior = process.env.COMPOSIO_SINGLE_USER_MODE;
    process.env.COMPOSIO_SINGLE_USER_MODE = 'false';
    try {
      const { ensureAuth } = await import('../src/ensureAuth.js');
      const userId = `int-${Date.now()}`;
      const result = await ensureAuth('github', userId);
      // Only track for cleanup if THIS test caused the connection's creation.
      // Inherited connections have userId !== our synthetic int-* user, which
      // means another caller (human dashboard, prior session) owns them.
      const synthetic = result.userId === userId;
      if (synthetic && result.connectedAccountId && !result.connectedAccountId.startsWith('pending-')) {
        createdConnectionIds.add(result.connectedAccountId);
      }
      expect(['ACTIVE', 'PENDING']).toContain(result.status);
      if (result.status === 'PENDING') {
        expect(result.redirectUrl).toMatch(/^https:\/\/(connect|backend)\.composio\.dev\//);
      }
    } finally {
      if (prior === undefined) delete process.env.COMPOSIO_SINGLE_USER_MODE;
      else process.env.COMPOSIO_SINGLE_USER_MODE = prior;
    }
  }, 60_000);

  it('negotiateAuthScheme returns a managed scheme for github', async () => {
    const { negotiateAuthScheme } = await import('../src/authSchemeNegotiator.js');
    const scheme = await negotiateAuthScheme('github');
    expect(['use_composio_managed_auth', 'use_custom_auth']).toContain(scheme.type);
    expect(['OAUTH2', 'BEARER_TOKEN', 'API_KEY']).toContain(scheme.authScheme);
  }, 30_000);
});

if (!HAS_KEY) {
  console.log('[integration] skipped — set COMPOSIO_API_KEY to run');
}
