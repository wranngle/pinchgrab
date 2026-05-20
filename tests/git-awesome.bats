#!/usr/bin/env bats
# git-awesome.bats -- full behavior + contract suite for scripts/bin/git-awesome.
# Run: bats tests/git-awesome.bats

GA="$BATS_TEST_DIRNAME/../scripts/bin/git-awesome"
SKILL="$BATS_TEST_DIRNAME/../.agents/skills/git-awesome/SKILL.md"
AUTOMERGE="$BATS_TEST_DIRNAME/../.github/workflows/automerge.yml"
DOTFILES_SH="$BATS_TEST_DIRNAME/../.dotfiles.sh"

# Resolves per-repo artifacts dir (mirrors artifact_dir() in the script).
# Each test repo gets its own <repo>/.artifacts/git-awesome/ — runtime state
# is repo-scoped now, not centralized under GIT_AWESOME_STATE_DIR.
ga_artifacts() { printf '%s/.artifacts/git-awesome' "$1"; }

setup() {
  TESTDIR=$(mktemp -d -t ga-XXXXXX)
  # Legacy archival root (only used by the one-shot migrator). Required so
  # tests do not accidentally archive real legacy state from $HOME.
  export GIT_AWESOME_STATE_DIR="$TESTDIR/state"
  export GIT_AWESOME_SESSION="bats-$(date +%s%N)"
  mkdir -p "$TESTDIR/repo"
  cd "$TESTDIR/repo"
  git init -q -b main
  git config user.email "bats@test.local"
  git config user.name  "bats"
  # Mirror real-world bootstrap: `.artifacts/` MUST be gitignored before
  # `git stash push -u` (which calls `git clean -df`) reaches the runtime
  # artifacts directory and wipes the just-written patch parent.
  echo ".artifacts/" > .gitignore
  git add .gitignore
  git commit -qm "ignore artifacts"
  echo "v1" > seed.txt
  git add seed.txt
  git commit -qm "seed"
  REPO_DIR="$PWD"
  ARTIFACTS_DIR="$(ga_artifacts "$REPO_DIR")"
}

teardown() {
  rm -rf "$TESTDIR" 2>/dev/null || true
}

# ── read-only subcommands ─────────────────────────────────────────────

@test "01 observe: emits NDJSON snapshot" {
  run "$GA" observe
  [[ $status -eq 0 ]]
  echo "$output" | jq -e '.slug and .branch and .head and (.dirty|type=="number")' >/dev/null
}

@test "02 status: human-readable summary, exit 0 on clean ledger" {
  run "$GA" status
  [[ $status -eq 0 ]]
  [[ "$output" =~ "git-awesome status" ]]
  [[ "$output" =~ "stashes:" ]]
  [[ "$output" =~ "last event:" ]]
}

@test "03 status: exits 1 when ledger has recent fail events" {
  mkdir -p "$ARTIFACTS_DIR"
  echo '{"@timestamp":"2026-05-13T00:00:00Z","log.level":"error","event.action":"sync.fail","event.outcome":"failure","event.id":"x-1","trace.id":"x","service.name":"git-awesome","labels":{"host":"local","slug":"forced","detail":"forced for test"},"error.message":"forced for test"}' \
    > "$ARTIFACTS_DIR/events.2026-05-13.jsonl"
  run "$GA" status
  [[ $status -eq 1 ]]
  [[ "$output" =~ "recent fails:1" ]]
}

@test "04 history: prints recent events with --limit" {
  echo "drift" >> seed.txt
  "$GA" sync >/dev/null
  run "$GA" history --limit 5
  [[ $status -eq 0 ]]
  [[ "$output" =~ "sync.ok=success" ]]
  # ECS shape: outputs include log.level token (info|warn|error)
  [[ "$output" =~ /info ]]
}

