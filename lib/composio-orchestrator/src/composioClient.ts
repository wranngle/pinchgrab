import { Composio } from '@composio/core';
import { readEnvFileEntry } from './envFileMutator.js';
import { ComposioOrchError } from './errors.js';

let composioSingleton: InstanceType<typeof Composio> | undefined;
let cachedApiKey: string | undefined;

export function readComposioApiKey(): string {
  if (cachedApiKey) return cachedApiKey;
  const fromProcess = process.env.COMPOSIO_API_KEY;
  if (fromProcess) {
    cachedApiKey = fromProcess;
    return cachedApiKey;
  }
  const fromFile = readEnvFileEntry('COMPOSIO_API_KEY');
  if (!fromFile) {
    throw new ComposioOrchError('CONFIG', 'COMPOSIO_API_KEY is not set', {
      hint: 'Add COMPOSIO_API_KEY=<key> to ~/.agents/.env or export it',
    });
  }
  cachedApiKey = fromFile;
  return cachedApiKey;
}

export function readEnvVar(name: string): string | undefined {
  return process.env[name] ?? readEnvFileEntry(name);
}

export function getComposioClient(): InstanceType<typeof Composio> {
  if (composioSingleton) return composioSingleton;
  const apiKey = readComposioApiKey();
  composioSingleton = new Composio({ apiKey });
  return composioSingleton;
}

export function resetComposioClient(): void {
  composioSingleton = undefined;
  cachedApiKey = undefined;
}

import { logInfo } from './logging.js';
export function resetAndLogClient(): void {
  resetComposioClient();
  logInfo('composio.client.reset', {});
}
