# symphony-elixir

Spec-faithful Symphony orchestrator. Long-running OTP application that polls a
configured tracker, dispatches one agent run per active issue into a per-issue
workspace, reconciles every tick, and exposes a snapshot interface.

Reference spec: <https://github.com/openai/symphony/blob/main/SPEC.md>.

## License

This subtree is a derivative work of OpenAI's Symphony Elixir orchestrator
and is governed by the Apache License, Version 2.0. See `LICENSE-APACHE-2.0`
and `NOTICE` in this directory. The repo-root MIT license does not extend
to this subtree.

## Status

Long-running OTP daemon; sole implementation. The earlier Bash one-shot
adapter (`scripts/symphony.sh`) has been retired — this impl now owns the
full lifecycle. Invoke via `scripts/bin/symphony-daemon.sh` or the
per-project `./bin/symphony` shim. Outstanding debt is tracked in
`../../docs/exec-plans/tech-debt-tracker.md` under `TD-SYM-*`.

## Run

The repo's `.mise.toml` pins Erlang 27 + Elixir 1.19.5-otp-27. If you have
[mise](https://mise.jdx.dev) installed, `cd` into the repo to auto-activate.
First time only:

```bash
curl -fsSL https://mise.run | sh
mise install                # reads .mise.toml in the repo
```

From this directory:

```bash
mix deps.get
mix compile
mix test
mix run --no-halt   # boots the supervision tree and starts polling
```

`SYMPHONY_WORKFLOW_FILE` (env) overrides the default `WORKFLOW.md` path.

## Running e2e

The unit suite (`mix test`) is hermetic — it stubs out trackers and shells out
to fake `agent.command` scripts. The `make e2e*` targets opt in to the live
integration suite tagged `:live_e2e` (excluded by default via
`ExUnit.configure(exclude: [:integration, :live_e2e])` in
`test/test_helper.exs`).

```bash
make e2e-local      # LocalMarkdown tracker (no creds, no LLM tokens)
make e2e-linear     # Linear tracker, real issue roundtrip (requires LINEAR_API_KEY)
make e2e            # both, in order
```

Both scenarios live in `test/symphony/live_e2e_test.exs` and drive the
in-process orchestrator end-to-end via `Symphony.Orchestrator.tick_now/0`
against a fixture-loaded workflow.

- **`make e2e-local`** — Boots an in-process orchestrator over a tmp tree
  with `tracker.kind: local_markdown`, drops a fixture issue file under
  `<tmp>/issues/todo/E2E-LOCAL-<n>.md`, and points `agent.command` at a
  deterministic shell sentinel that drains stdin, writes
  `LIVE_E2E_RESULT.txt` into the workspace cwd, and exits 0. The test
  asserts (a) the orchestrator transitions the issue to `done/` within 60s
  via the `tracker.success_state` hand-off, (b) the per-issue workspace
  contains `rendered-prompt.md` and at least one `agent-output-*.md`, and
  (c) the sentinel result file pins the workspace path. No LLM tokens are
  consumed; total runtime is under 1s on a warm BEAM, with a 60s deadline
  for cold/CI runs.

- **`make e2e-linear`** — Same orchestrator-driven shape against a real
  Linear workspace. Looks up a Linear team (defaults to `SYME2E`, override
  via `SYMPHONY_LIVE_LINEAR_TEAM_KEY`), creates a temporary project + issue
  over GraphQL, hands the orchestrator a `tracker.kind: linear` workflow
  pointed at the project slug, polls Linear until the orchestrator's
  `update_issue_state` hand-off lands the issue in a terminal state, then
  deletes the temporary issue and marks the project completed. Skipped
  with a clear message when `LINEAR_API_KEY` is unset.

The two upstream `:live_e2e` scenarios (`local_worker` and `ssh_worker`,
both gated by `SYMPHONY_RUN_LIVE_E2E=1`) still live in the same file and
exercise the full Codex app-server transport. Run them with:

```bash
SYMPHONY_RUN_LIVE_E2E=1 LINEAR_API_KEY=... mix test --include live_e2e
```

## Layout

```
mix.exs                          Project + deps (yaml_elixir, jason).
config/config.exs                Compile-time config defaults.
lib/symphony.ex                  Top-level public API (snapshot, reload).
lib/symphony/application.ex      OTP entry; starts the supervisor.
lib/symphony/workflow_loader.ex  Parses WORKFLOW.md (front matter + body).
lib/symphony/orchestrator.ex     GenServer owning runtime state + poll tick.
test/symphony/                   ExUnit tests per module.
```

## Spec coverage

| Section | Status |
|---|---|
| 5 Workflow file format          | ✓ loader parses front matter + body, dotted-path getters |
| 5.3 + 6 Typed config layer      | ✓ `Symphony.Config` — defaults, env `$VAR` resolution, typed getters |
| 7 Orchestration state machine   | ✓ in-memory state (`running`, `claimed`, `retry_attempts`, `codex_totals`) plus Task-supervised worker dispatch |
| 8 Polling, scheduling, reconciliation | ✓ poll tick honors `polling.interval_ms`, fetches candidates, sorts by `(priority, created_at, identifier)`, dispatches up to `agent.max_concurrent_agents`, reconciles running issues, detects stalls, and redeems retry entries |
| 8.4 Retry + backoff             | ✓ `Symphony.RetryQueue` — continuation 1s, failure exponential `min(10·2^(n-1)·1000, agent.max_retry_backoff_ms)`, active-candidate re-fetch, stale timer ignore, and retry clear on redispatch |
| 9 Workspace management + safety | ✓ `Symphony.WorkspaceManager` — sanitized keys, `<root>/<key>` layout, `created_now` gate, `assert_inside_root!` + `assert_safe_cwd!`, and lifecycle hooks (`after_create`, `before_run`, `after_run`, `before_remove`) with timeout |
| 10.7 Agent runner               | ✓ `Symphony.AgentRunner.LocalShell` plus optional `Symphony.AgentRunner.CodexAppServer` JSON-RPC adapter |
| 11 Tracker integration          | ✓ `Symphony.Tracker` + `Issue` struct + 3 adapters: `Noop`, `LocalMarkdown` (filesystem parity with `scripts/symphony.sh`), `GitHubIssues` (gh CLI) |
| 12 Prompt rendering             | ✓ `Symphony.PromptRenderer` — strict `{{ var }}` substitution with unknown-variable rejection. Full Liquid filters/loops deferred |
| 13.1–13.5 Logging, snapshot, tokens | ✓ `Symphony.Logging` (ECS-jsonl), `Symphony.Logging.Sink` (stderr / file / multi), `Symphony.snapshot/0` with timeout/unavailable errors, live `seconds_running`, delta-aware Codex token totals, and latest rate-limit payload |

## Design notes

- Default agent command is `scripts/bin/llm.sh` (codex-independent), per the
  surrounding repo's WORKFLOW.md. The Codex app-server JSON-RPC adapter is
  available when `agent.runner_kind: codex_app_server` is set or
  `codex.command` points at a non-local-shell command.
- Tracker adapters are pluggable via `tracker.kind`; first targets are
  `local_markdown` (filesystem) and `github_issues` (gh CLI), to match the
  Bash adapter at `scripts/symphony.sh`.
- YAML decoding via `yaml_elixir` (Hex). No NIF deps. Workflow front matter
  is decoded into a plain map; spec-defined keys are documented in the loader.
