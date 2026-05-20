// JSONL writer for runtime artifact files. Every line is one ECS-shaped
// event matching the envelope in src/logging.ts so a single jq/awk pipeline
// reads any file the system produces. Append-only; never rewrites the file
// in place. Parent directory is created lazily.
//
// Use this instead of fs.writeFile/process.stdout for ANY runtime file.
// Snapshot state docs (auth-config-cache, pending-auth) still live as
// single-document JSON via atomicJsonFile — those aren't "runtime files".
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SERVICE_NAME = 'composio-orchestrator';
const HOST = 'local';
const RUN_ID =
  process.env.DOTFILES_BOOTSTRAP_RUN_ID ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
let sequence = 0;

export type JsonlLogLevel = 'debug' | 'info' | 'warn' | 'error';
export type JsonlEventOutcome = 'success' | 'failure' | 'unknown';

export interface JsonlEvent {
  level: JsonlLogLevel;
  action: string;
  outcome: JsonlEventOutcome;
  labels?: Record<string, string | number | boolean | null>;
  detail?: string;
  errorMessage?: string;
}

function buildPayload(event: JsonlEvent): Record<string, unknown> {
  sequence += 1;
  const timestamp = new Date().toISOString();
  const eventId = `${RUN_ID}-${sequence}`;
  const labels: Record<string, unknown> = { host: HOST, ...(event.labels ?? {}) };
  if (event.detail !== undefined) labels.detail = event.detail;
  const payload: Record<string, unknown> = {
    '@timestamp': timestamp,
    'log.level': event.level,
    'event.action': event.action,
    'event.outcome': event.outcome,
    'event.id': eventId,
    'trace.id': RUN_ID,
    'service.name': SERVICE_NAME,
    labels,
  };
  if (event.errorMessage !== undefined) payload['error.message'] = event.errorMessage;
  return payload;
}

export function appendJsonlEvent(filePath: string, event: JsonlEvent): void {
  if (!filePath.endsWith('.jsonl')) {
    throw new Error(`appendJsonlEvent: filePath must end in .jsonl; got "${filePath}"`);
  }
  const line = JSON.stringify(buildPayload(event)) + '\n';
  try {
    mkdirSync(dirname(filePath), { recursive: true });
    appendFileSync(filePath, line);
  } catch {
    // Logging must never break the program. Drop on disk-full / permission errors.
  }
}

export function jsonlInfo(filePath: string, action: string, labels?: JsonlEvent['labels'], detail?: string): void {
  appendJsonlEvent(filePath, { level: 'info', action, outcome: 'success', labels, detail });
}

export function jsonlWarn(filePath: string, action: string, errorMessage: string, labels?: JsonlEvent['labels']): void {
  appendJsonlEvent(filePath, { level: 'warn', action, outcome: 'failure', errorMessage, labels });
}

export function jsonlError(filePath: string, action: string, errorMessage: string, labels?: JsonlEvent['labels']): void {
  appendJsonlEvent(filePath, { level: 'error', action, outcome: 'failure', errorMessage, labels });
}
