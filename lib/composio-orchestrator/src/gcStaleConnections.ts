import { request } from 'undici';
import { readComposioApiKey } from './composioClient.js';
import {
  reapExpiredPendingAuth,
  removePendingAuthByConnectedAccountId,
} from './pendingAuthStore.js';
import { syncResolvedPendingAuth } from './pendingAuthSync.js';
import { pruneStaleAuthConfigs } from './authConfigCache.js';
import { logInfo, logWarn } from './logging.js';
import { ComposioOrchError } from './errors.js';

const CONNECTED_ACCOUNTS_LIST_URL = 'https://backend.composio.dev/api/v3.1/connected_accounts';
const DEFAULT_MAX_AGE_MINUTES = 30;

// INITIALIZING gets a TTL because some flows are still in-progress; everything
// in this list is a Composio-side terminal state with no value retained, so
// reap on sight. INACTIVE is intentionally NOT here — per Composio docs it
// means "paused by enable/disable" (user-chosen pause), and deleting it would
// destroy a credential the operator explicitly kept around.
const TERMINAL_STATUSES_TO_DELETE = ['EXPIRED', 'FAILED'] as const;

interface RemoteConnectedAccount {
  id: string;
  status: string;
  created_at?: string;
  createdAt?: string;
}

async function fetchConnectionsByStatus(status: string): Promise<RemoteConnectedAccount[]> {
  const apiKey = readComposioApiKey();
  const url = `${CONNECTED_ACCOUNTS_LIST_URL}?statuses=${encodeURIComponent(status)}&limit=100`;
  const response = await request(url, { method: 'GET', headers: { 'x-api-key': apiKey } });
  if (response.statusCode < 200 || response.statusCode >= 300) {
    const body = await response.body.text();
    throw new ComposioOrchError('UPSTREAM', `connected_accounts list (${status}) failed (${response.statusCode})`, {
      hint: body.slice(0, 200),
    });
  }
  const parsed = (await response.body.json()) as { items?: RemoteConnectedAccount[] };
  return parsed.items ?? [];
}

async function deleteConnectedAccount(connectedAccountId: string): Promise<boolean> {
  const apiKey = readComposioApiKey();
  const url = `${CONNECTED_ACCOUNTS_LIST_URL}/${encodeURIComponent(connectedAccountId)}`;
  const response = await request(url, { method: 'DELETE', headers: { 'x-api-key': apiKey } });
  if (response.statusCode < 200 || response.statusCode >= 300) {
    const body = await response.body.text();
    logWarn('composio.gc.delete', `failed to delete ${connectedAccountId}: ${response.statusCode} ${body.slice(0, 120)}`);
    return false;
  }
  // Mirror the deletion locally: any pending-auth entry for this id is now stale.
  await removePendingAuthByConnectedAccountId(connectedAccountId);
  logInfo('composio.gc.delete', { connectedAccountId });
  return true;
}

export async function gcStaleConnections(maxAgeMinutes: number = DEFAULT_MAX_AGE_MINUTES): Promise<{
  deleted: string[];
  locallyExpired: string[];
  orphanedLocal: string[];
  authConfigsPruned: string[];
  byStatus: Record<string, number>;
}> {
  const cutoffMs = Date.now() - maxAgeMinutes * 60_000;
  const deleted: string[] = [];
  const byStatus: Record<string, number> = {};

  // INITIALIZING + INITIATED — TTL-gated (still possibly mid-flow).
  for (const inFlightStatus of ['INITIALIZING', 'INITIATED'] as const) {
    const items = await fetchConnectionsByStatus(inFlightStatus);
    for (const account of items) {
      const createdAtRaw = account.created_at ?? account.createdAt;
      if (!createdAtRaw) continue;
      if (new Date(createdAtRaw).getTime() > cutoffMs) continue;
      if (await deleteConnectedAccount(account.id)) {
        deleted.push(account.id);
        byStatus[inFlightStatus] = (byStatus[inFlightStatus] ?? 0) + 1;
      }
    }
  }

  // Terminal states — reap on sight, no TTL.
  for (const status of TERMINAL_STATUSES_TO_DELETE) {
    const items = await fetchConnectionsByStatus(status);
    for (const account of items) {
      if (await deleteConnectedAccount(account.id)) {
        deleted.push(account.id);
        byStatus[status] = (byStatus[status] ?? 0) + 1;
      }
    }
  }

  // Reap local pending entries whose Composio connection is no longer waiting.
  // This also runs from the prompt hook so consent completion is reflected on
  // the next user turn even when the webhook tunnel is down.
  const pendingSync = await syncResolvedPendingAuth();
  const orphanedLocal = pendingSync.resolvedLocal;

  const locallyExpired = await reapExpiredPendingAuth();
  let authConfigsPruned: string[] = [];
  try {
    const cachePrune = await pruneStaleAuthConfigs();
    authConfigsPruned = cachePrune.pruned;
  } catch (err) {
    logWarn('composio.gc.cache-prune-failed', (err as Error).message);
  }
  logInfo('composio.gc.summary', {
    deletedCount: deleted.length,
    locallyExpiredCount: locallyExpired.length,
    orphanedLocalCount: orphanedLocal.length,
    authConfigsPrunedCount: authConfigsPruned.length,
    byStatus: Object.entries(byStatus).map(([k, v]) => `${k}=${v}`).join(','),
  });
  return { deleted, locallyExpired, orphanedLocal, authConfigsPruned, byStatus };
}
