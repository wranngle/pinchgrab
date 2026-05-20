# Symphony env-loop follow-ups

Tracking gaps surfaced during the 2026-05-03 env-loop verification &
repair pass. The repair landed in two commits:
`feat(symphony): inject .env chain into spawned worker ports` plus
its companion `test(symphony): ...`. The items below were observed
but left for later because they are out of scope for the env fix.

## 1. `ANTHROPIC_API_KEY` missing from `~/.agents/.env`

`grep ANTHROPIC ~/.agents/.env` returns empty. With the env loader in
place, every other key (`GEMINI_API_KEY`, `LINEAR_API_KEY`, etc.) now
reaches spawned agents — but `claude` CLI invocations in
`scripts/bin/llm.sh` will still fall through to the next provider
because the key is genuinely absent from the user's secrets file.

**Action:** operator adds the line manually. Constraint during the
repair pass forbade modifying `.env` on the user's behalf.

## 2. `bin/symphony serve --port N` flag silently ignored

`./bin/symphony serve --port 7081` always binds 4040 because
`Symphony.Web.Endpoint`'s child_spec resolves its port from
compile-time `config :symphony, Symphony.Web.Endpoint` rather than
the runtime `Application.put_env(:symphony, :dashboard_port, ...)`
written by `Symphony.CLI.dispatch(["serve" | rest], _)`.

**Action:** wire the runtime override into the endpoint child_spec
(or read `dashboard_port` inside `Symphony.HttpServer.init/1`). Add a
regression test that exercises both default and overridden ports.

## 3. `bin/symphony once --limit N` returns before workers finish

`once` calls `Symphony.Orchestrator.tick_now/0` then exits. The
escript terminates while the spawned `Port` is still running, so the
agent output never lands. Useful only for dispatch-shape probes, not
for verifying agent behaviour.

**Action:** either (a) await all workers spawned during the tick
before returning, gated behind a `--wait` flag, or (b) document that
`once` is dispatch-only and direct verification users at `serve` +
`POST /api/v1/refresh`.

## 4. `bin/symphony validate` should enumerate required env vars

`validate` confirms WORKFLOW.md parses but does not check that the
env vars the workflow's prompt template / agent command actually
needs are present. Combined with the silent-failure surface on the
spawn path (now closed by the env injection), this means a missing
secret used to fail in prod with cryptic agent output.

**Action:** add a `required_env: ["ANTHROPIC_API_KEY", ...]` block to
the WORKFLOW.md schema. `validate` reads it and reports per-key
present/missing using the same env-loading chain (`EnvLoader`
provides the merged map). Also surface in `GET /api/v1/state` so the
dashboard can flag misconfigured projects.
