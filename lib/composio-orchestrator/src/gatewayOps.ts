// Gateway lifecycle helpers — deploy, secret-sync, token rotation, deep
// healthcheck. Wrap `wrangler` and the orchestrator's own env mutator.
import { spawnSync } from 'node:child_process';
import { request } from 'undici';
import { randomBytes } from 'node:crypto';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { readEnvVar } from './composioClient.js';
import { upsertEnvFileEntry } from './envFileMutator.js';
import { ensureMegatool } from './elevenlabsMegatool.js';
import { ComposioOrchError } from './errors.js';
import { logInfo, logWarn } from './logging.js';

function workerDir(): string {
  return process.env.COMPOSIO_WORKER_DIR ?? join(homedir(), '.dotfiles/lib/composio-orchestrator/worker');
}

function cfEnv(): Record<string, string> {
  const env: Record<string, string> = { ...process.env } as Record<string, string>;
  const token = readEnvVar('CLOUDFLARE_API_TOKEN');
  const account = readEnvVar('CLOUDFLARE_ACCOUNT_ID');
  if (token) env.CLOUDFLARE_API_TOKEN = token;
  if (account) env.CLOUDFLARE_ACCOUNT_ID = account;
  return env;
}

function wrangler(args: string[], opts: { stdinValue?: string } = {}): { code: number; stdout: string; stderr: string } {
  const res = spawnSync('npx', ['wrangler', ...args], {
    cwd: workerDir(),
    env: cfEnv(),
    input: opts.stdinValue,
    encoding: 'utf8',
  });
  return { code: res.status ?? 1, stdout: res.stdout ?? '', stderr: res.stderr ?? '' };
}

export interface GatewayDeployResult { ok: boolean; versionId?: string; url?: string; raw: string }

export function gatewayDeploy(): GatewayDeployResult {
  const r = wrangler(['deploy']);
  const combined = r.stdout + r.stderr;
  const idMatch = combined.match(/Current Version ID:\s*([0-9a-f-]{20,})/i);
  const urlMatch = combined.match(/https:\/\/[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev/);
  const ok = r.code === 0 && Boolean(idMatch);
  logInfo('composio.gateway.deploy', { ok, versionId: idMatch?.[1] ?? '', url: urlMatch?.[0] ?? '' });
  return { ok, versionId: idMatch?.[1], url: urlMatch?.[0], raw: combined };
}

const SECRETS_TO_SYNC = ['COMPOSIO_API_KEY', 'COMPOSIO_GATEWAY_TOKEN', 'COMPOSIO_DEFAULT_USER', 'COMPOSIO_TOKEN_USER_MAP', 'COMPOSIO_TOKEN_TOOLKITS', 'COMPOSIO_DENY_TOOLS'] as const;

export function gatewaySyncSecrets(): { pushed: string[]; skipped: string[] } {
  const pushed: string[] = []; const skipped: string[] = [];
  for (const key of SECRETS_TO_SYNC) {
    const value = readEnvVar(key);
    if (!value) { skipped.push(key); continue; }
    const r = wrangler(['secret', 'put', key], { stdinValue: value });
    if (r.code === 0) pushed.push(key);
    else { logWarn('composio.gateway.sync', `wrangler secret put ${key} failed: ${r.stderr.slice(0, 200)}`); skipped.push(key); }
  }
  logInfo('composio.gateway.sync', { pushedCount: pushed.length, skippedCount: skipped.length });
  return { pushed, skipped };
}

export async function gatewayRotateToken(): Promise<{ newToken: string; workerUpdated: boolean; envUpdated: boolean; megatoolRefreshed: boolean }> {
  const newToken = randomBytes(24).toString('hex');
  const r = wrangler(['secret', 'put', 'COMPOSIO_GATEWAY_TOKEN'], { stdinValue: newToken });
  const workerUpdated = r.code === 0;
  await upsertEnvFileEntry('COMPOSIO_GATEWAY_TOKEN', newToken);
  let megatoolRefreshed = false;
  try { await ensureMegatool(); megatoolRefreshed = true; } catch (err) { logWarn('composio.gateway.rotate.megatool', (err as Error).message); }
  logInfo('composio.gateway.rotate-token', { workerUpdated, megatoolRefreshed });
  return { newToken, workerUpdated, envUpdated: true, megatoolRefreshed };
}

export async function gatewayHealthcheck(): Promise<{ summary: { healthy: number; unhealthy: number; total: number }; results: Array<{ toolkit: string; ok: boolean; error?: string }> }> {
  const baseUrl = readEnvVar('COMPOSIO_WEBHOOK_URL');
  if (!baseUrl) throw new ComposioOrchError('CONFIG', 'COMPOSIO_WEBHOOK_URL not set');
  const res = await request(`${baseUrl.replace(/\/$/, '')}/v1/composio/healthcheck`);
  const data = (await res.body.json()) as { summary?: { healthy: number; unhealthy: number; total: number }; results?: Array<{ toolkit: string; ok: boolean; error?: string }> };
  return { summary: data.summary ?? { healthy: 0, unhealthy: 0, total: 0 }, results: data.results ?? [] };
}
