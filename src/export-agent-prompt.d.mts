// Hand-written declarations for export-agent-prompt.mjs (imported by the
// TypeScript sidepanel). Keep in sync with the .mjs implementation.

export type AgentPromptCounts = {
  comments: number;
  selectors: number;
  pages: number;
  screenshots: number;
};

export type AgentPromptOpts = {
  workspace: string;
  bundleId: string;
  archivePath: string;
  exportTs: string;
  jsonlName: string;
  counts: AgentPromptCounts;
  entryNames: string[];
  designIsTemplate: boolean;
};

export type SkillsIndex = {
  kind: string;
  version: number;
  sources: Array<Record<string, unknown>>;
  skills: Array<{id: string; path: string; purpose?: string; source?: string; invoke?: string}>;
};

export const SIGNAL_PATHS: string[];
export function isSignalPath(name: string, jsonlName: string): boolean;
export function buildBundleIgnore(): string;
export function workspaceRoot(workspace: string): string;
export function extractDir(workspace: string, bundleId: string): string;
export function buildBootstrapScript(opts: {workspace: string; bundleId: string; archivePath: string; exportTs: string}): string;
export function renderBundleTree(entryNames: string[], opts?: {collapseAt?: number; maxLines?: number}): string;
export function buildAgentPromptJsonl(opts: AgentPromptOpts): string;
export function buildAgentProtocolMd(opts: AgentPromptOpts & {skillsIndex: SkillsIndex | null}): string;
