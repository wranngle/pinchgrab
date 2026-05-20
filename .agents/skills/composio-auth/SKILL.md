---
name: composio-auth
description: >-
  Surface pending Composio OAuth authorizations into every chat turn until the user consents. Use when
  the user asks any AI agent to act on their behalf via a Composio toolkit (GitHub, Slack, Gmail,
  etc.) and the underlying connection is not yet ACTIVE. The orchestrator at
  ~/.dotfiles/lib/composio-orchestrator/ owns the full lifecycle; this skill is the user-facing
  surface.
---

# composio-auth

The dotfiles ship a TypeScript orchestrator at `~/.dotfiles/lib/composio-orchestrator/`
that handles all Composio v3 plumbing: scheme negotiation, auth-config caching,
connection-account vaulting, GC of stale OAuth flows, webhook-driven completion,
and provider-agnostic execution. This skill exists so any agent (Claude, Gemini,
Codex) can see and surface pending authorizations.

## CLI surface

The orchestrator is exposed as a single global command, `composio-orch`, available
on PATH from any project directory (a launcher in `~/.local/bin/composio-orch`
forwards to `~/.dotfiles/scripts/bin/composio-orch`, which in turn execs
`tsx ~/.dotfiles/lib/composio-orchestrator/bin/composio-orch.ts`). If `composio-orch`
is not resolvable for some reason, fall back to the absolute path
`~/.dotfiles/scripts/bin/composio-orch` — same flags, same exit semantics.
Never `cd` into the orchestrator directory and run `npm run orch` from a child
project.

```
composio-orch ensure <toolkit> [userId]
composio-orch run <toolkit> <userId> <provider> [prompt...]
composio-orch pending [--user <userId>] [--clear <ca_id>] [--reap-expired]
composio-orch gc [--max-age-minutes 30]
composio-orch path <toolkit>
composio-orch cache [--list | --clear | --prune]
composio-orch mask <on|off|status>
composio-orch disable-mask
composio-orch register-webhook <toolkit> [userId]
composio-orch reload-key
```

`provider` is one of: `openai | anthropic | langchain | openai-agents`.

## When the user asks for something that needs Composio auth

1. Run `composio-orch ensure <toolkit> [<userId>]` (default user is `cody`).
2. If the result is `{"status":"ACTIVE",...}`, proceed with the work.
3. If the result is `{"status":"PENDING","redirectUrl": "https://..."}`, do
   not block. Instead, append the `redirectUrl` to your reply and tell the
   user they need to consent before you can continue. The orchestrator's
   webhook receiver will clear the pending entry automatically once consent
   completes; subsequent turns will see ACTIVE.

## Always-on surfacing

The companion script `hook-prepend-pending.sh` is registered as a
`UserPromptSubmit` hook in the central agent settings. Before it surfaces
anything, it runs a short best-effort `composio-orch pending --sync` pass so a
connection that became `ACTIVE` at Composio is removed from local pending state
even when the webhook tunnel missed the completion event. Trust the hook output;
do not manually re-query unless the user asks.

## State file

`~/.agents/state/composio-pending-auth.json`:

```json
{
  "version": 1,
  "entries": [
    {
      "connectedAccountId": "ca_...",
      "authConfigId": "ac_...",
      "toolkit": "github",
      "userId": "cody",
      "redirectUrl": "https://connect.composio.dev/link/lk_...",
      "createdAt": "2026-05-02T12:00:00Z",
      "expiresAt": "2026-05-02T12:30:00Z"
    }
  ]
}
```

The cron-driven GC daemon (`scripts/bin/composio-gc-daemon.sh`) reaps stale
`INITIALIZING` connections older than 30 minutes and any locally-expired
pending entries every 10 minutes.

## Manual escape hatches

- Cancel a pending request: `composio-orch pending --clear <connectedAccountId>`.
- Force a GC pass: `composio-orch gc --max-age-minutes 0`.
- Reload `COMPOSIO_API_KEY` after rotating it in the dashboard:
  `composio-orch reload-key`.
