// Per-toolkit "what's the fastest way to actually invoke this thing" registry.
//
// The user's call site says: "I want my agent to use whatever is best —
// a local CLI like `gh` is faster than HTTP for git ops; an SDK call beats
// shelling out when both exist; a Composio toolkit beats raw HTTP because
// of auth multiplexing; raw HTTP beats nothing." We don't pick at runtime
// for the agent — we expose the *order* and let the caller (or a future
// runWithToolkit branch) choose deterministically.
//
// Entries are intentionally small + hand-curated. The default order
// applies when a toolkit has no entry. Add a new toolkit by appending
// here; no network calls.

export type ExecutionPath = 'local-cli' | 'native-sdk' | 'composio-toolkit' | 'mcp' | 'raw-api';

export interface ToolkitCapability {
  toolkit: string;
  preferredOrder: readonly ExecutionPath[];
  localCli?: { binary: string; checkArgs?: readonly string[] };
  nativeSdkPackage?: string;
  notes?: string;
}

export const DEFAULT_PREFERENCE_ORDER: readonly ExecutionPath[] = [
  'local-cli',
  'native-sdk',
  'composio-toolkit',
  'mcp',
  'raw-api',
];

export const TOOLKIT_CAPABILITIES: readonly ToolkitCapability[] = [
  {
    toolkit: 'github',
    preferredOrder: ['local-cli', 'native-sdk', 'composio-toolkit', 'raw-api'],
    localCli: { binary: 'gh', checkArgs: ['auth', 'status'] },
    nativeSdkPackage: '@octokit/rest',
    notes: 'gh CLI handles auth via system keyring; faster than HTTP for repo/PR ops',
  },
  {
    toolkit: 'slack',
    preferredOrder: ['composio-toolkit', 'native-sdk', 'raw-api'],
    nativeSdkPackage: '@slack/web-api',
    notes: 'No first-party CLI; Composio handles workspace OAuth uniformly',
  },
  {
    toolkit: 'gmail',
    preferredOrder: ['composio-toolkit', 'native-sdk', 'raw-api'],
    nativeSdkPackage: 'googleapis',
    notes: 'Composio handles refresh tokens; SDK requires manual OAuth dance',
  },
  {
    toolkit: 'notion',
    preferredOrder: ['composio-toolkit', 'native-sdk', 'raw-api'],
    nativeSdkPackage: '@notionhq/client',
  },
  {
    toolkit: 'linear',
    preferredOrder: ['composio-toolkit', 'native-sdk', 'raw-api'],
    nativeSdkPackage: '@linear/sdk',
  },
  {
    toolkit: 'perplexityai',
    preferredOrder: ['raw-api', 'composio-toolkit'],
    notes: 'Single-endpoint REST API; raw fetch is simplest and lowest latency',
  },
  {
    toolkit: 'cloudflare',
    preferredOrder: ['local-cli', 'composio-toolkit', 'native-sdk', 'raw-api'],
    localCli: { binary: 'wrangler', checkArgs: ['whoami'] },
    nativeSdkPackage: 'cloudflare',
  },
  {
    toolkit: 'aws',
    preferredOrder: ['local-cli', 'native-sdk', 'composio-toolkit'],
    localCli: { binary: 'aws', checkArgs: ['sts', 'get-caller-identity'] },
    nativeSdkPackage: '@aws-sdk/client-sts',
    notes: 'aws CLI uses IAM role / SSO chain; do not use Composio when local creds work',
  },
  {
    toolkit: 'gcp',
    preferredOrder: ['local-cli', 'native-sdk', 'composio-toolkit'],
    localCli: { binary: 'gcloud', checkArgs: ['auth', 'list'] },
    nativeSdkPackage: 'googleapis',
  },
  {
    toolkit: 'docker',
    preferredOrder: ['local-cli', 'raw-api'],
    localCli: { binary: 'docker', checkArgs: ['version'] },
  },
];

export function getCapability(toolkit: string): ToolkitCapability {
  const found = TOOLKIT_CAPABILITIES.find((c) => c.toolkit === toolkit.toLowerCase());
  if (found) return found;
  return { toolkit, preferredOrder: DEFAULT_PREFERENCE_ORDER };
}

export function getPreferredOrder(toolkit: string): readonly ExecutionPath[] {
  return getCapability(toolkit).preferredOrder;
}
