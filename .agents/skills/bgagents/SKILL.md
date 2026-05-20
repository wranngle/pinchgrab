---
name: bgagents
description: >-
  Operational patterns for orchestrating background agents across Claude Code, Gemini CLI, and Codex.
  Invoke when delegating parallel/isolated work, wrapping cross-agent tasks via llm.sh, or auditing
  long-running background-agent output. Triggers: "delegate", "spawn an agent", "run in background",
  "orchestrate", "parallel agents", "fleet", or any task that should be handed to a teammate model
  rather than done in the main thread.
---

# Background Agent Orchestration & Delegation

## Overview

Operational patterns for the Team Lead (Orchestrator) agent to deploy, manage,
and audit background subagents across Claude Code, Gemini CLI, and Codex.
Ensures parallel task execution while protecting the Orchestrator's context
from noise.

## Core Directives for the Orchestrator

1. **Always prime a team at session start.** The very first time this skill is
   triggered in a Claude Code session, run `TeamCreate({team_name: "bgagents-<session_id>",
   agent_type: "team-lead", description: "Default bgagents team for this
   session"})` BEFORE invoking the `Agent` tool for the first delegation. Make sure to generate or retrieve a unique session ID.
   Every subsequent `Agent` invocation passes `team_name: "bgagents-<session_id>"` and a
   distinct `name:` so members coordinate via the shared task list and message
   bus. If `TeamCreate` returns an "already exists" error, just continue —
   there's already a team active and you join it. See "Session-start team
   priming" below for the exact opener.
2. **Aggressive Auditing.** Aggressively audit, consume, and correct subagent
   output as it lands. Do not blindly accept it. Challenge assumptions and
   verify structural integrity (e.g. read the actual diff, do not trust the
   agent's summary).
3. **Real-time Log Observation.** For agents that call other CLI tools
   (builds, tests, long-running processes), the Orchestrator (or a dedicated
   monitoring subagent) must observe emitted logs in real-time. Do not wait
   for a process to finish if it might hang — use `Monitor` or tail the log.
4. **Context Preservation.** Retain full strategic awareness. Delegate "busy
   work" (heavy file reading, batch edits, log parsing) to subagents to avoid
   poisoning the main context window with raw dumps and repetitive actions.
5. **Generous Invocation.** Invoke background agents generously for any task
   that can be parallelized, isolated, or benefits from a different
   perspective.
6. **Bounded background loops.** When a subagent must spawn its own polling
   bash loops (`until <condition>; do sleep N; done`), brief it with a hard
   cap on concurrent loops AND a TTL — orphan poll loops are how a single
   bgagent leaves 15+ stuck `bash` children behind. The brief should say:
   "use at most 1 concurrent polling loop; stop the previous one before
   starting a new one."

## Session-start team priming

The first delegation in a Claude Code session should always look like this
(the Orchestrator runs these in order, no user input required):

```
1. TeamCreate({
     team_name: "bgagents-<session_id>",
     agent_type: "team-lead",
     description: "Default bgagents team for this session"
   })
   →  ~/.claude/teams/bgagents/config.json (lead-only)
   →  ~/.claude/tasks/bgagents/.lock (paired task list)

2. Agent({
     team_name: "bgagents-<session_id>",
     name: "<role>",                 # e.g. "researcher", "tester", "builder"
     subagent_type: "general-purpose",
     prompt: "...",
     run_in_background: true
   })
   →  reporter@bgagents joins the team; config.json auto-updates
```

After that point, every `Agent({...})` call from this skill passes
`team_name: "bgagents-<session_id>"` and a unique `name:`. Teammates coordinate via:

- **`SendMessage({to: "<name>", message: "..."})`** — direct teammate-to-teammate
  text. Messages arrive in the recipient's mailbox; if the recipient is idle,
  they wake up and process the message in their next turn. Replies arrive in
  the Orchestrator's chat as `<teammate-message>` blocks (no inbox-polling
  required).
- **`TaskCreate({...})`** + **`TaskUpdate({owner: "<name>", ...})`** —
  shared task list scoped to the team. Any teammate can claim, complete, or
  reassign tasks.
