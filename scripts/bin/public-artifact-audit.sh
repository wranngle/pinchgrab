#!/usr/bin/env bash
# public-artifact-audit.sh -- find repo-internal agent scaffolding committed to public GitHub repos.
set -uo pipefail

usage(){
  cat <<'USAGE'
Usage:
  public-artifact-audit.sh [--roots ROOT[:ROOT...]] [--all] [--block]

Defaults:
  --roots "$HOME/projects:$HOME/.dotfiles"
  public GitHub repositories only

Flags:
  --all    Include private, internal, and unknown-visibility repos.
  --block  Exit 2 when findings exist.
USAGE
}

roots=${PUBLIC_ARTIFACT_AUDIT_ROOTS:-$HOME/projects:$HOME/.dotfiles}
public_only=1
block=0

while [[ $# -gt 0 ]];do
  case "$1" in
    --roots) roots=${2:-}; shift 2;;
    --all) public_only=0; shift;;
    --block) block=1; shift;;
    -h|--help) usage; exit 0;;
    *) printf 'public-artifact-audit: unknown option: %s\n' "$1" >&2; usage; exit 1;;
  esac
done

declare -A seen=()
declare -a repos=()

add_repo(){
  local dir=$1 repo
  repo=$(git -C "$dir" rev-parse --show-toplevel 2>/dev/null || true)
  [[ -n $repo ]] || return 0
  if [[ -z ${seen[$repo]+x} ]];then
    seen[$repo]=1
    repos+=("$repo")
  fi
}

IFS=: read -r -a root_array <<<"$roots"
for root in "${root_array[@]}";do
  [[ -n $root && -e $root ]] || continue
  add_repo "$root"
  while IFS= read -r gitdir;do
    add_repo "$(dirname "$gitdir")"
  done < <(
    find "$root" -maxdepth 5 \
      \( -path '*/node_modules/*' -o -path '*/.symphony/workspaces/*' -o -path '*/.work/attempts/*' \) -prune -o \
      \( -type d -name .git -o -type f -name .git \) -print 2>/dev/null
  )
done

repo_slug(){
  local repo=$1 url slug
  url=$(git -C "$repo" remote get-url origin 2>/dev/null || true)
  [[ -n $url ]] || return 0
  slug=$(printf '%s\n' "$url" | sed -nE 's#^https://github.com/([^/]+/[^/.]+)(\.git)?$#\1#p; s#^git@github.com:([^/]+/[^/.]+)(\.git)?$#\1#p')
  printf '%s' "$slug"
}

repo_visibility(){
  local slug=$1
  if [[ -z $slug ]];then
    printf 'UNKNOWN'
  elif command -v gh >/dev/null 2>&1;then
    gh repo view "$slug" --json visibility --jq '.visibility' 2>/dev/null || printf 'UNKNOWN'
  else
    printf 'UNKNOWN'
  fi
}

tracked_artifacts(){
  local repo=$1
  git -C "$repo" ls-files 2>/dev/null | awk '
    BEGIN {IGNORECASE=1}
    /^openspec\// {print; next}
    /^\.claude\/commands\/openspec\// {print; next}
    /^\.gemini\/commands\/openspec\// {print; next}
    /^\.work\/attempts\// {print; next}
    /:Zone\.Identifier$/ {print; next}
  '
}

findings=0
for repo in "${repos[@]}";do
  slug=$(repo_slug "$repo")
  visibility=$(repo_visibility "$slug")
  if [[ $public_only -eq 1 && $visibility != PUBLIC ]];then
    continue
  fi

  mapfile -t paths < <(tracked_artifacts "$repo")
  [[ ${#paths[@]} -gt 0 ]] || continue

  findings=$((findings+${#paths[@]}))
  printf 'PUBLIC_ARTIFACT repo=%s visibility=%s path=%s\n' "${slug:-$repo}" "$visibility" "$repo"
  for path in "${paths[@]}";do
    printf '  - %s\n' "$path"
  done
done

if [[ $findings -gt 0 ]];then
  printf 'public-artifact-audit: %s tracked artifact(s) found\n' "$findings" >&2
  [[ $block -eq 1 ]] && exit 2
fi
