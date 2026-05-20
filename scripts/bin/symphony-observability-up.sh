#!/usr/bin/env bash
# symphony-observability-up.sh — provision a per-workspace observability stack
# (Vector → VictoriaLogs / VictoriaMetrics / VictoriaTraces) so the agent
# dispatched into `.symphony/workspaces/<IDENTIFIER>/` has live LogQL,
# PromQL, and TraceQL endpoints to query.
#
# Why per-workspace: each Symphony issue runs in an isolated cwd. A shared
# stack would conflate signals across concurrent agents. Ephemeral ports
# + workspace-scoped container names give every issue its own private
# telemetry surface that lifecycles with the workspace.
#
# Why bash + docker only: matches the rest of scripts/bin (no new runtime,
# no npm). docker compose handles dependency ordering and network
# lifecycle for free.
#
# Why opt-in: launching four containers per workspace is a real resource
# cost. The hook returns immediately when SYMPHONY_OBSERVABILITY_ENABLED
# is unset, preserving the default Symphony flow for users who do not
# need telemetry on every issue.
#
# Contract:
#   * Run from inside a workspace dir (cwd === workspace path) — that is
#     how the WorkspaceManager hook invokes us.
#   * On success, exit 0 AND write `.observability.env` next to the
#     prompt with four `SYMPHONY_*_URL=…` lines.
#   * On failure (port exhaustion, docker daemon down, health-check
#     timeout), exit 0 anyway when SYMPHONY_OBSERVABILITY_ENABLED!=1
#     — opt-in absence must never break workspace creation.
#   * Idempotent: `docker compose up -d` brings already-running services
#     to the desired state; running it again is a no-op aside from
#     refreshing `.observability.env` URLs.
set -uo pipefail

# ---- opt-in gate -----------------------------------------------------------
# The hook is wired unconditionally in WORKFLOW.md, but every invocation
# is a no-op unless the operator explicitly opts in. This keeps existing
# Symphony flows untouched for users who do not want a four-container
# stack spun up per issue.
if [[ ${SYMPHONY_OBSERVABILITY_ENABLED:-0} != 1 ]]; then
  exit 0
fi

WORKSPACE_DIR=$(pwd)
WORKSPACE_NAME=$(basename "$WORKSPACE_DIR")

# Derive a docker-safe container/network suffix from the workspace name.
# Container names accept [a-zA-Z0-9_.-]; lowercase + collapse anything
# else to '-' to stay portable across platforms.
WORKSPACE_KEY=$(printf '%s' "$WORKSPACE_NAME" | tr '[:upper:]' '[:lower:]' \
  | tr -c 'a-z0-9_.-' '-' | sed -E 's/^-+|-+$//g')
if [[ -z $WORKSPACE_KEY ]]; then
  echo "[symphony-observability-up] FATAL: empty workspace key" >&2
  exit 1
fi

PROJECT="symphony-obs-${WORKSPACE_KEY}"
LOGS_NAME="symphony-victoria-logs-${WORKSPACE_KEY}"
METRICS_NAME="symphony-victoria-metrics-${WORKSPACE_KEY}"
TRACES_NAME="symphony-victoria-traces-${WORKSPACE_KEY}"
VECTOR_NAME="symphony-vector-${WORKSPACE_KEY}"

STATE_DIR="$WORKSPACE_DIR/.observability"
ENV_FILE="$WORKSPACE_DIR/.observability.env"
COMPOSE_FILE="$STATE_DIR/docker-compose.yaml"
VECTOR_CONFIG="$STATE_DIR/vector.yaml"

mkdir -p "$STATE_DIR"

# ---- preflight -------------------------------------------------------------
if ! command -v docker >/dev/null 2>&1; then
  echo "[symphony-observability-up] FATAL: docker not on PATH" >&2
  exit 1
fi
if ! docker compose version >/dev/null 2>&1; then
  echo "[symphony-observability-up] FATAL: docker compose plugin missing" >&2
  exit 1
fi
if ! docker info >/dev/null 2>&1; then
  echo "[symphony-observability-up] FATAL: docker daemon unreachable" >&2
  exit 1
fi

# ---- ephemeral port picker -------------------------------------------------
# Open an ephemeral TCP socket via bash, capture the kernel-assigned port,
# close it. Race vs. another process binding the same port is acceptable —
# docker will surface the conflict on `up` and the operator can re-run.
# We avoid `nc -l` because BSD/GNU netcat divergence makes the syntax
# non-portable across distros.
pick_ephemeral_port() {
  python3 - <<'PY' 2>/dev/null
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(("127.0.0.1", 0))
print(s.getsockname()[1])
s.close()
PY
}

