// ElevenLabs ConvAI helpers for the universal-Composio-tool ("megatool") pattern.
// Talks to ElevenLabs API directly (not via Composio's ELEVENLABS_* tools) because
// Composio's CREATE_CONVAI_TOOL swallows validation errors. Direct API gives clean
// 4xx with field-level detail.
import { request } from 'undici';
import { readEnvVar } from './composioClient.js';
import { ComposioOrchError } from './errors.js';
import { logInfo, logWarn } from './logging.js';

const ELEVENLABS_API = 'https://api.elevenlabs.io/v1';
const MEGATOOL_NAME = 'composio_anything';

function getElevenLabsKey(): string {
  const key = readEnvVar('ELEVENLABS_API_KEY');
  if (!key) throw new ComposioOrchError('CONFIG', 'ELEVENLABS_API_KEY not in ~/.agents/.env');
  return key;
}

function getGatewayUrl(): string {
  const url = readEnvVar('COMPOSIO_WEBHOOK_URL');
  if (!url) throw new ComposioOrchError('CONFIG', 'COMPOSIO_WEBHOOK_URL not set — deploy the Worker first');
  return url.replace(/\/$/, '');
}

function getGatewayToken(): string {
  const t = readEnvVar('COMPOSIO_GATEWAY_TOKEN');
  if (!t) throw new ComposioOrchError('CONFIG', 'COMPOSIO_GATEWAY_TOKEN not set — run gateway rotate-token');
  return t;
}

interface ElevenLabsTool {
  id: string;
  tool_config: {
    type: string;
    name: string;
    description: string;
    api_schema?: { url?: string; method?: string; request_headers?: Record<string, string> };
  };
}

