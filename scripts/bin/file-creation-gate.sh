#!/usr/bin/env bash
# file-creation-gate.sh — Claude Code PreToolUse hook on Write.
#
# ADVISORY ONLY: never blocks. Emits {continue:true} on stdout and
# guidance on stderr. Mirrors the original TypeScript hook's intent
# (migrated 2026-05-06 from wranngle/.claude/hooks/on-tool-invoke/
# file_creation_gate.ts):
#   1. Cloud-first reminder (n8n, ElevenLabs, Twilio, Zapier, Make,
#      Vercel, Supabase, Firebase) — local files cause sync drift.
#   2. snake_case + forbidden-term + tech-standard naming guidance.
#   3. Sibling-collision warning (creating foo.ts when foo.js exists).
#
# Hook contract:
#   stdin  : JSON {tool_name, tool_input:{file_path, content?}, ...}
#   stdout : {"continue": true, "systemMessage": "..."} (or just continue:true)
#   stderr : human-readable guidance Claude sees
#   exit   : 0 always
set -uo pipefail
export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$PATH"

emit_allow(){
  local msg=${1:-}
  if [[ -n $msg ]]; then
    printf '{"continue":true,"systemMessage":%s}' "$(printf '%s' "$msg" | jq -Rs .)"
  else
    printf '{"continue":true}'
  fi
  exit 0
}

trap 'emit_allow' ERR

command -v jq >/dev/null 2>&1 || emit_allow

input=$(cat 2>/dev/null || true)
[[ -n $input ]] || emit_allow

tool_name=$(jq -r '.tool_name // ""' <<<"$input" 2>/dev/null || printf '')
[[ $tool_name == "Write" || $tool_name == "write_file" ]] || emit_allow

file_path=$(jq -r '.tool_input.file_path // ""' <<<"$input" 2>/dev/null || printf '')
[[ -n $file_path ]] || emit_allow

