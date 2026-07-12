// Declarations for redact.mjs (imported by the TypeScript sidepanel).

export type Detector = {name: string; re: RegExp; replace: string | ((m: string) => string)};
export const DETECTORS: Detector[];
export function redactText(input: string): string;
export function redactUrl(url: string): string;
export function redactAttrs(attrs: Record<string, unknown> | null | undefined): Record<string, unknown>;
export function wouldRedact(input: unknown): boolean;
