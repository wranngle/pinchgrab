// Type surface for the pure JS bundle-doc builders in export-bundle-docs.mjs
// so they can be imported from TypeScript (allowJs is false; same pattern as
// export-capture.d.mts). Both return deterministic markdown strings.
export function buildBundleAgentsMd(opts?: {jsonlName?: string}): string;
export function buildBundleReadmeMd(opts?: {jsonlName?: string}): string;