content=$(jq -r '.tool_input.content // ""' <<<"$input" 2>/dev/null || printf '')
basename=${file_path##*/}
basename_lower=${basename,,}
ext=${basename##*.}

IMMUTABLE='Dockerfile Makefile Jenkinsfile Vagrantfile Procfile README.md LICENSE LICENSE.md CHANGELOG.md CONTRIBUTING.md CODE_OF_CONDUCT.md SECURITY.md AUTHORS NOTICE package.json package-lock.json yarn.lock pnpm-lock.yaml bun.lock Cargo.toml Cargo.lock Gemfile Gemfile.lock requirements.txt setup.py pyproject.toml poetry.lock go.mod go.sum composer.json composer.lock tsconfig.json jsconfig.json babel.config.js webpack.config.js vite.config.ts vite.config.js rollup.config.js esbuild.config.js jest.config.js jest.config.ts vitest.config.ts tailwind.config.js tailwind.config.ts postcss.config.js next.config.js next.config.mjs nuxt.config.ts astro.config.mjs svelte.config.js'
for n in $IMMUTABLE; do
  [[ $basename == "$n" ]] && emit_allow
done
[[ $basename == .* ]] && emit_allow

if [[ $basename =~ ^[A-Z][a-zA-Z0-9]*\.(tsx|jsx|vue|svelte)$ ]] \
  || [[ $basename =~ ^(page|layout|loading|error|not-found|template|default)\.(tsx|jsx|ts|js)$ ]] \
  || [[ $basename =~ ^index\.(ts|tsx|js|jsx|mjs|cjs)$ ]]; then
  emit_allow
fi

advisories=()
summary=()

cloud_check=1
case "$file_path" in
  */templates/*|*/fixtures/*|*/__mocks__/*|*/test-data/*|*/mocks/*|*/.absorbed/*) cloud_check=0;;
esac
case "$basename_lower" in
  backup_*|export_*|template_*|archived_*|snapshot_*) cloud_check=0;;
esac

CLOUD_RULES=(
  "n8n|(workflow.*\.json$|/n8n/.*\.json$|n8n[-_].*\.json$|automation.*\.json$|_workflow\.json$|workflow_.*\.json$)|nodes,connections,settings|mcp__n8n-mcp__n8n_create_workflow|Create workflows in n8n via MCP. Local JSON drifts from cloud."
  "ElevenLabs|(agent.*config.*\.json$|elevenlabs.*agent.*\.json$|conversational.*agent.*\.json$|voice.*agent.*\.json$)|system_prompt,first_message,voice_id,llm|mcp__elevenlabs-mcp__create_agent|Create agents in ElevenLabs via MCP. Don't store agent configs locally."
  "Twilio Studio|(twilio.*flow.*\.json$|studio.*flow.*\.json$|twilio.*config.*\.json$)|states,transitions,initial_state,flags|Twilio Studio API or Console|Create Twilio Studio flows in Console or via API."
  "Zapier|(zapier.*\.json$|zap.*config.*\.json$)|trigger,actions,filters|Zapier Web Interface|Zapier zaps live only in the Zapier web interface."
  "Make.com|(make.*scenario.*\.json$|integromat.*\.json$)|modules,connections,scheduling|Make.com Web Interface|Make.com scenarios should be built in the web interface."
  "Vercel|(vercel.*\.json$|deployment.*config.*\.json$)|builds,routes,env,regions|Vercel CLI or Dashboard|Vercel config belongs in vercel.json or the dashboard."
  "Supabase|(supabase.*config.*\.json$|supabase.*functions.*\.json$)|functions,auth,storage,database|Supabase CLI or Dashboard|Supabase config should use CLI migrations or dashboard."
  "Firebase|(firebase.*rules.*\.json$|firestore.*rules.*\.json$)|rules,indexes,functions|Firebase CLI|Firebase rules/config should be deployed via firebase CLI."
)

if [[ $cloud_check -eq 1 ]]; then
  for rule in "${CLOUD_RULES[@]}"; do
    IFS='|' read -r svc fpat indicators tool guidance <<<"$rule"
    if [[ $basename_lower =~ $fpat || ${file_path,,} =~ $fpat ]]; then
      hits=0
      IFS=',' read -ra ind_arr <<<"$indicators"
      if [[ -n $content ]]; then
        for k in "${ind_arr[@]}"; do
          if grep -qF "\"$k\"" <<<"$content" 2>/dev/null; then
            hits=$((hits+1))
          fi
        done
      fi
      if [[ -z $content || $hits -ge 1 ]]; then
        advisories+=("CLOUD-FIRST: '$basename' looks like a $svc object (filename+${hits} indicator(s)). Prefer: $tool. $guidance Bypass via templates/ fixtures/ or backup_ export_ prefix.")
        summary+=("cloud-first:$svc")
        break
      fi
    fi
  done
fi

name_no_ext=${basename%.*}
name_lower=${name_no_ext,,}

forbidden=(temp tmp test final new old copy backup bak draft wip todo fixme hack untitled unnamed script file data stuff thing misc other sample example)
for term in "${forbidden[@]}"; do
  if [[ $name_lower == "$term" \
     || $name_lower == "${term}_"* \
     || $name_lower == *"_${term}" \
     || $name_lower == *"_${term}_"* ]]; then
    advisories+=("NAMING: forbidden term '$term' in '$basename' — use descriptive professional naming.")
    summary+=("forbidden:$term")
    break
  fi
done

if [[ $name_lower =~ (^|[_-])v[0-9]+ || $name_lower =~ (^|[_-])r[0-9]+ ]]; then
  advisories+=("NAMING: version suffix in '$basename' — move superseded files to /old/ instead of v1/v2/r1.")
  summary+=("version-suffix")
fi

if [[ $name_no_ext =~ [A-Z] ]]; then
  advisories+=("NAMING: uppercase in '$basename' — convert to snake_case (MyFile → my_file).")
  summary+=("uppercase")
fi
if [[ $name_no_ext == *-* ]]; then
  advisories+=("NAMING: hyphens in '$basename' — replace with underscores.")
  summary+=("hyphens")
fi
if [[ $name_no_ext =~ [[:space:]] ]]; then
  advisories+=("NAMING: whitespace in '$basename' — replace with underscores.")
  summary+=("whitespace")
fi

generic=(utils helpers common shared misc lib core main app types models services)
for g in "${generic[@]}"; do
  if [[ $name_lower == "$g" ]]; then
    advisories+=("NAMING: '$g' is too generic — be specific (e.g. user_authentication_$g).")
    summary+=("generic:$g")
    break
  fi
done

# Tech-standards advisory: discourage shell/python/batch for business logic.
# F5 bypass per migration plan: skip this advisory under ~/.dotfiles/, scripts/bin/,
# or any project's scripts/ dir, where shell is the canonical surface.
tech_check=1
case "$file_path" in
  */.dotfiles/*|*/scripts/bin/*|*/scripts/*) tech_check=0;;
esac
if [[ $tech_check -eq 1 ]]; then
  case "$ext" in
    py|ps1|psm1|sh|bash|zsh|bat|cmd)
      case "$basename" in
        requirements.txt|setup.py|pyproject.toml) ;;
        *) advisories+=("TECH: .$ext discouraged for business logic — .sh preferred. TypeScript only for bootstrapping.")
           summary+=("tech:.$ext");;
      esac
      ;;
  esac
fi

dir=${file_path%/*}
if [[ -d $dir ]]; then
  for sibling in "$dir"/"$name_no_ext".*; do
    [[ -e $sibling ]] || continue
    sib_base=${sibling##*/}
    [[ $sib_base == "$basename" ]] && continue
    advisories+=("SUPERSESSION: '$sib_base' already exists in $dir — extend it, or move it to /old/${sib_base%.*}_archived_$(date +%Y%m%d).${sib_base##*.} first.")
    summary+=("collision:$sib_base")
    break
  done
fi

if [[ ${#advisories[@]} -eq 0 ]]; then
  emit_allow
fi

{
  printf '\n[file-creation-gate] %s\n' "$file_path"
  for line in "${advisories[@]}"; do
    printf '  - %s\n' "$line"
  done
} >&2

emit_allow "[file-creation-gate] $(IFS=' | '; printf '%s' "${summary[*]}"). See stderr for guidance."
