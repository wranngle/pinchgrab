// Lazy fallback for executionPathSelector when a toolkit isn't in the
// hand-curated registry. Spawns ~/.dotfiles/scripts/bin/llm.sh with a tight
// research prompt, expects strict JSON back, caches the answer to disk
// indefinitely. On any failure, callers fall through to DEFAULT_PREFERENCE_ORDER.
//
// The cache lives at ~/.agents/state/composio-cascade-cache.json. Entries are
// keyed by toolkit slug. To force a re-research, delete the entry or run
// `composio-orch cascade --refresh <toolkit>`.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { readJsonOr, updateJsonAtomic } from './atomicJsonFile.js';
import type { ExecutionPath, ToolkitCapability } from './toolingCapabilityRegistry.js';
import { DEFAULT_PREFERENCE_ORDER } from './toolingCapabilityRegistry.js';
import { logInfo, logWarn } from './logging.js';

interface CacheFile {
  version: 1;
  entries: Record<string, ToolkitCapability & { researchedAt: string }>;
}

const EMPTY_CACHE: CacheFile = { version: 1, entries: {} };
function resolveCachePath(): string {
  return process.env.COMPOSIO_ORCH_CASCADE_CACHE
    ?? join(process.env.COMPOSIO_ORCH_STATE_DIR ?? join(homedir(), '.agents', 'state'), 'composio-cascade-cache.json');
}

function resolveLlmShPath(): string {
  return process.env.LLM_SH_PATH ?? join(homedir(), '.dotfiles', 'scripts', 'bin', 'llm.sh');
}

const RESEARCH_PROMPT_TEMPLATE = (toolkit: string) => `
Research the Composio v3 toolkit "${toolkit}" plus the underlying provider's
own docs. Decide the BEST order to invoke this provider from a TypeScript
agent on a developer workstation, choosing among:

  - "local-cli"        : an authenticated CLI binary already on PATH
  - "native-sdk"       : the provider's official npm SDK
  - "composio-toolkit" : Composio's hosted multiplexed tools
  - "mcp"              : a long-lived MCP server
  - "raw-api"          : raw HTTP

Return ONLY this exact JSON shape, no prose, no markdown:
{
  "toolkit": "${toolkit}",
  "preferredOrder": ["...", "..."],
  "localCli": { "binary": "...", "checkArgs": ["..."] } | null,
  "nativeSdkPackage": "..." | null,
  "notes": "1-line rationale"
}
`.trim();

function readCache(): CacheFile {
  return readJsonOr<CacheFile>(resolveCachePath(), EMPTY_CACHE);
}

export function getCachedCascade(toolkitSlug: string): ToolkitCapability | undefined {
  const cache = readCache();
  const entry = cache.entries[toolkitSlug.toLowerCase()];
  if (!entry) return undefined;
  return { toolkit: entry.toolkit, preferredOrder: entry.preferredOrder, localCli: entry.localCli, nativeSdkPackage: entry.nativeSdkPackage, notes: entry.notes };
}

interface ResearchedCascadeRaw {
  toolkit?: string;
  preferredOrder?: ExecutionPath[];
  localCli?: { binary?: string; checkArgs?: string[] } | null;
  nativeSdkPackage?: string | null;
  notes?: string;
}

function parseResearchOutput(raw: string): ResearchedCascadeRaw | undefined {
  // The model may wrap JSON in fences or prose despite the prompt — extract first {...} block.
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return undefined;
  try {
    return JSON.parse(match[0]) as ResearchedCascadeRaw;
  } catch {
    return undefined;
  }
}

function validateAndCoerce(raw: ResearchedCascadeRaw, toolkitSlug: string): ToolkitCapability | undefined {
  const validPaths: ExecutionPath[] = ['local-cli', 'native-sdk', 'composio-toolkit', 'mcp', 'raw-api'];
  if (!Array.isArray(raw.preferredOrder) || raw.preferredOrder.length === 0) return undefined;
  const filtered = raw.preferredOrder.filter((p) => validPaths.includes(p));
  if (filtered.length === 0) return undefined;
  return {
    toolkit: toolkitSlug.toLowerCase(),
    preferredOrder: filtered,
    localCli: raw.localCli && raw.localCli.binary ? { binary: raw.localCli.binary, checkArgs: raw.localCli.checkArgs ?? [] } : undefined,
    nativeSdkPackage: raw.nativeSdkPackage ?? undefined,
    notes: raw.notes,
  };
}

async function recordCache(capability: ToolkitCapability): Promise<void> {
  await updateJsonAtomic<CacheFile>(
    resolveCachePath(),
    (current) => ({
      version: 1,
      entries: { ...current.entries, [capability.toolkit]: { ...capability, researchedAt: new Date().toISOString() } },
    }),
    EMPTY_CACHE,
  );
}

export async function researchCascadeViaLlmSh(toolkitSlug: string, opts: { timeoutMs?: number } = {}): Promise<ToolkitCapability | undefined> {
  if (!existsSync(resolveLlmShPath())) {
    logWarn('composio.cascade.llm-missing', `${resolveLlmShPath()} not found; falling back to default order`);
    return undefined;
  }
  const cached = getCachedCascade(toolkitSlug);
  if (cached) return cached;

  const prompt = RESEARCH_PROMPT_TEMPLATE(toolkitSlug);
  const result = spawnSync(resolveLlmShPath(), ['--quiet', '--prompt', prompt], {
    timeout: opts.timeoutMs ?? 60_000,
    encoding: 'utf8',
  });
  if (result.status !== 0 || !result.stdout) {
    logWarn('composio.cascade.llm-failed', `llm.sh exit=${result.status} stderr=${(result.stderr ?? '').slice(0, 200)}`);
    return undefined;
  }
  const parsed = parseResearchOutput(result.stdout);
  if (!parsed) {
    logWarn('composio.cascade.parse-failed', `non-JSON output: ${result.stdout.slice(0, 200)}`);
    return undefined;
  }
  const validated = validateAndCoerce(parsed, toolkitSlug);
  if (!validated) {
    logWarn('composio.cascade.invalid', `parsed but invalid: ${JSON.stringify(parsed).slice(0, 200)}`);
    return undefined;
  }
  await recordCache(validated);
  logInfo('composio.cascade.researched', { toolkit: toolkitSlug, order: validated.preferredOrder.join(',') });
  return validated;
}

export function effectivePreferredOrder(toolkitSlug: string): ExecutionPath[] | undefined {
  const cached = getCachedCascade(toolkitSlug);
  if (cached) return [...cached.preferredOrder];
  return undefined;
}

export function defaultPreferredOrder(): readonly ExecutionPath[] {
  return DEFAULT_PREFERENCE_ORDER;
}