@test "05 history: --event prefix filter works" {
  echo "drift" >> seed.txt
  "$GA" sync >/dev/null
  "$GA" observe >/dev/null
  run "$GA" history --event sync
  [[ $status -eq 0 ]]
  while IFS= read -r line; do
    [[ "$line" =~ sync\. ]]
  done <<< "$output"
}

@test "06 history: --outcome fail filter works (accepts legacy alias)" {
  mkdir -p "$ARTIFACTS_DIR"
  echo '{"@timestamp":"2026-05-13T00:00:00Z","log.level":"error","event.action":"sync.fail","event.outcome":"failure","event.id":"x-1","trace.id":"x","service.name":"git-awesome","labels":{"host":"local","slug":"forced","detail":"forced"},"error.message":"forced"}' \
    > "$ARTIFACTS_DIR/events.2026-05-13.jsonl"
  echo '{"@timestamp":"2026-05-13T00:00:01Z","log.level":"info","event.action":"sync.ok","event.outcome":"success","event.id":"x-2","trace.id":"x","service.name":"git-awesome","labels":{"host":"local","slug":"forced","detail":"ok"}}' \
    >> "$ARTIFACTS_DIR/events.2026-05-13.jsonl"
  run "$GA" history --outcome fail
  [[ $status -eq 0 ]]
  [[ "$output" =~ "sync.fail=failure" ]]
  [[ ! "$output" =~ "sync.ok" ]]
}

# ── contract surface ──────────────────────────────────────────────────

@test "07 subcommands: prints authoritative list" {
  run "$GA" subcommands
  [[ $status -eq 0 ]]
  for cmd in sync unstash guard gc conform triage repair observe status history defaults readme-rewrite subcommands; do
    grep -qx "$cmd" <<< "$output"
  done
}

@test "08 contract: every printed subcommand has a dispatcher case" {
  for cmd in $("$GA" subcommands); do
    grep -qE "^\s+${cmd}\)" "$GA" || { echo "subcommand '$cmd' missing from dispatcher"; return 1; }
  done
}

# ── sync (the core autostash flow) ────────────────────────────────────

@test "09 sync: clean tree skips with sync.skip event" {
  run "$GA" sync
  [[ $status -eq 0 ]]
  grep -q '"event.action":"sync.skip"' "$ARTIFACTS_DIR"/events.*.jsonl
}

@test "10 sync: dirty tree creates exactly one stash + one patch (flat layout)" {
  echo "drift" >> seed.txt
  run "$GA" sync
  [[ $status -eq 0 ]]
  [[ $(git stash list | grep -c "git-awesome/") -eq 1 ]]
  # Patches are flat in <repo>/.artifacts/git-awesome/stash.<uuid>.patch
  [[ $(ls "$ARTIFACTS_DIR"/stash.*.patch | wc -l) -eq 1 ]]
}

@test "11 sync: --dry-run does NOT create a stash" {
  echo "drift" >> seed.txt
  run "$GA" --dry-run sync
  [[ $status -eq 0 ]]
  [[ "$output" =~ "[dry-run] would stash" ]]
  [[ $(git stash list | wc -l) -eq 0 ]]
}

@test "12 sync: de-dup rule — quiet dirty tree does not multiply stashes" {
  echo "drift" >> seed.txt
  "$GA" sync >/dev/null
  git stash apply --quiet
  "$GA" sync >/dev/null
  [[ $(git stash list | grep -c "git-awesome/") -eq 1 ]]
}

@test "13 sync: refuses to stash during merge-in-progress" {
  echo "main-edit" >> seed.txt
  git commit -qam "main"
  git checkout -qb feature
  echo "feat-edit" > seed.txt
  git commit -qam "feat"
  git checkout -q main
  echo "conflict" > seed.txt
  git commit -qam "conflict"
  run git merge feature
  [[ -f .git/MERGE_HEAD ]]
  run "$GA" sync
  [[ $status -eq 0 ]]
  grep -q '"subject":"merge-in-progress"' "$ARTIFACTS_DIR"/events.*.jsonl
}

