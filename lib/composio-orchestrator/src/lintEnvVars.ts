// Static linter for COMPOSIO_* env vars in ~/.agents/.env. The orchestrator's
// canonical shape is `COMPOSIO_<TOOLKIT>_<FIELD>` — never with the scheme
// inserted (no `_API_KEY_GENERIC_API_KEY`, no `_OAUTH2_*`, etc.). Operators
// occasionally hand-type a malformed name after seeing the auth-config label
// (e.g. `cloudflare:API_KEY:use_custom_auth`) and intuit the shape wrong.
// This silently breaks credential injection: the orchestrator's loader
// expects `COMPOSIO_CLOUDFLARE_GENERIC_API_KEY`; a malformed
// `COMPOSIO_CLOUDFLARE_API_KEY_GENERIC_API_KEY` is invisible to it.
//
// This linter is *static* (no upstream Composio fetch): it spots the doubled-
// scheme pattern by structural inspection of the var name. Use
// `composio-orch ensure <toolkit>` to verify a specific toolkit is wired up
// end-to-end.
import { existsSync, readFileSync } from 'node:fs';
import { resolveAgentsEnvFilePath } from './statePaths.js';

// Canonical reserved names that are NOT toolkit-scoped credentials. Skip them.
const RESERVED_GLOBAL_KEYS: ReadonlySet<string> = new Set([
  'COMPOSIO_API_KEY',
  'COMPOSIO_DEFAULT_USER',
  'COMPOSIO_WEBHOOK_URL',
  'COMPOSIO_WEBHOOK_SECRET',
  'COMPOSIO_WEBHOOK_HOST',
  'COMPOSIO_WEBHOOK_PORT',
  'COMPOSIO_SINGLE_USER_MODE',
  'COMPOSIO_DISABLE_SMOKE_PROBE',
  'COMPOSIO_GC_MAX_AGE_MINUTES',
  'COMPOSIO_ORCH_STATE_DIR',
  'COMPOSIO_ORCH_LOG_FILE',
  'COMPOSIO_ORCH_ENV_FILE',
  'COMPOSIO_ORCH_CASCADE_CACHE',
]);

// Auth-scheme tokens that should NEVER appear between the toolkit slug and
// the field name. If a var has `_<scheme>_<field>` shape, it's malformed.
const SCHEME_TOKENS: readonly string[] = ['API_KEY', 'OAUTH2', 'OAUTH1', 'BEARER_TOKEN', 'BASIC', 'NO_AUTH'];

// Field tokens the loader recognizes (canonical + common aliases). A
// well-formed var ends with one of these. Used only to flag *suspicious*
// names that don't match anything (low-confidence "orphaned" warning).
const KNOWN_FIELD_SUFFIXES: readonly string[] = [
  'GENERIC_API_KEY',
  'GENERIC_ID',
  'API_KEY',
  'API_TOKEN',
  'AUTH_TOKEN',
  'BEARER_TOKEN',
  'ACCESS_TOKEN',
  'TOKEN',
  'AUTH_KEY',
  'AUTH_EMAIL',
  'EMAIL',
  'ACCOUNT_EMAIL',
  'USER_EMAIL',
  'USERNAME',
  'USER',
  'PASSWORD',
  'PASS',
  'SECRET',
  'ACCOUNT_SID',
];

export type LintFinding =
  | { kind: 'malformed_scheme_in_name'; key: string; scheme: string; suggested: string }
  | { kind: 'unknown_suffix'; key: string };

export interface LintReport {
  envFilePath: string;
  scanned: number;
  findings: LintFinding[];
}

interface ParsedKey {
  raw: string;
  segments: string[]; // e.g. ['COMPOSIO','CLOUDFLARE','API','KEY','GENERIC','API','KEY']
}

function parseEnvKeysFromFile(filePath: string): string[] {
  if (!existsSync(filePath)) return [];
  const text = readFileSync(filePath, 'utf8');
  const keys: string[] = [];
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) continue;
    const key = line.slice(0, equalsIndex).trim();
    if (key.startsWith('COMPOSIO_')) keys.push(key);
  }
  return keys;
}

