---
name: typescript
description: >-
  Use for JavaScript, TypeScript, shell quality, Bun-first execution, XO linting, JS-to-TS migration,
  ArkType validation, LSP registry guidance, and hook promotion rules across projects.
---

<!-- js-shell-quality-block:begin -->
## JavaScript / TypeScript / Shell Quality Regime

This block governs how every agent (Claude Code, Codex CLI, Gemini CLI) writes,
runs, and lints JavaScript, TypeScript, and shell across the user's projects.

### XO is the only ESLint surface
Lint TS/JS with `xo` (https://github.com/xojs/xo). The shared baseline lives at
`~/.agents/xo.config.js` (2-space, semicolons on, single quotes, prettier off).
A project may add its own `xo.config.{js,ts}` or `package.json#xo` to layer
overrides; do not introduce a parallel `.eslintrc*`, `eslint.config.js`, or
`prettier` config — it will fight XO's flat-config bundle.
- WHEN: any time you write or modify `.ts`/`.tsx`/`.js`/`.jsx`/`.mjs`/`.cjs`,
  immediately run `bun x xo --fix <touched-files>` before declaring the task
  done. If `xo` is not in the project's `devDependencies`, install it with
  `bun add -D xo eslint-config-xo-typescript` and add `"lint": "xo"` to
  `package.json#scripts`.
- AVOID: never invoke `npx eslint`, never auto-format with prettier unless the
  project explicitly opts in via `xo.prettier: true`, never add `// eslint-disable-*`
  to silence a rule the user enabled — fix the code instead.

### Bun replaces Node for execution
Run scripts with `bun`. Node remains the runtime target only when a project
literally cannot use Bun: native Node addon that doesn't compile under Bun's
NAPI surface; reliance on `node:repl` / `node:sqlite` / `node:test` /
`node:trace_events` (Bun has not implemented these); `node:cluster` worker
handles passed across processes; `node:worker_threads` with `stdin`/`stdout`/
`stderr`/`resourceLimits` options.
- WHEN: any new ad-hoc TS execution, test runner script, or package manifest
  uses `bun run` / `bun x` / `bun test`. Existing `npm` / `pnpm` / `yarn`
  projects stay on their current package manager until you are explicitly
  migrating them; do not silently swap lockfiles.
- HOW (project migration): drop `node_modules`, replace
  `package-lock.json`/`pnpm-lock.yaml`/`yarn.lock` with `bun.lock`, swap
  `node` and `npm run` in scripts to `bun` and `bun run`, add `@types/bun`
  and `bun-types` to devDependencies, then run `bun install`. Reference
  the migration guide at the bottom of this skill.
- AVOID: do not commit a `package-lock.json` and a `bun.lock` side-by-side;
  do not assume `NODE_OPTIONS=--experimental-*` flags work under Bun.

### Aggressive `.js` → `.ts`
Raw `.js` source under `~/projects/*` is opportunistically migrated to `.ts`
during any edit that touches it. The endgame: zero `.js` outside generated
output, build artefacts, or vendored third-party files.
- WHEN: editing a `.js` file and either (a) the file already lives in a TS
  project (sibling `.ts` files, `tsconfig.json`, `"type": "module"`), or
  (b) the project has at least one `.ts` file. Rename `foo.js` → `foo.ts`,
  fix any inferred-`any` complaints surfaced by `tsc --noEmit`, update
  imports if they used explicit extensions.
- AVOID: do not migrate `.js` in `node_modules`, `dist/`, `build/`, generated
  vendor output, or projects that have zero TypeScript footprint (e.g.
  `~/projects/n8n` — pure JS, leave it alone). Do not introduce JSDoc-only
  type annotations as a half-step; commit to `.ts` or do not touch it.

### ArkType at I/O boundaries
Validate untrusted input with [ArkType](https://arktype.io) (`import { type } from 'arktype'`) at every system boundary: API request handlers, form inputs, external API responses, config-file parsing, and hook inputs. Files matching `*_service.ts`, `*_handler.ts`, `*_controller.ts`, `*_repository.ts`, `*_validator.ts`, or `*_api.ts` should expose an ArkType-derived input type. Internal call sites past the boundary trust the inferred type — do not re-validate. Pick ArkType, not Zod or Yup, when adding a validator to a project that has none.

### Ad-hoc execution policy
For one-shot commands, prefer the smallest possible surface:
1. Inline minified bash (`bash -c '...'`) for shell tasks. No temp file.
2. Inline minified TypeScript via `bun -e '<expr>'` or
   `bun --print '<expr>'` when the task is JS/TS-shaped. No temp file.
3. Python only when a Python library is irreplaceable for the task
   (e.g. PIL, pandas, a vendor SDK that lacks a JS twin).
4. Before writing a new temp script, grep `~/.dotfiles/scripts/bin/`,
   `~/.agents/`, and the current project for an existing permanent script
   that already does what you need.
5. If a temp script is unavoidable, place it in `/tmp/` (never in `~`,
   never in the repo). Name it `tmp-<task>-<unix-ts>.<ext>` so the source
   of an orphaned file is obvious.

### Agent LSP registry
LSP-grade code intelligence is consumed differently by each agent. Claude Code
ships official LSP plugins via the marketplace
`Piebald-AI/claude-code-lsps` (added through `/plugin marketplace add ...`,
then `/plugins` to enable). Codex CLI and Gemini CLI do not currently load
those plugins; they invoke LSP binaries ad-hoc when needed. The single
canonical registry of "which LSP binary covers which language, and how it is
installed on this machine" lives at `~/.agents/lsp/typescript/README.md`. Any
agent — regardless of harness — reads that registry first before suggesting
an LSP-related install.
- WHEN: a task requests "go-to-definition", "find references", "rename
  symbol", "schema-aware autocomplete", or any code-intelligence operation
  that benefits from an LSP. Resolve the binary via the registry, install if
  missing, invoke directly.
- AVOID: do not assume the bartolli `claude-code-typescript-hooks` covers
  this — those hooks run typecheck/lint/format, not LSP queries; do not
  install an LSP binary outside the registry path because the next agent
  will not find it.

### Hook promotion (TDD before prod)
A hook lives in `hooks-dev/` until it has earned its place in `hooks/`. Promotion requires (a) a sibling test file in `hooks-dev/tests/`, (b) at least 3 test cases, (c) at least one test annotated with `// ROOT CAUSE:` referencing a real user incident (not a hypothetical), and (d) a green `bun test` run. No promotion path skips these — if a hook cannot pass three tests, the rule it encodes is not yet sharp enough to enforce.

New hooks ship as **advisory** (warn only; `continue: true`). They earn the right to **block** (`continue: false`) only after passing the TDD bar above AND ≥50 successful production runs with ≤5% false-positive rate. A blocking hook without test coverage is automatically downgraded to advisory on review. The rationale: a buggy advisory hook is noise; a buggy blocking hook is an outage.

### File naming
Source files use **kebab-case** (`lead-processor.ts`, `sarah-send-email.json`). No `snake_case`, no `camelCase`, no `TitleCase`, and never a version suffix (`-v1`, `_v2`, `-final`, `-final-final`) — version goes in git history, not the filename. Exceptions: anything under `old/`, `archive/`, `test-data/`, `fixtures/`, or files explicitly prefixed `backup_`/`export_`/`archived_` keep their existing names. (Inside-the-file naming for n8n nodes, ElevenLabs agents, etc. follows vendor-specific conventions documented per project, not here.)
<!-- js-shell-quality-block:end -->

# node → bun migration (managed by ~/.dotfiles/.dotfiles.sh)

Bun version of record: v1.3.13 (May 2026).
Install: `curl -fsSL https://bun.sh/install | bash`.

## When NOT to migrate
A project must stay on Node if it imports any of these (Bun does not implement them):
- `node:repl`, `node:sqlite`, `node:test`, `node:trace_events` (red — no implementation)
- `node:cluster` worker handles passed across processes (handles + FDs cannot transit workers)
- `node:worker_threads` with `stdin/stdout/stderr/trackedUnmanagedFds/resourceLimits`
- A native Node addon that doesn't compile under Bun's NAPI surface (verify with `bun install` first)
Audit with `rg "node:(repl|sqlite|test|trace_events)" --type ts --type js`.

## Migration steps
1. Confirm safe to migrate (audit above).
2. Add `"@types/bun": "^1.3.6"` and `"bun-types": "1.3.6"` to devDependencies.
3. Replace `package-lock.json` / `pnpm-lock.yaml` / `yarn.lock` with `bun.lock`:
   `rm -f package-lock.json pnpm-lock.yaml yarn.lock && bun install`.
4. Update `package.json#scripts`: replace `node` with `bun`, replace
   `npm run`/`pnpm`/`yarn` with `bun run`. Replace `tsx`/`ts-node` invocations
   with plain `bun` since Bun runs TS natively.
5. Remove `tsx` and `ts-node` from devDependencies.
6. Verify: `bun run typecheck`, `bun run test`, `bun run lint`.

## Common pitfalls
- `NODE_OPTIONS=--experimental-*` mostly does not apply under Bun — drop it.
- `bun install` is much faster than `npm install`; do not wrap it in a long-timeout shell.
- `bun.lock` is text-format (since Bun 1.2); commit it. Do not commit both `bun.lock` and `package-lock.json`.

## Per-project trigger
A project is a candidate when `package.json` exists, no audit hits above,
and no `engines.node` pin contradicts Bun's compat target.
