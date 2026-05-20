#!/usr/bin/env bash
# symphony-pending-hook.sh — UserPromptSubmit hook that emits one line per
# Symphony orchestrator workflow item that is currently running or scheduled
# for retry. Mirrors the PENDING_AUTH surfacing pattern used by
# .agents/skills/composio-auth/hook-prepend-pending.sh, but the data source
# is the Symphony snapshot endpoint (Symphony.Web.Presenter.state_payload/0)
# instead of a pending-auth state file.
#
# Output format (one line per pending item):
#   PENDING_FEATURE <identifier> -> <status> (attempt <n>, <reason>)
#
# Hard contract: never block, never fail, never write to stderr in the
# happy path. The hook is on the critical path of every prompt, so a
# missing or starting orchestrator (curl error, 503/504, malformed JSON)
# must produce zero stdout and exit 0.
set -uo pipefail
export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$PATH"

readonly SNAPSHOT_URL=${SYMPHONY_SNAPSHOT_URL:-http://127.0.0.1:4044/api/snapshot}

command -v curl >/dev/null 2>&1 || exit 0
command -v jq   >/dev/null 2>&1 || exit 0

# file:// URLs are used by the test harness; curl honors them but ignores
# connect-timeout, so the tight HTTP timeouts only apply to real http(s).
if [[ $SNAPSHOT_URL == file://* ]]; then
  BODY=$(curl -fsS "$SNAPSHOT_URL" 2>/dev/null) || exit 0
else
  BODY=$(curl -fsS \
    --max-time 0.5 \
    --connect-timeout 0.2 \
    "$SNAPSHOT_URL" 2>/dev/null) || exit 0
fi

[[ -n $BODY ]] || exit 0

# jq script: emit one PENDING_FEATURE line per running/retrying entry.
# Running:  attempt = turn_count (defaults to 0), reason = state.
# Retrying: attempt = attempt, reason = error if present else "continuation"
#           (the presenter strips :reason but `error` is null for
#            :continuation retries and a string for :failure retries —
#            see Symphony.Orchestrator.schedule_issue_retry/5).
LINES=$(jq -r '
  def line(status; ident; n; why):
    "PENDING_FEATURE \(ident) -> \(status) (attempt \(n), \(why))";
  ((.running  // []) | map(line("running";
                                (.identifier // .issue_identifier // "?");
                                (.turn_count // 0);
                                (.state // "running"))))
  +
  ((.retrying // []) | map(line("retrying";
                                (.identifier // .issue_identifier // "?");
                                (.attempt // 0);
                                (if (.error // null) == null
                                 then "continuation"
                                 else (.error | tostring) end))))
  | .[]
' <<<"$BODY" 2>/dev/null) || exit 0

[[ -n $LINES ]] || exit 0
printf '%s\n' "$LINES"
