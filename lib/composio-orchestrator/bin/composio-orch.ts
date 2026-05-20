#!/usr/bin/env -S node --import tsx
import {
  ensureAuth,
  runWithToolkit,
  listPendingAuth,
  removePendingAuthByConnectedAccountId,
  reapExpiredPendingAuth,
  syncResolvedPendingAuth,
  gcStaleConnections,
  disableTokenMasking,
  setTokenMasking,
  registerOAuthCompletionTrigger,
  upsertEnvFileEntry,
  clearAuthConfigCache,
  pruneStaleAuthConfigs,
  listCachedAuthConfigs,
  selectExecutionPath,
  smokeProbeUpstreamCredential,
  VERIFY_TOOLS_BY_TOOLKIT,
  AuthRequiredError,
  ComposioOrchError,
  COMPOSIO_WEBHOOK_URL_ENV_KEY,
  lintComposioEnvVars,
  formatLintReport,
  reconcileOnce,
  createMcpConfig,
  listMcpConfigs,
  deleteMcpConfig,
  generateMcpUrl,
  attachMegatool,
  detachMegatool,
  listMegatoolAttachments,
  smokeMegatool,
  gatewayDeploy,
  gatewaySyncSecrets,
  gatewayRotateToken,
  gatewayHealthcheck,
} from '../src/index.js';
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join as pathJoin } from 'node:path';
import { resetComposioClient } from '../src/composioClient.js';
import { logError } from '../src/logging.js';
import type { ProviderName } from '../src/providerRegistry.js';

const SUPPORTED_PROVIDERS = new Set<ProviderName>(['openai', 'anthropic', 'langchain', 'openai-agents']);

function printJson(value: unknown): void {
  process.stdout.write(JSON.stringify(value, null, 2) + '\n');
}

function usageAndExit(): never {
  process.stderr.write(
    [
      'Usage: composio-orch <subcommand> [args]',
      '',
      '  ensure <toolkit> [userId]',
      '  run <toolkit> <userId> <provider> [prompt...]',
      '  verify <toolkit> [userId]            # on-demand smoke probe against upstream',
      '  pending [--user <userId>] [--clear <connectedAccountId>] [--reap-expired] [--sync]',
      '  gc [--max-age-minutes N]',
      '  cache [--list | --clear | --prune]',
      '  path <toolkit>                       # show selected execution path',
      '  mask <on|off|status>                  # set or query token masking',
      '  disable-mask                          # alias for: mask off',
      '  set-webhook-url <url>                 # upsert COMPOSIO_WEBHOOK_URL into ~/.agents/.env',
      '  register-webhook                      # POST project trigger webhook URL + cache secret',
      '  reload-key                            # drop API-key + auth-config cache',
      '  lint-env [--json]                     # scan ~/.agents/.env for malformed COMPOSIO_* vars',
      '  reconcile [--user-id <id>]            # one-tick pull: connectedAccounts + authConfigs + tool-execution logs',
      '  mcp-config create <name> --toolkits a,b,c [--allowed-tools t1,t2]',
      '  mcp-config list',
      '  mcp-config delete <serverId>',
      '  mcp-url <name-or-id> [--user-id <id>] # mint per-user MCP URL for an agent to attach to',
      '  tunnel ensure                         # bring up Cloudflare Tunnel + publish COMPOSIO_WEBHOOK_URL',
      '  gateway deploy                        # wrangler deploy of the composio-gateway Worker',
      '  gateway sync-secrets                  # push every COMPOSIO_* env to the Worker via `wrangler secret put`',
      '  gateway rotate-token                  # mint fresh COMPOSIO_GATEWAY_TOKEN, push, refresh ConvAI tool bearer',
      '  gateway healthcheck                   # hit /v1/composio/healthcheck (deep probe per connected toolkit)',
      '  gateway tail                          # stream Worker logs into ~/.local/state/composio-worker.jsonl (ECS-shaped)',
      '  elevenlabs attach-megatool <agent>    # ensure composio_anything tool + attach to agent',
      '  elevenlabs detach-megatool <agent>    # remove composio_anything from agent',
      '  elevenlabs list-megatools             # inventory: which agents have it',
      '  evals smoke <agent>                   # canary the agent + gateway end-to-end',
      '',
    ].join('\n'),
  );
  process.exit(2);
}

function readFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

async function commandEnsure(args: string[]): Promise<void> {
  const toolkit = args[0];
  const userId = args[1];
  if (!toolkit) usageAndExit();
  printJson(await ensureAuth(toolkit, userId));
}

async function commandRun(args: string[]): Promise<void> {
  const [toolkit, userId, providerName, ...promptParts] = args;
  if (!toolkit || !userId || !providerName) usageAndExit();
  if (!SUPPORTED_PROVIDERS.has(providerName as ProviderName)) {
    process.stderr.write(`Unknown provider: ${providerName}\n`);
    process.exit(2);
  }
  const result = await runWithToolkit({ toolkit, userId, providerName: providerName as ProviderName });
  // The orchestrator vaults auth + binds Composio toolkits to a provider's
  // tool-shape, but the agentic loop (drive a model -> tool_use -> execute ->
  // tool_result -> repeat) lives in the *caller* (Claude Code, Gemini CLI,
  // etc.), which already has native tool-use. Run reports binding success
  // and exits — the prompt is logged for the caller's reference.
  printJson({
    toolkit: result.toolkit,
    userId: result.userId,
    providerName: result.providerName,
    toolCount: result.toolCount,
    prompt: promptParts.join(' ') || null,
  });
}

async function commandPending(args: string[]): Promise<void> {
  const userFilter = readFlagValue(args, '--user');
  const clearId = readFlagValue(args, '--clear');
  if (clearId) {
    printJson({ cleared: await removePendingAuthByConnectedAccountId(clearId), connectedAccountId: clearId });
    return;
  }
  if (args.includes('--reap-expired')) {
    const reaped = await reapExpiredPendingAuth();
    printJson({ reapedCount: reaped.length, reaped });
    return;
  }
  if (args.includes('--sync') || args.includes('--refresh')) {
    await syncResolvedPendingAuth();
  }
  printJson(listPendingAuth(userFilter));
}

async function commandGc(args: string[]): Promise<void> {
  const maxAgeRaw = readFlagValue(args, '--max-age-minutes');
  const maxAgeMinutes = maxAgeRaw ? Number.parseInt(maxAgeRaw, 10) : undefined;
  printJson(await gcStaleConnections(maxAgeMinutes));
}

async function commandCache(args: string[]): Promise<void> {
  if (args.includes('--clear')) { printJson(await clearAuthConfigCache()); return; }
  if (args.includes('--prune')) { printJson(await pruneStaleAuthConfigs()); return; }
  printJson(listCachedAuthConfigs());
}

async function commandPath(args: string[]): Promise<void> {
  const toolkit = args[0];
  if (!toolkit) usageAndExit();
  printJson(selectExecutionPath({ toolkit }));
}

// `verify <toolkit> [userId]` — exercises the smoke probe against the live
// upstream provider for an existing connection. Surfaces real auth status
// (not the "ACTIVE-on-vault-accept" lie) so a human or watchdog can scream-
// test credentials without going through ensureAuth's deletion-on-failure
// side effects. Reports `skipped: true` if the toolkit is not in the
// VERIFY_TOOLS_BY_TOOLKIT registry.
async function commandVerify(args: string[]): Promise<void> {
  const toolkit = args[0];
  const userId = args[1];
  if (!toolkit) usageAndExit();
  const auth = await ensureAuth(toolkit, userId);
  if (auth.status !== 'ACTIVE') {
    printJson({ toolkit, status: auth.status, redirectUrl: auth.redirectUrl, hint: 'ensureAuth did not return ACTIVE; nothing to verify' });
    return;
  }
  const verifyEntry = VERIFY_TOOLS_BY_TOOLKIT[toolkit];
  const probe = await smokeProbeUpstreamCredential({
    toolkitSlug: toolkit,
    userId: auth.userId,
    connectedAccountId: auth.connectedAccountId,
  });
  printJson({
    toolkit,
    userId: auth.userId,
    connectedAccountId: auth.connectedAccountId,
    verifyTool: verifyEntry?.toolSlug ?? null,
    ok: probe.ok,
    skipped: probe.skipped,
    rejection: probe.rejection ?? null,
  });
}

