// Resolves the best concrete execution path for a (toolkit, action) at runtime.
// Probes capabilities (CLI exists+authed? SDK installed? MCP server ready?)
// in the toolkit's preferred order and returns the first that works.
import { spawnSync } from 'node:child_process';
import { ExecutionPath, getCapability, TOOLKIT_CAPABILITIES } from './toolingCapabilityRegistry.js';
import { researchCascadeViaLlmSh, getCachedCascade } from './dynamicCascadeResearcher.js';
import { logInfo, logWarn } from './logging.js';

export interface SelectedExecutionPath {
  toolkit: string;
  path: ExecutionPath;
  reason: string;
}

function isLocalCliReady(binary: string, checkArgs?: readonly string[]): boolean {
  // `command -v` is a shell builtin — spawnSync('command') exits non-zero
  // (or null) on every platform because there's no `command` binary on PATH.
  // Use `which`, which IS a real binary on Linux/macOS/WSL, so the cascade
  // can actually see installed CLIs. Fall back to a bash login-shell probe
  // for environments that don't ship `which` (rare).
  const whichProbe = spawnSync('which', [binary], { stdio: 'pipe' });
  let onPath = whichProbe.status === 0;
  if (!onPath) {
    const fallback = spawnSync('bash', ['-lc', `command -v ${binary}`], { stdio: 'pipe', timeout: 5000 });
    onPath = fallback.status === 0;
  }
  if (!onPath) return false;
  if (!checkArgs || checkArgs.length === 0) return true;
  const probe = spawnSync(binary, [...checkArgs], { stdio: 'pipe', timeout: 5000 });
  return probe.status === 0;
}

function isPackageInstalled(packageName: string): boolean {
  try {
    require.resolve(packageName);
    return true;
  } catch {
    return false;
  }
}

function isInStaticRegistry(toolkitSlug: string): boolean {
  return TOOLKIT_CAPABILITIES.some((c) => c.toolkit === toolkitSlug.toLowerCase());
}

export async function selectExecutionPathAsync(args: {
  toolkit: string;
  available?: { mcp?: boolean; composio?: boolean };
}): Promise<SelectedExecutionPath> {
  // Try llm.sh-researched cache first if no static entry exists.
  if (!isInStaticRegistry(args.toolkit)) {
    const cached = getCachedCascade(args.toolkit);
    if (!cached) {
      try { await researchCascadeViaLlmSh(args.toolkit); }
      catch (err) { logWarn('composio.path.research-failed', (err as Error).message); }
    }
  }
  return selectExecutionPath(args);
}

export function selectExecutionPath(args: { toolkit: string; available?: { mcp?: boolean; composio?: boolean } }): SelectedExecutionPath {
  const dynamic = getCachedCascade(args.toolkit);
  const capability = dynamic ?? getCapability(args.toolkit);
  for (const candidate of capability.preferredOrder) {
    if (candidate === 'local-cli' && capability.localCli && isLocalCliReady(capability.localCli.binary, capability.localCli.checkArgs)) {
      logInfo('composio.path.selected', { toolkit: args.toolkit, path: candidate });
      return { toolkit: args.toolkit, path: candidate, reason: `${capability.localCli.binary} present and authed` };
    }
    if (candidate === 'native-sdk' && capability.nativeSdkPackage && isPackageInstalled(capability.nativeSdkPackage)) {
      logInfo('composio.path.selected', { toolkit: args.toolkit, path: candidate });
      return { toolkit: args.toolkit, path: candidate, reason: `${capability.nativeSdkPackage} installed` };
    }
    if (candidate === 'composio-toolkit' && (args.available?.composio ?? true)) {
      logInfo('composio.path.selected', { toolkit: args.toolkit, path: candidate });
      return { toolkit: args.toolkit, path: candidate, reason: 'composio toolkit available' };
    }
    if (candidate === 'mcp' && args.available?.mcp) {
      logInfo('composio.path.selected', { toolkit: args.toolkit, path: candidate });
      return { toolkit: args.toolkit, path: candidate, reason: 'mcp server registered' };
    }
    if (candidate === 'raw-api') {
      logInfo('composio.path.selected', { toolkit: args.toolkit, path: candidate });
      return { toolkit: args.toolkit, path: candidate, reason: 'raw HTTP fallback' };
    }
  }
  logWarn('composio.path.no-fallback', `no execution path found for ${args.toolkit}`);
  return { toolkit: args.toolkit, path: 'raw-api', reason: 'no candidate matched; defaulted to raw-api' };
}
