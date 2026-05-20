// Local HTTP receiver bound to 127.0.0.1:8787; expected to sit behind a
// Cloudflare Tunnel (composio-webhook-tunnel.sh) for public ingress.
// Verifies HMAC-SHA256 signatures and clears matching pending-auth entries
// when Composio fires `connection.activated`.
//
// Also exposes a `POST /v1/composio/execute` gateway used by external agents
// (e.g. ElevenLabs ConvAI) to call any Composio tool via shared bearer auth.
// Body: { tool: string, args?: object, userId?: string }; auth via
// `Authorization: Bearer <COMPOSIO_GATEWAY_TOKEN>` header.
import { createServer } from 'node:http';
import { request as undiciRequest } from 'undici';
import { verifyWebhookSignature } from '../src/webhookSignature.js';
import { removePendingAuthByConnectedAccountId } from '../src/pendingAuthStore.js';
import { readComposioApiKey, readEnvVar } from '../src/composioClient.js';
import { logInfo, logWarn } from '../src/logging.js';

const HOST = process.env.COMPOSIO_WEBHOOK_HOST ?? '127.0.0.1';
const PORT = Number.parseInt(process.env.COMPOSIO_WEBHOOK_PORT ?? '8787', 10);

interface ComposioWebhookEvent {
  type?: string;
  data?: { connected_account_id?: string; connectedAccountId?: string };
  event?: string;
  payload?: { connected_account_id?: string; connectedAccountId?: string };
}

function extractConnectedAccountId(parsed: ComposioWebhookEvent): string | undefined {
  return (
    parsed.data?.connected_account_id ??
    parsed.data?.connectedAccountId ??
    parsed.payload?.connected_account_id ??
    parsed.payload?.connectedAccountId
  );
}

function isActivationEvent(parsed: ComposioWebhookEvent): boolean {
  const candidates = [parsed.type, parsed.event];
  return candidates.some((value) => typeof value === 'string' && /connection[._]activated|connectedaccount[._]active/i.test(value));
}

async function readRawBody(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks).toString('utf8');
}

const TOOL_EXECUTE_BASE = 'https://backend.composio.dev/api/v3.1/tools/execute';

interface GatewayBody { tool?: string; args?: Record<string, unknown>; userId?: string }

async function handleGatewayExecute(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse): Promise<void> {
  const expectedToken = readEnvVar('COMPOSIO_GATEWAY_TOKEN');
  if (!expectedToken) {
    logWarn('composio.gateway.config', 'COMPOSIO_GATEWAY_TOKEN is not set; refusing all requests');
    res.writeHead(503, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'gateway not configured' }));
    return;
  }
  const authHeader = req.headers.authorization;
  const presented = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (presented !== expectedToken) {
    logWarn('composio.gateway.auth', 'invalid or missing bearer token');
    res.writeHead(401, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'unauthorized' }));
    return;
  }
  let body: GatewayBody;
  try { body = JSON.parse(await readRawBody(req)) as GatewayBody; } catch {
    res.writeHead(400, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'invalid json body' }));
    return;
  }
  if (!body.tool || typeof body.tool !== 'string') {
    res.writeHead(400, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'tool field is required' }));
    return;
  }
  const userId = body.userId ?? readEnvVar('COMPOSIO_DEFAULT_USER') ?? 'cody';
  const apiKey = readComposioApiKey();
  const upstreamUrl = `${TOOL_EXECUTE_BASE}/${encodeURIComponent(body.tool)}`;
  const upstreamBody = JSON.stringify({ user_id: userId, arguments: body.args ?? {} });
  const startMs = Date.now();
  try {
    const upstream = await undiciRequest(upstreamUrl, {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'content-type': 'application/json' },
      body: upstreamBody,
    });
    const text = await upstream.body.text();
    const durationMs = Date.now() - startMs;
    logInfo('composio.gateway.execute', { tool: body.tool, userId, status: upstream.statusCode, durationMs });
    res.writeHead(upstream.statusCode < 400 ? 200 : 502, { 'content-type': 'application/json' }).end(text);
  } catch (err) {
    logWarn('composio.gateway.execute-error', `${body.tool}: ${(err as Error).message}`);
    res.writeHead(502, { 'content-type': 'application/json' }).end(JSON.stringify({ error: (err as Error).message }));
  }
}

const server = createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/v1/composio/execute') {
    await handleGatewayExecute(req, res);
    return;
  }
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ ok: true, ts: new Date().toISOString() }));
    return;
  }
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404).end();
    return;
  }
  const secret = readEnvVar('COMPOSIO_WEBHOOK_SECRET');
  if (!secret) {
    logWarn('composio.webhook.config', 'COMPOSIO_WEBHOOK_SECRET is not set; rejecting all requests');
    res.writeHead(503).end();
    return;
  }
  const rawBody = await readRawBody(req);
  const signatureHeader = req.headers['webhook-signature'];
  const signatureValue = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
  const ok = verifyWebhookSignature({ rawBody, signatureHeader: signatureValue, secret });
  if (!ok) {
    logWarn('composio.webhook.signature', 'invalid signature');
    res.writeHead(401).end();
    return;
  }
  let parsed: ComposioWebhookEvent;
  try {
    parsed = JSON.parse(rawBody) as ComposioWebhookEvent;
  } catch {
    logWarn('composio.webhook.parse', 'body is not valid JSON');
    res.writeHead(400).end();
    return;
  }
  if (!isActivationEvent(parsed)) {
    logInfo('composio.webhook.ignored', { type: parsed.type ?? parsed.event ?? 'unknown' });
    res.writeHead(204).end();
    return;
  }
  const connectedAccountId = extractConnectedAccountId(parsed);
  if (connectedAccountId) {
    const removed = await removePendingAuthByConnectedAccountId(connectedAccountId);
    logInfo('composio.webhook.activated', { connectedAccountId, clearedPending: removed });
  } else {
    logWarn('composio.webhook.activated', 'activation event missing connected_account_id');
  }
  res.writeHead(200).end();
});

server.listen(PORT, HOST, () => {
  logInfo('composio.webhook.listening', { host: HOST, port: PORT });
});