async function commandMask(args: string[]): Promise<void> {
  const action = args[0] ?? 'status';
  if (action === 'on') { printJson(await setTokenMasking(true)); return; }
  if (action === 'off') { printJson(await setTokenMasking(false)); return; }
  if (action === 'status') {
    process.stderr.write('Use `mask on` or `mask off` to set; status query not yet exposed without an extra call.\n');
    process.exit(2);
  }
  usageAndExit();
}

async function commandDisableMask(): Promise<void> { printJson(await disableTokenMasking()); }

async function commandSetWebhookUrl(args: string[]): Promise<void> {
  const url = args[0];
  if (!url || !/^https?:\/\//.test(url)) {
    process.stderr.write('set-webhook-url requires an http(s) URL\n');
    process.exit(2);
  }
  await upsertEnvFileEntry(COMPOSIO_WEBHOOK_URL_ENV_KEY, url);
  printJson({ key: COMPOSIO_WEBHOOK_URL_ENV_KEY, url });
}

async function commandRegisterWebhook(args: string[]): Promise<void> {
  // Project-wide trigger webhook in v3; toolkit/userId args ignored but
  // accepted for back-compat with earlier orchestrator versions.
  void args;
  printJson(await registerOAuthCompletionTrigger({}));
}

async function commandReloadKey(): Promise<void> {
  resetComposioClient();
  const cleared = await clearAuthConfigCache();
  printJson({ reset: true, ...cleared });
}

async function commandReconcile(args: string[]): Promise<void> {
  const userId = readFlagValue(args, '--user-id');
  printJson(await reconcileOnce(userId));
}

async function commandMcpConfig(args: string[]): Promise<void> {
  const sub = args[0];
  if (sub === 'create') {
    const name = args[1];
    const toolkitsRaw = readFlagValue(args, '--toolkits');
    if (!name || !toolkitsRaw) usageAndExit();
    const allowedRaw = readFlagValue(args, '--allowed-tools');
    const toolkits = toolkitsRaw.split(',').map((s) => s.trim()).filter(Boolean);
    const allowedTools = allowedRaw ? allowedRaw.split(',').map((s) => s.trim()).filter(Boolean) : undefined;
    printJson(await createMcpConfig({ name, toolkits, allowedTools }));
    return;
  }
  if (sub === 'list') { printJson(await listMcpConfigs()); return; }
  if (sub === 'delete') {
    const id = args[1];
    if (!id) usageAndExit();
    printJson(await deleteMcpConfig(id));
    return;
  }
  usageAndExit();
}

async function commandMcpUrl(args: string[]): Promise<void> {
  const target = args[0];
  if (!target) usageAndExit();
  const userId = readFlagValue(args, '--user-id') ?? process.env.COMPOSIO_DEFAULT_USER ?? 'cody';
  printJson(await generateMcpUrl({ configIdOrName: target, userId }));
}

