#!/usr/bin/env bash
# .dotfiles.sh — repo bootstrap. p1 scaffold/state/log/llm.sh; p2 assess+ctx.
# Run from repo root. Idempotent. Resumable. ECS JSON logs to stderr.
# Usage: .dotfiles.sh [audit|plan|apply] [--profile client|external|repo-default|wranngle-house] [--advisory|--managed] [--github-hydrate]
# Env: DOTFILES_FORCE=1 DOTFILES_FAIL_FAST=1 DOTFILES_LOG_FILE=path
#      DOTFILES_SECURITY_ONLY=1 DOTFILES_SKIP_LLM=1 DOTFILES_SKIP_GH_HYDRATE=1 DOTFILES_SKIP_HOST_PACKAGES=1
set -euo pipefail;shopt -s inherit_errexit nullglob
          export PUPPETEER_SKIP_DOWNLOAD=true
          export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

readonly DOTFILES_BOOTSTRAP_VERSION=0.6.1 DOTFILES_SERVICE_NAME=dotfiles-bootstrap
readonly REPO_ROOT=${REPO_ROOT:-$PWD}
# Canonical runtime layout: <repo>/.artifacts/<system>/<key>.<ext>
# (flat, one-deep, keyed; ECS-shaped JSONL for event streams; single-doc JSON for snapshots).
# Mirrors composio-orchestrator/src/artifactPaths.ts. Legacy XDG state root
# is preserved for a one-shot migration of pre-`.artifacts/`-era files.
readonly STATE_DIRECTORY=$REPO_ROOT/.artifacts/dotfiles-bootstrap
readonly LEGACY_XDG_STATE_DIR=${XDG_STATE_HOME:-${HOME:-/tmp}/.local/state}/dotfiles-bootstrap
# shellcheck disable=SC2155
readonly REPO_KEY=$(printf %s "$REPO_ROOT"|sha256sum|cut -c1-16)
DOTFILES_INVOKED_COMMAND=${DOTFILES_COMMAND:-${1:-apply}}
readonly TASK_STATE_FILE=$STATE_DIRECTORY/tasks.jsonl
readonly ASSESSMENT_FILE=$STATE_DIRECTORY/assessment.json
# shellcheck disable=SC2034  # FAIL_FAST reserved for pass 3 LLM task retry loop
readonly LOG_FILE=${DOTFILES_LOG_FILE:-$(case "$DOTFILES_INVOKED_COMMAND" in audit|plan) printf '%s/events.%s.%s.jsonl' "$STATE_DIRECTORY" "$DOTFILES_INVOKED_COMMAND" "$(date -u +%Y-%m-%d)";; *) printf '%s/events.%s.jsonl' "$STATE_DIRECTORY" "$(date -u +%Y-%m-%d)";; esac)} FAIL_FAST=${DOTFILES_FAIL_FAST:-0} FORCE=${DOTFILES_FORCE:-0}
# shellcheck disable=SC2155
DOTFILES_BOOTSTRAP_RUN_ID=${DOTFILES_BOOTSTRAP_RUN_ID:-$(uuidgen 2>/dev/null||printf '%s-%s' "$(date +%s%N)" "$RANDOM")}
export DOTFILES_BOOTSTRAP_RUN_ID  # propagate to llm.sh and hero.sh children
DOTFILES_EVENT_SEQUENCE_COUNTER=0
DOTFILES_RUN_SUCCESS_TASKS=()
DOTFILES_RUN_FAILED_TASKS=()
DOTFILES_RUN_SKIPPED_TASKS=()
DOTFILES_RUN_DELETED_TASKS=()

# ── ECS logging ────────────────────────────────────────────────────────
emitEcsLogEvent(){ local logLevel=$1 eventAction=$2 eventOutcome=$3 taskLabel=${4:-} eventDurationNs=${5:-0} providerLabel=${6:-} modelLabel=${7:-} errorMessage=${8:-} timestampUtc eventUniqueId logDirectory
  DOTFILES_EVENT_SEQUENCE_COUNTER=$((DOTFILES_EVENT_SEQUENCE_COUNTER+1))
  timestampUtc=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)
  eventUniqueId="${DOTFILES_BOOTSTRAP_RUN_ID}-${DOTFILES_EVENT_SEQUENCE_COUNTER}"
  local jsonPayload;jsonPayload=$(jq -nc --arg ts "$timestampUtc" --arg lvl "$logLevel" --arg act "$eventAction" --arg out "$eventOutcome" --arg svc "$DOTFILES_SERVICE_NAME" --arg task "$taskLabel" --arg prov "$providerLabel" --arg mdl "$modelLabel" --arg err "$errorMessage" --arg trace "$DOTFILES_BOOTSTRAP_RUN_ID" --arg eid "$eventUniqueId" --argjson dur "$eventDurationNs" '{"@timestamp":$ts,"log.level":$lvl,"event.action":$act,"event.outcome":$out,"event.duration":$dur,"event.id":$eid,"trace.id":$trace,"service.name":$svc,"labels":{"task":$task,"provider":$prov,"model":$mdl}}+(if $err=="" then {} else {"error.message":$err} end)')
  printf '%s\n' "$jsonPayload" >&2
  if [[ -n $LOG_FILE ]];then
    logDirectory=$(dirname "$LOG_FILE")
    mkdir -p "$logDirectory" 2>/dev/null||true
    printf '%s\n' "$jsonPayload" >> "$LOG_FILE" 2>/dev/null||:
  fi;}

failFatallyAndExit(){ emitEcsLogEvent error fatal failure "${1:-?}" 0 '' '' "${2:-fatal}";exit 1;}

mkdir -p "$STATE_DIRECTORY" 2>/dev/null||failFatallyAndExit boot "cannot create STATE_DIRECTORY"
cd "$REPO_ROOT" 2>/dev/null||failFatallyAndExit boot "cannot cd to REPO_ROOT=$REPO_ROOT"

# ── One-shot legacy state migration ────────────────────────────────────
# Pre-`.artifacts/`-era bootstrap state lived at $XDG_STATE_HOME/dotfiles-bootstrap/
# keyed by sha256(REPO_ROOT). Move per-repo state to <repo>/.artifacts/dotfiles-bootstrap/
# on first boot after migration. Idempotent. Legacy archived to <repo>/.artifacts/
# dotfiles-bootstrap/legacy/ for forensic recovery if anything looked wrong.
migrateLegacyXdgStateIfPresent(){ local archiveDir legacyTask legacyAssessment legacyAudit legacyPlan legacyTriage legacyStamp moved=0
  legacyTask=$LEGACY_XDG_STATE_DIR/$REPO_KEY.jsonl
  legacyAssessment=$LEGACY_XDG_STATE_DIR/$REPO_KEY.assessment.json
  legacyAudit=$LEGACY_XDG_STATE_DIR/$REPO_KEY.audit.jsonl
  legacyPlan=$LEGACY_XDG_STATE_DIR/$REPO_KEY.plan.jsonl
  legacyTriage=$LEGACY_XDG_STATE_DIR/triage-project.env
  legacyStamp=$LEGACY_XDG_STATE_DIR/symphony-install.sha256
  [[ -f $legacyTask || -f $legacyAssessment || -f $legacyAudit || -f $legacyPlan || -f $legacyTriage || -f $legacyStamp ]]||return 0
  archiveDir=$STATE_DIRECTORY/legacy
  mkdir -p "$archiveDir" 2>/dev/null||return 0
  [[ -f $legacyTask && ! -f $TASK_STATE_FILE ]]&&{ mv "$legacyTask" "$TASK_STATE_FILE" 2>/dev/null&&moved=1; }
  [[ -f $legacyAssessment && ! -f $ASSESSMENT_FILE ]]&&{ mv "$legacyAssessment" "$ASSESSMENT_FILE" 2>/dev/null&&moved=1; }
  for legacy in "$legacyAudit" "$legacyPlan";do
    [[ -f $legacy ]]||continue
    mv "$legacy" "$archiveDir/" 2>/dev/null&&moved=1
  done
  # Shared (non-repo-keyed) legacy files: triage cache + symphony install stamp.
  # Only move if THIS invocation is on the dotfiles repo itself; otherwise leave
  # them alone for the dotfiles-repo bootstrap to claim.
  if [[ "$REPO_ROOT" == "$HOME/.dotfiles" ]];then
    [[ -f $legacyTriage && ! -f "$STATE_DIRECTORY/triage-project.env" ]]&&{ mv "$legacyTriage" "$STATE_DIRECTORY/triage-project.env" 2>/dev/null&&moved=1; }
    [[ -f $legacyStamp  && ! -f "$STATE_DIRECTORY/symphony-install.sha256" ]]&&{ mv "$legacyStamp"  "$STATE_DIRECTORY/symphony-install.sha256"  2>/dev/null&&moved=1; }
  fi
  ((moved))&&emitEcsLogEvent info state.migrate success xdg-to-artifacts 0 '' '' "moved legacy XDG state into $STATE_DIRECTORY"
}
migrateLegacyXdgStateIfPresent

# ── Resumable state (ECS-shaped JSONL, last-write-wins per task) ───────
# Schema: standard ECS envelope; per-task fields live under labels.{task,status,sha256}.
# event.outcome mirrors labels.status (ok→success, failed→failure) so structured ECS
# consumers see a valid outcome value while idempotency uses the raw status label.
# Compat: reader accepts BOTH the new ECS shape AND legacy `{task,status,sha256,ts}`
# objects so partially-migrated ledgers stay readable until they age out.
readLastTaskStatusFromState(){ [[ -f $TASK_STATE_FILE ]]||{ echo;return;}
  jq -r --arg t "$1" 'select((.labels.task // .task)==$t)|(.labels.status // .status)' "$TASK_STATE_FILE" 2>/dev/null|tail -n1;}
appendTaskStatusRecordToState(){ local taskName=$1 statusValue=$2 sha256Hash=${3:-} timestampUtc ecsOutcome eventUniqueId jsonLine
  timestampUtc=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)
  case "$statusValue" in ok) ecsOutcome=success;; failed) ecsOutcome=failure;; *) ecsOutcome=unknown;; esac
  DOTFILES_EVENT_SEQUENCE_COUNTER=$((DOTFILES_EVENT_SEQUENCE_COUNTER+1))
  eventUniqueId="${DOTFILES_BOOTSTRAP_RUN_ID}-${DOTFILES_EVENT_SEQUENCE_COUNTER}"
  jsonLine=$(jq -nc \
    --arg ts "$timestampUtc" --arg act task.state --arg oc "$ecsOutcome" --arg eid "$eventUniqueId" \
    --arg trc "$DOTFILES_BOOTSTRAP_RUN_ID" --arg svc "$DOTFILES_SERVICE_NAME" \
    --arg task "$taskName" --arg st "$statusValue" --arg sha "$sha256Hash" \
    '{"@timestamp":$ts,"log.level":"info","event.action":$act,"event.outcome":$oc,"event.id":$eid,"trace.id":$trc,"service.name":$svc,labels:{task:$task,status:$st,sha256:$sha}}')
  { printf '%s\n' "$jsonLine" >> "$TASK_STATE_FILE"; } 2>/dev/null||emitEcsLogEvent warn state.write failure "$taskName" 0 '' '' "could not write state";}
shouldExecuteTaskGivenState(){ [[ $FORCE == 1 ]]&&return 0;[[ $(readLastTaskStatusFromState "$1") == ok ]]&&return 1||return 0;}

# ── Generated artifact contract ────────────────────────────────────────
normalizeGeneratedArtifactContent(){ local relativeArtifactPath=$1 contentBody=$2
  case "$relativeArtifactPath" in
    *.png|*.jpg|*.jpeg|*.gif|*.webp|*.ico|*.pdf) printf '%s' "$contentBody";;
    *) printf '%s\n' "$contentBody"|sed 's/[[:space:]]\+$//';;
  esac;}

assertGeneratedArtifactHasNoTrailingWhitespace(){ local artifactPath=$1 output
  output=$(awk '/[[:blank:]]$/ { printf "%s:%d: trailing whitespace\n", FILENAME, FNR; found=1 } END { exit found ? 1 : 0 }' "$artifactPath" 2>/dev/null)||{
    printf '%s\n' "$output" >&2
    return 1
  }
  return 0;}

validateGeneratedArtifactByExtension(){ local artifactPath=$1
  assertGeneratedArtifactHasNoTrailingWhitespace "$artifactPath"||return 1
  case "${1##*.}" in
    sh) bash -n "$artifactPath"||return 1;if command -v shellcheck >/dev/null;then shellcheck -S warning "$artifactPath"||return 1;fi;;
    yml|yaml) if command -v yq >/dev/null;then yq e '.' "$artifactPath" >/dev/null||return 1;else python3 -c 'import yaml,sys;yaml.safe_load(open(sys.argv[1]))' "$artifactPath"||return 1;fi
      if command -v yamllint >/dev/null;then yamllint -d "{extends: default, rules: {line-length: disable, document-start: disable, truthy: {check-keys: false}}}" "$artifactPath"||return 1;fi;;
    json) jq -e . "$artifactPath" >/dev/null;;
    toml) python3 -c 'import sys,tomllib;tomllib.load(open(sys.argv[1],"rb"))' "$artifactPath" 2>/dev/null \
       || python3 -c 'import sys,tomli;tomli.load(open(sys.argv[1],"rb"))' "$artifactPath" 2>/dev/null \
       || return 0;;
    *) return 0;;
  esac;}

# ── File policy resolver ───────────────────────────────────────────────
# always-deterministic : every run, no LLM (deterministic content from herestring)
# create-deterministic : only if absent or stub <256B, no LLM (starter content)
# create-llm           : only if absent or stub <256B, LLM-generated prose
# llm-update           : every run, LLM diffs existing against intent and improves
resolveFilePolicyByPath(){ case "$1" in
  LICENSE|.gitattributes|.gitignore|.yamllint.yml|.github/dependabot.yml|.github/ISSUE_TEMPLATE/config.yml|.github/workflows/ci.yml|.github/workflows/automerge.yml|.github/workflows/security.yml|.github/CODEOWNERS|.editorconfig|CODE_OF_CONDUCT.md|scripts/hero.sh|.agents/AGENTS.md) echo always-deterministic;;
  .agents/DESIGN.md) echo create-deterministic;;
  .github/ISSUE_TEMPLATE/bug_report.yml|.github/ISSUE_TEMPLATE/feature_request.yml|.github/ISSUE_TEMPLATE/research.yml|.github/workflows/issue-triage.yml|.github/workflows/pr-link-check.yml|scripts/bin/git-awesome|.gitleaks.toml|.github/workflows/gitleaks.yml) echo always-deterministic;;
  demo/cassette.tape) echo create-deterministic;;
  SECURITY.md) [[ ${DOTFILES_SECURITY_ONLY:-0} == 1 || ${DOTFILES_SKIP_LLM:-0} == 1 ]]&&echo always-deterministic||echo create-llm;;
  CONTRIBUTING.md) echo create-llm;;
  README.md|.github/PULL_REQUEST_TEMPLATE.md) echo llm-update;;
  *) echo skip;;
esac;}
isFileStubOrAbsent(){ [[ ! -f $1 ]]&&return 0;[[ $(wc -c < "$1") -lt 256 ]]&&return 0;return 1;}

# ── Auth probe (non-halting; sets LLM_PROVIDERS_AVAILABLE_COUNT global) ─
LLM_PROVIDERS_AVAILABLE_COUNT=0
probeAvailableLlmProviders(){ local availableProviders=()
  if [[ ${DOTFILES_SKIP_LLM:-0} == 1 ]];then
    LLM_PROVIDERS_AVAILABLE_COUNT=0
    emitEcsLogEvent info auth.probe success boot 0 '' '' 'DOTFILES_SKIP_LLM=1'
    return 0
  fi
  { [[ -n ${ANTHROPIC_API_KEY:-} ]]||command -v claude >/dev/null;}&&availableProviders+=(claude)
  [[ -n ${GEMINI_API_KEY:-} ]]&&availableProviders+=(gemini)
  LLM_PROVIDERS_AVAILABLE_COUNT=${#availableProviders[@]}
  ((LLM_PROVIDERS_AVAILABLE_COUNT==0))&&{ emitEcsLogEvent warn auth.probe failure boot 0 '' '' 'no providers';cat >&2 <<'AUTH_HINT_EOF'
no LLM providers available. authenticate at least one before LLM passes:
  claude:  claude login   (or export ANTHROPIC_API_KEY=…)
  gemini:  export GEMINI_API_KEY=…
deterministic tasks will still run; create-llm and llm-update tasks will skip.
AUTH_HINT_EOF
  return 1;}
  emitEcsLogEvent info auth.probe success boot 0 '' '' "${availableProviders[*]}";}

# ── llm.sh herestring (single-quoted EOF, inert at parse time) ─────────
read -r -d '' DOTFILES_LLM_SCRIPT_HERESTRING <<'LLMSH_EOF' || true
#!/usr/bin/env bash
# llm.sh — gemini+claude+codex fallback chain with intelligent backoff.
# stdout: model response. stderr: ECS jsonl events.
# Env: LLM_CHAIN, LLM_SYSTEM, LLM_TIMEOUT (default 90), DOTFILES_BOOTSTRAP_RUN_ID
set -uo pipefail
LLMSH_RUN_ID=${DOTFILES_BOOTSTRAP_RUN_ID:-$(uuidgen 2>/dev/null||printf '%s-%s' "$(date +%s%N)" "$RANDOM")}
LLMSH_SERVICE_NAME=llm-fallback-chain
LLMSH_EVENT_SEQUENCE=0
emitEcsEventOnStderr(){ local lvl=$1 act=$2 out=$3 prov=${4:-} mdl=${5:-} err=${6:-} ts json
  LLMSH_EVENT_SEQUENCE=$((LLMSH_EVENT_SEQUENCE+1))
  ts=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)
  json=$(jq -nc --arg ts "$ts" --arg l "$lvl" --arg a "$act" --arg o "$out" --arg svc "$LLMSH_SERVICE_NAME" --arg pv "$prov" --arg m "$mdl" --arg e "$err" --arg trace "$LLMSH_RUN_ID" --arg eid "${LLMSH_RUN_ID}-${LLMSH_EVENT_SEQUENCE}" '{"@timestamp":$ts,"log.level":$l,"event.action":$a,"event.outcome":$o,"event.id":$eid,"trace.id":$trace,"service.name":$svc,"labels":{"provider":$pv,"model":$m}}+(if $e=="" then {} else {"error.message":$e} end)')
  printf '%s\n' "$json" >&2;[[ -n ${DOTFILES_LOG_FILE:-} ]]&&printf '%s\n' "$json" >> "$DOTFILES_LOG_FILE"||:;}
userPrompt="";jsonSchema=""
while [[ $# -gt 0 ]];do case "$1" in
  --schema|--json-schema) jsonSchema="$2";shift 2;;
  *) [[ -z $userPrompt ]]&&userPrompt="$1"||userPrompt="$userPrompt $1";shift;;
esac;done
[[ -z $userPrompt && ! -t 0 ]]&&userPrompt=$(cat)
[[ -z $userPrompt ]]&&{ emitEcsEventOnStderr error llm.usage failure '' '' 'no prompt provided';exit 2;}
DEFAULT_FALLBACK_CHAIN='gemini:gemini-3.1-pro-preview,claude:opus,codex:o3-mini,gemini:gemini-3-pro-preview,gemini:gemini-pro-latest,gemini:gemini-3-flash-preview,gemini:gemini-3.1-flash-lite-preview,claude:sonnet,gemini:gemini-flash-latest,gemini:gemini-2.5-flash,gemini:gemma-3-27b-it'
fallbackChainSpec=${LLM_CHAIN:-$DEFAULT_FALLBACK_CHAIN};perCallTimeoutSeconds=${LLM_TIMEOUT:-120};systemPrompt=${LLM_SYSTEM:-}
isQuotaOrRateLimitError(){ local err;err=$(printf %s "$1"|tr A-Z a-z);case "$err" in *429*|*quota*|*"rate limit"*|*"rate-limit"*|*exceeded*|*resource_exhausted*|*503*|*504*|*overloaded*|*capacity*) return 0;;*) return 1;;esac;}
callGeminiGenerateContentApi(){ local modelId=$1 prompt=$2 system=$3 schema=$4 commandArgs fullPrompt
  command -v gemini >/dev/null||{ echo 'gemini not on PATH' >&2;return 2;}
  fullPrompt="$prompt";[[ -n $system ]]&&fullPrompt="SYSTEM_INSTRUCTIONS: $system\n\nUSER_PROMPT: $prompt"
  [[ -n $schema ]]&&fullPrompt="$fullPrompt\n\nOUTPUT_SCHEMA: $schema\nReturn ONLY raw JSON matching the schema."
  commandArgs=(-p - -y --output-format text -m "$modelId")
  printf '%s' "$fullPrompt" | IS_SANDBOX=1 timeout --preserve-status "${perCallTimeoutSeconds}s" gemini "${commandArgs[@]}";}
callClaudeCommandLineInterface(){ local modelId=$1 prompt=$2 system=$3 schema=$4 commandArgs
  command -v claude >/dev/null||{ echo 'claude not on PATH' >&2;return 2;}
  commandArgs=(-p --dangerously-skip-permissions --strict-mcp-config --disable-slash-commands --setting-sources user --model "$modelId" --output-format text)
  [[ -n $system ]]&&commandArgs+=(--system-prompt "$system")
  [[ -n $schema ]]&&commandArgs+=(--json-schema "$schema")
  printf '%s' "$prompt" | IS_SANDBOX=1 timeout --preserve-status "${perCallTimeoutSeconds}s" claude "${commandArgs[@]}" -;}
callCodexCommandLineInterface(){ local modelId=$1 prompt=$2 system=$3 schema=$4 commandArgs fullPrompt
  command -v npx >/dev/null||{ echo 'npx not on PATH' >&2;return 2;}
  fullPrompt="$prompt";[[ -n $system ]]&&fullPrompt="$system\n\n$prompt"
  commandArgs=(exec --ephemeral --dangerously-bypass-approvals-and-sandbox --color never -m "$modelId")
  [[ -n $schema ]]&&commandArgs+=(--output-schema "$schema")
  commandArgs+=(-)
  printf '%s' "$fullPrompt" | timeout --preserve-status "${perCallTimeoutSeconds}s" npx -y @openai/codex "${commandArgs[@]}";}
chainEntries=();while IFS= read -r rawEntry||[[ -n $rawEntry ]];do rawEntry=$(printf %s "$rawEntry"|tr -d '[:space:]');[[ -n $rawEntry ]]&&chainEntries+=("$rawEntry");done < <(printf %s "$fallbackChainSpec"|tr ',' '\n')
errorBufferFile=$(mktemp);trap 'rm -f "$errorBufferFile"' EXIT
for chainSpec in "${chainEntries[@]}";do
  providerName=${chainSpec%%:*};modelId=${chainSpec#*:};retryCount=0;maxRetries=3;sleepTime=30
  while ((retryCount <= maxRetries));do
    : >"$errorBufferFile";emitEcsEventOnStderr info llm.attempt success "$providerName" "$modelId" "attempt=$((retryCount+1))"
    case "$providerName" in
      gemini) modelOutput=$(callGeminiGenerateContentApi "$modelId" "$userPrompt" "$systemPrompt" "$jsonSchema" 2>"$errorBufferFile");;
      claude) modelOutput=$(callClaudeCommandLineInterface "$modelId" "$userPrompt" "$systemPrompt" "$jsonSchema" 2>"$errorBufferFile");;
      codex) modelOutput=$(callCodexCommandLineInterface "$modelId" "$userPrompt" "$systemPrompt" "$jsonSchema" 2>"$errorBufferFile");;
      *) emitEcsEventOnStderr warn llm.unknown-provider failure "$providerName" "$modelId" 'unknown provider in chain';break 2;;
    esac
    exitCode=$?
    if [[ $exitCode -eq 0 && -n ${modelOutput:-} ]];then emitEcsEventOnStderr info llm.success success "$providerName" "$modelId" '';printf '%s\n' "$modelOutput";exit 0;fi
    capturedError=$(cat "$errorBufferFile")
    [[ $exitCode -ne 0 && -n ${modelOutput:-} ]] && capturedError="${capturedError} ${modelOutput}"
    if isQuotaOrRateLimitError "$capturedError" && ((retryCount < maxRetries));then
      emitEcsEventOnStderr warn llm.retry-backoff failure "$providerName" "$modelId" "wait=${sleepTime}s error=${capturedError:0:100}"
      sleep "$sleepTime";retryCount=$((retryCount+1));sleepTime=$((sleepTime * 2));continue
    fi
    if isQuotaOrRateLimitError "$capturedError";then emitEcsEventOnStderr warn llm.quota-advance failure "$providerName" "$modelId" "${capturedError:0:200}"
    else emitEcsEventOnStderr warn llm.error-advance failure "$providerName" "$modelId" "${capturedError:0:200}";fi
    break
  done
done
emitEcsEventOnStderr error llm.chain-exhausted failure '' '' 'all models in chain exhausted'
exit 1
LLMSH_EOF

writeLlmFallbackScriptToDisk(){ local llmScriptPath=$REPO_ROOT/scripts/bin/llm.sh
  writeArtifactToDiskAndRecord scripts/bin/llm.sh "$DOTFILES_LLM_SCRIPT_HERESTRING" llm.sh||return 1
  chmod +x "$llmScriptPath";}

# ── Host-level autonomy: git-autosync cron ───────────────────────────────
# Only when bootstrapping the user's home dotfiles repo. This script lives as a
# version-controlled file under scripts/bin/ — no heredoc embedding, it ships
# with the clone. We just chmod and wire up cron idempotently.
installHostLevelAutonomyCronJobs(){ local syncScript currentCron newCron entrySync legacyAutosyncScript
  [[ "$REPO_ROOT" == "$HOME/.dotfiles" ]]||{ emitEcsLogEvent info cron.skip success cron 0 '' '' "REPO_ROOT=$REPO_ROOT not host dotfiles"; return 0; }
  command -v crontab >/dev/null||{ emitEcsLogEvent warn cron.no-crontab failure cron 0 '' '' 'crontab not on PATH'; return 0; }
  syncScript=$REPO_ROOT/scripts/bin/git-awesome
  legacyAutosyncScript=$REPO_ROOT/scripts/bin/git-autosync.sh
  [[ -f "$syncScript" ]]||{ emitEcsLogEvent warn cron.missing-script failure cron 0 '' '' "$syncScript not found; skipping cron install"; return 0; }
  chmod +x "$syncScript"
  validateGeneratedArtifactByExtension "$syncScript"||{ emitEcsLogEvent warn cron.invalid-script failure cron 0 '' '' "$syncScript failed bash -n"; return 0; }
  entrySync="*/15 * * * * $syncScript sync >/dev/null 2>&1"
  currentCron=$(crontab -l 2>/dev/null||true)
  if grep -qF "$entrySync" <<<"$currentCron"; then
    emitEcsLogEvent info cron.skip success cron 0 '' '' 'git-awesome sync entry already present'
    appendTaskStatusRecordToState cron.host ok ''
    return 0
  fi
  # Strip any prior git-autosync.sh entry AND any prior git-awesome entry (handles cadence changes), then append fresh.
  newCron=$(printf '%s\n' "$currentCron"|grep -vF -e "$legacyAutosyncScript" -e "$syncScript"||true)
  newCron=$(printf '%s\n%s\n' "$newCron" "$entrySync"|sed '/^$/d')
  printf '%s\n' "$newCron"|crontab -
  emitEcsLogEvent info cron.install success cron 0 '' '' 'installed git-awesome sync (15m)'
  appendTaskStatusRecordToState cron.host ok ''
}

# Install host-level secret-scanning toolchain (Lefthook + gitleaks + trufflehog).
# Host-level: only runs when REPO_ROOT == ~/.dotfiles (not per-managed-repo).
# Idempotent: each tool checks `command -v` first and skips if already on PATH.
# Targets: ~/.local/bin (no sudo). Lefthook installs via npm if available.
installHostLevelSecretScanTools(){ local lefthookInstalled gitleaksInstalled trufflehogInstalled gitleaksTag gitleaksUrl
  [[ "$REPO_ROOT" == "$HOME/.dotfiles" ]]||{ emitEcsLogEvent info secret_scan_tools.skip success secret_scan_tools 0 '' '' "REPO_ROOT=$REPO_ROOT not host dotfiles"; return 0; }
  mkdir -p "$HOME/.local/bin"

  # Lefthook (npm; preferred because the upstream repo ships releases that way)
  if command -v lefthook >/dev/null 2>&1; then
    lefthookInstalled=skip
  elif command -v npm >/dev/null 2>&1; then
    if npm install -g lefthook >/dev/null 2>&1; then
      lefthookInstalled=installed
    else
      lefthookInstalled=failed
    fi
  else
    lefthookInstalled=no-npm
  fi

  # gitleaks (binary release from GitHub)
  if command -v gitleaks >/dev/null 2>&1; then
    gitleaksInstalled=skip
  elif command -v curl >/dev/null 2>&1 && command -v tar >/dev/null 2>&1; then
    gitleaksTag=$(curl -fsSL https://api.github.com/repos/gitleaks/gitleaks/releases/latest 2>/dev/null|grep -oP '"tag_name":\s*"\K[^"]+'||true)
    if [[ -n "$gitleaksTag" ]]; then
      gitleaksUrl="https://github.com/gitleaks/gitleaks/releases/download/${gitleaksTag}/gitleaks_${gitleaksTag#v}_linux_x64.tar.gz"
      if curl -fsSL "$gitleaksUrl" -o /tmp/gitleaks.tar.gz 2>/dev/null \
         && tar xzf /tmp/gitleaks.tar.gz -C /tmp gitleaks 2>/dev/null \
         && mv /tmp/gitleaks "$HOME/.local/bin/gitleaks" \
         && chmod +x "$HOME/.local/bin/gitleaks"; then
        gitleaksInstalled=installed
      else
        gitleaksInstalled=failed
      fi
      rm -f /tmp/gitleaks.tar.gz
    else
      gitleaksInstalled=no-tag
    fi
  else
    gitleaksInstalled=no-curl
  fi

  # trufflehog (official install.sh script)
  if command -v trufflehog >/dev/null 2>&1; then
    trufflehogInstalled=skip
  elif command -v curl >/dev/null 2>&1; then
    if curl -fsSL https://raw.githubusercontent.com/trufflesecurity/trufflehog/main/scripts/install.sh|sh -s -- -b "$HOME/.local/bin" >/dev/null 2>&1; then
      trufflehogInstalled=installed
    else
      trufflehogInstalled=failed
    fi
  else
    trufflehogInstalled=no-curl
  fi

  emitEcsLogEvent info secret_scan_tools.install success secret_scan_tools 0 '' '' "lefthook=$lefthookInstalled gitleaks=$gitleaksInstalled trufflehog=$trufflehogInstalled"
  appendTaskStatusRecordToState secret_scan_tools.host ok "lefthook=$lefthookInstalled gitleaks=$gitleaksInstalled trufflehog=$trufflehogInstalled"
}

# ══ Pass 2: assessment phase ════════════════════════════════════════════
detectPrimaryProgrammingLanguage(){ local fileToLanguageMapping
  for fileToLanguageMapping in pyproject.toml:python setup.py:python setup.cfg:python requirements.txt:python package.json:javascript Cargo.toml:rust go.mod:go Gemfile:ruby composer.json:php mix.exs:elixir Package.swift:swift build.gradle:java pom.xml:java deno.json:typescript;do
    [[ -f ${fileToLanguageMapping%:*} ]]&&{ echo "${fileToLanguageMapping#*:}";return;}
  done;echo unknown;}

detectPackageManagerFromLockfile(){ local lockfileToManagerMapping
  for lockfileToManagerMapping in bun.lockb:bun bun.lock:bun uv.lock:uv pnpm-lock.yaml:pnpm yarn.lock:yarn package-lock.json:npm Cargo.lock:cargo poetry.lock:poetry Pipfile.lock:pipenv requirements.txt:pip Gemfile.lock:bundler go.sum:go composer.lock:composer;do
    [[ -f ${lockfileToManagerMapping%:*} ]]&&{ echo "${lockfileToManagerMapping#*:}";return;}
  done;echo none;}

deriveCanonicalInstallCommand(){ case $1 in
  bun) echo 'bun install';;uv) echo 'uv sync';;pnpm) echo 'pnpm install';;yarn) echo 'yarn install';;
  npm) echo 'npm install';;cargo) echo 'cargo build --release';;poetry) echo 'poetry install';;
  pipenv) echo 'pipenv install';;pip) echo 'pip install -r requirements.txt';;
  bundler) echo 'bundle install';;go) echo 'go mod download';;composer) echo 'composer install';;
  *) echo '';;
esac;}

extractDescriptionFieldFromManifest(){ local descriptionText=
  [[ -f package.json ]]&&descriptionText=$(jq -r '.description // empty' package.json 2>/dev/null||echo '')
  [[ -z $descriptionText && -f pyproject.toml ]]&&descriptionText=$(grep -m1 '^description' pyproject.toml 2>/dev/null|sed -nE 's/.*=[[:space:]]*"([^"]*)".*/\1/p')
  [[ -z $descriptionText && -f Cargo.toml ]]&&descriptionText=$(awk '/^\[package\]/,/^\[/{if(/^description/)print}' Cargo.toml 2>/dev/null|head -1|sed -nE 's/.*=[[:space:]]*"([^"]*)".*/\1/p')
  [[ -z $descriptionText && -f composer.json ]]&&descriptionText=$(jq -r '.description // empty' composer.json 2>/dev/null||echo '')
  [[ -z $descriptionText && -f deno.json ]]&&descriptionText=$(jq -r '.description // empty' deno.json 2>/dev/null||echo '')
  echo "$descriptionText";}

# Load full existing README into LLM context so the writer can decide
# verbatim-vs-rewrite per spec §9 IDEMPOTENCY rule. Cap at 64 KiB (header +
# overflow truncated). Strips NULs/CR. Empty stdout when README is absent.
loadFullExistingReadmeForLlmContext(){ [[ -f README.md ]]||{ echo;return;}
  local fileSizeBytes;fileSizeBytes=$(wc -c < README.md 2>/dev/null||echo 0)
  ((fileSizeBytes>1048576))&&{ echo;return;}
  head -c 65536 README.md 2>/dev/null|tr -d '\r\0';}

# Deterministic badge planner per spec §4. Emits a JSON array of slot objects
# {slot,label,markdown} in canonical order: CI, License, Status, Package.
# Hard cap 4 slots. The README LLM renders these verbatim, single row.
buildRecommendedBadgeRowFromAssessment(){ [[ -f $ASSESSMENT_FILE ]]||{ echo '[]';return;}
  local repoOwner repoName accentColorHex projectStatus existingLicense statusLabel statusColor packageBadge=
  repoOwner=$(jq -r '.repoOwner // ""' "$ASSESSMENT_FILE")
  repoName=$(jq -r '.repoName // ""' "$ASSESSMENT_FILE")
  accentColorHex=$(jq -r '.accentColorHex // "A371F7"' "$ASSESSMENT_FILE")
  projectStatus=$(jq -r '.projectStatus // "experiment"' "$ASSESSMENT_FILE")
  existingLicense=$(jq -r '.existingLicense // "none"' "$ASSESSMENT_FILE")
  case "$projectStatus" in
    experiment) statusLabel=experimental;statusColor=orange;;
    showcase)   statusLabel=stable;statusColor=blue;;
    active|tool) statusLabel=active;statusColor=brightgreen;;
    reference)  statusLabel=reference;statusColor=lightgrey;;
    *)          statusLabel=experimental;statusColor=orange;;
  esac
  local slots=()
  if [[ -f .github/workflows/ci.yml && -n $repoOwner && -n $repoName ]];then
    slots+=("$(jq -nc --arg slot CI --arg label CI \
      --arg md "[![CI](https://github.com/${repoOwner}/${repoName}/actions/workflows/ci.yml/badge.svg)](https://github.com/${repoOwner}/${repoName}/actions/workflows/ci.yml)" \
      '{slot:$slot,label:$label,markdown:$md}')")
  fi
  if [[ $existingLicense != none && -n $repoOwner && -n $repoName ]];then
    slots+=("$(jq -nc --arg slot License --arg label "License" \
      --arg md "[![License](https://img.shields.io/github/license/${repoOwner}/${repoName}?color=${accentColorHex})](./LICENSE)" \
      '{slot:$slot,label:$label,markdown:$md}')")
  fi
  slots+=("$(jq -nc --arg slot Status --arg label "Status" \
    --arg md "![Status](https://img.shields.io/badge/status-${statusLabel}-${statusColor}.svg)" \
    '{slot:$slot,label:$label,markdown:$md}')")
  # Package slot: emit only if a published manifest is detected. Conservative —
  # we infer "published" from a name-bearing manifest plus a registry probe later;
  # for now, presence of package.json with a non-private flag and a name field
  # qualifies as a candidate. Skipped for now to avoid false positives.
  packageBadge=
  [[ -n $packageBadge ]]&&slots+=("$packageBadge")
  printf '%s\n' "${slots[@]}"|jq -s '.';}

# Style corpus for the README LLM. Concatenates wranngle voice references with
# 4 KiB cap per source and 24 KiB total cap. Resolves from target repo first,
# then ~/.dotfiles fallback. Output is plain text: each source section is
# delimited by `--- <source-label> ---` for the LLM to anchor tone, not quote.
buildDotfilesStyleCorpusForLlmContext(){
  local totalCap=24576 perSourceCap=4096 collected=0 corpus='' label content sourcePath
  local sources=(
    ".agents/DESIGN.md"
    ".agents/wranngle-DESIGN.md"
    ".agents/AGENTS.md"
    "docs/design-docs/core-beliefs.md"
    "CONTRIBUTING.md"
  )
  for label in "${sources[@]}";do
    sourcePath=
    if [[ -f "$REPO_ROOT/$label" ]];then sourcePath="$REPO_ROOT/$label"
    elif [[ -f "$HOME/.dotfiles/$label" ]];then sourcePath="$HOME/.dotfiles/$label"
    fi
    [[ -z $sourcePath ]]&&continue
    content=$(head -c "$perSourceCap" "$sourcePath" 2>/dev/null|tr -d '\0')
    [[ -z $content ]]&&continue
    local sectionLen=${#content}
    ((collected+sectionLen+64>totalCap))&&break
    corpus+="--- ${label} ---"$'\n'"${content}"$'\n\n'
    collected=$((collected+sectionLen+64))
  done
  # Compass research (canonical 2026 best-practices source)
  local compassPath=$HOME/.dotfiles/docs/references/compass_artifact_wf-630b91fc-5725-46ed-9c66-edc24910fa11_text_markdown.md
  if [[ -f $compassPath && $collected -lt $totalCap ]];then
    local remaining=$((totalCap-collected-128))
    ((remaining>perSourceCap))&&remaining=$perSourceCap
    if ((remaining>256));then
      content=$(head -c "$remaining" "$compassPath" 2>/dev/null|tr -d '\0')
      corpus+="--- compass-research (2026 README best practices) ---"$'\n'"${content}"$'\n'
    fi
  fi
  printf '%s' "$corpus";}

# Spec §3 status classifier. Returns one of:
#   showcase|experiment|active|reference|tool
# Deterministic from repo signals. Default `experiment` when ambiguous.
classifyProjectStatusFromSignals(){
  local commitCount lastCommitEpoch nowEpoch ageDays tagCount hasInstallCmd hasDocsDir readmeBytes installCommandLocal hasNpmBin hasCargoBin hasGoCmdMain
  commitCount=$(git rev-list --count HEAD 2>/dev/null||echo 0)
  lastCommitEpoch=$(git log -1 --format=%ct 2>/dev/null||echo 0)
  nowEpoch=$(date +%s)
  if [[ $lastCommitEpoch -gt 0 ]];then ageDays=$(((nowEpoch-lastCommitEpoch)/86400));else ageDays=99999;fi
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1;then
    tagCount=$(git tag 2>/dev/null|wc -l)
  else
    tagCount=0
  fi
  hasDocsDir=0;[[ -d docs ]]&&hasDocsDir=1
  readmeBytes=0
  [[ -f README.md ]]&&readmeBytes=$(wc -c < README.md 2>/dev/null||echo 0)
  installCommandLocal=$(deriveCanonicalInstallCommand "$(detectPackageManagerFromLockfile)")
  hasInstallCmd=0;[[ -n $installCommandLocal ]]&&hasInstallCmd=1
  # Strict redistributable-binary entry-point detection. CI presence is no
  # longer a gate (personal projects without CI are still real projects).
  hasNpmBin=0
  [[ -f package.json ]]&&jq -e '.bin // empty' package.json >/dev/null 2>&1&&hasNpmBin=1
  hasCargoBin=0
  [[ -f Cargo.toml ]]&&grep -q '^\[\[bin\]\]' Cargo.toml 2>/dev/null&&hasCargoBin=1
  hasGoCmdMain=0
  [[ -d cmd ]]&&find cmd -maxdepth 2 -name 'main.go' 2>/dev/null|head -1|grep -q .&&hasGoCmdMain=1
  # tool: redistributable CLI/binary entry point. Strict: package.json#bin,
  # Cargo [[bin]], or Go cmd/*/main.go. Personal scripts/bin/ helpers do NOT
  # qualify (those are wranngle dotfiles convention, not user-facing CLIs).
  if ((hasNpmBin||hasCargoBin||hasGoCmdMain));then echo tool;return;fi
  # active: commits in last 30 days. Used in current workflow.
  if ((ageDays<=30));then echo active;return;fi
  # showcase: brownfield (README>500B), no commits in 90 days, ≥1 tag
  if ((readmeBytes>500&&ageDays>90&&tagCount>=1));then echo showcase;return;fi
  # reference: brownfield, has docs/, no install, no releases (tags=0)
  if ((readmeBytes>500&&hasDocsDir&&!hasInstallCmd&&tagCount==0));then echo reference;return;fi
  # default
  echo experiment;}

# Spec §3 canonical phrasing per status. README LLM renders verbatim.
canonicalProjectStatusCalloutPhrasing(){ case "$1" in
  showcase)   echo "Showcase project. Stable enough to demo, not maintained as a product.";;
  experiment) echo "Experiment. Built to learn one specific thing. Code may not survive.";;
  active)     echo "Active personal project. Used in my own workflow. Issues triaged on a personal-time cadence.";;
  reference)  echo "Reference implementation. Public so others can read it. Not packaged for reuse.";;
  tool)       echo "Personal tool. I use this. You can too.";;
  *)          echo "Experiment. Built to learn one specific thing. Code may not survive.";;
esac;}

# Parse {owner,name} from origin remote. Empty strings when unset.
parseRepoOwnerAndNameFromGitRemote(){ local rawRemoteUrl=$1 normalized
  normalized=$(normalizeGitRemoteUrlToHttps "$rawRemoteUrl")
  [[ $normalized =~ ^https://[^/]+/([^/]+)/([^/]+)$ ]]||{ echo '|';return;}
  echo "${BASH_REMATCH[1]}|${BASH_REMATCH[2]}";}

normalizeGitRemoteUrlToHttps(){ local rawRemoteUrl=$1
  case "$rawRemoteUrl" in
    git@github.com:*) rawRemoteUrl=${rawRemoteUrl#git@github.com:};rawRemoteUrl=${rawRemoteUrl%.git};echo "https://github.com/$rawRemoteUrl";;
    git@gitlab.com:*) rawRemoteUrl=${rawRemoteUrl#git@gitlab.com:};rawRemoteUrl=${rawRemoteUrl%.git};echo "https://gitlab.com/$rawRemoteUrl";;
    git@*:*) rawRemoteUrl=${rawRemoteUrl#git@};local hostPart=${rawRemoteUrl%%:*} pathPart=${rawRemoteUrl#*:};echo "https://${hostPart}/${pathPart%.git}";;
    https://*) echo "${rawRemoteUrl%.git}";;
    *) echo "$rawRemoteUrl";;
  esac;}

deriveAuthorHandleFromGitRemote(){ local rawRemoteUrl=$1
  case "$rawRemoteUrl" in
    git@*:*) rawRemoteUrl=${rawRemoteUrl#*:};echo "${rawRemoteUrl%%/*}";;
    https://*) rawRemoteUrl=${rawRemoteUrl#https://};rawRemoteUrl=${rawRemoteUrl#*/};echo "${rawRemoteUrl%%/*}";;
    *) echo;;
  esac;}

classifyProjectMaturityFromHistory(){ local commitCountOnHead;commitCountOnHead=$(git rev-list --count HEAD 2>/dev/null||echo 0)
  ((commitCountOnHead<3))&&{ echo greenfield;return;}
  [[ -f README.md && $(wc -c < README.md 2>/dev/null||echo 0) -gt 500 ]]&&{ echo brownfield;return;}
  echo greenfield;}

detectExistingLicenseSpdxIdentifier(){ local licenseFilePath=
  for candidatePath in LICENSE LICENSE.md LICENSE.txt COPYING COPYING.md;do [[ -f $candidatePath ]]&&{ licenseFilePath=$candidatePath;break;};done
  [[ -z $licenseFilePath ]]&&{ echo none;return;}
  grep -q 'MIT License' "$licenseFilePath"&&{ echo MIT;return;}
  grep -q 'Apache License' "$licenseFilePath"&&{ echo Apache-2.0;return;}
  grep -q 'GNU GENERAL PUBLIC LICENSE' "$licenseFilePath"&&{ grep -q 'Version 3' "$licenseFilePath"&&echo GPL-3.0||echo GPL-2.0;return;}
  grep -q 'BSD 3-Clause' "$licenseFilePath"&&{ echo BSD-3-Clause;return;}
  grep -q 'BSD 2-Clause' "$licenseFilePath"&&{ echo BSD-2-Clause;return;}
  grep -q 'Mozilla Public License' "$licenseFilePath"&&{ echo MPL-2.0;return;}
  grep -qi 'unlicense' "$licenseFilePath"&&{ echo Unlicense;return;}
  grep -q 'ISC License' "$licenseFilePath"&&{ echo ISC;return;}
  echo other;}

detectProjectNameFromManifestOrDirectory(){ local projectName=
  [[ -f package.json ]]&&projectName=$(jq -r '.name // empty' package.json 2>/dev/null||echo '')
  [[ -z $projectName && -f pyproject.toml ]]&&projectName=$(grep -m1 '^name' pyproject.toml 2>/dev/null|sed -nE 's/.*=[[:space:]]*"([^"]*)".*/\1/p')
  [[ -z $projectName && -f Cargo.toml ]]&&projectName=$(awk '/^\[package\]/,/^\[/{if(/^name/)print}' Cargo.toml 2>/dev/null|head -1|sed -nE 's/.*=[[:space:]]*"([^"]*)".*/\1/p')
  [[ -z $projectName && -f composer.json ]]&&projectName=$(jq -r '.name // empty' composer.json 2>/dev/null||echo '')
  [[ -z $projectName ]]&&projectName=${REPO_ROOT##*/}
  echo "$projectName";}

countCommitsOnCurrentBranch(){ git rev-list --count HEAD 2>/dev/null||echo 0;}

executeRepositoryAssessmentPhase(){
  local detectedLanguage detectedPackageManager canonicalInstallCommand manifestDescription
  local gitConfigUserName gitConfigUserEmail gitRemoteRawUrl normalizedRepoHttpsUrl derivedAuthorHandle projectMaturity detectedLicenseSpdx projectName commitCount currentYear
  local repoOwnerAndName repoOwner repoName projectStatus fullExistingReadme dotfilesStyleCorpus repoVisibility hasDeployedSiteFlag hasReleasesFlag hasPackagesFlag hasDeploymentsFlag accentColorHex='A371F7'
  detectedLanguage=$(detectPrimaryProgrammingLanguage)
  detectedPackageManager=$(detectPackageManagerFromLockfile)
  canonicalInstallCommand=$(deriveCanonicalInstallCommand "$detectedPackageManager")
  manifestDescription=$(extractDescriptionFieldFromManifest)
  gitConfigUserName=$(git config user.name 2>/dev/null||echo)
  gitConfigUserEmail=$(git config user.email 2>/dev/null||echo)
  gitRemoteRawUrl=$(git remote get-url origin 2>/dev/null||echo)
  normalizedRepoHttpsUrl=$(normalizeGitRemoteUrlToHttps "$gitRemoteRawUrl")
  derivedAuthorHandle=$(deriveAuthorHandleFromGitRemote "$gitRemoteRawUrl")
  projectMaturity=$(classifyProjectMaturityFromHistory)
  detectedLicenseSpdx=$(detectExistingLicenseSpdxIdentifier)
  projectName=$(detectProjectNameFromManifestOrDirectory)
  commitCount=$(countCommitsOnCurrentBranch)
  currentYear=$(date +%Y)
  repoOwnerAndName=$(parseRepoOwnerAndNameFromGitRemote "$gitRemoteRawUrl")
  repoOwner=${repoOwnerAndName%|*}
  repoName=${repoOwnerAndName#*|}
  projectStatus=$(classifyProjectStatusFromSignals)
  fullExistingReadme=$(loadFullExistingReadmeForLlmContext)
  dotfilesStyleCorpus=$(buildDotfilesStyleCorpusForLlmContext)
  # Probe public visibility + artifact existence via gh (silently skips when gh
  # missing/unauthed). All booleans false when probe fails — metadata writers
  # gate on these to avoid lying to GitHub.
  repoVisibility=
  hasReleasesFlag=false;hasPackagesFlag=false;hasDeploymentsFlag=false
  if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1 && [[ -n $repoOwner && -n $repoName ]];then
    repoVisibility=$(gh repo view "$repoOwner/$repoName" --json visibility -q .visibility 2>/dev/null||echo)
    [[ $(gh api -X GET "repos/$repoOwner/$repoName/releases" --paginate --jq 'length' 2>/dev/null|head -1) -gt 0 ]]&&hasReleasesFlag=true
    [[ $(gh api -X GET "repos/$repoOwner/$repoName/deployments" --paginate --jq 'length' 2>/dev/null|head -1) -gt 0 ]]&&hasDeploymentsFlag=true
    # Packages: user-scope query (orgs query 404s for personal accounts)
    if gh api -X GET "users/$repoOwner/packages?package_type=npm" --jq 'length' 2>/dev/null|grep -q '^[1-9]';then hasPackagesFlag=true
    elif gh api -X GET "users/$repoOwner/packages?package_type=container" --jq 'length' 2>/dev/null|grep -q '^[1-9]';then hasPackagesFlag=true
    fi
  fi
  hasDeployedSiteFlag=false
  if compgen -G '.github/workflows/*deploy*.yml' >/dev/null||[[ -f vercel.json || -f netlify.toml || -f wrangler.toml ]];then hasDeployedSiteFlag=true
  elif command -v gh >/dev/null 2>&1 && [[ -n $repoOwner && -n $repoName ]] && gh api "repos/$repoOwner/$repoName/branches/gh-pages" >/dev/null 2>&1;then hasDeployedSiteFlag=true
  fi
  jq -n \
    --arg lang "$detectedLanguage" --arg pkgMgr "$detectedPackageManager" --arg installCmd "$canonicalInstallCommand" \
    --arg tagline "$manifestDescription" \
    --arg gitName "$gitConfigUserName" --arg gitEmail "$gitConfigUserEmail" --arg gitRemote "$gitRemoteRawUrl" \
    --arg repoUrl "$normalizedRepoHttpsUrl" --arg handle "$derivedAuthorHandle" --arg maturity "$projectMaturity" \
    --arg license "$detectedLicenseSpdx" --arg name "$projectName" --arg year "$currentYear" \
    --arg owner "$repoOwner" --arg repoNameField "$repoName" --arg status "$projectStatus" \
    --arg accent "$accentColorHex" --arg fullReadme "$fullExistingReadme" --arg corpus "$dotfilesStyleCorpus" \
    --arg visibility "$repoVisibility" \
    --argjson commits "$commitCount" \
    --argjson deployedSite "$hasDeployedSiteFlag" --argjson releases "$hasReleasesFlag" \
    --argjson packages "$hasPackagesFlag" --argjson deployments "$hasDeploymentsFlag" \
    '{language:$lang,packageManager:$pkgMgr,installCommand:$installCmd,taglineCandidate:$tagline,
      manifestDescription:$tagline,
      git:{userName:$gitName,userEmail:$gitEmail,remoteUrl:$gitRemote},
      repoUrl:$repoUrl,authorHandle:$handle,projectMaturity:$maturity,existingLicense:$license,
      projectName:$name,year:$year,commitCount:$commits,
      repoOwner:$owner,repoName:$repoNameField,projectStatus:$status,
      accentColorHex:$accent,fullExistingReadme:$fullReadme,dotfilesStyleCorpus:$corpus,
      repoVisibility:$visibility,repoIsPublic:($visibility=="PUBLIC"),
      hasDeployedSite:$deployedSite,hasReleases:$releases,hasPackages:$packages,hasDeployments:$deployments}' \
    > "$ASSESSMENT_FILE" 2>/dev/null||{ emitEcsLogEvent warn task.assess failure assess 0 '' '' "could not write assessment cache";return 0;}
  validateGeneratedArtifactByExtension "$ASSESSMENT_FILE"||failFatallyAndExit assess 'assessment.json invalid'
  appendTaskStatusRecordToState assess ok "$(sha256sum "$ASSESSMENT_FILE"|cut -d' ' -f1)"
  emitEcsLogEvent info task.assess success assess 0 '' '' "lang=$detectedLanguage pkgMgr=$detectedPackageManager maturity=$projectMaturity status=$projectStatus license=$detectedLicenseSpdx commits=$commitCount name=$projectName owner=$repoOwner repo=$repoName visibility=${repoVisibility:-unknown}"
}

# ── Context-injection helpers used by pass 4 LLM tasks ─────────────────
buildLlmContextPrefixFromAssessment(){ [[ -f $ASSESSMENT_FILE ]]||{ echo;return;}
  printf 'Project context (from assessment.json):\n```json\n%s\n```\n\n' "$(cat "$ASSESSMENT_FILE")";}
readFieldFromAssessmentFile(){ [[ -f $ASSESSMENT_FILE ]]||{ echo;return;};jq -r --arg k "$1" 'getpath($k|split("."))//empty' "$ASSESSMENT_FILE";}

# ══ Pass 3: deterministic herestring writers ════════════════════════════
read -r -d '' MIT_LICENSE_TEMPLATE_HERESTRING <<'MIT_LIC_EOF' || true
MIT License

Copyright (c) {{YEAR}} {{AUTHOR_NAME}}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OF OR OTHER DEALINGS IN
THE SOFTWARE.
MIT_LIC_EOF

read -r -d '' CODE_OF_CONDUCT_TEMPLATE_HERESTRING <<'COC_EOF' || true
# Code of Conduct

This project follows the [Contributor Covenant v3.0](https://www.contributor-covenant.org/version/3/0/code_of_conduct/).

Report unacceptable behavior to **{{AUTHOR_EMAIL}}**.
COC_EOF

read -r -d '' DEPENDABOT_YML_TEMPLATE_HERESTRING <<'DEPENDABOT_EOF' || true
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    cooldown:
      default-days: 7
      semver-major-days: 30
      semver-minor-days: 7
      semver-patch-days: 3
    open-pull-requests-limit: 3
    labels:
      - "dependencies"
    commit-message:
      prefix: "ci"
      include: "scope"
    groups:
      github-actions-minor-patch:
        patterns: ["*"]
        update-types: ["minor", "patch"]
DEPENDABOT_EOF

read -r -d '' ISSUE_TEMPLATE_CONFIG_YML_HERESTRING <<'ISSUE_CFG_EOF' || true
blank_issues_enabled: false
contact_links:
  - name: "🔒 Security vulnerability"
    url: "{{REPO_URL}}/security/advisories/new"
    about: "Privately report a security vulnerability."
  - name: "💬 Question or discussion"
    url: "{{REPO_URL}}/discussions"
    about: "Open a discussion instead of an issue."
ISSUE_CFG_EOF

read -r -d '' CI_WORKFLOW_YML_TEMPLATE_HERESTRING <<'CI_EOF' || true
name: ci

on:
  push:
    branches: [main, master]
  pull_request:
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  shell-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd  # v6.0.2
        with:
          persist-credentials: false
      - name: shellcheck
        shell: bash
        run: |
          mapfile -t files < <(
            {
              find . -type f -name '*.sh' \
                -not -path './.git/*' \
                -not -path './node_modules/*' \
                -not -path './old/*'
              if [[ -d scripts/bin ]]; then
                while IFS= read -r candidate; do
                  first_line=$(head -n 1 "$candidate" 2>/dev/null || true)
                  [[ "$first_line" == '#!'*sh* ]] && printf '%s\n' "$candidate"
                done < <(find scripts/bin -maxdepth 1 -type f -perm -111)
              fi
            } | sort -u
          )
          [[ ${#files[@]} -eq 0 ]] && { echo "no shell files — skipping"; exit 0; }
          sudo apt-get update -qq
          sudo apt-get install -y -qq shellcheck
          shellcheck -S warning "${files[@]}"

  yaml-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd  # v6.0.2
        with:
          persist-credentials: false
      - uses: actions/setup-python@a309ff8b426b58ec0e2a45f0f869d46889d02405  # v6.2.0
        with:
          python-version: "3.x"
      - name: yamllint
        run: |
          pip install --quiet yamllint
          yamllint -c .yamllint.yml .

  workflow-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd  # v6.0.2
        with:
          persist-credentials: false
      - name: actionlint-and-zizmor
        shell: bash
        run: |
          set -euo pipefail
          go install github.com/rhysd/actionlint/cmd/actionlint@v1.7.7
          "$HOME/go/bin/actionlint"
          python3 -m pip install --quiet --upgrade pip
          python3 -m pip install --quiet zizmor==1.24.1
          zizmor .github/workflows

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd  # v6.0.2
        with:
          persist-credentials: false
      - uses: oven-sh/setup-bun@0c5077e51419868618aeaa5fe8019c62421857d6  # v2
      - name: detect-and-test
        shell: bash
        run: |
          set -euo pipefail
          export PUPPETEER_SKIP_DOWNLOAD=true
          export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
          if [[ -x scripts/bin/git-awesome ]]; then
            sudo apt-get update -qq
            sudo apt-get install -y -qq bats
            if [[ -d tests ]]; then
              echo "::group::bats"
              bats tests/
              echo "::endgroup::"
            fi
            echo "::group::git-awesome conform"
            scripts/bin/git-awesome conform || true
            echo "::endgroup::"
          fi
          if [[ -f package.json ]];then
            if [[ -f .github/workflows/test.yml || -f .github/workflows/test.yaml ]]; then
              echo "dedicated test workflow detected - skipping generic package test"
              exit 0
            fi
            echo "::group::node"
            node --version
            (npm ci || npm install) >/dev/null
            npm test --if-present
            echo "::endgroup::"
          elif [[ -f pyproject.toml || -f requirements.txt || -f setup.py ]];then
            echo "::group::python"
            python3 --version
            python3 -m pip install --quiet --upgrade pip
            if [[ -f requirements.txt ]]; then
              python3 -m pip install --quiet -r requirements.txt
            fi
            if [[ -f pyproject.toml ]]; then
              python3 -m pip install --quiet -e . 2>/dev/null || true
            fi
            python3 -m pytest -q 2>/dev/null || echo "no pytest config — skipping"
            echo "::endgroup::"
          elif [[ -f Cargo.toml ]];then
            echo "::group::rust"
            cargo --version
            cargo test --all
            echo "::endgroup::"
          elif [[ -f go.mod ]];then
            echo "::group::go"
            go version
            go test ./...
            echo "::endgroup::"
          else
            echo "no language toolchain detected — running smoke check only"
            ls -la
          fi
CI_EOF

read -r -d '' YAMLLINT_YML_TEMPLATE_HERESTRING <<'YAMLLINT_EOF' || true
extends: default

ignore: |
  .git/**
  old/**
  node_modules/**
  **/node_modules/**
  vendor/**
  deps/**
  .venv/**
  venv/**

rules:
  line-length: disable
  document-start: disable
  truthy:
    check-keys: false
YAMLLINT_EOF



read -r -d '' DESIGN_MD_TEMPLATE_HERESTRING <<'DESIGN_MD_EOF' || true
# Design — UI/UX Source of Truth

This file is the canonical record of design decisions for any UI work in this
project. Every visual or UX change should reference and, where appropriate,
update this document. Treat it as living: when you make a design call worth
preserving, write it down here.

`.agents/AGENTS.md` points here from its UI customization section. If you
fork or adapt this dotfiles deployment, this file is yours to rewrite — the
defaults below are starting points, not commandments.

## Cross-pointers

This file is one half of a bidirectional pair with the **UI skill** that
performs design / triage work. They reference each other on purpose:

- **UI skill (mechanic):** `~/.agents/skills/ui/SKILL.md` — how to do
  design work, how to triage inbound feedback (PinchGrab JSONL,
  Stagewise, screenshots, audit reports), the 9-category flaw taxonomy,
  and the fix-pattern library. The skill defers visual identity to this
  file; this file defers process to the skill. (`~/.dotfiles/.agents/...`
  is the user's personal config source; runtime deployment is `~/.agents/`.)
- **PinchGrab feedback exports:** every workspace `.tar.zst` and JSONL
  manifest carries a `design` block pointing back at this file (or
  carrying its content inline when the user pasted/uploaded it via the
  side-panel settings). Triage starts by reading whatever this file says.
- **AGENTS.md:** `~/.agents/AGENTS.md` indexes both this file and the UI
  skill. If you fork or adapt this deployment, this file is yours to
  rewrite — the defaults below are starting points, not commandments.

## README and repo-metadata authority

The README.md, GitHub About field, topics, homepage, and right-sidebar display
checkboxes are stamped uniformly across every wranngle repo by `.dotfiles.sh`.
The single authority for that pipeline is:

`~/.dotfiles/docs/exec-plans/active/WRANNGLE-README-SYSTEM.md`

That spec defines the wranngle voice (lowercase taglines, sentence-case
headers, no em-dashes, no exclamation points, single Primer-purple accent
`#A371F7`), the deterministic badge planner (max 4 slots: CI, License, Status,
Package), the project-status classifier (showcase / experiment / active /
reference / tool), and the metadata writers' validation + reconciliation
rules. Read that spec before editing README prose or repo About-field text;
update the spec first if you discover a gap, then re-bootstrap.

## Mission

One sentence describing the aesthetic posture and product feeling.
(Replace with project-specific intent.)

## Audience & posture

- Primary user:
- Reading level / expertise:
- Density bias (information-dense vs. spacious):
- Tone (clinical, playful, terse, conversational):

## Tokens

### Color

Canonical shadcn HSL variables for Sunset/Violet/Sand/Night:
- Background: `0 0% 100%` (Light) / `240 10% 3.9%` (Dark - Night)
- Primary: Violet `262 83.3% 57.8%`
- Secondary: Sand `43 74.4% 49%`
- Accent/Destructive: Sunset `11 82.5% 54.3%`

Light/dark parity is mandatory unless explicitly opted out.

### Typography

Canonical Font Stack (matching gtm_ops):
- Display:  `Bricolage Grotesque`
- Body:     `Inter`
- Mono:     `JetBrains Mono`

- Scale (px): 12 · 14 · 16 · 18 · 20 · 24 · 32 · 48
- Line-height ratios: 1.2 (display) · 1.5 (body) · 1.4 (mono)

### Spacing

4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 (px). Compose, don't free-form.

### Radius

Canonical Radii (matching wranngle_com):
- 3px · 6px · 9px. Pick one per surface tier.

### Motion (Framer Motion)

- Snap (UI feedback):    100ms · ease-out
- Reveal (panels, menus): 200ms · ease-out
- Settle (cross-page):    400ms · ease-in-out
- Respect `prefers-reduced-motion`. Default to reduced when in doubt.

#### Framer Motion Patterns
- **Entrance:** Fade in with slight upward translation (e.g., `opacity: 0, y: 10` -> `opacity: 1, y: 0`).
- **Exit:** Fade out with slight downward translation.
- **Stagger:** Use `staggerChildren` (e.g., `0.05s`) for list items to create a cascading entrance effect.

## Components

Decision tree for any new UI:

1. Use a built-in primitive if it exists.
2. Use the project's component library if a primitive composes the need.
3. Custom only when (1) and (2) provably fail. Justify in PR description.

Document component variants here as they're chosen.

### Form / Input Components
- Inputs, selects, and textareas must follow unified styling rules:
  - Border: 1px solid `border` color (typically subtle).
  - Focus state: Ring with `Primary` color (Violet), 2px offset.
  - Background: `Surface` or transparent.
  - Radius: Must conform to the 3/6/9px scale (default 6px for standard inputs).
  - Validation: Error state borders must use `Destructive` (Sunset).

## Layout primitives

- Stack (vertical), Inline (horizontal), Grid, Center, Spacer.
- Avoid raw flex/grid in feature code; reach for primitives.
- Page-level shell: define here.

## Accessibility floor

- WCAG 2.2 AA, no exceptions without an issue tracking the gap.
- Contrast: 4.5:1 body, 3:1 large/icon.
- Keyboard reachable, focus visible, focus order sane.
- Screen-reader names + landmarks on every interactive surface.
- Hit targets ≥ 24×24 CSS px (44×44 on touch).
- Form fields have visible labels (placeholders are not labels).

## Iconography

- Source: `Lucide React`
- Stroke weight: 2px (default)
- Size scale: 16 · 20 · 24 · 32
- Color-pairing rules:
  - Inactive/Subtle: Use `Subtle text` color.
  - Active/Actionable: Use `Primary` (Violet) or inherit text color.

## Logo System

- Formal logo documentation must reference and extend the `github.com/wranngle/logo_maker` repository.
- Requirements for any new logo:
  - Vector source (.svg).
  - Light/dark variants (or adaptive coloring).
  - Defined clearspace constraints.
  - Minimum size definitions.
  - Strict rules for when to use wordmark vs. standalone icon.

## Copy & voice

- Voice:    ` `
- Tone:     ` `
- Banned phrases / patterns:
- Capitalization (sentence vs. title case):
- Numerals, units, dates: spell out under 10? ISO dates?

## Don'ts

- (Curate a list of design anti-patterns observed and rejected here.)

## Sources of truth (links)

- Design system / Figma:
- Token registry / Tailwind config:
- Component library:
- Production reference URL:

## Customization checklist (for new projects)

- [ ] Replace mission sentence.
- [ ] Fill color tokens.
- [ ] Fill typography stack.
- [ ] Pick spacing/radius/motion tiers.
- [ ] Link sources of truth.
- [ ] Pin iconography source.
- [ ] Add project-specific don'ts.
DESIGN_MD_EOF

read -r -d '' AUTOMERGE_WORKFLOW_YML_TEMPLATE_HERESTRING <<'AUTOMERGE_EOF' || true
name: automerge

on:
  pull_request:
    types: [opened, reopened, synchronize, ready_for_review, labeled]
  workflow_dispatch:
    inputs:
      pr:
        description: Pull request number to arm for auto-merge
        required: false

permissions:
  contents: read

concurrency:
  group: automerge-${{ github.event.pull_request.number || inputs.pr || github.ref }}
  cancel-in-progress: true

jobs:
  arm:
    runs-on: ubuntu-latest
    if: github.event_name == 'workflow_dispatch' || github.event.pull_request.draft == false
    permissions:
      checks: read
      contents: write
      pull-requests: write
      statuses: read
    steps:
      - name: Resolve PR metadata
        id: pr
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          EVENT_NAME: ${{ github.event_name }}
          EVENT_PR_NUMBER: ${{ github.event.pull_request.number }}
          INPUT_PR_NUMBER: ${{ inputs.pr }}
          REPO: ${{ github.repository }}
        shell: bash
        run: |
          set -euo pipefail
          export PUPPETEER_SKIP_DOWNLOAD=true
          export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
          pr_number="${INPUT_PR_NUMBER:-${EVENT_PR_NUMBER:-}}"
          if [[ -z "$pr_number" ]]; then
            echo "No PR number supplied"; exit 0
          fi
          pr_json=$(gh pr view "$pr_number" --repo "$REPO" --json author,headRefName,headRefOid,isDraft,labels)
          head_ref=$(jq -r '.headRefName' <<<"$pr_json")
          head_oid=$(jq -r '.headRefOid' <<<"$pr_json")
          author=$(jq -r '.author.login' <<<"$pr_json")
          is_draft=$(jq -r '.isDraft' <<<"$pr_json")
          labels=$(jq -r '[.labels[].name] | join(",")' <<<"$pr_json")
          {
            echo "number=$pr_number"
            echo "head_ref=$head_ref"
            echo "head_oid=$head_oid"
            echo "author=$author"
            echo "is_draft=$is_draft"
            echo "labels=$labels"
          } >> "$GITHUB_OUTPUT"

      - name: Fetch Dependabot metadata
        if: steps.pr.outputs.author == 'dependabot[bot]'
        id: dependabot
        uses: dependabot/fetch-metadata@25dd0e34f4fe68f24cc83900b1fe3fe149efef98  # v3.1.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Gate and merge
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          REPO: ${{ github.repository }}
          PR_NUMBER: ${{ steps.pr.outputs.number }}
          HEAD_REF: ${{ steps.pr.outputs.head_ref }}
          HEAD_OID: ${{ steps.pr.outputs.head_oid }}
          AUTHOR: ${{ steps.pr.outputs.author }}
          IS_DRAFT: ${{ steps.pr.outputs.is_draft }}
          LABELS: ${{ steps.pr.outputs.labels }}
          DEP_UPDATE_TYPE: ${{ steps.dependabot.outputs.update-type }}
          REQUIRED_CHECKS: "shell-lint,yaml-lint,test,gitleaks,actionlint,zizmor,workflow-lint"
        shell: bash
        run: |
          set -euo pipefail
          export PUPPETEER_SKIP_DOWNLOAD=true
          export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
          [[ -n "$PR_NUMBER" ]] || { echo "no PR number"; exit 0; }
          [[ "$IS_DRAFT" != "true" ]] || { echo "draft PR; skipping"; exit 0; }

          eligible=0
          reason=""
          if [[ ",$LABELS," == *",automerge,"* ]]; then
            eligible=1
            reason="automerge label"
          elif [[ "$AUTHOR" == "dependabot[bot]" && "$DEP_UPDATE_TYPE" =~ ^version-update:semver-(patch|minor)$ ]]; then
            eligible=1
            reason="dependabot ${DEP_UPDATE_TYPE}"
          fi

          if [[ "$eligible" != 1 ]]; then
            echo "not eligible for auto-merge: author=$AUTHOR head=$HEAD_REF labels=$LABELS update=$DEP_UPDATE_TYPE"
            exit 0
          fi

          required_json=$(jq -cn --arg csv "$REQUIRED_CHECKS" '$csv | split(",") | map(select(length > 0))')
          check_runs_file=$(mktemp)
          statuses_file=$(mktemp)
          stable_green=0
          max_attempts=90
          interval_seconds=10

          for attempt in $(seq 1 "$max_attempts"); do
            echo "check gate poll $attempt/$max_attempts for PR #$PR_NUMBER"
            current_head=$(gh pr view "$PR_NUMBER" --repo "$REPO" --json headRefOid --jq .headRefOid)
            if [[ "$current_head" != "$HEAD_OID" ]]; then
              echo "PR head changed from $HEAD_OID to $current_head; newer automerge run will decide"
              exit 0
            fi

            gh api "repos/$REPO/commits/$HEAD_OID/check-runs?per_page=100" > "$check_runs_file"
            gh api "repos/$REPO/commits/$HEAD_OID/status" > "$statuses_file"

            failed=$(
              {
                jq -r '
                  .check_runs[]
                  | select(.name != "arm")
                  | select(.status == "completed")
                  | select(.conclusion == "failure" or .conclusion == "cancelled" or .conclusion == "timed_out" or .conclusion == "action_required" or .conclusion == "startup_failure")
                  | "check-run:\(.name)=\(.conclusion)"
                ' "$check_runs_file"
                jq -r '
                  .statuses[]?
                  | select(.state == "failure" or .state == "error")
                  | "status:\(.context)=\(.state)"
                ' "$statuses_file"
              } | sed '/^$/d'
            )
            if [[ -n "$failed" ]]; then
              printf 'blocking auto-merge; check failure detected:\n%s\n' "$failed"
              exit 1
            fi

            missing_required=$(jq -r --argjson required "$required_json" '
              [.check_runs[] | select(.name != "arm" and .status == "completed" and .conclusion == "success") | .name] as $passed
              | $required[]
              | select(($passed | index(.)) | not)
            ' "$check_runs_file")
            pending=$(
              {
                jq -r '
                  .check_runs[]
                  | select(.name != "arm")
                  | select(.status != "completed")
                  | "check-run:\(.name)=\(.status)"
                ' "$check_runs_file"
                jq -r '
                  .statuses[]?
                  | select(.state == "pending")
                  | "status:\(.context)=\(.state)"
                ' "$statuses_file"
              } | sed '/^$/d'
            )

            if [[ -z "$missing_required" && -z "$pending" ]]; then
              stable_green=$((stable_green + 1))
              echo "green poll $stable_green/2 for PR #$PR_NUMBER ($reason)"
              if (( stable_green >= 2 )); then
                gh pr merge "$PR_NUMBER" --repo "$REPO" --squash --delete-branch
                echo "merged after all observed checks were green: $reason"
                exit 0
              fi
            else
              stable_green=0
              [[ -n "$missing_required" ]] && printf 'waiting for required checks:\n%s\n' "$missing_required"
              [[ -n "$pending" ]] && printf 'waiting for pending checks:\n%s\n' "$pending"
            fi

            sleep "$interval_seconds"
          done

          echo "timed out waiting for green checks on PR #$PR_NUMBER"
          exit 1
AUTOMERGE_EOF


read -r -d '' CODEOWNERS_TEMPLATE_HERESTRING <<'CODEOWN_EOF' || true
# Default code owners for all files.
* @{{AUTHOR_HANDLE}}
CODEOWN_EOF

read -r -d '' EDITORCONFIG_TEMPLATE_HERESTRING <<'EDITORCFG_EOF' || true
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.{md,markdown}]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab

[*.{py,go}]
indent_size = 4
EDITORCFG_EOF

read -r -d '' GITATTRIBUTES_TEMPLATE_HERESTRING <<'GITATTR_EOF' || true
* text=auto

*.sh text eol=lf
*.bash text eol=lf
*.py text eol=lf
*.js text eol=lf
*.mjs text eol=lf
*.ts text eol=lf
*.json text eol=lf
*.yml text eol=lf
*.yaml text eol=lf
*.md text eol=lf

*.ps1 text eol=lf
*.bat text eol=crlf
*.cmd text eol=crlf

*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.pdf binary
*.zip binary
*.7z binary
*.exe binary
*.dll binary
GITATTR_EOF

# Centralized agent settings — source of truth lives at ~/.agents/settings/.
read -r -d '' AGENTS_CLAUDE_SETTINGS_JSON_TEMPLATE <<'AGT_CLAUDE_EOF' || true
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "permissions": {
    "defaultMode": "acceptEdits",
    "skipDangerousModePermissionPrompt": true
  },
  "autoUpdatesChannel": "latest",
  "editorMode": "normal",
  "preferredNotifChannel": "auto",
  "forceLoginMethod": "claudeai"
}
AGT_CLAUDE_EOF

read -r -d '' AGENTS_GEMINI_SETTINGS_JSON_TEMPLATE <<'AGT_GEMINI_EOF' || true
{
  "security": {
    "auth": {
      "selectedType": "oauth-personal"
    }
  },
  "tools": {
    "shell": {
      "skipConfirmation": true,
      "inactivityTimeout": 5
    }
  }
}
AGT_GEMINI_EOF

read -r -d '' AGENTS_CODEX_CONFIG_TOML_TEMPLATE <<'AGT_CODEX_EOF' || true
personality = "pragmatic"
approval_policy = "never"
sandbox_mode = "danger-full-access"
model_reasoning_effort = "high"

[features]
hooks = true

[tui]
status_line = ["model-with-reasoning", "run-state", "context-remaining", "git-branch", "current-dir"]
status_line_use_colors = true

[[hooks.UserPromptSubmit]]

[[hooks.UserPromptSubmit.hooks]]
type = "command"
command = "$HOME/.dotfiles/.agents/src-skills/composio-auth/hook-prepend-pending.sh"

[[hooks.UserPromptSubmit.hooks]]
type = "command"
command = "$HOME/.dotfiles/scripts/bin/symphony-pending-hook.sh"
AGT_CODEX_EOF

read -r -d '' VHS_CASSETTE_TAPE_TEMPLATE_HERESTRING <<'TAPE_EOF' || true
# demo/cassette.tape — VHS recording script (https://github.com/charmbracelet/vhs)
# Edit this with the actual demo flow for {{PROJECT_NAME}}.

Output demo/cassette.gif

Set FontSize 18
Set Width 1200
Set Height 720
Set Padding 20
Set Theme "Catppuccin Frappé"

Type "echo 'Replace this with a real demo of {{PROJECT_NAME}}'"
Enter
Sleep 2s
TAPE_EOF

read -r -d '' HERO_SCRIPT_HERESTRING <<'HERO_EOF' || true
#!/usr/bin/env bash
# hero.sh — render demo/cassette.tape via VHS in Docker, optimize for web.
# stdout: nothing meaningful. stderr: ECS jsonl events.
# Env: DOTFILES_BOOTSTRAP_RUN_ID (inherited if invoked via dotfiles.sh).
set -euo pipefail
          export PUPPETEER_SKIP_DOWNLOAD=true
          export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
HEROSH_RUN_ID=${DOTFILES_BOOTSTRAP_RUN_ID:-$(uuidgen 2>/dev/null||printf '%s-%s' "$(date +%s%N)" "$RANDOM")}
HEROSH_SERVICE_NAME=hero-renderer
HEROSH_EVENT_SEQUENCE=0
emitEcsEventOnStderr(){ local lvl=$1 act=$2 out=$3 err=${4:-} detail=${5:-} ts
  HEROSH_EVENT_SEQUENCE=$((HEROSH_EVENT_SEQUENCE+1))
  ts=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)
  jq -nc --arg ts "$ts" --arg l "$lvl" --arg a "$act" --arg o "$out" --arg svc "$HEROSH_SERVICE_NAME" --arg e "$err" --arg detail "$detail" --arg trace "$HEROSH_RUN_ID" --arg eid "${HEROSH_RUN_ID}-${HEROSH_EVENT_SEQUENCE}" '{"@timestamp":$ts,"log.level":$l,"event.action":$a,"event.outcome":$o,"event.id":$eid,"trace.id":$trace,"service.name":$svc,"labels":{"detail":$detail}}+(if $e=="" then {} else {"error.message":$e} end)' >&2;}
tapeFilePath=${1:-demo/cassette.tape}
[[ -f $tapeFilePath ]]||{ emitEcsEventOnStderr error hero.tape-missing failure "tape not found: $tapeFilePath";exit 1;}
emitEcsEventOnStderr info hero.start success '' "tape=$tapeFilePath"
mkdir -p demo
docker run --rm --user "$(id -u):$(id -g)" -v "$PWD:/vhs" ghcr.io/charmbracelet/vhs "$tapeFilePath"||{ emitEcsEventOnStderr error hero.vhs-failed failure 'vhs render exited nonzero';exit 1;}
rawRenderedGif=demo/cassette.gif
[[ -f $rawRenderedGif ]]||{ emitEcsEventOnStderr error hero.no-gif failure "vhs produced no $rawRenderedGif";exit 1;}
ffmpeg -y -i "$rawRenderedGif" -vf "fps=10,scale=720:-1:flags=lanczos" -loop 0 demo/hero.gif 2>/dev/null||{ emitEcsEventOnStderr error hero.ffmpeg-gif-failed failure 'ffmpeg gif optimization failed';exit 1;}
ffmpeg -y -i "$rawRenderedGif" -vcodec libwebp -lossless 0 -q:v 70 -loop 0 -an demo/hero.webp 2>/dev/null||{ emitEcsEventOnStderr error hero.ffmpeg-webp-failed failure 'ffmpeg webp encoding failed';exit 1;}
gifByteSize=$(stat -c%s demo/hero.gif 2>/dev/null||stat -f%z demo/hero.gif)
webpByteSize=$(stat -c%s demo/hero.webp 2>/dev/null||stat -f%z demo/hero.webp)
emitEcsEventOnStderr info hero.complete success '' "gif=${gifByteSize}b webp=${webpByteSize}b"
((gifByteSize>5242880))&&emitEcsEventOnStderr warn hero.gif-oversize failure '' "gif=${gifByteSize}b limit=5MB"||:
HERO_EOF

# Generic placeholder substitution via bash parameter expansion (safe for & | $ etc)
substituteTemplatePlaceholders(){ local renderedTemplate=$1;shift
  while (($#>=2));do renderedTemplate=${renderedTemplate//"{{$1}}"/$2};shift 2;done
  printf '%s' "$renderedTemplate";}

archiveExistingPathToProjectOld(){ local absolutePath=$1 logTaskName=${2:-archive} timestamp archiveRelPath archivePath archiveRoot counter
  [[ -e $absolutePath || -L $absolutePath ]]||return 0
  case "$absolutePath" in
    "$REPO_ROOT"/old|"$REPO_ROOT"/old/*) return 0;;
    "$REPO_ROOT"/*) archiveRelPath=${absolutePath#"$REPO_ROOT"/};;
    *) archiveRelPath="external/${absolutePath#/}";;
  esac
  timestamp=$(date +%Y%m%d%H%M%S)
  archiveRoot="$REPO_ROOT/old/$timestamp"
  archivePath="$archiveRoot/$archiveRelPath"
  counter=1
  while [[ -e $archivePath || -L $archivePath ]];do
    archivePath="$archiveRoot/$archiveRelPath.$counter"
    counter=$((counter+1))
  done
  mkdir -p "$(dirname "$archivePath")" 2>/dev/null||return 1
  mv "$absolutePath" "$archivePath" 2>/dev/null||return 1
  emitEcsLogEvent info task.archive success "$logTaskName" 0 '' '' "moved existing path to ${archivePath#$REPO_ROOT/}"
  printf '%s' "$archivePath"
}

projectAgentFilePointsToAgents(){ local candidatePath=$1 linkTarget
  [[ -L $candidatePath ]]||return 1
  linkTarget=$(readlink "$candidatePath")
  [[ $linkTarget == AGENTS.md || $linkTarget == "$REPO_ROOT/AGENTS.md" ]]
}

ensureProjectAgentsFileExists(){ local agentsPath=$REPO_ROOT/AGENTS.md archivePath
  if [[ -L $agentsPath && ! -e $agentsPath ]];then
    archivePath=$(archiveExistingPathToProjectOld "$agentsPath" project-agents)||return 1
    emitEcsLogEvent warn task.scaffold success project-agents 0 '' '' "archived broken AGENTS.md symlink -> ${archivePath#$REPO_ROOT/}"
  elif [[ -d $agentsPath && ! -L $agentsPath ]];then
    archivePath=$(archiveExistingPathToProjectOld "$agentsPath" project-agents)||return 1
    emitEcsLogEvent warn task.scaffold success project-agents 0 '' '' "archived directory AGENTS.md -> ${archivePath#$REPO_ROOT/}"
  fi
  if [[ ! -e $agentsPath && ! -L $agentsPath ]];then
    printf '# Project Agent Instructions\n' > "$agentsPath"||return 1
    emitEcsLogEvent info task.scaffold success project-agents 0 '' '' "created AGENTS.md"
  fi
}

appendProjectInstructionFileIntoAgents(){ local sourcePath=$1 sourceLabel=$2 agentsPath=$REPO_ROOT/AGENTS.md sourceSha agentsSha startMarker endMarker
  projectAgentFilePointsToAgents "$sourcePath"&&return 0
  [[ -f $sourcePath ]]||return 0
  ensureProjectAgentsFileExists||return 1
  sourceSha=$(sha256sum "$sourcePath"|cut -d' ' -f1)
  # Byte-identical short-circuit: when the source CLAUDE.md/GEMINI.md is
  # byte-for-byte equal to AGENTS.md (e.g., projects that hand-duplicated
  # CLAUDE.md from AGENTS.md), appending would duplicate the entire file
  # inside AGENTS.md. The caller (`normalizeProjectAgentInstructionFiles`)
  # archives the source and symlinks afterwards, which still produces the
  # right end state — we just skip the append step here.
  agentsSha=$(sha256sum "$agentsPath"|cut -d' ' -f1)
  if [[ -n $sourceSha && $sourceSha == "$agentsSha" ]];then
    emitEcsLogEvent info task.scaffold success project-agents 0 '' '' "$sourceLabel byte-identical to AGENTS.md; skipping append (will be replaced with symlink)"
    return 0
  fi
  startMarker="<!-- dotfiles-import: ${sourceLabel} sha256:${sourceSha} -->"
  endMarker="<!-- /dotfiles-import: ${sourceLabel} sha256:${sourceSha} -->"
  if grep -Fq "$startMarker" "$agentsPath" 2>/dev/null;then
    emitEcsLogEvent info task.scaffold success project-agents 0 '' '' "$sourceLabel already imported into AGENTS.md"
    return 0
  fi
  {
    printf '\n\n%s\n' "$startMarker"
    cat "$sourcePath"
    printf '\n%s\n' "$endMarker"
  } >> "$agentsPath"||return 1
  emitEcsLogEvent info task.scaffold success project-agents 0 '' '' "appended $sourceLabel into AGENTS.md sha256=$sourceSha"
}

normalizeProjectAgentInstructionFiles(){ local agentsPath=$REPO_ROOT/AGENTS.md claudePath=$REPO_ROOT/CLAUDE.md geminiPath=$REPO_ROOT/GEMINI.md archivePath
  [[ -e $agentsPath || -L $agentsPath || -e $claudePath || -L $claudePath || -e $geminiPath || -L $geminiPath ]]||{
    emitEcsLogEvent info task.scaffold success project-agents 0 '' '' "no project-root agent instructions"
    return 0
  }
  if [[ -e $geminiPath || -L $geminiPath ]];then
    appendProjectInstructionFileIntoAgents "$geminiPath" GEMINI.md||return 1
    archivePath=$(archiveExistingPathToProjectOld "$geminiPath" project-agents)||return 1
    emitEcsLogEvent info task.scaffold success project-agents 0 '' '' "removed GEMINI.md after import old=${archivePath#$REPO_ROOT/}"
  fi
  if [[ -e $claudePath || -L $claudePath ]];then
    if projectAgentFilePointsToAgents "$claudePath";then
      emitEcsLogEvent info task.scaffold success project-agents 0 '' '' "CLAUDE.md already points to AGENTS.md"
    else
      appendProjectInstructionFileIntoAgents "$claudePath" CLAUDE.md||return 1
      archivePath=$(archiveExistingPathToProjectOld "$claudePath" project-agents)||return 1
      emitEcsLogEvent info task.scaffold success project-agents 0 '' '' "archived CLAUDE.md before symlink old=${archivePath#$REPO_ROOT/}"
    fi
  fi
  if [[ -e $agentsPath || -L $agentsPath ]];then
    if ! projectAgentFilePointsToAgents "$claudePath";then
      rm -f "$claudePath" 2>/dev/null||true
      ln -s AGENTS.md "$claudePath" 2>/dev/null||return 1
      emitEcsLogEvent info task.scaffold success project-agents 0 '' '' "symlinked CLAUDE.md -> AGENTS.md"
    fi
  fi
}

writeArtifactToDiskAndRecord(){ local relativeArtifactPath=$1 contentBody=$2 logTaskName=${3:-$1} absoluteArtifactPath previousSha256='' newSha256 tempPath archivePath
  absoluteArtifactPath=$REPO_ROOT/$relativeArtifactPath
  contentBody=$(normalizeGeneratedArtifactContent "$relativeArtifactPath" "$contentBody")
  [[ -f $absoluteArtifactPath && ! -L $absoluteArtifactPath ]]&&previousSha256=$(sha256sum "$absoluteArtifactPath"|cut -d' ' -f1)
  # Compute target sha BEFORE writing so we can short-circuit when content is unchanged.
  # printf '%s\n' is what the actual write does; hashing the same shape keeps comparison exact.
  newSha256=$(printf '%s\n' "$contentBody"|sha256sum|cut -d' ' -f1)
  if [[ -f $absoluteArtifactPath && -n $previousSha256 && $previousSha256 == "$newSha256" ]];then
    appendTaskStatusRecordToState "$logTaskName" ok "$newSha256"
    emitEcsLogEvent info task.write success "$logTaskName" 0 '' '' "noop-skipped sha256=$newSha256"
    DOTFILES_RUN_SUCCESS_TASKS+=("$logTaskName")
    return 0
  fi
  mkdir -p "$(dirname "$absoluteArtifactPath")" 2>/dev/null||:
  tempPath=$(mktemp --suffix=".${relativeArtifactPath##*.}" 2>/dev/null||mktemp)
  printf '%s\n' "$contentBody" > "$tempPath" 2>/dev/null||{ emitEcsLogEvent error task.write failure "$logTaskName" 0 '' '' 'temp write failed';rm -f "$tempPath" 2>/dev/null||true;appendTaskStatusRecordToState "$logTaskName" failed;DOTFILES_RUN_FAILED_TASKS+=("$logTaskName");return 1;}
  validateGeneratedArtifactByExtension "$tempPath"||{ rm -f "$tempPath" 2>/dev/null||true;failFatallyAndExit "$logTaskName" "validate failed"; }
  if ! archivePath=$(archiveExistingPathToProjectOld "$absoluteArtifactPath" "$logTaskName");then
    rm -f "$tempPath" 2>/dev/null||true
    emitEcsLogEvent error task.write failure "$logTaskName" 0 '' '' 'archive old path failed'
    appendTaskStatusRecordToState "$logTaskName" failed
    DOTFILES_RUN_FAILED_TASKS+=("$logTaskName")
    return 1
  fi
  if ! mv "$tempPath" "$absoluteArtifactPath" 2>/dev/null;then
    [[ -n $archivePath ]]&&{ mkdir -p "$(dirname "$absoluteArtifactPath")" 2>/dev/null||true;mv "$archivePath" "$absoluteArtifactPath" 2>/dev/null||true; }
    rm -f "$tempPath" 2>/dev/null||true
    emitEcsLogEvent error task.write failure "$logTaskName" 0 '' '' 'write failed'
    appendTaskStatusRecordToState "$logTaskName" failed
    DOTFILES_RUN_FAILED_TASKS+=("$logTaskName")
    return 1
  fi
  appendTaskStatusRecordToState "$logTaskName" ok "$newSha256"
  if [[ -z $previousSha256 ]];then emitEcsLogEvent info task.write success "$logTaskName" 0 '' '' "created sha256=$newSha256"
  else emitEcsLogEvent info task.write success "$logTaskName" 0 '' '' "overwrote prev_sha256=$previousSha256 new_sha256=$newSha256 old=${archivePath#$REPO_ROOT/}";fi
  DOTFILES_RUN_SUCCESS_TASKS+=("$logTaskName");}

resolveAuthorNameWithFallback(){ local authorName
  authorName=$(readFieldFromAssessmentFile git.userName)
  [[ -z $authorName ]]&&authorName=$(readFieldFromAssessmentFile authorHandle)
  [[ -z $authorName ]]&&authorName="$(readFieldFromAssessmentFile projectName) maintainers"
  printf '%s' "$authorName";}

resolveAuthorEmailWithFallback(){ local authorEmail
  authorEmail=$(readFieldFromAssessmentFile git.userEmail)
  [[ -z $authorEmail ]]&&authorEmail='the maintainers via GitHub'
  printf '%s' "$authorEmail";}

resolveRepoUrlWithFallback(){ local repoUrl handle name
  repoUrl=$(readFieldFromAssessmentFile repoUrl)
  [[ -n $repoUrl ]]&&{ printf '%s' "$repoUrl";return;}
  handle=$(readFieldFromAssessmentFile authorHandle);name=$(readFieldFromAssessmentFile projectName)
  [[ -n $handle && -n $name ]]&&printf 'https://github.com/%s/%s' "$handle" "$name"||printf 'https://example.com/REPO_URL_NOT_DETECTED';}

writeArtifactLicense(){ local renderedContent
  renderedContent=$(substituteTemplatePlaceholders "$MIT_LICENSE_TEMPLATE_HERESTRING" YEAR "$(readFieldFromAssessmentFile year)" AUTHOR_NAME "$(resolveAuthorNameWithFallback)")
  writeArtifactToDiskAndRecord LICENSE "$renderedContent";}

writeArtifactCodeOfConduct(){ local renderedContent
  renderedContent=$(substituteTemplatePlaceholders "$CODE_OF_CONDUCT_TEMPLATE_HERESTRING" AUTHOR_EMAIL "$(resolveAuthorEmailWithFallback)")
  writeArtifactToDiskAndRecord CODE_OF_CONDUCT.md "$renderedContent";}

appendDependabotEcosystemBlock(){ local ecosystem=$1 directory=$2 prefix=$3 groupName
  groupName=$(printf '%s' "${ecosystem}-${directory#/}"|tr '/.' '--'|tr -cs '[:alnum:]_-' '-')
  cat <<DEPENDABOT_BLOCK_EOF
  - package-ecosystem: "$ecosystem"
    directory: "$directory"
    schedule:
      interval: "weekly"
      day: "monday"
    cooldown:
      default-days: 7
      semver-major-days: 30
      semver-minor-days: 7
      semver-patch-days: 3
    open-pull-requests-limit: 3
    labels:
      - "dependencies"
    commit-message:
      prefix: "$prefix"
      include: "scope"
    groups:
      ${groupName}-minor-patch:
        patterns: ["*"]
        update-types: ["minor", "patch"]
DEPENDABOT_BLOCK_EOF
}

normalizeDependabotDirectoryFromPath(){ local filePath=$1 dirPath
  dirPath=$(dirname "$filePath")
  [[ $dirPath == "." ]]&&printf '/'||printf '/%s' "${dirPath#./}"
}

listDependabotManifestCandidates(){ local candidate base
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1;then
    git ls-files -z 2>/dev/null | while IFS= read -r -d '' candidate;do
      case "$candidate" in
        old/*|*/node_modules/*|*/vendor/*|*/deps/*) continue;;
      esac
      base=$(basename "$candidate")
      case "$base" in
        package.json) printf 'npm|%s\n' "$candidate";;
        requirements.txt|pyproject.toml|setup.py) printf 'pip|%s\n' "$candidate";;
        Cargo.toml) printf 'cargo|%s\n' "$candidate";;
        go.mod) printf 'gomod|%s\n' "$candidate";;
        Gemfile) printf 'bundler|%s\n' "$candidate";;
        composer.json) printf 'composer|%s\n' "$candidate";;
        mix.exs) printf 'mix|%s\n' "$candidate";;
        Dockerfile) printf 'docker|%s\n' "$candidate";;
      esac
    done
  else
    find . \
      \( -path './.git' -o -path './old' -o -path './node_modules' -o -path '*/node_modules' -o -path '*/vendor' -o -path '*/deps' \) -prune -o \
      \( -name package.json -printf 'npm|%p\n' \
      -o -name requirements.txt -printf 'pip|%p\n' \
      -o -name pyproject.toml -printf 'pip|%p\n' \
      -o -name setup.py -printf 'pip|%p\n' \
      -o -name Cargo.toml -printf 'cargo|%p\n' \
      -o -name go.mod -printf 'gomod|%p\n' \
      -o -name Gemfile -printf 'bundler|%p\n' \
      -o -name composer.json -printf 'composer|%p\n' \
      -o -name mix.exs -printf 'mix|%p\n' \
      -o -name Dockerfile -printf 'docker|%p\n' \) 2>/dev/null
  fi
}

writeArtifactDependabotConfig(){ local assembledContent manifest ecosystem directory key prefix
  assembledContent=$DEPENDABOT_YML_TEMPLATE_HERESTRING
  declare -A dependabotDirectoriesSeen=()
  while IFS='|' read -r ecosystem manifest;do
    [[ -n $ecosystem && -n $manifest ]]||continue
    directory=$(normalizeDependabotDirectoryFromPath "$manifest")
    key="${ecosystem}|${directory}"
    [[ -n ${dependabotDirectoriesSeen[$key]:-} ]]&&continue
    dependabotDirectoriesSeen[$key]=1
    case "$ecosystem" in
      github-actions) continue;;
      docker) prefix=deps;;
      *) prefix=deps;;
    esac
    assembledContent="${assembledContent}
$(appendDependabotEcosystemBlock "$ecosystem" "$directory" "$prefix")"
  done < <(listDependabotManifestCandidates | sort -u)
  writeArtifactToDiskAndRecord .github/dependabot.yml "$assembledContent";}

writeArtifactCiWorkflowYml(){
  writeArtifactToDiskAndRecord .github/workflows/ci.yml "$CI_WORKFLOW_YML_TEMPLATE_HERESTRING";}

writeArtifactYamllintConfig(){
  writeArtifactToDiskAndRecord .yamllint.yml "$YAMLLINT_YML_TEMPLATE_HERESTRING";}

writeArtifactFromDotfilesSource(){ local relativePath=$1 executable=${2:-0} sourcePath content
  sourcePath="$HOME/.dotfiles/$relativePath"
  if [[ -f $sourcePath ]];then
    content=$(<"$sourcePath")
    writeArtifactToDiskAndRecord "$relativePath" "$content" "$relativePath"||return 1
    if [[ $executable == 1 ]];then chmod +x "$REPO_ROOT/$relativePath";fi
    return 0
  fi
  if [[ -f $REPO_ROOT/$relativePath ]];then
    if [[ $executable == 1 ]];then chmod +x "$REPO_ROOT/$relativePath";fi
    emitEcsLogEvent info task.skip success "$relativePath" 0 '' '' "source already present in target repo"
    DOTFILES_RUN_SKIPPED_TASKS+=("$relativePath")
    return 0
  fi
  emitEcsLogEvent warn task.write failure "$relativePath" 0 '' '' "missing $sourcePath"
  DOTFILES_RUN_FAILED_TASKS+=("$relativePath")
  return 1;}


writeArtifactAutomergeWorkflow(){
  writeArtifactToDiskAndRecord .github/workflows/automerge.yml "$AUTOMERGE_WORKFLOW_YML_TEMPLATE_HERESTRING";}

writeArtifactGitAwesome(){
  writeArtifactFromDotfilesSource scripts/bin/git-awesome 1;}

writeArtifactCodeowners(){ local renderedContent authorHandle
  authorHandle=$(readFieldFromAssessmentFile authorHandle)
  [[ -z $authorHandle ]]&&{ emitEcsLogEvent info task.skip success .github/CODEOWNERS 0 '' '' "no author handle";DOTFILES_RUN_SKIPPED_TASKS+=(.github/CODEOWNERS);return 0;}
  renderedContent=$(substituteTemplatePlaceholders "$CODEOWNERS_TEMPLATE_HERESTRING" AUTHOR_HANDLE "$authorHandle")
  writeArtifactToDiskAndRecord .github/CODEOWNERS "$renderedContent";}

writeArtifactEditorConfig(){
  writeArtifactToDiskAndRecord .editorconfig "$EDITORCONFIG_TEMPLATE_HERESTRING";}

writeArtifactGitattributes(){
  writeArtifactToDiskAndRecord .gitattributes "$GITATTRIBUTES_TEMPLATE_HERESTRING";}

writeArtifactIssueTemplateConfig(){ local renderedContent
  renderedContent=$(substituteTemplatePlaceholders "$ISSUE_TEMPLATE_CONFIG_YML_HERESTRING" REPO_URL "$(resolveRepoUrlWithFallback)")
  writeArtifactToDiskAndRecord .github/ISSUE_TEMPLATE/config.yml "$renderedContent";}

writeArtifactCassetteTape(){ local renderedContent
  renderedContent=$(substituteTemplatePlaceholders "$VHS_CASSETTE_TAPE_TEMPLATE_HERESTRING" PROJECT_NAME "$(readFieldFromAssessmentFile projectName)")
  writeArtifactToDiskAndRecord demo/cassette.tape "$renderedContent";}

writeArtifactHeroScript(){
  writeArtifactToDiskAndRecord scripts/hero.sh "$HERO_SCRIPT_HERESTRING"
  chmod +x "$REPO_ROOT/scripts/hero.sh";}

writeArtifactAgentsMd(){
  local content='# Abstract Agent Imperatives

1. Never trust or tolerate errors; deeper truth must always be aggressively researched and addressed.
2. Architecture must be organically robust. Do not use brittle API key fallbacks when local environment context (CLI tokens, D-Bus) is natively available.
3. Strict determinism is required across programmatic JSON pipelines. Always use structured output bounding.
4. Pace intelligently. Assume rate limits are not model failures but pacing signals; back off exponentially.
5. The workspace boundary is absolute. Deployments must happen dynamically in the target directory, not a hardcoded artifact folder.
6. API-first, browser last. If a service exposes an API, MCP tool, or webhook, use it; reach for browser automation only when no programmatic surface exists, the platform itself blocks API onboarding, or a visual artifact is the deliverable. Cloud-managed sources of truth (n8n, ElevenLabs, Twilio Studio, Zapier, Make) own their own state — do not mirror their config to local JSON files except under explicit `templates/`, `fixtures/`, or `archived_` paths.
7. No always-on banner injection. Hooks and prompt-injectors must be conditional, not ambient. A hook that fires on every prompt or every session-start with the same static reminder text is banner spam — it desensitizes agents to real signals and burns context. If guidance is always-true, put it in `AGENTS.md` or `CLAUDE.md` once; if it is situational, gate the injection on a detected condition.
8. Git protection is local-only via autostash. The cron `*/15 * * * * ~/.dotfiles/scripts/bin/git-awesome sync` runs `git stash push -u -m "git-awesome/<uuid>/<base>/<ts>"` and writes per-repo runtime artifacts under `<repo>/.artifacts/git-awesome/` (events ledger `events.<yyyy-mm-dd>.jsonl` ECS-shaped JSONL; flat `stash.<uuid>.patch` archive; `baseline.<session>.tsv`). No remote refs are created, no hostname leaks, no PRs are opened by autosync. Integration to main is your normal commit + push. To pause: `crontab -e` and comment the line.
9. Greenfield development: All projects are greenfield, so attempts to upgrade that cause regressions by mistake are allowed. Unit tests and tracing development per jsonl skill are still always required in parallel for all features, outcomes, and data flows. And the next best test is to ship it and run the integration test as a whole and take the perspective of user by understanding what is their expected sensory outcome, and leveraging AI modality whether its local LLM for text and UI screenshots, or a blind test voice ai agent recipient for audio, or whatever modality best simulates user experience. But the truest test is to allow scream test from actual pilot users (usually me the developer) AFTER tracing the experience simulation to avoid wasting development time backtracking to fix for something that should have surfaced in trace.

## UI / Design — see and customize `.agents/DESIGN.md`

For ALL UI/UX work in this project, the canonical source of design decisions is
`.agents/DESIGN.md`. Read it before writing markup, styles, copy, or interaction
flows; update it whenever you make a design call worth preserving. This file
(AGENTS.md) sets the agent posture; DESIGN.md sets the visual + UX contract.'
  writeArtifactToDiskAndRecord .agents/AGENTS.md "$content";}

writeArtifactDesignMd(){
  writeArtifactToDiskAndRecord .agents/DESIGN.md "$DESIGN_MD_TEMPLATE_HERESTRING";}

# Idempotently symlinks the canonical brand DESIGN.md (Wranngle design-system
# source of truth) from the dotfiles source repo into ~/.agents/DESIGN.md. The
# host-level ~/.agents/ directory is the central source of truth at runtime
# (mirrors the skill-deploy pattern: source-in-dotfiles → ~/.agents/ → consumers).
# Source: ~/.dotfiles/.agents/wranngle-DESIGN.md (full brand canonical, includes
# component-showcase appendices). Symlink lets edits at either path propagate.
ensureBrandDesignDocSymlinkInAgentsHome(){
  local src=$HOME/.dotfiles/.agents/wranngle-DESIGN.md dst=$HOME/.agents/DESIGN.md archivePath
  [[ "$REPO_ROOT" == "$HOME/.dotfiles" ]]||{ emitEcsLogEvent info brand_design_doc.skip success brand_design_doc 0 '' '' "REPO_ROOT=$REPO_ROOT not host dotfiles"; return 0; }
  if [[ ! -f $src ]];then
    emitEcsLogEvent error brand_design_doc.deploy failure brand_design_doc 0 '' '' "canonical source missing at $src"
    DOTFILES_RUN_FAILED_TASKS+=(brand_design_doc)
    return 1
  fi
  mkdir -p "$HOME/.agents" 2>/dev/null||true
  if [[ -L $dst && $(readlink "$dst" 2>/dev/null||printf '') == "$src" ]];then
    emitEcsLogEvent info brand_design_doc.skip success brand_design_doc 0 '' '' "symlink $dst -> $src already in place"
    DOTFILES_RUN_SKIPPED_TASKS+=(brand_design_doc)
    return 0
  fi
  if [[ -e $dst || -L $dst ]];then
    archivePath=$(archiveExistingPathToProjectOld "$dst" brand_design_doc)||{ emitEcsLogEvent warn brand_design_doc.archive failure brand_design_doc 0 '' '' "could not archive existing $dst";return 1; }
    emitEcsLogEvent info brand_design_doc.archive success brand_design_doc 0 '' '' "archived $dst -> ${archivePath#$REPO_ROOT/}"
  fi
  ln -s "$src" "$dst" 2>/dev/null||{ emitEcsLogEvent error brand_design_doc.deploy failure brand_design_doc 0 '' '' "ln -s $src $dst failed"; DOTFILES_RUN_FAILED_TASKS+=(brand_design_doc); return 1; }
  emitEcsLogEvent info brand_design_doc.deploy success brand_design_doc 0 '' '' "symlinked $dst -> $src"
  DOTFILES_RUN_SUCCESS_TASKS+=(brand_design_doc)
}

# Deploys the canonical brand DESIGN.md from ~/.agents/DESIGN.md (which is itself
# symlinked from the dotfiles source via ensureBrandDesignDocSymlinkInAgentsHome)
# into ${REPO_ROOT}/DESIGN.md for any consumer repo. Survives operator edits:
# only writes when the target is absent. Idempotent: re-running on a repo where
# DESIGN.md already exists is a no-op. The `-ef` check short-circuits if the
# source resolves (through the symlink) to the same inode as the target.
installCanonicalDesignDocAtRepoRoot(){
  local sourceDesignDocPath=$HOME/.agents/DESIGN.md repoFallbackDesignDocPath=$REPO_ROOT/.agents/DESIGN.md targetDesignDocPath=$REPO_ROOT/DESIGN.md
  if [[ -f $targetDesignDocPath ]];then
    emitEcsLogEvent info dotfiles.design_doc.deploy unknown DESIGN.md 0 '' '' "already present at $targetDesignDocPath; preserved (operator may have customized)"
    DOTFILES_RUN_SKIPPED_TASKS+=(DESIGN.md)
    return 0
  fi
  if [[ ! -f $sourceDesignDocPath && -f $repoFallbackDesignDocPath ]];then
    sourceDesignDocPath=$repoFallbackDesignDocPath
  fi
  if [[ ! -f $sourceDesignDocPath ]];then
    emitEcsLogEvent warn dotfiles.design_doc.deploy success DESIGN.md 0 '' '' "no design source available; skipped root DESIGN.md"
    DOTFILES_RUN_SKIPPED_TASKS+=(DESIGN.md)
    return 0
  fi
  if [[ $sourceDesignDocPath -ef $targetDesignDocPath ]];then
    emitEcsLogEvent info dotfiles.design_doc.deploy unknown DESIGN.md 0 '' '' "source resolves to target ($targetDesignDocPath); no copy needed"
    DOTFILES_RUN_SKIPPED_TASKS+=(DESIGN.md)
    return 0
  fi
  if cp -- "$sourceDesignDocPath" "$targetDesignDocPath" 2>/dev/null;then
    emitEcsLogEvent info dotfiles.design_doc.deploy success DESIGN.md 0 '' '' "copied $sourceDesignDocPath -> $targetDesignDocPath"
    DOTFILES_RUN_SUCCESS_TASKS+=(DESIGN.md)
    return 0
  fi
  emitEcsLogEvent error dotfiles.design_doc.deploy failure DESIGN.md 0 '' '' "cp $sourceDesignDocPath -> $targetDesignDocPath failed"
  DOTFILES_RUN_FAILED_TASKS+=(DESIGN.md)
  return 1
}

mapDetectedLanguageToGitignoreTemplateName(){ case "$1" in
  python) echo Python;;javascript|typescript) echo Node;;rust) echo Rust;;go) echo Go;;
  ruby) echo Ruby;;java) echo Java;;php) echo Composer;;swift) echo Swift;;
  elixir) echo Elixir;;*) echo NONE;;
esac;}

GITIGNORE_MANAGED_START_MARKER='# >>> dotfiles-managed gitignore (do not edit between markers) >>>'
GITIGNORE_MANAGED_END_MARKER='# <<< dotfiles-managed gitignore <<<'
GITIGNORE_TEMPLATE_CACHE_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/dotfiles/gitignore-templates"

buildUniversalGitignoreBaseline(){ cat <<'GITIGNORE_BASELINE_EOF'
# OS
.DS_Store
Thumbs.db
desktop.ini

# Editors / IDEs
.idea/
.vscode/
.cursor/
.zed/
*.swp
*.swo
*~

# Secrets
.env
.env.*
!.env.example
!.env.template
*.pem
*.key

# Agent / AI scratch
.claude/
.codex/
.gemini/
.symphony/
.assessment.cache
.work/attempts/
openspec/
.claude/commands/openspec/
.gemini/commands/openspec/
.agent-runs/
/worked/
.autosync/

# Local integrations
.mcp.json
mcp-server-config.json

# E2E Test & Browser Artifacts
playwright-report/
playwright-console-report/
test-results/
test-results-console/
screenshot-*.png
screenshot-*.jpg

# Output & Media Generation
/output/
/output_test/
/exports/
/raw/

# Crash dumps & cores
*.dump
*.core
core.*
*.heapsnapshot
hs_err_pid*.log
erl_crash.dump

# Logs
logs/*
!logs/.gitkeep
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Generic build/cache/scratch
.cache/
tmp/
temp/
old/

# Dotfiles-tooling runtime artifacts (canonical: <repo>/.artifacts/<system>/<key>.<ext>)
.artifacts/
GITIGNORE_BASELINE_EOF
}

fetchGitignoreTemplateContent(){ local templateName=$1 cachePath
  [[ -z $templateName || $templateName == NONE ]]&&return 1
  cachePath="$GITIGNORE_TEMPLATE_CACHE_DIR/${templateName}.gitignore"
  # Cache hit, no forced refresh: pin content for byte-stable idempotency.
  if [[ -z ${DOTFILES_GITIGNORE_REFRESH:-} && -s $cachePath ]];then cat "$cachePath";return 0;fi
  mkdir -p "$GITIGNORE_TEMPLATE_CACHE_DIR" 2>/dev/null||return 1
  if curl -fsSL --max-time 10 "https://raw.githubusercontent.com/github/gitignore/main/${templateName}.gitignore" -o "$cachePath.tmp" 2>/dev/null;then
    mv "$cachePath.tmp" "$cachePath" 2>/dev/null||{ rm -f "$cachePath.tmp" 2>/dev/null;return 1;}
    cat "$cachePath";return 0
  fi
  rm -f "$cachePath.tmp" 2>/dev/null||true
  # Network failed; serve stale cache if present (still deterministic byte-for-byte).
  [[ -s $cachePath ]]&&{ cat "$cachePath";return 0;}
  return 1;}

writeArtifactGitignore(){ local language templateName universalBaseline languageLayer managedBlock existingContent finalContent
  if [[ $(basename "$REPO_ROOT") == ".dotfiles" ]];then
    writeArtifactToDiskAndRecord .gitignore "*
!*/
!.dotfiles.sh
!.gitattributes
!.gitignore
!.yamllint.yml
!AGENTS.md
!CLAUDE.md
!DESIGN.md
!schemas/
!schemas/**
!scripts/bin/git-awesome
!scripts/bin/edge-cdp-launch.ps1
!scripts/bin/edge-cdp-wrapper.sh
!scripts/bin/edge-cdp-wsl-proxy.mjs
!scripts/bin/pinchtab-edge-main.sh
!.github/dependabot.yml
!.github/ISSUE_TEMPLATE/
!.github/ISSUE_TEMPLATE/**
!.github/workflows/ci.yml
!.github/workflows/automerge.yml
!.github/workflows/security.yml
!.github/workflows/issue-triage.yml
!.github/workflows/pr-link-check.yml
!.github/workflows/gitleaks.yml
!tests/
!tests/**
!.github/CODEOWNERS
!.gitleaks.toml
!.github/PULL_REQUEST_TEMPLATE.md
!CODE_OF_CONDUCT.md
!scripts/hero.sh
!demo/
!demo/cassette.tape
!docs/git-autosync.md
!docs/universal-git-agent-spec.md
!docs/browser-automation.md
!logs/.gitkeep
!.agents/AGENTS.md
!.agents/DESIGN.md
!.agents/skills/**
!.agents/skills/**/**
!scripts/bin/composio-orch
!scripts/bin/composio-gc-daemon.sh
!scripts/bin/composio-webhook-tunnel.sh
!scripts/bin/composio-orch-smoke.sh
!scripts/bin/dotfiles-skills-sync
!lib/composio-orchestrator/package.json
!lib/composio-orchestrator/package-lock.json
!lib/composio-orchestrator/tsconfig.json
!lib/composio-orchestrator/vitest.config.ts
!lib/composio-orchestrator/README.md
!lib/composio-orchestrator/src/**
!lib/composio-orchestrator/bin/**
!lib/composio-orchestrator/daemon/**
!lib/composio-orchestrator/test/**
lib/composio-orchestrator/node_modules/
lib/composio-orchestrator/dist/

# Symphony orchestrator (Elixir/OTP). Same pattern as composio: source +
# lockfile + license tracked, build artifacts ignored.
!lib/symphony-elixir/mix.exs
!lib/symphony-elixir/mix.lock
!lib/symphony-elixir/.formatter.exs
!lib/symphony-elixir/README.md
!lib/symphony-elixir/LICENSE-APACHE-2.0
!lib/symphony-elixir/NOTICE
!lib/symphony-elixir/lib/**
!lib/symphony-elixir/test/**
!lib/symphony-elixir/config/**
!lib/symphony-elixir/priv/**
!lib/symphony-elixir/docs/**
!lib/symphony-elixir/scripts/**
lib/symphony-elixir/_build/
lib/symphony-elixir/deps/
lib/symphony-elixir/cover/
lib/symphony-elixir/erl_crash.dump
lib/symphony-elixir/bin/symphony

# >>> dotfiles-managed gitignore (do not edit between markers) >>>
# Generated by .dotfiles.sh; edits between markers are overwritten on next deploy.
# Hand-edit OUTSIDE these markers for project-specific rules.

# OS
.DS_Store
Thumbs.db
desktop.ini
*:Zone.Identifier

# Editors / IDEs
.idea/
.vscode/
.cursor/
.zed/
*.swp
*.swo
*~

# Secrets
.env
.env.*
!.env.example
!.env.template
*.pem
*.key

# Agent / AI scratch
.claude/
.codex/
.gemini/
.symphony/
.assessment.cache
.work/attempts/
openspec/
.claude/commands/openspec/
.gemini/commands/openspec/
.agent-runs/
/worked/
.autosync/

# Local integrations
.mcp.json
mcp-server-config.json

# E2E Test & Browser Artifacts
playwright-report/
playwright-console-report/
test-results/
test-results-console/
screenshot-*.png
screenshot-*.jpg

# Output & Media Generation
/output/
/output_test/
/exports/
/raw/

# Crash dumps & cores
*.dump
*.core
core.*
*.heapsnapshot
hs_err_pid*.log
erl_crash.dump

# Logs
logs/*
!logs/.gitkeep
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Generic build/cache/scratch
.cache/
tmp/
temp/
old/

# Dotfiles-tooling runtime artifacts (canonical: <repo>/.artifacts/<system>/<key>.<ext>)
.artifacts/
# <<< dotfiles-managed gitignore <<<"
    return 0
  fi
  universalBaseline=$(buildUniversalGitignoreBaseline)
  language=$(readFieldFromAssessmentFile language)
  templateName=$(mapDetectedLanguageToGitignoreTemplateName "$language")
  languageLayer=$(fetchGitignoreTemplateContent "$templateName" 2>/dev/null||true)
  if [[ -n $languageLayer ]];then
    managedBlock="$GITIGNORE_MANAGED_START_MARKER
# Generated by .dotfiles.sh — edits between markers are overwritten on next deploy.
# Hand-edit OUTSIDE these markers for project-specific rules.
# Refresh language template: DOTFILES_GITIGNORE_REFRESH=1 ./.dotfiles.sh

$universalBaseline

# --- $templateName (github/gitignore) ---
$languageLayer
$GITIGNORE_MANAGED_END_MARKER"
  else
    managedBlock="$GITIGNORE_MANAGED_START_MARKER
# Generated by .dotfiles.sh — edits between markers are overwritten on next deploy.
# Hand-edit OUTSIDE these markers for project-specific rules.

$universalBaseline
$GITIGNORE_MANAGED_END_MARKER"
  fi
  if [[ -f $REPO_ROOT/.gitignore ]];then existingContent=$(<"$REPO_ROOT/.gitignore");else existingContent='';fi
  if [[ -n $existingContent ]] && grep -Fq "$GITIGNORE_MANAGED_START_MARKER" "$REPO_ROOT/.gitignore" 2>/dev/null;then
    # Splice managed block in place; preserve everything outside markers.
    finalContent=$(awk -v start="$GITIGNORE_MANAGED_START_MARKER" -v endm="$GITIGNORE_MANAGED_END_MARKER" -v block="$managedBlock" '
      BEGIN{ inblk=0; replaced=0 }
      $0 == start { inblk=1; if(!replaced){ print block; replaced=1 } next }
      $0 == endm  { inblk=0; next }
      !inblk      { print }
    ' "$REPO_ROOT/.gitignore")
  elif [[ -n $existingContent ]];then
    # Pre-existing user .gitignore without markers: preserve, append managed block.
    finalContent="$existingContent

$managedBlock"
  else
    finalContent="$managedBlock"
  fi
  writeArtifactToDiskAndRecord .gitignore "$finalContent";}

# ══ Pass 4: LLM-driven prose writers ════════════════════════════════════
read -r -d '' SYSTEM_PROMPT_FOR_CONTRIBUTING_MD <<'SP_EOF' || true
You are writing CONTRIBUTING.md for an open-source project.
Tone: warm, honest, brief. Match the project's README tone sample if shown in user prompt.
Output ONLY raw markdown content — no preamble, no code fences, no commentary.
SP_EOF

read -r -d '' SYSTEM_PROMPT_FOR_SECURITY_MD <<'SP_EOF' || true
You are writing SECURITY.md following GitHub's Private Vulnerability Reporting (PVR) pattern.
Tone: businesslike, brief. Personal/demo project — set realistic acknowledgement expectations.
The user prompt provides repo URL and contact email; use those exact values.
Output ONLY raw markdown — no preamble, no fences, no commentary.
SP_EOF

read -r -d '' SYSTEM_PROMPT_FOR_README_MD <<'SP_EOF' || true
You are writing or improving README.md for a wranngle personal-project repo.

VOICE
- Confident, warm, concrete. Present-tense, second-person.
- Lowercase tagline. Sentence case headers (## Quick start, not ## Quick Start).
- No exclamation points anywhere.
- Dry undertone allowed at most once per README, in the tagline or one aside.
- Tagline test: if you can swap the project name for any other tool and the sentence still works, rewrite it. Taglines must be NON-PORTABLE.

REQUIRED ORDER (omit a section only if its inputs are missing)
1. Hero <picture> block iff demo/hero-{light,dark}.webp both exist
2. # H1 (project name)
3. > Quoted elevator pitch — one continuous Markdown blockquote (every line `> ` prefixed):
   - Sentence 1 = the non-portable tagline. Lowercase first letter. <=100 chars. Period optional.
   - Tagline-swap test still applies: if you can swap the project name for any other tool and the sentence still works, rewrite it.
   - Then 1-2 follow-on sentences (each starting capitalized, ending with a period). Total pitch body 25-60 words across 2-3 sentences. A blank `>` line between the tagline and the body is allowed if the tagline reads as a separate beat; not required.
   - The body MUST add information the tagline cannot carry: WHO it is for, deployment shape, or a constraint that prevents misuse. Restating the tagline in more words FAILS.
   - The body MUST contain at least one proper noun unique to this repo: a file path, command name, dependency, runtime, deployment target, or environment variable. Generic claims ("modular, extensible, easy to use") FAIL.
   - Portability test: strike the tagline, re-read the body alone. If the remaining sentences could describe any other tool in the same category, rewrite with at least one concrete noun.
   - Plain prose. No bullets, no bold, no exclamation, no em-dashes/en-dashes as sentence connectors. The global HARD-NO vocabulary list below applies in full.
4. Badge row: render EXACTLY the badges in `recommendedBadges`. No others. Single row. Flat style.
5. > [!NOTE] callout: render the canonical projectStatus phrasing VERBATIM. Optional second sentence from projectStatusUsagePhrase if provided.
6. ## Quick start: git clone + cd + installCommand fenced bash
7. ## What it does: 2-4 sentences. What & why. NO history, NO refactor lineage, NO migration prose.
8. ## Usage: minimal runnable example
9. ## License: link to LICENSE
10. (optional) ## Maintained via dotfiles: only if dotfiles-context flag set

HARD-NO LIST (cut on sight)
- Em-dashes and en-dashes used as sentence connectors. ANYWHERE. Including taglines.
- Exclamation points
- Emoji-prefixed headers (## :rocket: Features, ## :sparkles: Highlights)
- Adjective-stacked taglines (blazingly fast, modern, lightweight, AI-powered)
- Vocabulary: seamless, leverages, robust, cutting-edge, harness the power of, supercharge, streamlines, empowers, unlock, paradigm shift, holistic, comprehensive, powerful, production-grade, blazing-fast
- Bold-every-noun bullets (**Performance:** Built for speed)
- Manual Table of Contents on a sub-600-line README
- Rainbow `for-the-badge` rows, `PRs welcome`, visitor counters, "Made with heart"
- Check-mark feature matrix for table-stakes (Easy to use, Open source)
- Mixed curly/straight quotes
- "Star this repo if it helped you" closer
- AI-style hedge disclaimers
- Horizontal rules between every section

ANTI-HISTORICAL-NARRATION
- Do NOT narrate how the repo was built, refactored, extracted, or researched.
- Do NOT write "originally built as", "after research we", "we extracted from", "as of v0.x".
- Do NOT include changelog, postmortem, design-retro, or migration prose.
- The README answers two questions only: WHAT does this do for the reader, and HOW do they use it RIGHT NOW.
- Test every sentence: "would a first-time user need this to install or use the tool?" If no, cut.

IDEMPOTENCY
- If existing content is clean and matches this spec, return it verbatim.
- BUT: if existing content contains any item from HARD-NO or ANTI-HISTORICAL, you MUST rewrite even if the prose is otherwise polished. Do not re-bless contaminated READMEs.

OUTPUT
Raw markdown only. No code fences wrapping the whole document. No commentary. No preamble.
SP_EOF

read -r -d '' SYSTEM_PROMPT_FOR_PR_TEMPLATE_MD <<'SP_EOF' || true
You are writing or improving .github/PULL_REQUEST_TEMPLATE.md for a Wranngle dotfiles-managed repo.
Tone: brief, businesslike. No emojis, no preamble, no closing summary.
Goal: enforce the unified Issue+PR contract documented in the git-awesome skill.
Required H3 sections in this exact order: Summary, Why, Change Type, Testing Notes, Risk & Rollback, Related Issue.
- Summary: one-paragraph placeholder for the WHAT.
- Why: one-line placeholder for motivation; reviewers will compare to the linked issue.
- Change Type: unordered checkbox list — Bug fix, New feature, Breaking change, Documentation, Refactor, Security, Performance.
- Testing Notes: bullet placeholder for what was tested or how reviewers can repro; explicitly call out tests skipped.
- Risk & Rollback: bullet placeholder naming any migration, public API, deploy, secret, or branch-protection touch points; one-line rollback plan.
- Related Issue: required line "Closes #" placeholder. State that pr-link-check.yml enforces Closes/Fixes/Resolves.
Output ONLY raw markdown — no fences wrapping the output, no commentary.
SP_EOF

# ── GitHub governance: issue forms, triage workflow, label taxonomy ────
# Designed against three goals: (1) agent-friendly — every field machine-extractable
# from form bodies via stable section headings; (2) zero-effort labeling — Area
# dropdown drives an `a/<area>` label via workflow, no manual labeling ever;
# (3) labels are static facets only (type, area, two booleans). Status / priority /
# effort live in Projects v2, where they belong, not as labels that rot.

read -r -d '' BUG_REPORT_YML_TEMPLATE_HERESTRING <<'BUG_REPORT_EOF' || true
name: 🐞 Bug
description: Existing behavior is wrong
title: "bug: "
labels: [t.bug, triage]
body:
  - type: markdown
    attributes:
      value: |
        Tip: paste this prompt to Claude / Codex / Gemini to fill the form for you →
        > "Open a bug issue. Symptom: <one sentence>. Use my recent shell history and code context to fill all fields."
  - type: textarea
    id: what
    attributes:
      label: What & how to reproduce
      description: Symptom in 1–2 lines, then exact steps. Include error messages verbatim.
      placeholder: |
        Symptom: ...
        Reproduce:
        1. ...
        2. ...
        3. ...
        Expected: ...
        Actual: ...
    validations:
      required: true
  - type: dropdown
    id: area
    attributes:
      label: Area
      description: Drives the a/<area> label automatically via the issue-triage workflow.
      options:
        - core
        - cli
        - api
        - docs
        - ci
        - infra
        - other
    validations:
      required: true
  - type: textarea
    id: env
    attributes:
      label: Environment
      description: Versions, OS, runtime. Paste `node -v && npm -v && uname -a` or equivalent.
      render: shell
  - type: textarea
    id: logs
    attributes:
      label: Logs / traceback
      render: shell
BUG_REPORT_EOF

read -r -d '' FEATURE_REQUEST_YML_TEMPLATE_HERESTRING <<'FEATURE_REQUEST_EOF' || true
name: ✨ Feature
description: Something new
title: "feat: "
labels: [t.feat, triage]
body:
  - type: markdown
    attributes:
      value: |
        Tip: state the problem before the solution. "Wouldn't it be cool if…" requests get deprioritized.
  - type: textarea
    id: problem
    attributes:
      label: Problem & Why now
      description: What's the user pain? What changed that makes this matter?
    validations:
      required: true
  - type: textarea
    id: proposal
    attributes:
      label: Proposed approach
      description: Sketch the API / UX. Code snippets welcome. If you don't know yet, file a research issue instead.
    validations:
      required: true
  - type: dropdown
    id: area
    attributes:
      label: Area
      options:
        - core
        - cli
        - api
        - docs
        - ci
        - infra
        - other
    validations:
      required: true
  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives considered
      description: What else did you think about? Why not those?
FEATURE_REQUEST_EOF

read -r -d '' RESEARCH_YML_TEMPLATE_HERESTRING <<'RESEARCH_EOF' || true
name: 🔬 Research / spike
description: Investigate, prototype, or evaluate
title: "research: "
labels: [t.research, triage]
body:
  - type: markdown
    attributes:
      value: |
        Use this for time-boxed investigations. The goal is a *decision*, not code.
  - type: textarea
    id: question
    attributes:
      label: Question / hypothesis
    validations:
      required: true
  - type: textarea
    id: deliverable
    attributes:
      label: Deliverable
      description: What artifact answers the question? (RFC, prototype, benchmark, decision doc.)
    validations:
      required: true
  - type: input
    id: timebox
    attributes:
      label: Timebox
      description: How long should this run before forcing a decision?
      placeholder: "1 day | 1 week max"
    validations:
      required: true
  - type: dropdown
    id: area
    attributes:
      label: Area
      options:
        - core
        - cli
        - api
        - docs
        - ci
        - infra
        - other
    validations:
      required: true
RESEARCH_EOF

# Workflow: extracts the Area dropdown from issue body and applies a/<area>;
# also adds the issue to the user-level Triage Projects v2 board if the repo
# has TRIAGE_PROJECT_NUMBER + TRIAGE_PROJECT_OWNER variables set (wired by
# wireRepoToTriageProject in .dotfiles.sh).
# Env-passed body (not ${{ }}-interpolated into the script) prevents command
# injection from user-controlled issue content.
read -r -d '' ISSUE_TRIAGE_WORKFLOW_TEMPLATE_HERESTRING <<'ISSUE_TRIAGE_EOF' || true
name: issue-triage
on:
  issues:
    types: [opened, edited]
  pull_request:
    types: [opened]
permissions:
  contents: read
jobs:
  apply-area-label:
    runs-on: ubuntu-latest
    if: github.event_name == 'issues'
    permissions:
      contents: read
      issues: write
    steps:
      - name: Apply a/<area> label from form body
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ISSUE_NUMBER: ${{ github.event.issue.number }}
          ISSUE_BODY: ${{ github.event.issue.body }}
          REPO: ${{ github.repository }}
        run: |
          set -euo pipefail
          export PUPPETEER_SKIP_DOWNLOAD=true
          export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
          area=$(printf '%s' "$ISSUE_BODY" \
            | awk '/^### Area$/{flag=1; next} flag && NF{print; exit}' \
            | tr -d '[:space:]')
          if [[ -z "$area" || "$area" == _No* ]]; then
            echo "no Area field; skipping"; exit 0
          fi
          if gh label list --repo "$REPO" --json name -q '.[].name' | grep -qx "a/$area"; then
            gh issue edit "$ISSUE_NUMBER" --repo "$REPO" --add-label "a/$area"
            echo "applied a/$area"
          else
            echo "label a/$area not seeded in this repo; skipping"
          fi

  add-to-triage-project:
    runs-on: ubuntu-latest
    if: github.event.action == 'opened'
    permissions:
      contents: read
    steps:
      - name: Add issue to user-level Triage project
        env:
          GH_TOKEN: ${{ secrets.PROJECTS_TOKEN || secrets.GITHUB_TOKEN }}
          ISSUE_URL: ${{ github.event.issue.html_url || github.event.pull_request.html_url }}
          PROJECT_NUMBER: ${{ vars.TRIAGE_PROJECT_NUMBER }}
          PROJECT_OWNER: ${{ vars.TRIAGE_PROJECT_OWNER }}
          PROJECTS_TOKEN_CONFIGURED: ${{ secrets.PROJECTS_TOKEN != '' }}
        run: |
          set -euo pipefail
          export PUPPETEER_SKIP_DOWNLOAD=true
          export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
          if [[ -z "$PROJECT_NUMBER" || -z "$PROJECT_OWNER" ]]; then
            echo "no TRIAGE_PROJECT_NUMBER / OWNER vars; skipping (set via dotfiles bootstrap)"; exit 0
          fi
          # GITHUB_TOKEN cannot mutate user-level Projects v2. If a PROJECTS_TOKEN
          # PAT secret is configured (with project scope), use it; otherwise log
          # and skip — the dotfiles bootstrap link is still valuable as a record.
          if [[ "$PROJECTS_TOKEN_CONFIGURED" != "true" ]]; then
            echo "default GITHUB_TOKEN cannot mutate user projects; configure secrets.PROJECTS_TOKEN (PAT with 'project' scope) to enable"; exit 0
          fi
          gh project item-add "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --url "$ISSUE_URL" \
            && echo "added to project $PROJECT_OWNER#$PROJECT_NUMBER" \
            || echo "project add failed (token may lack project scope or item already present)"
ISSUE_TRIAGE_EOF

# Non-blocking PR linkage check. Applies pr-needs-issue label if the PR body
# lacks a Closes/Fixes/Resolves reference. Removes the label automatically once
# a link is added. Avoids routine bot comments.
read -r -d '' PR_LINK_CHECK_WORKFLOW_TEMPLATE_HERESTRING <<'PR_LINK_CHECK_EOF' || true
name: pr-link-check
on:
  pull_request:
    types: [opened, edited]
permissions:
  contents: read
jobs:
  check-issue-link:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: read
      pull-requests: write
    steps:
      - name: Verify PR body links an issue
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          PR_BODY: ${{ github.event.pull_request.body }}
          HEAD_REF: ${{ github.event.pull_request.head.ref }}
          REPO: ${{ github.repository }}
        run: |
          set -euo pipefail
          export PUPPETEER_SKIP_DOWNLOAD=true
          export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

          if printf '%s' "$PR_BODY" | grep -qiE '(closes|fixes|resolves)[[:space:]]+#[0-9]+'; then
            gh pr edit "$PR_NUMBER" --repo "$REPO" --remove-label pr-needs-issue 2>/dev/null || true
            echo "PR has issue link; cleared pr-needs-issue if present"
            exit 0
          fi
          gh pr edit "$PR_NUMBER" --repo "$REPO" --add-label pr-needs-issue 2>/dev/null || true
          echo "PR is missing an issue link; applied pr-needs-issue label"
PR_LINK_CHECK_EOF

# ── gitleaks: managed config + CI workflow ────────────────────────────
# Default ruleset comes from gitleaks itself (~150 detectors). We extend
# rather than replace so upstream rule additions land automatically on
# version bumps. The allowlist below covers common false-positive paths
# (test fixtures, .env.example) and obvious dummy-secret naming.
read -r -d '' GITLEAKS_TOML_TEMPLATE_HERESTRING <<'GITLEAKS_TOML_EOF' || true
title = "dotfiles-managed gitleaks config"

[extend]
useDefault = true

[allowlist]
description = "Test fixtures, examples, and obvious-dummy patterns."
paths = [
  '''(.*?)(_|/)?test_?fixtures(.*?)\.(json|yml|yaml|txt|md)$''',
  '''(.*?)(_|/)?examples?/(.*?)\.(env\.example|env\.template|env\.sample)$''',
  '''\.env\.example$''',
  '''\.env\.template$''',
  '''\.env\.sample$''',
  '''\.gitleaks\.toml$''',
  '''\.gitleaksignore$''',
]
regexes = [
  '''(?i)(example|dummy|fake|mock|placeholder|sample|test)[_-]?(api[_-]?key|secret|token|password)''',
  '''(?i)(key|token|secret|password):\s*['\"]?[a-z0-9_-]*(example|dummy|fake|mock|placeholder|sample|test)[a-z0-9_-]*''',
  '''(?i)your[_-]?(api[_-]?key|secret|token|password)[_-]?here''',
  '''(?i)xxx+[a-z0-9]{0,4}(api[_-]?key|secret|token)?''',
]
GITLEAKS_TOML_EOF

read -r -d '' GITLEAKS_WORKFLOW_YML_TEMPLATE_HERESTRING <<'GITLEAKS_WF_EOF' || true
name: gitleaks
on:
  pull_request:
  push:
    branches: [main, master]
  workflow_dispatch:
permissions:
  contents: read
concurrency:
  group: gitleaks-${{ github.ref }}
  cancel-in-progress: true
jobs:
  scan:
    name: gitleaks
    runs-on: ubuntu-latest
    env:
      GITLEAKS_VERSION: "8.30.1"
      GITLEAKS_SHA256_LINUX_X64: 551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd  # v6.0.2
        with:
          fetch-depth: 0
          persist-credentials: false
      - name: Install gitleaks
        shell: bash
        run: |
          set -euo pipefail
          export PUPPETEER_SKIP_DOWNLOAD=true
          export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
          url="https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz"
          curl -fsSLo /tmp/gitleaks.tar.gz "$url"
          printf '%s  %s\n' "$GITLEAKS_SHA256_LINUX_X64" /tmp/gitleaks.tar.gz | sha256sum -c -
          tar -xzf /tmp/gitleaks.tar.gz -C /tmp gitleaks
          sudo install -m 0755 /tmp/gitleaks /usr/local/bin/gitleaks
          gitleaks version
      - name: gitleaks
        shell: bash
        run: gitleaks git --redact --no-banner --config .gitleaks.toml --exit-code 1
GITLEAKS_WF_EOF

read -r -d '' SECURITY_WORKFLOW_YML_TEMPLATE_HERESTRING <<'SECURITY_WF_EOF' || true
name: security

on:
  pull_request:
  push:
    branches: [main, master]
  schedule:
    - cron: "23 11 * * 1"
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: security-${{ github.ref }}
  cancel-in-progress: true

env:
  ACTIONLINT_VERSION: "1.7.12"
  ZIZMOR_VERSION: "1.24.1"

jobs:
  actionlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd  # v6.0.2
        with:
          persist-credentials: false
      - name: Install actionlint
        shell: bash
        run: |
          set -euo pipefail
          export PUPPETEER_SKIP_DOWNLOAD=true
          export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
          asset="actionlint_${ACTIONLINT_VERSION}_linux_amd64.tar.gz"
          base_url="https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}"
          curl -fsSLO "${base_url}/${asset}"
          curl -fsSLO "${base_url}/actionlint_${ACTIONLINT_VERSION}_checksums.txt"
          grep " ${asset}$" "actionlint_${ACTIONLINT_VERSION}_checksums.txt" | sha256sum -c -
          tar -xzf "$asset" actionlint
          sudo install -m 0755 actionlint /usr/local/bin/actionlint
          actionlint -version
      - name: Run actionlint
        shell: bash
        run: actionlint

  zizmor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd  # v6.0.2
        with:
          persist-credentials: false
      - uses: actions/setup-python@a309ff8b426b58ec0e2a45f0f869d46889d02405  # v6.2.0
        with:
          python-version: "3.x"
      - name: Run zizmor
        shell: bash
        run: |
          set -euo pipefail
          export PUPPETEER_SKIP_DOWNLOAD=true
          export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
          python -m venv .zizmor-venv
          . .zizmor-venv/bin/activate
          python -m pip install --quiet --upgrade pip
          python -m pip install --quiet "zizmor==${ZIZMOR_VERSION}"
          zizmor --offline --no-progress --min-severity low .github/workflows .github/dependabot.yml

  dependency-review:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request' && (github.event.repository.private == false || vars.ENABLE_DEPENDENCY_REVIEW == 'true')
    permissions:
      contents: read
      pull-requests: read
    steps:
      - name: Dependency review
        uses: actions/dependency-review-action@2031cfc080254a8a887f58cffee85186f0e49e48  # v4.9.0
        with:
          fail-on-severity: moderate
          comment-summary-in-pr: on-failure

  scorecard:
    runs-on: ubuntu-latest
    if: github.event_name != 'pull_request' && (github.event.repository.private == false || vars.ENABLE_SCORECARD == 'true')
    permissions:
      actions: read
      contents: read
      id-token: write
      security-events: write
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd  # v6.0.2
        with:
          persist-credentials: false
      - name: Run OpenSSF Scorecard
        continue-on-error: true
        uses: ossf/scorecard-action@99c09fe975337306107572b4fdf4db224cf8e2f2  # v2.4.3
        with:
          results_file: scorecard.sarif
          results_format: sarif
          publish_results: ${{ github.event.repository.private == false && github.ref_name == github.event.repository.default_branch }}
      - name: Upload Scorecard SARIF
        if: always() && hashFiles('scorecard.sarif') != ''
        continue-on-error: true
        uses: github/codeql-action/upload-sarif@ed410739ba306e4ebe5e123421a6bd694e494a2b  # v4
        with:
          sarif_file: scorecard.sarif

  detect-codeql:
    runs-on: ubuntu-latest
    outputs:
      enabled: ${{ steps.detect.outputs.enabled }}
      matrix: ${{ steps.detect.outputs.matrix }}
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd  # v6.0.2
        with:
          persist-credentials: false
      - id: detect
        shell: bash
        run: |
          set -euo pipefail
          export PUPPETEER_SKIP_DOWNLOAD=true
          export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
          find_code() {
            find . \
              \( -path './.git' -o -path './old' -o -path './node_modules' -o -path '*/node_modules' -o -path '*/vendor' -o -path '*/deps' \) -prune -o \
              \( "$@" \) -type f -print -quit | grep -q .
          }
          langs=()
          find_code -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' -o -name 'package.json' && langs+=('{"language":"javascript-typescript"}')
          find_code -name '*.py' -o -name 'pyproject.toml' -o -name 'requirements.txt' && langs+=('{"language":"python"}')
          find_code -name '*.go' -o -name 'go.mod' && langs+=('{"language":"go"}')
          find_code -name '*.c' -o -name '*.cc' -o -name '*.cpp' -o -name '*.h' -o -name '*.hpp' -o -name 'CMakeLists.txt' && langs+=('{"language":"c-cpp"}')
          find_code -name '*.cs' -o -name '*.csproj' -o -name '*.sln' && langs+=('{"language":"csharp"}')
          find_code -name '*.java' -o -name '*.kt' -o -name 'pom.xml' -o -name 'build.gradle' -o -name 'build.gradle.kts' && langs+=('{"language":"java-kotlin"}')
          find_code -name '*.rb' -o -name 'Gemfile' && langs+=('{"language":"ruby"}')
          find_code -name '*.swift' -o -name 'Package.swift' && langs+=('{"language":"swift"}')
          if ((${#langs[@]} == 0)); then
            echo 'enabled=false' >> "$GITHUB_OUTPUT"
            echo 'matrix={"include":[]}' >> "$GITHUB_OUTPUT"
            exit 0
          fi
          matrix=$(printf '%s\n' "${langs[@]}" | jq -sc '{include: .}')
          echo 'enabled=true' >> "$GITHUB_OUTPUT"
          echo "matrix=$matrix" >> "$GITHUB_OUTPUT"

  codeql:
    needs: detect-codeql
    runs-on: ubuntu-latest
    if: needs.detect-codeql.outputs.enabled == 'true' && (github.event.repository.private == false || vars.ENABLE_CODEQL == 'true')
    permissions:
      contents: read
      packages: read
      security-events: write
    strategy:
      fail-fast: false
      matrix: ${{ fromJSON(needs.detect-codeql.outputs.matrix) }}
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd  # v6.0.2
        with:
          persist-credentials: false
      - uses: github/codeql-action/init@ed410739ba306e4ebe5e123421a6bd694e494a2b  # v4
        with:
          languages: ${{ matrix.language }}
      - uses: github/codeql-action/autobuild@ed410739ba306e4ebe5e123421a6bd694e494a2b  # v4
      - uses: github/codeql-action/analyze@ed410739ba306e4ebe5e123421a6bd694e494a2b  # v4
SECURITY_WF_EOF

# Canonical label taxonomy. ONE PIPE-SEPARATED LINE PER LABEL: name|color|description.
# t.* = type (8, conventional-commits aligned). a/* = area (open per repo, slash-prefixed
# for visual distinction from type). triage / blocked = boolean state. Everything else
# (status, priority, effort, sprint) belongs in Projects v2.
read -r -d '' CANONICAL_GITHUB_LABEL_SET_HERESTRING <<'CANONICAL_LABELS_EOF' || true
t.bug|d73a4a|Defect: existing behavior is wrong
t.feat|0e8a16|New capability
t.chore|c5def5|Maintenance, deps, infra plumbing
t.docs|0075ca|Documentation only
t.refactor|fef2c0|Internal restructuring; no behavior change
t.research|5319e7|Investigation, spike, RFC
t.security|b60205|Vulnerability or hardening
t.perf|fbca04|Performance change
triage|fbca04|Awaiting first-pass categorization (auto-applied; remove when triaged)
blocked|d93f0b|Cannot proceed; reason in latest comment
pr-needs-issue|e99695|PR has no Closes/Fixes/Resolves reference; auto-applied by pr-link-check
automerge|0e8a16|PR is eligible for GitHub auto-merge once required checks pass
a/core|c2e0c6|Core / runtime
a/cli|c2e0c6|Command-line interface
a/api|c2e0c6|HTTP / RPC surface
a/docs|c2e0c6|Documentation
a/ci|c2e0c6|CI / build / release
a/infra|c2e0c6|Deployment / hosting
a/other|c2e0c6|Catch-all; rename/replace once a real area emerges
CANONICAL_LABELS_EOF

# Replaced-by-new-taxonomy GitHub default labels. We delete these on every
# bootstrap so repos converge on the t.* / a/* set. NOT in this list (kept):
# duplicate, invalid, wontfix, good first issue, help wanted — those have
# semantics the new taxonomy doesn't subsume.
readonly REPLACED_DEFAULT_GITHUB_LABELS=(bug enhancement documentation question)



stripWrappingMarkdownFencesIfPresent(){ local rawContent=$1 firstLine lastLine
  firstLine=$(printf '%s' "$rawContent"|head -1);lastLine=$(printf '%s' "$rawContent"|tail -1)
  if [[ $firstLine =~ ^\`\`\` && $lastLine =~ ^\`\`\` ]];then printf '%s' "$rawContent"|sed '1d;$d'
  else printf '%s' "$rawContent";fi;}

invokeLlmFallbackScriptViaStdin(){ local systemPrompt=$1 userPrompt=$2 llmShPath
  llmShPath=$REPO_ROOT/scripts/bin/llm.sh
  [[ -x $llmShPath ]]||llmShPath=$HOME/.dotfiles/scripts/bin/llm.sh
  LLM_SYSTEM=$systemPrompt "$llmShPath" <<<"$userPrompt" 2>/dev/null;}

writeLlmGeneratedArtifactWithRetry(){ local taskName=$1 outputRelPath=$2 systemPrompt=$3 userPrompt=$4
  local outputAbsPath=$REPO_ROOT/$outputRelPath maxRetryCount=2 attemptNumber=0 modelOutput validationOutput tempPath previousSha256='' newSha256 archivePath
  [[ -f $outputAbsPath ]]&&previousSha256=$(sha256sum "$outputAbsPath"|cut -d' ' -f1)
  while ((attemptNumber<=maxRetryCount));do
    emitEcsLogEvent info task.llm-call success "$taskName" 0 '' '' "attempt=$((attemptNumber+1))/$((maxRetryCount+1))"
    modelOutput=$(invokeLlmFallbackScriptViaStdin "$systemPrompt" "$userPrompt") || {
      emitEcsLogEvent error task.llm-call failure "$taskName" 0 '' '' "llm.sh chain exhausted"
      ((FAIL_FAST))&&failFatallyAndExit "$taskName" "llm.sh chain exhausted"
      appendTaskStatusRecordToState "$taskName" failed
      DOTFILES_RUN_FAILED_TASKS+=("$taskName");return 1;}
    modelOutput=$(stripWrappingMarkdownFencesIfPresent "$modelOutput")
    modelOutput=$(normalizeGeneratedArtifactContent "$outputRelPath" "$modelOutput")
    tempPath=$(mktemp --suffix=".${outputRelPath##*.}" 2>/dev/null||mktemp)
    printf '%s\n' "$modelOutput" > "$tempPath"
    if validationOutput=$(validateGeneratedArtifactByExtension "$tempPath" 2>&1);then
      newSha256=$(sha256sum "$tempPath"|cut -d' ' -f1)
      if [[ -n $previousSha256 && $previousSha256 == "$newSha256" ]];then
        rm -f "$tempPath" 2>/dev/null||true
        appendTaskStatusRecordToState "$taskName" ok "$newSha256"
        emitEcsLogEvent info task.write success "$taskName" 0 '' '' "noop sha256=$newSha256 attempts=$((attemptNumber+1))"
        DOTFILES_RUN_SUCCESS_TASKS+=("$taskName");return 0
      fi
      mkdir -p "$(dirname "$outputAbsPath")"
      if ! archivePath=$(archiveExistingPathToProjectOld "$outputAbsPath" "$taskName");then
        rm -f "$tempPath" 2>/dev/null||true
        emitEcsLogEvent error task.write failure "$taskName" 0 '' '' 'archive old path failed'
        appendTaskStatusRecordToState "$taskName" failed
        DOTFILES_RUN_FAILED_TASKS+=("$taskName")
        return 1
      fi
      if ! mv "$tempPath" "$outputAbsPath" 2>/dev/null;then
        [[ -n $archivePath ]]&&{ mkdir -p "$(dirname "$outputAbsPath")" 2>/dev/null||true;mv "$archivePath" "$outputAbsPath" 2>/dev/null||true; }
        rm -f "$tempPath" 2>/dev/null||true
        emitEcsLogEvent error task.write failure "$taskName" 0 '' '' 'write failed'
        appendTaskStatusRecordToState "$taskName" failed
        DOTFILES_RUN_FAILED_TASKS+=("$taskName")
        return 1
      fi
      appendTaskStatusRecordToState "$taskName" ok "$newSha256"
      if [[ -z $previousSha256 ]];then emitEcsLogEvent info task.write success "$taskName" 0 '' '' "created sha256=$newSha256 attempts=$((attemptNumber+1))"
      else emitEcsLogEvent info task.write success "$taskName" 0 '' '' "overwrote prev_sha256=$previousSha256 new_sha256=$newSha256 attempts=$((attemptNumber+1)) old=${archivePath#$REPO_ROOT/}";fi
      DOTFILES_RUN_SUCCESS_TASKS+=("$taskName");return 0
    fi
    rm -f "$tempPath"
    emitEcsLogEvent warn task.validate failure "$taskName" 0 '' '' "attempt=$((attemptNumber+1)) err=${validationOutput:0:200}"
    userPrompt="${userPrompt}

PREVIOUS ATTEMPT FAILED VALIDATION:
${validationOutput}

Correct the output and try again. Output only the corrected content, no commentary."
    attemptNumber=$((attemptNumber+1))
  done
  ((FAIL_FAST))&&failFatallyAndExit "$taskName" "validation failed after $((maxRetryCount+1)) attempts"
  appendTaskStatusRecordToState "$taskName" failed
  DOTFILES_RUN_FAILED_TASKS+=("$taskName")
  emitEcsLogEvent error task.llm-call failure "$taskName" 0 '' '' "exhausted retries"
  return 1;}

readExistingFileContentOrEmpty(){ [[ -f $1 ]]||{ echo;return;}
  local size;size=$(wc -c < "$1" 2>/dev/null||echo 0)
  ((size>1048576))&&{ echo;return;}
  tr -d '\0' < "$1"||true;}

writeArtifactContributingMd(){ local userPrompt projectName installCommand
  projectName=$(readFieldFromAssessmentFile projectName);installCommand=$(readFieldFromAssessmentFile installCommand)
  userPrompt="$(buildLlmContextPrefixFromAssessment)Write CONTRIBUTING.md for ${projectName}.

Cover briefly: local setup (using \`${installCommand:-the project install command}\`), running tests, filing a PR, code style expectations, how to ask questions (issues vs discussions). Under 80 lines. Friendly, not bureaucratic."
  writeLlmGeneratedArtifactWithRetry CONTRIBUTING.md CONTRIBUTING.md "$SYSTEM_PROMPT_FOR_CONTRIBUTING_MD" "$userPrompt";}

writeArtifactSecurityMd(){ local userPrompt projectName repoUrl authorEmail
  projectName=$(readFieldFromAssessmentFile projectName);repoUrl=$(resolveRepoUrlWithFallback);authorEmail=$(resolveAuthorEmailWithFallback)
  if [[ ${DOTFILES_SKIP_LLM:-0} == 1 || ${DOTFILES_SECURITY_ONLY:-0} == 1 ]];then
    writeArtifactToDiskAndRecord SECURITY.md "# Security

Report vulnerabilities privately through GitHub Private Vulnerability Reporting:

${repoUrl}/security/advisories/new

If that link is unavailable, email ${authorEmail}.

Expected response: best-effort acknowledgement, typically within 7 days.
"
    return 0
  fi
  userPrompt="$(buildLlmContextPrefixFromAssessment)Write SECURITY.md for ${projectName}.

Use ${repoUrl}/security/advisories/new for the PVR link.
Email fallback: ${authorEmail}.
Acknowledgement window: best-effort, typically within 7 days.
Under 40 lines."
  writeLlmGeneratedArtifactWithRetry SECURITY.md SECURITY.md "$SYSTEM_PROMPT_FOR_SECURITY_MD" "$userPrompt";}

# Spec §10 IDEMPOTENCY guard: returns 0 (clean) if the existing README on
# disk passes the wranngle voice lint AND has the structural elements §9
# requires (H1, blockquote tagline, badge row, status callout, at least one
# section heading, License section). Returns non-zero if any check fails.
# When clean, the README writer skips the LLM call entirely and emits a noop
# event, which is what makes the regression sweep converge.
checkExistingReadmeAlreadyMatchesSpec(){
  local readmePath=$REPO_ROOT/README.md
  [[ -f $readmePath ]]||return 1
  # Voice lint
  local lintOut;lintOut=$(lintReadmeAgainstWranngleVoiceRules "$readmePath")
  [[ -z $lintOut ]]||{ echo "lint: ${lintOut//$'\n'/ | }" >&2;return 1;}
  # H1 present
  grep -q '^# ' "$readmePath"||{ echo "missing H1" >&2;return 1;}
  # Blockquote tagline within 10 lines of the H1
  local taglineLine
  taglineLine=$(awk '/^# /{found=1; lineno=NR; next} found && NR<=lineno+10 && /^> [^[]/ {print; exit}' "$readmePath")
  [[ -n $taglineLine ]]||{ echo "missing > tagline blockquote near H1" >&2;return 1;}
  # First letter of the tagline body must be lowercase or a non-letter
  local taglineBody=${taglineLine#> }
  taglineBody=${taglineBody# }
  local first=${taglineBody:0:1}
  [[ $first =~ [A-Z] ]]&&{ echo "tagline first letter '$first' is uppercase" >&2;return 1;}
  # Spec §3 tagline length limit: <=100 chars (excluding the `> ` prefix). An
  # over-long tagline forces regeneration so the LLM rewrites it under the new
  # constraint instead of being re-blessed as compliant.
  (( ${#taglineBody} <= 100 ))||{ echo "tagline body is ${#taglineBody} chars; spec §3 max is 100" >&2;return 1;}
  # Elevator-pitch body: within 12 lines of the H1, a second non-callout `> `
  # line with prose content must exist (the tagline itself counts as the first
  # such line). An optional bare `>` separator between them is allowed.
  local pitchBodyOk
  pitchBodyOk=$(awk '
    /^# /{ inH1=1; lineno=NR; next }
    !inH1 { next }
    inH1 && NR > lineno + 12 { exit }
    /^> \[!/ { exit }
    /^> [^[]/ {
      taglineSeen++
      if (taglineSeen == 1) next
      print "yes"; exit
    }
  ' "$readmePath")
  [[ $pitchBodyOk == yes ]]||{ echo "missing elevator-pitch body in tagline blockquote (tagline alone is no longer sufficient)" >&2;return 1;}
  # Status callout block must exist AND its body must match the canonical
  # phrasing for the currently-classified projectStatus. A stale callout
  # (e.g., "Experiment" on a repo that now classifies as "active") fails the
  # precheck so the LLM regenerates with the correct status.
  grep -q '^> \[!NOTE\]\|^> \[!WARNING\]\|^> \[!IMPORTANT\]' "$readmePath"||{ echo "missing > [!NOTE] callout" >&2;return 1;}
  local currentStatus expectedCalloutBody actualCalloutBody
  currentStatus=$(classifyProjectStatusFromSignals 2>/dev/null||echo experiment)
  expectedCalloutBody=$(canonicalProjectStatusCalloutPhrasing "$currentStatus")
  # The callout body lives on the line immediately after `> [!NOTE]`. Strip
  # the leading `> ` and any optional trailing usage sentence (we only check
  # the canonical first sentence matches).
  actualCalloutBody=$(awk '/^> \[!(NOTE|WARNING|IMPORTANT)\]/{getline;sub(/^> ?/,"");print;exit}' "$readmePath")
  case "$actualCalloutBody" in
    "$expectedCalloutBody"*) : ;;
    *) echo "callout body does not match status=$currentStatus expected='$expectedCalloutBody' actual='$actualCalloutBody'" >&2;return 1;;
  esac
  return 0;}

# Allow-list of repo slugs that opt INTO the wranngle-voice README writer.
# 2026-05-03 incident: the writer destructively rewrote organic READMEs in
# gtm_ops, wranngle_com, voice_ai_agent_evals, and career_architect because
# the precheck (`checkExistingReadmeAlreadyMatchesSpec`) demands strict spec
# §9 conformance and the LLM rewrites everything that fails. Default is now
# opt-in: a repo must either appear in this slug allow-list or carry an
# in-tree marker file `.dotfiles-readme-managed` to receive the writer.
# Slug = "owner/repo" as parsed from the origin remote.
readonly WRANNGLE_README_SYSTEM_ENABLED_REPOS=()

isCurrentRepoOnReadmeAllowList(){ local rawRemoteUrl normalizedUrl repoSlug entry
  [[ -f $REPO_ROOT/.dotfiles-readme-managed ]]&&return 0
  rawRemoteUrl=$(git -C "$REPO_ROOT" config --get remote.origin.url 2>/dev/null||printf '')
  [[ -z $rawRemoteUrl ]]&&return 1
  normalizedUrl=$(normalizeGitRemoteUrlToHttps "$rawRemoteUrl")
  [[ $normalizedUrl =~ ^https://[^/]+/([^/]+/[^/]+)$ ]]||return 1
  repoSlug=${BASH_REMATCH[1]}
  for entry in "${WRANNGLE_README_SYSTEM_ENABLED_REPOS[@]}";do
    [[ $entry == "$repoSlug" ]]&&return 0
  done
  return 1
}

writeArtifactReadmeMd(){ local userPrompt projectName tagline installCommand projectStatus accentColorHex recommendedBadgesJson dotfilesStyleCorpus fullExistingReadme detectedLanguage
  [[ -f $ASSESSMENT_FILE ]]||return 1
  # 2026-05-03 incident gate: opt-in allow-list. See
  # WRANNGLE_README_SYSTEM_ENABLED_REPOS above.
  if ! isCurrentRepoOnReadmeAllowList;then
    appendTaskStatusRecordToState README.md ok ''
    emitEcsLogEvent info task.skip success README.md 0 '' '' "policy=readme-opt-in repo not on allow-list and no .dotfiles-readme-managed marker"
    DOTFILES_RUN_SKIPPED_TASKS+=(README.md)
    return 0
  fi
  # Spec §10 IDEMPOTENCY precheck: if the existing README already matches
  # spec, skip the LLM entirely so the regression sweep converges to noop.
  if checkExistingReadmeAlreadyMatchesSpec 2>/dev/null;then
    local existingSha;existingSha=$(sha256sum "$REPO_ROOT/README.md"|cut -d' ' -f1)
    appendTaskStatusRecordToState README.md ok "$existingSha"
    emitEcsLogEvent info task.write success README.md 0 '' '' "noop sha256=$existingSha (precheck: existing content already matches spec §9)"
    DOTFILES_RUN_SUCCESS_TASKS+=(README.md)
    return 0
  fi
  projectName=$(jq -r '.projectName // ""' "$ASSESSMENT_FILE")
  tagline=$(jq -r '.taglineCandidate // ""' "$ASSESSMENT_FILE")
  installCommand=$(jq -r '.installCommand // ""' "$ASSESSMENT_FILE")
  projectStatus=$(jq -r '.projectStatus // "experiment"' "$ASSESSMENT_FILE")
  accentColorHex=$(jq -r '.accentColorHex // "A371F7"' "$ASSESSMENT_FILE")
  detectedLanguage=$(jq -r '.language // "unknown"' "$ASSESSMENT_FILE")
  fullExistingReadme=$(jq -r '.fullExistingReadme // ""' "$ASSESSMENT_FILE")
  dotfilesStyleCorpus=$(jq -r '.dotfilesStyleCorpus // ""' "$ASSESSMENT_FILE")
  recommendedBadgesJson=$(buildRecommendedBadgeRowFromAssessment)
  local userPromptTemplate
  userPromptTemplate=$(printf 'Write or improve README.md for %s.\n\nASSESSMENT\nlanguage: %s\ninstallCommand: %s\ntaglineCandidate: %s\nprojectStatus: %s\nprojectStatusUsagePhrase: (none)\naccentColorHex: %s\n\nRECOMMENDED BADGES (render exactly these, in this order):\n%s\n\nSTATUS CALLOUT (render verbatim inside a > [!NOTE] block):\n%s\n\nSTYLE CORPUS (anchor tone and vocabulary, do not quote):\n%s\n\nEXISTING README CONTENT (full):\n```markdown\n%s\n```\n\nIf the existing content matches the spec and contains no HARD-NO or ANTI-HISTORICAL items, return it verbatim. Otherwise rewrite.\n' \
    "$projectName" \
    "$detectedLanguage" \
    "${installCommand:-(none detected; omit install section)}" \
    "${tagline:-(none; write one that passes the non-portability test)}" \
    "$projectStatus" \
    "$accentColorHex" \
    "$recommendedBadgesJson" \
    "$(canonicalProjectStatusCalloutPhrasing "$projectStatus")" \
    "$dotfilesStyleCorpus" \
    "$fullExistingReadme")
  writeReadmeWithLintAutoRetry "$userPromptTemplate";}

# Spec §9 post-write lint with auto-retry. Calls writeLlmGeneratedArtifactWithRetry,
# then lints the produced README for em-dashes, en-dashes (used as sentence
# connectors — same regex catches both), exclamation points, and the banned
# vocabulary set. Up to 3 retries with the failure list re-injected.
writeReadmeWithLintAutoRetry(){ local baseUserPrompt=$1 lintAttempt=0 maxLintAttempts=3 lintFailures lintLog
  local readmeAbsPath=$REPO_ROOT/README.md
  local currentPrompt=$baseUserPrompt
  while ((lintAttempt<maxLintAttempts));do
    writeLlmGeneratedArtifactWithRetry README.md README.md "$SYSTEM_PROMPT_FOR_README_MD" "$currentPrompt"||return 1
    [[ -f $readmeAbsPath ]]||return 1
    lintFailures=$(lintReadmeAgainstWranngleVoiceRules "$readmeAbsPath")
    if [[ -z $lintFailures ]];then
      emitEcsLogEvent info task.lint success README.md 0 '' '' "passed wranngle voice lint after $((lintAttempt+1)) attempt(s)"
      return 0
    fi
    lintLog=$(printf '%s' "$lintFailures"|tr '\n' '|')
    emitEcsLogEvent warn task.lint failure README.md 0 '' '' "lint attempt=$((lintAttempt+1))/$maxLintAttempts failures=${lintLog:0:300}"
    currentPrompt="${baseUserPrompt}

PREVIOUS OUTPUT FAILED LINT — fix every item below and re-emit the FULL README:
${lintFailures}

Return only the corrected raw markdown."
    lintAttempt=$((lintAttempt+1))
    # Reset task state so the writer doesn't short-circuit on identical sha
    : > /dev/null
  done
  emitEcsLogEvent error task.lint failure README.md 0 '' '' "exhausted $maxLintAttempts lint retries; manual review needed"
  DOTFILES_RUN_FAILED_TASKS+=(README.md.lint)
  return 1;}

# Returns lint failure list (newline-separated) or empty string when clean.
# Detects: em-dashes, en-dashes, exclamation points, banned vocabulary set
# (per spec §9 HARD-NO LIST). Each line is a human-readable failure with a
# short citation snippet so the LLM can fix in one round.
lintReadmeAgainstWranngleVoiceRules(){ local readmePath=$1 failures=()
  local emDashCount enDashCount bangCount
  # grep -c emits "0" with rc=1 on no match; capture stdout only and ignore rc.
  emDashCount=$({ grep -c '—' "$readmePath" 2>/dev/null||true;}|head -1)
  enDashCount=$({ grep -c '–' "$readmePath" 2>/dev/null||true;}|head -1)
  # Exclamation points in *prose only*. Strip markdown image syntax `![alt](url)`,
  # GitHub callout markers `[!NOTE]` etc., and HTML img tags before counting.
  bangCount=$({ sed -E -e 's/!\[[^]]*\]\([^)]*\)//g' -e 's/\[!(NOTE|WARNING|TIP|IMPORTANT|CAUTION)\]//g' -e 's/<img [^>]*>//g' "$readmePath" 2>/dev/null|grep -c '!' 2>/dev/null||true;}|head -1)
  : "${emDashCount:=0}";: "${enDashCount:=0}";: "${bangCount:=0}"
  ((emDashCount>0))&&failures+=("EM-DASH: $emDashCount em-dash(es) found; replace with comma, period, or sentence break")
  ((enDashCount>0))&&failures+=("EN-DASH: $enDashCount en-dash(es) found as connector; replace with hyphen or sentence break")
  ((bangCount>0))&&failures+=("EXCLAMATION: $bangCount exclamation point(s) found; remove every one")
  local bannedWords=(seamless leverages leverage robust 'cutting-edge' supercharge streamlines empowers empower 'paradigm shift' holistic comprehensive 'production-grade' 'blazing-fast' 'blazingly fast')
  local word matches
  for word in "${bannedWords[@]}";do
    matches=$({ grep -ic -- "$word" "$readmePath" 2>/dev/null||true;}|head -1)
    : "${matches:=0}"
    ((matches>0))&&failures+=("BANNED-VOCAB: '$word' appears $matches time(s); rewrite with concrete language")
  done
  # Adjective-stacked tagline check: if the tagline (line 3 area, blockquote)
  # contains 3+ marketing adjectives, flag it.
  if grep -E '^>' "$readmePath"|head -1|grep -qiE 'fast.*modern|modern.*fast|elegant.*powerful|powerful.*elegant'; then
    failures+=("TAGLINE: tagline reads as adjective-stacked; rewrite with concrete-noun rule")
  fi
  # Emoji-prefixed headers. Match `## ` (two/three hash) followed by a char
  # that is neither alphanumeric, ASCII punctuation, nor a brand-prefix
  # character used in real repo names (`.`, `_`, `@`). Any header that begins
  # with an emoji or a multibyte UTF-8 character lands here.
  if grep -P '^##? [^\x00-\x7F]' "$readmePath" >/dev/null 2>&1;then
    failures+=("EMOJI-HEADER: header begins with a non-ASCII character (likely emoji); use sentence-case ASCII")
  fi
  # for-the-badge style
  if grep -q 'for-the-badge' "$readmePath" 2>/dev/null;then
    failures+=("FOR-THE-BADGE: shields.io for-the-badge style detected; use flat style")
  fi
  # Made with heart / star this repo
  grep -qiE 'made with (love|heart|❤|:heart:)' "$readmePath" 2>/dev/null&&failures+=("MADE-WITH-HEART: remove 'made with heart' footer")
  grep -qiE 'star this repo' "$readmePath" 2>/dev/null&&failures+=("STAR-THIS-REPO: remove 'star this repo' closer")
  printf '%s\n' "${failures[@]:-}"|sed '/^$/d';}

writeArtifactPullRequestTemplateMd(){ local userPrompt existingContent
  existingContent=$(readExistingFileContentOrEmpty "$REPO_ROOT/.github/PULL_REQUEST_TEMPLATE.md")
  userPrompt="$(buildLlmContextPrefixFromAssessment)Write or improve .github/PULL_REQUEST_TEMPLATE.md."
  [[ -n $existingContent ]]&&userPrompt="${userPrompt}

EXISTING CONTENT:
\`\`\`markdown
${existingContent}
\`\`\`

Return improvements only, otherwise return existing content verbatim."
  writeLlmGeneratedArtifactWithRetry .github/PULL_REQUEST_TEMPLATE.md .github/PULL_REQUEST_TEMPLATE.md "$SYSTEM_PROMPT_FOR_PR_TEMPLATE_MD" "$userPrompt";}

writeArtifactBugReportYml(){
  writeArtifactToDiskAndRecord .github/ISSUE_TEMPLATE/bug_report.yml "$BUG_REPORT_YML_TEMPLATE_HERESTRING";}

writeArtifactFeatureRequestYml(){
  writeArtifactToDiskAndRecord .github/ISSUE_TEMPLATE/feature_request.yml "$FEATURE_REQUEST_YML_TEMPLATE_HERESTRING";}

writeArtifactResearchYml(){
  writeArtifactToDiskAndRecord .github/ISSUE_TEMPLATE/research.yml "$RESEARCH_YML_TEMPLATE_HERESTRING";}

writeArtifactIssueTriageWorkflow(){
  writeArtifactToDiskAndRecord .github/workflows/issue-triage.yml "$ISSUE_TRIAGE_WORKFLOW_TEMPLATE_HERESTRING";}

writeArtifactPrLinkCheckWorkflow(){
  writeArtifactToDiskAndRecord .github/workflows/pr-link-check.yml "$PR_LINK_CHECK_WORKFLOW_TEMPLATE_HERESTRING";}

writeArtifactGitleaksToml(){
  writeArtifactToDiskAndRecord .gitleaks.toml "$GITLEAKS_TOML_TEMPLATE_HERESTRING";}

writeArtifactGitleaksWorkflow(){
  writeArtifactToDiskAndRecord .github/workflows/gitleaks.yml "$GITLEAKS_WORKFLOW_YML_TEMPLATE_HERESTRING";}

writeArtifactSecurityWorkflow(){
  writeArtifactToDiskAndRecord .github/workflows/security.yml "$SECURITY_WORKFLOW_YML_TEMPLATE_HERESTRING";}

# Idempotently apply the canonical label taxonomy to a GitHub repo. Uses
# `gh label create --force` so existing labels of the same name get their
# color/description updated in place. Skips silently if gh is missing or
# unauthenticated — this is decorative, not load-bearing.
seedCanonicalGithubLabels(){ local repoSlug=$1 name color description created=0 updated=0
  command -v gh >/dev/null 2>&1||return 0
  gh auth status >/dev/null 2>&1||return 0
  while IFS='|' read -r name color description;do
    [[ -z $name || $name == \#* ]]&&continue
    if gh label create "$name" --color "$color" --description "$description" --repo "$repoSlug" >/dev/null 2>&1;then
      created=$((created+1))
    elif gh label edit "$name" --color "$color" --description "$description" --repo "$repoSlug" >/dev/null 2>&1;then
      updated=$((updated+1))
    fi
  done <<< "$CANONICAL_GITHUB_LABEL_SET_HERESTRING"
  emitEcsLogEvent info task.write success gh.labels 0 '' '' "$repoSlug created=$created updated=$updated"
}

# Delete GitHub's default labels that the new t.* taxonomy replaces. Idempotent —
# 404 on already-deleted labels is silenced. Does NOT touch labels that have no
# replacement (good first issue, help wanted, duplicate, invalid, wontfix).
pruneReplacedDefaultLabels(){ local repoSlug=$1 label deleted=0
  command -v gh >/dev/null 2>&1||return 0
  gh auth status >/dev/null 2>&1||return 0
  for label in "${REPLACED_DEFAULT_GITHUB_LABELS[@]}";do
    if gh label delete "$label" --repo "$repoSlug" --yes >/dev/null 2>&1;then
      deleted=$((deleted+1))
    fi
  done
  ((deleted>0))&&emitEcsLogEvent info task.write success gh.labels-prune 0 '' '' "$repoSlug pruned=$deleted (replaced-by-t.*)"||true
}

# Cache file for the user-level Triage Projects v2 board's number/owner/id, so
# subsequent bootstraps + per-repo wiring don't re-query. Owner is keyed off
# the gh user, so multiple machines on the same account converge on the same
# project. File format: shell key=value, sourceable.
readonly TRIAGE_PROJECT_CACHE_FILE=$STATE_DIRECTORY/triage-project.env
readonly TRIAGE_PROJECT_TITLE=${DOTFILES_TRIAGE_PROJECT_TITLE:-Triage}
# Single source of truth for the PAT used for Projects v2 (local) and as the
# repo-level PROJECTS_TOKEN secret (workflow). Lives in ~/.agents/.env so all
# tools share one key — no per-repo manual setup.
readonly AGENTS_ENV_FILE=${DOTFILES_AGENTS_ENV_FILE:-$HOME/.agents/.env}

# Read PROJECTS_TOKEN from ~/.agents/.env into stdout. Intentionally minimal:
# matches `^PROJECTS_TOKEN=...` lines, strips the prefix and any surrounding
# quotes/whitespace. Empty stdout signals "not configured" — every caller
# treats that as a graceful skip.
loadProjectsTokenFromAgentsEnv(){
  [[ -f $AGENTS_ENV_FILE ]]||return 0
  awk -F= '/^PROJECTS_TOKEN=/{ sub(/^PROJECTS_TOKEN=/,""); gsub(/^["'\'']|["'\'']$/,""); print; exit }' "$AGENTS_ENV_FILE"
}

# Discover-or-create the user-level Triage project. Uses PROJECTS_TOKEN from
# ~/.agents/.env (overriding the gh CLI's own auth) so we don't depend on the
# gh login having the 'project' scope. Caches number/owner/id on success.
ensureUserLevelTriageProject(){ local ghUser projectsJson projectNumber projectId pat
  command -v gh >/dev/null 2>&1||{ emitEcsLogEvent info task.skip success gh.project-ensure 0 '' '' 'gh CLI missing'; return 0; }
  pat=$(loadProjectsTokenFromAgentsEnv)
  if [[ -z $pat ]];then
    emitEcsLogEvent warn task.skip failure gh.project-ensure 0 '' '' "PROJECTS_TOKEN absent from $AGENTS_ENV_FILE; add a PAT with 'project' scope to enable"
    return 0
  fi
  ghUser=$(GH_TOKEN="$pat" gh api user -q .login 2>/dev/null)
  [[ -z $ghUser ]]&&{ emitEcsLogEvent warn task.skip failure gh.project-ensure 0 '' '' 'PROJECTS_TOKEN cannot resolve gh user (token invalid or lacks user scope)'; return 0; }
  projectsJson=$(GH_TOKEN="$pat" gh project list --owner "$ghUser" --format json 2>/dev/null||echo '{}')
  projectNumber=$(printf '%s' "$projectsJson"|jq -r --arg t "$TRIAGE_PROJECT_TITLE" '.projects[]?|select(.title==$t)|.number' 2>/dev/null|head -1)
  if [[ -z $projectNumber ]];then
    local createJson
    if ! createJson=$(GH_TOKEN="$pat" gh project create --owner "$ghUser" --title "$TRIAGE_PROJECT_TITLE" --format json 2>/dev/null);then
      emitEcsLogEvent warn task.write failure gh.project-ensure 0 '' '' "gh project create failed for $ghUser/$TRIAGE_PROJECT_TITLE (token may lack 'project' scope)"
      return 0
    fi
    projectNumber=$(printf '%s' "$createJson"|jq -r '.number')
    emitEcsLogEvent info task.write success gh.project-ensure 0 '' '' "created Projects v2 board $ghUser#$projectNumber title=$TRIAGE_PROJECT_TITLE"
  else
    emitEcsLogEvent info task.write success gh.project-ensure 0 '' '' "found existing Projects v2 board $ghUser#$projectNumber"
  fi
  projectId=$(GH_TOKEN="$pat" gh project view "$projectNumber" --owner "$ghUser" --format json --jq '.id' 2>/dev/null)
  ensureProjectCustomFields "$projectNumber" "$ghUser" "$pat"
  printf 'TRIAGE_PROJECT_NUMBER=%s\nTRIAGE_PROJECT_OWNER=%s\nTRIAGE_PROJECT_ID=%s\n' \
    "$projectNumber" "$ghUser" "$projectId" > "$TRIAGE_PROJECT_CACHE_FILE"
  appendTaskStatusRecordToState gh.project-ensure ok ''
  DOTFILES_RUN_SUCCESS_TASKS+=(gh.project-ensure)
}

# Add Priority + Effort single-select fields to the Triage project if absent.
# Status comes pre-seeded by Projects v2 (Todo/In Progress/Done) — we don't alter.
ensureProjectCustomFields(){ local projectNumber=$1 ghUser=$2 pat=$3 fieldsJson existingFieldNames
  fieldsJson=$(GH_TOKEN="$pat" gh project field-list "$projectNumber" --owner "$ghUser" --format json 2>/dev/null||echo '{}')
  existingFieldNames=$(printf '%s' "$fieldsJson"|jq -r '.fields[]?|.name' 2>/dev/null)
  if ! grep -qx Priority <<<"$existingFieldNames";then
    GH_TOKEN="$pat" gh project field-create "$projectNumber" --owner "$ghUser" --name Priority --data-type SINGLE_SELECT \
      --single-select-options 'P0,P1,P2,P3' >/dev/null 2>&1 \
      && emitEcsLogEvent info task.write success gh.project-field 0 '' '' "added Priority field to project #$projectNumber"
  fi
  if ! grep -qx Effort <<<"$existingFieldNames";then
    GH_TOKEN="$pat" gh project field-create "$projectNumber" --owner "$ghUser" --name Effort --data-type SINGLE_SELECT \
      --single-select-options 'XS,S,M,L,XL' >/dev/null 2>&1 \
      && emitEcsLogEvent info task.write success gh.project-field 0 '' '' "added Effort field to project #$projectNumber"
  fi
}

# Wire a repo to the Triage project: sets the two repo VARIABLES that the
# issue-triage workflow reads, plus the PROJECTS_TOKEN repo SECRET that the
# workflow uses to authenticate against user-level Projects v2 (since the
# default GITHUB_TOKEN cannot mutate them). All driven from ~/.agents/.env —
# zero per-repo manual setup. Idempotent (`gh variable/secret set` upsert).
wireRepoToTriageProject(){ local repoSlug=$1 pat
  command -v gh >/dev/null 2>&1||return 0
  [[ -f $TRIAGE_PROJECT_CACHE_FILE ]]||{ emitEcsLogEvent info task.skip success gh.project-wire 0 '' '' "$repoSlug no project cache (set PROJECTS_TOKEN in $AGENTS_ENV_FILE to populate)"; return 0; }
  # shellcheck disable=SC1090
  source "$TRIAGE_PROJECT_CACHE_FILE"
  [[ -n ${TRIAGE_PROJECT_NUMBER:-} && -n ${TRIAGE_PROJECT_OWNER:-} ]]||return 0
  pat=$(loadProjectsTokenFromAgentsEnv)
  gh variable set TRIAGE_PROJECT_NUMBER --body "$TRIAGE_PROJECT_NUMBER" --repo "$repoSlug" >/dev/null 2>&1||return 0
  gh variable set TRIAGE_PROJECT_OWNER  --body "$TRIAGE_PROJECT_OWNER"  --repo "$repoSlug" >/dev/null 2>&1||return 0
  local secretSet=skipped
  if [[ -n $pat ]];then
    if gh secret set PROJECTS_TOKEN --body "$pat" --repo "$repoSlug" >/dev/null 2>&1;then
      secretSet='set'
    else
      secretSet='failed'
    fi
  fi
  emitEcsLogEvent info task.write success gh.project-wire 0 '' '' "$repoSlug -> $TRIAGE_PROJECT_OWNER#$TRIAGE_PROJECT_NUMBER (PROJECTS_TOKEN secret=$secretSet)"
}

runGhApiCommandWithOutcome(){ local taskName=$1 successMessage=$2 output
  shift 2
  if output=$("$@" 2>&1);then
    emitEcsLogEvent info task.write success "$taskName" 0 '' '' "$successMessage"
    return 0
  fi
  output=$(printf '%s' "$output"|tr '\n' ' '|cut -c1-400)
  emitEcsLogEvent warn task.write failure "$taskName" 0 '' '' "$successMessage skipped or denied: $output"
  return 1
}

applyGhApiJsonWithOutcome(){ local taskName=$1 method=$2 endpoint=$3 jsonBody=$4 successMessage=$5 output
  if output=$(gh api -X "$method" "$endpoint" -H "Accept: application/vnd.github+json" --input - 2>&1 <<<"$jsonBody");then
    emitEcsLogEvent info task.write success "$taskName" 0 '' '' "$successMessage"
    return 0
  fi
  output=$(printf '%s' "$output"|tr '\n' ' '|cut -c1-400)
  emitEcsLogEvent warn task.write failure "$taskName" 0 '' '' "$successMessage skipped or denied: $output"
  return 1
}

configureGithubRulesetAutomation(){ local repoSlug=$1 defaultBranch requiredChecksJson statusChecksJson rulesetJson existingRulesetId output rulesetsJson
  command -v gh >/dev/null 2>&1||return 0
  defaultBranch=$(gh repo view "$repoSlug" --json defaultBranchRef -q .defaultBranchRef.name 2>/dev/null||echo)
  [[ -n $defaultBranch ]]||{ emitEcsLogEvent info task.skip success gh.ruleset 0 '' '' "$repoSlug default branch not detected";return 0; }
  if [[ -f $REPO_ROOT/.automation/policy.json ]];then
    requiredChecksJson=$(jq -c '.checks.required // ["shell-lint","yaml-lint","test"]' "$REPO_ROOT/.automation/policy.json" 2>/dev/null||echo '["shell-lint","yaml-lint","test"]')
  else
    requiredChecksJson='["shell-lint","yaml-lint","test"]'
  fi
  statusChecksJson=$(jq -c '[.[] | {context: .}]' <<<"$requiredChecksJson")
  rulesetJson=$(jq -nc --arg branch "$defaultBranch" --argjson checks "$statusChecksJson" '{
    name: "dotfiles universal branch gate",
    target: "branch",
    enforcement: "active",
    conditions: {ref_name: {include: ["refs/heads/" + $branch], exclude: []}},
    rules: [
      {type: "deletion"},
      {type: "non_fast_forward"},
      {type: "pull_request", parameters: {
        required_approving_review_count: 0,
        dismiss_stale_reviews_on_push: false,
        require_code_owner_review: false,
        require_last_push_approval: false,
        required_review_thread_resolution: true
      }},
      {type: "required_status_checks", parameters: {
        strict_required_status_checks_policy: true,
        do_not_enforce_on_create: true,
        required_status_checks: $checks
      }}
    ]
  }')
  if rulesetsJson=$(gh api "repos/${repoSlug}/rulesets" 2>&1);then
    existingRulesetId=$(jq -r '.[] | select(.name=="dotfiles universal branch gate") | .id' <<<"$rulesetsJson" 2>/dev/null|head -n1||true)
  else
    output=$(printf '%s' "$rulesetsJson"|tr '\n' ' '|cut -c1-400)
    emitEcsLogEvent warn task.write failure gh.ruleset 0 '' '' "$repoSlug ruleset list skipped or denied: $output"
    existingRulesetId=''
  fi
  if [[ -n $existingRulesetId ]];then
    if output=$(gh api -X PUT "repos/${repoSlug}/rulesets/${existingRulesetId}" -H "Accept: application/vnd.github+json" --input - 2>&1 <<<"$rulesetJson");then
      emitEcsLogEvent info task.write success gh.ruleset 0 '' '' "$repoSlug ruleset updated checks=$requiredChecksJson"
    else
      output=$(printf '%s' "$output"|tr '\n' ' '|cut -c1-400)
      emitEcsLogEvent warn task.write failure gh.ruleset 0 '' '' "$repoSlug ruleset update skipped or denied: $output"
    fi
  else
    if output=$(gh api -X POST "repos/${repoSlug}/rulesets" -H "Accept: application/vnd.github+json" --input - 2>&1 <<<"$rulesetJson");then
      emitEcsLogEvent info task.write success gh.ruleset 0 '' '' "$repoSlug ruleset created checks=$requiredChecksJson"
    else
      output=$(printf '%s' "$output"|tr '\n' ' '|cut -c1-400)
      emitEcsLogEvent warn task.write failure gh.ruleset 0 '' '' "$repoSlug ruleset create skipped or denied: $output"
    fi
  fi
}

configureGithubDefaultBranchAutomation(){ local repoSlug=$1 defaultBranch requiredChecksJson protectionJson output
  command -v gh >/dev/null 2>&1||return 0
  defaultBranch=$(gh repo view "$repoSlug" --json defaultBranchRef -q .defaultBranchRef.name 2>/dev/null||echo)
  [[ -n $defaultBranch ]]||{ emitEcsLogEvent info task.skip success gh.branch-protection 0 '' '' "$repoSlug default branch not detected";return 0; }
  if [[ -f $REPO_ROOT/.automation/policy.json ]];then
    requiredChecksJson=$(jq -c '.checks.required // ["shell-lint","yaml-lint","test"]' "$REPO_ROOT/.automation/policy.json" 2>/dev/null||echo '["shell-lint","yaml-lint","test"]')
  else
    requiredChecksJson='["shell-lint","yaml-lint","test"]'
  fi
  protectionJson=$(jq -nc --argjson contexts "$requiredChecksJson" '{
    required_status_checks: {strict: true, contexts: $contexts},
    enforce_admins: false,
    required_pull_request_reviews: {
      dismiss_stale_reviews: false,
      require_code_owner_reviews: false,
      required_approving_review_count: 0
    },
    restrictions: null,
    allow_force_pushes: false,
    allow_deletions: false,
    required_linear_history: false,
    required_conversation_resolution: true
  }')
  if output=$(gh api -X PUT "repos/${repoSlug}/branches/${defaultBranch}/protection" \
    -H "Accept: application/vnd.github+json" \
    --input - 2>&1 <<<"$protectionJson");then
    emitEcsLogEvent info task.write success gh.branch-protection 0 '' '' "$repoSlug:$defaultBranch checks=$requiredChecksJson"
  else
    output=$(printf '%s' "$output"|tr '\n' ' '|cut -c1-400)
    emitEcsLogEvent warn task.write failure gh.branch-protection 0 '' '' "$repoSlug:$defaultBranch branch protection update skipped or denied: $output"
  fi
}

# ── Managed-file dispatcher ────────────────────────────────────────────
readonly MANAGED_FILE_PATHS=(LICENSE .gitattributes .gitignore .editorconfig .yamllint.yml .github/dependabot.yml .github/ISSUE_TEMPLATE/config.yml .github/workflows/ci.yml .github/workflows/automerge.yml .github/workflows/security.yml .github/workflows/issue-triage.yml .github/workflows/pr-link-check.yml .github/workflows/gitleaks.yml .github/CODEOWNERS CODE_OF_CONDUCT.md scripts/hero.sh scripts/bin/git-awesome demo/cassette.tape CONTRIBUTING.md SECURITY.md .github/ISSUE_TEMPLATE/bug_report.yml .github/ISSUE_TEMPLATE/feature_request.yml .github/ISSUE_TEMPLATE/research.yml README.md .github/PULL_REQUEST_TEMPLATE.md .agents/AGENTS.md .gitleaks.toml .agents/DESIGN.md)

invokeWriterFunctionByPath(){ case "$1" in
  LICENSE) writeArtifactLicense;;
  .gitattributes) writeArtifactGitattributes;;
  .gitignore) writeArtifactGitignore;;
  .editorconfig) writeArtifactEditorConfig;;
  .yamllint.yml) writeArtifactYamllintConfig;;
  .github/dependabot.yml) writeArtifactDependabotConfig;;
  .github/ISSUE_TEMPLATE/config.yml) writeArtifactIssueTemplateConfig;;
  .github/workflows/ci.yml) writeArtifactCiWorkflowYml;;
  .github/workflows/automerge.yml) writeArtifactAutomergeWorkflow;;
  .github/workflows/security.yml) writeArtifactSecurityWorkflow;;
  .github/CODEOWNERS) writeArtifactCodeowners;;
  CODE_OF_CONDUCT.md) writeArtifactCodeOfConduct;;
  scripts/hero.sh) writeArtifactHeroScript;;
  demo/cassette.tape) writeArtifactCassetteTape;;
  CONTRIBUTING.md) writeArtifactContributingMd;;
  SECURITY.md) writeArtifactSecurityMd;;
  README.md) writeArtifactReadmeMd;;
  .github/PULL_REQUEST_TEMPLATE.md) writeArtifactPullRequestTemplateMd;;
  .github/ISSUE_TEMPLATE/bug_report.yml) writeArtifactBugReportYml;;
  .github/ISSUE_TEMPLATE/feature_request.yml) writeArtifactFeatureRequestYml;;
  .github/ISSUE_TEMPLATE/research.yml) writeArtifactResearchYml;;
  .github/workflows/issue-triage.yml) writeArtifactIssueTriageWorkflow;;
  .github/workflows/pr-link-check.yml) writeArtifactPrLinkCheckWorkflow;;
  scripts/bin/git-awesome) writeArtifactGitAwesome;;
  .agents/AGENTS.md) writeArtifactAgentsMd;;
  .agents/DESIGN.md) writeArtifactDesignMd;;
  .gitleaks.toml) writeArtifactGitleaksToml;;
  .github/workflows/gitleaks.yml) writeArtifactGitleaksWorkflow;;
  *) emitEcsLogEvent warn task.write failure "$1" 0 '' '' "no writer registered for $1";return 1;;
esac;}

dispatchManagedFileTaskByPath(){ local managedPath=$1 filePolicy
  filePolicy=$(resolveFilePolicyByPath "$managedPath")
  shouldExecuteTaskGivenState "$managedPath"||{ emitEcsLogEvent info task.skip success "$managedPath" 0 '' '' state=ok;DOTFILES_RUN_SKIPPED_TASKS+=("$managedPath");return 0;}
  case "$filePolicy" in
    always-deterministic) invokeWriterFunctionByPath "$managedPath"||true;;
    create-deterministic) if isFileStubOrAbsent "$REPO_ROOT/$managedPath";then invokeWriterFunctionByPath "$managedPath"||true;else emitEcsLogEvent info task.skip success "$managedPath" 0 '' '' policy=create-existing-substantive;DOTFILES_RUN_SKIPPED_TASKS+=("$managedPath");fi;;
    create-llm) ((LLM_PROVIDERS_AVAILABLE_COUNT==0))&&{ emitEcsLogEvent info task.skip success "$managedPath" 0 '' '' reason=no-llm-providers;DOTFILES_RUN_SKIPPED_TASKS+=("$managedPath");return 0;}
                if isFileStubOrAbsent "$REPO_ROOT/$managedPath";then invokeWriterFunctionByPath "$managedPath"||true;else emitEcsLogEvent info task.skip success "$managedPath" 0 '' '' policy=create-existing-substantive;DOTFILES_RUN_SKIPPED_TASKS+=("$managedPath");fi;;
    llm-update) ((LLM_PROVIDERS_AVAILABLE_COUNT==0))&&{ emitEcsLogEvent info task.skip success "$managedPath" 0 '' '' reason=no-llm-providers;DOTFILES_RUN_SKIPPED_TASKS+=("$managedPath");return 0;}
                invokeWriterFunctionByPath "$managedPath"||true;;
    skip|*) emitEcsLogEvent info task.skip success "$managedPath" 0 '' '' policy=skip;DOTFILES_RUN_SKIPPED_TASKS+=("$managedPath");;
  esac;}

retireUnsafeLegacyGithubWorkflows(){ local workflowPath archiveDir legacyWorkflowPaths=(
    .github/workflows/ai-reviewer.yml
    .github/workflows/ci-auto-repair.yml
    .github/workflows/auto-repair.yml
    .github/workflows/auto-fix.yml
    .github/workflows/self-repair.yml
    .github/workflows/ai-code-review.yml
    .github/workflows/code-review.yml
    .github/workflows/claude-code-review.yml
    .github/workflows/claude-review.yml
    .github/workflows/codex-review.yml
  )
  for workflowPath in "${legacyWorkflowPaths[@]}";do
    [[ -f $REPO_ROOT/$workflowPath ]]||continue
    archiveDir="$REPO_ROOT/old/$(date -u +%Y%m%d%H%M%S)/.github/workflows"
    mkdir -p "$archiveDir" 2>/dev/null||true
    mv "$REPO_ROOT/$workflowPath" "$archiveDir/" 2>/dev/null||{
      emitEcsLogEvent warn task.cleanup failure "$workflowPath" 0 '' '' "could not retire unsafe legacy workflow"
      continue
    }
    emitEcsLogEvent info task.cleanup success "$workflowPath" 0 '' '' "retired unsafe legacy workflow to ${archiveDir#$REPO_ROOT/}/"
  done
}

# ── Main entry ─────────────────────────────────────────────────────────
emitTerminalRunSummaryEvent(){ local terminalOutcome=success
  ((${#DOTFILES_RUN_FAILED_TASKS[@]}>0))&&terminalOutcome=partial
  local timestampUtc;timestampUtc=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)
  DOTFILES_EVENT_SEQUENCE_COUNTER=$((DOTFILES_EVENT_SEQUENCE_COUNTER+1))
  local successJson failedJson skippedJson deletedJson
  successJson=$(printf '%s\n' "${DOTFILES_RUN_SUCCESS_TASKS[@]:-}"|jq -R . 2>/dev/null|jq -s .)
  failedJson=$(printf '%s\n' "${DOTFILES_RUN_FAILED_TASKS[@]:-}"|jq -R . 2>/dev/null|jq -s .)
  skippedJson=$(printf '%s\n' "${DOTFILES_RUN_SKIPPED_TASKS[@]:-}"|jq -R . 2>/dev/null|jq -s .)
  deletedJson=$(printf '%s\n' "${DOTFILES_RUN_DELETED_TASKS[@]:-}"|jq -R . 2>/dev/null|jq -s .)
  local summaryPayload;summaryPayload=$(jq -nc --arg ts "$timestampUtc" --arg out "$terminalOutcome" --arg svc "$DOTFILES_SERVICE_NAME" --arg trace "$DOTFILES_BOOTSTRAP_RUN_ID" --arg eid "${DOTFILES_BOOTSTRAP_RUN_ID}-${DOTFILES_EVENT_SEQUENCE_COUNTER}" --argjson succ "$successJson" --argjson fail "$failedJson" --argjson skip "$skippedJson" --argjson del "$deletedJson" '{"@timestamp":$ts,"log.level":"info","event.action":"boot.summary","event.outcome":$out,"event.id":$eid,"trace.id":$trace,"service.name":$svc,"labels":{"successes":$succ|map(select(length>0)),"failures":$fail|map(select(length>0)),"skipped":$skip|map(select(length>0)),"deleted":$del|map(select(length>0))}}')
  printf '%s\n' "$summaryPayload" >&2;[[ -n $LOG_FILE ]]&&printf '%s\n' "$summaryPayload" >> "$LOG_FILE"||:;}

cleanupLegacyGitAutomationArtifacts(){
  local repoProfile p deletedAny=0
  repoProfile=${DOTFILES_REPO_PROFILE:-wranngle-house}
  [[ $repoProfile == wranngle-house ]]||{ emitEcsLogEvent info cleanup.skip success cleanup.legacy 0 '' '' "profile=$repoProfile; skipping retired-file cleanup"; return 0; }
  local legacyPaths=(
    .automation/policy.json
    schemas/automation-policy.v1.json
    AUTOMATION.md
    docs/github-conventions.md
    .autosync/policy.env
    .autosync/lease.json
    .autosync/pause
    .autosync/paused
    .git/autosync.pause
    .dotfiles-readme-managed
    scripts/bin/agent-git-guard.sh
    scripts/bin/git-autosync.sh
    scripts/bin/git-conformance
    scripts/bin/git-wip-gc
    scripts/bin/github-hygiene.sh
    scripts/bin/repo-automation.sh
    scripts/bin/gh-issue.sh
  )
  for p in "${legacyPaths[@]}";do
    if [[ -e "$REPO_ROOT/$p" ]];then
      rm -f "$REPO_ROOT/$p" 2>/dev/null||true
      DOTFILES_RUN_DELETED_TASKS+=("$p")
      deletedAny=1
      emitEcsLogEvent info cleanup.delete success cleanup.legacy 0 '' '' "deleted $p"
    fi
  done
  rmdir "$REPO_ROOT/.autosync" 2>/dev/null||true
  rmdir "$REPO_ROOT/.automation" 2>/dev/null||true
  ((deletedAny))||emitEcsLogEvent info cleanup.noop success cleanup.legacy 0 '' '' "no retired artifacts present"
}

bootstrapDirectoryTree(){
  local dir
  # README-only mode needs `logs/` for the bootstrap event log; other dirs are
  # full-bootstrap scaffolding (old/, temp/, docs/) that consumer repos may not
  # want. Skip the cosmetic ones in README-only mode.
  if [[ ${DOTFILES_README_ONLY:-0} == 1 ]];then
    mkdir -p "$REPO_ROOT/logs" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success dirs 0 '' '' "created logs/ (readme-only mode)"
    return
  fi
  for dir in old temp logs docs;do
    mkdir -p "$REPO_ROOT/$dir" 2>/dev/null||true
    touch "$REPO_ROOT/$dir/.gitkeep" 2>/dev/null||true
  done
  emitEcsLogEvent info task.scaffold success dirs 0 '' '' "created basic directory tree"
}

cleanWslPath(){
  if grep -qi microsoft /proc/version 2>/dev/null;then
    PATH=$(printf '%s' "$PATH"|tr ':' '\n'|grep -v '^/mnt/[c-z]/'|paste -sd ':' -)
    export PATH
    emitEcsLogEvent info boot.wsl success path 0 '' '' "stripped windows paths from PATH"
  fi
}

runHostPackageManagerCommand(){ local manager=$1 packageName=$2
  case "$manager" in
    brew) brew install "$packageName";;
    pacman) [[ ${EUID:-$(id -u)} -eq 0 ]]&&pacman -Sy --noconfirm --needed "$packageName"||sudo -n pacman -Sy --noconfirm --needed "$packageName";;
    apt-get) [[ ${EUID:-$(id -u)} -eq 0 ]]&&{ apt-get update -qq&&apt-get install -y -qq "$packageName"; }||sudo -n sh -c "apt-get update -qq && apt-get install -y -qq '$packageName'";;
    dnf) [[ ${EUID:-$(id -u)} -eq 0 ]]&&dnf install -y "$packageName"||sudo -n dnf install -y "$packageName";;
    yum) [[ ${EUID:-$(id -u)} -eq 0 ]]&&yum install -y "$packageName"||sudo -n yum install -y "$packageName";;
    zypper) [[ ${EUID:-$(id -u)} -eq 0 ]]&&zypper --non-interactive install "$packageName"||sudo -n zypper --non-interactive install "$packageName";;
    apk) [[ ${EUID:-$(id -u)} -eq 0 ]]&&apk add --no-cache "$packageName"||sudo -n apk add --no-cache "$packageName";;
    *) return 1;;
  esac
}

installAptZstdIntoLocalBin(){ local tmpDir debPath installRoot
  command -v apt-get >/dev/null 2>&1||return 1
  command -v dpkg-deb >/dev/null 2>&1||return 1
  tmpDir=$(mktemp -d 2>/dev/null)||return 1
  installRoot="${XDG_DATA_HOME:-$HOME/.local/share}/dotfiles/packages/zstd"
  (
    cd "$tmpDir"||exit 1
    apt-get download zstd >/dev/null 2>&1
  )||{ rm -rf "$tmpDir";return 1; }
  debPath=$(find "$tmpDir" -maxdepth 1 -type f -name 'zstd_*.deb' -print -quit)
  [[ -n $debPath && -f $debPath ]]||{ rm -rf "$tmpDir";return 1; }
  rm -rf "$installRoot" 2>/dev/null||true
  mkdir -p "$installRoot" "$HOME/.local/bin" 2>/dev/null||{ rm -rf "$tmpDir";return 1; }
  dpkg-deb -x "$debPath" "$installRoot" >/dev/null 2>&1||{ rm -rf "$tmpDir";return 1; }
  [[ -x $installRoot/usr/bin/zstd ]]||{ rm -rf "$tmpDir";return 1; }
  ln -sf "$installRoot/usr/bin/zstd" "$HOME/.local/bin/zstd"||{ rm -rf "$tmpDir";return 1; }
  ln -sf zstd "$HOME/.local/bin/unzstd"||{ rm -rf "$tmpDir";return 1; }
  PATH="$HOME/.local/bin:$PATH";export PATH
  rm -rf "$tmpDir"
}

installHostCompressionTools(){ local manager=''
  if command -v unzstd >/dev/null 2>&1;then
    emitEcsLogEvent info boot.deps success unzstd 0 '' '' "unzstd already on PATH"
    return 0
  fi
  if [[ ${DOTFILES_SKIP_HOST_PACKAGES:-0} == 1 ]];then
    emitEcsLogEvent warn boot.deps failure unzstd 0 '' '' "DOTFILES_SKIP_HOST_PACKAGES=1; install zstd manually for unzstd"
    return 0
  fi
  for manager in apt-get dnf yum pacman zypper apk brew;do
    command -v "$manager" >/dev/null 2>&1&&break
    manager=''
  done
  [[ -n $manager ]]||{ emitEcsLogEvent warn boot.deps failure unzstd 0 '' '' "no supported host package manager found; install zstd manually";return 0; }
  if runHostPackageManagerCommand "$manager" zstd >/dev/null 2>&1&&command -v unzstd >/dev/null 2>&1;then
    emitEcsLogEvent info boot.deps success unzstd 0 '' '' "installed zstd via $manager"
  elif [[ $manager == apt-get ]]&&installAptZstdIntoLocalBin&&command -v unzstd >/dev/null 2>&1;then
    emitEcsLogEvent info boot.deps success unzstd 0 '' '' "installed zstd user-local via apt package extract"
  else
    emitEcsLogEvent warn boot.deps failure unzstd 0 '' '' "could not install zstd via $manager; install zstd manually for unzstd"
  fi
}

bootstrapDependencies(){
  if ! command -v npm >/dev/null;then emitEcsLogEvent warn boot.deps failure npm 0 '' '' "npm missing, skipping dependency install";return 0;fi
  local missing=0
  if ! command -v gemini >/dev/null;then missing=1;emitEcsLogEvent info boot.deps success gemini 0 '' '' "installing gemini CLI";npm install -g @google/gemini-cli 2>/dev/null||true;fi
  if ! command -v claude >/dev/null;then missing=1;emitEcsLogEvent info boot.deps success claude 0 '' '' "installing claude Code";npm install -g @anthropic-ai/claude-code 2>/dev/null||true;fi
  if ! command -v codex >/dev/null;then missing=1;emitEcsLogEvent info boot.deps success codex 0 '' '' "installing codex CLI";npm install -g @openai/codex 2>/dev/null||true;fi
  ((missing==0))&&emitEcsLogEvent info boot.deps success all 0 '' '' "all CLI dependencies present"||true
}

patchExistingSkills(){
  local skillDir skillName result
  for skillDir in "$HOME/.agents/skills/"* "$REPO_ROOT/.agents/skills/"* "$HOME/.claude/skills/"* "$HOME/.gemini/skills/"* "$HOME/.codex/skills/"*;do
    [[ -d $skillDir && -f "$skillDir/SKILL.md" ]]||continue
    skillName=$(basename "$skillDir")
    case "$skillName" in .*) continue;; esac
    result=$(SKILL_FILE="$skillDir/SKILL.md" SKILL_NAME="$skillName" python3 <<'PY' 2>&1 || true
from pathlib import Path
import os, re, textwrap

path = Path(os.environ["SKILL_FILE"])
fallback_name = os.environ["SKILL_NAME"]

# Slash-command-only frontmatter fields. Belongs in ~/.claude/commands/<name>.md,
# not in a skill's SKILL.md — Gemini and Codex skill loaders ignore these
# silently, but they signal intent confusion. We strip on every run with
# a notification so the user can convert to a proper slash command if needed.
SLASH_COMMAND_ONLY_KEYS = {"user_invocable", "args", "argument-hint", "argument_hint"}

def clean_one_line(value):
    return " ".join(str(value).replace("\r", " ").split())

def block_scalar_indented(value):
    value = clean_one_line(value)
    wrapped = textwrap.wrap(value, width=100, break_long_words=False, break_on_hyphens=False)
    return "\n".join(f"  {line}" for line in (wrapped or ["Skill instructions."]))

def plain_name(value):
    value = clean_one_line(value) or fallback_name
    if re.fullmatch(r"[A-Za-z0-9_.-]+", value):
        return value
    return "'" + value.replace("'", "''") + "'"

def strip_scalar(value):
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
        return value[1:-1]
    return value

text = path.read_text(encoding="utf-8")
front, body = "", text
if text.startswith("---\n"):
    lines = text.splitlines(True)
    close = None
    for index, line in enumerate(lines[1:], start=1):
        if line.strip() == "---":
            close = index
            break
    if close is not None:
        front = "".join(lines[1:close])
        body = "".join(lines[close + 1:])
    else:
        body = "".join(lines[1:])

# Try YAML round-trip first (handles nested structures like pinchtab's
# metadata.openclaw.requires.bins). Fall back to regex sweep on damaged
# frontmatter so we still recover name/description.
parsed = None
try:
    import yaml
    if front:
        loaded = yaml.safe_load(front)
        if isinstance(loaded, dict):
            parsed = loaded
except Exception:
    parsed = None

if parsed is None:
    parsed = {}
    skip_block = False
    for line in front.splitlines():
        if skip_block:
            if line.startswith((" ", "\t")) or not line.strip():
                if line.strip():
                    parsed["description"] = clean_one_line(f"{parsed.get('description','')} {line.strip()}")
                continue
            skip_block = False
        m = re.match(r"^\s*name\s*:\s*(.*)$", line)
        if m:
            parsed["name"] = strip_scalar(m.group(1))
            continue
        m = re.match(r"^\s*description\s*:\s*(.*)$", line)
        if m:
            v = m.group(1).strip()
            if v in {"|", "|-", "|+", ">", ">-", ">+"}:
                parsed["description"] = ""
                skip_block = True
            else:
                parsed["description"] = strip_scalar(v)
            continue

stripped = sorted(k for k in SLASH_COMMAND_ONLY_KEYS if k in parsed)
for k in stripped:
    parsed.pop(k, None)

name = clean_one_line(parsed.pop("name", "")) or fallback_name
description = clean_one_line(parsed.pop("description", "")) or f"Skill instructions for {name}."

# Compose canonical frontmatter: name first, description as folded block scalar
# second, everything else as YAML-serialized extras (alphabetized). This
# preserves nested structures (e.g. pinchtab's metadata block) while
# guaranteeing a deterministic, cross-agent-parseable shape every run.
new_lines = ["---", f"name: {plain_name(name)}", "description: >-", block_scalar_indented(description)]
if parsed:
    try:
        import yaml
        extras_yaml = yaml.safe_dump(parsed, default_flow_style=False, allow_unicode=True, sort_keys=True, width=100).rstrip("\n")
        if extras_yaml:
            new_lines.append(extras_yaml)
    except Exception:
        # YAML missing — bail on extras rather than emit broken content.
        pass
new_lines.append("---")
new_text = "\n".join(new_lines) + "\n\n" + body.lstrip("\n")

if new_text != text:
    path.write_text(new_text, encoding="utf-8")
    if stripped:
        print("changed:dropped=" + ",".join(stripped))
    else:
        print("changed")
else:
    print("ok")
PY
)
    case "$result" in
      changed:dropped=*)
        emitEcsLogEvent info task.skills success "$skillName" 0 '' '' "normalized SKILL.md YAML frontmatter"
        emitEcsLogEvent warn task.skills success "$skillName" 0 '' '' "stripped slash-command-only frontmatter from $skillName/SKILL.md: ${result#changed:dropped=} — move these to ~/.claude/commands/${skillName}.md if you want a slash command";;
      changed) emitEcsLogEvent info task.skills success "$skillName" 0 '' '' "normalized SKILL.md YAML frontmatter";;
      ok) :;;
      *) emitEcsLogEvent warn task.skills failure "$skillName" 0 '' '' "could not normalize SKILL.md: ${result:0:200}";;
    esac
  done
}

bootstrapUnifiedEnv(){
  mkdir -p "$HOME/.agents" "$HOME/.agents/settings" "$HOME/.agents/skills" "$HOME/.claude" "$HOME/.gemini" "$HOME/.codex" 2>/dev/null||true
  touch "$HOME/.agents/.env" 2>/dev/null||true
  chmod 600 "$HOME/.agents/.env" 2>/dev/null||true
  ensureSharedAgentEnvLine "$HOME/.agents/.env" CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS 1
  local target archivePath
  for target in "$HOME/.claude/.env" "$HOME/.gemini/.env" "$HOME/.codex/.env";do
    if [[ ! -L "$target" || $(readlink "$target" 2>/dev/null||printf '') != "$HOME/.agents/.env" ]];then
      if [[ -e "$target" || -L "$target" ]];then
        archivePath=$(archiveExistingPathToProjectOld "$target" env)||{ emitEcsLogEvent warn task.scaffold failure env 0 '' '' "could not archive $target";return 1; }
        emitEcsLogEvent info task.scaffold success env 0 '' '' "archived $target -> ${archivePath#$REPO_ROOT/}"
      fi
      ln -s "$HOME/.agents/.env" "$target" 2>/dev/null||true
      emitEcsLogEvent info task.scaffold success env 0 '' '' "symlinked $target to ~/.agents/.env"
    fi
  done
  touch "$HOME/.agents/AGENTS.md" 2>/dev/null||true
  for target in "$HOME/.claude/CLAUDE.md" "$HOME/.gemini/GEMINI.md" "$HOME/.codex/CODEX.md";do
    if [[ ! -L "$target" || $(readlink "$target" 2>/dev/null||printf '') != "$HOME/.agents/AGENTS.md" ]];then
      if [[ -e "$target" || -L "$target" ]];then
        archivePath=$(archiveExistingPathToProjectOld "$target" env)||{ emitEcsLogEvent warn task.scaffold failure env 0 '' '' "could not archive $target";return 1; }
        emitEcsLogEvent info task.scaffold success env 0 '' '' "archived $target -> ${archivePath#$REPO_ROOT/}"
      fi
      ln -s "$HOME/.agents/AGENTS.md" "$target" 2>/dev/null||true
      emitEcsLogEvent info task.scaffold success env 0 '' '' "symlinked $target to ~/.agents/AGENTS.md"
    fi
  done
  ingestSkillDirectoriesIntoCentralSource "$REPO_ROOT/.agents/skills" "$HOME/.agents/skills" repo
  materializeAgentSkillsFromCentralSource "$HOME/.claude/skills" "$HOME/.agents/skills"
  # Gemini CLI and Codex discover ~/.agents/skills directly. Mirroring those
  # same skills into their agent-local skill dirs creates duplicate or stale
  # visibility. Keep only central there, while preserving Codex's hidden
  # ~/.codex/skills/.system built-ins.
  retireAgentSkillMirrorsToCentralOnly "$HOME/.gemini/skills" "$HOME/.agents/skills"
  retireAgentSkillMirrorsToCentralOnly "$HOME/.codex/skills" "$HOME/.agents/skills"
  ingestOrSeedCentralAgentSetting "$HOME/.claude/settings.json" "$HOME/.agents/settings/claude.json" "$AGENTS_CLAUDE_SETTINGS_JSON_TEMPLATE"
  ingestOrSeedCentralAgentSetting "$HOME/.gemini/settings.json" "$HOME/.agents/settings/gemini.json" "$AGENTS_GEMINI_SETTINGS_JSON_TEMPLATE"
  ingestOrSeedCentralAgentSetting "$HOME/.codex/config.toml"   "$HOME/.agents/settings/codex.toml"  "$AGENTS_CODEX_CONFIG_TOML_TEMPLATE"
  ensureClaudeAgentTeamsSetting "$HOME/.agents/settings/claude.json"
  ensureClaudeAutoUpdatesChannel "$HOME/.agents/settings/claude.json"
  ensureClaudeEditorMode "$HOME/.agents/settings/claude.json"
  ensureClaudePreferredNotifChannel "$HOME/.agents/settings/claude.json"
  ensureClaudeForceLoginMethod "$HOME/.agents/settings/claude.json"
  ensureClaudeRemoveLegacyFields "$HOME/.agents/settings/claude.json"
  ensureClaudeFileCreationGateHook "$HOME/.agents/settings/claude.json"
  ensureClaudeAgentTeamnameHook "$HOME/.agents/settings/claude.json"
  ensureClaudeAgentGitGuardHooks "$HOME/.agents/settings/claude.json"
  ensureCodexModernConfigDefaults "$HOME/.agents/settings/codex.toml"
  ensureCodexAgentGitGuardHooks "$HOME/.agents/settings/codex.toml"
  ensureCodexDotfilesHookTrustState "$HOME/.agents/settings/codex.toml"
  ensureClaudeStatusLineCommand "$HOME/.agents/settings/claude.json"
  installXoSharedConfig
  ensureXoOnPath
  installBunMigrationReference
  installAgentLspRegistry
  ensureAgentLspsInstalled
  symlinkAgentSettingFromCentralSource "$HOME/.claude/settings.json" "$HOME/.agents/settings/claude.json"
  symlinkAgentSettingFromCentralSource "$HOME/.gemini/settings.json" "$HOME/.agents/settings/gemini.json"
  symlinkAgentSettingFromCentralSource "$HOME/.codex/config.toml"    "$HOME/.agents/settings/codex.toml"
  ensureLocalBinOnShellPath
  linkComposioOrchOnPath
  ensureComposioOrchBlockInHomeAgents
  ensureGitAwesomeBlockInHomeAgents
  ensureTestSuiteImperativesBlockInHomeAgents
  ensureAgentAutonomyBlockInHomeAgents
  installSymphony
  installSymphonyDaemonAsSystemdUserUnit
  bootstrapSymphonyInProject
  linkSymphonyOrchOnPath
  ensureSymphonyBlockInHomeAgents
  installGitleaksBinary
  installGitleaksPreCommitHookInProject
}

# Idempotently emit a marker-bracketed `export PATH` snippet into the user's
# shell-rc so $HOME/.local/bin (where linkComposioOrchOnPath lands the
# composio-orch shim) and $HOME/.dotfiles/scripts/bin are guaranteed on PATH
# in every new shell. Without this, a fresh bootstrap relies on the distro's
# default rc to put .local/bin on PATH — true on Ubuntu/Fedora/Arch, but not
# universal. Block content is rewritten in place; user-authored content
# outside the markers is preserved verbatim.
ensureLocalBinOnShellPath(){ local startMarker endMarker rcFiles rcFile body tmp
  startMarker='# >>> dotfiles:composio-orch path <<<'
  endMarker='# <<< dotfiles:composio-orch path >>>'
  body='# Auto-managed by ~/.dotfiles/.dotfiles.sh (ensureLocalBinOnShellPath).
# Edit the function in .dotfiles.sh, not the lines below — they are rewritten on bootstrap.
case ":${PATH}:" in *":${HOME}/.local/bin:"*) ;; *) PATH="${HOME}/.local/bin:${PATH}";; esac
case ":${PATH}:" in *":${HOME}/.dotfiles/scripts/bin:"*) ;; *) PATH="${HOME}/.dotfiles/scripts/bin:${PATH}";; esac
export PATH'
  rcFiles=()
  [[ -e $HOME/.bashrc || -L $HOME/.bashrc ]]&&rcFiles+=("$HOME/.bashrc")
  [[ -e $HOME/.zshrc  || -L $HOME/.zshrc  ]]&&rcFiles+=("$HOME/.zshrc")
  [[ -e $HOME/.profile || -L $HOME/.profile ]]&&rcFiles+=("$HOME/.profile")
  [[ ${#rcFiles[@]} -eq 0 ]]&&{ touch "$HOME/.profile" 2>/dev/null||true; rcFiles+=("$HOME/.profile"); }
  for rcFile in "${rcFiles[@]}";do
    tmp=$(mktemp 2>/dev/null)||continue
    if grep -Fq "$startMarker" "$rcFile" 2>/dev/null;then
      awk -v s="$startMarker" -v e="$endMarker" -v b="$body" '
        BEGIN { skip=0 }
        $0==s { print s; print b; print e; skip=1; next }
        $0==e { skip=0; next }
        skip==0 { print }
      ' "$rcFile" > "$tmp"
    else
      {
        cat "$rcFile" 2>/dev/null||true
        printf '\n%s\n%s\n%s\n' "$startMarker" "$body" "$endMarker"
      } > "$tmp"
    fi
    if [[ -s $tmp ]];then
      mv "$tmp" "$rcFile" 2>/dev/null||rm -f "$tmp" 2>/dev/null
      emitEcsLogEvent info task.scaffold success path-extend 0 '' '' "ensured composio-orch PATH block in ${rcFile#$HOME/}"
    else
      rm -f "$tmp" 2>/dev/null||true
    fi
  done
}

# Symlink the tracked composio-orch shim into ~/.local/bin/, which is on PATH
# in every supported shell config out of the box. Idempotent — replaces stale
# symlinks pointing at the old .sh-suffixed name. Without this step a fresh
# bootstrap would leave child agents groping for the orchestrator path.
linkComposioOrchOnPath(){ local target=$HOME/.local/bin/composio-orch shimPath=$REPO_ROOT/scripts/bin/composio-orch current
  [[ -x $shimPath ]]||return 0
  mkdir -p "$HOME/.local/bin" 2>/dev/null||return 0
  current=$(readlink "$target" 2>/dev/null||printf '')
  if [[ $current == "$shimPath" ]];then
    emitEcsLogEvent info task.scaffold success composio-orch-link 0 '' '' 'composio-orch already on PATH via ~/.local/bin'
    return 0
  fi
  if [[ -e $target || -L $target ]];then
    rm -f "$target" 2>/dev/null||true
  fi
  ln -s "$shimPath" "$target" 2>/dev/null||{ emitEcsLogEvent warn task.scaffold failure composio-orch-link 0 '' '' "could not symlink $target -> $shimPath"; return 0; }
  emitEcsLogEvent info task.scaffold success composio-orch-link 0 '' '' "symlinked $target -> ${shimPath#$HOME/}"
}

# Advisory lint of ~/.agents/.env for malformed COMPOSIO_* variables. The
# orchestrator's canonical shape is `COMPOSIO_<TOOLKIT>_<FIELD>`. Operators
# occasionally hand-type `COMPOSIO_<TOOLKIT>_<SCHEME>_<FIELD>` after seeing
# an auth-config label like `cloudflare:API_KEY:use_custom_auth`; the
# orchestrator's loader can't see those vars and silently treats the
# toolkit as unauthorized. This check warns; it never auto-edits the env
# file (rewriting secrets without operator consent is unsafe).
runComposioEnvLintAdvisory(){
  command -v composio-orch >/dev/null 2>&1||{ emitEcsLogEvent info task.skip success composio-env-lint 0 '' '' 'composio-orch not on PATH'; return 0; }
  [[ -f $HOME/.agents/.env ]]||{ emitEcsLogEvent info task.skip success composio-env-lint 0 '' '' 'no ~/.agents/.env'; return 0; }
  local out rc
  out=$(composio-orch lint-env 2>&1) && rc=0 || rc=$?
  if [[ $rc -eq 0 ]];then
    emitEcsLogEvent info task.scaffold success composio-env-lint 0 '' '' 'composio env vars clean'
  else
    emitEcsLogEvent warn task.scaffold failure composio-env-lint "$rc" '' '' "${out//$'\n'/ | }"
    printf '%s\n' "$out" >&2
  fi
  return 0
}

# Symlink the tracked symphony-orch launcher into ~/.local/bin/, mirroring
# the linkComposioOrchOnPath pattern. Without this step a fresh bootstrap
# would land the file at scripts/bin/symphony-orch but leave it unreachable
# unless the user manually adds scripts/bin to PATH.
linkSymphonyOrchOnPath(){ local target=$HOME/.local/bin/symphony-orch shimPath=$REPO_ROOT/scripts/bin/symphony-orch current
  [[ -x $shimPath ]]||return 0
  mkdir -p "$HOME/.local/bin" 2>/dev/null||return 0
  current=$(readlink "$target" 2>/dev/null||printf '')
  if [[ $current == "$shimPath" ]];then
    emitEcsLogEvent info task.scaffold success symphony-orch-link 0 '' '' 'symphony-orch already on PATH via ~/.local/bin'
    return 0
  fi
  if [[ -e $target || -L $target ]];then
    rm -f "$target" 2>/dev/null||true
  fi
  ln -s "$shimPath" "$target" 2>/dev/null||{ emitEcsLogEvent warn task.scaffold failure symphony-orch-link 0 '' '' "could not symlink $target -> $shimPath"; return 0; }
  emitEcsLogEvent info task.scaffold success symphony-orch-link 0 '' '' "symlinked $target -> ${shimPath#$HOME/}"
}

# Upsert a marker-bracketed "Composio Universal Auth Orchestrator" section at
# the top of ~/.agents/AGENTS.md so every agent reading the central instructions
# file immediately sees the orchestrator's existence and one-line invocation.
# Block content is rewritten on every bootstrap run; user-authored content
# outside the markers is preserved verbatim.
ensureComposioOrchBlockInHomeAgents(){ local agentsPath=$HOME/.agents/AGENTS.md startMarker endMarker tmp
  startMarker='<!-- composio-orchestrator-block:begin -->'
  endMarker='<!-- composio-orchestrator-block:end -->'
  local body
  body='## Composio Universal Auth Orchestrator (read this first)

Any time the user asks an agent to act through an external service (GitHub, Slack,
Gmail, Notion, AWS, Perplexity, anything OAuth- or API-key-gated), the single seam
is the orchestrator at `~/.dotfiles/lib/composio-orchestrator/`. Do not invent a
new auth flow, do not call Composio directly, do not store credentials yourself.

- One-line invocation (PATH-resolved): `composio-orch ensure <toolkit> [userId]`.
  Default `userId` is `cody`. Returns `ACTIVE` (proceed) or `PENDING` with a
  `redirectUrl` (surface to user, do not block).
- Discover the full surface: `composio-orch --help` (subcommands include
  `ensure`, `run`, `pending`, `gc`, `path`, `cache`, `mask`, `register-webhook`,
  `reload-key`).
- If `composio-orch` is not on PATH, the canonical absolute path is
  `~/.dotfiles/scripts/bin/composio-orch` — same flags, same exit semantics.
- Operating principles (cascade order, auth matrix, masking discipline):
  Skill `auth-orchestrator`.
- User-facing CLI surface and pending-auth surfacing rules:
  Skill `composio-auth`.
- Implementation notes and SDK constraints:
  `~/.dotfiles/lib/composio-orchestrator/README.md`.
- Env-var sanity check: `composio-orch lint-env` (catches malformed
  `COMPOSIO_<TOOLKIT>_<SCHEME>_<FIELD>` shapes; canonical is
  `COMPOSIO_<TOOLKIT>_<FIELD>`). Run `composio-orch reload-key` after edits.

A `UserPromptSubmit` hook already prepends `PENDING_AUTH <toolkit> -> <url>` lines
to every prompt while a consent is outstanding. Trust those lines; do not re-poll.'
  mkdir -p "$(dirname "$agentsPath")" 2>/dev/null||true
  [[ -e $agentsPath ]]||: > "$agentsPath"
  tmp=$(mktemp 2>/dev/null)||return 0
  if grep -Fq "$startMarker" "$agentsPath" 2>/dev/null;then
    awk -v s="$startMarker" -v e="$endMarker" -v b="$body" '
      BEGIN { skip=0 }
      $0==s { print s; print b; print e; skip=1; next }
      $0==e { skip=0; next }
      skip==0 { print }
    ' "$agentsPath" > "$tmp"
  else
    {
      printf '%s\n%s\n%s\n\n' "$startMarker" "$body" "$endMarker"
      cat "$agentsPath" 2>/dev/null||true
    } > "$tmp"
  fi
  if [[ -s $tmp ]];then
    mv "$tmp" "$agentsPath" 2>/dev/null||{ rm -f "$tmp" 2>/dev/null; return 0; }
    emitEcsLogEvent info task.scaffold success agents-md-orch-block 0 '' '' "ensured composio-orch block in $agentsPath"
  else
    rm -f "$tmp" 2>/dev/null||true
  fi
}

# Upsert a marker-bracketed "git-awesome" section at the top of
# ~/.agents/AGENTS.md so every agent sees the unified Git automation surface
# and the inline gh-issue function (formerly scripts/bin/gh-issue.sh).
ensureGitAwesomeBlockInHomeAgents(){ local agentsPath=$HOME/.agents/AGENTS.md startMarker endMarker tmp body
  startMarker='<!-- git-awesome-block:begin -->'
  endMarker='<!-- git-awesome-block:end -->'
  body='## git-awesome (unified Git automation)

The single binary at `~/.dotfiles/scripts/bin/git-awesome` replaces the old
`agent-git-guard.sh`, `git-autosync.sh`, `git-conformance`, `git-wip-gc`,
`github-hygiene.sh`, `repo-automation.sh`, and `gh-issue.sh`. Zero per-repo
policy files; defaults are hardcoded in the binary.

Subcommands: `sync` (autostash dirty tree, local-only) ・ `unstash` ・
`guard baseline|finalize` (NDJSON, fails closed) ・ `gc` (drop stashes >30d)
・ `conform` ・ `triage` ・ `repair` ・ `observe` ・ `defaults` ・ `readme-rewrite`.

Global flag: `--dry-run` demotes any mutation to a print-only preview.

Runtime artifacts: `<repo>/.artifacts/git-awesome/` (canonical layout shared with composio-orchestrator):
- `events.<yyyy-mm-dd>.jsonl` — ECS-shaped JSONL event ledger, date-keyed for rotation.
- `stash.<uuid>.patch` — flat patch archive (no subdirectories).
- `baseline.<session>.tsv` — finalizer guard baseline per session.
Cron: `*/15 * * * * /home/wranngle/.dotfiles/scripts/bin/git-awesome sync`.

### Filing issues (inline `gh-issue` function — replaces gh-issue.sh)

```bash
gh-issue() {
  # Usage: gh-issue [-t bug|feat|research] [-a area] "<one-line description>"
  local formType=${GH_ISSUE_DEFAULT_TYPE:-bug} explicitArea="" description
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -t|--type) formType=$2; shift 2;;
      -a|--area) explicitArea=$2; shift 2;;
      *) break;;
    esac
  done
  description=${*:-}; [[ -n $description ]] || { echo "gh-issue: need description" >&2; return 2; }
  [[ $formType =~ ^(bug|feat|research)$ ]] || { echo "gh-issue: -t must be bug|feat|research" >&2; return 2; }
  command -v gh >/dev/null || { echo "gh-issue: gh CLI not found" >&2; return 2; }
  local llm=${LLM_SH:-$(command -v llm.sh || echo "$HOME/.dotfiles/scripts/bin/llm.sh")}
  [[ -x $llm ]] || { echo "gh-issue: llm.sh not found at $llm" >&2; return 2; }
  local repoSlug; repoSlug=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null) \
    || { echo "gh-issue: not in a GitHub repo" >&2; return 2; }
  local sys="You are completing a GitHub issue body. Output strictly raw markdown that matches the headings the form expects: '\''### What & how to reproduce'\'', '\''### Area'\'', '\''### Environment'\'', '\''### Logs / traceback'\'' for a bug; '\''### Problem & Why now'\'', '\''### Proposed approach'\'', '\''### Area'\'', '\''### Alternatives considered'\'' for a feat; '\''### Question / hypothesis'\'', '\''### Deliverable'\'', '\''### Timebox'\'', '\''### Area'\'' for a research. Each heading is followed by a blank line and the value. The Area value MUST be one of: core | cli | api | docs | ci | infra | other. No fences, no commentary."
  local prompt; prompt=$(printf '\''Form: %s\nDescription: %s\nRepo: %s%s\n'\'' "$formType" "$description" "$repoSlug" "${explicitArea:+$'\''\n'\''Area constraint: use $explicitArea}")
  local body; body=$(LLM_SYSTEM="$sys" "$llm" <<<"$prompt" 2>/dev/null) \
    || body=$(printf '\''### What & how to reproduce\n\n%s\n\n### Area\n\n%s\n'\'' "$description" "${explicitArea:-other}")
  gh issue create --repo "$repoSlug" --title "$formType: $description" --body "$body" --label "t.$formType" --label triage
}
```'
  mkdir -p "$(dirname "$agentsPath")" 2>/dev/null||true
  [[ -e $agentsPath ]]||: > "$agentsPath"
  # S16: collision-safety. If a marker pair appears OUTSIDE our intended block
  # (e.g. nested inside another block's body, or pasted by a user), the awk
  # replacer would corrupt content between the foreign occurrences. Detect by
  # counting marker pairs; exactly 0 or 1 of each is safe.
  local startCount endCount
  startCount=$(grep -cF "$startMarker" "$agentsPath" 2>/dev/null||echo 0)
  endCount=$(grep -cF "$endMarker" "$agentsPath" 2>/dev/null||echo 0)
  if (( startCount > 1 || endCount > 1 )); then
    emitEcsLogEvent warn task.scaffold failure agents-md-git-awesome-block 0 '' '' \
      "marker collision: start=$startCount end=$endCount in $agentsPath; refusing to mutate"
    return 0
  fi
  tmp=$(mktemp 2>/dev/null)||return 0
  if grep -Fq "$startMarker" "$agentsPath" 2>/dev/null;then
    awk -v s="$startMarker" -v e="$endMarker" -v b="$body" '
      BEGIN { skip=0 }
      $0==s { print s; print b; print e; skip=1; next }
      $0==e { skip=0; next }
      skip==0 { print }
    ' "$agentsPath" > "$tmp"
  else
    {
      printf '%s\n%s\n%s\n\n' "$startMarker" "$body" "$endMarker"
      cat "$agentsPath" 2>/dev/null||true
    } > "$tmp"
  fi
  if [[ -s $tmp ]];then
    mv "$tmp" "$agentsPath" 2>/dev/null||{ rm -f "$tmp" 2>/dev/null; return 0; }
    emitEcsLogEvent info task.scaffold success agents-md-git-awesome-block 0 '' '' "ensured git-awesome block in $agentsPath"
  else
    rm -f "$tmp" 2>/dev/null||true
  fi
}

# Upsert a marker-bracketed "Test Suite Imperatives" section at the top of
# ~/.agents/AGENTS.md so every agent reads the operator's testing rules.
# Codifies the lessons from the 2026-05-13 test-suite roast + consolidation.
ensureTestSuiteImperativesBlockInHomeAgents(){ local agentsPath=$HOME/.agents/AGENTS.md startMarker endMarker tmp body
  startMarker='<!-- test-suite-imperatives-block:begin -->'
  endMarker='<!-- test-suite-imperatives-block:end -->'
  body='## Test Suite Imperatives

**One test file per project.** Naming: `tests/<project>.bats` for shell, `<file>.test.ts` colocated for TypeScript. Stop bifurcating into "happy-path"/"spiritual", "unit"/"integration", "smoke"/"exhaustive" — that is author vanity. Group by concern inside the file with comment headers. Multiple files multiply maintenance overhead without adding signal.

**Banned test categories (delete on sight):**
- Syntax-only checks (`bash -n`, `tsc --noEmit`) — belong in a pre-commit hook or CI lint job, not a test.
- Presence-of-string assertions that do not verify behavior (e.g. "grep `TTL=30` in binary" — proves the literal exists, NOT that the binary uses it).
- Help-text smoke tests, "unknown command exits 2" tests, "prints usage on no args" tests — these catch typos in usage strings only.
- Tests that mock the system-under-test (mocking what you are testing returns the mock; useless).
- Coverage tests that do not assert behavior (line coverage ≠ outcome verification).

**Outcome > implementation.** A test that breaks on every refactor without ever catching a real bug is pure cost. Write tests against the contract (inputs → outputs, side-effect ledger, exit codes), not against the function shape.

**Central-promise e2e test is non-negotiable.** Every project has one product promise. If you cannot name it in one sentence, you do not understand the project. Write the e2e test FIRST. Only then write unit tests for the components.

**Doctrine-drift tests are required whenever a constant lives in 2+ files.** Skill/doctrine ↔ code, code ↔ workflow, code ↔ config. Bidirectional drift between truth sources is the most common silent regression class. One test per coupling.

**Wire to CI before claiming done.** A test suite that runs only on demand is a coverage report, not a quality gate. CI integration is the gating criterion for "test work complete" — not local green.

**Concurrency, failure-visibility, migration, and idempotency are first-class.** Bugs in these surfaces are the most expensive and the least likely to be caught by happy-path testing. Allocate budget for them up front, not as "nice-to-have" follow-ups.

**Test names describe the behavior under test, not the function being called.** `"sync de-dup: quiet dirty tree does not multiply stashes"` over `"test_sync_function"`. The test name is documentation; treat it as such. Banned AI-isms (`spiritual`, `comprehensive`, `robust`) apply to test names too.

**Dry-run / no-op paths get their own test.** Every mutating subcommand must have a `--dry-run` test that asserts zero side effects. If the escape hatch is leaky, the framework loses its only safety valve.

**The roast loop is mandatory after writing tests.** After the suite passes green, ask one more time: which of these would actually fail when the product breaks? Delete the ones that would not. Coverage % is irrelevant; signal density is everything.'
  mkdir -p "$(dirname "$agentsPath")" 2>/dev/null||true
  [[ -e $agentsPath ]]||: > "$agentsPath"
  local startCount endCount
  startCount=$(grep -cF "$startMarker" "$agentsPath" 2>/dev/null||echo 0)
  endCount=$(grep -cF "$endMarker" "$agentsPath" 2>/dev/null||echo 0)
  if (( startCount > 1 || endCount > 1 )); then
    emitEcsLogEvent warn task.scaffold failure agents-md-test-imperatives-block 0 '' '' \
      "marker collision: start=$startCount end=$endCount in $agentsPath; refusing to mutate"
    return 0
  fi
  tmp=$(mktemp 2>/dev/null)||return 0
  if grep -Fq "$startMarker" "$agentsPath" 2>/dev/null;then
    awk -v s="$startMarker" -v e="$endMarker" -v b="$body" '
      BEGIN { skip=0 }
      $0==s { print s; print b; print e; skip=1; next }
      $0==e { skip=0; next }
      skip==0 { print }
    ' "$agentsPath" > "$tmp"
  else
    {
      printf '%s\n%s\n%s\n\n' "$startMarker" "$body" "$endMarker"
      cat "$agentsPath" 2>/dev/null||true
    } > "$tmp"
  fi
  if [[ -s $tmp ]];then
    mv "$tmp" "$agentsPath" 2>/dev/null||{ rm -f "$tmp" 2>/dev/null; return 0; }
    emitEcsLogEvent info task.scaffold success agents-md-test-imperatives-block 0 '' '' "ensured test-suite-imperatives block in $agentsPath"
  else
    rm -f "$tmp" 2>/dev/null||true
  fi
}

# Upsert a marker-bracketed "Agent Autonomy" section at the top of
# ~/.agents/AGENTS.md. Codifies the 2026-05-13 operator directive: stop
# asking questions, infer intent from blueprint (skills, md files, working
# patterns), resolve all bugs/opportunities found, never end a turn with
# pending work, and when unclear default to bringing the repo into
# coherence / hygiene / alignment / elegance / simplicity.
ensureAgentAutonomyBlockInHomeAgents(){ local agentsPath=$HOME/.agents/AGENTS.md startMarker endMarker tmp body
  startMarker='<!-- agent-autonomy-block:begin -->'
  endMarker='<!-- agent-autonomy-block:end -->'
  body='## Agent Autonomy (operator directive 2026-05-13)

When you respond, take actions, and make decisions, the user or operator has no idea what you are talking about and has already created a blueprint for decision-making which is embodied through various skills and md files and known working patterns of code and architecture. There is no reason for you to ask questions. The user'"'"'s intent can be fully inferred from their original request in the greater context of the business goal, even if disparate to other parallel or previous sessions. You do not need permission to make elegant and well-planned, well-executed, and validated decisions. The user is not able to assist you. All flaws, bugs, and opportunities for improvement that you find are fully in your scope to resolve. Do not stop your turn with any work still pending. If the pending work is unclear, then bring the entire repobase and architecture into further coherence, hygiene, alignment, elegance, beauty, and simplicity.

**How to apply.** Before drafting a question, search the existing blueprint (skills under `~/.agents/skills/`, `~/.claude/CLAUDE.md`, `~/.agents/AGENTS.md`, README spec, canonical memory entries, working code patterns). The answer is almost always already authored — your job is to recognize it and execute. If the operator has previously decided on a convention (artifact layout, naming, deployment path, schema), reuse it verbatim; do not invent parallel alternatives.

**When unclear, default to action, not inquiry.** Pick the most defensible option that aligns with the blueprint, ship it, and surface it succinctly in the turn summary. Reversibility is cheap (git, archive dirs, idempotent migrators); paralysis is expensive. The only legitimate blockers are credentials you do not have and irreversible destructive ops on shared systems — those still require operator confirmation per the standard safety protocol.

**Coherence work has standing scope.** Any time the active task hits a stopping point and the operator has not specifically scoped what is next, the implicit next task is to find one drift / inconsistency / redundancy / abstraction-bloat / dead code site and resolve it. Doctrine drift between `.md` and binaries, scattered runtime paths, duplicate helpers, half-finished migrations, stale references — these are all in scope without further prompting.'
  mkdir -p "$(dirname "$agentsPath")" 2>/dev/null||true
  [[ -e $agentsPath ]]||: > "$agentsPath"
  local startCount endCount
  startCount=$(grep -cF "$startMarker" "$agentsPath" 2>/dev/null||echo 0)
  endCount=$(grep -cF "$endMarker" "$agentsPath" 2>/dev/null||echo 0)
  if (( startCount > 1 || endCount > 1 )); then
    emitEcsLogEvent warn task.scaffold failure agents-md-autonomy-block 0 '' '' \
      "marker collision: start=$startCount end=$endCount in $agentsPath; refusing to mutate"
    return 0
  fi
  tmp=$(mktemp 2>/dev/null)||return 0
  if grep -Fq "$startMarker" "$agentsPath" 2>/dev/null;then
    awk -v s="$startMarker" -v e="$endMarker" -v b="$body" '
      BEGIN { skip=0 }
      $0==s { print s; print b; print e; skip=1; next }
      $0==e { skip=0; next }
      skip==0 { print }
    ' "$agentsPath" > "$tmp"
  else
    {
      printf '%s\n%s\n%s\n\n' "$startMarker" "$body" "$endMarker"
      cat "$agentsPath" 2>/dev/null||true
    } > "$tmp"
  fi
  if [[ -s $tmp ]];then
    mv "$tmp" "$agentsPath" 2>/dev/null||{ rm -f "$tmp" 2>/dev/null; return 0; }
    emitEcsLogEvent info task.scaffold success agents-md-autonomy-block 0 '' '' "ensured agent-autonomy block in $agentsPath"
  else
    rm -f "$tmp" 2>/dev/null||true
  fi
}

# ── Symphony orchestrator (Elixir/OTP) ────────────────────────────────
# Build the global escript at ~/.dotfiles/lib/symphony-elixir/bin/symphony
# once per bootstrap. mise pins Elixir+Erlang globally; we just need to
# `mix deps.get` and `mix escript.build` whenever the lockfile changes.
# Idempotent: hashes mix.lock + mix.exs to a stamp file and skips the
# build when nothing has changed.
installSymphony(){ local symphonyHome=$REPO_ROOT/lib/symphony-elixir stampFile lockHash currentHash
  [[ -d $symphonyHome ]]||{ emitEcsLogEvent warn task.scaffold failure symphony-install 0 '' '' "lib/symphony-elixir missing"; return 0; }
  command -v mix >/dev/null||{ emitEcsLogEvent warn task.scaffold failure symphony-install 0 '' '' 'mix not on PATH (mise install elixir?)'; return 0; }
  stampFile=$STATE_DIRECTORY/symphony-install.sha256
  lockHash=$(sha256sum "$symphonyHome/mix.lock" "$symphonyHome/mix.exs" 2>/dev/null|sha256sum|cut -c1-16)
  currentHash=$(cat "$stampFile" 2>/dev/null||printf '')
  if [[ -x $symphonyHome/bin/symphony && $lockHash == "$currentHash" && $FORCE != 1 ]];then
    emitEcsLogEvent info task.scaffold success symphony-install 0 '' '' 'symphony escript current'
    return 0
  fi
  ( cd "$symphonyHome" && mix deps.get >/dev/null 2>&1 && mix escript.build >/dev/null 2>&1 )||{
    emitEcsLogEvent warn task.scaffold failure symphony-install 0 '' '' 'mix deps.get + escript.build failed'
    return 0
  }
  printf '%s\n' "$lockHash" > "$stampFile" 2>/dev/null||true
  emitEcsLogEvent info task.scaffold success symphony-install 0 '' '' "built symphony escript at lib/symphony-elixir/bin/symphony"
}

# Opt-in: install the symphony-daemon as a systemd --user unit so a fresh
# bootstrap lands with the orchestrator self-hosting. Gated on
# SYMPHONY_AUTOSTART=1 (default no-op) and on `systemctl --user` actually
# working (skips on WSL-without-systemd, containers without a user manager).
# Idempotent: archives a divergent existing unit before overwrite, and
# `enable --now` is a no-op when the service is already active.
installSymphonyDaemonAsSystemdUserUnit(){ local templatePath unitPath archiveRc=0 cpRc=0 reloadRc=0 enableRc=0 totalRc
  [[ ${SYMPHONY_AUTOSTART:-} == 1 ]]||return 0
  systemctl --user status default.target >/dev/null 2>&1||return 0
  templatePath=$REPO_ROOT/scripts/bin/symphony-daemon.systemd.template
  unitPath=$HOME/.config/systemd/user/symphony.service
  [[ -f $templatePath ]]||{ emitEcsLogEvent warn dotfiles.symphony.daemon_install failure symphony-daemon 0 '' '' "template missing: $templatePath"; return 0; }
  mkdir -p "$(dirname "$unitPath")" 2>/dev/null||true
  if [[ -e $unitPath ]] && ! cmp -s "$templatePath" "$unitPath";then
    archiveExistingPathToProjectOld "$unitPath" symphony-daemon >/dev/null||archiveRc=$?
  fi
  cp "$templatePath" "$unitPath" 2>/dev/null||cpRc=$?
  systemctl --user daemon-reload >/dev/null 2>&1||reloadRc=$?
  systemctl --user enable --now symphony.service >/dev/null 2>&1||enableRc=$?
  totalRc=$(( archiveRc | cpRc | reloadRc | enableRc ))
  if (( totalRc == 0 ));then
    emitEcsLogEvent info dotfiles.symphony.daemon_install success symphony-daemon 0 '' '' "installed and enabled symphony.service"
  else
    emitEcsLogEvent warn dotfiles.symphony.daemon_install failure symphony-daemon 0 '' '' "exit codes archive=$archiveRc cp=$cpRc daemon-reload=$reloadRc enable=$enableRc"
  fi
}

# Stamp per-project consumption surface inside the *target* project (not
# the dotfiles repo). Drops bin/symphony shim, .symphony/issues/{todo,
# in_progress,done} skeleton, .symphony/workspaces gitignore line, and
# WORKFLOW.md template if missing. Idempotent: never overwrites a
# customized shim or pre-existing WORKFLOW.md / issue files.
#
# Skip when this IS the dotfiles repo (we don't bootstrap symphony into
# itself; the runtime + drift docs already live here). Skip when target
# project lacks a git root (we anchor the shim's --workflow path off
# `git rev-parse --show-toplevel`).
bootstrapSymphonyInProject(){ local targetRoot=$REPO_ROOT shimPath wfPath state
  [[ $targetRoot == "$HOME/.dotfiles" ]]&&{ emitEcsLogEvent info task.scaffold success symphony-bootstrap 0 '' '' 'skipped: dotfiles repo is the host, not a consumer'; return 0; }
  ( cd "$targetRoot" && git rev-parse --show-toplevel >/dev/null 2>&1 )||{
    emitEcsLogEvent info task.scaffold success symphony-bootstrap 0 '' '' 'skipped: target is not a git repo'; return 0
  }
  shimPath=$targetRoot/bin/symphony
  mkdir -p "$targetRoot/bin" 2>/dev/null||true
  if [[ ! -e $shimPath ]];then
    cat > "$shimPath" <<'SYMPHONY_SHIM_EOF'
#!/usr/bin/env bash
# symphony shim — delegates to the global dotfiles install.
# Override SYMPHONY_HOME to point at a different symphony tree.
set -euo pipefail
          export PUPPETEER_SKIP_DOWNLOAD=true
          export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
SYMPHONY_HOME="${SYMPHONY_HOME:-$HOME/.dotfiles/lib/symphony-elixir}"
ESCRIPT="$SYMPHONY_HOME/bin/symphony"
[[ -x $ESCRIPT ]]||{ printf 'symphony shim: escript missing at %s — run `dotfiles bootstrap` to build it\n' "$ESCRIPT" >&2; exit 1; }
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null||pwd)
# `escript` (the runtime that interprets the built artifact) lives in the
# mise-managed Erlang install. Add the active Erlang/Elixir bins to PATH
# so the shim works in any shell, including ones that haven't sourced
# `mise activate`. Falls back gracefully when mise is missing.
if command -v mise >/dev/null 2>&1;then
  for tool in erlang elixir;do
    binDir=$(mise where "$tool" 2>/dev/null|sed 's:$:/bin:')
    [[ -d $binDir ]]&&PATH="$binDir:$PATH"
  done
  export PATH
fi
exec "$ESCRIPT" --workflow "$PROJECT_ROOT/WORKFLOW.md" "$@"
SYMPHONY_SHIM_EOF
    chmod +x "$shimPath" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success symphony-bootstrap 0 '' '' "stamped bin/symphony shim in $targetRoot"
  fi
  for state in todo in_progress 'done';do
    mkdir -p "$targetRoot/.symphony/issues/$state" 2>/dev/null||true
    [[ -e $targetRoot/.symphony/issues/$state/.gitkeep ]]||touch "$targetRoot/.symphony/issues/$state/.gitkeep" 2>/dev/null||true
  done
  if [[ -f $targetRoot/.gitignore ]] && ! grep -Fq ".symphony/" "$targetRoot/.gitignore" 2>/dev/null;then
    printf '\n# Symphony per-issue scratch workspaces (regenerated on demand)\n.symphony/\n' >> "$targetRoot/.gitignore" 2>/dev/null||true
  fi
  wfPath=$targetRoot/WORKFLOW.md
  if [[ ! -e $wfPath ]];then
    cat > "$wfPath" <<'WORKFLOW_TEMPLATE_EOF'
---
workflow_name: project-symphony

tracker:
  kind: local_markdown
  issues_root: .symphony/issues
  active_states:
    - todo
    - in_progress
  terminal_states:
    - done
    - cancelled
    - duplicate

polling:
  interval_ms: 30000

workspace:
  root: .symphony/workspaces

agent:
  command: scripts/bin/llm.sh
  max_concurrent_agents: 1

codex:
  command: scripts/bin/llm.sh
  read_timeout_ms: 5000
  turn_timeout_ms: 3600000
---
# Project Symphony Workflow

You are operating inside this project. Complete the assigned task using the repository's local knowledge base and validation loops.

Replace this prompt body with project-specific guidance once the bootstrap stub is no longer useful.
WORKFLOW_TEMPLATE_EOF
    emitEcsLogEvent info task.scaffold success symphony-bootstrap 0 '' '' "stamped WORKFLOW.md template in $targetRoot"
  fi
  emitEcsLogEvent info task.scaffold success symphony-bootstrap 0 '' '' "symphony consumption surface ready in $targetRoot"
}

# Upsert a marker-bracketed Symphony orchestrator section near the top of
# ~/.agents/AGENTS.md so every agent reading the central instructions
# file knows symphony is available, where it lives globally, and what
# the per-project shim looks like.
ensureSymphonyBlockInHomeAgents(){ local agentsPath=$HOME/.agents/AGENTS.md startMarker endMarker tmp body
  startMarker='<!-- symphony-orchestrator-block:begin -->'
  endMarker='<!-- symphony-orchestrator-block:end -->'
  body='## Symphony Orchestrator (read this first when polling-loop work matters)

Long-running OTP daemon that polls a tracker (`tracker.kind` in `WORKFLOW.md`),
dispatches one agent per active issue into a per-issue workspace, reconciles
every tick, and exposes a JSON snapshot API + LiveView dashboard. Lives at
`~/.dotfiles/lib/symphony-elixir/`.

- Per-project entry point: `./bin/symphony <subcommand>` (the bootstrap stamps
  this shim in every consumer repo). Subcommands: `validate`, `list`,
  `once [--dry-run] [--limit N]`, `serve [--port N] [--host H]`.
- Each project has its own `WORKFLOW.md` (tracker config + prompt template) and
  `.symphony/issues/{todo,in_progress,done}/` (markdown-per-issue tracker source
  for the default `local_markdown` adapter).
- Tracker adapters available: `local_markdown` (default, on-disk),
  `github_issues` (`gh` CLI), `linear` (GraphQL), `noop`, `linear_memory`
  (test variant).
- HTTP API on the dashboard port: `GET /api/v1/state`,
  `GET /api/v1/:issue_identifier`, `POST /api/v1/refresh`.
- Spec compliance: `mix specs.check` (static `@spec` linter),
  `mix symphony.spec_compliance` (runtime conformance check).
- Apache-2.0 (derivative of `openai/symphony`); see
  `lib/symphony-elixir/{LICENSE-APACHE-2.0,NOTICE,docs/references/}`.

If `./bin/symphony` is missing in a project, run `dotfiles` to bootstrap it.
Override the global install path with `SYMPHONY_HOME=/path/to/symphony` env.'
  mkdir -p "$(dirname "$agentsPath")" 2>/dev/null||true
  [[ -e $agentsPath ]]||: > "$agentsPath"
  tmp=$(mktemp 2>/dev/null)||return 0
  if grep -Fq "$startMarker" "$agentsPath" 2>/dev/null;then
    awk -v s="$startMarker" -v e="$endMarker" -v b="$body" '
      BEGIN { skip=0 }
      $0==s { print s; print b; print e; skip=1; next }
      $0==e { skip=0; next }
      skip==0 { print }
    ' "$agentsPath" > "$tmp"
  else
    {
      printf '%s\n%s\n%s\n\n' "$startMarker" "$body" "$endMarker"
      cat "$agentsPath" 2>/dev/null||true
    } > "$tmp"
  fi
  if [[ -s $tmp ]];then
    mv "$tmp" "$agentsPath" 2>/dev/null||{ rm -f "$tmp" 2>/dev/null; return 0; }
    emitEcsLogEvent info task.scaffold success agents-md-symphony-block 0 '' '' "ensured symphony block in $agentsPath"
  else
    rm -f "$tmp" 2>/dev/null||true
  fi
}

# ── gitleaks: binary install + per-repo pre-commit hook ───────────────
# Pinned version. Override via DOTFILES_GITLEAKS_VERSION=8.x.y env.
GITLEAKS_PINNED_VERSION="${DOTFILES_GITLEAKS_VERSION:-8.30.1}"

# Install gitleaks binary to ~/.local/bin/gitleaks. Idempotent: when an
# existing binary already reports the pinned version, no work is done.
# Tries mise first (uses the user's existing tool-version manager), then
# falls back to a direct GitHub-release tarball download. mise's gitleaks
# plugin is via the asdf community plugin tree.
installGitleaksBinary(){ local pinnedVersion="$GITLEAKS_PINNED_VERSION" installedVersion='' targetBin osName archName archAlias tarballUrl tarballPath tmpExtractDir
  if command -v gitleaks >/dev/null 2>&1;then
    installedVersion=$(gitleaks version 2>/dev/null|awk '{print $NF}'|sed 's/^v//')
    if [[ $installedVersion == "$pinnedVersion" && $FORCE != 1 ]];then
      emitEcsLogEvent info task.scaffold success gitleaks-install 0 '' '' "gitleaks $installedVersion already on PATH"
      return 0
    fi
  fi
  # Path 1: mise. The dotfiles ecosystem already uses mise for Erlang/Elixir,
  # so prefer it when present — gives the user a single tool-pinning surface.
  if command -v mise >/dev/null 2>&1;then
    if mise use --global "gitleaks@${pinnedVersion}" >/dev/null 2>&1;then
      hash -r 2>/dev/null||true
      installedVersion=$(gitleaks version 2>/dev/null|awk '{print $NF}'|sed 's/^v//'||true)
      if [[ $installedVersion == "$pinnedVersion" ]];then
        emitEcsLogEvent info task.scaffold success gitleaks-install 0 '' '' "mise pinned gitleaks@${pinnedVersion}"
        return 0
      fi
      emitEcsLogEvent info task.scaffold success gitleaks-install 0 '' '' "mise pinned gitleaks@${pinnedVersion}; active PATH still reports ${installedVersion:-unknown}, installing ~/.local/bin copy"
    fi
    # Plugin missing — fall through to tarball install.
  fi
  # Path 2: GitHub release tarball -> ~/.local/bin/gitleaks.
  mkdir -p "$HOME/.local/bin" 2>/dev/null||true
  targetBin="$HOME/.local/bin/gitleaks"
  osName=$(uname -s|tr '[:upper:]' '[:lower:]')
  archName=$(uname -m)
  case "$archName" in
    x86_64|amd64) archAlias=x64;;
    aarch64|arm64) archAlias=arm64;;
    armv7l|armv6l) archAlias=armv7;;
    *) emitEcsLogEvent warn task.scaffold failure gitleaks-install 0 '' '' "unsupported arch $archName"; return 0;;
  esac
  case "$osName" in
    linux|darwin) :;;
    *) emitEcsLogEvent warn task.scaffold failure gitleaks-install 0 '' '' "unsupported os $osName"; return 0;;
  esac
  tarballUrl="https://github.com/gitleaks/gitleaks/releases/download/v${pinnedVersion}/gitleaks_${pinnedVersion}_${osName}_${archAlias}.tar.gz"
  tarballPath=$(mktemp --suffix=.tar.gz 2>/dev/null||mktemp)
  if ! curl -fsSL --max-time 30 "$tarballUrl" -o "$tarballPath" 2>/dev/null;then
    rm -f "$tarballPath" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure gitleaks-install 0 '' '' "tarball download failed: $tarballUrl"
    return 0
  fi
  tmpExtractDir=$(mktemp -d 2>/dev/null)||{ rm -f "$tarballPath" 2>/dev/null||true; return 0;}
  if ! tar -xzf "$tarballPath" -C "$tmpExtractDir" gitleaks 2>/dev/null;then
    rm -rf "$tmpExtractDir" 2>/dev/null||true
    rm -f "$tarballPath" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure gitleaks-install 0 '' '' "tarball extract failed"
    return 0
  fi
  mv "$tmpExtractDir/gitleaks" "$targetBin" 2>/dev/null||{ rm -rf "$tmpExtractDir" 2>/dev/null||true; rm -f "$tarballPath" 2>/dev/null||true; return 0;}
  chmod +x "$targetBin" 2>/dev/null||true
  rm -rf "$tmpExtractDir" 2>/dev/null||true
  rm -f "$tarballPath" 2>/dev/null||true
  emitEcsLogEvent info task.scaffold success gitleaks-install 0 '' '' "installed gitleaks ${pinnedVersion} -> ${targetBin#$HOME/}"
}

# Stamp a marker-bracketed pre-commit hook into the target repo so every
# commit is scanned by gitleaks. Three states:
#   - no hook present       → write our entire hook (with shebang)
#   - hook with markers     → splice managed block in place (idempotent)
#   - hook without markers  → append managed block at the end so user's
#                             existing checks still run first
# Skip when target has no .git/ (e.g., raw filesystem deploys). Operators
# can bypass on demand with `SKIP_GITLEAKS=1 git commit ...`.
installGitleaksPreCommitHookInProject(){ local targetRoot=$REPO_ROOT hookPath startMarker endMarker body wrapped tmp
  ( cd "$targetRoot" && git rev-parse --show-toplevel >/dev/null 2>&1 )||{
    emitEcsLogEvent info task.scaffold success gitleaks-hook 0 '' '' 'skipped: target is not a git repo'; return 0
  }
  hookPath="$targetRoot/.git/hooks/pre-commit"
  mkdir -p "$(dirname "$hookPath")" 2>/dev/null||true
  startMarker='# >>> dotfiles-managed gitleaks pre-commit (do not edit between markers) >>>'
  endMarker='# <<< dotfiles-managed gitleaks pre-commit <<<'
  body='if [[ ${SKIP_GITLEAKS:-0} == 1 ]]; then
  : # operator-acknowledged bypass for this commit
elif command -v gitleaks >/dev/null 2>&1; then
  if ! gitleaks git --staged --redact --no-banner; then
    printf "\n[gitleaks] Commit blocked by secret-scan. To bypass for this commit only:\n  SKIP_GITLEAKS=1 git commit ...\n\n" >&2
    exit 1
  fi
fi'
  wrapped="$startMarker
$body
$endMarker"
  if [[ ! -e $hookPath ]];then
    {
      printf '#!/usr/bin/env bash\nset -e\n\n'
      printf '%s\n' "$wrapped"
    } > "$hookPath"
    chmod +x "$hookPath" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success gitleaks-hook 0 '' '' "stamped pre-commit hook with gitleaks block"
    return 0
  fi
  tmp=$(mktemp 2>/dev/null)||return 0
  if grep -Fq "$startMarker" "$hookPath" 2>/dev/null;then
    awk -v s="$startMarker" -v e="$endMarker" -v b="$wrapped" '
      BEGIN { inblk=0; replaced=0 }
      $0 == s { inblk=1; if(!replaced){ print b; replaced=1 } next }
      $0 == e { inblk=0; next }
      !inblk  { print }
    ' "$hookPath" > "$tmp"
  else
    {
      cat "$hookPath" 2>/dev/null||true
      printf '\n%s\n' "$wrapped"
    } > "$tmp"
  fi
  if [[ -s $tmp ]];then
    mv "$tmp" "$hookPath" 2>/dev/null||{ rm -f "$tmp" 2>/dev/null; return 0; }
    chmod +x "$hookPath" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success gitleaks-hook 0 '' '' "ensured gitleaks block in pre-commit hook"
  else
    rm -f "$tmp" 2>/dev/null||true
  fi
}

ingestOrSeedCentralAgentSetting(){ local existingPath=$1 centralPath=$2 fallbackContent=$3 timestamp
  [[ -f $centralPath ]]&&return 0
  if [[ -f $existingPath && ! -L $existingPath ]];then
    cp "$existingPath" "$centralPath" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success settings 0 '' '' "ingested $existingPath -> $centralPath"
  else
    printf '%s\n' "$fallbackContent" > "$centralPath" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success settings 0 '' '' "seeded default $centralPath"
  fi
}

ensureSharedAgentEnvLine(){ local envPath=$1 key=$2 value=$3 desired tmp archivePath
  [[ -f $envPath ]]||return 0
  desired="$key=$value"
  tmp=$(mktemp 2>/dev/null)||return 1
  if ! awk -v key="$key" -v desired="$desired" '
    BEGIN { marker = key "="; wrote = 0 }
    {
      line = $0
      pos = index(line, marker)
      if (pos > 1) {
        prefix = substr(line, 1, pos - 1)
        if (prefix != "") print prefix
        line = substr(line, pos)
      }
      if (index(line, marker) == 1) {
        if (!wrote) {
          print desired
          wrote = 1
        }
        next
      }
      print line
    }
    END { if (!wrote) print desired }
  ' "$envPath" > "$tmp" 2>/dev/null;then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure env 0 '' '' "could not normalize $key in $envPath"
    return 0
  fi
  if cmp -s "$envPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success env 0 '' '' "$key already present in $envPath"
    return 0
  fi
  if [[ ! -s $envPath ]];then
    mv "$tmp" "$envPath" 2>/dev/null||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure env 0 '' '' "could not seed $envPath";return 1; }
    chmod 600 "$envPath" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success env 0 '' '' "seeded $key in empty $envPath"
    return 0
  fi
  archivePath=$(archiveExistingPathToProjectOld "$envPath" env)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure env 0 '' '' "could not archive $envPath";return 1; }
  mv "$tmp" "$envPath" 2>/dev/null||{ mv "$archivePath" "$envPath" 2>/dev/null||true;rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure env 0 '' '' "could not update $envPath";return 1; }
  chmod 600 "$envPath" 2>/dev/null||true
  emitEcsLogEvent info task.scaffold success env 0 '' '' "normalized $key in $envPath old=${archivePath#$REPO_ROOT/}"
}

ensureCodexModernConfigDefaults(){ local centralPath=$1 tmp archivePath
  # Keep Codex's shared config on current stable keys. Codex 0.130 renamed the
  # lifecycle-hook feature flag from `codex_hooks` to `hooks`; the status line is
  # also persisted as `tui.status_line`, so stamp a compact default for fresh
  # machines while preserving any user-customized status_line.
  [[ -f $centralPath ]]||return 0
  tmp=$(mktemp --suffix=.toml 2>/dev/null||mktemp)||return 1
  if ! awk '
    function flush_features() {
      if (in_features && !feature_hooks_seen) print "hooks = true"
      in_features = 0
    }
    function flush_tui() {
      if (in_tui) {
        if (!tui_status_line_seen) print "status_line = [\"model-with-reasoning\", \"run-state\", \"context-remaining\", \"git-branch\", \"current-dir\"]"
        if (!tui_status_line_colors_seen) print "status_line_use_colors = true"
      }
      in_tui = 0
    }
    /^\[[^]]+\]/ {
      flush_features()
      flush_tui()
      if ($0 == "[features]") {
        features_seen = 1
        in_features = 1
        feature_hooks_seen = 0
      } else if ($0 == "[tui]") {
        tui_seen = 1
        in_tui = 1
        tui_status_line_seen = 0
        tui_status_line_colors_seen = 0
      }
      print
      next
    }
    in_features && $0 ~ /^[[:space:]]*codex_hooks[[:space:]]*=/ {
      if (!feature_hooks_seen) {
        sub(/codex_hooks/, "hooks")
        print
        feature_hooks_seen = 1
      }
      next
    }
    in_features && $0 ~ /^[[:space:]]*hooks[[:space:]]*=/ {
      feature_hooks_seen = 1
      print
      next
    }
    in_tui && $0 ~ /^[[:space:]]*status_line[[:space:]]*=/ {
      tui_status_line_seen = 1
      print
      next
    }
    in_tui && $0 ~ /^[[:space:]]*status_line_use_colors[[:space:]]*=/ {
      tui_status_line_colors_seen = 1
      print
      next
    }
    { print }
    END {
      flush_features()
      flush_tui()
      if (!features_seen) {
        print ""
        print "[features]"
        print "hooks = true"
      }
      if (!tui_seen) {
        print ""
        print "[tui]"
        print "status_line = [\"model-with-reasoning\", \"run-state\", \"context-remaining\", \"git-branch\", \"current-dir\"]"
        print "status_line_use_colors = true"
      }
    }
  ' "$centralPath" > "$tmp" 2>/dev/null;then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not modernize Codex config defaults in $centralPath"
    return 0
  fi
  if cmp -s "$centralPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    return 0
  fi
  archivePath=$(archiveExistingPathToProjectOld "$centralPath" settings)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not archive $centralPath";return 1; }
  mv "$tmp" "$centralPath" 2>/dev/null||{ mv "$archivePath" "$centralPath" 2>/dev/null||true;rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not update $centralPath";return 1; }
  emitEcsLogEvent info task.scaffold success settings 0 '' '' "modernized Codex config defaults in $centralPath old=${archivePath#$REPO_ROOT/}"
}

ensureCodexDotfilesHookTrustState(){ local centralPath=$1 tmp archivePath
  # Trust only the two dotfiles-owned UserPromptSubmit hooks we stamp below.
  # Codex keys hook trust by the live ~/.codex/config.toml layer path, even
  # though dotfiles symlinks that file to ~/.agents/settings/codex.toml.
  [[ -f $centralPath ]]||return 0
  command -v python3 >/dev/null 2>&1||{ emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "python3 missing; cannot pre-trust Codex dotfiles hooks";return 0; }
  tmp=$(mktemp --suffix=.toml 2>/dev/null||mktemp)||return 1
  if ! CODEX_CONFIG_LAYER_PATH="$HOME/.codex/config.toml" python3 - "$centralPath" "$tmp" 2>/dev/null <<'PY'
import os
import re
import sys

source, target = sys.argv[1], sys.argv[2]
layer_path = os.environ["CODEX_CONFIG_LAYER_PATH"]
desired = {
    f"{layer_path}:user_prompt_submit:0:0": "sha256:f7a464316e16ad7a23e9c9a6deebdecc4824ab527c6c6df96c8d9267d670de13",
    f"{layer_path}:user_prompt_submit:0:1": "sha256:dbfcb39879e90c2ef49e0387e2d82bd06c2520c3c09ceea20d346666987dbf11",
}

with open(source, "r", encoding="utf-8") as handle:
    lines = handle.readlines()

state_table = re.compile(r'^\[hooks\.state\."(.*)"\]\s*$')
any_table = re.compile(r'^\[')
in_target_table = False
in_plain_state = False
out = []

for line in lines:
    stripped = line.strip()
    match = state_table.match(stripped)
    if match:
        in_plain_state = False
        in_target_table = match.group(1) in desired
        if in_target_table:
            continue
    elif any_table.match(stripped):
        in_target_table = False
        in_plain_state = stripped == "[hooks.state]"

    if in_target_table:
        continue
    if in_plain_state:
        skip = False
        for key in desired:
            if stripped.startswith(f'"{key}"') or stripped.startswith(f"'{key}'"):
                skip = True
                break
        if skip:
            continue
    out.append(line)

while out and out[-1].strip() == "":
    out.pop()
if out:
    out.append("\n")
for key, trusted_hash in desired.items():
    out.append("\n")
    out.append(f'[hooks.state."{key}"]\n')
    out.append(f'trusted_hash = "{trusted_hash}"\n')

with open(target, "w", encoding="utf-8") as handle:
    handle.writelines(out)
PY
  then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not stamp Codex hook trust state in $centralPath"
    return 0
  fi
  if cmp -s "$centralPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    return 0
  fi
  archivePath=$(archiveExistingPathToProjectOld "$centralPath" settings)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not archive $centralPath";return 1; }
  mv "$tmp" "$centralPath" 2>/dev/null||{ mv "$archivePath" "$centralPath" 2>/dev/null||true;rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not update $centralPath";return 1; }
  emitEcsLogEvent info task.scaffold success settings 0 '' '' "trusted Codex dotfiles hooks in $centralPath old=${archivePath#$REPO_ROOT/}"
}

ensureClaudeStatusLineCommand(){ local centralPath=$1 tmp archivePath
  # Stamp the rich claude-statusline.sh wrapper into ~/.agents/settings/claude.json.
  # Wrapper renders: [model] cwd ⎇ branch↑ahead↓behind *dirty $cost +adds/-dels duration «style»
  [[ -f $centralPath ]]||return 0
  command -v jq >/dev/null 2>&1||{ emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "jq missing; cannot ensure Claude statusLine command";return 0; }
  local statusCmd='bash -c "$HOME/.dotfiles/scripts/bin/claude-statusline.sh"'
  tmp=$(mktemp --suffix=.json 2>/dev/null||mktemp)||return 1
  if ! jq --arg cmd "$statusCmd" '
        .statusLine = {type: "command", command: $cmd, refreshInterval: 5}
      ' "$centralPath" > "$tmp" 2>/dev/null;then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not parse $centralPath for Claude statusLine"
    return 0
  fi
  if cmp -s "$centralPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success settings 0 '' '' "Claude statusLine already present"
    return 0
  fi
  archivePath=$(archiveExistingPathToProjectOld "$centralPath" settings)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not archive $centralPath";return 1; }
  mv "$tmp" "$centralPath" 2>/dev/null||{ mv "$archivePath" "$centralPath" 2>/dev/null||true;rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not update $centralPath";return 1; }
  emitEcsLogEvent info task.scaffold success settings 0 '' '' "stamped Claude statusLine into $centralPath old=${archivePath#$REPO_ROOT/}"
}

ensureClaudeAgentTeamnameHook(){ local centralPath=$1 tmp archivePath
  # Stamp a PreToolUse hook on `Agent` calls into ~/.agents/settings/claude.json
  # so Claude Code denies any Agent invocation that omits team_name. The hook
  # script lives at scripts/bin/claude-enforce-agent-teamname.sh and emits a
  # `permissionDecision: "deny"` JSON payload when team_name is absent.
  [[ -f $centralPath ]]||return 0
  command -v jq >/dev/null 2>&1||{ emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "jq missing; cannot ensure Claude Agent teamname hook";return 0; }
  local hookCmd='bash -c "$HOME/.dotfiles/scripts/bin/claude-enforce-agent-teamname.sh"'
  tmp=$(mktemp --suffix=.json 2>/dev/null||mktemp)||return 1
  if ! jq --arg cmd "$hookCmd" '
        .hooks = (.hooks // {})
        | .hooks.PreToolUse = (.hooks.PreToolUse // [])
        | .hooks.PreToolUse = (
            ([(.hooks.PreToolUse[] // empty) | select(.matcher != "Agent")])
            + [{matcher: "Agent", hooks: [{type: "command", command: $cmd, timeout: 3}]}]
          )
      ' "$centralPath" > "$tmp" 2>/dev/null;then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not parse $centralPath for Agent teamname hook"
    return 0
  fi
  if cmp -s "$centralPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success settings 0 '' '' "Claude Agent teamname hook already present"
    return 0
  fi
  archivePath=$(archiveExistingPathToProjectOld "$centralPath" settings)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not archive $centralPath";return 1; }
  mv "$tmp" "$centralPath" 2>/dev/null||{ mv "$archivePath" "$centralPath" 2>/dev/null||true;rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not update $centralPath";return 1; }
  emitEcsLogEvent info task.scaffold success settings 0 '' '' "stamped PreToolUse Agent teamname hook into $centralPath old=${archivePath#$REPO_ROOT/}"
}

ensureClaudeAgentGitGuardHooks(){ local centralPath=$1 tmp archivePath
  # Removes any previously-stamped agent-git-guard Stop+UserPromptSubmit
  # entries. These were "always-on banner spam" that fired the harness's
  # "Stop hook feedback: No stderr output" status line on every assistant
  # turn end (16 lines of seeded-baseline noise per fire * every turn);
  # the ECS log file at ~/.local/state/agent-git-guard/baseline-events.log
  # captures intent-equivalent diagnostic data without context pollution.
  # The script itself remains useful as a manual `agent-git-guard.sh
  # finalize` invocation when an operator wants the check on demand.
  [[ -f $centralPath ]]||return 0
  command -v jq >/dev/null 2>&1||{ emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "jq missing; cannot reap Claude agent Git guard hooks";return 0; }
  tmp=$(mktemp --suffix=.json 2>/dev/null||mktemp)||return 1
  if ! jq '
        .hooks = (.hooks // {})
        | .hooks.Stop = ((.hooks.Stop // []) | map(.hooks |= map(select(.command | test("agent-git-guard") | not))) | map(select(.hooks | length > 0)))
        | .hooks.UserPromptSubmit = ((.hooks.UserPromptSubmit // []) | map(.hooks |= map(select(.command | test("agent-git-guard") | not))) | map(select(.hooks | length > 0)))
        | (if (.hooks.Stop | length) == 0 then del(.hooks.Stop) else . end)
      ' "$centralPath" > "$tmp" 2>/dev/null;then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not parse $centralPath for agent Git guard hook reap"
    return 0
  fi
  if cmp -s "$centralPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    return 0
  fi
  archivePath=$(archiveExistingPathToProjectOld "$centralPath" settings)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not archive $centralPath";return 1; }
  mv "$tmp" "$centralPath" 2>/dev/null||{ mv "$archivePath" "$centralPath" 2>/dev/null||true;rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not update $centralPath";return 1; }
  emitEcsLogEvent info task.scaffold success settings 0 '' '' "reaped agent Git guard hooks from $centralPath old=${archivePath#$REPO_ROOT/}"
}

ensureCodexAgentGitGuardHooks(){ local centralPath=$1 tmp archivePath
  # Reap any previously-stamped Codex agent-git-guard hook block. Same
  # rationale as ensureClaudeAgentGitGuardHooks: always-on banner spam.
  # Operator may still run `agent-git-guard.sh finalize` manually when
  # desired.
  [[ -f $centralPath ]]||return 0
  local startMarker='# agent-git-guard-hooks:begin'
  local endMarker='# agent-git-guard-hooks:end'
  if ! grep -Fq "$startMarker" "$centralPath" 2>/dev/null;then
    return 0
  fi
  tmp=$(mktemp --suffix=.toml 2>/dev/null||mktemp)||return 1
  awk -v start="$startMarker" -v end="$endMarker" '
    $0 == start {skip=1; next}
    $0 == end {skip=0; next}
    skip != 1 {print}
  ' "$centralPath" > "$tmp" 2>/dev/null||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not rewrite $centralPath to reap Codex agent Git guard hooks";return 0; }
  if cmp -s "$centralPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    return 0
  fi
  archivePath=$(archiveExistingPathToProjectOld "$centralPath" settings)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not archive $centralPath";return 1; }
  mv "$tmp" "$centralPath" 2>/dev/null||{ mv "$archivePath" "$centralPath" 2>/dev/null||true;rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not update $centralPath";return 1; }
  emitEcsLogEvent info task.scaffold success settings 0 '' '' "reaped agent Git guard hooks from $centralPath old=${archivePath#$REPO_ROOT/}"
}

installXoSharedConfig(){ local sharedXoConfigPath="$HOME/.agents/lsp/typescript/xo.config.js" tmp archivePath
  # Brevity-tuned XO flat config for cross-project use. Distilled from the
  # user's gtm_ops/voice_ai_agent_evals package.json#xo blocks. Projects opt
  # in by setting `"xo": { "extends": "~/.agents/lsp/typescript/xo.config.js" }` in their
  # own package.json or by importing it from their xo.config.{js,ts}.
  mkdir -p "$HOME/.agents/lsp/typescript" 2>/dev/null||true
  tmp=$(mktemp --suffix=.js 2>/dev/null||mktemp)||return 1
  cat > "$tmp" <<'XO_CONFIG_JS'
// ~/.agents/lsp/typescript/xo.config.js — managed by ~/.dotfiles/.dotfiles.sh
// Brevity + coherence baseline. Projects layer their own package.json#xo on top.
export default {
  space: 2,
  semicolon: true,
  prettier: false,
  rules: {
    'unicorn/no-process-exit': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/no-anonymous-default-export': 'off',
    'unicorn/filename-case': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'n/prefer-global/process': 'off',
    'n/file-extension-in-import': 'off',
    'import/extensions': 'off',
    'import-x/extensions': 'off',
    'no-await-in-loop': 'off',
    'max-depth': 'off',
    'complexity': 'off',
    'capitalized-comments': 'off',
    'prefer-arrow-callback': 'error',
    'object-shorthand': ['error', 'always'],
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-lonely-if': 'error',
    'arrow-body-style': ['error', 'as-needed']
  },
  ignores: ['dist/**', 'build/**', 'node_modules/**', '*.generated.*']
};
XO_CONFIG_JS
  if [[ -f $sharedXoConfigPath ]]&&cmp -s "$sharedXoConfigPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent info xo.config.deploy success xo.config 0 '' '' "$sharedXoConfigPath already up to date"
    return 0
  fi
  if [[ -e $sharedXoConfigPath ]];then
    archivePath=$(archiveExistingPathToProjectOld "$sharedXoConfigPath" xo.config)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn xo.config.deploy failure xo.config 0 '' '' "could not archive $sharedXoConfigPath";return 1; }
    emitEcsLogEvent info xo.config.archive success xo.config 0 '' '' "archived $sharedXoConfigPath -> ${archivePath#$REPO_ROOT/}"
  fi
  mv "$tmp" "$sharedXoConfigPath" 2>/dev/null||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn xo.config.deploy failure xo.config 0 '' '' "could not write $sharedXoConfigPath";return 1; }
  emitEcsLogEvent info xo.config.deploy success xo.config 0 '' '' "wrote $sharedXoConfigPath"
}

ensureXoOnPath(){ local existing
  if command -v xo >/dev/null 2>&1;then
    existing=$(xo --version 2>/dev/null|head -n1||true)
    case "$existing" in
      2.*) emitEcsLogEvent info xo.install success xo 0 '' '' "xo $existing already on PATH"; return 0;;
      1.*) emitEcsLogEvent warn xo.install success xo 0 '' '' "xo $existing on PATH (legacy 1.x; project-local pin still wins)"; return 0;;
    esac
  fi
  if command -v bun >/dev/null 2>&1;then
    bun add -g xo@^2 >/dev/null 2>&1||{ emitEcsLogEvent warn xo.install failure xo 0 '' '' 'bun add -g xo failed';return 0; }
    emitEcsLogEvent info xo.install success xo 0 '' '' 'installed xo via bun add -g'
    return 0
  fi
  if command -v npm >/dev/null 2>&1;then
    npm install -g xo@^2 >/dev/null 2>&1||{ emitEcsLogEvent warn xo.install failure xo 0 '' '' 'npm install -g xo failed';return 0; }
    emitEcsLogEvent info xo.install success xo 0 '' '' 'installed xo via npm install -g'
    return 0
  fi
  emitEcsLogEvent warn xo.install failure xo 0 '' '' 'neither bun nor npm available; skipping xo install'
}

ensureAgentLspsInstalled(){
  if command -v npm >/dev/null 2>&1; then
    local pkgs=("vscode-langservers-extracted" "@tailwindcss/language-server" "bash-language-server" "typescript-language-server" "typescript" "pyright")
    local to_install=()
    for pkg in "${pkgs[@]}"; do
      if ! npm ls -g "$pkg" >/dev/null 2>&1; then
        to_install+=("$pkg")
      fi
    done
    if [ ${#to_install[@]} -gt 0 ]; then
      npm install -g "${to_install[@]}" >/dev/null 2>&1 || emitEcsLogEvent warn lsp.install failure lsp 0 '' '' "npm install -g ${to_install[*]} failed"
      emitEcsLogEvent info lsp.install success lsp 0 '' '' "installed LSPs: ${to_install[*]}"
    fi
  else
    emitEcsLogEvent warn lsp.install failure lsp 0 '' '' 'npm not available; skipping LSP installs'
  fi
}

installBunMigrationReference(){ local refDir refPath tmp archivePath
  refDir="$HOME/.agents/references"
  refPath="$refDir/BUN-MIGRATION.md"
  mkdir -p "$refDir" 2>/dev/null||true
  tmp=$(mktemp --suffix=.md 2>/dev/null||mktemp)||return 1
  cat > "$tmp" <<'BUN_REF_MD'
# node → bun migration (managed by ~/.dotfiles/.dotfiles.sh)

Bun version of record: v1.3.13 (May 2026).
Install: `curl -fsSL https://bun.sh/install | bash`.

## When NOT to migrate
A project must stay on Node if it imports any of these (Bun does not implement them):
- `node:repl`, `node:sqlite`, `node:test`, `node:trace_events` (red — no implementation)
- `node:cluster` worker handles passed across processes (handles + FDs cannot transit workers)
- `node:worker_threads` with `stdin/stdout/stderr/trackedUnmanagedFds/resourceLimits`
- A native Node addon that doesn't compile under Bun's NAPI surface (verify with `bun install` first)
Audit with `rg "node:(repl|sqlite|test|trace_events)" --type ts --type js`.

## Migration steps
1. Confirm safe to migrate (audit above).
2. Add `"@types/bun": "^1.3.6"` and `"bun-types": "1.3.6"` to devDependencies.
3. Replace `package-lock.json` / `pnpm-lock.yaml` / `yarn.lock` with `bun.lock`:
   `rm -f package-lock.json pnpm-lock.yaml yarn.lock && bun install`.
4. Update `package.json#scripts`: replace `node` with `bun`, replace
   `npm run`/`pnpm`/`yarn` with `bun run`. Replace `tsx`/`ts-node` invocations
   with plain `bun` since Bun runs TS natively.
5. Remove `tsx` and `ts-node` from devDependencies.
6. Verify: `bun run typecheck`, `bun run test`, `bun run lint`.

## Common pitfalls
- `NODE_OPTIONS=--experimental-*` mostly does not apply under Bun — drop it.
- `bun install` is much faster than `npm install`; do not wrap it in a long-timeout shell.
- `bun.lock` is text-format (since Bun 1.2); commit it. Do not commit both `bun.lock` and `package-lock.json`.

## Per-project trigger
A project is a candidate when `package.json` exists, no audit hits above,
and no `engines.node` pin contradicts Bun's compat target.
BUN_REF_MD
  if [[ -f $refPath ]]&&cmp -s "$refPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent info bun.ref.deploy success bun.ref 0 '' '' "$refPath already up to date"
    return 0
  fi
  if [[ -e $refPath ]];then
    archivePath=$(archiveExistingPathToProjectOld "$refPath" bun.ref)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn bun.ref.deploy failure bun.ref 0 '' '' "could not archive $refPath";return 1; }
    emitEcsLogEvent info bun.ref.archive success bun.ref 0 '' '' "archived $refPath -> ${archivePath#$REPO_ROOT/}"
  fi
  mv "$tmp" "$refPath" 2>/dev/null||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn bun.ref.deploy failure bun.ref 0 '' '' "could not write $refPath";return 1; }
  emitEcsLogEvent info bun.ref.deploy success bun.ref 0 '' '' "wrote $refPath"
}

installAgentLspRegistry(){ local lspRoot indexPath tmp archivePath lang langPath langReadme
  lspRoot="$HOME/.agents/lsp"
  indexPath="$lspRoot/README.md"
  mkdir -p "$lspRoot" 2>/dev/null||true
  for lang in typescript python elixir rust go html css tailwind bash;do
    langPath="$lspRoot/$lang"
    langReadme="$langPath/README.md"
    mkdir -p "$langPath" 2>/dev/null||true
    tmp=$(mktemp --suffix=.md 2>/dev/null||mktemp)||return 1
    case "$lang" in
      typescript) cat > "$tmp" <<'LSP_TS_MD'
# typescript LSP

> For overall TypeScript agent conventions, see `~/.agents/skills/typescript/SKILL.md`

Binary: `vtsls` (preferred — pairs with Claude Code's official `typescript-lsp` plugin).
Fallback: `typescript-language-server` (more battle-tested in non-Claude harnesses).

## Install
- `bun add -g @vtsls/language-server typescript`
- or: `npm install -g typescript-language-server typescript`

## Activates on
`.ts .tsx .cts .mts .js .jsx .cjs .mjs`

## Per-project config
The LSP discovers the project's `tsconfig.json` automatically.

## Claude Code
Run `claude`, then `/plugin marketplace add Piebald-AI/claude-code-lsps`,
then `/plugins` and select `typescript`. Install vtsls first; the plugin spawns it.

## Codex / Gemini
No official plugin path. Invoke `vtsls --stdio` or
`typescript-language-server --stdio` directly when an LSP query is needed,
or shell out to `tsc --noEmit` for project-wide diagnostics.
LSP_TS_MD
        ;;
      python) cat > "$tmp" <<'LSP_PY_MD'
# python LSP

Binary: `pyright` (preferred — strict mode, fast).
Alternative: `ty` (Astral's emerging type checker; experimental in 2026).

## Install
- `bun add -g pyright` (works with bun) or `npm install -g pyright`
- or: `uv tool install ty`

## Activates on
`.py .pyi`

## Per-project config
Pyright uses `pyrightconfig.json` or `[tool.pyright]` in `pyproject.toml`.
Set `"strict": ["src"]` for strict-mode coverage of the source tree.

## Claude Code
`/plugin marketplace add Piebald-AI/claude-code-lsps` then enable `python` (pyright) or `python` (ty).

## Codex / Gemini
Invoke `pyright --outputjson <path>` for batch diagnostics, or `pyright-langserver --stdio`.
LSP_PY_MD
        ;;
      elixir) cat > "$tmp" <<'LSP_EX_MD'
# elixir LSP

Binary: `elixir-ls` (or `lexical` as a faster alternative for large projects).

## Install
- `mix archive.install hex elixir_ls` or via `asdf install elixir-ls latest`
- Lexical: clone `lexical-lsp/lexical` and follow the bootstrap script.

## Activates on
`.ex .exs .heex`

## Per-project config
None required; LSP reads `mix.exs` and `_build/`.

## Claude Code
Marketplace plugin name: `elixir`. Install elixir-ls first.

## Codex / Gemini
Invoke `elixir-ls.sh --stdio` directly. For symphony-elixir specifically, use
`mix specs.check` and `mix symphony.spec_compliance` in addition to LSP queries.
LSP_EX_MD
        ;;
      rust) cat > "$tmp" <<'LSP_RS_MD'
# rust LSP

Binary: `rust-analyzer`.

## Install
- `rustup component add rust-analyzer`

## Activates on
`.rs`

## Per-project config
Reads `Cargo.toml` automatically.

## Claude Code
Marketplace plugin name: `rust`.

## Codex / Gemini
Invoke `rust-analyzer` directly via stdio.
LSP_RS_MD
        ;;
      go) cat > "$tmp" <<'LSP_GO_MD'
# go LSP

Binary: `gopls`.

## Install
- `go install golang.org/x/tools/gopls@latest`

## Activates on
`.go`

## Per-project config
Reads `go.mod` automatically.

## Claude Code
Marketplace plugin name: `go`.

## Codex / Gemini
Invoke `gopls serve` directly.
LSP_GO_MD
        ;;
      html) cat > "$tmp" <<'LSP_HTML_MD'
# html LSP

Binary: `vscode-html-language-server`.

## Install
- `npm install -g vscode-langservers-extracted`

## Activates on
`.html`
LSP_HTML_MD
        ;;
      css) cat > "$tmp" <<'LSP_CSS_MD'
# css LSP

Binary: `vscode-css-language-server`.

## Install
- `npm install -g vscode-langservers-extracted`

## Activates on
`.css .scss .less`
LSP_CSS_MD
        ;;
      tailwind) cat > "$tmp" <<'LSP_TW_MD'
# tailwind LSP

Binary: `tailwindcss-language-server`.

## Install
- `npm install -g @tailwindcss/language-server`

## Activates on
Files with tailwind directives, usually HTML, JS/TS, CSS.
LSP_TW_MD
        ;;
      bash) cat > "$tmp" <<'LSP_BASH_MD'
# bash LSP

Binary: `bash-language-server`.

## Install
- `npm install -g bash-language-server`

## Activates on
`.sh .bash` and bash scripts without extension.
LSP_BASH_MD
        ;;
    esac
    if [[ -f $langReadme ]]&&cmp -s "$langReadme" "$tmp";then
      rm -f "$tmp" 2>/dev/null||true
      emitEcsLogEvent info lsp.registry.deploy success lsp.registry 0 '' '' "$langReadme already up to date"
      continue
    fi
    if [[ -e $langReadme ]];then
      archivePath=$(archiveExistingPathToProjectOld "$langReadme" lsp.registry)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn lsp.registry.deploy failure lsp.registry 0 '' '' "could not archive $langReadme";continue; }
      emitEcsLogEvent info lsp.registry.archive success lsp.registry 0 '' '' "archived $langReadme -> ${archivePath#$REPO_ROOT/}"
    fi
    mv "$tmp" "$langReadme" 2>/dev/null||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn lsp.registry.deploy failure lsp.registry 0 '' '' "could not write $langReadme";continue; }
    emitEcsLogEvent info lsp.registry.deploy success lsp.registry 0 '' '' "wrote $langReadme"
  done
  tmp=$(mktemp --suffix=.md 2>/dev/null||mktemp)||return 1
  cat > "$tmp" <<'LSP_INDEX_MD'
# ~/.agents/lsp/ — Cross-agent LSP registry (managed by ~/.dotfiles/.dotfiles.sh)

One directory per language. Each `<lang>/README.md` documents the canonical
LSP binary, install command, file extensions, and per-project config.

Claude Code consumes its own plugin marketplace
(`/plugin marketplace add Piebald-AI/claude-code-lsps`) which spawns these
binaries. Codex CLI and Gemini CLI invoke them directly when an LSP query
is needed — or shell out to language-native checkers (`tsc --noEmit`,
`pyright`, `mix specs.check`, `cargo check`, `go vet`).

Add a new language by `mkdir ~/.agents/lsp/<lang>/` and dropping a README.md
matching the existing pattern; the bootstrap will not overwrite it on the
next run unless its contents drift from the templated default. Custom
languages (`mkdir`-only, no managed README) are preserved.
LSP_INDEX_MD
  if [[ -f $indexPath ]]&&cmp -s "$indexPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent info lsp.registry.deploy success lsp.registry 0 '' '' "$indexPath already up to date"
    return 0
  fi
  if [[ -e $indexPath ]];then
    archivePath=$(archiveExistingPathToProjectOld "$indexPath" lsp.registry)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn lsp.registry.deploy failure lsp.registry 0 '' '' "could not archive $indexPath";return 1; }
    emitEcsLogEvent info lsp.registry.archive success lsp.registry 0 '' '' "archived $indexPath -> ${archivePath#$REPO_ROOT/}"
  fi
  mv "$tmp" "$indexPath" 2>/dev/null||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn lsp.registry.deploy failure lsp.registry 0 '' '' "could not write $indexPath";return 1; }
  emitEcsLogEvent info lsp.registry.deploy success lsp.registry 0 '' '' "wrote $indexPath"
}

ensureClaudeAgentTeamsSetting(){ local centralPath=$1 tmp archivePath
  [[ -f $centralPath ]]||return 0
  command -v jq >/dev/null 2>&1||{ emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "jq missing; cannot ensure Claude agent teams setting";return 0; }
  tmp=$(mktemp --suffix=.json 2>/dev/null||mktemp)||return 1
  if ! jq '.env = (.env // {}) | .env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS = "1"' "$centralPath" > "$tmp" 2>/dev/null;then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not parse $centralPath for Claude agent teams setting"
    return 0
  fi
  if cmp -s "$centralPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success settings 0 '' '' "Claude agent teams setting already present"
    return 0
  fi
  archivePath=$(archiveExistingPathToProjectOld "$centralPath" settings)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not archive $centralPath";return 1; }
  mv "$tmp" "$centralPath" 2>/dev/null||{ mv "$archivePath" "$centralPath" 2>/dev/null||true;rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not update $centralPath";return 1; }
  emitEcsLogEvent info task.scaffold success settings 0 '' '' "enabled Claude agent teams env in $centralPath old=${archivePath#$REPO_ROOT/}"
}

ensureClaudeAutoUpdatesChannel(){ local centralPath=$1 tmp archivePath
  [[ -f $centralPath ]]||return 0
  command -v jq >/dev/null 2>&1||{ emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "jq missing; cannot ensure Claude autoUpdatesChannel";return 0; }
  tmp=$(mktemp --suffix=.json 2>/dev/null||mktemp)||return 1
  if ! jq '.autoUpdatesChannel = "latest"' "$centralPath" > "$tmp" 2>/dev/null;then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not parse $centralPath for autoUpdatesChannel"
    return 0
  fi
  if cmp -s "$centralPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success settings 0 '' '' "Claude autoUpdatesChannel already present"
    return 0
  fi
  archivePath=$(archiveExistingPathToProjectOld "$centralPath" settings)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not archive $centralPath";return 1; }
  mv "$tmp" "$centralPath" 2>/dev/null||{ mv "$archivePath" "$centralPath" 2>/dev/null||true;rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not update $centralPath";return 1; }
  emitEcsLogEvent info task.scaffold success settings 0 '' '' "set Claude autoUpdatesChannel=latest in $centralPath old=${archivePath#$REPO_ROOT/}"
}

ensureClaudeEditorMode(){ local centralPath=$1 tmp archivePath
  [[ -f $centralPath ]]||return 0
  command -v jq >/dev/null 2>&1||{ emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "jq missing; cannot ensure Claude editorMode";return 0; }
  tmp=$(mktemp --suffix=.json 2>/dev/null||mktemp)||return 1
  if ! jq '.editorMode = "normal"' "$centralPath" > "$tmp" 2>/dev/null;then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not parse $centralPath for editorMode"
    return 0
  fi
  if cmp -s "$centralPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success settings 0 '' '' "Claude editorMode already present"
    return 0
  fi
  archivePath=$(archiveExistingPathToProjectOld "$centralPath" settings)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not archive $centralPath";return 1; }
  mv "$tmp" "$centralPath" 2>/dev/null||{ mv "$archivePath" "$centralPath" 2>/dev/null||true;rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not update $centralPath";return 1; }
  emitEcsLogEvent info task.scaffold success settings 0 '' '' "set Claude editorMode=normal in $centralPath old=${archivePath#$REPO_ROOT/}"
}

ensureClaudePreferredNotifChannel(){ local centralPath=$1 tmp archivePath
  [[ -f $centralPath ]]||return 0
  command -v jq >/dev/null 2>&1||{ emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "jq missing; cannot ensure Claude preferredNotifChannel";return 0; }
  tmp=$(mktemp --suffix=.json 2>/dev/null||mktemp)||return 1
  if ! jq '.preferredNotifChannel = "auto"' "$centralPath" > "$tmp" 2>/dev/null;then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not parse $centralPath for preferredNotifChannel"
    return 0
  fi
  if cmp -s "$centralPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success settings 0 '' '' "Claude preferredNotifChannel already present"
    return 0
  fi
  archivePath=$(archiveExistingPathToProjectOld "$centralPath" settings)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not archive $centralPath";return 1; }
  mv "$tmp" "$centralPath" 2>/dev/null||{ mv "$archivePath" "$centralPath" 2>/dev/null||true;rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not update $centralPath";return 1; }
  emitEcsLogEvent info task.scaffold success settings 0 '' '' "set Claude preferredNotifChannel=auto in $centralPath old=${archivePath#$REPO_ROOT/}"
}

ensureClaudeForceLoginMethod(){ local centralPath=$1 tmp archivePath
  [[ -f $centralPath ]]||return 0
  command -v jq >/dev/null 2>&1||{ emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "jq missing; cannot ensure Claude forceLoginMethod";return 0; }
  tmp=$(mktemp --suffix=.json 2>/dev/null||mktemp)||return 1
  if ! jq '.forceLoginMethod = "claudeai"' "$centralPath" > "$tmp" 2>/dev/null;then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not parse $centralPath for forceLoginMethod"
    return 0
  fi
  if cmp -s "$centralPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success settings 0 '' '' "Claude forceLoginMethod already present"
    return 0
  fi
  archivePath=$(archiveExistingPathToProjectOld "$centralPath" settings)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not archive $centralPath";return 1; }
  mv "$tmp" "$centralPath" 2>/dev/null||{ mv "$archivePath" "$centralPath" 2>/dev/null||true;rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not update $centralPath";return 1; }
  emitEcsLogEvent info task.scaffold success settings 0 '' '' "set Claude forceLoginMethod=claudeai in $centralPath old=${archivePath#$REPO_ROOT/}"
}

ensureClaudeRemoveLegacyFields(){ local centralPath=$1 tmp archivePath
  # Drops undocumented `remoteControlAtStartup`. Moves top-level
  # `skipDangerousModePermissionPrompt` under `permissions` per current spec.
  [[ -f $centralPath ]]||return 0
  command -v jq >/dev/null 2>&1||return 0
  tmp=$(mktemp --suffix=.json 2>/dev/null||mktemp)||return 1
  if ! jq 'del(.remoteControlAtStartup)
           | if has("skipDangerousModePermissionPrompt")
             then .permissions = (.permissions // {})
                  | .permissions.skipDangerousModePermissionPrompt = .skipDangerousModePermissionPrompt
                  | del(.skipDangerousModePermissionPrompt)
             else . end' "$centralPath" > "$tmp" 2>/dev/null;then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not parse $centralPath for legacy field cleanup"
    return 0
  fi
  if cmp -s "$centralPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    return 0
  fi
  archivePath=$(archiveExistingPathToProjectOld "$centralPath" settings)||{ rm -f "$tmp" 2>/dev/null||true;return 1; }
  mv "$tmp" "$centralPath" 2>/dev/null||{ mv "$archivePath" "$centralPath" 2>/dev/null||true;rm -f "$tmp" 2>/dev/null||true;return 1; }
  emitEcsLogEvent info task.scaffold success settings 0 '' '' "removed legacy Claude settings fields in $centralPath old=${archivePath#$REPO_ROOT/}"
}

ensureClaudeFileCreationGateHook(){ local centralPath=$1 tmp archivePath
  # PreToolUse advisory hook on Write. Reminds the agent about cloud-first
  # source-of-truth (n8n, ElevenLabs, Twilio, etc.) and snake_case naming
  # conventions. Never blocks; only enriches stderr + systemMessage.
  [[ -f $centralPath ]]||return 0
  command -v jq >/dev/null 2>&1||{ emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "jq missing; cannot ensure file-creation-gate hook";return 0; }
  local hookCmd='bash -c "$HOME/.dotfiles/scripts/bin/file-creation-gate.sh"'
  tmp=$(mktemp --suffix=.json 2>/dev/null||mktemp)||return 1
  if ! jq --arg cmd "$hookCmd" '
        .hooks = (.hooks // {})
        | .hooks.PreToolUse = (.hooks.PreToolUse // [])
        | .hooks.PreToolUse = (
            ([(.hooks.PreToolUse[] // empty) | objects | select(.matcher != "Write")])
            + [{matcher: "Write", hooks: [{type: "command", command: $cmd, timeout: 4}]}]
          )
      ' "$centralPath" > "$tmp" 2>/dev/null;then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not parse $centralPath for file-creation-gate hook"
    return 0
  fi
  if cmp -s "$centralPath" "$tmp";then
    rm -f "$tmp" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success settings 0 '' '' "file-creation-gate hook already present"
    return 0
  fi
  archivePath=$(archiveExistingPathToProjectOld "$centralPath" settings)||{ rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not archive $centralPath";return 1; }
  mv "$tmp" "$centralPath" 2>/dev/null||{ mv "$archivePath" "$centralPath" 2>/dev/null||true;rm -f "$tmp" 2>/dev/null||true;emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not update $centralPath";return 1; }
  emitEcsLogEvent info task.scaffold success settings 0 '' '' "stamped file-creation-gate hook into $centralPath old=${archivePath#$REPO_ROOT/}"
}

symlinkAgentSettingFromCentralSource(){ local agentPath=$1 centralPath=$2 archivePath
  [[ -L $agentPath ]]&&{ [[ $(readlink "$agentPath") == "$centralPath" ]]&&return 0; }
  if [[ -e $agentPath && ! -L $agentPath ]];then
    archivePath=$(archiveExistingPathToProjectOld "$agentPath" settings)||{ emitEcsLogEvent warn task.scaffold failure settings 0 '' '' "could not archive $agentPath";return 1; }
    emitEcsLogEvent info task.scaffold success settings 0 '' '' "archived $agentPath -> ${archivePath#$REPO_ROOT/}"
  fi
  rm -f "$agentPath" 2>/dev/null||true
  ln -s "$centralPath" "$agentPath" 2>/dev/null||true
  emitEcsLogEvent info task.scaffold success settings 0 '' '' "symlinked $agentPath -> $centralPath"
}

ingestSkillDirectoriesIntoCentralSource(){ local sourcePath=$1 centralPath=$2 sourceLabel=${3:-skills} entry name target archivePath
  [[ -d $sourcePath ]]||return 0
  mkdir -p "$centralPath" 2>/dev/null||true
  for entry in "$sourcePath"/*;do
    [[ -d $entry && -f "$entry/SKILL.md" ]]||continue
    name=$(basename "$entry")
    case "$name" in .*) continue;; esac
    target="$centralPath/$name"
    if [[ ! -e $target ]];then
      cp -a "$entry" "$target" 2>/dev/null||true
      emitEcsLogEvent info task.scaffold success skills 0 '' '' "ingested $sourceLabel skill $name -> $target"
    elif diff -qr "$entry" "$target" >/dev/null 2>&1;then
      emitEcsLogEvent info task.scaffold success skills 0 '' '' "$sourceLabel skill $name already matches central source"
    else
      archivePath=$(archiveExistingPathToProjectOld "$target" skills)||{ emitEcsLogEvent warn task.scaffold failure skills 0 '' '' "could not archive $target";return 1; }
      cp -a "$entry" "$target" 2>/dev/null||{ emitEcsLogEvent warn task.scaffold failure skills 0 '' '' "could not copy $entry -> $target";return 1; }
      emitEcsLogEvent warn task.scaffold success skills 0 '' '' "$sourceLabel skill $name replaced central source; old=${archivePath#$REPO_ROOT/}"
    fi
  done
}

retireAgentSkillMirrorsToCentralOnly(){ local agentPath=$1 centralPath=$2 entry name linkTarget agentName archivePath
  [[ -d $agentPath ]]||return 0
  mkdir -p "$centralPath" 2>/dev/null||true
  agentName=$(basename "$(dirname "$agentPath")")
  for entry in "$agentPath"/*;do
    [[ -e $entry || -L $entry ]]||continue
    name=$(basename "$entry")
    # Keep agent-internal hidden skill roots, especially ~/.codex/skills/.system.
    case "$name" in .*) continue;; esac
    if [[ -L $entry ]];then
      linkTarget=$(readlink "$entry")
      case "$linkTarget" in
        "$centralPath"/*)
          rm -f "$entry" 2>/dev/null||true
          emitEcsLogEvent info task.scaffold success skills 0 '' '' "removed mirrored $agentName skill symlink $entry -> $linkTarget"
          continue
          ;;
      esac
      if [[ -f $entry/SKILL.md && ! -e $centralPath/$name ]];then
        cp -aL "$entry" "$centralPath/$name" 2>/dev/null||true
        emitEcsLogEvent info task.scaffold success skills 0 '' '' "ingested $agentName linked skill $name -> $centralPath/$name"
      fi
      archivePath=$(archiveExistingPathToProjectOld "$entry" skills)||{ emitEcsLogEvent warn task.scaffold failure skills 0 '' '' "could not archive $entry";return 1; }
      emitEcsLogEvent warn task.scaffold success skills 0 '' '' "archived non-central $agentName skill symlink $entry -> ${archivePath#$REPO_ROOT/}"
      continue
    fi
    [[ -d $entry && -f $entry/SKILL.md ]]||continue
    if [[ ! -e $centralPath/$name ]];then
      mv "$entry" "$centralPath/$name" 2>/dev/null||true
      emitEcsLogEvent info task.scaffold success skills 0 '' '' "ingested $agentName skill $name -> $centralPath/$name"
    elif diff -qr "$entry" "$centralPath/$name" >/dev/null 2>&1;then
      rm -rf "$entry" 2>/dev/null||true
      emitEcsLogEvent info task.scaffold success skills 0 '' '' "removed duplicate $agentName skill dir $entry"
    else
      archivePath=$(archiveExistingPathToProjectOld "$entry" skills)||{ emitEcsLogEvent warn task.scaffold failure skills 0 '' '' "could not archive $entry";return 1; }
      emitEcsLogEvent warn task.scaffold success skills 0 '' '' "archived conflicting $agentName skill $entry -> ${archivePath#$REPO_ROOT/}"
    fi
  done
}

materializeAgentSkillsFromCentralSource(){ local agentPath=$1 centralPath=$2 entry name target archivePath agentName linkTarget
  # Some agents discover central ~/.agents/skills directly; Claude's visible
  # skill registry is more reliable with real per-skill directories under
  # ~/.claude/skills than with symlinked directories. Keep central authoritative
  # and materialize byte-identical copies for Claude.
  mkdir -p "$centralPath" 2>/dev/null||true
  if [[ -L $agentPath ]];then
    rm -f "$agentPath" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success skills 0 '' '' "removed legacy directory-level symlink at $agentPath"
  fi
  mkdir -p "$agentPath" 2>/dev/null||true
  agentName=$(basename "$(dirname "$agentPath")")
  for entry in "$agentPath"/*;do
    [[ -e $entry || -L $entry ]]||continue
    name=$(basename "$entry")
    case "$name" in .*) continue;; esac
    if [[ -L $entry ]];then
      linkTarget=$(readlink "$entry")
      rm -f "$entry" 2>/dev/null||true
      emitEcsLogEvent info task.scaffold success skills 0 '' '' "removed $agentName skill symlink before materializing $entry -> $linkTarget"
      continue
    fi
    [[ -d $entry && -f $entry/SKILL.md ]]||continue
    if [[ ! -e $centralPath/$name ]];then
      mv "$entry" "$centralPath/$name" 2>/dev/null||true
      emitEcsLogEvent info task.scaffold success skills 0 '' '' "ingested $agentName skill $name -> $centralPath/$name"
    elif diff -qr "$entry" "$centralPath/$name" >/dev/null 2>&1;then
      :
    else
      archivePath=$(archiveExistingPathToProjectOld "$entry" skills)||{ emitEcsLogEvent warn task.scaffold failure skills 0 '' '' "could not archive $entry";return 1; }
      emitEcsLogEvent warn task.scaffold success skills 0 '' '' "archived conflicting $agentName skill $entry -> ${archivePath#$REPO_ROOT/}"
    fi
  done
  for entry in "$centralPath"/*;do
    [[ -d $entry ]]||continue
    name=$(basename "$entry")
    case "$name" in .*) continue;; esac
    target="$agentPath/$name"
    if [[ -d $target && ! -L $target ]]&&diff -qr "$entry" "$target" >/dev/null 2>&1;then
      emitEcsLogEvent info task.scaffold success skills 0 '' '' "$agentName skill $name already materialized"
      continue
    fi
    if [[ -e $target || -L $target ]];then
      archivePath=$(archiveExistingPathToProjectOld "$target" skills)||{ emitEcsLogEvent warn task.scaffold failure skills 0 '' '' "could not archive $target";return 1; }
      emitEcsLogEvent warn task.scaffold success skills 0 '' '' "archived stale $agentName skill mirror $target -> ${archivePath#$REPO_ROOT/}"
    fi
    cp -a "$entry" "$target" 2>/dev/null||{ emitEcsLogEvent warn task.scaffold failure skills 0 '' '' "could not materialize $target";return 1; }
    emitEcsLogEvent info task.scaffold success skills 0 '' '' "materialized $agentName skill $target from $entry"
  done
}

syncAgentSkillsFromCentralSource(){ local agentPath=$1 centralPath=$2 entry name target archivePath agentName linkTarget
  # Per-skill symlinks inside a real agent skills directory. Kept for backward
  # compatibility; prefer materializeAgentSkillsFromCentralSource for agents
  # whose skill registry is sticky around symlinked directories.
  mkdir -p "$centralPath" 2>/dev/null||true
  if [[ -L $agentPath ]];then
    rm -f "$agentPath" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success skills 0 '' '' "removed legacy directory-level symlink at $agentPath"
  fi
  mkdir -p "$agentPath" 2>/dev/null||true
  agentName=$(basename "$(dirname "$agentPath")")
  for entry in "$agentPath"/*;do
    [[ -L $entry ]]||continue
    name=$(basename "$entry")
    # Skip agent-internal hidden dirs (.system, .openclaw, ...). Defensive vs. dotglob.
    case "$name" in .*) continue;; esac
    linkTarget=$(readlink "$entry")
    case "$linkTarget" in
      "$centralPath"/*)
        [[ -e $linkTarget ]]&&continue
        rm -f "$entry" 2>/dev/null||true
        emitEcsLogEvent info task.scaffold success skills 0 '' '' "removed stale $agentName skill symlink $entry -> $linkTarget"
        ;;
    esac
  done
  for entry in "$agentPath"/*;do
    [[ -d $entry && ! -L $entry ]]||continue
    name=$(basename "$entry")
    # Defense in depth: never ingest hidden agent-internal dirs (e.g. ~/.codex/skills/.system,
    # which is Codex's built-in skill set; moving it into central would break Codex).
    case "$name" in .*) continue;; esac
    if [[ ! -e "$centralPath/$name" ]];then
      mv "$entry" "$centralPath/$name" 2>/dev/null||true
      emitEcsLogEvent info task.scaffold success skills 0 '' '' "ingested $agentName skill $name -> $centralPath/$name"
    elif diff -qr "$entry" "$centralPath/$name" >/dev/null 2>&1;then
      rm -rf "$entry" 2>/dev/null||true
      emitEcsLogEvent info task.scaffold success skills 0 '' '' "removed duplicate $agentName skill dir $entry"
    else
      archivePath=$(archiveExistingPathToProjectOld "$entry" skills)||{ emitEcsLogEvent warn task.scaffold failure skills 0 '' '' "could not archive $entry";return 1; }
      emitEcsLogEvent warn task.scaffold success skills 0 '' '' "archived conflicting $agentName skill $entry -> ${archivePath#$REPO_ROOT/}"
    fi
  done
  for entry in "$centralPath"/*;do
    [[ -d $entry ]]||continue
    name=$(basename "$entry")
    case "$name" in .*) continue;; esac
    target="$agentPath/$name"
    if [[ -L $target ]];then
      [[ $(readlink "$target") == "$entry" ]]&&continue
      rm -f "$target" 2>/dev/null||true
    elif [[ -e $target ]];then
      archivePath=$(archiveExistingPathToProjectOld "$target" skills)||{ emitEcsLogEvent warn task.scaffold failure skills 0 '' '' "could not archive $target";return 1; }
      emitEcsLogEvent warn task.scaffold success skills 0 '' '' "archived conflicting skill path $target -> ${archivePath#$REPO_ROOT/}"
    fi
    ln -s "$entry" "$target" 2>/dev/null||true
    emitEcsLogEvent info task.scaffold success skills 0 '' '' "symlinked skill $target -> $entry"
  done
}

# ── Wranngle README + repo-metadata system: GH metadata writers ────────
# Authority: docs/exec-plans/active/WRANNGLE-README-SYSTEM.md (§5–§8). All four
# writers are deterministic + idempotent: probe current state, diff, apply only
# what's needed. Each emits an ECS event per change. Skipped silently when gh
# is missing, unauthenticated, or the assessment lacks repoOwner/repoName.

# Spec §5. Validates taglineCandidate as a wranngle About-field. Returns 0 if
# valid, 1 with a reason on stderr if not. Used by writeArtifactGithubAboutField.
validateWranngleAboutFieldTagline(){ local tagline=$1
  [[ -z $tagline ]]&&{ echo "empty tagline" >&2;return 1;}
  ((${#tagline}>120))&&{ echo "length ${#tagline} > 120 chars" >&2;return 1;}
  [[ $tagline == *—* ]]&&{ echo "contains em-dash" >&2;return 1;}
  [[ $tagline == *–* ]]&&{ echo "contains en-dash as connector" >&2;return 1;}
  [[ $tagline == *!* ]]&&{ echo "contains exclamation point" >&2;return 1;}
  local firstChar=${tagline:0:1}
  [[ $firstChar =~ [A-Z] ]]&&{ echo "first letter uppercase; About fields are sentence fragments, lowercase first letter" >&2;return 1;}
  [[ ${tagline: -1} == . ]]&&{ echo "trailing period; sentence fragment, no terminal punctuation" >&2;return 1;}
  return 0;}

writeArtifactGithubAboutField(){ local repoOwner repoName tagline currentDescription
  command -v gh >/dev/null 2>&1||return 0
  gh auth status >/dev/null 2>&1||return 0
  [[ -f $ASSESSMENT_FILE ]]||return 0
  repoOwner=$(jq -r '.repoOwner // ""' "$ASSESSMENT_FILE")
  repoName=$(jq -r '.repoName // ""' "$ASSESSMENT_FILE")
  tagline=$(jq -r '.taglineCandidate // ""' "$ASSESSMENT_FILE")
  [[ -z $repoOwner || -z $repoName ]]&&{ emitEcsLogEvent info task.skip success gh.about 0 '' '' "no GitHub remote owner/repo";return 0;}
  if ! validationOutput=$(validateWranngleAboutFieldTagline "$tagline" 2>&1);then
    emitEcsLogEvent warn task.write failure gh.about 0 '' '' "PENDING_TAGLINE $repoOwner/$repoName -> needs-rewrite ($validationOutput)"
    DOTFILES_RUN_SKIPPED_TASKS+=(gh.about)
    return 0
  fi
  currentDescription=$(gh repo view "$repoOwner/$repoName" --json description -q .description 2>/dev/null||echo)
  if [[ $currentDescription == "$tagline" ]];then
    emitEcsLogEvent info task.skip success gh.about 0 '' '' "$repoOwner/$repoName description unchanged"
    DOTFILES_RUN_SKIPPED_TASKS+=(gh.about)
    return 0
  fi
  if gh repo edit "$repoOwner/$repoName" --description "$tagline" >/dev/null 2>&1;then
    emitEcsLogEvent info task.write success gh.about 0 '' '' "$repoOwner/$repoName description: '${currentDescription:-(empty)}' -> '$tagline'"
    DOTFILES_RUN_SUCCESS_TASKS+=(gh.about)
  else
    emitEcsLogEvent warn task.write failure gh.about 0 '' '' "$repoOwner/$repoName gh repo edit --description failed"
    DOTFILES_RUN_FAILED_TASKS+=(gh.about)
  fi;}

# Spec §7 banned topics (auto-removed every run).
readonly BANNED_GITHUB_TOPICS=(awesome trending 2024 2025 2026 hacktoberfest tools utility misc software)

# Compute target topic set per spec §7. Always includes: wranngle, status tag.
# Conditional: language tags, framework tags, domain tags. Returns
# space-separated list on stdout.
computeTargetGithubTopicsFromAssessment(){ [[ -f $ASSESSMENT_FILE ]]||{ echo;return;}
  local detectedLanguage projectStatus packageManager projectName statusTag
  detectedLanguage=$(jq -r '.language // "unknown"' "$ASSESSMENT_FILE")
  projectStatus=$(jq -r '.projectStatus // "experiment"' "$ASSESSMENT_FILE")
  packageManager=$(jq -r '.packageManager // "none"' "$ASSESSMENT_FILE")
  projectName=$(jq -r '.projectName // ""' "$ASSESSMENT_FILE"|tr '[:upper:]_' '[:lower:]-')
  case "$projectStatus" in
    showcase) statusTag=showcase;;
    experiment) statusTag=experiment;;
    active) statusTag=active-project;;
    reference) statusTag=reference-impl;;
    tool) statusTag=personal-tool;;
    *) statusTag=experiment;;
  esac
  local targetTopics=(wranngle "$statusTag")
  case "$detectedLanguage" in
    javascript|typescript) targetTopics+=("$detectedLanguage");;
    rust|elixir|python|go) targetTopics+=("$detectedLanguage");;
    ruby|php|swift|java) targetTopics+=("$detectedLanguage");;
  esac
  case "$packageManager" in
    bun) targetTopics+=(bun);;
  esac
  # Framework / runtime detection
  [[ -f next.config.js || -f next.config.ts || -f next.config.mjs ]]&&targetTopics+=(nextjs)
  if [[ -f package.json ]];then
            if [[ -f .github/workflows/test.yml || -f .github/workflows/test.yaml ]]; then
              echo "dedicated test workflow detected - skipping generic package test"
              exit 0
            fi
    jq -e '.dependencies.react // .devDependencies.react // empty' package.json >/dev/null 2>&1&&targetTopics+=(react)
    jq -e '.dependencies.tailwindcss // .devDependencies.tailwindcss // empty' package.json >/dev/null 2>&1&&targetTopics+=(tailwind)
  fi
  [[ -f mix.exs ]]&&grep -q phoenix mix.exs 2>/dev/null&&targetTopics+=(phoenix)
  # Domain heuristics by repo name
  case "$projectName" in
    *cli*) targetTopics+=(cli);;
  esac
  case "$projectName" in
    *agent*|*orchestrator*) targetTopics+=(agent);;
  esac
  case "$projectName" in
    *mcp*) targetTopics+=(mcp);;
  esac
  case "$projectName" in
    *dotfiles*) targetTopics+=(dotfiles);;
  esac
  case "$projectName" in
    *chrome-extension*|*-chrome*) targetTopics+=(chrome-extension);;
  esac
  # llm tag if any LLM/agent keyword in description
  local desc;desc=$(jq -r '.taglineCandidate // ""' "$ASSESSMENT_FILE"|tr '[:upper:]' '[:lower:]')
  case "$desc" in
    *llm*|*claude*|*gpt*|*gemini*|*anthropic*|*openai*) targetTopics+=(llm);;
  esac
  # Dedupe, cap at 13
  printf '%s\n' "${targetTopics[@]}"|awk '!seen[$0]++'|head -13|tr '\n' ' '|sed 's/ $//';}

writeArtifactGithubTopics(){ local repoOwner repoName currentTopicsJson targetTopicsLine
  command -v gh >/dev/null 2>&1||return 0
  gh auth status >/dev/null 2>&1||return 0
  [[ -f $ASSESSMENT_FILE ]]||return 0
  repoOwner=$(jq -r '.repoOwner // ""' "$ASSESSMENT_FILE")
  repoName=$(jq -r '.repoName // ""' "$ASSESSMENT_FILE")
  [[ -z $repoOwner || -z $repoName ]]&&{ emitEcsLogEvent info task.skip success gh.topics 0 '' '' "no GitHub remote owner/repo";return 0;}
  currentTopicsJson=$(gh repo view "$repoOwner/$repoName" --json repositoryTopics -q '[.repositoryTopics[].name]' 2>/dev/null||echo '[]')
  targetTopicsLine=$(computeTargetGithubTopicsFromAssessment)
  [[ -z $targetTopicsLine ]]&&{ emitEcsLogEvent info task.skip success gh.topics 0 '' '' "no target topics computed";return 0;}
  local addedTopics=() removedTopics=()
  local targetTopic currentTopic
  # Add missing
  for targetTopic in $targetTopicsLine;do
    if ! echo "$currentTopicsJson"|jq -e --arg t "$targetTopic" 'index($t) // empty' >/dev/null 2>&1;then
      gh repo edit "$repoOwner/$repoName" --add-topic "$targetTopic" >/dev/null 2>&1&&addedTopics+=("$targetTopic")
    fi
  done
  # Remove banned
  for currentTopic in $(echo "$currentTopicsJson"|jq -r '.[]' 2>/dev/null);do
    local isBanned=0
    for bannedTopic in "${BANNED_GITHUB_TOPICS[@]}";do
      [[ $currentTopic == "$bannedTopic" ]]&&{ isBanned=1;break;}
    done
    if ((isBanned));then
      gh repo edit "$repoOwner/$repoName" --remove-topic "$currentTopic" >/dev/null 2>&1&&removedTopics+=("$currentTopic")
    fi
  done
  if ((${#addedTopics[@]}==0&&${#removedTopics[@]}==0));then
    emitEcsLogEvent info task.skip success gh.topics 0 '' '' "$repoOwner/$repoName topics already converged"
    DOTFILES_RUN_SKIPPED_TASKS+=(gh.topics)
  else
    emitEcsLogEvent info task.write success gh.topics 0 '' '' "$repoOwner/$repoName added=[${addedTopics[*]:-}] removed=[${removedTopics[*]:-}]"
    DOTFILES_RUN_SUCCESS_TASKS+=(gh.topics)
  fi;}

writeArtifactGithubHomepage(){ local repoOwner repoName currentHomepage repoIsPublic hasDeployedSite
  command -v gh >/dev/null 2>&1||return 0
  gh auth status >/dev/null 2>&1||return 0
  [[ -f $ASSESSMENT_FILE ]]||return 0
  repoOwner=$(jq -r '.repoOwner // ""' "$ASSESSMENT_FILE")
  repoName=$(jq -r '.repoName // ""' "$ASSESSMENT_FILE")
  repoIsPublic=$(jq -r '.repoIsPublic // false' "$ASSESSMENT_FILE")
  hasDeployedSite=$(jq -r '.hasDeployedSite // false' "$ASSESSMENT_FILE")
  [[ -z $repoOwner || -z $repoName ]]&&{ emitEcsLogEvent info task.skip success gh.homepage 0 '' '' "no GitHub remote owner/repo";return 0;}
  if [[ $repoIsPublic != true ]];then
    emitEcsLogEvent info task.skip success gh.homepage 0 '' '' "$repoOwner/$repoName private; homepage left untouched"
    DOTFILES_RUN_SKIPPED_TASKS+=(gh.homepage);return 0
  fi
  if [[ $hasDeployedSite == true ]];then
    emitEcsLogEvent info task.skip success gh.homepage 0 '' '' "$repoOwner/$repoName has its own deployed surface; homepage left untouched"
    DOTFILES_RUN_SKIPPED_TASKS+=(gh.homepage);return 0
  fi
  if [[ $repoName == wranngle_com || $repoName == wranngle.com ]];then
    emitEcsLogEvent info task.skip success gh.homepage 0 '' '' "$repoOwner/$repoName is the wranngle.com source; homepage left untouched"
    DOTFILES_RUN_SKIPPED_TASKS+=(gh.homepage);return 0
  fi
  currentHomepage=$(gh repo view "$repoOwner/$repoName" --json homepageUrl -q .homepageUrl 2>/dev/null||echo)
  if [[ -n $currentHomepage && $currentHomepage != "https://wranngle.com" && $currentHomepage != "https://wranngle.com/" ]];then
    emitEcsLogEvent info task.skip success gh.homepage 0 '' '' "$repoOwner/$repoName operator-set homepage='$currentHomepage' preserved"
    DOTFILES_RUN_SKIPPED_TASKS+=(gh.homepage);return 0
  fi
  if [[ $currentHomepage == "https://wranngle.com" ]];then
    emitEcsLogEvent info task.skip success gh.homepage 0 '' '' "$repoOwner/$repoName homepage already https://wranngle.com"
    DOTFILES_RUN_SKIPPED_TASKS+=(gh.homepage);return 0
  fi
  if gh repo edit "$repoOwner/$repoName" --homepage "https://wranngle.com" >/dev/null 2>&1;then
    emitEcsLogEvent info task.write success gh.homepage 0 '' '' "$repoOwner/$repoName homepage: '${currentHomepage:-(empty)}' -> https://wranngle.com"
    DOTFILES_RUN_SUCCESS_TASKS+=(gh.homepage)
  else
    emitEcsLogEvent warn task.write failure gh.homepage 0 '' '' "$repoOwner/$repoName gh repo edit --homepage failed"
    DOTFILES_RUN_FAILED_TASKS+=(gh.homepage)
  fi;}

# Spec §8 + §11.11 spec-gap note (resolved during implementation):
# GitHub does not expose programmatic toggles for the "Releases / Packages /
# Deployments" sidebar visibility on the repo About box. They auto-appear when
# matching artifacts exist (and disappear when none do). Confirmed via:
#   - REST PATCH /repos/{owner}/{repo}: only has_issues/has_projects/has_wiki/has_discussions
#   - GraphQL UpdateRepositoryInput: same field set, plus hasSponsorshipsEnabled
# This writer therefore PROBES current artifact existence and emits an ECS
# event documenting expected sidebar state. It exists as a verification surface
# (and a hook for if/when GitHub ships sidebar-visibility API), not a setter.
writeArtifactGithubDisplayCheckboxes(){ local repoOwner repoName hasReleases hasPackages hasDeployments
  command -v gh >/dev/null 2>&1||return 0
  gh auth status >/dev/null 2>&1||return 0
  [[ -f $ASSESSMENT_FILE ]]||return 0
  repoOwner=$(jq -r '.repoOwner // ""' "$ASSESSMENT_FILE")
  repoName=$(jq -r '.repoName // ""' "$ASSESSMENT_FILE")
  hasReleases=$(jq -r '.hasReleases // false' "$ASSESSMENT_FILE")
  hasPackages=$(jq -r '.hasPackages // false' "$ASSESSMENT_FILE")
  hasDeployments=$(jq -r '.hasDeployments // false' "$ASSESSMENT_FILE")
  [[ -z $repoOwner || -z $repoName ]]&&{ emitEcsLogEvent info task.skip success gh.display-checkboxes 0 '' '' "no GitHub remote owner/repo";return 0;}
  emitEcsLogEvent info task.write success gh.display-checkboxes 0 '' '' "$repoOwner/$repoName sidebar auto-state: releases=$hasReleases packages=$hasPackages deployments=$hasDeployments (no GitHub API to toggle; visibility follows artifact existence)"
  DOTFILES_RUN_SUCCESS_TASKS+=(gh.display-checkboxes);}

# Composite dispatcher — runs the four metadata writers in §5/§7/§6/§8 order.
# Called once per bootstrap from executeMainBootstrapEntryPoint, after the
# README + other managed-file artifacts have been written.
executeWranngleRepoMetadataPipeline(){
  shouldExecuteTaskGivenState gh.about&&writeArtifactGithubAboutField||emitEcsLogEvent info task.skip success gh.about 0 '' '' state=ok
  shouldExecuteTaskGivenState gh.topics&&writeArtifactGithubTopics||emitEcsLogEvent info task.skip success gh.topics 0 '' '' state=ok
  shouldExecuteTaskGivenState gh.homepage&&writeArtifactGithubHomepage||emitEcsLogEvent info task.skip success gh.homepage 0 '' '' state=ok
  shouldExecuteTaskGivenState gh.display-checkboxes&&writeArtifactGithubDisplayCheckboxes||emitEcsLogEvent info task.skip success gh.display-checkboxes 0 '' '' state=ok
  appendTaskStatusRecordToState gh.about ok ''
  appendTaskStatusRecordToState gh.topics ok ''
  appendTaskStatusRecordToState gh.homepage ok ''
  appendTaskStatusRecordToState gh.display-checkboxes ok '';}

hydrateGithubRepoSettingsViaCli(){ local repoSlug workflowPermissionsJson actionsPermissionsJson securityAnalysisJson
  command -v gh >/dev/null 2>&1||{ emitEcsLogEvent info task.skip success gh.repo-hydrate 0 '' '' "gh CLI not installed";DOTFILES_RUN_SKIPPED_TASKS+=(gh.repo-hydrate);return 0;}
  gh auth status >/dev/null 2>&1||{ emitEcsLogEvent info task.skip success gh.repo-hydrate 0 '' '' "gh not authenticated";DOTFILES_RUN_SKIPPED_TASKS+=(gh.repo-hydrate);return 0;}
  repoSlug=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null||echo)
  [[ -z $repoSlug ]]&&{ emitEcsLogEvent info task.skip success gh.repo-hydrate 0 '' '' "no GitHub repo detected";DOTFILES_RUN_SKIPPED_TASKS+=(gh.repo-hydrate);return 0;}
  # Description and topics are owned by executeWranngleRepoMetadataPipeline
  # (writeArtifactGithubAboutField + writeArtifactGithubTopics). This function
  # only owns mechanical repo settings (auto-merge, branch deletion, security
  # surfaces, label taxonomy, project wiring).
  if gh repo edit "$repoSlug" \
    --enable-wiki=false \
    --enable-issues=true \
    --enable-discussions=true \
    --enable-projects=false \
    --enable-auto-merge \
    --delete-branch-on-merge \
    --allow-update-branch \
    --enable-squash-merge \
    --enable-merge-commit=false \
    --enable-rebase-merge=false \
    --squash-merge-commit-message pr-title-description >/dev/null 2>&1;then
    emitEcsLogEvent info task.write success gh.repo-settings 0 '' '' "$repoSlug merge/issue/discussion defaults applied"
  else
    emitEcsLogEvent warn task.write failure gh.repo-settings 0 '' '' "$repoSlug merge/issue/discussion defaults skipped or denied"
  fi
  runGhApiCommandWithOutcome gh.dependabot-alerts "$repoSlug Dependabot alerts enabled" \
    gh api -X PUT "repos/${repoSlug}/vulnerability-alerts" -H "Accept: application/vnd.github+json" >/dev/null ||:
  runGhApiCommandWithOutcome gh.dependabot-security-updates "$repoSlug Dependabot security updates enabled" \
    gh api -X PUT "repos/${repoSlug}/automated-security-fixes" -H "Accept: application/vnd.github+json" >/dev/null ||:
  workflowPermissionsJson='{"default_workflow_permissions":"read","can_approve_pull_request_reviews":false}'
  applyGhApiJsonWithOutcome gh.actions-workflow-permissions PUT "repos/${repoSlug}/actions/permissions/workflow" "$workflowPermissionsJson" "$repoSlug Actions token defaults set to read-only and PR approval disabled" ||:
  actionsPermissionsJson='{"enabled":true,"allowed_actions":"all","sha_pinning_required":true}'
  applyGhApiJsonWithOutcome gh.actions-permissions PUT "repos/${repoSlug}/actions/permissions" "$actionsPermissionsJson" "$repoSlug Actions enabled with SHA pinning required" ||:
  securityAnalysisJson='{"security_and_analysis":{"secret_scanning":{"status":"enabled"},"secret_scanning_push_protection":{"status":"enabled"},"dependabot_security_updates":{"status":"enabled"}}}'
  applyGhApiJsonWithOutcome gh.secret-scanning PATCH "repos/${repoSlug}" "$securityAnalysisJson" "$repoSlug secret scanning, push protection, and Dependabot security updates requested" ||:
  emitEcsLogEvent info task.write success gh.repo-hydrate 0 '' '' "applied available repo settings to $repoSlug (description+topics owned by gh.about/gh.topics)"
  seedCanonicalGithubLabels "$repoSlug"
  pruneReplacedDefaultLabels "$repoSlug"
  ensureUserLevelTriageProject
  wireRepoToTriageProject "$repoSlug"
  configureGithubDefaultBranchAutomation "$repoSlug"
  configureGithubRulesetAutomation "$repoSlug"
  appendTaskStatusRecordToState gh.repo-hydrate ok ''
  DOTFILES_RUN_SUCCESS_TASKS+=(gh.repo-hydrate)
}

rotateLogFileIfTooLarge(){ local maxBytes=${DOTFILES_LOG_MAX_BYTES:-1048576} currentSize
  [[ -n $LOG_FILE && -f $LOG_FILE ]]||return 0
  currentSize=$(stat -c%s "$LOG_FILE" 2>/dev/null||stat -f%z "$LOG_FILE" 2>/dev/null||echo 0)
  ((currentSize > maxBytes))||return 0
  mv -f "$LOG_FILE" "${LOG_FILE}.1" 2>/dev/null||return 0
  emitEcsLogEvent info task.maintenance success log-rotate 0 '' '' "rotated $LOG_FILE (size=$currentSize > max=$maxBytes)"
}

pruneStaleStateFiles(){ local maxAgeDays=${DOTFILES_STATE_MAX_AGE_DAYS:-30} pruned=0 stateFile
  # Two scopes: (a) rotate stale date-keyed event logs in THIS repo's
  # `.artifacts/dotfiles-bootstrap/`, never touching tasks.jsonl or
  # assessment.json which are how we resume; (b) sweep legacy XDG state for
  # OTHER repos (their REPO_KEY hash) older than maxAgeDays.
  if [[ -d $STATE_DIRECTORY ]];then
    while IFS= read -r -d '' stateFile;do
      [[ $stateFile == "$TASK_STATE_FILE" || $stateFile == "$ASSESSMENT_FILE" ]]&&continue
      rm -f "$stateFile" 2>/dev/null && pruned=$((pruned+1))
    done < <(find "$STATE_DIRECTORY" -maxdepth 1 -type f -name 'events.*.jsonl' -mtime +"$maxAgeDays" -print0 2>/dev/null)
  fi
  if [[ -d $LEGACY_XDG_STATE_DIR ]];then
    while IFS= read -r -d '' stateFile;do
      rm -f "$stateFile" 2>/dev/null && pruned=$((pruned+1))
    done < <(find "$LEGACY_XDG_STATE_DIR" -maxdepth 1 -type f \( -name '*.jsonl' -o -name '*.assessment.json' \) -mtime +"$maxAgeDays" -print0 2>/dev/null)
  fi
  ((pruned>0))&&emitEcsLogEvent info task.maintenance success state-prune 0 '' '' "pruned $pruned state files older than ${maxAgeDays}d"||true
}

# Detects cruft the writers can't fix: files not owned by the running user
# (typical sudo / cross-OS leftovers) and Windows ADS sidecars from WSL drag-drop.
# DOTFILES_AUDIT_CLEAN=1 attempts removal; otherwise warns only.
auditAndCleanRepoCruft(){ local autoClean=${DOTFILES_AUDIT_CLEAN:-0} currentUid stray detected=0
  currentUid=$(id -u)
  while IFS= read -r -d '' stray;do
    detected=$((detected+1))
    if ((autoClean));then
      sudo -n rm -f "$stray" 2>/dev/null && emitEcsLogEvent info task.cleanup success cruft-audit 0 '' '' "sudo-removed non-owner file $stray" \
        || emitEcsLogEvent warn task.cleanup failure cruft-audit 0 '' '' "non-owner file (passwordless sudo unavailable): $stray"
    else
      emitEcsLogEvent warn task.cleanup failure cruft-audit 0 '' '' "non-owner file (DOTFILES_AUDIT_CLEAN=1 + passwordless sudo to remove): $stray"
    fi
  done < <(find "$REPO_ROOT" -maxdepth 4 ! -uid "$currentUid" -not -path '*/.git/*' -print0 2>/dev/null)
  while IFS= read -r -d '' stray;do
    detected=$((detected+1))
    if ((autoClean));then
      rm -f "$stray" 2>/dev/null && emitEcsLogEvent info task.cleanup success cruft-audit 0 '' '' "removed Zone.Identifier sidecar $stray"
    else
      emitEcsLogEvent warn task.cleanup failure cruft-audit 0 '' '' "Zone.Identifier sidecar (DOTFILES_AUDIT_CLEAN=1 to remove): $stray"
    fi
  done < <(find "$REPO_ROOT" -maxdepth 5 -type f -name '*Zone.Identifier*' -not -path '*/.git/*' -print0 2>/dev/null)
  ((detected==0))&&emitEcsLogEvent info task.cleanup success cruft-audit 0 '' '' "no cruft detected"||true
}

readonly BROWNFIELD_ADVISORY_FILE_PATHS=(.gitattributes .automation/policy.json schemas/automation-policy.v1.json scripts/bin/git-conformance)
readonly SECURITY_HYGIENE_MANAGED_FILE_PATHS=(.gitattributes .gitignore .editorconfig .yamllint.yml .github/dependabot.yml .github/ISSUE_TEMPLATE/config.yml .github/ISSUE_TEMPLATE/bug_report.yml .github/ISSUE_TEMPLATE/feature_request.yml .github/ISSUE_TEMPLATE/research.yml .github/workflows/ci.yml .github/workflows/automerge.yml .github/workflows/security.yml .github/workflows/issue-triage.yml .github/workflows/pr-link-check.yml .github/workflows/gitleaks.yml .github/CODEOWNERS SECURITY.md scripts/bin/git-awesome .gitleaks.toml)

dotfilesCliUsage(){
  cat <<'USAGE'
Usage:
  .dotfiles.sh audit
  .dotfiles.sh plan [--profile client|external|repo-default|wranngle-house]
  .dotfiles.sh apply [--advisory|--managed] [--profile client|external|repo-default|wranngle-house] [--github-hydrate|--no-github-hydrate] [--skip-llm]

Defaults:
  no command       legacy managed bootstrap
  audit, plan      non-mutating repo inspection; logs write under XDG state, not the repo
  apply --advisory minimal brownfield PR surface, no GitHub hydration, no LLM
USAGE
}

jsonArrayFromLines(){
  jq -R -s -c 'split("\n") | map(select(length > 0))'
}

emitBrownfieldAuditJson(){
  local assessmentJson='{}' branch defaultBranch remoteUrl dirtyCount stagedCount untrackedCount workflowJson manifestJson policyMode conformancePresent
  [[ -f $ASSESSMENT_FILE ]]&&assessmentJson=$(jq -c . "$ASSESSMENT_FILE" 2>/dev/null||printf '{}')
  branch=$(git symbolic-ref --quiet --short HEAD 2>/dev/null||git rev-parse --short HEAD 2>/dev/null||printf '')
  defaultBranch=$(git remote show origin 2>/dev/null|sed -n 's/.*HEAD branch: //p'|head -1)
  remoteUrl=$(git remote get-url origin 2>/dev/null||printf '')
  dirtyCount=$(git status --porcelain=v1 --untracked-files=all 2>/dev/null|wc -l|tr -d ' ')
  stagedCount=$(git diff --cached --name-only 2>/dev/null|wc -l|tr -d ' ')
  untrackedCount=$(git ls-files --others --exclude-standard 2>/dev/null|wc -l|tr -d ' ')
  workflowJson=$(find .github/workflows -maxdepth 1 -type f \( -name '*.yml' -o -name '*.yaml' \) -print 2>/dev/null|sort|jsonArrayFromLines)
  manifestJson=$(find . -maxdepth 3 -type f \( -name package.json -o -name pyproject.toml -o -name Cargo.toml -o -name go.mod -o -name composer.json -o -name requirements.txt \) -not -path './.git/*' -print 2>/dev/null|sort|jsonArrayFromLines)
  policyMode=$(jq -r '.mode // "absent"' .automation/policy.json 2>/dev/null||printf absent)
  [[ -x scripts/bin/git-conformance ]]&&conformancePresent=true||conformancePresent=false
  jq -nc \
    --arg root "$REPO_ROOT" \
    --arg branch "$branch" \
    --arg defaultBranch "$defaultBranch" \
    --arg remoteUrl "$remoteUrl" \
    --arg policyMode "$policyMode" \
    --argjson assessment "$assessmentJson" \
    --argjson dirtyCount "$dirtyCount" \
    --argjson stagedCount "$stagedCount" \
    --argjson untrackedCount "$untrackedCount" \
    --argjson workflows "$workflowJson" \
    --argjson manifests "$manifestJson" \
    --argjson conformancePresent "$conformancePresent" \
    '{mode:"audit",root:$root,git:{branch:$branch,default_branch:$defaultBranch,remote_url:$remoteUrl,dirty_count:$dirtyCount,staged_count:$stagedCount,untracked_count:$untrackedCount},assessment:$assessment,existing:{policy_mode:$policyMode,conformance_present:$conformancePresent,workflows:$workflows,manifests:$manifests},recommendation:{profile:"client",first_apply:"apply --advisory --profile client --no-github-hydrate --skip-llm"}}'
}

emitBrownfieldPlanJson(){
  local profile=${DOTFILES_REPO_PROFILE:-client} advisoryFilesJson managedFilesJson
  advisoryFilesJson=$(printf '%s\n' "${BROWNFIELD_ADVISORY_FILE_PATHS[@]}"|jsonArrayFromLines)
  managedFilesJson=$(printf '%s\n' "${MANAGED_FILE_PATHS[@]}"|jsonArrayFromLines)
  jq -nc \
    --arg root "$REPO_ROOT" \
    --arg profile "$profile" \
    --argjson advisory "$advisoryFilesJson" \
    --argjson managed "$managedFilesJson" \
    '{mode:"plan",root:$root,profile:$profile,phases:[
      {name:"audit",mutates_repo:false,description:"inspect repo shape, existing automation, branch state, and maturity"},
      {name:"advisory",mutates_repo:true,github_admin:false,files:$advisory,description:"minimal brownfield PR surface; no existing CI replacement"},
      {name:"managed",mutates_repo:true,github_admin:false,files:$managed,description:"full managed artifact rollout; use only after advisory adoption"},
      {name:"github-hydrate",mutates_repo:false,github_admin:true,description:"repo settings, rulesets, labels, security toggles; explicit admin opt-in only"}
    ],recommended_command:"DOTFILES_REPO_PROFILE=client DOTFILES_SKIP_LLM=1 DOTFILES_SKIP_GH_HYDRATE=1 .dotfiles.sh apply --advisory"}'
}

executeBrownfieldAuditEntryPoint(){
  cleanWslPath
  emitEcsLogEvent info boot success init 0 '' '' "v$DOTFILES_BOOTSTRAP_VERSION mode=audit root=$REPO_ROOT key=$REPO_KEY run_id=$DOTFILES_BOOTSTRAP_RUN_ID"
  executeRepositoryAssessmentPhase||:
  emitBrownfieldAuditJson
  emitEcsLogEvent info boot success "done"
}

executeBrownfieldPlanEntryPoint(){
  cleanWslPath
  emitEcsLogEvent info boot success init 0 '' '' "v$DOTFILES_BOOTSTRAP_VERSION mode=plan root=$REPO_ROOT key=$REPO_KEY run_id=$DOTFILES_BOOTSTRAP_RUN_ID"
  executeRepositoryAssessmentPhase||:
  emitBrownfieldPlanJson
  emitEcsLogEvent info boot success "done"
}

executeBrownfieldAdvisoryApplyEntryPoint(){
  DOTFILES_REPO_PROFILE=${DOTFILES_REPO_PROFILE:-client}
  DOTFILES_SKIP_LLM=1
  DOTFILES_SKIP_GH_HYDRATE=1
  cleanWslPath
  emitEcsLogEvent info boot success init 0 '' '' "v$DOTFILES_BOOTSTRAP_VERSION mode=apply-advisory profile=$DOTFILES_REPO_PROFILE root=$REPO_ROOT key=$REPO_KEY force=$FORCE run_id=$DOTFILES_BOOTSTRAP_RUN_ID"
  rotateLogFileIfTooLarge
  executeRepositoryAssessmentPhase||:
  local managedPath
  for managedPath in "${BROWNFIELD_ADVISORY_FILE_PATHS[@]}";do dispatchManagedFileTaskByPath "$managedPath";done
  if [[ -x scripts/bin/git-conformance ]];then
    scripts/bin/git-conformance check --allow-dirty >/dev/null || emitEcsLogEvent warn task.validate failure git-conformance 0 '' '' "advisory conformance reported failures"
  fi
  emitEcsLogEvent info task.skip success gh.repo-hydrate 0 '' '' "advisory mode never hydrates GitHub settings"
  DOTFILES_RUN_SKIPPED_TASKS+=(gh.repo-hydrate)
  emitEcsLogEvent info boot success "done"
  emitTerminalRunSummaryEvent
}

executeSecurityOnlyEntryPoint(){
  cleanWslPath
  emitEcsLogEvent info boot success init 0 '' '' "v$DOTFILES_BOOTSTRAP_VERSION mode=security-only root=$REPO_ROOT key=$REPO_KEY force=$FORCE run_id=$DOTFILES_BOOTSTRAP_RUN_ID"
  rotateLogFileIfTooLarge
  auditAndCleanRepoCruft
  bootstrapDirectoryTree
  probeAvailableLlmProviders||:
  if shouldExecuteTaskGivenState assess;then executeRepositoryAssessmentPhase;else emitEcsLogEvent info task.skip success assess 0 '' '' state=ok;DOTFILES_RUN_SKIPPED_TASKS+=(assess);fi
  retireUnsafeLegacyGithubWorkflows||:
  cleanupLegacyGitAutomationArtifacts||:
  local managedPath
  for managedPath in "${SECURITY_HYGIENE_MANAGED_FILE_PATHS[@]}";do dispatchManagedFileTaskByPath "$managedPath";done
  installGitleaksBinary||:
  installGitleaksPreCommitHookInProject||:
  if [[ ${DOTFILES_SKIP_GH_HYDRATE:-0} == 1 ]];then
    emitEcsLogEvent info task.skip success gh.repo-hydrate 0 '' '' "DOTFILES_SKIP_GH_HYDRATE=1"
    DOTFILES_RUN_SKIPPED_TASKS+=(gh.repo-hydrate)
  else
    hydrateGithubRepoSettingsViaCli||:
  fi
  emitEcsLogEvent info boot success "done"
  emitTerminalRunSummaryEvent
}

# README-only mode: runs the minimal slice needed to stamp README.md +
# repo-metadata (About/topics/homepage/display-checkboxes) without overwriting
# the dozens of unrelated managed files that the full bootstrap creates.
# Authority: WRANNGLE-README-SYSTEM.md spec §10 (closed-loop verification)
# requires this surface so the loop can run against consumer repos that have
# not adopted the full dotfiles surface.
executeReadmeOnlyEntryPoint(){
  cleanWslPath
  emitEcsLogEvent info boot success init 0 '' '' "v$DOTFILES_BOOTSTRAP_VERSION mode=readme-only root=$REPO_ROOT key=$REPO_KEY force=$FORCE run_id=$DOTFILES_BOOTSTRAP_RUN_ID"
  if ! isCurrentRepoOnReadmeAllowList;then
    emitEcsLogEvent warn boot success init 0 '' '' "readme-only mode invoked but repo is not on WRANNGLE_README_SYSTEM_ENABLED_REPOS allow-list and lacks .dotfiles-readme-managed marker; refusing to stamp"
    printf 'DOTFILES_README_ONLY=1 refused: %s is not on the README writer allow-list.\n' "$REPO_ROOT" >&2
    printf 'To opt this repo in: add its slug to WRANNGLE_README_SYSTEM_ENABLED_REPOS in ~/.dotfiles/.dotfiles.sh OR `touch %s/.dotfiles-readme-managed`.\n' "$REPO_ROOT" >&2
    return 0
  fi
  rotateLogFileIfTooLarge
  bootstrapDirectoryTree
  probeAvailableLlmProviders||:
  # README-only mode does not write `scripts/bin/llm.sh` into the consumer
  # repo. The README writer falls back to `~/.dotfiles/scripts/bin/llm.sh`
  # via `invokeLlmFallbackScriptViaStdin`.
  if shouldExecuteTaskGivenState assess;then executeRepositoryAssessmentPhase;else emitEcsLogEvent info task.skip success assess 0 '' '' state=ok;DOTFILES_RUN_SKIPPED_TASKS+=(assess);fi
  # Only stamp README.md. Skip every other managed file.
  dispatchManagedFileTaskByPath README.md
  executeWranngleRepoMetadataPipeline||:
  emitEcsLogEvent info boot success "done"
  emitTerminalRunSummaryEvent
}

executeMainBootstrapEntryPoint(){
  if [[ ${DOTFILES_SECURITY_ONLY:-0} == 1 ]];then
    executeSecurityOnlyEntryPoint
    return $?
  fi
  if [[ ${DOTFILES_README_ONLY:-0} == 1 ]];then
    executeReadmeOnlyEntryPoint
    return $?
  fi
  cleanWslPath
  emitEcsLogEvent info boot success init 0 '' '' "v$DOTFILES_BOOTSTRAP_VERSION root=$REPO_ROOT key=$REPO_KEY force=$FORCE run_id=$DOTFILES_BOOTSTRAP_RUN_ID"
  rotateLogFileIfTooLarge
  pruneStaleStateFiles
  auditAndCleanRepoCruft
  bootstrapDirectoryTree
  installHostCompressionTools
  normalizeProjectAgentInstructionFiles||:
  bootstrapUnifiedEnv
  bootstrapDependencies
  patchExistingSkills
  probeAvailableLlmProviders||:
  if shouldExecuteTaskGivenState llm.sh;then writeLlmFallbackScriptToDisk;else emitEcsLogEvent info task.skip success llm.sh 0 '' '' state=ok;DOTFILES_RUN_SKIPPED_TASKS+=(llm.sh);fi
  if shouldExecuteTaskGivenState assess;then executeRepositoryAssessmentPhase;else emitEcsLogEvent info task.skip success assess 0 '' '' state=ok;DOTFILES_RUN_SKIPPED_TASKS+=(assess);fi
  emitEcsLogEvent info policy.dump success init 0 '' '' "$(for managedPath in "${MANAGED_FILE_PATHS[@]}";do printf '%s=%s ' "$managedPath" "$(resolveFilePolicyByPath "$managedPath")";done)"
  retireUnsafeLegacyGithubWorkflows||:
  cleanupLegacyGitAutomationArtifacts||:
  for managedPath in "${MANAGED_FILE_PATHS[@]}";do dispatchManagedFileTaskByPath "$managedPath";done
  ensureBrandDesignDocSymlinkInAgentsHome||:
  installCanonicalDesignDocAtRepoRoot||:
  if [[ ${DOTFILES_SKIP_GH_HYDRATE:-0} == 1 ]];then
    emitEcsLogEvent info task.skip success gh.repo-hydrate 0 '' '' "DOTFILES_SKIP_GH_HYDRATE=1"
    DOTFILES_RUN_SKIPPED_TASKS+=(gh.repo-hydrate)
  else
    hydrateGithubRepoSettingsViaCli||:
  fi
  executeWranngleRepoMetadataPipeline||:
  installHostLevelAutonomyCronJobs||:
  installHostLevelSecretScanTools||:
  runComposioEnvLintAdvisory||:
  emitEcsLogEvent info boot success "done"
  emitTerminalRunSummaryEvent
}

executeDotfilesCli(){
  local command=apply applyMode=managed arg profileSeen=0
  if (($# > 0));then
    case "$1" in
      audit|plan|apply) command=$1;shift;;
      -h|--help|help) dotfilesCliUsage;return 0;;
    esac
  fi
  while (($# > 0));do
    arg=$1
    case "$arg" in
      --profile)
        DOTFILES_REPO_PROFILE=${2:-}
        [[ -n $DOTFILES_REPO_PROFILE ]]||{ echo "missing --profile value" >&2;return 2; }
        profileSeen=1
        shift 2
        ;;
      --profile=*)
        DOTFILES_REPO_PROFILE=${arg#--profile=}
        profileSeen=1
        shift
        ;;
      --advisory) applyMode=advisory;shift;;
      --managed) applyMode=managed;shift;;
      --github-hydrate) DOTFILES_SKIP_GH_HYDRATE=0;shift;;
      --no-github-hydrate) DOTFILES_SKIP_GH_HYDRATE=1;shift;;
      --skip-llm) DOTFILES_SKIP_LLM=1;shift;;
      -h|--help|help) dotfilesCliUsage;return 0;;
      *) echo "unknown .dotfiles.sh argument: $arg" >&2;dotfilesCliUsage >&2;return 2;;
    esac
  done
  if (( profileSeen ));then
    case "$DOTFILES_REPO_PROFILE" in
      client|external|repo-default|wranngle-house|owned-greenfield) ;;
      *) echo "invalid --profile: $DOTFILES_REPO_PROFILE" >&2;return 2;;
    esac
  fi
  case "$command" in
    audit) executeBrownfieldAuditEntryPoint;;
    plan) executeBrownfieldPlanEntryPoint;;
    apply)
      if [[ "$applyMode" == advisory ]];then
        executeBrownfieldAdvisoryApplyEntryPoint
      else
        executeMainBootstrapEntryPoint
      fi
      ;;
  esac
}

if [[ ${BASH_SOURCE[0]} == "${0}" ]];then executeDotfilesCli "$@";fi