async function elevenLabsRequest(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, body?: unknown): Promise<unknown> {
  const headers: Record<string, string> = { 'xi-api-key': getElevenLabsKey() };
  if (body !== undefined) headers['content-type'] = 'application/json';
  const res = await request(`${ELEVENLABS_API}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.body.text();
  if (res.statusCode < 200 || res.statusCode >= 300) {
    throw new ComposioOrchError('UPSTREAM', `ElevenLabs ${method} ${path} failed ${res.statusCode}: ${text.slice(0, 300)}`);
  }
  return text ? JSON.parse(text) : {};
}

function megatoolToolConfig(): unknown {
  return {
    type: 'webhook',
    name: MEGATOOL_NAME,
    description: 'Universal Composio tool gateway. Pass a Composio tool slug (e.g. GITHUB_CREATE_ISSUE, GMAIL_FETCH_EMAILS, SLACK_SENDS_A_MESSAGE_TO_A_SLACK_CHANNEL) and tool args to execute it on behalf of the operator. Returns the Composio tool result.',
    response_timeout_secs: 20,
    api_schema: {
      url: `${getGatewayUrl()}/v1/composio/execute`,
      method: 'POST',
      request_headers: { Authorization: `Bearer ${getGatewayToken()}` },
      request_body_schema: {
        type: 'object',
        required: ['tool'],
        properties: {
          tool: { type: 'string', description: 'Composio tool slug in UPPER_SNAKE_CASE, e.g. GITHUB_CREATE_ISSUE.' },
          args: { type: 'object', description: 'Arguments object for the tool. Shape depends on the chosen tool.' },
          userId: { type: 'string', description: 'Composio user_id (defaults to cody).' },
        },
      },
    },
  };
}

async function findExistingMegatool(): Promise<ElevenLabsTool | undefined> {
  const tools = ((await elevenLabsRequest('GET', '/convai/tools')) as { tools?: ElevenLabsTool[] }).tools ?? [];
  return tools.find((t) => t.tool_config.name === MEGATOOL_NAME);
}

export async function ensureMegatool(): Promise<ElevenLabsTool> {
  const existing = await findExistingMegatool();
  if (existing) {
    // Re-PATCH so URL + bearer stay current (handles rotate-token sweep).
    const updated = (await elevenLabsRequest('PATCH', `/convai/tools/${existing.id}`, { tool_config: megatoolToolConfig() })) as ElevenLabsTool;
    logInfo('composio.megatool.refreshed', { id: existing.id });
    return updated;
  }
  const created = (await elevenLabsRequest('POST', '/convai/tools', { tool_config: megatoolToolConfig() })) as ElevenLabsTool;
  logInfo('composio.megatool.created', { id: created.id });
  return created;
}

interface AgentConfig {
  agent_id: string;
  name?: string;
  conversation_config?: { agent?: { prompt?: { tool_ids?: string[] } } };
}

async function getAgent(agentId: string): Promise<AgentConfig> {
  return (await elevenLabsRequest('GET', `/convai/agents/${encodeURIComponent(agentId)}`)) as AgentConfig;
}

export async function attachMegatool(agentId: string): Promise<{ agentId: string; toolId: string; alreadyAttached: boolean }> {
  const tool = await ensureMegatool();
  const agent = await getAgent(agentId);
  const existing = agent.conversation_config?.agent?.prompt?.tool_ids ?? [];
  if (existing.includes(tool.id)) {
    logInfo('composio.megatool.attach.noop', { agentId, toolId: tool.id });
    return { agentId, toolId: tool.id, alreadyAttached: true };
  }
  const next = [...existing, tool.id];
  await elevenLabsRequest('PATCH', `/convai/agents/${encodeURIComponent(agentId)}`, {
    conversation_config: { agent: { prompt: { tool_ids: next } } },
  });
  logInfo('composio.megatool.attached', { agentId, toolId: tool.id });
  return { agentId, toolId: tool.id, alreadyAttached: false };
}

export async function detachMegatool(agentId: string): Promise<{ agentId: string; toolId?: string; detached: boolean }> {
  const tool = await findExistingMegatool();
  if (!tool) {
    logInfo('composio.megatool.detach.no-tool', { agentId });
    return { agentId, detached: false };
  }
  const agent = await getAgent(agentId);
  const existing = agent.conversation_config?.agent?.prompt?.tool_ids ?? [];
  if (!existing.includes(tool.id)) return { agentId, toolId: tool.id, detached: false };
  const next = existing.filter((id) => id !== tool.id);
  await elevenLabsRequest('PATCH', `/convai/agents/${encodeURIComponent(agentId)}`, {
    conversation_config: { agent: { prompt: { tool_ids: next } } },
  });
  logInfo('composio.megatool.detached', { agentId, toolId: tool.id });
  return { agentId, toolId: tool.id, detached: true };
}

export interface MegatoolInventoryEntry {
  agent_id: string;
  agent_name?: string;
  attached: boolean;
}

export async function listMegatoolAttachments(): Promise<{ toolId?: string; agents: MegatoolInventoryEntry[] }> {
  const tool = await findExistingMegatool();
  const agents = ((await elevenLabsRequest('GET', '/convai/agents')) as { agents?: Array<{ agent_id: string; name?: string }> }).agents ?? [];
  const out: MegatoolInventoryEntry[] = [];
  for (const a of agents) {
    const full = await getAgent(a.agent_id);
    const ids = full.conversation_config?.agent?.prompt?.tool_ids ?? [];
    out.push({ agent_id: a.agent_id, agent_name: a.name, attached: tool ? ids.includes(tool.id) : false });
  }
  return { toolId: tool?.id, agents: out };
}

export async function smokeMegatool(agentId: string): Promise<{ agentId: string; gatewayOk: boolean; gatewayLatencyMs?: number; toolAttached: boolean; detail?: string }> {
  // Probe the gateway directly via a known-cheap Composio call; assert that the
  // agent has the tool attached. Doesn't invoke ElevenLabs's LLM (too slow/costly).
  const agent = await getAgent(agentId);
  const tool = await findExistingMegatool();
  const toolAttached = tool ? (agent.conversation_config?.agent?.prompt?.tool_ids ?? []).includes(tool.id) : false;
  const startMs = Date.now();
  let gatewayOk = false; let detail: string | undefined;
  try {
    const res = await request(`${getGatewayUrl()}/v1/composio/execute`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getGatewayToken()}`, 'content-type': 'application/json' },
      body: JSON.stringify({ tool: 'GITHUB_GET_RATE_LIMIT_STATUS_FOR_THE_AUTHENTICATED_USER', args: {} }),
    });
    const parsed = (await res.body.json()) as { successful?: boolean; error?: string };
    gatewayOk = parsed.successful === true;
    if (!gatewayOk) detail = parsed.error;
  } catch (err) {
    detail = (err as Error).message;
  }
  const result = { agentId, gatewayOk, gatewayLatencyMs: Date.now() - startMs, toolAttached, ...(detail ? { detail } : {}) };
  if (gatewayOk && toolAttached) logInfo('composio.megatool.smoke.ok', result);
  else logWarn('composio.megatool.smoke.fail', JSON.stringify(result));
  return result;
}