# Fallback when python3 is absent: parse /proc/net/tcp for a free port in
# the ephemeral range. Kernel guarantees the range is reserved for
# transient binds, so collisions with services are unlikely.
pick_ephemeral_port_fallback() {
  local port attempts=0
  while (( attempts < 50 )); do
    port=$(( (RANDOM % 16384) + 49152 ))
    if ! ss -tan 2>/dev/null | awk '{print $4}' | grep -qE ":${port}$"; then
      printf '%d' "$port"
      return 0
    fi
    attempts=$((attempts + 1))
  done
  return 1
}

pick_port() {
  local p
  p=$(pick_ephemeral_port)
  if [[ -z $p ]]; then
    p=$(pick_ephemeral_port_fallback) || return 1
  fi
  printf '%s' "$p"
}

LOGS_PORT=$(pick_port)
METRICS_PORT=$(pick_port)
TRACES_PORT=$(pick_port)
VECTOR_PORT=$(pick_port)

if [[ -z $LOGS_PORT || -z $METRICS_PORT || -z $TRACES_PORT || -z $VECTOR_PORT ]]; then
  echo "[symphony-observability-up] FATAL: could not pick four ephemeral ports" >&2
  exit 1
fi

# ---- vector config ---------------------------------------------------------
# Single HTTP source ingests JSON events; three sinks fan out to the
# Victoria backends over their native ingest protocols:
#   * VictoriaLogs:    /insert/jsonline (Elasticsearch-style line ingest)
#   * VictoriaMetrics: /api/v1/import/prometheus (Prometheus exposition)
#   * VictoriaTraces:  /opentelemetry/v1/traces (OTLP HTTP)
# Service hostnames are the docker-compose service names so DNS works
# inside the stack network without extra configuration.
cat > "$VECTOR_CONFIG" <<VECTOR_EOF
data_dir: /var/lib/vector

# Vector GraphQL/REST API + /health endpoint live on api.address.
# Exposed on the in-container 8686 port (compose binds to an ephemeral
# host port). Liveness probed via the documented /health route instead
# of POSTing fake telemetry. The data ingestion source binds to 8081
# in-container, also exposed; probed indirectly via the Victoria sinks.
api:
  enabled: true
  address: 0.0.0.0:8686

sources:
  agent_http:
    type: http_server
    address: 0.0.0.0:8081
    decoding:
      codec: json
  vector_internal:
    type: internal_metrics

sinks:
  to_victoria_logs:
    type: http
    inputs: [agent_http]
    uri: http://victoria-logs:9428/insert/jsonline
    encoding:
      codec: json
    framing:
      method: newline_delimited
    healthcheck:
      enabled: false

  to_victoria_metrics:
    type: prometheus_remote_write
    inputs: [vector_internal]
    endpoint: http://victoria-metrics:8428/api/v1/write
    healthcheck:
      enabled: false

  to_victoria_traces:
    type: http
    inputs: [agent_http]
    uri: http://victoria-traces:10428/opentelemetry/v1/traces
    encoding:
      codec: json
    healthcheck:
      enabled: false
VECTOR_EOF

# ---- docker-compose --------------------------------------------------------
# All four services bind to 127.0.0.1 only — no external exposure. Each
# Victoria image pins to a recent, well-known tag; Vector uses the
# upstream debian image because the alpine variant lacks
# prometheus_remote_write in some 0.x builds.
cat > "$COMPOSE_FILE" <<COMPOSE_EOF
name: ${PROJECT}

networks:
  obs:
    name: ${PROJECT}-net

services:
  victoria-logs:
    image: docker.io/victoriametrics/victoria-logs:v1.50.0
    container_name: ${LOGS_NAME}
    restart: unless-stopped
    networks: [obs]
    ports:
      - "127.0.0.1:${LOGS_PORT}:9428"
    command:
      - "--storageDataPath=/vlogs"
      - "--httpListenAddr=:9428"
    volumes:
      - ${STATE_DIR}/vlogs:/vlogs

  victoria-metrics:
    image: docker.io/victoriametrics/victoria-metrics:v1.142.0
    container_name: ${METRICS_NAME}
    restart: unless-stopped
    networks: [obs]
    ports:
      - "127.0.0.1:${METRICS_PORT}:8428"
    command:
      - "--storageDataPath=/vmdata"
      - "--httpListenAddr=:8428"
    volumes:
      - ${STATE_DIR}/vmdata:/vmdata

  victoria-traces:
    image: docker.io/victoriametrics/victoria-traces:v0.8.2
    container_name: ${TRACES_NAME}
    restart: unless-stopped
    networks: [obs]
    ports:
      - "127.0.0.1:${TRACES_PORT}:10428"
    command:
      - "--storageDataPath=/vtraces"
      - "--httpListenAddr=:10428"
    volumes:
      - ${STATE_DIR}/vtraces:/vtraces

  vector:
    image: docker.io/timberio/vector:0.55.0-debian
    container_name: ${VECTOR_NAME}
    restart: unless-stopped
    networks: [obs]
    depends_on: [victoria-logs, victoria-metrics, victoria-traces]
    ports:
      - "127.0.0.1:${VECTOR_PORT}:8686"
    volumes:
      - ${VECTOR_CONFIG}:/etc/vector/vector.yaml:ro
      - ${STATE_DIR}/vector-data:/var/lib/vector
    command: ["--config", "/etc/vector/vector.yaml"]
