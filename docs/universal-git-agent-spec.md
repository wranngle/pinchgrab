# Universal Git Agent Spec

Status: draft v1. Source doctrine: `/git-reconcile`.

## 1. Scope

This spec defines how autonomous coding agents preserve, classify, integrate,
and hand off Git work. It is not a release-branching model and it is not a
global Git configuration mandate.

## 2. Policy Layers

1. Universal invariants:
   preserve work, avoid accidental branch mutation, classify state before
   action, keep secrets out, validate behavior, and finish with an explainable
   handoff.
2. Repo policy:
   `.automation/policy.json` declares local integration mode, required checks,
   WIP ref grammar, and finalizer behavior.
3. House style:
   Wranngle-managed repos default to trunk-based GitHub Flow, short-lived
   branches, PRs, squash merge, branch deletion, and no long-lived development
   branch. This is a default overlay, not universal law. Bootstrap callers can
   set `DOTFILES_REPO_PROFILE=client`, `external`, or `repo-default` to suppress
   the Wranngle merge-style overlay.

## 3. Required Files For Managed Repos

- `.automation/policy.json`
- `.gitattributes`
- `.gitignore`
- `schemas/automation-policy.v1.json`
- CI that runs the repo's native tests and, when present,
  `scripts/bin/git-conformance`
- An explicit finalizer command when policy says `finalizer.required=true`
- A WIP-ref GC command when policy declares `wip_refs.gc_command`

## 4. WIP Refs

Canonical WIP refs MUST use:

```text
wip/<agent-kind>/<session-id>/<base>
```

`agent-kind` names the writer class, such as `autosync`, `codex`, or `claude`.
`session-id` names the bounded run. `base` is a ref-safe single path segment
derived from the source branch; if normalization changes the branch name, append
a short digest to avoid collisions.

Only the owner of an exact tuple may force-push that ref. Legacy
`wip/local/<branch>` and `wip/<namespace>/<branch>` refs are audit targets, not
new-write targets. GC tools must classify legacy refs separately, refuse
destructive deletion when PR liveness cannot be checked, and require explicit
legacy/risk flags before deleting them.

## 5. Agent Lifecycle

1. Observe repo topology, dirty state, worktrees, stashes, remotes, PRs, and
   automation state.
2. Record a finalizer baseline before a bounded work session when finalization
   will be enforced.
3. Write checkpoints to WIP refs without advancing the user's current branch.
4. Integrate only according to repo policy and required checks.
5. Run the explicit finalizer before handoff.
6. Report remaining dirty work, unpushed commits, skipped checks, and policy
   drift.

## 6. Failure Precedence

Handle failures in this order:

1. In-progress Git operations.
2. Dirty worktree or index changes.
3. Divergence and tree-equivalence decisions.
4. Stale or conflicting WIP refs.
5. Open PR, check, review, or Actions failures.
6. Missing hosted-provider protections.
7. Non-blocking repo policy drift.

## 7. Finalizer Contract

`agent-git-guard.sh` is explicit, not ambient. It MUST fail closed when a
baseline is missing, emit NDJSON, and avoid mutation during finalize.

Exit codes:

- `0`: clean.
- `1`: newly dirty paths, changed pre-existing dirty paths, or new unpushed
  commits remain.
- `2`: missing baseline, bad invocation, or missing prerequisites.

## 8. Git Settings

Recommended machine defaults are advisory. Agents MUST NOT assume they are
installed globally. Repo behavior should be enforced with repository files and
CI where possible.

Good defaults include rebase-on-pull, autostash for rebase, `rerere`,
commit-graph/fetch pruning, `zdiff3` conflicts, histogram diff, and Git
maintenance. Line endings belong in `.gitattributes`.

## 9. GitHub Defaults

For Wranngle-managed GitHub repos, prefer protected `main`, PR required, required
checks, squash merge, branch deletion, linear history, and resolved
conversations. If the forge cannot enforce these, record an advisory finding
instead of pretending the local workflow is unsafe.

## 10. Conformance

`scripts/bin/git-conformance` is the executable smoke test for this spec. It
checks policy shape, required repo files, finalizer configuration, WIP grammar,
schema freshness, and release cleanliness. Warnings are advisory; failures block
release conformance. It is structural conformance, not proof that hosted forge
protections such as GitHub branch protection actually match the declared
policy.

## 11. Brownfield Adoption

Brownfield repos must use staged adoption:

1. `audit`: read-only inspection, repo logs outside the worktree.
2. `plan`: read-only rollout plan.
3. `apply --advisory --profile client`: minimal PR surface only.
4. `apply --managed`: full managed artifact rollout after acceptance.
5. GitHub hydration: explicit admin opt-in only.

The advisory phase writes only `.gitattributes`, `.automation/policy.json`,
`schemas/automation-policy.v1.json`, and `scripts/bin/git-conformance`.
