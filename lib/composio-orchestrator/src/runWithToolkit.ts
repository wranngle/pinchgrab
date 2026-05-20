import { ensureAuth } from './ensureAuth.js';
import { createOrchestratedSession, type OrchestratedSession } from './sessionFactory.js';
import { AuthRequiredError } from './errors.js';
import type { ProviderName } from './providerRegistry.js';

export interface RunWithToolkitResult {
  toolkit: string;
  userId: string;
  providerName: ProviderName;
  toolCount: number;
  tools: unknown[];
  session: OrchestratedSession;
}

export async function runWithToolkit(args: {
  toolkit: string;
  userId: string;
  providerName: ProviderName;
}): Promise<RunWithToolkitResult> {
  const auth = await ensureAuth(args.toolkit, args.userId);
  if (auth.status === 'PENDING') {
    throw new AuthRequiredError({
      toolkit: args.toolkit,
      connectedAccountId: auth.connectedAccountId,
      redirectUrl: auth.redirectUrl,
    });
  }
  const session = await createOrchestratedSession({
    toolkit: args.toolkit,
    userId: args.userId,
    providerName: args.providerName,
    authConfigId: auth.authConfigId,
  });
  return {
    toolkit: args.toolkit,
    userId: args.userId,
    providerName: args.providerName,
    toolCount: session.tools.length,
    tools: session.tools,
    session,
  };
}
