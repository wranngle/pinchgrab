// Periodic reconcile loop. Composio Cloud is the source of truth; this module
// pulls state on a schedule and diffs against the local cache. Push is handled
// separately via the project webhook (triggerRegistrar.ts).
//
// One tick performs three independent pulls:
//   1. connectedAccounts.list({ userIds }) — full scan, no delta filter exists
//   2. authConfigs.list() — full scan, no delta filter exists
//   3. logs/tool_execution with time_range.from = <last cursor> — delta-capable
//
// State is persisted under $COMPOSIO_ORCH_STATE_DIR/reconcile-state.json so
// successive ticks can compute deltas without re-pulling.
import { request } from 'undici';
import { readComposioApiKey, getComposioClient, readEnvVar } from './composioClient.js';
import { resolveReconcileStateFilePath } from './statePaths.js';
import { readJsonOr, updateJsonAtomic } from './atomicJsonFile.js';
import { logInfo, logWarn } from './logging.js';

const LOGS_URL = 'https://backend.composio.dev/api/v3.1/logs/tool_execution';

interface ReconcileState {
  version: 1;
  lastConnectedAccountSyncMs?: number;
  lastAuthConfigSyncMs?: number;
  lastLogsCursorMs?: number;
  connectedAccountSnapshot?: Array<{ id: string; status: string; user_id?: string; toolkit?: string }>;
}

const EMPTY: ReconcileState = { version: 1 };

interface ListedConnection {
  id: string;
  status: string;
  user_id?: string;
  userId?: string;
  toolkit?: { slug?: string } | string;
}

interface ListedAuthConfig {
  id: string;
  toolkit?: { slug?: string };
  isComposioManaged?: boolean;
  status?: string;
}

function normalizeToolkitSlug(toolkit: ListedConnection['toolkit']): string | undefined {
  if (!toolkit) return undefined;
  if (typeof toolkit === 'string') return toolkit;
  return toolkit.slug;
}

async function pullConnectedAccounts(userId: string): Promise<ListedConnection[]> {
  const composio = getComposioClient();
  const all: ListedConnection[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < 20; page += 1) {
    const result = (await (composio as unknown as {
      connectedAccounts: { list: (q: Record<string, unknown>) => Promise<{ items?: ListedConnection[]; next_cursor?: string | null; nextCursor?: string | null }> };
    }).connectedAccounts.list({ userIds: [userId], limit: 100, ...(cursor ? { cursor } : {}) }));
    all.push(...(result.items ?? []));
    cursor = result.next_cursor ?? result.nextCursor ?? undefined;
    if (!cursor) break;
  }
  return all;
}

async function pullAuthConfigs(): Promise<ListedAuthConfig[]> {
  const composio = getComposioClient();
  const all: ListedAuthConfig[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < 20; page += 1) {
    const result = (await (composio as unknown as {
      authConfigs: { list: (q: Record<string, unknown>) => Promise<{ items?: ListedAuthConfig[]; next_cursor?: string | null; nextCursor?: string | null }> };
    }).authConfigs.list({ limit: 100, ...(cursor ? { cursor } : {}) }));
    all.push(...(result.items ?? []));
    cursor = result.next_cursor ?? result.nextCursor ?? undefined;
    if (!cursor) break;
  }
  return all;
}

async function pullToolExecutionLogs(sinceMs?: number): Promise<{ count: number; cursorMs: number | undefined }> {
  const apiKey = readComposioApiKey();
  const fromMs = sinceMs ?? Date.now() - 6 * 60 * 60_000; // default: last 6h on first run
  const body = JSON.stringify({ time_range: { from: fromMs, to: Date.now() }, limit: 200 });
  const response = await request(LOGS_URL, { method: 'POST', headers: { 'x-api-key': apiKey, 'content-type': 'application/json' }, body });
  if (response.statusCode < 200 || response.statusCode >= 300) {
    await response.body.dump();
    logWarn('composio.reconcile.logs', `tool_execution logs pull failed: ${response.statusCode}`);
    return { count: 0, cursorMs: sinceMs };
  }
  const parsed = (await response.body.json()) as { items?: unknown[]; next_cursor?: string | null };
  return { count: parsed.items?.length ?? 0, cursorMs: Date.now() };
}

function diffConnections(
  prev: ReconcileState['connectedAccountSnapshot'],
  next: ListedConnection[],
): { added: string[]; removed: string[]; statusChanged: Array<{ id: string; from: string; to: string }> } {
  const prevMap = new Map((prev ?? []).map((c) => [c.id, c]));
  const nextMap = new Map(next.map((c) => [c.id, c]));
  const added: string[] = [];
  const removed: string[] = [];
  const statusChanged: Array<{ id: string; from: string; to: string }> = [];
  for (const [id, c] of nextMap.entries()) {
    const before = prevMap.get(id);
    if (!before) added.push(id);
    else if (before.status !== c.status) statusChanged.push({ id, from: before.status, to: c.status });
  }
  for (const id of prevMap.keys()) if (!nextMap.has(id)) removed.push(id);
  return { added, removed, statusChanged };
}

export interface ReconcileResult {
  userId: string;
  connectedAccounts: { total: number; added: string[]; removed: string[]; statusChanged: Array<{ id: string; from: string; to: string }> };
  authConfigs: { total: number; managed: number; custom: number };
  logs: { count: number; sinceMs: number | undefined };
  durationMs: number;
}

export async function reconcileOnce(userId?: string): Promise<ReconcileResult> {
  const start = Date.now();
  const resolvedUserId = userId ?? readEnvVar('COMPOSIO_DEFAULT_USER') ?? 'cody';
  const stateFile = resolveReconcileStateFilePath();
  const prev = readJsonOr<ReconcileState>(stateFile, EMPTY);

  const [connections, authConfigs, logs] = await Promise.all([
    pullConnectedAccounts(resolvedUserId),
    pullAuthConfigs(),
    pullToolExecutionLogs(prev.lastLogsCursorMs),
  ]);

  const snapshot = connections.map((c) => ({
    id: c.id,
    status: c.status,
    user_id: c.user_id ?? c.userId,
    toolkit: normalizeToolkitSlug(c.toolkit),
  }));
  const diff = diffConnections(prev.connectedAccountSnapshot, snapshot);

  await updateJsonAtomic<ReconcileState>(
    stateFile,
    () => ({
      version: 1,
      lastConnectedAccountSyncMs: start,
      lastAuthConfigSyncMs: start,
      lastLogsCursorMs: logs.cursorMs,
      connectedAccountSnapshot: snapshot,
    }),
    EMPTY,
  );

  const managed = authConfigs.filter((a) => a.isComposioManaged === true).length;
  const result: ReconcileResult = {
    userId: resolvedUserId,
    connectedAccounts: { total: connections.length, added: diff.added, removed: diff.removed, statusChanged: diff.statusChanged },
    authConfigs: { total: authConfigs.length, managed, custom: authConfigs.length - managed },
    logs: { count: logs.count, sinceMs: prev.lastLogsCursorMs },
    durationMs: Date.now() - start,
  };
  logInfo('composio.reconcile.tick', {
    userId: resolvedUserId,
    connections: connections.length,
    added: diff.added.length,
    removed: diff.removed.length,
    statusChanged: diff.statusChanged.length,
    authConfigs: authConfigs.length,
    logEvents: logs.count,
    durationMs: result.durationMs,
  });
  return result;
}
