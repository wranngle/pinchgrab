import { describe, expect, it } from 'vitest';
import { getProvider, type ProviderName } from '../src/providerRegistry.js';

const PROVIDER_NAMES: ProviderName[] = ['openai', 'anthropic', 'langchain', 'openai-agents'];

describe('getProvider: load-or-PROVIDER-error contract', () => {
  for (const name of PROVIDER_NAMES) {
    it(`getProvider("${name}") returns an instance OR throws PROVIDER if package missing`, async () => {
      try {
        const provider = await getProvider(name);
        expect(provider).toBeDefined();
      } catch (err) {
        // ComposioOrchError carries .code = 'PROVIDER' when the package isn't installed.
        const code = (err as { code?: string }).code;
        expect(code).toBe('PROVIDER');
      }
    });
  }
});