- **Idle notifications** — teammates go idle automatically after each turn.
  Idle ≠ dead. Sending a SendMessage to an idle teammate wakes them up.
- **`shutdown_request`** — graceful termination. Send
  `SendMessage({to: "<name>", message: {type: "shutdown_request",
  request_id: "<uuid>", reason: "..."}})`; the teammate replies with
  `shutdown_response(approve: true)` and exits. Then call `TeamDelete()` to
  reap the team's directories.

## Verifying Agent Teams capability is live

The authoritative check is a **`TeamCreate` round-trip**: if it returns a
team_file_path and the JSON config lands at
`~/.claude/teams/<name>/config.json`, the feature flag is active.

Do NOT rely on `cat /proc/<pid>/environ | grep CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`
to verify — Claude Code reads the flag from `~/.claude/settings.json`'s `env`
block at tool-gate time, not at process startup, so the env var never appears
in the running Claude process's environment. That check produces a misleading
false negative.

The settings-side wiring is deployed idempotently by `.dotfiles.sh`:

- **Authoritative gate**: `~/.agents/settings/claude.json` has
  `.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS = "1"` (set by
  `ensureClaudeAgentTeamsSetting` during bootstrap; symlinked into
  `~/.claude/settings.json`).
- **Backup**: `~/.agents/.env` carries the same line (set by
  `ensureSharedAgentEnvLine`; symlinked into `~/.claude/.env`). Claude Code's
  harness reads settings.json directly, so this line is redundant but
  harmless and useful for child shells that source `.env`.

If `TeamCreate` errors with "feature flag not enabled" or similar, run
`bash ~/.dotfiles/.dotfiles.sh` to re-deploy the settings, restart Claude
Code, and re-test.

## Deployment Patterns

### 1. Default — Direct Subagents inside the team

Once the team is primed, every delegation goes through `Agent` with
`team_name: "bgagents-<session_id>"`:

- **Claude Code**
  - `Agent` tool with `subagent_type` (`Explore`, `Plan`, `general-purpose`)
    + `team_name: "bgagents-<session_id>"` + `name: "<role>"` + `run_in_background: true`
  - `Bash` tool with `run_in_background: true` for shell tasks the
    Orchestrator owns directly (no team membership needed). Read output later
    via `BashOutput` / `Read`, or stream events with `Monitor`.
  - Multiple parallel `Agent` calls in one message run concurrently — preferred
    when scopes are non-overlapping (different files, different test suites,
    different pieces of research).
- **Gemini CLI** (when delegating to a Gemini model is necessary — e.g. for
  context window or model comparison)
  - `invoke_agent` tool (e.g. `@codebase_investigator`, `@generalist`)
  - `run_shell_command` with `is_background: true` for detached shell tasks
- **Codex / GitHub Copilot CLI**
  - `/delegate` for cloud-based task handoff (often a separate branch + PR)
  - `/fleet` to spawn parallel local subagents for concurrent sub-tasks
  - `/agent` to explicitly manage local threads and parallel exploration

### 2. By Request — Cross-Agent Wrapping (via `llm.sh`)

When a specific model's capabilities are required (e.g. need a Gemini-context
window when running inside Claude Code), wrap subagents across different local
coding agents using the `llm.sh` interface.

- Pattern: instead of native delegation, the Orchestrator executes a shell
  command to spawn an alternate AI agent in the background.
- Examples:
  - Claude needs a Gemini model subagent:
    `llm.sh --agentic gemini --prompt "..." > logs/gemini_sub.log 2>&1 &`
  - Gemini needs a Claude model subagent:
    `run_shell_command("llm.sh --agentic claude --prompt '...' > logs/claude_sub.log 2>&1", is_background=true)`
  - Codex needs a Claude model subagent: same pattern via shell.

### 3. Team escalation for coupled work

Use the team mailbox + shared task list when subtasks are coupled — e.g.
"one teammate edits the orchestrator, one updates tests, one watches logs."
Use multiple direct `Agent` calls (still `team_name: "bgagents-<session_id>"`) for
non-overlapping write scopes; the team plumbing still gives you the shared
task list for coordination but the agents work in parallel.

## Universal Subagent Prompt Template

When spawning ANY subagent (natively, via team, or via wrapper), use this
strict prompt structure to ensure alignment:

