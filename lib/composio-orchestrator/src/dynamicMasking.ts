// Dynamic per-call masking control. Composio only exposes a global toggle
// at /api/v3.1/org/project/config, so this helper PATCHes the setting
// before invoking `fn` and restores the prior state in `finally`. Callers
// that need raw secrets briefly should wrap the smallest possible scope —
// the toggle is project-wide and any other process touching the API while
// it's flipped will also see raw secrets.
import { request } from 'undici';
import { readComposioApiKey } from './composioClient.js';
import { ComposioOrchError } from './errors.js';
import { logInfo, logWarn } from './logging.js';

const PROJECT_SETTINGS_URL = 'https://backend.composio.dev/api/v3.1/org/project/config';

interface ProjectSettingsResponse {
  mask_secret_keys_in_connected_account?: boolean;
  maskSecretKeysInConnectedAccount?: boolean;
}

async function fetchMaskingState(): Promise<boolean | undefined> {
  const apiKey = readComposioApiKey();
  const response = await request(PROJECT_SETTINGS_URL, { method: 'GET', headers: { 'x-api-key': apiKey } });
  if (response.statusCode < 200 || response.statusCode >= 300) {
    logWarn('composio.mask.read', `failed to read project settings (${response.statusCode})`);
    return undefined;
  }
  const parsed = (await response.body.json()) as ProjectSettingsResponse;
  return parsed.mask_secret_keys_in_connected_account ?? parsed.maskSecretKeysInConnectedAccount;
}

async function setMaskingState(enabled: boolean): Promise<void> {
  const apiKey = readComposioApiKey();
  const response = await request(PROJECT_SETTINGS_URL, {
    method: 'PATCH',
    headers: { 'x-api-key': apiKey, 'content-type': 'application/json' },
    body: JSON.stringify({ mask_secret_keys_in_connected_account: enabled }),
  });
  if (response.statusCode < 200 || response.statusCode >= 300) {
    const body = await response.body.text();
    throw new ComposioOrchError('UPSTREAM', `set-masking failed (${response.statusCode})`, { hint: body.slice(0, 200) });
  }
  logInfo('composio.mask.set', { enabled });
}

export async function withMaskingDisabled<T>(fn: () => Promise<T>): Promise<T> {
  const previous = await fetchMaskingState();
  if (previous !== false) await setMaskingState(false);
  try {
    return await fn();
  } finally {
    if (previous === true) {
      try { await setMaskingState(true); } catch (err) {
        logWarn('composio.mask.restore', `failed to restore masking=true: ${(err as Error).message}`);
      }
    }
  }
}

export async function withMaskingEnabled<T>(fn: () => Promise<T>): Promise<T> {
  const previous = await fetchMaskingState();
  if (previous !== true) await setMaskingState(true);
  try {
    return await fn();
  } finally {
    if (previous === false) {
      try { await setMaskingState(false); } catch (err) {
        logWarn('composio.mask.restore', `failed to restore masking=false: ${(err as Error).message}`);
      }
    }
  }
}

export async function setTokenMasking(enabled: boolean): Promise<{ alreadyAtState: boolean }> {
  const previous = await fetchMaskingState();
  if (previous === enabled) {
    logInfo('composio.mask.set', { alreadyAtState: true, enabled });
    return { alreadyAtState: true };
  }
  await setMaskingState(enabled);
  return { alreadyAtState: false };
}