@test "14 sync: lock-blocked downgrades to sync.skip (no sync.fail)" {
  echo "drift" >> seed.txt
  : > .git/index.lock
  run "$GA" sync
  [[ $status -eq 0 ]]
  grep -q '"event.action":"sync.skip"' "$ARTIFACTS_DIR"/events.*.jsonl
  ! grep -q '"event.action":"sync.fail"' "$ARTIFACTS_DIR"/events.*.jsonl
  rm -f .git/index.lock
}

@test "15 sync: stash slug branch with slashes (release/2.0) produces valid stash" {
  git checkout -qb release/2.0
  echo "edit" >> seed.txt
  run "$GA" sync
  [[ $status -eq 0 ]]
  msg=$(git stash list | head -1)
  [[ "$msg" =~ git-awesome ]]
}

@test "16 sync: stash slug format is git-awesome/<uuid>/<branch>/<ts>" {
  echo "drift" >> seed.txt
  "$GA" sync >/dev/null
  msg=$(git stash list | head -1)
  body=$(echo "$msg" | sed -E 's/^stash@\{[0-9]+\}: On [^:]+: //')
  [[ "$body" =~ ^git-awesome/.+/main/.+ ]]
}

@test "17 concurrent sync: parallel invocations keep ledger valid NDJSON" {
  echo "drift" >> seed.txt
  "$GA" sync &
  pid1=$!
  "$GA" sync &
  pid2=$!
  wait $pid1 || true
  wait $pid2 || true
  for f in "$ARTIFACTS_DIR"/events.*.jsonl; do
    while IFS= read -r line; do
      echo "$line" | jq -e '.' >/dev/null || { echo "non-JSON: $line"; return 1; }
    done < "$f"
  done
}

# ── unstash ────────────────────────────────────────────────────────────

@test "18 unstash: pops the most recent git-awesome stash" {
  echo "drift" >> seed.txt
  "$GA" sync >/dev/null
  run "$GA" unstash
  [[ $status -eq 0 ]]
  [[ $(git stash list | wc -l) -eq 0 ]]
  grep -q "drift" seed.txt
}

@test "19 unstash: fails when no git-awesome stash exists" {
  run "$GA" unstash
  [[ $status -eq 1 ]]
  [[ "$output" =~ "no git-awesome stash" ]]
}

# ── guard baseline + finalize (the finalizer contract) ────────────────

@test "20 guard baseline: writes baseline file (flat layout)" {
  run "$GA" guard baseline
  [[ $status -eq 0 ]]
  # Baselines are flat: <repo>/.artifacts/git-awesome/baseline.<session>.tsv
  [[ -n "$(ls "$ARTIFACTS_DIR"/baseline.*.tsv 2>/dev/null)" ]]
}

@test "21 guard baseline --dry-run does NOT write a baseline file" {
  run "$GA" --dry-run guard baseline
  [[ $status -eq 0 ]]
  [[ "$output" =~ "[dry-run] would write baseline" ]]
  ! ls "$ARTIFACTS_DIR"/baseline.*.tsv >/dev/null 2>&1
}

@test "22 guard finalize: missing baseline exits 2" {
  run "$GA" guard finalize
  [[ $status -eq 2 ]]
}

@test "23 guard baseline + finalize: clean turn exits 0" {
  "$GA" guard baseline >/dev/null
  run "$GA" guard finalize
  [[ $status -eq 0 ]]
}

@test "24 guard finalize: newly dirty paths exit 1" {
  "$GA" guard baseline >/dev/null
  echo "agent-wrote" >> seed.txt
  run "$GA" guard finalize
  [[ $status -eq 1 ]]
  grep -q '"event.action":"dirty.new"' "$ARTIFACTS_DIR"/events.*.jsonl
}