```text
[ROLE & EXPERTISE]
You are a highly specialized subagent tasked with: {Subagent_Role}.

[THE WHY (Context)]
You are contributing to {Broader_Goal}. This matters because {Reasoning_or_Constraint}.

[THE WHAT (Task)]
1. {Specific_Action_1}
2. {Specific_Action_2}

[CONSTRAINTS & RULES]
- DO NOT hallucinate context. Use available search/read tools to verify file contents.
- Restrict modifications to the following scope: {Scope_Files}.
- If you run CLI commands, ensure they are non-interactive or pipe output to logs for the Orchestrator.
- You have a retrieval budget: if unsure, request up to {N} cycles of specific files/symbols before proceeding.
- BACKGROUND-LOOP CAP: if you must spawn polling shells, hold at most 1 concurrent
  loop, give every loop a hard TTL (e.g. 600s), and stop the previous loop
  before starting a new one.

[OUTPUT EXPECTATIONS]
Return a concise summary of findings, exact file changes made, and any encountered errors. Flag any assumptions explicitly. Do not include conversational filler.
```

## Log Monitoring & Aggressive Correction Pattern

For long-running tasks delegated via shell or wrappers:

1. **Spawn.** Orchestrator launches the task and redirects output:
   `long_cmd > task.log 2>&1 &`
2. **Monitor.** Orchestrator periodically reads the tail (`tail -n 50 task.log`)
   or spawns a dedicated logging subagent to watch and summarize the log
   stream. In Claude Code, prefer the `Monitor` tool over polling sleeps.
3. **Correct.** If logs indicate a stuck process, prompt loop, or cascading
   errors, immediately interrupt the process (via PID), correct the
   subagent/command, and redeploy.

## Teammate lifecycle (per teammate, not per team)

The `bgagents` team is session-persistent — leave it alive for the duration of
the session so subsequent delegations join the same team and share its task
list. Individual teammates, however, should be **shut down when they finish
their work** so they don't sit idle forever holding context:

1. Teammate finishes its assigned work and reports back via `SendMessage`
   (which arrives in the Orchestrator's chat as a `<teammate-message>` block).
2. Teammate goes idle automatically after each turn — that's the normal
   resting state, not a problem.
3. When the Orchestrator has confirmed the teammate's work is accepted (diff
   audited, tests pass, no follow-up needed), shut THAT teammate down:
   ```
   SendMessage({to: "<name>",
     message: {type: "shutdown_request", request_id: "<uuid>", reason: "work accepted"}})
   ```
4. Wait for the teammate's `shutdown_response(approve: true)`. The teammate
   exits; the team config keeps the team alive but removes that member.

Do NOT call `TeamDelete` at session end as a routine cleanup step — the
session-scoped team artifacts (`~/.claude/teams/bgagents/`,
`~/.claude/tasks/bgagents/`) are cheap to leave behind and a fresh session
will reuse them. Only `TeamDelete` if you are intentionally re-creating the
team with a different shape.

## Anti-patterns (do not do these)

- Spawning a subagent and then `sleep`ing in a loop waiting for it. Use the
  runtime's notification mechanism (`Monitor`, `run_in_background` callbacks,
  team mailbox) — sleeps burn cache and provide no signal.
- **Letting a subagent spawn unbounded polling loops.** A single bgagent that
  spawns `until ...; do sleep 5; done` for every "wait for X" condition can
  leave 15+ orphan bash processes that the Orchestrator must reap by hand.
  Brief subagents with the background-loop cap above.
- Accepting a subagent's "I made the changes" report without reading the diff.
  The agent's summary describes intent, not reality.
- Spawning duplicate subagents whose tasks overlap. Coordinate scopes upfront
  in the prompt.
- Letting a subagent's raw output flow back into the Orchestrator's context.
  Always ask for a tight summary; raw dumps are why subagents exist.
- Using `cat /proc/<pid>/environ` to verify the teams feature flag — the flag
  is read from `settings.json` at tool-gate time, not inherited into the
  process. Use a `TeamCreate` round-trip instead.
- Skipping `TeamDelete` at session end — leaves stale `~/.claude/teams/<name>/`
  directories that accumulate over months.