COMPOSE_EOF

# ---- teardown of stale containers -----------------------------------------
# A prior run on the same workspace key may have left containers behind
# (operator killed the daemon, system reboot, etc.). Compose down is
# idempotent and removes orphaned services from earlier compose files
# under the same project name.
docker compose -p "$PROJECT" -f "$COMPOSE_FILE" down --remove-orphans \
  >/dev/null 2>&1 || true

# Belt-and-suspenders: explicit container removal in case names collided
# with a non-compose deployment from an older script revision.
for name in "$LOGS_NAME" "$METRICS_NAME" "$TRACES_NAME" "$VECTOR_NAME"; do
  if docker ps -a --format '{{.Names}}' | grep -qx "$name"; then
    docker rm -f "$name" >/dev/null 2>&1 || true
  fi
done

# ---- launch ----------------------------------------------------------------
if ! docker compose -p "$PROJECT" -f "$COMPOSE_FILE" up -d >/dev/null 2>&1; then
  echo "[symphony-observability-up] FATAL: docker compose up failed" >&2
  docker compose -p "$PROJECT" -f "$COMPOSE_FILE" logs --tail=50 >&2 || true
  exit 1
fi

# ---- health check ----------------------------------------------------------
# Each service answers HTTP 2xx/3xx on `/` once it is ready to accept
# queries. We poll up to 60 seconds total (3s × 20 attempts × 4 services
# is the worst case, but every service is checked in the inner loop in
# parallel order so the wall-clock floor is ~60s for cold-pull boots).
wait_endpoint() {
  local label=$1 url=$2 attempts=0
  while (( attempts < 30 )); do
    if curl -fsS -o /dev/null -m 2 "$url" 2>/dev/null; then
      return 0
    fi
    # VictoriaLogs/Metrics/Traces and Vector all return 200 or 404 on /
    # depending on version — accept any response with HTTP <500 as proof
    # the listener is alive.
    local code
    code=$(curl -s -o /dev/null -w '%{http_code}' -m 2 "$url" 2>/dev/null)
    if [[ -n $code && $code != 000 && $code -lt 500 ]]; then
      return 0
    fi
    sleep 2
    attempts=$((attempts + 1))
  done
  echo "[symphony-observability-up] FATAL: $label health check timed out at $url" >&2
  return 1
}

LOGS_URL="http://127.0.0.1:${LOGS_PORT}"
METRICS_URL="http://127.0.0.1:${METRICS_PORT}"
TRACES_URL="http://127.0.0.1:${TRACES_PORT}"
VECTOR_URL="http://127.0.0.1:${VECTOR_PORT}"

if ! wait_endpoint victoria-logs    "$LOGS_URL/";    then exit 1; fi
if ! wait_endpoint victoria-metrics "$METRICS_URL/"; then exit 1; fi
if ! wait_endpoint victoria-traces  "$TRACES_URL/";  then exit 1; fi
# Vector's API root returns 404; the documented liveness path is `/health`
# (per https://vector.dev/docs/reference/api/). Probe that explicitly so a
# fresh stack is reported healthy as soon as the API server is up.
if ! wait_endpoint vector           "$VECTOR_URL/health";  then exit 1; fi

# ---- emit env file ---------------------------------------------------------
# symphony-agent.sh sources this file when present and forwards the four
# vars into Claude's environment so the rendered prompt can reference
# real, queryable URLs.
cat > "$ENV_FILE" <<ENV_EOF
# Generated by symphony-observability-up.sh. Do not edit by hand;
# regenerated on every after_create hook fire.
SYMPHONY_LOGQL_URL=${LOGS_URL}
SYMPHONY_PROMQL_URL=${METRICS_URL}
SYMPHONY_TRACEQL_URL=${TRACES_URL}
SYMPHONY_VECTOR_URL=${VECTOR_URL}
SYMPHONY_OBSERVABILITY_PROJECT=${PROJECT}
SYMPHONY_OBSERVABILITY_WORKSPACE_KEY=${WORKSPACE_KEY}
ENV_EOF

echo "[symphony-observability-up] up workspace=${WORKSPACE_NAME} logs=${LOGS_PORT} metrics=${METRICS_PORT} traces=${TRACES_PORT} vector=${VECTOR_PORT}"
exit 0
