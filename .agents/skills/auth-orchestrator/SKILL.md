---
name: auth-orchestrator
description: >-
  Abstract operating principles for any AI agent acting through the Composio-powered Auth Orchestrator
  at ~/.dotfiles/lib/composio-orchestrator/. Apply when asked to authorize, query, or act through ANY
  external service — GitHub, Slack, Gmail, Notion, Perplexity, AWS, anything. This skill encodes the
  lasting design intent (cascade order, masking discipline, surfacing rules) — NOT the CLI surface
  (use `composio-orch --help` for that).
---

# auth-orchestrator

This skill is the **lasting mental model** an agent must hold when authorizing or invoking any external service on the user's behalf. It is intentionally abstract — concrete CLI flags and JSON shapes will drift, but these principles persist.

For implementation specifics see the companion skill `composio-auth` and the live README at `~/.dotfiles/lib/composio-orchestrator/README.md`.

## How to invoke it from a child project

The orchestrator is reachable from any cwd as the single global command `composio-orch` (PATH-resolved via `~/.local/bin/composio-orch` → `~/.dotfiles/scripts/bin/composio-orch`). If PATH lookup fails, use the absolute path `~/.dotfiles/scripts/bin/composio-orch`. Do not `cd` into the orchestrator package and run `npm run orch` from a child project — that breaks state-path resolution and is a smell that the agent missed the discoverability layer.

## The cascade you must always respect

For any toolkit, prefer execution paths in this order. The orchestrator's `selectExecutionPath` enforces it; defer to its decision.

1. **Local CLI** — when an authenticated CLI binary already exists on the host (`gh`, `aws`, `gcloud`, `wrangler`, `docker`). It uses system keyrings or local credential chains the user already manages. Lowest latency, no extra OAuth, and the user can audit it with `history`.
2. **Native SDK** — when the corresponding npm package is installed and the user controls the credentials directly. Skips Composio's proxy hop entirely.
3. **Composio toolkit** — the universal fallback for OAuth-heavy services where Composio multiplexes auth and refresh. This is the *default* for unknown toolkits.
4. **MCP server** — when a long-lived MCP server is registered for the toolkit (rare; useful when persistence matters).
5. **Raw HTTP API** — last resort. Only when none of the above are usable.

You don't pick the cascade yourself — call `composio-orch path <toolkit>` and trust the answer.

## The auth matrix you must handle without surprise

Every toolkit lands in exactly one of four cells, and `ensureAuth` knows them all. Don't try to second-guess.

| Cell | What it means | Where the credential comes from | What surfaces to the user |
|---|---|---|---|
| Managed OAuth | Composio owns the OAuth app | Browser consent | A `connect.composio.dev` or `backend.composio.dev/api/v3/s/...` URL |
| Custom OAuth | The user owns the OAuth app | Env vars `COMPOSIO_<TOOLKIT>_CLIENT_ID` + `COMPOSIO_<TOOLKIT>_CLIENT_SECRET` at config-create time, then browser consent | Either an `env://` instruction (if env missing) or a real OAuth URL |
| Managed API key | Composio holds the key | Already provisioned | Nothing — returns ACTIVE immediately |
| Custom API key | User holds the key | Env var `COMPOSIO_<TOOLKIT>_<FIELD>` at initiate time | Either an `env://` instruction or ACTIVE |

When `ensureAuth` returns `PENDING`, the orchestrator has already written to `composio-pending-auth.json`. **Never poll, never block.** Surface the URL or env-var instruction to the user; the next prompt's hook will re-show it; the webhook receiver clears it on completion.

## Token-masking discipline

The default state for the project is **masking off**, because the orchestrator disables it once at bootstrap so raw tokens are usable for local-CLI escape hatches. When you genuinely need a raw token (rare — most operations should go through the Composio toolkit, which doesn't need raw tokens), wrap that scope with `withMaskingDisabled(fn)` for safety even though the global default is already off — it makes the scope explicit and self-documenting.

**Never leave masking flipped from a state you didn't observe.** Every helper restores prior state in `finally`. Don't write code that PATCHes the masking setting directly; always go through `dynamicMasking.ts`.

## Garbage collection is automatic

You do not garbage-collect anything by hand. Cron runs `composio-orch gc` every ten minutes. It reaps:

- Stale `INITIALIZING` connected accounts at Composio (default TTL 30 minutes).
- Locally-expired `pending-auth.json` entries.
- Orphaned auth-config IDs in the local cache (entries deleted from the Composio dashboard).

If you observe drift between local cache and Composio reality, run `composio-orch cache --prune` once and move on. Do not write ad-hoc cleanup scripts.

## Surfacing pending auth to the user

The hook script `~/.dotfiles/.agents/skills/composio-auth/hook-prepend-pending.sh` runs on every Claude `UserPromptSubmit`, every Gemini `BeforeAgent`, and every Codex `UserPromptSubmit`. It already prepends `PENDING_AUTH <toolkit> -> <url>` to context. **Do not duplicate it.** When you see those lines, acknowledge them in your reply and tell the user what to do — then proceed with whatever else they asked. Do not stop the conversation.

## What the orchestrator is NOT

- Not a credentials store. The user owns `~/.agents/.env`. Don't inject secrets into it without explicit permission.
- Not a workflow engine. It only handles auth + execution-path selection. Higher-level orchestration belongs in your agent loop.
- Not a Composio replacement. When Composio adds a new feature, prefer routing through the orchestrator rather than calling Composio directly — the orchestrator's job is to be the single seam.

## Failure mode you should expect

If `cloudflared` is down or the webhook never arrives, OAuth completion is detected by the next prompt hook's `pending --sync` pass; the GC cron remains a slower backup. Mention this to the user only if they're surprised by the delay — otherwise stay quiet.

## When you don't know what to do

Run `composio-orch --help` to see current commands. If the cascade or auth matrix seems unable to handle what the user wants, say so explicitly and ask. Don't invent new flows.