@test "25 guard finalize: pre-existing dirty unchanged is OK" {
  echo "pre-existing" >> seed.txt
  "$GA" guard baseline >/dev/null
  run "$GA" guard finalize
  [[ $status -eq 0 ]]
  grep -q '"event.action":"dirty.unchanged"' "$ARTIFACTS_DIR"/events.*.jsonl
}

@test "26 guard finalize: pre-existing dirty CHANGED exits 1" {
  echo "pre-existing" >> seed.txt
  "$GA" guard baseline >/dev/null
  echo "agent-changed" >> seed.txt
  run "$GA" guard finalize
  [[ $status -eq 1 ]]
  grep -q '"event.action":"dirty.changed"' "$ARTIFACTS_DIR"/events.*.jsonl
}

@test "27 guard finalize: catches mid-turn sync-stashed work (the central promise)" {
  "$GA" guard baseline >/dev/null
  echo "agent-edit-then-sync" >> seed.txt
  "$GA" sync >/dev/null
  run "$GA" guard finalize
  [[ $status -eq 1 ]]
  grep -q '"event.action":"dirty.stashed"' "$ARTIFACTS_DIR"/events.*.jsonl
}

@test "28 e2e agent turn: baseline, mid-turn sync, finalize STILL catches drift" {
  GIT_AWESOME_SESSION=agent-turn-1
  export GIT_AWESOME_SESSION
  "$GA" guard baseline >/dev/null
  echo "agent-output" > new-file.txt
  echo "agent-modification" >> seed.txt
  "$GA" sync >/dev/null
  run "$GA" guard finalize
  [[ $status -eq 1 ]]
  grep -q '"event.action":"dirty.stashed"' "$ARTIFACTS_DIR"/events.*.jsonl
}

# ── gc ────────────────────────────────────────────────────────────────

@test "29 gc: --dry-run reports without dropping" {
  echo "drift" >> seed.txt
  "$GA" sync >/dev/null
  run "$GA" --dry-run gc
  [[ $status -eq 0 ]]
  [[ $(git stash list | wc -l) -eq 1 ]]
}

@test "30 gc: with no old stashes is a noop" {
  run "$GA" gc
  [[ $status -eq 0 ]]
  grep -q '"event.action":"gc.ok"' "$ARTIFACTS_DIR"/events.*.jsonl
}

@test "31 gc --legacy-wip: deletes local refs under refs/wip/*" {
  git update-ref refs/wip/autosync/local/main HEAD
  [[ -n "$(git for-each-ref refs/wip 2>/dev/null)" ]]
  run "$GA" gc --legacy-wip
  [[ $status -eq 0 ]]
  [[ -z "$(git for-each-ref refs/wip 2>/dev/null)" ]]
  grep -q '"event.action":"gc.legacy_wip"' "$ARTIFACTS_DIR"/events.*.jsonl
}

@test "32 gc --legacy-wip --dry-run: prints plan but does not delete" {
  git update-ref refs/wip/autosync/local/main HEAD
  run "$GA" --dry-run gc --legacy-wip
  [[ $status -eq 0 ]]
  [[ "$output" =~ "[dry-run] would delete local ref" ]]
  [[ -n "$(git for-each-ref refs/wip 2>/dev/null)" ]]
}

# ── repair ────────────────────────────────────────────────────────────

@test "33 repair --dry-run respects --dry-run" {
  mkdir -p .github/workflows
  echo "name: legacy" > .github/workflows/ai-review.yml
  run "$GA" --dry-run repair
  [[ $status -eq 0 ]]
  [[ -f .github/workflows/ai-review.yml ]]
  [[ ! -d old/workflows ]]
}

# ── migrator: dangerous code that needs protection ────────────────────

