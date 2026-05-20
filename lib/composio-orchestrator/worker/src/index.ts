// Composio gateway Cloudflare Worker — production HTTPS endpoint for external
// agents (ElevenLabs ConvAI tools, etc.) to invoke any Composio tool over a
// shared bearer auth. NO MCP.
//
// Endpoints:
//   GET  /health                        — liveness probe
//   GET  /v1/composio/healthcheck       — deep probe: smoke every connected toolkit
//   GET  /v1/composio/tools?toolkit=X   — list tool slugs for a toolkit (schema discovery)
//   POST /v1/composio/execute           — { tool, args?, userId? } → Composio result
//
// Secrets (set via `wrangler secret put`):
//   COMPOSIO_API_KEY              — master project key
//   COMPOSIO_GATEWAY_TOKEN        — primary bearer that callers present
//   COMPOSIO_DEFAULT_USER         — userId fallback (default: cody)
//   COMPOSIO_TOKEN_USER_MAP       — optional JSON: { "<bearer>": "<userId>", … }
//   COMPOSIO_TOKEN_TOOLKITS       — optional JSON: { "<bearer>": ["github","slack"], … }
//   COMPOSIO_DENY_TOOLS           — optional comma-separated glob list (e.g. "*_DELETE*,*_DESTROY")
//
// Token resolution:
//   1. If bearer matches a key in COMPOSIO_TOKEN_USER_MAP, that token is valid
//      and the body's `userId` is overridden by the mapped value (unless the
//      body explicitly sets userId, which then must match the mapped value).
//   2. Otherwise bearer must equal COMPOSIO_GATEWAY_TOKEN; userId comes from
//      body or COMPOSIO_DEFAULT_USER.
//
// Allow-list:
//   If COMPOSIO_TOKEN_TOOLKITS has an entry for the bearer, the tool's
//   toolkit prefix must be in that list. Empty/missing = unrestricted.
//
// Deny-list:
//   COMPOSIO_DENY_TOOLS is glob-matched against the full tool slug regardless
//   of bearer. Stops destructive verbs by default.

interface Env {
  COMPOSIO_API_KEY: string;
  COMPOSIO_GATEWAY_TOKEN: string;
  COMPOSIO_DEFAULT_USER?: string;
  COMPOSIO_TOKEN_USER_MAP?: string;
  COMPOSIO_TOKEN_TOOLKITS?: string;
  COMPOSIO_DENY_TOOLS?: string;
}

interface GatewayBody { tool?: string; args?: Record<string, unknown>; userId?: string }

const COMPOSIO_BASE = 'https://backend.composio.dev/api/v3.1';

function json(status: number, body: unknown, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...(extraHeaders ?? {}) },
  });
}

function parseJsonEnv<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

function globMatch(slug: string, pattern: string): boolean {
  // Trivial * glob: ^pattern.replace('*', '.*')$
  const re = new RegExp('^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$', 'i');
  return re.test(slug);
}

interface AuthDecision {
  ok: boolean;
  userId?: string;
  allowedToolkits?: string[];  // empty array = unrestricted
  error?: string;
}

function decideAuth(request: Request, env: Env, bodyUserId?: string): AuthDecision {
  const presented = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '').trim();
  if (!presented) return { ok: false, error: 'unauthorized' };
  const userMap = parseJsonEnv<Record<string, string>>(env.COMPOSIO_TOKEN_USER_MAP, {});
  const toolkitMap = parseJsonEnv<Record<string, string[]>>(env.COMPOSIO_TOKEN_TOOLKITS, {});
  if (presented in userMap) {
    const mappedUser = userMap[presented];
    if (bodyUserId && bodyUserId !== mappedUser) {
      return { ok: false, error: `token is bound to user_id=${mappedUser}; body asked for ${bodyUserId}` };
    }
    return { ok: true, userId: mappedUser, allowedToolkits: toolkitMap[presented] ?? [] };
  }
  if (presented === env.COMPOSIO_GATEWAY_TOKEN) {
    return { ok: true, userId: bodyUserId ?? env.COMPOSIO_DEFAULT_USER ?? 'cody', allowedToolkits: toolkitMap[presented] ?? [] };
  }
  return { ok: false, error: 'unauthorized' };
}

