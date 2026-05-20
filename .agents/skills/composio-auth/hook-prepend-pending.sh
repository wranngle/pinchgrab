#!/usr/bin/env bash
# hook-prepend-pending.sh — UserPromptSubmit hook that emits one line per
# pending Composio auth entry on stdout (appended to the agent's context per
# Claude Code / Gemini / Codex hook semantics). Always emits an ECS jsonl
# event to LOG_FILE on stderr so the orchestrator can be debugged from the
# log even when the hook is silent on stdout (the silent-success case is
# itself a useful signal).
set -uo pipefail
export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$PATH"

readonly SERVICE_NAME=composio-auth-hook
HOST="local"
RUN_ID=${DOTFILES_BOOTSTRAP_RUN_ID:-$(date +%s%N 2>/dev/null||echo $$)-$$}
STATE_DIR=${XDG_STATE_HOME:-$HOME/.local/state}
LOG_FILE=${COMPOSIO_HOOK_LOG_FILE:-$STATE_DIR/composio-orch.jsonl}
PENDING_FILE=${COMPOSIO_PENDING_FILE:-$HOME/.agents/state/composio-pending-auth.json}
mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null||:

emit(){ local lvl=$1 act=$2 out=$3 detail=${4:-} err=${5:-} ts json
  ts=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ 2>/dev/null||date -u +%Y-%m-%dT%H:%M:%SZ)
  if command -v jq >/dev/null 2>&1; then
    json=$(jq -nc --arg ts "$ts" --arg l "$lvl" --arg a "$act" --arg o "$out" \
      --arg svc "$SERVICE_NAME" --arg host "$HOST" --arg detail "$detail" --arg err "$err" \
      --arg trace "$RUN_ID" --arg eid "${RUN_ID}-1" \
      '{"@timestamp":$ts,"log.level":$l,"event.action":$a,"event.outcome":$o,"event.id":$eid,"trace.id":$trace,"service.name":$svc,"labels":{"host":$host,"detail":$detail}}+(if $err=="" then {} else {"error.message":$err} end)')
  else
    json="{\"@timestamp\":\"$ts\",\"log.level\":\"$lvl\",\"event.action\":\"$act\",\"event.outcome\":\"$out\",\"event.id\":\"${RUN_ID}-1\",\"trace.id\":\"$RUN_ID\",\"service.name\":\"$SERVICE_NAME\",\"labels\":{\"host\":\"$HOST\",\"detail\":\"$detail\"}}"
  fi
  printf '%s\n' "$json" >&2
  printf '%s\n' "$json" >> "$LOG_FILE" 2>/dev/null||:
}

if [[ ! -s $PENDING_FILE ]]; then
  emit info hook.no-pending success "$PENDING_FILE missing or empty"
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  emit error hook.prereq failure '' 'jq not in PATH'
  exit 0
fi

if [[ ${COMPOSIO_HOOK_SYNC_PENDING:-1} != 0 ]]; then
  ORCH_BIN=$(command -v composio-orch 2>/dev/null||printf '%s/.dotfiles/scripts/bin/composio-orch' "$HOME")
  if [[ -x $ORCH_BIN ]]; then
    SYNC_RC=0
    timeout 6s "$ORCH_BIN" pending --sync >/dev/null 2>>"$LOG_FILE" || SYNC_RC=$?
    timeout 6s "$ORCH_BIN" pending --reap-expired >/dev/null 2>>"$LOG_FILE" || SYNC_RC=$?
    if (( SYNC_RC == 0 )); then
      emit info hook.sync success "refreshed pending auth state before surfacing"
    else
      emit warn hook.sync failure "pending auth refresh failed; surfacing local state" "exit=$SYNC_RC"
    fi
  else
    emit warn hook.sync failure "composio-orch not executable; surfacing local state"
  fi
fi

ENTRIES=$(jq -r '.entries[]?|"PENDING_AUTH \(.toolkit) -> \(.redirectUrl) (user=\(.userId), expires=\(.expiresAt))"' "$PENDING_FILE" 2>/dev/null)
RC=$?
if (( RC != 0 )); then
  emit error hook.parse failure "$PENDING_FILE" "jq exit=$RC"
  exit 0
fi

if [[ -z $ENTRIES ]]; then
  emit info hook.no-pending success "no entries in pending file"
  exit 0
fi

COUNT=$(printf '%s\n' "$ENTRIES" | wc -l | tr -d ' ')
emit info hook.surfaced success "count=$COUNT"
printf '%s\n' "$ENTRIES"