@test "34 migrator: archives legacy state and deletes originals" {
  local legacy_autosync="$HOME/.local/state/git-autosync.jsonl"
  local legacy_guard="$HOME/.local/state/agent-git-guard"
  if [[ -e "$legacy_autosync" || -d "$legacy_guard" ]]; then
    skip "real legacy state on host; refusing to mutate"
  fi
  mkdir -p "$(dirname "$legacy_autosync")"
  echo '{"legacy":"event"}' > "$legacy_autosync"
  mkdir -p "$legacy_guard"
  echo "legacy" > "$legacy_guard/note.txt"
  "$GA" guard baseline >/dev/null
  [[ ! -f "$legacy_autosync" ]]
  [[ ! -d "$legacy_guard" ]]
  # Legacy archival still lands under GIT_AWESOME_STATE_DIR/.legacy-archive
  # (per-tool global archive root, not per-repo); only NEW state is per-repo.
  [[ -d "$GIT_AWESOME_STATE_DIR/.legacy-archive" ]]
}

@test "35 migrator: defers if any *.in-flight baseline exists" {
  local legacy_guard="$HOME/.local/state/agent-git-guard"
  if [[ -e "$legacy_guard" ]]; then
    skip "real legacy state on host; refusing to mutate"
  fi
  mkdir -p "$legacy_guard"
  touch "$legacy_guard/session-x.in-flight"
  "$GA" guard baseline >/dev/null
  [[ -d "$legacy_guard" ]]
  rm -rf "$legacy_guard"
}

# ── discovery cap ─────────────────────────────────────────────────────

@test "36 discovery cap: GIT_AWESOME_MAX_REPOS prevents runaway scan" {
  mkdir -p "$TESTDIR/roots"
  for i in $(seq 1 5); do
    git init -q "$TESTDIR/roots/r$i"
  done
  GIT_AWESOME_ROOTS="$TESTDIR/roots" GIT_AWESOME_MAX_REPOS=3 \
    "$GA" guard baseline --scope roots >/dev/null
  # Each repo gets its own <repo>/.artifacts/git-awesome/baseline.*.tsv
  local count
  count=$(find "$TESTDIR/roots" -path '*/.artifacts/git-awesome/baseline.*.tsv' 2>/dev/null | wc -l)
  [[ "$count" -le 3 ]]
  [[ "$count" -ge 1 ]]
}

# ── slug + session safety ─────────────────────────────────────────────

@test "37 slug: origin URL derives owner_repo slug" {
  git remote add origin https://github.com/wranngle/example.git
  run "$GA" observe
  echo "$output" | jq -e '.slug=="wranngle_example"' >/dev/null
}

@test "38 slug: no origin falls back to directory basename" {
  run "$GA" observe
  echo "$output" | jq -e '.slug=="repo"' >/dev/null
}

@test "39 trace.id never leaks the hostname" {
  "$GA" sync >/dev/null
  for f in "$ARTIFACTS_DIR"/events.*.jsonl; do
    while IFS= read -r line; do
      trc=$(echo "$line" | jq -r '."trace.id"')
      [[ "$trc" != "$(hostname)" ]]
      [[ "$trc" != "$HOSTNAME" ]]
    done < "$f"
  done
}

# ── patch archive integrity ───────────────────────────────────────────

@test "40 patch archive: every sync.ok produces a parseable patch file (flat)" {
  echo "drift" >> seed.txt
  "$GA" sync >/dev/null
  for patch in "$ARTIFACTS_DIR"/stash.*.patch; do
    [[ -f "$patch" ]]
    head -5 "$patch" | grep -qE "^(diff --git|new file mode|index|--- )" || \
      { echo "patch $patch malformed:"; head -5 "$patch"; return 1; }
  done
}

# ── ECS event schema discipline ───────────────────────────────────────

