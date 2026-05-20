import { request } from 'undici';
import { readComposioApiKey } from './composioClient.js';
import { allRequiredCredentialsPresentInEnv } from './credentialEnvLoader.js';
import { ComposioOrchError } from './errors.js';
import { logInfo, logWarn } from './logging.js';

export type AuthScheme =
  | 'OAUTH2'
  | 'OAUTH1'
  | 'API_KEY'
  | 'BEARER_TOKEN'
  | 'BASIC'
  | 'NO_AUTH';
export type AuthConfigType = 'use_composio_managed_auth' | 'use_custom_auth';

export interface NegotiatedScheme {
  type: AuthConfigType;
  authScheme: AuthScheme;
  toolkitSlug: string;
  authConfigCreationFields: string[];
  connectedAccountInitiationFields: string[];
  /** True when negotiator picked a credential-injection scheme over OAuth because env vars were ready. */
  preferredOverOAuth?: boolean;
}

const DEFAULT_PREFERENCE_ORDER: readonly AuthScheme[] = ['OAUTH2', 'API_KEY', 'BEARER_TOKEN', 'BASIC', 'OAUTH1'];
const NO_AUTH_SCHEMES: readonly AuthScheme[] = ['NO_AUTH'];
const TOOLKITS_BASE_URL = 'https://backend.composio.dev/api/v3.1/toolkits';

interface ToolkitAuthDetail {
  mode: AuthScheme;
  fields?: {
    auth_config_creation?: { required?: Array<{ name: string }> };
    connected_account_initiation?: { required?: Array<{ name: string }> };
  };
}

interface ToolkitDescriptor {
  slug: string;
  auth_schemes?: AuthScheme[];
  composio_managed_auth_schemes?: AuthScheme[];
  auth_config_details?: ToolkitAuthDetail[];
}

function deriveAvailableSchemes(descriptor: ToolkitDescriptor): AuthScheme[] {
  if (descriptor.auth_schemes && descriptor.auth_schemes.length > 0) return descriptor.auth_schemes;
  return (descriptor.auth_config_details ?? []).map((entry) => entry.mode);
}

async function fetchToolkitDescriptor(toolkitSlug: string): Promise<ToolkitDescriptor> {
  const apiKey = readComposioApiKey();
  const url = `${TOOLKITS_BASE_URL}/${encodeURIComponent(toolkitSlug)}`;
  const response = await request(url, { method: 'GET', headers: { 'x-api-key': apiKey } });
  const status = response.statusCode;
  const body = await response.body.text();
  if (status < 200 || status >= 300) {
    throw new ComposioOrchError('UPSTREAM', `toolkit lookup failed (${status}) for ${toolkitSlug}`, {
      hint: body.slice(0, 200),
    });
  }
  return JSON.parse(body) as ToolkitDescriptor;
}

function pickFirstSupported(preferred: readonly AuthScheme[], available: AuthScheme[] | undefined): AuthScheme | undefined {
  if (!available || available.length === 0) return undefined;
  for (const scheme of preferred) {
    if (available.includes(scheme)) return scheme;
  }
  return undefined;
}

function getInitiationFieldsForScheme(descriptor: ToolkitDescriptor, scheme: AuthScheme): string[] {
  const detail = descriptor.auth_config_details?.find((entry) => entry.mode === scheme);
  return (detail?.fields?.connected_account_initiation?.required ?? []).map((f) => f.name);
}

function getCreationFieldsForScheme(descriptor: ToolkitDescriptor, scheme: AuthScheme): string[] {
  const detail = descriptor.auth_config_details?.find((entry) => entry.mode === scheme);
  return (detail?.fields?.auth_config_creation?.required ?? []).map((f) => f.name);
}

export async function negotiateAuthScheme(toolkitSlug: string): Promise<NegotiatedScheme> {
  const descriptor = await fetchToolkitDescriptor(toolkitSlug);
  const availableSchemes = deriveAvailableSchemes(descriptor);

  // 1. NO_AUTH short-circuit — toolkit needs no credentials at all.
  if (availableSchemes.length > 0 && availableSchemes.every((s) => NO_AUTH_SCHEMES.includes(s))) {
    logInfo('composio.scheme.negotiated', { toolkit: toolkitSlug, scheme: 'NO_AUTH', type: 'managed' });
    return {
      type: 'use_composio_managed_auth',
      authScheme: 'NO_AUTH',
      toolkitSlug,
      authConfigCreationFields: [],
      connectedAccountInitiationFields: [],
    };
  }

  // 2. If the user has all required credentials in env for ANY non-OAuth scheme,
  //    prefer that over a managed OAuth flow. Saves a browser round-trip.
  for (const candidate of ['API_KEY', 'BEARER_TOKEN', 'BASIC'] as const) {
    if (!availableSchemes.includes(candidate)) continue;
    const initiationFields = getInitiationFieldsForScheme(descriptor, candidate);
    if (initiationFields.length === 0) continue;
    if (allRequiredCredentialsPresentInEnv(toolkitSlug, initiationFields)) {
      logInfo('composio.scheme.negotiated', {
        toolkit: toolkitSlug,
        scheme: candidate,
        type: 'custom',
        preferredOverOAuth: true,
      });
      return {
        type: 'use_custom_auth',
        authScheme: candidate,
        toolkitSlug,
        authConfigCreationFields: getCreationFieldsForScheme(descriptor, candidate),
        connectedAccountInitiationFields: initiationFields,
        preferredOverOAuth: true,
      };
    }
  }

  // 3. Default: prefer managed OAuth, then custom OAuth, then API_KEY, etc.
  const managedPick = pickFirstSupported(DEFAULT_PREFERENCE_ORDER, descriptor.composio_managed_auth_schemes);
  if (managedPick) {
    logInfo('composio.scheme.negotiated', { toolkit: toolkitSlug, scheme: managedPick, type: 'managed' });
    return {
      type: 'use_composio_managed_auth',
      authScheme: managedPick,
      toolkitSlug,
      authConfigCreationFields: [],
      connectedAccountInitiationFields: [],
    };
  }

  const customPick = pickFirstSupported(DEFAULT_PREFERENCE_ORDER, availableSchemes);
  if (!customPick) {
    logWarn('composio.scheme.negotiation', `no supported auth scheme for ${toolkitSlug}`, {
      toolkit: toolkitSlug,
      available: availableSchemes.join(','),
    });
    throw new ComposioOrchError('NEGOTIATION', `Toolkit "${toolkitSlug}" exposes no supported auth scheme`, {
      hint: `Available: ${JSON.stringify(availableSchemes)}`,
    });
  }
  logInfo('composio.scheme.negotiated', {
    toolkit: toolkitSlug,
    scheme: customPick,
    type: 'custom',
    configFields: getCreationFieldsForScheme(descriptor, customPick).join(','),
    initiateFields: getInitiationFieldsForScheme(descriptor, customPick).join(','),
  });
  return {
    type: 'use_custom_auth',
    authScheme: customPick,
    toolkitSlug,
    authConfigCreationFields: getCreationFieldsForScheme(descriptor, customPick),
    connectedAccountInitiationFields: getInitiationFieldsForScheme(descriptor, customPick),
  };
}
