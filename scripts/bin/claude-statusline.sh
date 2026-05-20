#!/usr/bin/env bash
# Claude Code statusLine. Reads JSON on stdin (model, workspace, cost, etc.)
# and emits a single line: model · cwd · git-branch · dirty-count · cost · token-throughput.
set -uo pipefail

input=$(cat)

# === Pull canonical fields from Claude's JSON payload ===
model=$(jq -r '.model.display_name // .model.id // "claude"' <<<"$input" 2>/dev/null)
cwd=$(jq -r '.workspace.current_dir // .cwd // ""' <<<"$input" 2>/dev/null)
output_style=$(jq -r '.output_style.name // ""' <<<"$input" 2>/dev/null)
cost_usd=$(jq -r '.cost.total_cost_usd // 0' <<<"$input" 2>/dev/null)
duration_ms=$(jq -r '.cost.total_duration_ms // 0' <<<"$input" 2>/dev/null)
lines_added=$(jq -r '.cost.total_lines_added // 0' <<<"$input" 2>/dev/null)
lines_removed=$(jq -r '.cost.total_lines_removed // 0' <<<"$input" 2>/dev/null)

# === cwd display: collapse $HOME → ~ ===
if [[ -n $cwd && $cwd == "$HOME"* ]]; then
  display_cwd="~${cwd#$HOME}"
else
  display_cwd="${cwd:-?}"
fi

# === git: branch + dirty count, only if cwd is a worktree ===
git_segment=""
if [[ -n $cwd && -d "$cwd/.git" ]] || git -C "${cwd:-.}" rev-parse --git-dir >/dev/null 2>&1; then
  branch=$(git -C "$cwd" branch --show-current 2>/dev/null)
  [[ -z $branch ]] && branch=$(git -C "$cwd" rev-parse --short HEAD 2>/dev/null)
  ahead_behind=$(git -C "$cwd" rev-list --left-right --count "HEAD...@{u}" 2>/dev/null)
  if [[ -n $ahead_behind ]]; then
    ahead=${ahead_behind%%	*}
    behind=${ahead_behind##*	}
    ab=""
    [[ $ahead -gt 0 ]] && ab+="↑$ahead"
    [[ $behind -gt 0 ]] && ab+="↓$behind"
  else
    ab=""
  fi
  dirty=$(git -C "$cwd" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  dirty_marker=""
  [[ $dirty -gt 0 ]] && dirty_marker=" *$dirty"
  git_segment=" ⎇ ${branch}${ab}${dirty_marker}"
fi

# === cost: USD with 4 decimals when small, lines-added/removed deltas ===
cost_segment=""
if [[ $(awk -v c="$cost_usd" 'BEGIN{print (c>0)?1:0}') == 1 ]]; then
  cost_fmt=$(awk -v c="$cost_usd" 'BEGIN{printf (c<0.01)?"$%.4f":"$%.3f", c}')
  cost_segment=" ${cost_fmt}"
  if [[ $lines_added -gt 0 || $lines_removed -gt 0 ]]; then
    cost_segment+=" +${lines_added}/-${lines_removed}"
  fi
fi

# === duration: humanize ms → m:s (only if > 1m so it's not noisy) ===
dur_segment=""
if [[ $duration_ms -gt 60000 ]]; then
  dur_segment=$(awk -v ms="$duration_ms" 'BEGIN{m=int(ms/60000); s=int((ms%60000)/1000); printf " %dm%ds", m, s}')
fi

# === output_style appended only when non-default (signals a non-standard run) ===
style_segment=""
[[ -n $output_style && $output_style != "default" && $output_style != "null" ]] && style_segment=" «${output_style}»"

# === assemble: [model] cwd ⎇ branch ↑n↓m *dirty $cost +adds/-dels Mm Ss ===
printf '[%s] %s%s%s%s%s' "$model" "$display_cwd" "$git_segment" "$cost_segment" "$dur_segment" "$style_segment"
