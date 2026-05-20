// ensureAuth handles the full 4-cell auth matrix:
//   (managed | custom) x (OAuth2/OAuth1 | API_KEY/BEARER_TOKEN/BASIC)
//
// Returns ACTIVE immediately if the user already has a connected account, or
// PENDING with a redirectUrl (real OAuth URL OR `env://` instruction) when
// human action is needed. Never blocks waiting for OAuth — the surfacing hook
// + webhook receiver close the loop asynchronously.
import { getComposioClient, readEnvVar } from './composioClient.js';
import { negotiateAuthScheme } from './authSchemeNegotiator.js';
import type { AuthScheme, NegotiatedScheme } from './authSchemeNegotiator.js';
import { getCachedAuthConfigId, recordAuthConfig } from './authConfigCache.js';
import { appendPendingAuth, removePendingAuthForResolvedConnection } from './pendingAuthStore.js';
import { lookupRequiredCredentialsFromEnv, preferredEnvVarNameForHint } from './credentialEnvLoader.js';
import { smokeProbeUpstreamCredential, deleteRemoteConnectedAccount, fetchRealUserIdForConnection } from './upstreamCredentialSmoke.js';
import { ComposioOrchError } from './errors.js';
import { logInfo, logWarn } from './logging.js';

export type EnsureAuthResult =
  // `userId` is the upstream user_id Composio actually holds for the connection.
  // For inherited connections this can differ from the caller's userId, and
  // tool-execute requires the OWNING user_id alongside connected_account_id
  // (otherwise Composio returns ConnectedAccountEntityIdMismatch / code 1812).
  // External callers using the raw connectedAccountId should always pass back
  // this `userId`, not their own — runWithToolkit handles this internally.
  | { status: 'ACTIVE'; connectedAccountId: string; authConfigId: string; userId: string }
  | { status: 'PENDING'; connectedAccountId: string; authConfigId: string; redirectUrl: string; userId: string };

// Resolved at call time so changes to ~/.agents/.env take effect without restart.
function resolveDefaultUserId(): string {
  return readEnvVar('COMPOSIO_DEFAULT_USER') ?? 'cody';
}

interface ConnectedAccountListItem {
  id: string;
  status: string;
}

function isRedirectScheme(scheme: AuthScheme): boolean {
  return scheme === 'OAUTH2' || scheme === 'OAUTH1';
}

function isNoAuthScheme(scheme: AuthScheme): boolean {
  return scheme === 'NO_AUTH';
}

function buildEnvInstructionUrl(missing: string[]): string {
  return `env://set ${missing.join(',')} in ~/.agents/.env then run composio-orch reload-key`;
}

async function clearPendingForActiveConnection(args: {
  toolkit: string;
  connectedAccountId?: string;
  userIds: string[];
}): Promise<void> {
  await removePendingAuthForResolvedConnection(args);
}

// Deterministic tie-break across multiple ACTIVE connections: prefer the
// alias matching $COMPOSIO_<TOOLKIT>_PREFERRED_ALIAS, then the most-recent
// `created_at`, then the lexicographically-smallest id. Avoids silent
// rotation of "which identity all agents talk as" when Composio reorders.
interface ConnectedAccountWithMeta extends ConnectedAccountListItem {
  alias?: string;
  created_at?: string;
  createdAt?: string;
  toolkit?: { slug?: string };
}

function pickPreferredActive(
  items: ConnectedAccountWithMeta[],
  toolkit?: string,
): ConnectedAccountWithMeta | undefined {
  if (items.length === 0) return undefined;
  if (items.length === 1) return items[0];
  const aliasEnv = toolkit ? `COMPOSIO_${toolkit.toUpperCase()}_PREFERRED_ALIAS` : '';
  const preferredAlias = aliasEnv ? readEnvVar(aliasEnv) : undefined;
  return [...items].sort((a, b) => {
    const aMatchesAlias = preferredAlias && a.alias === preferredAlias ? 0 : 1;
    const bMatchesAlias = preferredAlias && b.alias === preferredAlias ? 0 : 1;
    if (aMatchesAlias !== bMatchesAlias) return aMatchesAlias - bMatchesAlias;
    const aCreated = a.created_at ?? a.createdAt ?? '';
    const bCreated = b.created_at ?? b.createdAt ?? '';
    if (aCreated !== bCreated) return aCreated < bCreated ? 1 : -1;
    return a.id < b.id ? -1 : 1;
  })[0];
}

