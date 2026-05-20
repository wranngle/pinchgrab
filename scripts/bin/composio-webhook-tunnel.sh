#!/usr/bin/env bash
# composio-webhook-tunnel.sh — keep a Cloudflare Tunnel alive that forwards
# the public URL to 127.0.0.1:8787 (the local webhookReceiver). On startup
# upserts COMPOSIO_WEBHOOK_URL into ~/.agents/.env via composio-orch so
# triggerRegistrar.ts can register it. Intended to run via cron every 5
# minutes; if a tunnel is already up, this exits 0.
set -uo pipefail
export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$HOME/.dotfiles/scripts/bin:$PATH"
if ! command -v node >/dev/null 2>&1; then
  _NVM_BIN=$(find "$HOME/.nvm/versions/node" -maxdepth 2 -type d -name "bin" 2>/dev/null | sort -V | tail -n 1)
  [[ -n "$_NVM_BIN" ]] && export PATH="$_NVM_BIN:$PATH"
fi

readonly SERVICE_NAME=composio-webhook-tunnel
RUN_ID=${DOTFILES_BOOTSTRAP_RUN_ID:-$(uuidgen 2>/dev/null||printf '%s-%s' "$(date +%s%N)" "$RANDOM")}
HOST="local"
STATE_DIR=${XDG_STATE_HOME:-$HOME/.local/state}
LOG_FILE=${COMPOSIO_TUNNEL_LOG_FILE:-$STATE_DIR/composio-webhook-tunnel.jsonl}
LOCK_FILE=${COMPOSIO_TUNNEL_LOCK:-/tmp/composio-webhook-tunnel.lock}
ENV_FILE=${COMPOSIO_AGENTS_ENV_FILE:-$HOME/.agents/.env}
LOCAL_PORT=${COMPOSIO_WEBHOOK_PORT:-8787}
DOTFILES_ROOT=${DOTFILES_ROOT:-$HOME/.dotfiles}
ORCH_BIN=${COMPOSIO_ORCH_BIN:-$(command -v composio-orch 2>/dev/null||printf '%s/scripts/bin/composio-orch' "$DOTFILES_ROOT")}
ORCH_DIR=$DOTFILES_ROOT/lib/composio-orchestrator
RECEIVER_ENTRY=$ORCH_DIR/daemon/webhookReceiver.ts
TSX_LOADER=$ORCH_DIR/node_modules/tsx/dist/loader.mjs
SEQ_FILE=$(mktemp -t composio-tunnel-seq.XXXXXX); echo 0 > "$SEQ_FILE"
trap 'rm -f "$SEQ_FILE"' EXIT
mkdir -p "$(dirname "$LOG_FILE")" "$(dirname "$ENV_FILE")" 2>/dev/null||:
: >>"$LOG_FILE" 2>/dev/null||:

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
  emitEcsEventOnStderr info tunnel.lock-held success 'another run holds the lock'
  exit 0
fi

if ! command -v cloudflared >/dev/null; then
  emitEcsEventOnStderr warn tunnel.prereq failure cloudflared 'install cloudflared to enable webhook completion'
  exit 0
fi
if ! command -v node >/dev/null; then
  emitEcsEventOnStderr warn tunnel.prereq failure node 'node is required to run the local webhook receiver'
  exit 0
fi
if [[ ! -x $ORCH_BIN ]]; then
  emitEcsEventOnStderr warn tunnel.prereq failure "$ORCH_BIN" 'composio-orch shim is not executable'
  exit 0
fi
if [[ ! -f $RECEIVER_ENTRY || ! -f $TSX_LOADER ]]; then
  emitEcsEventOnStderr warn tunnel.prereq failure "$RECEIVER_ENTRY" 'webhook receiver or tsx loader missing; run npm install'
  exit 0
fi

isLocalReceiverListening(){
  if command -v ss >/dev/null 2>&1; then
    ss -ltn 2>/dev/null | grep -Eq "(127\\.0\\.0\\.1|localhost):$LOCAL_PORT\\b" && return 0
  fi
  timeout 1s bash -c "</dev/tcp/127.0.0.1/$LOCAL_PORT" >/dev/null 2>&1
}

