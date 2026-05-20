#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
repo_root=$(cd "$script_dir/../.." && pwd)

port=${EDGE_CDP_PORT:-9222}
profile_directory=${EDGE_CDP_PROFILE_DIRECTORY:-Profile 1}
target_host=${EDGE_CDP_WINDOWS_HOST:-}
runtime_dir=${EDGE_CDP_RUNTIME_DIR:-$HOME/.cache/edge-cdp}
mkdir -p "$runtime_dir"

while (($#)); do
  case "$1" in
    --remote-debugging-port=*) port=${1#*=};;
    --profile-directory=*) profile_directory=${1#*=}; profile_directory=${profile_directory%\"}; profile_directory=${profile_directory#\"};;
    --profile-directory)
      shift
      profile_directory=${1:-$profile_directory}
      ;;
  esac
  shift || true
done

if [[ -z "$target_host" ]]; then
  target_host=$(ip route | awk '/default/ {print $3; exit}')
fi

powershell=/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/powershell.exe
launcher=$repo_root/scripts/bin/edge-cdp-launch.ps1
proxy=$repo_root/scripts/bin/edge-cdp-wsl-proxy.mjs

is_local_cdp_ready() {
  curl -fsS --max-time 1 "http://127.0.0.1:${port}/json/version" >/dev/null 2>&1
}

start_proxy() {
  if is_local_cdp_ready; then
    return 0
  fi
  if ss -ltn "sport = :${port}" | awk 'NR > 1 {found=1} END {exit found ? 0 : 1}'; then
    return 0
  fi
  nohup node "$proxy" \
    --listen-host=127.0.0.1 \
    --listen-port="$port" \
    --target-host="$target_host" \
    --target-port="$port" \
    >"$runtime_dir/proxy-${port}.log" 2>&1 &
  printf '%s\n' "$!" > "$runtime_dir/proxy-${port}.pid"
}

start_proxy

"$powershell" -NoProfile -ExecutionPolicy Bypass -File "$launcher" \
  -Port "$port" \
  -ProfileDirectory "$profile_directory" \
  -RestartIfNeeded \
  -Wait \
  -Status \
  >/dev/null

deadline=$((SECONDS + 35))
until is_local_cdp_ready; do
  if ((SECONDS >= deadline)); then
    printf 'Edge CDP was not reachable through WSL proxy on 127.0.0.1:%s\n' "$port" >&2
    exit 1
  fi
  sleep 0.5
done

trap 'exit 0' INT TERM
while :; do
  sleep 3600 &
  wait $!
done
