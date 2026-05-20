// ECS-compatible jsonl emitter; mirrors the envelope used in
// scripts/bin/git-autosync.sh so all dotfiles services log the same shape.
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { resolveLogFilePath } from './statePaths.js';

const SERVICE_NAME = 'composio-orchestrator';
const HOST = 'local';
const RUN_ID =
  process.env.DOTFILES_BOOTSTRAP_RUN_ID ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
let sequence = 0;

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type EventOutcome = 'success' | 'failure' | 'unknown';

export interface LogEvent {
  level: LogLevel;
  action: string;
  outcome: EventOutcome;
  detail?: string;
  errorMessage?: string;
  labels?: Record<string, string | number | boolean>;
}

export function emitEcsEvent(event: LogEvent): void {
  sequence += 1;
  const timestamp = new Date().toISOString();
  const eventId = `${RUN_ID}-${sequence}`;
  const labels = { host: HOST, ...(event.labels ?? {}) };
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
  if (event.detail !== undefined) (payload.labels as Record<string, unknown>).detail = event.detail;
  if (event.errorMessage !== undefined) payload['error.message'] = event.errorMessage;
  const line = JSON.stringify(payload);
  process.stderr.write(line + '\n');
  const logPath = resolveLogFilePath();
  try {
    mkdirSync(dirname(logPath), { recursive: true });
    appendFileSync(logPath, line + '\n');
  } catch {
    /* never break the program because logging failed */
  }
}

export function logInfo(action: string, labels?: LogEvent['labels'], detail?: string): void {
  emitEcsEvent({ level: 'info', action, outcome: 'success', labels, detail });
}

export function logWarn(action: string, errorMessage: string, labels?: LogEvent['labels']): void {
  emitEcsEvent({ level: 'warn', action, outcome: 'failure', errorMessage, labels });
}

export function logError(action: string, errorMessage: string, labels?: LogEvent['labels']): void {
  emitEcsEvent({ level: 'error', action, outcome: 'failure', errorMessage, labels });
}
