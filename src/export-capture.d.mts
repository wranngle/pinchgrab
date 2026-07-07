// Type surface for the pure JS serializer in export-capture.mjs so it can be
// imported from sidepanel.ts (allowJs is false; the .mjs is bundled by Bun at
// build time and typed here for tsc). Inputs accept either a bare Entry or a
// {entry, feedback?, members?} pair — see export-capture.mjs normalizeCapture.
export function serializeCaptureJson(capture: unknown, opts?: unknown): string;
export function serializeCaptureText(capture: unknown, opts?: unknown): string;
export function serializeCaptureFull(capture: unknown, opts?: unknown): unknown;
