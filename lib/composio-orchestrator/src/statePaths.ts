import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

function getStateDir(): string {
  return process.env.COMPOSIO_ORCH_STATE_DIR ?? join(homedir(), '.agents', 'state');
}

function getLogDir(): string {
  return process.env.XDG_STATE_HOME ?? join(homedir(), '.local', 'state');
}

function ensureStateDir(): string {
  const dir = getStateDir();
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function resolvePendingAuthFilePath(): string {
  return join(ensureStateDir(), 'composio-pending-auth.json');
}

export function resolveAuthConfigCacheFilePath(): string {
  return join(ensureStateDir(), 'composio-authconfigs.json');
}

export function resolveReconcileStateFilePath(): string {
  return join(ensureStateDir(), 'composio-reconcile-state.json');
}

export const COMPOSIO_WEBHOOK_URL_ENV_KEY = 'COMPOSIO_WEBHOOK_URL';

export function resolveLogFilePath(): string {
  return process.env.COMPOSIO_ORCH_LOG_FILE ?? join(getLogDir(), 'composio-orch.jsonl');
}

export function resolveAgentsEnvFilePath(): string {
  return process.env.COMPOSIO_ORCH_ENV_FILE ?? join(homedir(), '.agents', '.env');
}
