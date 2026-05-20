// Thin wrapper over Composio's hosted MCP. The "standard connection for all
// agents" model: each agent class points at a per-class Composio MCP server
// config (or one shared config), and the orchestrator mints per-user URLs on
// demand. Composio holds the master api-key; agents only ever see a URL.
//
// CLI surface (added to bin/composio-orch.ts):
//   composio-orch mcp-config create <name> --toolkits a,b,c [--allowed-tools t1,t2]
//   composio-orch mcp-config list
//   composio-orch mcp-config delete <serverId>
//   composio-orch mcp-url <name-or-id> [--user-id <id>]
import { getComposioClient } from './composioClient.js';
import { logInfo } from './logging.js';
import { ComposioOrchError } from './errors.js';

interface RawMcpListItem {
  id: string;
  name: string;
  toolkits?: string[];
  authConfigs?: string[];
  allowedTools?: string[];
}

export async function createMcpConfig(args: {
  name: string;
  toolkits: string[];
  allowedTools?: string[];
  manuallyManageConnections?: boolean;
}): Promise<{ id: string; name: string; toolkits: string[]; allowedTools?: string[] }> {
  const composio = getComposioClient();
  const result = await (composio as unknown as {
    mcp: { create: (name: string, cfg: unknown) => Promise<RawMcpListItem & { id: string; name: string }> };
  }).mcp.create(args.name, {
    toolkits: args.toolkits,
    allowedTools: args.allowedTools ?? [],
    manuallyManageConnections: args.manuallyManageConnections ?? false,
  });
  logInfo('composio.mcp.config.created', { id: result.id, name: result.name, toolkitCount: args.toolkits.length });
  return { id: result.id, name: result.name, toolkits: args.toolkits, allowedTools: args.allowedTools };
}

export async function listMcpConfigs(): Promise<RawMcpListItem[]> {
  const composio = getComposioClient();
  const result = await (composio as unknown as {
    mcp: { list: (q: Record<string, unknown>) => Promise<unknown> };
  }).mcp.list({});
  // SDK returns either { items: [...] } or a bare array depending on version.
  if (Array.isArray(result)) return result as RawMcpListItem[];
  const wrapped = result as { items?: RawMcpListItem[] };
  return wrapped.items ?? [];
}

export async function deleteMcpConfig(serverId: string): Promise<{ deleted: boolean; id: string }> {
  const composio = getComposioClient();
  const result = await (composio as unknown as {
    mcp: { delete: (id: string) => Promise<{ deleted?: boolean; id?: string }> };
  }).mcp.delete(serverId);
  logInfo('composio.mcp.config.deleted', { id: serverId });
  return { deleted: result.deleted ?? true, id: serverId };
}

export async function generateMcpUrl(args: {
  configIdOrName: string;
  userId: string;
}): Promise<{ id: string; name: string; url: string; userId: string }> {
  const composio = getComposioClient();
  // Resolve name → id if a non-id string was passed.
  let configId = args.configIdOrName;
  if (!/^[a-zA-Z0-9_-]{15,}$/.test(configId)) {
    const configs = await listMcpConfigs();
    const match = configs.find((c) => c.name === args.configIdOrName);
    if (!match) {
      throw new ComposioOrchError('NEGOTIATION', `No MCP config named "${args.configIdOrName}"`, {
        hint: `Run: composio-orch mcp-config list`,
      });
    }
    configId = match.id;
  }
  const server = await (composio as unknown as {
    mcp: { generate: (userId: string, id: string, opts?: unknown) => Promise<{ id: string; name: string; url: string }> };
  }).mcp.generate(args.userId, configId);
  logInfo('composio.mcp.url.generated', { id: server.id, name: server.name, userId: args.userId });
  return { id: server.id, name: server.name, url: server.url, userId: args.userId };
}
