// Maps Composio's `connected_account_initiation` required fields to env vars
// in ~/.agents/.env. Composio's field names are noisy (`generic_api_key`,
// `auth_token`, `bearer_token`, `auth_email`, ...). We accept both the
// strict literal name AND a small set of friendly aliases per field so
// users can write either `COMPOSIO_TAVILY_GENERIC_API_KEY` or the more
// natural `COMPOSIO_TAVILY_API_KEY`.
import { readEnvVar } from './composioClient.js';

export interface CredentialLookupResult {
  resolved: Record<string, string>;
  missingEnvVarNames: string[]; // first preferred name per field, for error messaging
}

const FIELD_ALIASES: Record<string, readonly string[]> = {
  generic_api_key: ['api_key', 'token'],
  generic_id: ['email', 'account_email', 'user_email'],
  api_key: ['generic_api_key'],
  api_token: ['api_key', 'token'],
  auth_token: ['api_key', 'token'],
  bearer_token: ['token', 'api_key'],
  access_token: ['token', 'api_key'],
  token: ['api_key', 'access_token'],
  auth_key: ['api_key'],
  auth_email: ['email'],
  username: ['user'],
  password: ['pass', 'secret'],
};

function upperCaseEnvSegment(input: string): string {
  return input.replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase();
}

export function envVarNameForCredentialField(toolkitSlug: string, fieldName: string): string {
  return `COMPOSIO_${upperCaseEnvSegment(toolkitSlug)}_${upperCaseEnvSegment(fieldName)}`;
}

export function envVarAliasesForCredentialField(toolkitSlug: string, fieldName: string): string[] {
  const literal = envVarNameForCredentialField(toolkitSlug, fieldName);
  const aliasNames = FIELD_ALIASES[fieldName.toLowerCase()] ?? [];
  const aliases = aliasNames.map((alias) => envVarNameForCredentialField(toolkitSlug, alias));
  return [literal, ...aliases];
}

export function lookupRequiredCredentialsFromEnv(args: {
  toolkitSlug: string;
  requiredFieldNames: string[];
}): CredentialLookupResult {
  const resolved: Record<string, string> = {};
  const missingEnvVarNames: string[] = [];
  for (const fieldName of args.requiredFieldNames) {
    const candidates = envVarAliasesForCredentialField(args.toolkitSlug, fieldName);
    let value: string | undefined;
    for (const candidate of candidates) {
      const v = readEnvVar(candidate);
      if (v) { value = v; break; }
    }
    if (value !== undefined) resolved[fieldName] = value;
    else missingEnvVarNames.push(candidates[0] ?? envVarNameForCredentialField(args.toolkitSlug, fieldName));
  }
  return { resolved, missingEnvVarNames };
}

// Returns true if every required field for this scheme has a credential in env
// (under the literal name OR any alias). Used by the negotiator to flip the
// preferred scheme away from OAuth2 toward credential-injection when the user
// has the keys ready.
export function allRequiredCredentialsPresentInEnv(toolkitSlug: string, requiredFieldNames: readonly string[]): boolean {
  if (requiredFieldNames.length === 0) return false;
  for (const fieldName of requiredFieldNames) {
    const candidates = envVarAliasesForCredentialField(toolkitSlug, fieldName);
    if (!candidates.some((c) => readEnvVar(c))) return false;
  }
  return true;
}

// Pick the env var name to *show the user* in a hint message. Prefers the
// name that's actually set right now (so a "refresh COMPOSIO_FOO_API_KEY"
// hint matches whatever line the user already has in ~/.agents/.env),
// falling back to the literal field name when nothing is set yet.
export function preferredEnvVarNameForHint(toolkitSlug: string, fieldName: string): string {
  const candidates = envVarAliasesForCredentialField(toolkitSlug, fieldName);
  for (const candidate of candidates) {
    if (readEnvVar(candidate)) return candidate;
  }
  return candidates[0] ?? envVarNameForCredentialField(toolkitSlug, fieldName);
}