function toolkitOf(slug: string): string {
  const idx = slug.indexOf('_');
  return idx === -1 ? slug.toLowerCase() : slug.slice(0, idx).toLowerCase();
}

function policyReject(env: Env, tool: string, allowed?: string[]): string | undefined {
  const deny = (env.COMPOSIO_DENY_TOOLS ?? '').split(',').map(s => s.trim()).filter(Boolean);
  for (const pat of deny) if (globMatch(tool, pat)) return `tool "${tool}" matches deny pattern "${pat}"`;
  if (allowed && allowed.length > 0) {
    const tk = toolkitOf(tool);
    if (!allowed.map(s => s.toLowerCase()).includes(tk)) return `toolkit "${tk}" not in token allow-list [${allowed.join(',')}]`;
  }
  return undefined;
}

async function handleExecute(request: Request, env: Env): Promise<Response> {
  if (!env.COMPOSIO_API_KEY || !env.COMPOSIO_GATEWAY_TOKEN) {
    return json(503, { error: 'gateway not configured' });
  }
  let body: GatewayBody;
  try { body = await request.json<GatewayBody>(); } catch { return json(400, { error: 'invalid json body' }); }
  if (!body.tool || typeof body.tool !== 'string') return json(400, { error: 'tool field is required' });

  const auth = decideAuth(request, env, body.userId);
  if (!auth.ok) return json(401, { error: auth.error });

  const reject = policyReject(env, body.tool, auth.allowedToolkits);
  if (reject) return json(403, { error: reject, tool: body.tool });

  const upstreamUrl = `${COMPOSIO_BASE}/tools/execute/${encodeURIComponent(body.tool)}`;
  const startMs = Date.now();
  const idemKey = request.headers.get('idempotency-key');
  const upstreamHeaders: Record<string, string> = { 'x-api-key': env.COMPOSIO_API_KEY, 'content-type': 'application/json' };
  if (idemKey) upstreamHeaders['idempotency-key'] = idemKey;
  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      method: 'POST',
      headers: upstreamHeaders,
      body: JSON.stringify({ user_id: auth.userId, arguments: body.args ?? {} }),
    });
  } catch (err) {
    return json(502, { error: (err as Error).message, tool: body.tool });
  }
  const text = await upstream.text();
  const durationMs = Date.now() - startMs;
  console.log(JSON.stringify({
    event: 'gateway.execute', tool: body.tool, toolkit: toolkitOf(body.tool),
    userId: auth.userId, upstreamStatus: upstream.status, durationMs, idemKey: idemKey ?? null,
  }));
  return new Response(text, {
    status: upstream.status < 400 ? 200 : 502,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
      'x-gateway-duration-ms': String(durationMs),
    },
  });
}

async function handleToolsDiscovery(url: URL, env: Env): Promise<Response> {
  const toolkit = url.searchParams.get('toolkit');
  if (!toolkit || !/^[a-z][a-z0-9_]*$/.test(toolkit)) return json(400, { error: 'toolkit query param required, lowercase' });
  const limit = Math.min(500, Number.parseInt(url.searchParams.get('limit') ?? '100', 10));
  const upstream = await fetch(`${COMPOSIO_BASE}/tools?toolkit_slug=${encodeURIComponent(toolkit)}&limit=${limit}`, {
    headers: { 'x-api-key': env.COMPOSIO_API_KEY },
  });
  const data = await upstream.text();
  console.log(JSON.stringify({ event: 'gateway.tools.discover', toolkit, upstreamStatus: upstream.status }));
  return new Response(data, { status: upstream.status, headers: { 'content-type': 'application/json' } });
}

