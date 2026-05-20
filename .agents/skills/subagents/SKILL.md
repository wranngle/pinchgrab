---
name: subagents
description: >-
  Operate the local subagents orchestration stack across Claude Code, Gemini CLI, and Codex. Use when
  delegating work, spawning background agents, wrapping tasks through llm.sh, monitoring agent logs,
  handling permission or rate limits, or handing off output from parallel agent work.
---

# Subagents Orchestration

Use this skill when the main agent needs parallel or isolated work while keeping
ownership of the final answer. The orchestrator remains accountable for scope,
verification, and handoff.

## Ground Rules

1. Define each subagent's role, scope, allowed paths, and output contract before
   launch.
2. Keep scopes disjoint. Do not assign two agents to edit the same files unless
   the second task is an explicit review.
3. Prefer native subagent features first. Use `llm.sh` when a different local
   agent/model is needed or when the current runtime has no native delegation.
4. Send long-running work to the background with logs. Avoid interactive prompts.
5. Audit the result yourself: read logs, inspect diffs, run relevant checks, and
   reconcile conflicts before reporting success.

## Local Surfaces

- **Claude Code**: use native `Agent`/team features when available. For shell
  launches, use `claude -p --dangerously-skip-permissions --strict-mcp-config
  --disable-slash-commands --setting-sources user --model sonnet --output-format
  text -`.
- **Gemini CLI**: use native `invoke_agent` when available. For shell launches,
  use `gemini -p - -y --output-format text -m <model>`.
- **Codex**: use native `/agent`, `/fleet`, or `/delegate` when available. For
  shell launches, use `npx -y @openai/codex exec --ephemeral
  --dangerously-bypass-approvals-and-sandbox --color never -m <model> -`.
- **Cross-agent wrapper**: prefer `~/.dotfiles/scripts/bin/llm.sh` for portable
  Claude/Gemini/Codex fallback behavior. It reads the prompt from stdin or argv,
  writes the model response to stdout, emits ECS JSONL events on stderr, and
  honors `LLM_CHAIN`, `LLM_SYSTEM`, `LLM_TIMEOUT`, and `DOTFILES_LOG_FILE`.

## Background Launch Pattern

Create a small run directory per subagent and keep prompt, logs, output, and PID
together.

```bash
run_dir="logs/subagents/$(date -u +%Y%m%dT%H%M%SZ)-research"
mkdir -p "$run_dir"
$EDITOR "$run_dir/prompt.txt"

DOTFILES_LOG_FILE="$PWD/logs/subagents/events.jsonl" \
LLM_CHAIN="gemini:gemini-3.1-pro-preview,claude:sonnet,codex:o3-mini" \
LLM_TIMEOUT=900 \
~/.dotfiles/scripts/bin/llm.sh < "$run_dir/prompt.txt" \
  > "$run_dir/output.md" 2> "$run_dir/events.jsonl" &
printf '%s\n' "$!" > "$run_dir/pid"
```

Monitor with targeted reads:

```bash
tail -n 80 "$run_dir/events.jsonl"
tail -n 120 "$run_dir/output.md"
ps -p "$(cat "$run_dir/pid")" -o pid,etime,cmd
```

When provider-specific behavior matters, narrow `LLM_CHAIN`:

```bash
LLM_CHAIN="claude:sonnet" ~/.dotfiles/scripts/bin/llm.sh < prompt.txt
LLM_CHAIN="gemini:gemini-3.1-pro-preview" ~/.dotfiles/scripts/bin/llm.sh < prompt.txt
LLM_CHAIN="codex:o3-mini" ~/.dotfiles/scripts/bin/llm.sh < prompt.txt
```

## Prompt Contract

Use a compact, explicit prompt:

```text
[ROLE]
You are Worker {name}: {expertise}.

[GOAL]
Contribute to: {broader goal}.

[SCOPE]
Read: {paths}
May edit: {paths or "none"}
Do not touch: {paths}

[TASKS]
1. {specific task}
2. {specific task}

[EXECUTION RULES]
- Verify file contents before making claims.
- Use non-interactive commands only.
- Put long-running command output in logs.
- Stop and report if scope conflicts or credentials are missing.

[OUTPUT]
Return: summary, exact paths changed, commands run, validation results, blockers,
and assumptions. Keep it concise.
```

## Permission And Limit Handling

- Keep the shared source of secrets in `~/.agents/.env`; do not paste secrets
  into prompts or logs.
- The dotfiles convention is "wide open" local automation: use YOLO,
  skip-permission, and bypass-sandbox flags where the CLI supports them.
- `llm.sh` already retries quota/rate/capacity errors and advances through the
  fallback chain. If it exhausts the chain, inspect `events.jsonl`, reduce task
  size, narrow or change `LLM_CHAIN`, or raise `LLM_TIMEOUT`.
- If a CLI wants interactive auth, stop that subagent and report the exact setup
  needed. Do not leave a process waiting for input.
- If a process appears stuck, read its log first; then interrupt by PID only if
  the log confirms it is blocked or looping.

## Handoff

Before accepting subagent output:

1. Read the run output and relevant event log tail.
2. Inspect all files the subagent claims to have changed.
3. Run the smallest meaningful validation for the touched surface.
4. Merge findings into the orchestrator's final response with exact paths,
   checks run, residual risks, and any manual setup.

## Hydration Notes

- Canonical live source: `~/.agents/skills/subagents/SKILL.md`.
- Dotfiles source: `~/.dotfiles/.agents/skills/subagents/SKILL.md`.
- The dotfiles bootstrap ingests repo skills into `~/.agents/skills`, symlinks
  them into `~/.claude/skills` and `~/.codex/skills`, and leaves Gemini to
  discover `~/.agents/skills` directly.
- When Codex runs from the dotfiles repo, custom skills can appear from both
  `~/.dotfiles/.agents/skills` and `~/.agents/skills`; that is expected as long
  as those directories remain converged.
  Prefer editing the canonical and dotfiles copies, then let bootstrap or
  per-skill symlinks hydrate agent-specific registries.
