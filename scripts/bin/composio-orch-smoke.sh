#!/usr/bin/env bash
# composio-orch-smoke.sh — fast health probe for cron-style monitoring.
# Calls `composio-orch pending` and asserts the JSON parses; emits one ECS
# event indicating service health.
set -uo pipefail
export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$HOME/.dotfiles/scripts/bin:$PATH"

readonly SERVICE_NAME=composio-orch-smoke
RUN_ID=${DOTFILES_BOOTSTRAP_RUN_ID:-$(uuidgen 2>/dev/null||printf '%s-%s' "$(date +%s%N)" "$RANDOM")}
HOST="local"
STATE_DIR=${XDG_STATE_HOME:-$HOME/.local/state}
LOG_FILE=${COMPOSIO_SMOKE_LOG_FILE:-$STATE_DIR/composio-orch-smoke.jsonl}

emit(){ local lvl=$1 act=$2 out=$3 detail=${4:-} ts json
  ts=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)
  json=$(jq -nc --arg ts "$ts" --arg l "$lvl" --arg a "$act" --arg o "$out" \
    --arg svc "$SERVICE_NAME" --arg host "$HOST" --arg detail "$detail" \
    --arg trace "$RUN_ID" --arg eid "${RUN_ID}-1" \
    '{"@timestamp":$ts,"log.level":$l,"event.action":$a,"event.outcome":$o,"event.id":$eid,"trace.id":$trace,"service.name":$svc,"labels":{"host":$host,"detail":$detail}}')
  printf '%s\n' "$json" >&2
  printf '%s\n' "$json" >> "$LOG_FILE" 2>/dev/null||:
}

mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null||:

ORCH_BIN=${COMPOSIO_ORCH_BIN:-$HOME/.dotfiles/scripts/bin/composio-orch}
if ! OUT=$("$ORCH_BIN" pending 2>/dev/null); then
  emit error smoke.pending failure "composio-orch pending returned non-zero"
  exit 1
fi

if ! echo "$OUT" | jq . >/dev/null 2>&1; then
  emit error smoke.pending failure "non-JSON output: $(echo "$OUT" | head -c 100)"
  exit 1
fi

COUNT=$(echo "$OUT" | jq 'length')
emit info smoke.pending success "pendingCount=$COUNT"
