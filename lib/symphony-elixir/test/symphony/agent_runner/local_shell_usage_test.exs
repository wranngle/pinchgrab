defmodule Symphony.AgentRunner.LocalShellUsageTest do
  @moduledoc """
  Spec § 13.5 LocalShell token + cost accounting.

  Verifies that a per-workspace `usage.jsonl` line written by the bash
  wrapper (`scripts/bin/symphony-agent.sh`) is folded into
  `state.codex_totals` after the worker exits :normal. The fake
  `agent.command` here stands in for the bash wrapper — it writes the
  same ECS-jsonl shape and the orchestrator should not care that it
  came from a stub vs. the real wrapper.
  """

  use ExUnit.Case, async: false

  alias Symphony.{Orchestrator, Tracker, WorkflowLoader}

  setup do
    stop_orchestrator()
    reset_stub_tracker()
    ensure_worker_supervisor()

    tmp = Path.join(System.tmp_dir!(), "symphony-usage-#{System.unique_integer([:positive])}")
    File.mkdir_p!(tmp)

    on_exit(fn ->
      stop_orchestrator()
      reset_stub_tracker()
      File.rm_rf!(tmp)
    end)

    {:ok, tmp: tmp}
  end

  test "folds workspace usage.jsonl into codex_totals on worker :normal exit", %{tmp: tmp} do
    {:ok, _stub} = Symphony.Test.StubTracker.start_link()

    issue = %Tracker.Issue{
      id: "issue-usage",
      identifier: "STUB-USAGE",
      title: "usage smoke",
      description: "smoke",
      state: "in_progress",
      priority: 1
    }

    Symphony.Test.StubTracker.set_candidates([issue])

    fake_agent = Path.join(tmp, "fake-agent-usage.sh")

    # Mirror what scripts/bin/symphony-agent.sh writes: one ECS-jsonl
    # line in usage.jsonl with input/output/cost fields. cwd is the
    # workspace dir so a relative `usage.jsonl` lands in the right
    # place. Drain stdin so the upstream pipe doesn't SIGPIPE us.
    File.write!(fake_agent, """
    #!/usr/bin/env bash
    set -uo pipefail
    cat >/dev/null
    cat > usage.jsonl <<'EOF'
    {"@timestamp":"2026-05-02T00:00:00.000Z","log.level":"info","event.action":"symphony.agent.usage","event.outcome":"success","service.name":"symphony-agent","labels":{"identifier":"STUB-USAGE","subtype":"success","input_tokens":1500,"output_tokens":750,"cache_read_input_tokens":200,"cache_creation_input_tokens":100,"cost_usd":0.5,"num_turns":3,"duration_ms":1234}}
    EOF
    exit 0
    """)

    File.chmod!(fake_agent, 0o755)

    boot_with_workflow(tmp, """
    ---
    tracker:
      kind: noop
    workspace:
      root: #{Path.join(tmp, "ws")}
    polling:
      interval_ms: 60000
    agent:
      command: #{fake_agent}
      max_concurrent_agents: 1
    codex:
      stall_timeout_ms: 0
      command: scripts/bin/llm.sh
    ---
    Echo template: {{ issue.identifier }}.
    """)

    Orchestrator.set_adapter(Symphony.Test.StubTracker)

    :ok = Orchestrator.tick_now()

    # Wait for the orchestrator's :DOWN handler to drain usage.jsonl.
    # codex_totals start at zeros; non-zero input_tokens means the
    # aggregation path ran.
    assert eventually(fn ->
             {:ok, snap} = Orchestrator.snapshot()
             snap.codex_totals.input_tokens > 0
           end)

    {:ok, snap} = Orchestrator.snapshot()
    assert snap.codex_totals.input_tokens == 1500
    assert snap.codex_totals.output_tokens == 750
    # total = input + output + cache_read + cache_creation per the
    # delta-derived sum in the orchestrator's usage_delta_from_labels.
    assert snap.codex_totals.total_tokens == 1500 + 750 + 200 + 100
    assert snap.codex_totals.cost_usd >= 0.5
  end

  test "is robust to a missing usage.jsonl (no crash, totals stay zero)", %{tmp: tmp} do
    {:ok, _stub} = Symphony.Test.StubTracker.start_link()

    issue = %Tracker.Issue{
      id: "issue-no-usage",
      identifier: "STUB-NO-USAGE",
      title: "no usage",
      description: "no usage",
      state: "in_progress",
      priority: 1
    }

    Symphony.Test.StubTracker.set_candidates([issue])

    fake_agent = Path.join(tmp, "fake-agent-bare.sh")

    File.write!(fake_agent, """
    #!/usr/bin/env bash
    cat >/dev/null
    exit 0
    """)

    File.chmod!(fake_agent, 0o755)

    boot_with_workflow(tmp, """
    ---
    tracker:
      kind: noop
    workspace:
      root: #{Path.join(tmp, "ws")}
    polling:
      interval_ms: 60000
    agent:
      command: #{fake_agent}
      max_concurrent_agents: 1
    codex:
      stall_timeout_ms: 0
      command: scripts/bin/llm.sh
    ---
    """)

    Orchestrator.set_adapter(Symphony.Test.StubTracker)

    :ok = Orchestrator.tick_now()

    # The worker still exits :normal — we must observe the
    # post-completion state without raising. continuation retry queue
    # is fine; the goal is just "no crash, totals untouched".
    assert eventually(fn ->
             {:ok, snap} = Orchestrator.snapshot()
             snap.running == [] and snap.codex_totals.input_tokens == 0
           end)
  end

  # ---- helpers ----

  defp boot_with_workflow(tmp, body) do
    path = Path.join(tmp, "WORKFLOW.md")
    File.write!(path, body)
    {:ok, workflow} = WorkflowLoader.load(path)
    {:ok, _pid} = Orchestrator.start_link([])
    :ok = Orchestrator.apply_workflow(workflow)
  end

  defp ensure_worker_supervisor do
    case Process.whereis(Symphony.WorkerSupervisor) do
      nil ->
        {:ok, _} = Task.Supervisor.start_link(name: Symphony.WorkerSupervisor)
        :ok

      pid when is_pid(pid) ->
        :ok
    end
  end

  defp stop_orchestrator do
    case GenServer.whereis(Orchestrator) do
      nil ->
        :ok

      pid ->
        ref = Process.monitor(pid)

        try do
          GenServer.stop(pid, :normal, 1_000)
        catch
          :exit, _ -> :ok
        end

        receive do
          {:DOWN, ^ref, :process, ^pid, _} -> :ok
        after
          1_000 -> :ok
        end
    end
  end

  defp reset_stub_tracker do
    case Process.whereis(Symphony.Test.StubTracker) do
      nil ->
        :ok

      pid when is_pid(pid) ->
        try do
          if Process.alive?(pid), do: Symphony.Test.StubTracker.reset()
        catch
          :exit, _ -> :ok
        end

        :ok
    end
  end

  defp eventually(fun, attempts \\ 100) do
    Enum.reduce_while(1..attempts, false, fn _i, _ ->
      if fun.() do
        {:halt, true}
      else
        Process.sleep(50)
        {:cont, false}
      end
    end)
  end
end
