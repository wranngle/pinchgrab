#!/usr/bin/env bash
# Symphony agent: invokes Claude Code in non-interactive agentic mode,
# operating on the per-issue workspace cwd, taking the rendered prompt
# from stdin. Exit code propagates to Symphony's worker outcome:
#   0     → :normal exit → tracker.success_state transition (clean ship)
#   non-0 → :abnormal     → :failure retry with exponential backoff
#
# Why claude over the llm.sh fallback chain: only Claude Code's --print
# mode (with --dangerously-skip-permissions) provides the agentic
# tool-use loop (Read/Edit/Write/Bash) needed to actually edit the
# workspace. gemini -p and the bare claude -p stdout-only paths in
# llm.sh produce text, not file changes.
set -uo pipefail

PROMPT=$(cat)

# Soft sanity floor: refuse to run with an empty prompt rather than burn
# tokens on nothing. Symphony's prompt renderer already populates
# {{ issue.* }} so an empty body means template misconfig.
if [ -z "${PROMPT//[[:space:]]/}" ]; then
  echo "[symphony-agent] FATAL: empty prompt on stdin" >&2
  exit 64
fi

# Per-workspace observability stack: when the after_create hook
# provisioned VictoriaLogs/Metrics/Traces + Vector for this workspace,
# `.observability.env` lives next to us with four endpoint URLs.
# Sourcing it exports SYMPHONY_LOGQL_URL/PROMQL_URL/TRACEQL_URL/VECTOR_URL
# into the agent process so the appended system addendum below can
# ground the agent's queries against real, addressable endpoints.
# Absent file = opt-in disabled or up.sh failed; either way, no addendum
# is appended and the default flow is preserved.
if [ -f .observability.env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.observability.env
  set +a
fi

# Headed prefix: tell claude what surface it's on, where artifacts live,
# and that exit-zero must reflect actual work done. The rendered prompt
# from WORKFLOW.md follows.
SYSTEM=$(cat <<'SYSTEM_EOF'
You are an agent dispatched by the Symphony orchestrator. Your cwd is a
per-issue workspace under `.symphony/workspaces/<IDENTIFIER>/`. The repo
root containing the issue tracker (`.symphony/issues/`) and the rest of
the codebase is the parent of `.symphony/`.

Hard rules:
1. Do the work the issue asks for. Edit files where they actually need
   to live in the repo, not under your workspace, unless the issue says
   otherwise. The workspace is your scratch space; the repo is the
   target.
2. Exit zero ONLY when the work is done. If you cannot complete the
   task, finish your last response with `RESULT: failed` so this
   wrapper can exit non-zero — Symphony will retry with backoff.
3. Do not ask the user for input. There is no user. You are running
   non-interactively under an OTP supervisor.
SYSTEM_EOF
)

# Resolve the repo root. Priority order:
#   1. `SYMPHONY_REPO_ROOT` env var — set by the operator or systemd unit;
#      authoritative when present.
#   2. The cwd-is-`.symphony/workspaces/<id>/` convention used by the
#      LocalShell adapter. Walk up three levels (<id> → workspaces →
#      .symphony → repo root); `cd ../../..` lands at the repo root.
#   3. `~/.dotfiles` as the canonical fallback (matches the bootstrap layout).
if [ -n "${SYMPHONY_REPO_ROOT:-}" ]; then
  REPO_ROOT="$SYMPHONY_REPO_ROOT"
else
  REPO_ROOT=$(cd ../../.. 2>/dev/null && pwd 2>/dev/null) || REPO_ROOT=""
  if [ -z "$REPO_ROOT" ] || [ ! -f "$REPO_ROOT/WORKFLOW.md" ]; then
    REPO_ROOT="$HOME/.dotfiles"
  fi
fi

# ---- Provider routing -------------------------------------------------------
# By default this wrapper invokes `claude --print` directly so we get the
# rich stream-json result-event detection added when SYM-007 (token
# accounting) shipped. That path is hardcoded to Anthropic.
#
# Operators can opt into the cross-provider llm.sh fallback chain by
# setting `SYMPHONY_AGENT_PROVIDER=chain` (in WORKFLOW.md hooks, in
# `~/.config/systemd/user/symphony.service.d/override.conf`, or in the
# operator's shell). In chain mode this script exec's `llm.sh --agentic`
# which tries the configured `LLM_CHAIN` (claude → codex → gemini by
# default) with provider-specific agentic flags. Stream-json result
# detection is bypassed in chain mode because non-claude providers emit
# different terminal-event shapes; we trust the llm.sh exit code, which
# already reflects "succeeded once in the chain" semantics.
SYMPHONY_AGENT_PROVIDER=${SYMPHONY_AGENT_PROVIDER:-claude}
if [ "$SYMPHONY_AGENT_PROVIDER" = "chain" ]; then
  LLM_BIN="${REPO_ROOT}/scripts/bin/llm.sh"
  if [ ! -x "$LLM_BIN" ]; then
    echo "[symphony-agent] FATAL: SYMPHONY_AGENT_PROVIDER=chain but llm.sh not found / not executable at ${LLM_BIN}" >&2
    exit 66
  fi
  echo "[symphony-agent] routing through llm.sh --agentic chain (LLM_CHAIN=${LLM_CHAIN:-default}, LLM_SELECTOR=${LLM_SELECTOR:-default})" >&2
  exec /usr/bin/env LLM_TIMEOUT="${LLM_TIMEOUT:-1800}" \
    "$LLM_BIN" --agentic <<<"$PROMPT"
fi

# Label-aware capability injection. The Harness Engineering stack drives
# UI validation through Chrome DevTools; our equivalent is PinchTab,
# fronted by `scripts/bin/symphony-browser.sh`. We only advertise it when
# the issue is actually browser-flavored — gated on `browser` or `ui` in
# the issue's frontmatter labels — to avoid loading every unrelated agent
# turn with noise.
#
# Issue identifier comes from the workspace dirname (set by
# Symphony.LocalShell when it spawned us). The source-of-truth issue
# file lives at `<repo-root>/.symphony/issues/<state>/<IDENTIFIER>.md`.
# We read frontmatter labels with awk (no yq dep) — best-effort; if the
# file isn't found or yaml parses oddly, we silently skip the addition.
ISSUE_ID=$(basename "$(pwd)")
ISSUE_LABELS=""
if [ -n "${REPO_ROOT:-}" ] && [ -n "$ISSUE_ID" ]; then
  for state in todo in_progress 'done' failed; do
    candidate="$REPO_ROOT/.symphony/issues/$state/$ISSUE_ID.md"
    if [ -f "$candidate" ]; then
      # Pull the `labels:` line from the YAML frontmatter (between the
      # first two `---` lines). Handles `[a, b, c]` flow style which is
      # what the existing issues use.
      ISSUE_LABELS=$(awk '
        /^---[[:space:]]*$/ { fm++; next }
        fm == 1 && /^labels:[[:space:]]*\[/ {
          sub(/^labels:[[:space:]]*\[/, "")
          sub(/\][[:space:]]*$/, "")
          print
          exit
        }
      ' "$candidate" 2>/dev/null)
      break
    fi
  done
fi

if printf '%s' "$ISSUE_LABELS" | grep -qiE '(^|[, ])(browser|ui)([, ]|$)'; then
  BROWSER_ADDENDUM=$(cat <<'BROWSER_EOF'

## Browser automation surface

This issue is labeled `browser` or `ui`. A thin browser-action wrapper is
available at `scripts/bin/symphony-browser.sh` (PATH-relative from the
repo root). It fronts PinchTab and emits one JSON object per invocation
on stdout: `{"ok":bool,"cmd":"<sub>","data":...}` or `{"ok":false,
"cmd":"<sub>","error":"..."}`.

Subcommands: `open <url>`, `snapshot`, `click <ref>`, `fill <ref> <text>`,
`screenshot <out>`, `navigate <url>`, `close`.

Use it for before/after evidence (snapshot or screenshot), to drive a UI
flow that validates your work, or to reproduce a reported bug. Example:

    ../../scripts/bin/symphony-browser.sh open https://example.com/login
    ../../scripts/bin/symphony-browser.sh fill e5 "user@example.com"
    ../../scripts/bin/symphony-browser.sh click e7
    ../../scripts/bin/symphony-browser.sh screenshot /tmp/after.png

Refs (e.g. `e5`) come from the snapshot returned by `open`/`snapshot`.
The PinchTab server must already be running; if it isn't, the wrapper
surfaces the underlying error inside the JSON envelope.
BROWSER_EOF
)
  SYSTEM="$SYSTEM$BROWSER_ADDENDUM"
fi

# Observability addendum: only attached when up.sh emitted all four URLs.
# The agent gets concrete endpoints it can curl, not a speculative
# "telemetry might exist" footnote.
if [ -n "${SYMPHONY_LOGQL_URL:-}" ] \
  && [ -n "${SYMPHONY_PROMQL_URL:-}" ] \
  && [ -n "${SYMPHONY_TRACEQL_URL:-}" ] \
  && [ -n "${SYMPHONY_VECTOR_URL:-}" ]; then
  OBS_ADDENDUM=$(cat <<OBS_EOF

## Observability surface (per-workspace)

This workspace has a private telemetry stack provisioned for it. Query
endpoints are addressable on 127.0.0.1 and scoped to this issue only:

- LogQL  (VictoriaLogs):    ${SYMPHONY_LOGQL_URL}
- PromQL (VictoriaMetrics): ${SYMPHONY_PROMQL_URL}
- TraceQL (VictoriaTraces): ${SYMPHONY_TRACEQL_URL}
- Vector ingest (HTTP):     ${SYMPHONY_VECTOR_URL}

Use these URLs with curl/jq when the issue asks about runtime behavior
(e.g. "ensure no span exceeds 2s", "find errors during the last test
run", "verify metrics regressed under load"). The stack is empty until
the application under test emits telemetry to the Vector ingest URL.
OBS_EOF
)
  SYSTEM="$SYSTEM$OBS_ADDENDUM"
fi

emit_failure_marker_if_requested() {
  local response="$1"
  if printf '%s' "$response" | tail -3 | grep -q "^RESULT: failed"; then
    return 1
  fi
  return 0
}

if ! command -v claude >/dev/null 2>&1; then
  echo "[symphony-agent] FATAL: claude CLI not on PATH" >&2
  exit 65
fi

# Why claude's stdout goes to a workspace file, not the BEAM port:
# Controlled experiments isolated a SIGKILL pathology (exit 137 at
# ~30-45s on Bash-tool-heavy agent tasks) to BEAM's `Port.open` pipe
# flow-control under high-volume stream-json output. The same wrapper
# under plain bash outside BEAM completes cleanly. Eliminating systemd
# cgroup limits, OOM, setsid, and claude internals left the residual:
# pipe-write volume from claude → BEAM port. The fix is structural —
# redirect claude's stdout to `<workspace>/claude-stream.log`, leave
# the BEAM port nearly silent, then post-exit read the file to
# extract the terminal `result` event. BEAM only sees the wrapper's
# small heartbeat/summary lines and the eventual exit code.
#
# `--no-session-persistence` + a fresh `--session-id` keeps each
# agent attempt isolated from prior runs.
# `--max-budget-usd` is generous enough for multi-test-file shipments
# but cuts off runaway agentic loops before they exhaust the user's
# Anthropic credit.
# (We deliberately do NOT use `--bare`: the user authenticates via OAuth
# keychain, and `--bare` strips that path — claude would refuse to talk
# to the API. The PENDING_FEATURE UserPromptSubmit hook fires once per
# agent invocation and is harmless inside an orchestrator session.)
SESSION_ID=$(uuidgen 2>/dev/null || printf '%s-%s' "$(date +%s%N)" "$RANDOM")
# claude-stream.log lives in the per-issue workspace (cwd). The
# LocalShell adapter preserves workspaces after success per spec § 9, so
# this artifact is auditable forever alongside `agent-output-<ts>.md`
# and `usage.jsonl`. STREAM_CAPTURE retains the same name for back-
# compatibility with the cleanup trap and post-exit parsing logic.
STREAM_CAPTURE="$(pwd)/claude-stream.log"
# Truncate any leftover from a prior attempt on the same workspace so
# tail/grep/jq below see only this run's output.
: > "$STREAM_CAPTURE" 2>/dev/null || STREAM_CAPTURE=$(mktemp /tmp/symphony-stream.XXXXXX)
# Cleanup trap: workspace-resident file is preserved for audit on
# success/failure, but a /tmp fallback (when the workspace is read-only
# or otherwise unwritable) is cleaned up like the legacy mktemp path.
trap '[ "$STREAM_CAPTURE" = "$(pwd)/claude-stream.log" ] || rm -f "$STREAM_CAPTURE"' EXIT

# Default output format is `json` (single terminal event) rather than
# `stream-json`. Both formats are written to the same file; only the
# parsing branch below differs. Operators who want incremental
# visibility can opt back into stream-json with
# `SYMPHONY_AGENT_OUTPUT_FORMAT=stream-json`.
OUTPUT_FORMAT="${SYMPHONY_AGENT_OUTPUT_FORMAT:-json}"
EXTRA_FLAGS=()
[ "$OUTPUT_FORMAT" = "stream-json" ] && EXTRA_FLAGS=(--verbose)

# Heartbeat on the BEAM port so the orchestrator's port reader sees
# proof-of-life (and a useful breadcrumb in `agent-output-<ts>.md`)
# without claude's full stream-json torrent crossing the pipe.
printf '[symphony-agent] claude session=%s output_format=%s\n' "$SESSION_ID" "$OUTPUT_FORMAT" >&2

# Run claude with stdout AND stderr redirected to the workspace file.
# The BEAM port sees only the small heartbeat above plus the exit
# code. No `tee`, no pipe to BEAM — pipe-buffer flow-control class
# eliminated.
printf '%s' "$PROMPT" | claude \
  --print \
  --no-session-persistence \
  --session-id "$SESSION_ID" \
  --dangerously-skip-permissions \
  --append-system-prompt "$SYSTEM" \
  --max-budget-usd 30 \
  --output-format "$OUTPUT_FORMAT" \
  "${EXTRA_FLAGS[@]}" \
  - >"$STREAM_CAPTURE" 2>&1
CLAUDE_EXIT=$?

# Result-event extraction handles both output formats:
#   * `json`        — single JSON object covering the full session;
#                     extract the same fields directly from the blob.
#   * `stream-json` — newline-delimited events; the terminal one is
#                     `{"type":"result", ...}` and the others are
#                     thread/turn updates we do not need.
if [ "$OUTPUT_FORMAT" = "stream-json" ]; then
  LAST_RESULT=$(grep -E '^\{"type":"result"' "$STREAM_CAPTURE" 2>/dev/null | tail -1)
else
  LAST_RESULT=$(jq -c '.' "$STREAM_CAPTURE" 2>/dev/null | tail -1)
fi
RESULT_SUBTYPE=$(printf '%s' "$LAST_RESULT" | jq -r '.subtype // ""' 2>/dev/null)
RESULT_IS_ERROR=$(printf '%s' "$LAST_RESULT" | jq -r '.is_error // false' 2>/dev/null)

# Spec § 13.5 token + cost accounting. Pull the per-session totals from
# claude's terminal `result` event and surface them two ways:
#   1. an ECS-jsonl line on stderr (rides BEAM's :stderr_to_stdout merge
#      into the agent-output stream so the orchestrator sees it inline)
#   2. an append to `<workspace>/usage.jsonl` so the orchestrator can
#      fold deltas into `state.codex_totals` on worker DOWN, and
#      external scrapers (cost dashboards, etc.) can read it without
#      re-parsing the giant agent-output blob.
# Defaults to 0 when LAST_RESULT is empty (claude SIGKILL'd before
# emitting a terminal event) so usage is always a numeric scalar.
USAGE_INPUT=$(printf '%s' "$LAST_RESULT"   | jq -r '.usage.input_tokens                // 0' 2>/dev/null)
USAGE_OUTPUT=$(printf '%s' "$LAST_RESULT"  | jq -r '.usage.output_tokens               // 0' 2>/dev/null)
USAGE_CACHE_R=$(printf '%s' "$LAST_RESULT" | jq -r '.usage.cache_read_input_tokens     // 0' 2>/dev/null)
USAGE_CACHE_C=$(printf '%s' "$LAST_RESULT" | jq -r '.usage.cache_creation_input_tokens // 0' 2>/dev/null)
COST_USD=$(printf '%s' "$LAST_RESULT"      | jq -r '.total_cost_usd                    // 0' 2>/dev/null)
NUM_TURNS=$(printf '%s' "$LAST_RESULT"     | jq -r '.num_turns                         // 0' 2>/dev/null)
DURATION_MS=$(printf '%s' "$LAST_RESULT"   | jq -r '.duration_ms                       // 0' 2>/dev/null)

# The LocalShell adapter pins cwd to the per-issue workspace dir, which
# is named `<IDENTIFIER>`. Derive the identifier label rather than
# requiring the caller to thread an env var through.
IDENTIFIER_LABEL=$(basename "$(pwd)")

emit_usage_line() {
  local outcome="$1"
  local ts
  ts=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ 2>/dev/null) || ts=""

  local line
  line=$(jq -nc \
    --arg ts "$ts" \
    --arg outcome "$outcome" \
    --arg identifier "$IDENTIFIER_LABEL" \
    --arg subtype "$RESULT_SUBTYPE" \
    --argjson input "${USAGE_INPUT:-0}" \
    --argjson output "${USAGE_OUTPUT:-0}" \
    --argjson cache_r "${USAGE_CACHE_R:-0}" \
    --argjson cache_c "${USAGE_CACHE_C:-0}" \
    --argjson cost "${COST_USD:-0}" \
    --argjson turns "${NUM_TURNS:-0}" \
    --argjson dur "${DURATION_MS:-0}" \
    '{"@timestamp":$ts,"log.level":"info","event.action":"symphony.agent.usage","event.outcome":$outcome,"service.name":"symphony-agent","labels":{"identifier":$identifier,"subtype":$subtype,"input_tokens":$input,"output_tokens":$output,"cache_read_input_tokens":$cache_r,"cache_creation_input_tokens":$cache_c,"cost_usd":$cost,"num_turns":$turns,"duration_ms":$dur}}' \
    2>/dev/null) || line=""

  if [ -n "$line" ]; then
    printf '%s\n' "$line" >&2
    printf '%s\n' "$line" >> usage.jsonl 2>/dev/null || true
  fi
}

# Authoritative outcome: trust the stream's result event over the
# process exit code. The exit code is unreliable on WSL for long-running
# claude --print sessions; the stream's terminal event is not.
if [ "$RESULT_SUBTYPE" = "success" ] && [ "$RESULT_IS_ERROR" != "true" ]; then
  if [ "$CLAUDE_EXIT" -ne 0 ]; then
    echo "[symphony-agent] claude exit=$CLAUDE_EXIT but stream reports success — treating as ok" >&2
  fi
  emit_usage_line "success"
  exit 0
fi

# Stream reported a non-success terminal subtype (error_max_turns,
# error_during_execution, etc.) — propagate as failure.
if [ -n "$RESULT_SUBTYPE" ]; then
  echo "[symphony-agent] stream-json result subtype=$RESULT_SUBTYPE is_error=$RESULT_IS_ERROR" >&2
  emit_usage_line "failure"
  exit 1
fi

# No terminal result event in the stream: claude was killed before it
# could emit one. Fall back to legacy contract.
if ! emit_failure_marker_if_requested "$(tail -c 8192 "$STREAM_CAPTURE")"; then
  echo "[symphony-agent] agent reported RESULT: failed — propagating as 1" >&2
  emit_usage_line "failure"
  exit 1
fi

if [ "$CLAUDE_EXIT" -eq 0 ]; then
  emit_usage_line "success"
  exit 0
fi

echo "[symphony-agent] claude exited $CLAUDE_EXIT, no terminal stream-json result captured — propagating" >&2
emit_usage_line "failure"
exit "$CLAUDE_EXIT"
