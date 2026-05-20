# composio-orchestrator

Universal Composio v3 auth orchestrator for the dotfiles. Wraps `@composio/core`
so any AI coding agent (Claude Code, Gemini CLI, Codex) can authorize and run
any Composio toolkit on the user's behalf with no manual fiddling.

## Surface

```ts
import { ensureAuth, runWithToolkit, gcStaleConnections } from './src';
```

CLI: `composio-orch <ensure|run|verify|pending|gc|path|cache|mask|disable-mask|register-webhook|reload-key> ...`

`verify <toolkit> [userId]` runs the smoke probe against the live upstream
provider for the existing connection — useful for ad-hoc scream-tests
without going through ensureAuth's deletion-on-failure side effects.

Invoke `composio-orch` directly from any cwd — the launcher at
`~/.local/bin/composio-orch` forwards to `~/.dotfiles/scripts/bin/composio-orch`,
which execs `tsx bin/composio-orch.ts` with absolute paths so state files always
land under `~/.agents/state/` regardless of caller. If PATH discovery fails, use
the absolute fallback `~/.dotfiles/scripts/bin/composio-orch`. Do not run
`npm run orch` from a child project — it works but couples your shell to the
orchestrator's package dir and obscures the discoverability seam.

## Layout

- `src/` — public functions, all paths via `statePaths.ts`
- `bin/composio-orch.ts` — `tsx` entrypoint
- `daemon/` — webhook receiver + cron GC loop
- `test/` — vitest

## Persistence

State files under `~/.agents/state/`:
- `composio-pending-auth.json` — surfaced into every chat reply by the
  `composio-auth` skill's UserPromptSubmit hook until consented.
- `composio-authconfigs.json` — `(toolkit, scheme) -> ac_…` cache.
- `composio-webhook-url.txt` — Cloudflare-tunneled public URL for triggers.

Logs to `${XDG_STATE_HOME:-~/.local/state}/composio-orch.jsonl` (ECS jsonl).

## Common pitfall: env var naming

Per-toolkit credentials live in `~/.agents/.env` under the canonical shape
`COMPOSIO_<TOOLKIT>_<FIELD>` — never with the auth scheme inserted. The
orchestrator's loader (`src/credentialEnvLoader.ts`) only reads names that
match this shape (plus a small alias list per field).

| Wrong (silent failure)                              | Right                                |
| --------------------------------------------------- | ------------------------------------ |
| `COMPOSIO_CLOUDFLARE_API_KEY_GENERIC_API_KEY=…`     | `COMPOSIO_CLOUDFLARE_GENERIC_API_KEY=…` |
| `COMPOSIO_FOO_OAUTH2_TOKEN=…`                       | `COMPOSIO_FOO_TOKEN=…`               |
| `COMPOSIO_FOO_BEARER_TOKEN_TOKEN=…`                 | `COMPOSIO_FOO_BEARER_TOKEN=…`        |

Operators sometimes hand-type the malformed shape after seeing an internal
auth-config label like `cloudflare:API_KEY:use_custom_auth` and intuiting
the env-var name from it. The label encodes `<toolkit>:<scheme>:<type>` —
the env var is `COMPOSIO_<TOOLKIT>_<FIELD>` only.

Run `composio-orch lint-env` to scan `~/.agents/.env` and surface any
malformed names with rename suggestions. Exits non-zero on findings, so it
can run as a pre-commit hook or daily check. The dotfiles bootstrap also
runs this advisory on every host-level boot (`runComposioEnvLintAdvisory`
in `.dotfiles.sh`) — it warns and lists; it never auto-edits the env file.

After any edit to `~/.agents/.env`, run `composio-orch reload-key` to drop
the in-memory API-key + auth-config cache.

## Known SDK constraints (current `@composio/core@0.8.1`)

- Custom-tool validator requires zod v3 internals → all zod imports go
  through `src/zodV3.ts`.
- Custom tools are in-memory only → re-bound on every `composio.create()`.
- Token masking is a global project toggle → orchestrator disables it once.
- No mid-session refresh → every `runWithToolkit` creates a fresh session.