async function findInitiatedConnectedAccount(userId: string, authConfigId: string): Promise<ConnectedAccountListItem | undefined> {
  const composio = getComposioClient();
  const result = await composio.connectedAccounts.list({
    userIds: [userId],
    authConfigIds: [authConfigId],
    statuses: ['INITIATED', 'INITIALIZING'],
  } as never);
  const items = (result as { items?: ConnectedAccountListItem[] }).items ?? [];
  // Prefer the most-recently-created pending connection.
  return items.length === 0 ? undefined : [...items as ConnectedAccountWithMeta[]].sort((a, b) => {
    const at = a.created_at ?? a.createdAt ?? ''; const bt = b.created_at ?? b.createdAt ?? '';
    return at < bt ? 1 : at > bt ? -1 : 0;
  })[0];
}

async function findActiveConnectedAccount(userId: string, authConfigId: string, toolkit?: string): Promise<ConnectedAccountListItem | undefined> {
  const composio = getComposioClient();
  const result = await composio.connectedAccounts.list({
    userIds: [userId],
    authConfigIds: [authConfigId],
    statuses: ['ACTIVE'],
  });
  const items = (result as { items?: ConnectedAccountWithMeta[] }).items ?? [];
  return pickPreferredActive(items, toolkit);
}

interface RemoteConnectedAccountFull {
  id: string;
  status: string;
  user_id?: string;
  userId?: string;
  toolkit?: { slug?: string };
  auth_config?: { id?: string };
  authConfig?: { id?: string };
}

// In single-user mode (COMPOSIO_SINGLE_USER_MODE !== 'false'), the orchestrator
// will claim ANY existing ACTIVE connection for this toolkit — regardless of
// user_id or auth_config_id. This makes dashboard-clicked connections (which
// Composio assigns random user_ids to) invisible-but-usable to ensureAuth.
async function findAnyActiveConnectionForToolkit(toolkitSlug: string): Promise<RemoteConnectedAccountFull | undefined> {
  const composio = getComposioClient();
  const result = await composio.connectedAccounts.list({
    toolkitSlugs: [toolkitSlug],
    statuses: ['ACTIVE'],
    limit: 50,
  } as never);
  const items = (result as { items?: RemoteConnectedAccountFull[] }).items ?? [];
  return pickPreferredActive(items as ConnectedAccountWithMeta[], toolkitSlug) as RemoteConnectedAccountFull | undefined;
}

function isSingleUserMode(): boolean {
  return readEnvVar('COMPOSIO_SINGLE_USER_MODE') !== 'false';
}

interface EnsureAuthConfigResult {
  status: 'READY';
  authConfigId: string;
}

interface EnsureAuthConfigPending {
  status: 'PENDING_ENV';
  missingEnvVarNames: string[];
}

async function ensureAuthConfig(scheme: NegotiatedScheme): Promise<EnsureAuthConfigResult | EnsureAuthConfigPending> {
  const cached = getCachedAuthConfigId(scheme.toolkitSlug, scheme.authScheme);
  if (cached) return { status: 'READY', authConfigId: cached };

  const composio = getComposioClient();
  let credentials: Record<string, string> = {};

  if (scheme.type === 'use_custom_auth' && scheme.authConfigCreationFields.length > 0) {
    const lookup = lookupRequiredCredentialsFromEnv({
      toolkitSlug: scheme.toolkitSlug,
      requiredFieldNames: scheme.authConfigCreationFields,
    });
    if (lookup.missingEnvVarNames.length > 0) {
      return { status: 'PENDING_ENV', missingEnvVarNames: lookup.missingEnvVarNames };
    }
    credentials = lookup.resolved;
  }

  const created = await composio.authConfigs.create(scheme.toolkitSlug, {
    name: `${scheme.toolkitSlug}:${scheme.authScheme}:${scheme.type}`,
    type: scheme.type,
    ...(scheme.type === 'use_custom_auth' ? { authScheme: scheme.authScheme, credentials } : {}),
  } as never);
  await recordAuthConfig({
    toolkitSlug: scheme.toolkitSlug,
    authScheme: scheme.authScheme,
    type: scheme.type,
    authConfigId: created.id,
  });
  return { status: 'READY', authConfigId: created.id };
}

