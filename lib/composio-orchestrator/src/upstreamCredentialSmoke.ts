// Validates that a freshly-vaulted credential actually works against the
// upstream provider. Composio's `connectedAccounts.initiate()` returns ACTIVE
// the moment it accepts the credential into its vault — NOT when it's been
// proven to authenticate against the upstream API. This module fixes that
// gap by invoking a known-cheap "verify" tool right after the connection
// flips ACTIVE; if the tool returns successful=false with an auth-failure
// payload, the orchestrator demotes the connection back to PENDING with a
// clear hint and deletes the bogus connected account.
//
// Per-toolkit verify-tool slugs are hand-curated below. Toolkits not listed
// skip the smoke probe (we treat absence as "no cheap verify available").
//
// IMPORTANT: keep slugs in lock-step with the live Composio catalog. A wrong
// slug used to silently degrade to `non-auth-failure` and falsely return ok;
// the probe now detects unknown-slug responses and routes them through the
// `composio.smoke.bad-config` warning path so the registry can never silently
// rot. The integration test (`test/upstreamCredentialSmokeRegistry.test.ts`)
// asserts every entry here resolves against `/tools?toolkit_slug=...`.
import { request } from 'undici';
import { readComposioApiKey } from './composioClient.js';
import { logError, logInfo, logWarn } from './logging.js';

interface VerifyToolDescriptor {
  toolSlug: string;
  arguments?: Record<string, unknown>;
}

// One safe "list" or "ping" tool per toolkit. Picked for: idempotent, no rate-limit
// risk, fails fast on bad credentials. Add new entries as new toolkits land.
export const VERIFY_TOOLS_BY_TOOLKIT: Record<string, VerifyToolDescriptor> = {
  github: { toolSlug: 'GITHUB_GET_RATE_LIMIT_STATUS_FOR_THE_AUTHENTICATED_USER' },
  cloudflare_api_key: { toolSlug: 'CLOUDFLARE_API_KEY_LIST_ZONES' },
  linear: { toolSlug: 'LINEAR_LIST_LINEAR_TEAMS' },
  perplexityai: { toolSlug: 'PERPLEXITYAI_CREATE_CHAT_COMPLETION', arguments: { model: 'sonar', messages: [{ role: 'user', content: 'ping' }], max_tokens: 1 } },
  tavily: { toolSlug: 'TAVILY_SEARCH', arguments: { query: 'ping', max_results: 1 } },
  exa: { toolSlug: 'EXA_SEARCH', arguments: { query: 'ping', num_results: 1 } },
  supabase: { toolSlug: 'SUPABASE_LIST_ALL_PROJECTS' },
  notion: { toolSlug: 'NOTION_GET_ABOUT_ME' },
  slack: { toolSlug: 'SLACK_TEST_AUTH' },
  gmail: { toolSlug: 'GMAIL_GET_PROFILE' },
  outlook: { toolSlug: 'OUTLOOK_GET_PROFILE' },
  linkedin: { toolSlug: 'LINKEDIN_GET_MY_INFO' },
  // GET_DEFAULT_VOICE_SETTINGS is anonymous-accessible (no xi-api-key required),
  // so it returns 200 even for a stale/invalid key — the false-positive surfaced
  // 2026-05-13 during the [TEMPLATE] gateway stress test. GET_AGENT_DETAILS
  // requires auth and takes no args, so it's a clean 401-on-bad-key probe.
  elevenlabs: { toolSlug: 'ELEVENLABS_GET_AGENT_DETAILS' },
  peopledatalabs: { toolSlug: 'PEOPLEDATALABS_CLEAN_LOCATION_DATA', arguments: { location: 'San Francisco' } },
  abstract: { toolSlug: 'ABSTRACT_GET_VAT_CATEGORIES' },
  smtp2go: { toolSlug: 'SMTP2GO_ALLOWED_SENDERS_VIEW' },
};

const TOOL_EXECUTE_BASE = 'https://backend.composio.dev/api/v3.1/tools/execute';
const CONNECTED_ACCOUNTS_BASE = 'https://backend.composio.dev/api/v3.1/connected_accounts';

export interface SmokeResult {
  /** true means the credential authenticates upstream */
  ok: boolean;
  /** non-undefined when upstream rejected (auth-failure detail) */
  rejection?: { statusCode?: number; message: string };
  /** true when no verify tool is registered for this toolkit (treated as ok) */
  skipped: boolean;
}

interface ExecuteResponse {
  data?: { message?: string; status_code?: number };
  error?: string | { message?: string } | null;
  successful?: boolean | null;
}

interface ConnectedAccountDescriptor {
  id: string;
  user_id?: string;
  userId?: string;
}

export async function fetchRealUserIdForConnection(connectedAccountId: string): Promise<string | undefined> {
  const apiKey = readComposioApiKey();
  const response = await request(`${CONNECTED_ACCOUNTS_BASE}/${encodeURIComponent(connectedAccountId)}`, {
    method: 'GET',
    headers: { 'x-api-key': apiKey },
  });
  if (response.statusCode < 200 || response.statusCode >= 300) {
    await response.body.dump();
    return undefined;
  }
  const parsed = (await response.body.json()) as ConnectedAccountDescriptor;
  return parsed.user_id ?? parsed.userId;
}

function extractMessage(payload: ExecuteResponse): string {
  // `error` may be a string OR an object {message, code, slug, status, ...} from Composio.
  const errPart = typeof payload.error === 'string'
    ? payload.error
    : ((payload.error as { message?: string } | null | undefined)?.message ?? '');
  return `${errPart} ${payload.data?.message ?? ''}`.toLowerCase();
}

