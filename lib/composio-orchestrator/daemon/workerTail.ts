// Tail the composio-gateway Cloudflare Worker logs and append each event,
// wrapped in the ECS envelope, to ~/.local/state/composio-worker.jsonl.
// Run via `composio-orch gateway tail`. Keeps Worker observability inside
// the same jsonl stream as everything else the system writes.
import { spawn } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { appendJsonlEvent } from '../src/jsonlAppender.js';
import { readEnvVar } from '../src/composioClient.js';

const OUT = process.env.COMPOSIO_WORKER_TAIL_FILE ?? join(homedir(), '.local/state/composio-worker.jsonl');
const WORKER_DIR = process.env.COMPOSIO_WORKER_DIR ?? join(homedir(), '.dotfiles/lib/composio-orchestrator/worker');

interface WranglerTailEvent {
  outcome?: string;
  eventTimestamp?: number;
  event?: { request?: { url?: string; method?: string }; response?: { status?: number } };
  logs?: Array<{ message?: unknown[]; level?: string }>;
  exceptions?: unknown[];
  scriptName?: string;
}

function extractMessageLine(logs: WranglerTailEvent['logs']): string | undefined {
  for (const entry of logs ?? []) {
    for (const piece of entry.message ?? []) {
      if (typeof piece === 'string' && piece.startsWith('{')) return piece;
    }
  }
  return undefined;
}

function relay(line: string): void {
  let parsed: WranglerTailEvent;
  try { parsed = JSON.parse(line) as WranglerTailEvent; } catch { return; }
  const reqLine = extractMessageLine(parsed.logs);
  let labels: Record<string, string | number | boolean | null> = {
    outcome: parsed.outcome ?? 'unknown',
    method: parsed.event?.request?.method ?? '-',
    url: parsed.event?.request?.url ?? '-',
    status: parsed.event?.response?.status ?? 0,
  };
  if (reqLine) {
    try { const m = JSON.parse(reqLine) as Record<string, unknown>; labels = { ...labels, ...m as Record<string, string | number | boolean | null> }; } catch { /* ignore */ }
  }
  appendJsonlEvent(OUT, {
    level: parsed.exceptions?.length ? 'error' : 'info',
    action: 'composio.worker.tail',
    outcome: parsed.outcome === 'ok' ? 'success' : 'failure',
    labels,
    ...(parsed.exceptions?.length ? { errorMessage: JSON.stringify(parsed.exceptions[0]).slice(0, 300) } : {}),
  });
}

const env: Record<string, string> = { ...process.env } as Record<string, string>;
const cfToken = readEnvVar('CLOUDFLARE_API_TOKEN');
const cfAccount = readEnvVar('CLOUDFLARE_ACCOUNT_ID');
if (cfToken) env.CLOUDFLARE_API_TOKEN = cfToken;
if (cfAccount) env.CLOUDFLARE_ACCOUNT_ID = cfAccount;

const child = spawn('npx', ['wrangler', 'tail', '--format', 'json'], { cwd: WORKER_DIR, env, stdio: ['ignore', 'pipe', 'pipe'] });
let buf = '';
child.stdout.on('data', (chunk: Buffer) => {
  buf += chunk.toString('utf8');
  let nl: number;
  while ((nl = buf.indexOf('\n')) !== -1) {
    const line = buf.slice(0, nl).trim();
    buf = buf.slice(nl + 1);
    if (line) relay(line);
  }
});
child.stderr.on('data', (chunk: Buffer) => {
  appendJsonlEvent(OUT, { level: 'warn', action: 'composio.worker.tail-stderr', outcome: 'unknown', labels: { detail: chunk.toString('utf8').slice(0, 300) } });
});
child.on('exit', (code) => {
  appendJsonlEvent(OUT, { level: 'info', action: 'composio.worker.tail-exit', outcome: code === 0 ? 'success' : 'failure', labels: { code: code ?? -1 } });
});
appendJsonlEvent(OUT, { level: 'info', action: 'composio.worker.tail-start', outcome: 'success', labels: { out: OUT } });