export async function ensureAuth(toolkit: string, userId?: string): Promise<EnsureAuthResult> {
  const resolvedUserId = userId ?? resolveDefaultUserId();
  const composio = getComposioClient();

  // Single-user mode short-circuit: if ANY ACTIVE connection exists for this
  // toolkit (e.g. created via the Composio dashboard with a random user_id),
  // claim it. Avoids forcing a redundant OAuth flow when the user already
  // pre-authed in the dashboard. Also handles NO_AUTH-style toolkits trivially.
  if (isSingleUserMode()) {
    const inherited = await findAnyActiveConnectionForToolkit(toolkit);
    if (inherited) {
      // SDK list responses sometimes strip user_id, but the GET endpoint
      // for the specific connectedAccount always carries it. Resolve it
      // explicitly so callers (and the inherit log) get a real user_id —
      // otherwise downstream tool-execute hits 1812 EntityIdMismatch when
      // the caller pairs `connected_account_id` with their own `user_id`.
      let inheritedUserId = inherited.user_id ?? inherited.userId;
      if (!inheritedUserId) {
        inheritedUserId = await fetchRealUserIdForConnection(inherited.id);
      }
      const resolvedInheritedUserId = inheritedUserId ?? '(unknown)';
      const inheritedAuthConfigId = inherited.auth_config?.id ?? inherited.authConfig?.id ?? 'unknown';

      // Cross-user inheritance: the connection belongs to someone other than
      // the caller. Default behavior keeps inheriting (matches existing
      // dashboard-then-CLI flow), but logs at WARN so it's never silent.
      // Set COMPOSIO_STRICT_USER_ISOLATION=true to refuse cross-user inherit.
      const crossUser = resolvedInheritedUserId !== '(unknown)' && resolvedInheritedUserId !== resolvedUserId;
      if (crossUser && readEnvVar('COMPOSIO_STRICT_USER_ISOLATION') === 'true') {
        logWarn('composio.auth.inherit-refused-strict', `${toolkit}: refusing cross-user inherit (${resolvedUserId} ≠ ${resolvedInheritedUserId})`);
        // Fall through to fresh ensure path; do NOT return here.
      } else {
        // Smoke-probe inherited connections too — they may be stale.
        if (readEnvVar('COMPOSIO_DISABLE_SMOKE_PROBE') !== 'true') {
          const smoke = await smokeProbeUpstreamCredential({
            toolkitSlug: toolkit,
            userId: inheritedUserId,
            connectedAccountId: inherited.id,
          });
          if (!smoke.ok) {
            await deleteRemoteConnectedAccount(inherited.id);
            logWarn('composio.auth.inherited-smoke-rejected', `${toolkit} inherited cred rejected; deleting and continuing to fresh negotiation`);
            // Fall through to fresh ensure path; do NOT return here.
          } else {
            const labels = { toolkit, userId: resolvedUserId, inheritedFromUserId: resolvedInheritedUserId, connectedAccountId: inherited.id, smoke: smoke.skipped ? 'skipped' : 'ok' };
            if (crossUser) {
              logWarn('composio.auth.inherited-cross-user', `${toolkit}: claiming connection owned by ${resolvedInheritedUserId} on behalf of ${resolvedUserId}`, labels);
            } else {
              logInfo('composio.auth.inherited', labels);
            }
            await clearPendingForActiveConnection({
              toolkit,
              connectedAccountId: inherited.id,
              userIds: [resolvedUserId, resolvedInheritedUserId],
            });
            return { status: 'ACTIVE', connectedAccountId: inherited.id, authConfigId: inheritedAuthConfigId, userId: resolvedInheritedUserId };
          }
        } else {
          const labels = { toolkit, userId: resolvedUserId, inheritedFromUserId: resolvedInheritedUserId, connectedAccountId: inherited.id };
          if (crossUser) {
            logWarn('composio.auth.inherited-cross-user', `${toolkit}: claiming connection owned by ${resolvedInheritedUserId} on behalf of ${resolvedUserId}`, labels);
          } else {
            logInfo('composio.auth.inherited', labels);
          }
          await clearPendingForActiveConnection({
            toolkit,
            connectedAccountId: inherited.id,
            userIds: [resolvedUserId, resolvedInheritedUserId],
          });
          return { status: 'ACTIVE', connectedAccountId: inherited.id, authConfigId: inheritedAuthConfigId, userId: resolvedInheritedUserId };
        }
      }
    }
  }

  const scheme = await negotiateAuthScheme(toolkit);

  // NO_AUTH toolkits need no connection at all; return ACTIVE synthetic.
  if (isNoAuthScheme(scheme.authScheme)) {
    logInfo('composio.auth.no-auth', { toolkit, userId: resolvedUserId });
    await clearPendingForActiveConnection({ toolkit, connectedAccountId: `noauth-${toolkit}`, userIds: [resolvedUserId] });
    return { status: 'ACTIVE', connectedAccountId: `noauth-${toolkit}`, authConfigId: 'noauth', userId: resolvedUserId };
  }

  const configResult = await ensureAuthConfig(scheme);
  if (configResult.status === 'PENDING_ENV') {
    const pending = await appendPendingAuth({
      connectedAccountId: `pending-config-env-${toolkit}-${resolvedUserId}`,
      authConfigId: 'unset',
      toolkit,
      userId: resolvedUserId,
      redirectUrl: buildEnvInstructionUrl(configResult.missingEnvVarNames),
    });
    logInfo('composio.auth.pending-config-env', { toolkit, userId: resolvedUserId, missing: configResult.missingEnvVarNames.join(',') });
    return { status: 'PENDING', connectedAccountId: pending.connectedAccountId, authConfigId: 'unset', redirectUrl: pending.redirectUrl, userId: resolvedUserId };
  }
  const authConfigId = configResult.authConfigId;

  const existingActive = await findActiveConnectedAccount(resolvedUserId, authConfigId, toolkit);
  if (existingActive) {
    logInfo('composio.auth.active', { toolkit, userId: resolvedUserId, connectedAccountId: existingActive.id });
    await clearPendingForActiveConnection({ toolkit, connectedAccountId: existingActive.id, userIds: [resolvedUserId] });
    return { status: 'ACTIVE', connectedAccountId: existingActive.id, authConfigId, userId: resolvedUserId };
  }

  const redirectFlow = isRedirectScheme(scheme.authScheme);

  // Re-use existing INITIATED/INITIALIZING connection if present: call
  // refresh() to mint a fresh redirectUrl on the SAME ConnectedAccount
  // instead of creating yet another orphan PENDING. This is the canonical
  // fix for "I authed this toolkit 8 times" — every retry stays on one
  // connection record.
  if (redirectFlow) {
    const existingPending = await findInitiatedConnectedAccount(resolvedUserId, authConfigId);
    if (existingPending) {
      try {
        const refreshed = await (composio as unknown as {
          connectedAccounts: { refresh: (id: string, opts?: { redirectUrl?: string; validateCredentials?: boolean }) => Promise<{ id: string; redirect_url?: string | null; redirectUrl?: string | null; status?: string }> };
        }).connectedAccounts.refresh(existingPending.id);
        const refreshedUrl = refreshed.redirect_url ?? refreshed.redirectUrl ?? null;
        if (refreshedUrl) {
          const pending = await appendPendingAuth({ connectedAccountId: existingPending.id, authConfigId, toolkit, userId: resolvedUserId, redirectUrl: refreshedUrl });
          logInfo('composio.auth.refreshed', { toolkit, userId: resolvedUserId, connectedAccountId: existingPending.id });
          return { status: 'PENDING', connectedAccountId: pending.connectedAccountId, authConfigId, redirectUrl: refreshedUrl, userId: resolvedUserId };
        }
        logWarn('composio.auth.refresh-no-url', `${toolkit}: refresh() returned no redirect_url for ${existingPending.id}; falling through to fresh link()`);
      } catch (err) {
        logWarn('composio.auth.refresh-failed', `${toolkit}: refresh() threw for ${existingPending.id}: ${(err as Error).message}; falling through to fresh link()`);
      }
    }
  }

  let initiateOptions: Record<string, unknown> = { allowMultiple: true };

  if (!redirectFlow) {
    if (scheme.connectedAccountInitiationFields.length > 0) {
      const lookup = lookupRequiredCredentialsFromEnv({
        toolkitSlug: toolkit,
        requiredFieldNames: scheme.connectedAccountInitiationFields,
      });
      if (lookup.missingEnvVarNames.length > 0) {
        const pending = await appendPendingAuth({
          connectedAccountId: `pending-initiate-env-${toolkit}-${resolvedUserId}`,
          authConfigId,
          toolkit,
          userId: resolvedUserId,
          redirectUrl: buildEnvInstructionUrl(lookup.missingEnvVarNames),
        });
        logInfo('composio.auth.pending-initiate-env', { toolkit, userId: resolvedUserId, missing: lookup.missingEnvVarNames.join(',') });
        return { status: 'PENDING', connectedAccountId: pending.connectedAccountId, authConfigId, redirectUrl: pending.redirectUrl, userId: resolvedUserId };
      }
      initiateOptions = {
        ...initiateOptions,
        config: { authScheme: scheme.authScheme, val: { status: 'ACTIVE', ...lookup.resolved } },
      };
    }
  }

  // Managed OAuth must use link() — initiate() is removed for new orgs as of
  // 2026-05-08 and all orgs 2026-07-03. Custom-auth stays on initiate() because
  // link() doesn't accept the `config: { authScheme, val }` override required to
  // pass inline API_KEY/BEARER_TOKEN/BASIC credentials.
  const initiation = scheme.type === 'use_composio_managed_auth'
    ? await composio.connectedAccounts.link(resolvedUserId, authConfigId, { allowMultiple: true })
    : await composio.connectedAccounts.initiate(resolvedUserId, authConfigId, initiateOptions as never);
  const redirectUrl = (initiation as { redirectUrl?: string | null }).redirectUrl ?? null;
  const connectedAccountId = (initiation as { id: string }).id;

  if (redirectFlow) {
    if (!redirectUrl) {
      throw new ComposioOrchError('UPSTREAM', `Composio did not return a redirectUrl for toolkit "${toolkit}"`);
    }
    const pending = await appendPendingAuth({ connectedAccountId, authConfigId, toolkit, userId: resolvedUserId, redirectUrl });
    logInfo('composio.auth.pending', { toolkit, userId: resolvedUserId, connectedAccountId: pending.connectedAccountId });
    return { status: 'PENDING', connectedAccountId: pending.connectedAccountId, authConfigId, redirectUrl, userId: resolvedUserId };
  }

  logInfo('composio.auth.injected', { toolkit, userId: resolvedUserId, connectedAccountId });

  // Smoke-probe the upstream credential. If the provider rejects it, the
  // ACTIVE in Composio is misleading — demote to PENDING-env with a clear
  // hint pointing the user at the canonical env var to fix.
  if (readEnvVar('COMPOSIO_DISABLE_SMOKE_PROBE') !== 'true') {
    const smoke = await smokeProbeUpstreamCredential({ toolkitSlug: toolkit, userId: resolvedUserId, connectedAccountId });
    if (!smoke.ok) {
      await deleteRemoteConnectedAccount(connectedAccountId);
      const fields = scheme.connectedAccountInitiationFields.length > 0
        ? scheme.connectedAccountInitiationFields
        : scheme.authConfigCreationFields;
      // Prefer the env var name the user has actually set (via aliases) so the
      // "refresh X" hint matches the line they already wrote in ~/.agents/.env,
      // not the literal Composio field name they may never have used.
      const envVarHints = fields.map((f) => preferredEnvVarNameForHint(toolkit, f));
      const hint = `upstream rejected credential (${smoke.rejection?.statusCode ?? '?'}): ${smoke.rejection?.message ?? 'unknown'}; refresh ${envVarHints.join(',')} in ~/.agents/.env`;
      const pending = await appendPendingAuth({
        connectedAccountId: `pending-bad-cred-${toolkit}-${resolvedUserId}`,
        authConfigId,
        toolkit,
        userId: resolvedUserId,
        redirectUrl: `env://${hint}`,
      });
      logWarn('composio.auth.smoke-rejected', `${toolkit} upstream rejected; demoted to PENDING`);
      return { status: 'PENDING', connectedAccountId: pending.connectedAccountId, authConfigId, redirectUrl: pending.redirectUrl, userId: resolvedUserId };
    }
  }

  await clearPendingForActiveConnection({ toolkit, connectedAccountId, userIds: [resolvedUserId] });
  return { status: 'ACTIVE', connectedAccountId, authConfigId, userId: resolvedUserId };
}
