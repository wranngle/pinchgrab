#!/usr/bin/env bash
# Symphony browser wrapper: a thin, JSON-line-stable adapter over PinchTab's
# CLI primitives. Symphony agents (and operators) get a small, predictable
# surface — `open / snapshot / click / fill / screenshot / navigate / close`
# — with one JSON object printed to stdout per invocation. Errors print a
# JSON object too (never bare text) so callers can parse uniformly.
#
# Why a wrapper instead of letting the agent shell out to `pinchtab` directly:
#  - Stable contract: the agent learns five verbs, not the full PinchTab
#    surface, and gets the same JSON shape regardless of underlying CLI
#    flag drift.
#  - Token budget: snapshot output is funneled through `pinchtab snap -i -c`
#    (compact + interactive only), keeping each turn lean.
#  - Cwd-safe: we don't change directory, persist tab state, or pollute
#    env beyond what PinchTab itself does.
#
# This wrapper does NOT start the PinchTab server, manage profiles, or
# attach to Edge — those are operator concerns. If the server isn't up
# we surface PinchTab's own error verbatim inside the JSON envelope.
set -uo pipefail

USAGE='Usage: symphony-browser.sh <subcommand> [args]
  open <url>            navigate (current tab) and return a fresh snapshot
  snapshot              compact + interactive snapshot of the active tab
  click <ref>           click an element by accessibility ref (e.g. e5)
  fill <ref> <text>     fill a form field by ref (JS-event dispatch)
  screenshot <out>      write a screenshot to <out> (extension picks format)
  navigate <url>        navigate without forcing a snapshot in the response
  close                 close the active tab

Each invocation prints exactly one JSON object on stdout:
  {"ok":true,"cmd":"<sub>","data":<payload>}
or
  {"ok":false,"cmd":"<sub>","error":"<reason>"}'

emit_ok()   { jq -nc --arg c "$1" --arg d "$2" '{ok:true,  cmd:$c, data:$d}'; }
emit_okraw(){ jq -nc --arg c "$1" --argjson d "$2" '{ok:true,  cmd:$c, data:$d}'; }
emit_err()  { jq -nc --arg c "$1" --arg e "$2" '{ok:false, cmd:$c, error:$e}'; }

sub=${1:-}
shift || true

# Help / no-arg path runs without dependencies so operators can discover
# the surface even on a host without pinchtab installed yet.
case "$sub" in
  ''|-h|--help|help)
    printf '%s\n' "$USAGE"
    exit 0
    ;;
esac

if ! command -v jq >/dev/null 2>&1; then
  printf '{"ok":false,"cmd":"%s","error":"jq missing"}\n' "$sub"
  exit 65
fi
if ! command -v pinchtab >/dev/null 2>&1; then
  emit_err "$sub" "pinchtab CLI not on PATH; install via the pinchtab skill or operator runbook"
  exit 65
fi

case "$sub" in
  open)
    [ $# -ge 1 ] || { emit_err open "missing <url>"; exit 64; }
    out=$(pinchtab nav "$1" --snap 2>&1) || { emit_err open "$out"; exit 1; }
    emit_ok open "$out"
    ;;
  snapshot)
    out=$(pinchtab snap -i -c 2>&1) || { emit_err snapshot "$out"; exit 1; }
    emit_ok snapshot "$out"
    ;;
  click)
    [ $# -ge 1 ] || { emit_err click "missing <ref>"; exit 64; }
    out=$(pinchtab click "$1" --snap-diff 2>&1) || { emit_err click "$out"; exit 1; }
    emit_ok click "$out"
    ;;
  fill)
    [ $# -ge 2 ] || { emit_err fill "missing <ref> and/or <text>"; exit 64; }
    ref=$1; shift
    text=$*
    out=$(pinchtab fill "$ref" "$text" --snap-diff 2>&1) || { emit_err fill "$out"; exit 1; }
    emit_ok fill "$out"
    ;;
  screenshot)
    [ $# -ge 1 ] || { emit_err screenshot "missing <out> path"; exit 64; }
    out=$(pinchtab screenshot -o "$1" 2>&1) || { emit_err screenshot "$out"; exit 1; }
    emit_okraw screenshot "$(jq -nc --arg p "$1" --arg msg "$out" '{path:$p, message:$msg}')"
    ;;
  navigate)
    [ $# -ge 1 ] || { emit_err navigate "missing <url>"; exit 64; }
    out=$(pinchtab nav "$1" 2>&1) || { emit_err navigate "$out"; exit 1; }
    emit_ok navigate "$out"
    ;;
  close)
    out=$(pinchtab tab close 2>&1) || { emit_err close "$out"; exit 1; }
    emit_ok close "$out"
    ;;
  *)
    emit_err "$sub" "unknown subcommand"
    printf '%s\n' "$USAGE" >&2
    exit 64
    ;;
esac