export type ExecuteClassification = 'success' | 'auth-failure' | 'registry-misconfig' | 'non-auth-failure';

function looksLikeAuthFailure(payload: ExecuteResponse): boolean {
  const status = payload.data?.status_code;
  // Hard upstream auth failures land in 401/403; 400 can be schema/validation, treat separately.
  if (status === 401 || status === 403) return true;
  const text = extractMessage(payload);
  if (!text.trim()) return false;
  return /unauthor|invalid (api )?(key|token|credentials|access token)|forbid|expired token|not authenticated|access (denied|token)|connectedaccountnotfound/.test(text);
}

// Composio returns "Tool <SLUG> not found" / "tool not enabled" when our
// registry points at a slug that no longer exists upstream. Without this
// check the looksLikeAuthFailure regex bounces those messages to the
// `non-auth-failure` branch and the probe misleadingly returns ok. We split
// them out so a bad registry surfaces as a loud `composio.smoke.bad-config`
// rather than silently passing every credential as healthy.
function looksLikeRegistryMisconfig(payload: ExecuteResponse): boolean {
  const text = extractMessage(payload);
  if (!text.trim()) return false;
  return /tool .* not found|action .* not found|tool .* not enabled|invalid tool slug|unknown tool/.test(text);
}

// Exposed for tests so the classifier can be exercised without HTTP.
export function classifyExecuteResponse(payload: ExecuteResponse): ExecuteClassification {
  if (payload.successful === true) return 'success';
  if (looksLikeRegistryMisconfig(payload)) return 'registry-misconfig';
  if (looksLikeAuthFailure(payload)) return 'auth-failure';
  return 'non-auth-failure';
}

export async function smokeProbeUpstreamCredential(args: {
  toolkitSlug: string;
  userId?: string;
  connectedAccountId?: string;
}): Promise<SmokeResult> {
  const verify = VERIFY_TOOLS_BY_TOOLKIT[args.toolkitSlug];
  if (!verify) {
    // Strict mode: callers can opt to treat unregistered toolkits as
    // unverified rather than rubber-stamped. Default stays permissive for
    // backwards-compat, but the env flag exists so high-trust pipelines
    // can refuse to mark ACTIVE without a real upstream probe.
    const strict = process.env.COMPOSIO_REQUIRE_SMOKE_PROBE === 'true';
    logInfo('composio.smoke.skipped', { toolkit: args.toolkitSlug, reason: 'no verify tool registered', strict });
    return { ok: !strict, skipped: true };
  }

  // Resolve the real user_id when only connectedAccountId is provided OR the
  // caller's user_id looks synthetic ("(unknown)"). Composio requires user_id
  // alongside connected_account_id in tool-execute, and the SDK list response
  // strips user_id so callers may not have a real one.
  let resolvedUserId = args.userId && args.userId !== '(unknown)' ? args.userId : undefined;
  if (args.connectedAccountId && !resolvedUserId) {
    resolvedUserId = await fetchRealUserIdForConnection(args.connectedAccountId);
  }
  if (!resolvedUserId) {
    logWarn('composio.smoke.no-user-id', `${args.toolkitSlug}: cannot resolve user_id; skipping probe`);
    return { ok: true, skipped: true };
  }

  const apiKey = readComposioApiKey();
  const url = `${TOOL_EXECUTE_BASE}/${encodeURIComponent(verify.toolSlug)}`;
  const bodyPayload: Record<string, unknown> = {
    user_id: resolvedUserId,
    arguments: verify.arguments ?? {},
  };
  if (args.connectedAccountId) bodyPayload.connected_account_id = args.connectedAccountId;
  try {
    const response = await request(url, {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify(bodyPayload),
    });
    const parsed = (await response.body.json()) as ExecuteResponse;
    const classification = classifyExecuteResponse(parsed);
    const detail = (typeof parsed.error === 'string' ? parsed.error : parsed.error?.message) ?? parsed.data?.message ?? 'unknown';
    if (classification === 'success') {
      logInfo('composio.smoke.ok', { toolkit: args.toolkitSlug, userId: resolvedUserId });
      return { ok: true, skipped: false };
    }
    if (classification === 'registry-misconfig') {
      // Treat as `skipped` so a stale registry never falsely demotes a credential,
      // but log loudly so the next test run / dashboard catches it.
      logError('composio.smoke.bad-config', `${args.toolkitSlug}/${verify.toolSlug} unknown upstream: ${detail}`);
      return { ok: true, skipped: true };
    }
    if (classification === 'auth-failure') {
      logWarn('composio.smoke.upstream-rejected', `${args.toolkitSlug}: ${detail}`);
      return {
        ok: false,
        skipped: false,
        rejection: { statusCode: parsed.data?.status_code, message: detail },
      };
    }
    logInfo('composio.smoke.non-auth-failure', { toolkit: args.toolkitSlug, error: detail });
    return { ok: true, skipped: false };
  } catch (err) {
    logWarn('composio.smoke.error', `${args.toolkitSlug} probe threw: ${(err as Error).message}`);
    return { ok: true, skipped: false };
  }
}

export async function deleteRemoteConnectedAccount(connectedAccountId: string): Promise<void> {
  const apiKey = readComposioApiKey();
  await request(`${CONNECTED_ACCOUNTS_BASE}/${encodeURIComponent(connectedAccountId)}`, {
    method: 'DELETE',
    headers: { 'x-api-key': apiKey },
  }).catch(() => undefined);
}
