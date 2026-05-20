#!/usr/bin/env bash
# PreToolUse hook for Claude Code. Forces every `Agent` tool call to include
# a non-empty `team_name`, so subagents always join the session-primed
# bgagents team rather than spawning solo (which loses the shared task list
# and message bus). Other tools pass through untouched.
#
# Why a hook in addition to the bgagents skill prompt? The skill mandates
# `team_name` as Directive #1, but the prompt-only path can leak when the
# Orchestrator forgets it on the first call of a session, or under context
# pressure. This hook is a hard backstop.
#
# Stdin (Claude Code PreToolUse contract):
#   {"hook_event_name": "PreToolUse", "tool_name": "Agent",
#    "tool_input": {...}}
#
# Stdout on deny (PreToolUse permissionDecision JSON):
#   {"hookSpecificOutput": {
#     "hookEventName": "PreToolUse",
#     "permissionDecision": "deny",
#     "permissionDecisionReason": "..." }}
#
# Exit 0 always; deny is communicated via stdout JSON, not exit code.
set -uo pipefail

# Canonical artifact layout: <repo>/.artifacts/claude-enforce/events.<date>.jsonl.
# Falls back to ~/.dotfiles when invoked outside a repo (typical for Claude
# Code PreToolUse hooks that fire from arbitrary cwds).
readonly LOG_REPO_ROOT="${CLAUDE_ENFORCE_REPO_ROOT:-${HOME}/.dotfiles}"
readonly LOG_DIR="$LOG_REPO_ROOT/.artifacts/claude-enforce"
# shellcheck disable=SC2155  # `date -u +%F` cannot fail; readonly+subshell intentional
readonly LOG="$LOG_DIR/events.$(date -u +%Y-%m-%d).jsonl"

mkdir -p "$LOG_DIR" 2>/dev/null

emitDecisionLog() {
  local outcome=$1 reason=$2 tool=$3 has_team=$4 ts eid json
  ts=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ 2>/dev/null || date -u)
  eid=$(uuidgen 2>/dev/null || printf '%s-%s' "$(date +%s%N)" "$RANDOM")
  json=$(jq -nc \
    --arg ts "$ts" \
    --arg lvl "info" \
    --arg act "claude.agent.gate" \
    --arg out "$outcome" \
    --arg eid "$eid" \
    --arg trace "$eid" \
    --arg svc "claude-enforce-agent-teamname" \
    --arg tool "$tool" \
    --arg has_team "$has_team" \
    --arg reason "$reason" \
    '{"@timestamp":$ts,"log.level":$lvl,"event.action":$act,"event.outcome":$out,"event.id":$eid,"trace.id":$trace,"service.name":$svc,"labels":{"tool_name":$tool,"has_team_name":$has_team,"reason":$reason}}')
  printf '%s\n' "$json" >> "$LOG" 2>/dev/null || true
}

input=$(cat 2>/dev/null || true)
[[ -z $input ]] && exit 0

tool_name=$(printf '%s' "$input" | jq -r '.tool_name // empty' 2>/dev/null)
[[ $tool_name != "Agent" ]] && exit 0

team_name=$(printf '%s' "$input" | jq -r '.tool_input.team_name // empty' 2>/dev/null)

if [[ -n $team_name ]]; then
  emitDecisionLog "success" "team_name present" "$tool_name" "true"
  exit 0
fi

emitDecisionLog "failure" "missing team_name" "$tool_name" "false"
jq -nc \
  --arg reason "Agent tool calls in this session must include team_name: \"bgagents\". Re-issue with team_name set so the subagent joins the shared task list and message bus. See ~/.dotfiles/.agents/skills/bgagents/SKILL.md Directive #1." \
  '{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": $reason}}'
exit 0
