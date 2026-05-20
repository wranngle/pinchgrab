#!/usr/bin/env bash
# SessionStart hook: prime the `bgagents` team for this Claude Code session.
#
# Why this is a SessionStart hook (not a UserPromptSubmit hook): the bgagents
# skill's first directive is "always prime a team at session start before any
# Agent tool call." Doing it on UserPromptSubmit would race with the user's
# first prompt; SessionStart runs once at session boot and its stdout is
# prepended to the session context, so by the time Claude reads its first
# user prompt it already knows whether the team needs creating.
#
# Idempotent: if the team config already exists from a prior session, this
# hook just echoes "already primed". Otherwise it instructs Claude to run
# `TeamCreate({team_name: "bgagents", ...})` at first opportunity. Claude
# itself owns the actual TeamCreate call because that tool is harness-only;
# we cannot invoke it from a shell.
set -uo pipefail

readonly TEAM_NAME="bgagents"
readonly TEAM_DIR="$HOME/.claude/teams/$TEAM_NAME"
readonly TEAM_CONFIG="$TEAM_DIR/config.json"
# Canonical artifact layout: <repo>/.artifacts/symphony/bgagents-prime.<date>.jsonl
# Hook fires from arbitrary cwds; default to ~/.dotfiles as the hosting project.
readonly FIRE_LOG_DIR="${HOME}/.dotfiles/.artifacts/symphony"
# shellcheck disable=SC2155  # `date -u +%F` cannot fail; readonly+subshell intentional
readonly FIRE_LOG="$FIRE_LOG_DIR/bgagents-prime.$(date -u +%Y-%m-%d).jsonl"

# Timestamp every fire as ECS-jsonl so log shippers and `jq` can consume it.
# One JSON object per line; ECS field names so this aligns with llm.sh and the
# rest of the dotfiles logging surface.
mkdir -p "$FIRE_LOG_DIR" 2>/dev/null

emitFireEvent() { local team_state=$1 ts eid json
  ts=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ 2>/dev/null || date -u)
  eid=$(uuidgen 2>/dev/null || printf '%s-%s' "$(date +%s%N)" "$RANDOM")
  json=$(jq -nc \
    --arg ts "$ts" \
    --arg lvl "info" \
    --arg act "symphony.bgagents.prime" \
    --arg out "success" \
    --arg eid "$eid" \
    --arg trace "$eid" \
    --arg svc "symphony-bgagents-prime" \
    --arg team_name "$TEAM_NAME" \
    --arg team_state "$team_state" \
    --arg pid "$$" \
    --arg ppid "$PPID" \
    --arg claude_session_id "${CLAUDE_SESSION_ID:-}" \
    --arg claude_hook_event "${CLAUDE_HOOK_EVENT:-}" \
    --arg claude_hook_matcher "${CLAUDE_HOOK_MATCHER:-}" \
    --arg argv0 "$0" \
    '{"@timestamp":$ts,"log.level":$lvl,"event.action":$act,"event.outcome":$out,"event.id":$eid,"trace.id":$trace,"service.name":$svc,"labels":{"team_name":$team_name,"team_state":$team_state,"pid":$pid,"ppid":$ppid,"claude_session_id":$claude_session_id,"claude_hook_event":$claude_hook_event,"claude_hook_matcher":$claude_hook_matcher,"argv0":$argv0}}')
  printf '%s\n' "$json" >> "$FIRE_LOG" 2>/dev/null || true
}

if [[ -f "$TEAM_CONFIG" ]]; then
  emitFireEvent "already_primed"
  printf '[bgagents] team %q already primed at %s — joining existing team for this session.\n' \
    "$TEAM_NAME" "$TEAM_CONFIG"
  exit 0
fi

emitFireEvent "no_team_yet"

cat <<HOOK_OUT
[bgagents] No 'bgagents' team yet for this session.

CLAUDE: at your earliest opportunity, before any Agent tool invocation, run:

  TeamCreate({
    team_name: "bgagents",
    agent_type: "team-lead",
    description: "Default bgagents team for this session"
  })

After it returns, every subsequent Agent call must pass team_name: "bgagents"
plus a unique name (e.g. researcher, builder, tester) so subagents share the
team's task list and message bus. See ~/.dotfiles/.agents/skills/bgagents/SKILL.md
for the full pattern.
HOOK_OUT
