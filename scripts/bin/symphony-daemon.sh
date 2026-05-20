#!/usr/bin/env bash
# symphony-daemon.sh — manage the Symphony orchestrator (BEAM) as a
# user-level daemon. Replaces the manual `cd lib/symphony-elixir &&
# MIX_ENV=orchestration mix run --no-halt` invocation so the orchestrator
# can self-host work items unattended.
#
# Subcommands: start [--foreground], stop, status, logs [--no-follow],
# restart, --help.
#
# Default-on telemetry: every invocation appends one ECS-shaped JSONL line
# to `<repo-root>/.artifacts/symphony/daemon.<yyyy-mm-dd>.jsonl` (canonical
# artifact layout shared with composio-orchestrator + git-awesome). The
# event shape mirrors scripts/bin/llm.sh so dashboards and log queries
# that already key on `service.name` keep working unchanged. Legacy XDG
# path `~/.local/state/symphony-daemon.jsonl` is no longer written.
set -uo pipefail

# ---- paths -----------------------------------------------------------------
REPO_ROOT="${SYMPHONY_REPO_ROOT:-$HOME/.dotfiles}"
WORKFLOW_FILE="${SYMPHONY_WORKFLOW_FILE:-$REPO_ROOT/WORKFLOW.md}"
ELIXIR_DIR="$REPO_ROOT/lib/symphony-elixir"
ARTIFACTS_DIR="$REPO_ROOT/.artifacts/symphony"
LOG_DIR="$ARTIFACTS_DIR"
LOG_FILE="$ARTIFACTS_DIR/orchestrator.log"
PID_FILE="$ARTIFACTS_DIR/orchestrator.pid"
SNAPSHOT_URL="${SYMPHONY_SNAPSHOT_URL:-http://127.0.0.1:4044/api/snapshot}"
STATE_DIR="$ARTIFACTS_DIR"
STATE_LOG="$ARTIFACTS_DIR/daemon.$(date -u +%Y-%m-%d).jsonl"
MISE_SHIMS="$HOME/.local/share/mise/shims"

# ---- ECS jsonl --------------------------------------------------------------
DAEMON_RUN_ID="$(uuidgen 2>/dev/null || printf '%s-%s' "$(date +%s%N)" "$RANDOM")"
DAEMON_EVT_SEQ=0
emit_ecs_event() {
  # args: level action outcome [labels_json] [error_message]
  local level=$1 action=$2 outcome=$3 labels=${4:-'{}'} err=${5:-}
  local ts json
  DAEMON_EVT_SEQ=$((DAEMON_EVT_SEQ + 1))
  ts=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)
  command -v jq >/dev/null 2>&1 || return 0
  mkdir -p "$STATE_DIR" 2>/dev/null || return 0
  json=$(jq -nc \
    --arg ts "$ts" --arg lvl "$level" --arg act "$action" --arg out "$outcome" \
    --arg svc symphony-daemon --arg trace "$DAEMON_RUN_ID" \
    --arg eid "${DAEMON_RUN_ID}-${DAEMON_EVT_SEQ}" --arg err "$err" \
    --argjson lbls "$labels" \
    '{"@timestamp":$ts,"log.level":$lvl,"event.action":$act,"event.outcome":$out,"event.id":$eid,"trace.id":$trace,"service.name":$svc,"labels":$lbls}+(if $err=="" then {} else {"error.message":$err} end)' \
    2>/dev/null) || return 0
  printf '%s\n' "$json" >> "$STATE_LOG" 2>/dev/null || return 0
}

# ---- helpers ---------------------------------------------------------------
ensure_dirs() { mkdir -p "$LOG_DIR" "$STATE_DIR" 2>/dev/null || true; }

ensure_path_has_mise_shims() {
  case ":$PATH:" in
    *":$MISE_SHIMS:"*) ;;
    *) export PATH="$MISE_SHIMS:$PATH" ;;
  esac
}

read_pid_file() {
  [[ -f $PID_FILE ]] || return 1
  local pid
  pid=$(<"$PID_FILE")
  [[ -n $pid && $pid =~ ^[0-9]+$ ]] || return 1
  printf '%s' "$pid"
}

is_pid_alive() { [[ -n ${1:-} ]] && kill -0 "$1" 2>/dev/null; }

# Returns 0 if Symphony is running under a systemd-user unit named
# `symphony.service`. Treated as the authoritative source: when systemd
# owns the process, this script must not start, stop, or pretend to own
# the BEAM. Silent on missing systemctl / no user manager.
is_systemd_managed() {
  command -v systemctl >/dev/null 2>&1 || return 1
  systemctl --user is-active --quiet symphony.service 2>/dev/null
}

# Returns the BEAM PID when systemd is managing it. Empty otherwise.
systemd_main_pid() {
  is_systemd_managed || return 1
  local pid
  pid=$(systemctl --user show -p MainPID --value symphony.service 2>/dev/null)
  [[ -n $pid && $pid =~ ^[0-9]+$ && $pid != 0 ]] || return 1
  printf '%s' "$pid"
}