async function handleDeepHealthcheck(env: Env): Promise<Response> {
  // List ACTIVE connections, then probe each toolkit by invoking the verify
  // tool slug pattern (`*_GET_*` heuristic). Best-effort; surfaces stale-cred rot.
  const listed = await fetch(`${COMPOSIO_BASE}/connected_accounts?statuses=ACTIVE&limit=100`, {
    headers: { 'x-api-key': env.COMPOSIO_API_KEY },
  });
  if (!listed.ok) return json(502, { error: 'list connected_accounts failed', status: listed.status });
  type Item = { id: string; user_id?: string; userId?: string; toolkit?: { slug?: string } };
  const items = ((await listed.json<{ items?: Item[] }>())?.items ?? []) as Item[];
  // Use the same verify-tool registry hint the orchestrator uses, but conservatively.
  const PROBES: Record<string, string> = {
    github: 'GITHUB_GET_RATE_LIMIT_STATUS_FOR_THE_AUTHENTICATED_USER',
    elevenlabs: 'ELEVENLABS_GET_AGENT_DETAILS',
    linear: 'LINEAR_LIST_LINEAR_TEAMS',
    notion: 'NOTION_GET_ABOUT_ME',
    slack: 'SLACK_TEST_AUTH',
    gmail: 'GMAIL_GET_PROFILE',
    outlook: 'OUTLOOK_GET_PROFILE',
    cloudflare: 'CLOUDFLARE_API_KEY_LIST_ZONES',
    cloudflare_api_key: 'CLOUDFLARE_API_KEY_LIST_ZONES',
  };
  const results: Array<{ toolkit: string; user_id?: string; tool: string; ok: boolean; statusCode?: number; error?: string }> = [];
  for (const item of items) {
    const tk = item.toolkit?.slug ?? '';
    const probeSlug = PROBES[tk];
    if (!probeSlug) { results.push({ toolkit: tk, user_id: item.user_id ?? item.userId, tool: '-', ok: true, error: 'no probe registered' }); continue; }
    try {
      const r = await fetch(`${COMPOSIO_BASE}/tools/execute/${probeSlug}`, {
        method: 'POST',
        headers: { 'x-api-key': env.COMPOSIO_API_KEY, 'content-type': 'application/json' },
        body: JSON.stringify({ user_id: item.user_id ?? item.userId ?? 'cody', arguments: {} }),
      });
      const payload = await r.json<{ successful?: boolean; data?: { status_code?: number }; error?: string | { message?: string } }>();
      const ok = payload.successful === true;
      const errMsg = typeof payload.error === 'string' ? payload.error : payload.error?.message;
      results.push({ toolkit: tk, user_id: item.user_id ?? item.userId, tool: probeSlug, ok, statusCode: payload.data?.status_code, ...(ok ? {} : { error: errMsg }) });
    } catch (err) {
      results.push({ toolkit: tk, tool: probeSlug, ok: false, error: (err as Error).message });
    }
  }
  const summary = { healthy: results.filter(r => r.ok).length, unhealthy: results.filter(r => !r.ok).length, total: results.length };
  console.log(JSON.stringify({ event: 'gateway.healthcheck', ...summary }));
  return json(summary.unhealthy === 0 ? 200 : 503, { summary, results });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health') {
      return json(200, { ok: true, ts: new Date().toISOString() });
    }
    if (request.method === 'GET' && url.pathname === '/v1/composio/healthcheck') {
      return handleDeepHealthcheck(env);
    }
    if (request.method === 'GET' && url.pathname === '/v1/composio/tools') {
      return handleToolsDiscovery(url, env);
    }
    if (request.method === 'POST' && url.pathname === '/v1/composio/execute') {
      return handleExecute(request, env);
    }
    return json(404, { error: 'not found' });
  },
};
