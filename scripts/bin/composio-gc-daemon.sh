#!/usr/bin/env bash
# composio-gc-daemon.sh — cron-invokable wrapper for the orchestrator's GC pass.
# Mirrors git-autosync.sh: ECS jsonl on stderr + log file, single-instance
# flock, pinned PATH, deterministic envelope.
set -uo pipefail
export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$HOME/.dotfiles/scripts/bin:$PATH"

if ! command -v node >/dev/null 2>&1; then
  _NVM_BIN=$(find "$HOME/.nvm/versions/node" -maxdepth 2 -type d -name "bin" 2>/dev/null | sort -V | tail -n 1)
  [[ -n "$_NVM_BIN" ]] && export PATH="$_NVM_BIN:$PATH"
fi

readonly SERVICE_NAME=composio-gc
RUN_ID=${DOTFILES_BOOTSTRAP_RUN_ID:-$(uuidgen 2>/dev/null||printf '%s-%s' "$(date +%s%N)" "$RANDOM")}
HOST="local"
STATE_DIR=${XDG_STATE_HOME:-$HOME/.local/state}
LOG_FILE=${COMPOSIO_GC_LOG_FILE:-$STATE_DIR/composio-gc.jsonl}
LOCK_FILE=${COMPOSIO_GC_LOCK:-/tmp/composio-gc.lock}
SEQ_FILE=$(mktemp -t composio-gc-seq.XXXXXX); echo 0 > "$SEQ_FILE"
trap 'rm -f "$SEQ_FILE"' EXIT
mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null||:

emitEcsEventOnStderr(){ local lvl=$1 act=$2 out=$3 detail=${4:-} err=${5:-} ts json seq
  seq=$(( $(<"$SEQ_FILE") + 1 )); echo "$seq" > "$SEQ_FILE"
  ts=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)
  json=$(jq -nc --arg ts "$ts" --arg l "$lvl" --arg a "$act" --arg o "$out" \
    --arg svc "$SERVICE_NAME" --arg host "$HOST" --arg detail "$detail" --arg err "$err" \
    --arg trace "$RUN_ID" --arg eid "${RUN_ID}-${seq}" \
    '{"@timestamp":$ts,"log.level":$l,"event.action":$a,"event.outcome":$o,"event.id":$eid,"trace.id":$trace,"service.name":$svc,"labels":{"host":$host,"detail":$detail}}+(if $err=="" then {} else {"error.message":$err} end)')
  printf '%s\n' "$json" >&2
  printf '%s\n' "$json" >> "$LOG_FILE" 2>/dev/null||:
}

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  emitEcsEventOnStderr info gc.lock-held success 'another run holds the lock'
  exit 0
fi

for tool in jq node flock; do
  command -v "$tool" >/dev/null||{ emitEcsEventOnStderr error gc.prereq failure "$tool" "missing required tool"; exit 2; }
done

DOTFILES_ROOT=${DOTFILES_ROOT:-$HOME/.dotfiles}
ORCH_DIR=$DOTFILES_ROOT/lib/composio-orchestrator
GC_ENTRY=$ORCH_DIR/daemon/gcLoop.ts

if [[ ! -f $GC_ENTRY ]]; then
  emitEcsEventOnStderr error gc.entry-missing failure "$GC_ENTRY" 'orchestrator daemon entry missing'
  exit 2
fi

TSX_LOADER=$ORCH_DIR/node_modules/tsx/dist/loader.mjs
if [[ ! -f $TSX_LOADER ]]; then
  emitEcsEventOnStderr error gc.tsx-missing failure "$TSX_LOADER" 'tsx not installed; run npm install'
  exit 2
fi

emitEcsEventOnStderr info gc.start success
START_TS=$(date +%s)
if OUT=$(node --import "file://$TSX_LOADER" "$GC_ENTRY" 2>>"$LOG_FILE"); then
  emitEcsEventOnStderr info gc.complete success "$(echo "$OUT" | tr -d '\n' | head -c 200)"
else
  RC=$?
  emitEcsEventOnStderr error gc.failed failure "exit=$RC took=$(( $(date +%s) - START_TS ))s" 'orchestrator gc loop returned non-zero'
  exit "$RC"
fi
