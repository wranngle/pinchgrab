// In Composio v3, OAuth-completion notifications are delivered via the
// project-wide trigger webhook URL — not per-trigger instances. This
// module installs that URL via POST /api/v3.1/org/project/webhook/update
// (type=trigger) and pulls back the secret Composio assigns. The receiver
// reads the same secret from ~/.agents/.env to verify HMAC-SHA256 sigs.
import { request } from 'undici';
import { readComposioApiKey } from './composioClient.js';
import { COMPOSIO_WEBHOOK_URL_ENV_KEY } from './statePaths.js';
import { readEnvFileEntry, upsertEnvFileEntry } from './envFileMutator.js';
import { ComposioOrchError } from './errors.js';
import { logInfo } from './logging.js';

const PROJECT_WEBHOOK_BASE = 'https://backend.composio.dev/api/v3.1/org/project/webhook';
const WEBHOOK_PATH = '/webhook'; // local receiver mounts at this path

function readTunneledWebhookUrl(): string {
  const url = (process.env[COMPOSIO_WEBHOOK_URL_ENV_KEY] ?? readEnvFileEntry(COMPOSIO_WEBHOOK_URL_ENV_KEY) ?? '').trim();
  if (!url) {
    throw new ComposioOrchError('WEBHOOK', `${COMPOSIO_WEBHOOK_URL_ENV_KEY} is not set`, {
      hint: 'Run scripts/bin/composio-webhook-tunnel.sh to publish a tunnel URL into ~/.agents/.env',
    });
  }
  return url.replace(/\/$/, '') + WEBHOOK_PATH;
}

interface ProjectWebhookResponse {
  status: string;
  url?: { type: string; webhook_url?: string };
  webhook_secret?: string;
  webhook_version?: string;
}

async function fetchProjectWebhook(type: 'trigger' | 'event'): Promise<ProjectWebhookResponse | undefined> {
  const apiKey = readComposioApiKey();
  const response = await request(`${PROJECT_WEBHOOK_BASE}?type=${type}`, {
    method: 'GET',
    headers: { 'x-api-key': apiKey },
  });
  if (response.statusCode < 200 || response.statusCode >= 300) {
    await response.body.dump();
    return undefined;
  }
  return (await response.body.json()) as ProjectWebhookResponse;
}

export async function registerOAuthCompletionTrigger(_args: { toolkit?: string; userId?: string } = {}): Promise<{
  webhookUrl: string;
  webhookSecret: string;
  storedSecretEnvKey: 'COMPOSIO_WEBHOOK_SECRET';
}> {
  const apiKey = readComposioApiKey();
  const webhookUrl = readTunneledWebhookUrl();

  const response = await request(`${PROJECT_WEBHOOK_BASE}/update`, {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'content-type': 'application/json' },
    body: JSON.stringify({ type: 'trigger', webhook_url: webhookUrl }),
  });
  if (response.statusCode < 200 || response.statusCode >= 300) {
    const body = await response.body.text();
    throw new ComposioOrchError('UPSTREAM', `project webhook update failed (${response.statusCode})`, {
      hint: body.slice(0, 200),
    });
  }
  await response.body.dump();

  const verified = await fetchProjectWebhook('trigger');
  const secret = verified?.webhook_secret;
  if (!secret) {
    throw new ComposioOrchError('WEBHOOK', 'Composio did not return a webhook_secret after update', {
      hint: 'Try GET /api/v3.1/org/project/webhook?type=trigger manually to inspect',
    });
  }

  await upsertEnvFileEntry('COMPOSIO_WEBHOOK_SECRET', secret);
  logInfo('composio.trigger.registered', { webhookUrl, secretLength: secret.length });
  return { webhookUrl, webhookSecret: secret, storedSecretEnvKey: 'COMPOSIO_WEBHOOK_SECRET' };
}
