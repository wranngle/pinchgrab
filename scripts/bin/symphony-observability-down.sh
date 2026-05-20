#!/usr/bin/env bash
# symphony-observability-down.sh — tear down the per-workspace observability
# stack provisioned by symphony-observability-up.sh. Invoked from the
# `before_remove` workspace hook so the four containers, the bridge
# network, and the on-disk state directory all release before the
# workspace dir itself is removed by Symphony.
#
# Failure semantics: `before_remove` is a logged-and-ignored hook in the
# WorkspaceManager, so we exit 0 even when individual cleanup steps
# fail — the worst case is a stale container that the operator can prune
# with `docker rm -f`. Hard-failing here would block workspace removal.
set -uo pipefail

# ---- opt-in gate -----------------------------------------------------------
# Symmetric with -up.sh: when the feature is disabled, do nothing and
# exit clean. We still tolerate stragglers from a prior enabled run by
# attempting cleanup based on the env file alone (see below).
if [[ ${SYMPHONY_OBSERVABILITY_ENABLED:-0} != 1 ]]; then
  # Even when disabled now, sweep up an .observability.env from a prior
  # enabled run so the workspace directory does not leave dangling
  # docker artifacts behind after removal.
  if [[ ! -f .observability.env ]]; then
    exit 0
  fi
fi

WORKSPACE_DIR=$(pwd)
WORKSPACE_NAME=$(basename "$WORKSPACE_DIR")
ENV_FILE="$WORKSPACE_DIR/.observability.env"
STATE_DIR="$WORKSPACE_DIR/.observability"
COMPOSE_FILE="$STATE_DIR/docker-compose.yaml"

if [[ ! -f $ENV_FILE ]]; then
  # Nothing to tear down: -up.sh never ran successfully on this
  # workspace, or the env file was already cleaned up. Best-effort sweep
  # by deriving the workspace key the same way -up.sh did, so an
  # interrupted -up.sh that left containers without an env file still
  # gets cleaned.
  WORKSPACE_KEY=$(printf '%s' "$WORKSPACE_NAME" | tr '[:upper:]' '[:lower:]' \
    | tr -c 'a-z0-9_.-' '-' | sed -E 's/^-+|-+$//g')
  PROJECT="symphony-obs-${WORKSPACE_KEY}"
else
  # Load the canonical project name written by -up.sh.
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  PROJECT="${SYMPHONY_OBSERVABILITY_PROJECT:-symphony-obs-${SYMPHONY_OBSERVABILITY_WORKSPACE_KEY:-unknown}}"
  WORKSPACE_KEY="${SYMPHONY_OBSERVABILITY_WORKSPACE_KEY:-}"
fi

LOGS_NAME="symphony-victoria-logs-${WORKSPACE_KEY}"
METRICS_NAME="symphony-victoria-metrics-${WORKSPACE_KEY}"
TRACES_NAME="symphony-victoria-traces-${WORKSPACE_KEY}"
VECTOR_NAME="symphony-vector-${WORKSPACE_KEY}"

if command -v docker >/dev/null 2>&1; then
  # Preferred path: compose down handles services + network in one shot.
  if [[ -f $COMPOSE_FILE ]]; then
    docker compose -p "$PROJECT" -f "$COMPOSE_FILE" down \
      --remove-orphans --volumes >/dev/null 2>&1 || true
  else
    # Compose file missing (state dir wiped by hand). Fall back to
    # name-based teardown so we still release the four containers.
    for name in "$LOGS_NAME" "$METRICS_NAME" "$TRACES_NAME" "$VECTOR_NAME"; do
      [[ -z $name || $name == symphony-*- ]] && continue
      if docker ps -a --format '{{.Names}}' | grep -qx "$name"; then
        docker rm -f "$name" >/dev/null 2>&1 || true
      fi
    done
    # Network may persist when compose metadata is gone.
    if docker network ls --format '{{.Name}}' | grep -qx "${PROJECT}-net"; then
      docker network rm "${PROJECT}-net" >/dev/null 2>&1 || true
    fi
  fi
fi

# Local state cleanup. The workspace dir itself is about to be removed
# by Symphony, but we explicitly drop the bind-mount targets first so
# docker volume drivers do not race with the rmtree.
rm -rf "$STATE_DIR" 2>/dev/null || true
rm -f  "$ENV_FILE"  2>/dev/null || true

echo "[symphony-observability-down] down workspace=${WORKSPACE_NAME} project=${PROJECT}"
exit 0
