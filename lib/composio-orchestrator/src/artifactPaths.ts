// Artifact layout standard: every file the orchestrator (or any consumer
// component built on top of it) writes into a project goes through one of
// the resolvers below. Two invariants are enforced:
//
//   1. Flat layout: `<projectRoot>/.artifacts/<system>/<keyed-filename>`.
//      One directory per system (composio, voice-evals, …); no deeper
//      nesting. Side-by-side artifacts of the same kind are distinguished
//      by their FILENAME key, not by subdirectories.
//
//   2. Keyed file names: every artifact name encodes the discriminating
//      axis — `<purpose>.<key>.<ext>`. Examples:
//        gateway-deploy.<env>.jsonl
//        megatool-attach.<agent_id>.jsonl
//        tool-execute.<yyyy-mm-dd>.jsonl
//      Never `attach.jsonl` (would collide across agents).
//
// Project root resolution walks up from `startDir` looking for any of:
// `.git`, `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`,
// `WORKFLOW.md` (symphony marker), or `.dotfiles.sh`. Falls back to
// `startDir` itself if no marker is found.
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';

const PROJECT_ROOT_MARKERS = ['.git', 'package.json', 'pyproject.toml', 'Cargo.toml', 'go.mod', 'WORKFLOW.md', '.dotfiles.sh'] as const;

export function resolveProjectRoot(startDir: string = process.cwd()): string {
  let current = resolve(startDir);
  for (;;) {
    for (const marker of PROJECT_ROOT_MARKERS) {
      if (existsSync(join(current, marker))) return current;
    }
    const parent = dirname(current);
    if (parent === current || parent === sep) return resolve(startDir);
    current = parent;
  }
}

export interface ArtifactPathOptions {
  /** System namespace under `.artifacts/`. e.g. "composio", "voice-evals". */
  system: string;
  /** Keyed filename WITHOUT extension. e.g. "gateway-deploy.prod" or "megatool-attach.agent_8401kr...". */
  key: string;
  /** File extension. Defaults to `jsonl` (the canonical runtime-log format). */
  ext?: string;
  /** Override project root. Defaults to walking up from cwd. */
  projectRoot?: string;
  /** Create the parent dir if missing. Defaults to true. */
  ensureDir?: boolean;
}

export function resolveArtifactPath(opts: ArtifactPathOptions): string {
  if (!/^[a-z][a-z0-9-]*$/.test(opts.system)) {
    throw new Error(`artifactPaths: system must be kebab-case lowercase; got "${opts.system}"`);
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(opts.key)) {
    throw new Error(`artifactPaths: key must be alphanumeric with dots/dashes/underscores; got "${opts.key}"`);
  }
  const root = opts.projectRoot ?? resolveProjectRoot();
  const dir = join(root, '.artifacts', opts.system);
  const ext = (opts.ext ?? 'jsonl').replace(/^\./, '');
  const file = `${opts.key}.${ext}`;
  if (opts.ensureDir !== false) mkdirSync(dir, { recursive: true });
  return join(dir, file);
}

export function resolveSystemArtifactDir(system: string, projectRoot?: string): string {
  if (!/^[a-z][a-z0-9-]*$/.test(system)) {
    throw new Error(`artifactPaths: system must be kebab-case lowercase; got "${system}"`);
  }
  const root = projectRoot ?? resolveProjectRoot();
  const dir = join(root, '.artifacts', system);
  mkdirSync(dir, { recursive: true });
  return dir;
}
