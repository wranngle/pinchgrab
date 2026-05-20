import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

vi.mock('undici', () => ({ request: vi.fn() }));

import { request } from 'undici';
import { negotiateAuthScheme } from '../src/authSchemeNegotiator.js';

const mockRequest = request as unknown as ReturnType<typeof vi.fn>;
let tempDir: string;
let originalEnvPath: string | undefined;

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'composio-neg-test-'));
  originalEnvPath = process.env.COMPOSIO_ORCH_ENV_FILE;
  process.env.COMPOSIO_ORCH_ENV_FILE = join(tempDir, '.env');
  process.env.COMPOSIO_API_KEY = 'test-key';
  for (const k of Object.keys(process.env)) {
    if (k.startsWith('COMPOSIO_LINEAR_') || k.startsWith('COMPOSIO_TAVILY_') || k.startsWith('COMPOSIO_GH_')) delete process.env[k];
  }
  mockRequest.mockReset();
});

afterEach(() => {
  if (originalEnvPath === undefined) delete process.env.COMPOSIO_ORCH_ENV_FILE;
  else process.env.COMPOSIO_ORCH_ENV_FILE = originalEnvPath;
  rmSync(tempDir, { recursive: true, force: true });
  mockRequest.mockReset();
});

function mockToolkitResponse(body: unknown): void {
  mockRequest.mockResolvedValueOnce({
    statusCode: 200,
    body: { text: async () => JSON.stringify(body) },
  });
}

describe('negotiateAuthScheme: scheme selection', () => {
  it('prefers managed OAuth2 when available', async () => {
    mockToolkitResponse({
      slug: 'github',
      auth_schemes: ['OAUTH2', 'BEARER_TOKEN'],
      composio_managed_auth_schemes: ['OAUTH2'],
    });
    const result = await negotiateAuthScheme('github');
    expect(result).toMatchObject({ type: 'use_composio_managed_auth', authScheme: 'OAUTH2' });
  });

  it('falls back to custom_auth API_KEY when no managed OAuth', async () => {
    mockToolkitResponse({
      slug: 'perplexityai',
      auth_schemes: ['API_KEY'],
      composio_managed_auth_schemes: [],
      auth_config_details: [{ mode: 'API_KEY', fields: { auth_config_creation: { required: [{ name: 'api_key' }] } } }],
    });
    const result = await negotiateAuthScheme('perplexityai');
    expect(result).toMatchObject({ type: 'use_custom_auth', authScheme: 'API_KEY' });
    expect(result.connectedAccountInitiationFields).toEqual([]);
    expect(result.authConfigCreationFields).toEqual(['api_key']);
  });

  it('returns NO_AUTH ACTIVE shape when toolkit only exposes NO_AUTH', async () => {
    mockToolkitResponse({
      slug: 'hackernews',
      auth_schemes: ['NO_AUTH'],
      composio_managed_auth_schemes: [],
      auth_config_details: [{ mode: 'NO_AUTH' }],
    });
    const result = await negotiateAuthScheme('hackernews');
    expect(result.authScheme).toBe('NO_AUTH');
    expect(result.type).toBe('use_composio_managed_auth');
  });

  it('flips to API_KEY when env vars are present, even when managed OAUTH2 is offered', async () => {
    writeFileSync(join(tempDir, '.env'), 'COMPOSIO_LINEAR_API_KEY=lin_test\n');
    mockToolkitResponse({
      slug: 'linear',
      auth_schemes: ['OAUTH2', 'API_KEY'],
      composio_managed_auth_schemes: ['OAUTH2'],
      auth_config_details: [
        { mode: 'API_KEY', fields: { connected_account_initiation: { required: [{ name: 'api_key' }] } } },
        { mode: 'OAUTH2', fields: {} },
      ],
    });
    const result = await negotiateAuthScheme('linear');
    expect(result.authScheme).toBe('API_KEY');
    expect(result.type).toBe('use_custom_auth');
    expect(result.preferredOverOAuth).toBe(true);
  });

  it('keeps managed OAUTH2 when no env vars are present', async () => {
    writeFileSync(join(tempDir, '.env'), '');
    mockToolkitResponse({
      slug: 'github',
      auth_schemes: ['OAUTH2'],
      composio_managed_auth_schemes: ['OAUTH2'],
    });
    const result = await negotiateAuthScheme('github');
    expect(result.authScheme).toBe('OAUTH2');
    expect(result.type).toBe('use_composio_managed_auth');
    expect(result.preferredOverOAuth).toBeUndefined();
  });

  it('throws NEGOTIATION when no supported scheme exists', async () => {
    mockToolkitResponse({ slug: 'weird', auth_schemes: ['UNKNOWN'], composio_managed_auth_schemes: [] });
    await expect(negotiateAuthScheme('weird')).rejects.toThrow(/no supported auth scheme/i);
  });

  it('throws UPSTREAM on non-2xx', async () => {
    mockRequest.mockResolvedValueOnce({
      statusCode: 404,
      body: { text: async () => '{"error":"not found"}' },
    });
    await expect(negotiateAuthScheme('nope')).rejects.toThrow(/toolkit lookup failed/i);
  });
});