function detectMalformedSchemeInsertion(parsed: ParsedKey): LintFinding | undefined {
  // Strategy: a malformed name has the doubled-scheme shape, where the
  // suffix's first token also appears earlier in the name as a scheme token.
  // Examples: `COMPOSIO_CLOUDFLARE_API_KEY_GENERIC_API_KEY` (API_KEY scheme +
  // GENERIC_API_KEY field), `COMPOSIO_FOO_OAUTH2_OAUTH2_TOKEN` (OAUTH2 +
  // OAUTH2_TOKEN — unlikely but symmetrical).
  for (const scheme of SCHEME_TOKENS) {
    const needle = `_${scheme}_`;
    const after = parsed.raw.indexOf(needle);
    if (after === -1) continue;
    // Only flag if the scheme token sits between the toolkit slug and a
    // recognizable field suffix — otherwise `COMPOSIO_TWILIO_ACCOUNT_SID`
    // would false-positive on `BASIC` (it doesn't, but illustrate).
    const tail = parsed.raw.slice(after + needle.length);
    const headHasUnderscore = parsed.raw.slice(0, after).indexOf('_', 'COMPOSIO_'.length) === -1;
    if (!headHasUnderscore) continue;
    if (KNOWN_FIELD_SUFFIXES.some((sfx) => tail === sfx)) {
      const suggested = `${parsed.raw.slice(0, after)}_${tail}`;
      return { kind: 'malformed_scheme_in_name', key: parsed.raw, scheme, suggested };
    }
  }
  return undefined;
}

function detectUnknownSuffix(parsed: ParsedKey): LintFinding | undefined {
  // Soft check: warn if the var doesn't end in any known field suffix. Likely
  // an alias the loader doesn't recognize (operator may have made up a name).
  for (const sfx of KNOWN_FIELD_SUFFIXES) {
    if (parsed.raw.endsWith(`_${sfx}`)) return undefined;
  }
  return { kind: 'unknown_suffix', key: parsed.raw };
}

export function lintComposioEnvVars(): LintReport {
  const envFilePath = resolveAgentsEnvFilePath();
  const keys = parseEnvKeysFromFile(envFilePath);
  const findings: LintFinding[] = [];
  for (const key of keys) {
    if (RESERVED_GLOBAL_KEYS.has(key)) continue;
    const parsed: ParsedKey = { raw: key, segments: key.split('_') };
    const malformed = detectMalformedSchemeInsertion(parsed);
    if (malformed) {
      findings.push(malformed);
      continue;
    }
    const unknown = detectUnknownSuffix(parsed);
    if (unknown) findings.push(unknown);
  }
  return { envFilePath, scanned: keys.length, findings };
}

export function formatLintReport(report: LintReport): string {
  if (report.findings.length === 0) {
    return `composio-orch lint-env: clean (${report.scanned} COMPOSIO_* vars in ${report.envFilePath})`;
  }
  const lines: string[] = [];
  lines.push(`composio-orch lint-env: ${report.findings.length} finding(s) in ${report.envFilePath}`);
  for (const finding of report.findings) {
    if (finding.kind === 'malformed_scheme_in_name') {
      lines.push(`  [malformed] ${finding.key}`);
      lines.push(`              scheme token "${finding.scheme}" is between toolkit and field; rename to:`);
      lines.push(`              ${finding.suggested}`);
    } else {
      lines.push(`  [unknown-suffix] ${finding.key} (no recognized field; check loader aliases)`);
    }
  }
  lines.push('');
  lines.push('Canonical shape: COMPOSIO_<TOOLKIT>_<FIELD>  (NOT  COMPOSIO_<TOOLKIT>_<SCHEME>_<FIELD>)');
  lines.push('After fixing, run: composio-orch reload-key');
  return lines.join('\n');
}