async function commandTunnelEnsure(): Promise<void> {
  // Delegates to scripts/bin/composio-webhook-tunnel.sh which handles
  // cloudflared install + named-tunnel bring-up + COMPOSIO_WEBHOOK_URL upsert.
  // We exec it synchronously and pipe through stdio so the user sees the
  // one interactive `cloudflared tunnel login` step if it's needed.
  const script = process.env.COMPOSIO_TUNNEL_SCRIPT
    ?? pathJoin(homedir(), '.dotfiles', 'scripts', 'bin', 'composio-webhook-tunnel.sh');
  const result = spawnSync('bash', [script], { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}

async function commandGateway(args: string[]): Promise<void> {
  const sub = args[0];
  if (sub === 'deploy') { printJson(gatewayDeploy()); return; }
  if (sub === 'sync-secrets') { printJson(gatewaySyncSecrets()); return; }
  if (sub === 'rotate-token') { printJson(await gatewayRotateToken()); return; }
  if (sub === 'healthcheck') { printJson(await gatewayHealthcheck()); return; }
  if (sub === 'tail') {
    const daemonPath = pathJoin(homedir(), '.dotfiles/lib/composio-orchestrator/daemon/workerTail.ts');
    const result = spawnSync('node', ['--import', 'tsx', daemonPath], { stdio: 'inherit' });
    process.exit(result.status ?? 1);
  }
  usageAndExit();
}

async function commandElevenLabs(args: string[]): Promise<void> {
  const sub = args[0]; const target = args[1];
  if (sub === 'attach-megatool') { if (!target) usageAndExit(); printJson(await attachMegatool(target)); return; }
  if (sub === 'detach-megatool') { if (!target) usageAndExit(); printJson(await detachMegatool(target)); return; }
  if (sub === 'list-megatools') { printJson(await listMegatoolAttachments()); return; }
  usageAndExit();
}

async function commandEvalsSmoke(args: string[]): Promise<void> {
  const agentId = args[0];
  if (!agentId) usageAndExit();
  printJson(await smokeMegatool(agentId));
}

async function commandLintEnv(args: string[]): Promise<void> {
  const report = lintComposioEnvVars();
  if (args.includes('--json')) {
    printJson(report);
  } else {
    process.stdout.write(formatLintReport(report) + '\n');
  }
  // Non-zero exit if any structurally-malformed var (doubled scheme) was
  // found. Unknown-suffix warnings are advisory and don't fail the lint so
  // operators can still run as a pre-commit hook with --warn-only semantics.
  const hasMalformed = report.findings.some((f) => f.kind === 'malformed_scheme_in_name');
  if (hasMalformed) process.exit(1);
}

async function main(): Promise<void> {
  const [subcommand, ...rest] = process.argv.slice(2);
  if (!subcommand) usageAndExit();
  switch (subcommand) {
    case 'ensure':           await commandEnsure(rest); break;
    case 'run':              await commandRun(rest); break;
    case 'pending':          await commandPending(rest); break;
    case 'gc':               await commandGc(rest); break;
    case 'cache':            await commandCache(rest); break;
    case 'path':             await commandPath(rest); break;
    case 'verify':           await commandVerify(rest); break;
    case 'mask':             await commandMask(rest); break;
    case 'disable-mask':     await commandDisableMask(); break;
    case 'set-webhook-url':  await commandSetWebhookUrl(rest); break;
    case 'register-webhook': await commandRegisterWebhook(rest); break;
    case 'reload-key':       await commandReloadKey(); break;
    case 'lint-env':         await commandLintEnv(rest); break;
    case 'reconcile':        await commandReconcile(rest); break;
    case 'mcp-config':       await commandMcpConfig(rest); break;
    case 'mcp-url':          await commandMcpUrl(rest); break;
    case 'tunnel':           if (rest[0] === 'ensure') await commandTunnelEnsure(); else usageAndExit(); break;
    case 'gateway':          await commandGateway(rest); break;
    case 'elevenlabs':       await commandElevenLabs(rest); break;
    case 'evals':            if (rest[0] === 'smoke') await commandEvalsSmoke(rest.slice(1)); else usageAndExit(); break;
    default:                 usageAndExit();
  }
}

main().catch((err: unknown) => {
  if (err instanceof AuthRequiredError) {
    printJson({
      status: 'PENDING',
      toolkit: err.toolkit,
      connectedAccountId: err.connectedAccountId,
      redirectUrl: err.redirectUrl,
      hint: err.hint,
    });
    process.exit(0);
  }
  if (err instanceof ComposioOrchError) {
    logError(`composio.cli.${err.code.toLowerCase()}`, err.message, { hint: err.hint ?? '' });
    process.stderr.write(`${err.name}[${err.code}]: ${err.message}\n`);
    if (err.hint) process.stderr.write(`Hint: ${err.hint}\n`);
    process.exit(1);
  }
  const message = err instanceof Error ? err.message : String(err);
  logError('composio.cli.unhandled', message);
  process.stderr.write(`Error: ${message}\n`);
  process.exit(1);
});
