import { ComposioOrchError } from './errors.js';

export type ProviderName = 'openai' | 'anthropic' | 'langchain' | 'openai-agents';

export interface ComposioProviderInstance {
  readonly name?: string;
  readonly handleToolCalls?: (...args: unknown[]) => Promise<unknown>;
}

const PROVIDER_PACKAGE_NAMES: Record<ProviderName, string> = {
  openai: '@composio/openai',
  anthropic: '@composio/anthropic',
  langchain: '@composio/langchain',
  'openai-agents': '@composio/openai-agents',
};

const PROVIDER_CLASS_NAMES: Record<ProviderName, string> = {
  openai: 'OpenAIProvider',
  anthropic: 'AnthropicProvider',
  langchain: 'LangChainProvider',
  'openai-agents': 'OpenAIAgentsProvider',
};

export async function getProvider(name: ProviderName): Promise<ComposioProviderInstance> {
  const packageName = PROVIDER_PACKAGE_NAMES[name];
  const className = PROVIDER_CLASS_NAMES[name];
  if (!packageName || !className) {
    throw new ComposioOrchError('PROVIDER', `Unknown provider "${name}"`);
  }
  let mod: Record<string, unknown>;
  try {
    mod = (await import(packageName)) as Record<string, unknown>;
  } catch (cause) {
    throw new ComposioOrchError('PROVIDER', `Provider package "${packageName}" not installed`, {
      hint: `Run: npm install ${packageName} --legacy-peer-deps`,
      cause,
    });
  }
  const ProviderCtor = mod[className] as undefined | (new () => ComposioProviderInstance);
  if (!ProviderCtor) {
    throw new ComposioOrchError('PROVIDER', `Package "${packageName}" does not export "${className}"`);
  }
  return new ProviderCtor();
}