# Returns 0 + prints PID on stdout if a daemon is currently up. Checks
# systemd-user first (authoritative when present) and falls back to the
# legacy PID-file flow. Prunes a stale PID file on the legacy path so the
# next `start` is not blocked by leftover state.
current_running_pid() {
  local pid
  if pid=$(systemd_main_pid); then
    printf '%s' "$pid"
    return 0
  fi
  pid=$(read_pid_file) || return 1
  if is_pid_alive "$pid"; then
    printf '%s' "$pid"
    return 0
  fi
  rm -f "$PID_FILE" 2>/dev/null
  return 1
}

snapshot_summary() {
  command -v curl >/dev/null 2>&1 || return 0
  command -v jq   >/dev/null 2>&1 || return 0
  local body
  body=$(curl -fsS --max-time 0.5 --connect-timeout 0.2 "$SNAPSHOT_URL" 2>/dev/null) || return 0
  [[ -n $body ]] || return 0
  jq -r '
    "running=\(((.running // []) | length)) retrying=\(((.retrying // []) | length))"
  ' <<<"$body" 2>/dev/null
}

# ---- subcommands -----------------------------------------------------------
cmd_start() {
  local foreground=0
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --foreground|-f) foreground=1 ;;
      *) printf 'symphony-daemon: unknown start option: %s\n' "$1" >&2; return 2 ;;
    esac
    shift
  done

  ensure_dirs
  ensure_path_has_mise_shims

  if [[ ! -d $ELIXIR_DIR ]]; then
    emit_ecs_event error symphony-daemon.start failure '{"subcommand":"start"}' "missing $ELIXIR_DIR"
    printf 'symphony-daemon: missing %s\n' "$ELIXIR_DIR" >&2
    return 1
  fi

  # In background mode, refuse double-launch — including the
  # systemd-managed case (the wrapper must never spawn a duplicate BEAM
  # while a systemd unit owns the lifecycle). In foreground mode the
  # caller is systemd (or a human running a fresh foreground process):
  # we let mix start unconditionally so port conflicts surface as a
  # crash systemd can restart, rather than masking the conflict with a
  # silent "already running" exit-zero.
  if (( ! foreground )); then
    if pid=$(current_running_pid); then
      local source=pid_file
      is_systemd_managed && source=systemd
      emit_ecs_event info symphony-daemon.start success \
        "$(jq -nc --arg pid "$pid" --arg log "$LOG_FILE" --arg src "$source" '{subcommand:"start",pid:$pid,log:$log,already_running:true,owner:$src}')" ""
      if [[ $source == systemd ]]; then
        printf 'already running pid %s under systemd-user (symphony.service); use systemctl --user to manage\n' "$pid"
      else
        printf 'already running pid %s at %s\n' "$pid" "$LOG_FILE"
      fi
      return 0
    fi
  fi

  export MIX_ENV=orchestration
  export SYMPHONY_WORKFLOW_FILE="$WORKFLOW_FILE"

  if (( foreground )); then
    emit_ecs_event info symphony-daemon.start success '{"subcommand":"start","foreground":true}' ""
    cd "$ELIXIR_DIR" || return 1
    exec mix run --no-halt
  fi

  : >>"$LOG_FILE" || { printf 'symphony-daemon: cannot append to %s\n' "$LOG_FILE" >&2; return 1; }

  # Subshell + exec chain preserves PID through mise shim → mix →
  # elixir → erl, so $! settles on the BEAM process. The pkill sweep
  # in cmd_stop is the safety net for shim layers that fork instead.
  (
    cd "$ELIXIR_DIR" || exit 127
    exec mix run --no-halt
  ) </dev/null >>"$LOG_FILE" 2>&1 &
  local pid=$!
  printf '%s\n' "$pid" > "$PID_FILE"

  # Settle window: brief enough to keep `start` under the 5s budget,
  # long enough that an immediate-crash failure mode (missing deps,
  # port already bound) is caught here instead of silently leaving a
  # stale PID file behind.
  sleep 1
  if ! is_pid_alive "$pid"; then
    rm -f "$PID_FILE"
    emit_ecs_event error symphony-daemon.start failure \
      "$(jq -nc --arg log "$LOG_FILE" '{subcommand:"start",log:$log}')" "process exited during startup; see log"
    printf 'symphony-daemon: orchestrator died during startup; tail %s\n' "$LOG_FILE" >&2
    return 1
  fi

  emit_ecs_event info symphony-daemon.start success \
    "$(jq -nc --arg pid "$pid" --arg log "$LOG_FILE" '{subcommand:"start",pid:$pid,log:$log}')" ""
  printf 'started pid %s, logging to %s\n' "$pid" "$LOG_FILE"
}

