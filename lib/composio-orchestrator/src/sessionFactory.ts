import { Composio } from '@composio/core';
import { readComposioApiKey } from './composioClient.js';
import { getProvider } from './providerRegistry.js';
import type { ProviderName, ComposioProviderInstance } from './providerRegistry.js';
import { logInfo } from './logging.js';

// Sessions are immutable in v3 — callers create a fresh one per call rather
// than caching, because invalidation logic costs more than the few-hundred-ms
// session create. See plan §11 trade-off #3.

export interface OrchestratedSession {
  toolkit: string;
  userId: string;
  providerName: ProviderName;
  provider: ComposioProviderInstance;
  tools: unknown[];
  rawSession: unknown;
}

export async function createOrchestratedSession(args: {
  toolkit: string;
  userId: string;
  providerName: ProviderName;
  authConfigId: string;
}): Promise<OrchestratedSession> {
  const provider = await getProvider(args.providerName);
  const apiKey = readComposioApiKey();
  const composioWithProvider = new Composio({ apiKey, provider: provider as never });
  const session = (await (composioWithProvider as unknown as {
    create(userId: string, opts: { toolkits: string[]; authConfigs?: Record<string, string> }): Promise<{ tools: () => Promise<unknown[]> }>;
  }).create(args.userId, {
    toolkits: [args.toolkit],
    authConfigs: { [args.toolkit]: args.authConfigId },
  })) as { tools: () => Promise<unknown[]> };
  const tools = await session.tools();
  logInfo('composio.session.created', {
    toolkit: args.toolkit,
    userId: args.userId,
    provider: args.providerName,
    toolCount: tools.length,
  });
  return {
    toolkit: args.toolkit,
    userId: args.userId,
    providerName: args.providerName,
    provider,
    tools,
    rawSession: session,
  };
}
