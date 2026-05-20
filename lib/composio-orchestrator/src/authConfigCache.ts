import { request } from 'undici';
import type { AuthConfigType, AuthScheme } from './authSchemeNegotiator.js';
import { resolveAuthConfigCacheFilePath } from './statePaths.js';
import { readJsonOr, updateJsonAtomic } from './atomicJsonFile.js';
import { readComposioApiKey } from './composioClient.js';
import { logInfo, logWarn } from './logging.js';

interface CachedAuthConfig {
  authConfigId: string;
  toolkitSlug: string;
  type: AuthConfigType;
  authScheme: AuthScheme;
  createdAt: string;
}

interface AuthConfigCacheFile {
  version: 1;
  entries: Record<string, CachedAuthConfig>;
}

const EMPTY_FILE: AuthConfigCacheFile = { version: 1, entries: {} };
const AUTH_CONFIG_BASE_URL = 'https://backend.composio.dev/api/v3.1/auth_configs';

function buildKey(toolkitSlug: string, authScheme: AuthScheme): string {
  return `${toolkitSlug}:${authScheme}`;
}

export function getCachedAuthConfigId(toolkitSlug: string, authScheme: AuthScheme): string | undefined {
  const file = readJsonOr<AuthConfigCacheFile>(resolveAuthConfigCacheFilePath(), EMPTY_FILE);
  return file.entries[buildKey(toolkitSlug, authScheme)]?.authConfigId;
}

export function listCachedAuthConfigs(): CachedAuthConfig[] {
  const file = readJsonOr<AuthConfigCacheFile>(resolveAuthConfigCacheFilePath(), EMPTY_FILE);
  return Object.values(file.entries);
}

export async function recordAuthConfig(entry: {
  toolkitSlug: string;
  authScheme: AuthScheme;
  type: AuthConfigType;
  authConfigId: string;
}): Promise<void> {
  await updateJsonAtomic<AuthConfigCacheFile>(
    resolveAuthConfigCacheFilePath(),
    (current) => ({
      version: 1,
      entries: {
        ...current.entries,
        [buildKey(entry.toolkitSlug, entry.authScheme)]: {
          ...entry,
          createdAt: new Date().toISOString(),
        },
      },
    }),
    EMPTY_FILE,
  );
}

async function removeCachedKeys(keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  await updateJsonAtomic<AuthConfigCacheFile>(
    resolveAuthConfigCacheFilePath(),
    (current) => {
      const remaining: Record<string, CachedAuthConfig> = {};
      for (const [k, v] of Object.entries(current.entries)) {
        if (!keys.includes(k)) remaining[k] = v;
      }
      return { version: 1, entries: remaining };
    },
    EMPTY_FILE,
  );
}

export async function clearAuthConfigCache(): Promise<{ cleared: number }> {
  const before = listCachedAuthConfigs().length;
  await updateJsonAtomic<AuthConfigCacheFile>(
    resolveAuthConfigCacheFilePath(),
    () => EMPTY_FILE,
    EMPTY_FILE,
  );
  logInfo('composio.cache.cleared', { entries: before });
  return { cleared: before };
}

export async function pruneStaleAuthConfigs(): Promise<{ pruned: string[]; checked: number }> {
  const apiKey = readComposioApiKey();
  const all = listCachedAuthConfigs();
  const staleKeys: string[] = [];
  const prunedIds: string[] = [];
  for (const entry of all) {
    const url = `${AUTH_CONFIG_BASE_URL}/${encodeURIComponent(entry.authConfigId)}`;
    try {
      const response = await request(url, { method: 'GET', headers: { 'x-api-key': apiKey } });
      if (response.statusCode === 404 || response.statusCode === 410) {
        staleKeys.push(buildKey(entry.toolkitSlug, entry.authScheme));
        prunedIds.push(entry.authConfigId);
      }
      await response.body.dump();
    } catch (err) {
      logWarn('composio.cache.probe-failed', `${entry.authConfigId}: ${(err as Error).message}`);
    }
  }
  await removeCachedKeys(staleKeys);
  if (prunedIds.length > 0) logInfo('composio.cache.pruned', { count: prunedIds.length });
  return { pruned: prunedIds, checked: all.length };
}
