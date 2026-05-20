import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  envVarNameForCredentialField,
  envVarAliasesForCredentialField,
  lookupRequiredCredentialsFromEnv,
  allRequiredCredentialsPresentInEnv,
  preferredEnvVarNameForHint,
} from '../src/credentialEnvLoader.js';

let tempDir: string;
let envPath: string;
let originalEnvPath: string | undefined;

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'composio-cred-test-'));
  envPath = join(tempDir, '.env');
  originalEnvPath = process.env.COMPOSIO_ORCH_ENV_FILE;
  process.env.COMPOSIO_ORCH_ENV_FILE = envPath;
  // Wipe relevant process.env keys so file is the source of truth
  for (const k of Object.keys(process.env)) {
    if (k.startsWith('COMPOSIO_TAVILY_') || k.startsWith('COMPOSIO_CLOUDFLARE_') || k.startsWith('COMPOSIO_LINEAR_')) {
      delete process.env[k];
    }
  }
});

afterEach(() => {
  if (originalEnvPath === undefined) delete process.env.COMPOSIO_ORCH_ENV_FILE;
  else process.env.COMPOSIO_ORCH_ENV_FILE = originalEnvPath;
  rmSync(tempDir, { recursive: true, force: true });
});

describe('credentialEnvLoader', () => {
  it('envVarNameForCredentialField uppercases + replaces hyphens', () => {
    expect(envVarNameForCredentialField('cloudflare_api_key', 'generic_api_key'))
      .toBe('COMPOSIO_CLOUDFLARE_API_KEY_GENERIC_API_KEY');
  });

  it('envVarAliasesForCredentialField returns canonical first then aliases', () => {
    const aliases = envVarAliasesForCredentialField('tavily', 'generic_api_key');
    expect(aliases[0]).toBe('COMPOSIO_TAVILY_GENERIC_API_KEY');
    expect(aliases).toContain('COMPOSIO_TAVILY_API_KEY');
    expect(aliases).toContain('COMPOSIO_TAVILY_TOKEN');
  });

  it('lookupRequiredCredentialsFromEnv finds via canonical name', () => {
    writeFileSync(envPath, 'COMPOSIO_TAVILY_GENERIC_API_KEY=tk-canonical\n');
    const result = lookupRequiredCredentialsFromEnv({ toolkitSlug: 'tavily', requiredFieldNames: ['generic_api_key'] });
    expect(result.resolved.generic_api_key).toBe('tk-canonical');
    expect(result.missingEnvVarNames).toEqual([]);
  });

  it('lookupRequiredCredentialsFromEnv finds via alias name', () => {
    writeFileSync(envPath, 'COMPOSIO_TAVILY_API_KEY=tk-via-alias\n');
    const result = lookupRequiredCredentialsFromEnv({ toolkitSlug: 'tavily', requiredFieldNames: ['generic_api_key'] });
    expect(result.resolved.generic_api_key).toBe('tk-via-alias');
    expect(result.missingEnvVarNames).toEqual([]);
  });

  it('reports the canonical missing name when no candidate matches', () => {
    writeFileSync(envPath, '');
    const result = lookupRequiredCredentialsFromEnv({ toolkitSlug: 'tavily', requiredFieldNames: ['generic_api_key'] });
    expect(result.missingEnvVarNames).toEqual(['COMPOSIO_TAVILY_GENERIC_API_KEY']);
  });

  it('allRequiredCredentialsPresentInEnv true only when every field has a candidate', () => {
    writeFileSync(envPath, 'COMPOSIO_LINEAR_API_KEY=lin\n');
    expect(allRequiredCredentialsPresentInEnv('linear', ['api_key'])).toBe(true);
    expect(allRequiredCredentialsPresentInEnv('linear', ['api_key', 'workspace_id'])).toBe(false);
  });

  it('preferredEnvVarNameForHint surfaces the alias the user actually has set', () => {
    // Real bug: groqcloud requires field `generic_api_key`. The user had
    // `COMPOSIO_GROQCLOUD_API_KEY` (alias) set but the upstream-rejected hint
    // pointed them at `COMPOSIO_GROQCLOUD_GENERIC_API_KEY`, leaving them
    // editing the wrong line. Hint must surface the var that's actually set.
    writeFileSync(envPath, 'COMPOSIO_GROQCLOUD_API_KEY=set-via-alias\n');
    expect(preferredEnvVarNameForHint('groqcloud', 'generic_api_key'))
      .toBe('COMPOSIO_GROQCLOUD_API_KEY');
  });

  it('preferredEnvVarNameForHint falls back to canonical when nothing is set', () => {
    writeFileSync(envPath, '');
    expect(preferredEnvVarNameForHint('tavily', 'generic_api_key'))
      .toBe('COMPOSIO_TAVILY_GENERIC_API_KEY');
  });
});