cmd_stop() {
  ensure_dirs

  # Systemd-owned: route through systemctl. Sending SIGTERM directly
  # while the unit is `Restart=on-failure` would just trigger an
  # immediate respawn (graceful TERM exits clean and is honored, but
  # SIGKILL escalation would loop forever).
  if is_systemd_managed; then
    local pid
    pid=$(systemd_main_pid 2>/dev/null || true)
    if systemctl --user stop symphony.service >/dev/null 2>&1; then
      emit_ecs_event info symphony-daemon.stop success \
        "$(jq -nc --arg pid "${pid:-}" '{subcommand:"stop",pid:$pid,managed_by:"systemd"}')" ""
      printf 'stopped systemd-user unit symphony.service (was pid %s)\n' "${pid:-?}"
      return 0
    fi
    emit_ecs_event error symphony-daemon.stop failure \
      '{"subcommand":"stop","managed_by":"systemd"}' "systemctl --user stop failed"
    printf 'symphony-daemon: systemctl --user stop symphony.service failed\n' >&2
    return 1
  fi

  local pid
  if ! pid=$(current_running_pid); then
    emit_ecs_event info symphony-daemon.stop success '{"subcommand":"stop","already_stopped":true}' ""
    printf 'stopped\n'
    return 0
  fi

  kill -TERM "$pid" 2>/dev/null || true
  local waited=0
  while (( waited < 10 )); do
    if ! is_pid_alive "$pid"; then break; fi
    sleep 1
    waited=$((waited + 1))
  done

  if is_pid_alive "$pid"; then
    kill -KILL "$pid" 2>/dev/null || true
    sleep 1
  fi

  # Belt-and-braces: if a wrapper (mise shim, port-mapper, etc.) sat
  # between $! and BEAM, killing the wrapper may not propagate. Sweep
  # any matching beam.smp so the acceptance probe `pgrep -f
  # beam.smp.*mix` returns nothing after stop.
  if command -v pkill >/dev/null 2>&1; then
    pkill -f 'beam.smp.*mix.*--no-halt' >/dev/null 2>&1 || true
  fi

  rm -f "$PID_FILE"
  emit_ecs_event info symphony-daemon.stop success \
    "$(jq -nc --arg pid "$pid" --argjson waited "$waited" '{subcommand:"stop",pid:$pid,wait_seconds:$waited}')" ""
  printf 'stopped (was pid %s)\n' "$pid"
}

cmd_status() {
  local pid summary owner=pid_file
  if pid=$(current_running_pid); then
    is_systemd_managed && owner=systemd
    summary=$(snapshot_summary || true)
    local owner_label
    [[ $owner == systemd ]] && owner_label=' [systemd-user]' || owner_label=''
    if [[ -n $summary ]]; then
      printf 'running (pid %s)%s [%s]\n' "$pid" "$owner_label" "$summary"
    else
      printf 'running (pid %s)%s\n' "$pid" "$owner_label"
    fi
    emit_ecs_event info symphony-daemon.status success \
      "$(jq -nc --arg pid "$pid" --arg s "$summary" --arg o "$owner" '{subcommand:"status",pid:$pid,snapshot:$s,owner:$o}')" ""
    return 0
  fi
  printf 'stopped\n'
  emit_ecs_event info symphony-daemon.status success '{"subcommand":"status","running":false}' ""
  return 1
}

cmd_logs() {
  local follow=1
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --no-follow) follow=0 ;;
      *) printf 'symphony-daemon: unknown logs option: %s\n' "$1" >&2; return 2 ;;
    esac
    shift
  done

  if [[ ! -f $LOG_FILE ]]; then
    emit_ecs_event warn symphony-daemon.logs failure '{"subcommand":"logs"}' "log file missing"
    printf 'symphony-daemon: no log at %s\n' "$LOG_FILE" >&2
    return 1
  fi

  emit_ecs_event info symphony-daemon.logs success \
    "$(jq -nc --argjson follow "$follow" '{subcommand:"logs",follow:($follow==1)}')" ""
  if (( follow )); then
    exec tail -F "$LOG_FILE"
  else
    exec cat "$LOG_FILE"
  fi
}

cmd_restart() {
  cmd_stop || true
  cmd_start "$@"
}

cmd_help() {
  cat <<USAGE
symphony-daemon.sh — manage the Symphony orchestrator BEAM process.

Usage:
  $(basename "$0") start [--foreground]   start the orchestrator (default: backgrounded)
  $(basename "$0") stop                   SIGTERM, wait 10s, SIGKILL if needed
  $(basename "$0") status                 print state + (if up) snapshot summary
  $(basename "$0") logs [--no-follow]     tail -F (or one-shot dump) the log file
  $(basename "$0") restart                stop && start
  $(basename "$0") --help                 this message

Paths:
  log   $LOG_FILE
  pid   $PID_FILE
  state $STATE_LOG
USAGE
}

# ---- dispatch --------------------------------------------------------------
sub=${1:-}
[[ $# -gt 0 ]] && shift
case "$sub" in
  start)   cmd_start "$@" ;;
  stop)    cmd_stop  "$@" ;;
  status)  cmd_status "$@" ;;
  logs)    cmd_logs  "$@" ;;
  restart) cmd_restart "$@" ;;
  --help|-h|help) cmd_help ;;
  "") cmd_help; exit 2 ;;
  *)
    printf 'symphony-daemon: unknown subcommand: %s\n' "$sub" >&2
    cmd_help >&2
    exit 2
    ;;
esac