startDetached(){
  local label=$1
  shift
  if command -v setsid >/dev/null 2>&1; then
    nohup setsid bash -c 'exec 9>&-; exec "$@"' "$label" "$@" >>"$LOG_FILE" 2>&1 &
  else
    nohup bash -c 'exec 9>&-; exec "$@"' "$label" "$@" >>"$LOG_FILE" 2>&1 &
  fi
  printf '%s\n' "$!"
}

startLocalReceiverIfNeeded(){
  if isLocalReceiverListening; then
    emitEcsEventOnStderr info receiver.already-running success "127.0.0.1:$LOCAL_PORT"
    return 0
  fi
  emitEcsEventOnStderr info receiver.starting success "127.0.0.1:$LOCAL_PORT"
  local receiverPid
  receiverPid=$(startDetached composio-webhook-receiver node --import "file://$TSX_LOADER" "$RECEIVER_ENTRY")
  for _ in 1 2 3 4 5; do
    sleep 1
    if isLocalReceiverListening; then
      emitEcsEventOnStderr info receiver.started success "pid=$receiverPid port=$LOCAL_PORT"
      return 0
    fi
  done
  emitEcsEventOnStderr warn receiver.start-timeout failure "pid=$receiverPid port=$LOCAL_PORT" 'receiver did not bind before timeout'
  return 1
}

latestTunnelUrlFromLog(){
  local startLine=${1:-1}
  tail -n +"$startLine" "$LOG_FILE" 2>/dev/null \
    | grep -Eo 'https://[a-z0-9-]+\.trycloudflare\.com' \
    | tail -n1 || true
}

publishAndRegisterTunnelUrl(){
  local url=$1
  if "$ORCH_BIN" set-webhook-url "$url" >/dev/null 2>&1; then
    emitEcsEventOnStderr info tunnel.url-published success "$url"
  else
    emitEcsEventOnStderr warn tunnel.url-publish-failed failure "$url" 'composio-orch set-webhook-url returned non-zero'
    return 1
  fi
  if "$ORCH_BIN" register-webhook >/dev/null 2>&1; then
    emitEcsEventOnStderr info tunnel.webhook-registered success "$url/webhook"
  else
    emitEcsEventOnStderr warn tunnel.webhook-register-failed failure "$url/webhook" 'composio-orch register-webhook returned non-zero'
    return 1
  fi
}

startLocalReceiverIfNeeded || :

# Quick tunnels (no Cloudflare account / cert.pem required) only emit a
# trycloudflare.com URL when launched WITHOUT --name. We pgrep on the URL
# pattern instead of the tunnel name to detect an existing instance.
if pgrep -f "cloudflared tunnel --url http://127.0.0.1:$LOCAL_PORT" >/dev/null; then
  TUNNEL_URL=$(latestTunnelUrlFromLog 1)
  if [[ -n $TUNNEL_URL ]]; then
    publishAndRegisterTunnelUrl "$TUNNEL_URL" || :
  fi
  emitEcsEventOnStderr info tunnel.already-running success "127.0.0.1:$LOCAL_PORT"
  exit 0
fi

emitEcsEventOnStderr info tunnel.starting success "quick-tunnel -> 127.0.0.1:$LOCAL_PORT"
START_LINE=$(( $(wc -l < "$LOG_FILE" 2>/dev/null||echo 0) + 1 ))
DISOWN_PID=$(startDetached composio-cloudflared cloudflared tunnel --url "http://127.0.0.1:$LOCAL_PORT" --no-autoupdate)
disown "$DISOWN_PID" 2>/dev/null||true

# Try to discover the assigned public URL (quick-tunnel logs it within ~5s).
# Use a wider window because first-time downloads of edge certs add latency.
TUNNEL_URL=
for _ in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
  sleep 1
  TUNNEL_URL=$(latestTunnelUrlFromLog "$START_LINE")
  [[ -n $TUNNEL_URL ]] && break
done
if [[ -n $TUNNEL_URL ]]; then
  publishAndRegisterTunnelUrl "$TUNNEL_URL" || :
else
  emitEcsEventOnStderr warn tunnel.url-missing failure '' 'public URL not seen in tunnel log'
fi
