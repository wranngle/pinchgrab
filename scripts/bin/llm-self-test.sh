#!/usr/bin/env bash
# llm-self-test.sh — side-by-side compatibility check for llm.sh.
# Runs llm.sh against each provider with a trivial prompt; asserts exit 0 +
# non-empty stdout. Skips providers whose CLI is not on PATH.
#
# Exit:
#   0  every available provider passed (skipped providers don't fail)
#   1  at least one available provider failed
#
# Env:
#   LLM_SELF_TEST_TIMEOUT  per-provider timeout seconds (default 60)
#   LLM_SELF_TEST_PROMPT   prompt sent to each provider (default: "reply with the single word: pong")
set -uo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
LLM_SH="$SCRIPT_DIR/llm.sh"
[[ -x $LLM_SH ]] || { echo "[self-test] FATAL: llm.sh not executable at $LLM_SH" >&2; exit 2; }

PROMPT=${LLM_SELF_TEST_PROMPT:-"reply with the single word: pong"}
PER_PROVIDER_TIMEOUT=${LLM_SELF_TEST_TIMEOUT:-60}

# Single-entry chains so each invocation tests exactly one provider — no
# fallthrough hiding a real failure behind a different provider's success.
declare -a CASES=(
  "gemini|gemini:gemini-2.5-flash|gemini"
  "claude|claude:haiku|claude"
  "codex|codex:o3-mini|npx"
)

failures=0
skipped=0
passed=0

for case_spec in "${CASES[@]}"; do
  IFS='|' read -r label chain require_bin <<<"$case_spec"
  if ! command -v "$require_bin" >/dev/null 2>&1; then
    printf '[self-test] SKIP %-7s (%s not on PATH)\n' "$label" "$require_bin"
    skipped=$((skipped+1))
    continue
  fi

  output_file=$(mktemp)
  stderr_file=$(mktemp)
  start=$(date +%s)
  LLM_CHAIN="$chain" LLM_TIMEOUT="$PER_PROVIDER_TIMEOUT" \
    "$LLM_SH" "$PROMPT" >"$output_file" 2>"$stderr_file"
  exit_code=$?
  elapsed=$(( $(date +%s) - start ))

  bytes=$(wc -c <"$output_file" | tr -d ' ')
  if [[ $exit_code -eq 0 && $bytes -gt 0 ]]; then
    printf '[self-test] PASS %-7s exit=0 bytes=%s elapsed=%ss\n' "$label" "$bytes" "$elapsed"
    passed=$((passed+1))
  else
    printf '[self-test] FAIL %-7s exit=%s bytes=%s elapsed=%ss\n' "$label" "$exit_code" "$bytes" "$elapsed"
    printf '[self-test]   stderr tail: '
    tail -c 400 "$stderr_file" | tr '\n' ' '
    printf '\n'
    failures=$((failures+1))
  fi
  rm -f "$output_file" "$stderr_file"
done

printf '[self-test] summary: passed=%s failed=%s skipped=%s\n' "$passed" "$failures" "$skipped"
[[ $failures -eq 0 ]] || exit 1
exit 0
