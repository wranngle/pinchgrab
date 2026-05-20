import { resolvePendingAuthFilePath } from './statePaths.js';
import { readJsonOr, updateJsonAtomic } from './atomicJsonFile.js';
import { logInfo } from './logging.js';

export interface PendingAuthEntry {
  connectedAccountId: string;
  authConfigId: string;
  toolkit: string;
  userId: string;
  redirectUrl: string;
  createdAt: string;
  expiresAt: string;
}

interface PendingAuthFile {
  version: 1;
  entries: PendingAuthEntry[];
}

const EMPTY_FILE: PendingAuthFile = { version: 1, entries: [] };
const DEFAULT_TTL_MINUTES = 30;

export function listPendingAuth(filterUserId?: string): PendingAuthEntry[] {
  const file = readJsonOr<PendingAuthFile>(resolvePendingAuthFilePath(), EMPTY_FILE);
  if (!filterUserId) return file.entries;
  return file.entries.filter((entry) => entry.userId === filterUserId);
}

export async function appendPendingAuth(entry: Omit<PendingAuthEntry, 'createdAt' | 'expiresAt'>): Promise<PendingAuthEntry> {
  const now = new Date();
  const expires = new Date(now.getTime() + DEFAULT_TTL_MINUTES * 60_000);
  const fullEntry: PendingAuthEntry = {
    ...entry,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };
  await updateJsonAtomic<PendingAuthFile>(
    resolvePendingAuthFilePath(),
    (current) => ({
      version: 1,
      entries: [
        ...current.entries.filter((existing) => existing.connectedAccountId !== fullEntry.connectedAccountId),
        fullEntry,
      ],
    }),
    EMPTY_FILE,
  );
  return fullEntry;
}

export async function removePendingAuthByConnectedAccountId(connectedAccountId: string): Promise<boolean> {
  let removed = false;
  await updateJsonAtomic<PendingAuthFile>(
    resolvePendingAuthFilePath(),
    (current) => {
      const next = current.entries.filter((entry) => entry.connectedAccountId !== connectedAccountId);
      removed = next.length !== current.entries.length;
      return { version: 1, entries: next };
    },
    EMPTY_FILE,
  );
  if (removed) logInfo('composio.pending.removed', { connectedAccountId });
  return removed;
}

export async function removePendingAuthForResolvedConnection(args: {
  toolkit: string;
  connectedAccountId?: string;
  userIds?: string[];
}): Promise<PendingAuthEntry[]> {
  const userIds = new Set((args.userIds ?? []).filter((value) => value && value !== '(unknown)'));
  const removed: PendingAuthEntry[] = [];
  await updateJsonAtomic<PendingAuthFile>(
    resolvePendingAuthFilePath(),
    (current) => {
      const next = current.entries.filter((entry) => {
        const sameConnectedAccount = Boolean(args.connectedAccountId && entry.connectedAccountId === args.connectedAccountId);
        const sameResolvedToolkitUser = entry.toolkit === args.toolkit && userIds.size > 0 && userIds.has(entry.userId);
        if (sameConnectedAccount || sameResolvedToolkitUser) {
          removed.push(entry);
          return false;
        }
        return true;
      });
      return { version: 1, entries: next };
    },
    EMPTY_FILE,
  );
  if (removed.length > 0) {
    logInfo('composio.pending.resolved', {
      toolkit: args.toolkit,
      connectedAccountId: args.connectedAccountId ?? '',
      count: removed.length,
    });
  }
  return removed;
}

export async function reapExpiredPendingAuth(now: Date = new Date()): Promise<string[]> {
  const removedIds: string[] = [];
  await updateJsonAtomic<PendingAuthFile>(
    resolvePendingAuthFilePath(),
    (current) => {
      const remaining: PendingAuthEntry[] = [];
      for (const entry of current.entries) {
        if (new Date(entry.expiresAt).getTime() <= now.getTime()) {
          removedIds.push(entry.connectedAccountId);
        } else {
          remaining.push(entry);
        }
      }
      return { version: 1, entries: remaining };
    },
    EMPTY_FILE,
  );
  if (removedIds.length > 0) logInfo('composio.pending.reaped', { count: removedIds.length });
  return removedIds;
}
