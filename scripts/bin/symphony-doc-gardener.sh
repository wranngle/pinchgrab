#!/usr/bin/env bash
# symphony-doc-gardener.sh — recurring "doc-gardening" issue producer.
#
# Drops a single SYM-DG-<UTC-stamp>.md issue file into
# .symphony/issues/todo/ describing a documentation-drift sweep. The
# Symphony orchestrator picks it up on the next poll tick and dispatches
# it to a worker exactly like any other issue; when the worker finishes
# the file moves to done/ (or failed/) under standard rules.
#
# Idempotent: if any SYM-DG-* file already exists in todo/ or
# in_progress/, this script exits 0 without enqueuing a duplicate. That
# means the systemd timer is safe to fire while a previous gardening
# pass is still running — the queue is the source of truth, not a
# separate lock file.
#
# Pure bash, no external deps beyond `date` and `mktemp`. Designed to
# be invoked by:
#   * the systemd-user timer at ~/.config/systemd/user/symphony-doc-gardener.timer
#   * `symphony-orch garden` as a manual one-shot trigger
set -uo pipefail

REPO_ROOT="${SYMPHONY_REPO_ROOT:-$HOME/.dotfiles}"
ISSUES_ROOT="$REPO_ROOT/.symphony/issues"
TODO_DIR="$ISSUES_ROOT/todo"
IN_PROGRESS_DIR="$ISSUES_ROOT/in_progress"

if [[ ! -d $REPO_ROOT ]]; then
  printf 'symphony-doc-gardener: repo root not found: %s\n' "$REPO_ROOT" >&2
  exit 1
fi

mkdir -p "$TODO_DIR" 2>/dev/null || {
  printf 'symphony-doc-gardener: cannot create %s\n' "$TODO_DIR" >&2
  exit 1
}

# Idempotency guard: a single outstanding doc-gardener issue is enough.
# Re-running while one is already queued or running is a no-op so the
# timer can fire defensively without piling up duplicates.
shopt -s nullglob
existing=()
for f in "$TODO_DIR"/SYM-DG-*.md "$IN_PROGRESS_DIR"/SYM-DG-*.md; do
  existing+=("$f")
done
shopt -u nullglob

if (( ${#existing[@]} > 0 )); then
  printf 'symphony-doc-gardener: existing pass already queued/running: %s\n' "${existing[0]}"
  exit 0
fi

stamp=$(date -u +%Y%m%dT%H%M%SZ)
id="SYM-DG-${stamp}"
path="$TODO_DIR/${id}.md"

if [[ -e $path ]]; then
  # Stamp collision (same UTC second). Wait one tick and try again so we
  # never clobber a file the orchestrator may already be scanning.
  sleep 1
  stamp=$(date -u +%Y%m%dT%H%M%SZ)
  id="SYM-DG-${stamp}"
  path="$TODO_DIR/${id}.md"
fi

# Atomic write: build the body in a hidden temp file alongside the
# target so the eventual `mv` is rename(2) on the same filesystem.
tmp=$(mktemp "$TODO_DIR/.${id}.XXXXXX") || {
  printf 'symphony-doc-gardener: mktemp failed in %s\n' "$TODO_DIR" >&2
  exit 1
}

{
  printf -- '---\n'
  printf 'priority: 2\n'
  printf 'labels: [doc-gardener, recurring]\n'
  printf -- '---\n'
  printf '# Doc-gardening sweep (%s)\n\n' "$stamp"
  cat <<'BODY'
Recurring documentation-drift audit. The goal is to keep human-readable
docs aligned with current code behavior; Symphony queued you because no
other doc-gardener pass is in flight.

## Step 1 — Read the documentation surface

Open and fully read every file in this set:

- `~/.dotfiles/README.md`
- `~/.dotfiles/WORKFLOW.md`
- `~/.dotfiles/.agents/AGENTS.md`
- every `*.md` under `~/.dotfiles/docs/`
- every `*.md` referenced by an explicit relative or `~/.dotfiles/...`
  path from `WORKFLOW.md` (resolve those links transitively, one hop is
  enough)

If a referenced file is missing, that itself is drift — record it.

## Step 2 — Cross-reference with real behavior

For each documented claim that is concrete enough to verify (a command
name, a flag, a file path, an env var, a default value, a service unit
name, a script name, an exit code, a JSON field name, a CLI subcommand,
a default port, a defaulted timeout), check it against the actual
implementation in:

- `~/.dotfiles/lib/**` (especially `lib/symphony-elixir/lib/**` and
  `lib/composio-orchestrator/src/**`)
- `~/.dotfiles/scripts/**` (especially `scripts/bin/`)
- `~/.dotfiles/.dotfiles.sh` (the bootstrap)
- the systemd unit files under `~/.config/systemd/user/` that ship
  from this repo's templates

Use Grep/Read to follow the trail. Do NOT trust the docs to be right;
the code is ground truth.

## Step 3 — For each detected drift

Treat any of these as drift:

- documented command/flag/env var that no longer exists
- documented default that disagrees with the implementation
- documented file path that has moved
- documented behavior that the code no longer performs
- code-level surface (new flag, new subcommand, new env var) that is
  conspicuously absent from the docs that are supposed to cover it
- a broken intra-repo link

For each drift item:

1. Write a one-paragraph diagnosis: which doc, which claim, which line
   of code contradicts it, what the doc should say instead.
2. Edit the offending markdown file in place with the smallest change
   that resolves the drift. Preserve surrounding tone and formatting.
3. Do NOT touch code. This pass only edits documentation.

## Step 4 — Result line

End your turn with exactly one of:

- `RESULT: ok no drift` — read everything, found nothing to fix.
- `RESULT: fixed N drift items` — replace `N` with the count and list
  each edited file path on its own line above the RESULT line.

If you exit with `RESULT: ok no drift` Symphony will move this issue
to `done/` automatically. If you make edits, also surface them through
your normal diff/handoff so the operator can review.

## Hard constraints

- No new files. Edit existing markdown only.
- No new dependencies, no new scripts, no new systemd units.
- Do not rewrite docs for style — fix drift, nothing more.
- Do not modify code in `lib/`, `scripts/`, or `.dotfiles.sh`.
- If a doc/code disagreement is genuinely ambiguous (the code could be
  the bug), record it under a `## Ambiguous` section in your final
  summary instead of editing — let the operator adjudicate.
BODY
} > "$tmp" || {
  rm -f "$tmp" 2>/dev/null
  printf 'symphony-doc-gardener: write to temp file failed\n' >&2
  exit 1
}

if ! mv "$tmp" "$path"; then
  rm -f "$tmp" 2>/dev/null
  printf 'symphony-doc-gardener: atomic rename failed\n' >&2
  exit 1
fi

printf '%s\t%s\n' "$id" "$path"
exit 0
