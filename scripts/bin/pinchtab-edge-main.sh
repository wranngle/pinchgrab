#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
repo_root=$(cd "$script_dir/../.." && pwd)

pinchtab_version=${PINCHTAB_VERSION:-0.10.0}
server_url=${PINCHTAB_SERVER:-http://127.0.0.1:9867}
bridge_port=${PINCHTAB_EDGE_BRIDGE_PORT:-9879}
edge_port=${EDGE_CDP_PORT:-9222}
profile_directory=${EDGE_CDP_PROFILE_DIRECTORY:-Profile 1}
state_dir=${PINCHTAB_EDGE_STATE_DIR:-$HOME/.cache/pinchtab-edge-main}
config_path=$state_dir/bridge-config.json
bridge_log=$state_dir/bridge.log
bridge_pid=$state_dir/bridge.pid
service_name=pinchtab-edge-main.service
service_dir=${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user
service_file=$service_dir/$service_name
mkdir -p "$state_dir"

linux_path() {
  {
    for dir in "$HOME"/.nvm/versions/node/*/bin "$HOME/.local/bin" /usr/local/bin /usr/bin /bin; do
      [[ -d "$dir" ]] && printf '%s\n' "$dir"
    done
    printf '%s' "$PATH" | tr ':' '\n'
  } | awk '!seen[$0]++ && $0 !~ /^\/mnt\/[c-z]\// { print }' | paste -sd ':' -
}

pinchtab() {
  PATH=$(linux_path) npx -y "pinchtab@${pinchtab_version}" "$@"
}

server_token() {
  jq -r '.server.token // empty' "$HOME/.pinchtab/config.json"
}

write_bridge_config() {
  jq -n \
    --arg binary "$repo_root/scripts/bin/edge-cdp-wrapper.sh" \
    --arg profilesBase "$state_dir/profiles" \
    --argjson edgePort "$edge_port" \
    --arg bridgePort "$bridge_port" \
    '{
      configVersion: "0.10.0",
      server: {
        port: $bridgePort,
        bind: "127.0.0.1",
        token: "",
        stateDir: "",
        engine: "chrome"
      },
      browser: {
        version: "",
        binary: $binary,
        remoteDebuggingPort: $edgePort,
        extraFlags: "",
        extensionPaths: []
      },
      instanceDefaults: {
        mode: "headed",
        noRestore: true,
        timezone: "",
        blockImages: false,
        blockMedia: false,
        blockAds: false,
        maxTabs: null,
        maxParallelTabs: null,
        userAgent: "",
        noAnimations: false,
        stealthLevel: "",
        tabEvictionPolicy: ""
      },
      security: {
        allowEvaluate: true,
        allowMacro: false,
        allowScreencast: false,
        allowDownload: false,
        allowNetworkIntercept: false,
        allowedDomains: ["*"],
        downloadAllowedDomains: [],
        downloadMaxBytes: null,
        allowUpload: false,
        allowClipboard: true,
        allowStateExport: false,
        enableActionGuards: false,
        trustedProxyCIDRs: [],
        trustedResolveCIDRs: [],
        attach: {
          enabled: false,
          allowHosts: [],
          allowSchemes: []
        },
        idpi: {
          enabled: true,
          strictMode: false,
          scanContent: true,
          wrapContent: true,
          customPatterns: [],
          scanTimeoutSec: 2,
          shieldThreshold: 0
        }
      },
      profiles: {
        baseDir: $profilesBase,
        defaultProfile: "edge-main"
      },
      multiInstance: {
        strategy: "",
        allocationPolicy: "",
        instancePortStart: null,
        instancePortEnd: null,
        restart: {
          maxRestarts: null,
          initBackoffSec: null,
          maxBackoffSec: null,
          stableAfterSec: null
        }
      },
      timeouts: {
        actionSec: 30,
        navigateSec: 60,
        shutdownSec: 10,
        waitNavMs: 500
      },
      scheduler: {
        enabled: false,
        strategy: "",
        maxQueueSize: null,
        maxPerAgent: null,
        maxInflight: null,
        maxPerAgentInflight: null,
        resultTTLSec: null,
        workerCount: null
      },
      observability: {
        activity: {
          enabled: true,
          sessionIdleSec: null,
          retentionDays: null,
          stateDir: "",
          events: {}
        }
      },
      sessions: {
        dashboard: {
          persist: true,
          idleTimeoutSec: 604800,
          maxLifetimeSec: 604800,
          elevationWindowSec: 900,
          persistElevationAcrossRestart: false,
          requireElevation: false
        }
      },
      autoSolver: {
        external: {}
      }
    }' > "$config_path"
}

ensure_server_attach_policy() {
  pinchtab config set security.attach.enabled true >/dev/null
  pinchtab config set security.attach.allowHosts "127.0.0.1,localhost,::1" >/dev/null
  pinchtab config set security.attach.allowSchemes "http,https,ws,wss" >/dev/null
  pinchtab config set multiInstance.strategy no-instance >/dev/null
}

server_health() {
  local token
  token=$(server_token)
  curl -fsS --max-time 1 -H "Authorization: Bearer ${token}" "${server_url%/}/health" >/dev/null 2>&1
}

ensure_pinchtab_server() {
  if systemctl --user list-unit-files pinchtab.service >/dev/null 2>&1; then
    systemctl --user restart pinchtab.service
  else
    pinchtab daemon install >/dev/null || true
    pinchtab daemon restart >/dev/null || pinchtab daemon start >/dev/null
  fi

  local deadline=$((SECONDS + 30))
  until server_health; do
    if ((SECONDS >= deadline)); then
      systemctl --user status pinchtab.service --no-pager >&2 || true
      return 1
    fi
    sleep 0.5
  done
}

write_service_file() {
  mkdir -p "$service_dir"
  cat > "$service_file" <<SERVICE
[Unit]
Description=PinchTab bridge for Windows Edge main profile
After=default.target

[Service]
Type=simple
Restart=always
RestartSec=2
Environment="PINCHTAB_EDGE_BRIDGE_PORT=$bridge_port"
Environment="EDGE_CDP_PORT=$edge_port"
Environment="EDGE_CDP_PROFILE_DIRECTORY=$profile_directory"
Environment="PINCHTAB_EDGE_STATE_DIR=$state_dir"
ExecStart=$repo_root/scripts/bin/pinchtab-edge-main.sh bridge-foreground

[Install]
WantedBy=default.target
SERVICE
}

bridge_health() {
  local token
  token=$(server_token)
  curl -fsS --max-time 1 -H "Authorization: Bearer ${token}" "http://127.0.0.1:${bridge_port}/health" >/dev/null 2>&1
}

start_bridge_process() {
  local token
  token=$(server_token)
  write_bridge_config
  exec env \
    EDGE_CDP_PORT="$edge_port" \
    EDGE_CDP_PROFILE_DIRECTORY="$profile_directory" \
    PINCHTAB_CONFIG="$config_path" \
    PINCHTAB_TOKEN="$token" \
    PINCHTAB_PORT="$bridge_port" \
    PATH="$(linux_path)" \
    npx -y "pinchtab@${pinchtab_version}" bridge --engine chrome
}

ensure_bridge() {
  if [[ -s "$bridge_pid" ]] && kill -0 "$(cat "$bridge_pid")" 2>/dev/null; then
    if bridge_health; then
      return 0
    fi
  fi

  if systemctl --user is-system-running >/dev/null 2>&1; then
    write_service_file
    systemctl --user daemon-reload
    systemctl --user enable --now "$service_name" >/dev/null
    systemctl --user restart "$service_name"
  else
    local token
    token=$(server_token)
    write_bridge_config
    EDGE_CDP_PORT="$edge_port" \
    EDGE_CDP_PROFILE_DIRECTORY="$profile_directory" \
    PINCHTAB_CONFIG="$config_path" \
    PINCHTAB_TOKEN="$token" \
    PINCHTAB_PORT="$bridge_port" \
    PATH=$(linux_path) \
      nohup npx -y "pinchtab@${pinchtab_version}" bridge --engine chrome \
      >"$bridge_log" 2>&1 &
    printf '%s\n' "$!" > "$bridge_pid"
  fi

  local deadline=$((SECONDS + 60))
  until bridge_health; do
    if ((SECONDS >= deadline)); then
      tail -80 "$bridge_log" >&2 || true
      systemctl --user status "$service_name" --no-pager >&2 || true
      return 1
    fi
    sleep 0.5
  done
}

attach_bridge() {
  local token body status
  token=$(server_token)
  body=$(jq -nc \
    --arg name edge-main \
    --arg baseUrl "http://127.0.0.1:${bridge_port}" \
    --arg token "$token" \
    '{name:$name, baseUrl:$baseUrl, token:$token}')
  status=$(curl -sS -o "$state_dir/attach-response.json" -w '%{http_code}' \
    -X POST "${server_url%/}/instances/attach-bridge" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    --data "$body")
  if [[ "$status" != 200 && "$status" != 201 ]]; then
    cat "$state_dir/attach-response.json" >&2 || true
    return 1
  fi
  jq -r '.id' "$state_dir/attach-response.json" > "$state_dir/instance-id"
}

install_windows_shortcuts() {
  /mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/powershell.exe \
    -NoProfile \
    -ExecutionPolicy Bypass \
    -File "$repo_root/scripts/bin/edge-cdp-launch.ps1" \
    -Port "$edge_port" \
    -ProfileDirectory "$profile_directory" \
    -InstallShortcuts \
    -InstallStartup
}

case "${1:-start}" in
  bridge-foreground)
    start_bridge_process
    ;;
  install-service)
    write_service_file
    systemctl --user daemon-reload
    systemctl --user enable --now "$service_name"
    ;;
  install-shortcuts)
    install_windows_shortcuts
    ;;
  start)
    ensure_server_attach_policy
    ensure_pinchtab_server
    ensure_bridge
    attach_bridge
    cat "$state_dir/attach-response.json"
    ;;
  status)
    printf 'bridge_port=%s\n' "$bridge_port"
    [[ -s "$bridge_pid" ]] && printf 'bridge_pid=%s\n' "$(cat "$bridge_pid")"
    bridge_health && printf 'bridge_health=ok\n' || printf 'bridge_health=fail\n'
    systemctl --user status "$service_name" --no-pager || true
    ;;
  stop)
    systemctl --user stop "$service_name" 2>/dev/null || true
    [[ -s "$bridge_pid" ]] && kill "$(cat "$bridge_pid")" 2>/dev/null || true
    ;;
  *)
    printf 'usage: %s [start|stop|status|install-shortcuts|install-service|bridge-foreground]\n' "$0" >&2
    exit 2
    ;;
esac