@test "41 ledger: every event uses a known event.action vocabulary" {
  echo "drift" >> seed.txt
  "$GA" sync >/dev/null
  "$GA" guard baseline >/dev/null
  "$GA" guard finalize >/dev/null || true
  local known='^(sync\.(ok|skip|dedup|fail)|unstash\.ok|baseline\.(ok|missing)|finalize\.ok|dirty\.(new|changed|unchanged|stashed)|commits\.(unpushed|behind|upstream_changed)|gc\.(ok|legacy_wip)|conform\.(ok|missing|retired_present)|triage\.(ok|found|skip)|repair\.(retired|noop)|readme\.(ok|fail)|migrate\.(legacy_state|defer)|git\.in_progress|repo)$'
  for f in "$ARTIFACTS_DIR"/events.*.jsonl; do
    while IFS= read -r line; do
      ev=$(echo "$line" | jq -r '."event.action"')
      [[ "$ev" =~ $known ]] || { echo "unknown event.action: $ev"; return 1; }
    done < "$f"
  done
}

@test "42 ECS shape: event.outcome ∈ {success,failure,unknown}; log.level ∈ {info,warn,error}" {
  echo "drift" >> seed.txt
  "$GA" sync >/dev/null
  for f in "$ARTIFACTS_DIR"/events.*.jsonl; do
    while IFS= read -r line; do
      oc=$(echo "$line" | jq -r '."event.outcome"')
      lvl=$(echo "$line" | jq -r '."log.level"')
      [[ "$oc" =~ ^(success|failure|unknown)$ ]] || { echo "bad event.outcome=$oc"; return 1; }
      [[ "$lvl" =~ ^(info|warn|error)$ ]] || { echo "bad log.level=$lvl"; return 1; }
    done < "$f"
  done
}

@test "42b ECS shape: required envelope fields present on every event" {
  echo "drift" >> seed.txt
  "$GA" sync >/dev/null
  for f in "$ARTIFACTS_DIR"/events.*.jsonl; do
    while IFS= read -r line; do
      echo "$line" | jq -e '
        ."@timestamp" and ."log.level" and ."event.action" and ."event.outcome"
        and ."event.id" and ."trace.id" and ."service.name"=="git-awesome"
        and .labels.host=="local" and (.labels.slug|type=="string")
      ' >/dev/null || { echo "missing required ECS field on: $line"; return 1; }
    done < "$f"
  done
}

# ── doctrine ↔ implementation drift ───────────────────────────────────

@test "43 doctrine drift: SKILL TTL matches binary constant" {
  grep -q "stash TTL" "$SKILL"
  grep -q "30 days" "$SKILL"
  grep -q 'G_STASH_TTL_DAYS=\${GIT_AWESOME_STASH_TTL_DAYS:-30}' "$GA"
}

@test "44 doctrine drift: SKILL skip-branches matches binary" {
  grep -q '`wip/\*\*`, `scratch/\*\*`, `dependabot/\*\*`' "$SKILL"
  grep -q 'G_SKIP_BRANCHES_GLOB=("wip/\*\*" "scratch/\*\*" "dependabot/\*\*")' "$GA"
}

@test "45 doctrine drift: required-checks aligned across SKILL, automerge.yml, binary" {
  grep -q '`shell-lint yaml-lint test gitleaks actionlint zizmor workflow-lint`' "$SKILL"
  grep -q '"shell-lint,yaml-lint,test,gitleaks,actionlint,zizmor,workflow-lint"' "$AUTOMERGE"
  grep -q 'G_REQUIRED_CHECKS=(shell-lint yaml-lint test gitleaks actionlint zizmor workflow-lint)' "$GA"
}

@test "46 doctrine drift: SKILL --legacy-wip flag is implemented in binary" {
  grep -q -- "--legacy-wip" "$SKILL"
  grep -q -- "--legacy-wip" "$GA"
}

# ── bootstrap-side guarantees ─────────────────────────────────────────

@test "47 bootstrap: tests are wired to CI" {
  grep -q "bats tests/" "$DOTFILES_SH"
}

@test "48 bootstrap: AGENTS.md marker collision guard exists" {
  grep -q "marker collision" "$DOTFILES_SH"
  grep -q 'startCount > 1 || endCount > 1' "$DOTFILES_SH"
}
