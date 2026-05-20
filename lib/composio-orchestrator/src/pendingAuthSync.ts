import { request } from 'undici';
import { readComposioApiKey } from './composioClient.js';
import { listPendingAuth, removePendingAuthByConnectedAccountId } from './pendingAuthStore.js';
import { logInfo, logWarn } from './logging.js';

const CONNECTED_ACCOUNTS_LIST_URL = 'https://backend.composio.dev/api/v3.1/connected_accounts';
const TERMINAL_FOR_LOCAL = new Set(['ACTIVE', 'EXPIRED', 'FAILED', 'INACTIVE']);

export async function syncResolvedPendingAuth(): Promise<{
  checked: string[];
  resolvedLocal: string[];
  skippedSynthetic: string[];
}> {
  const apiKey = readComposioApiKey();
  const checked: string[] = [];
  const resolvedLocal: string[] = [];
  const skippedSynthetic: string[] = [];

  for (const entry of listPendingAuth()) {
    if (entry.connectedAccountId.startsWith('pending-')) {
      skippedSynthetic.push(entry.connectedAccountId);
      continue;
    }

    checked.push(entry.connectedAccountId);
    const probeUrl = `${CONNECTED_ACCOUNTS_LIST_URL}/${encodeURIComponent(entry.connectedAccountId)}`;
    try {
      const probe = await request(probeUrl, { method: 'GET', headers: { 'x-api-key': apiKey } });
      if (probe.statusCode === 404 || probe.statusCode === 410) {
        await probe.body.dump();
        if (await removePendingAuthByConnectedAccountId(entry.connectedAccountId)) {
          resolvedLocal.push(entry.connectedAccountId);
        }
        continue;
      }
      if (probe.statusCode >= 200 && probe.statusCode < 300) {
        const body = (await probe.body.json()) as { status?: string };
        if (body.status && TERMINAL_FOR_LOCAL.has(body.status)) {
          if (await removePendingAuthByConnectedAccountId(entry.connectedAccountId)) {
            resolvedLocal.push(entry.connectedAccountId);
          }
        }
      } else {
        await probe.body.dump();
      }
    } catch (err) {
      logWarn('composio.pending.sync-probe-failed', `${entry.connectedAccountId}: ${(err as Error).message}`);
    }
  }

  if (checked.length > 0 || resolvedLocal.length > 0 || skippedSynthetic.length > 0) {
    logInfo('composio.pending.sync', {
      checked: checked.length,
      resolvedLocal: resolvedLocal.length,
      skippedSynthetic: skippedSynthetic.length,
    });
  }
  return { checked, resolvedLocal, skippedSynthetic };
}
