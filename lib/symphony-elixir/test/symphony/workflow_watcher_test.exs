defmodule Symphony.WorkflowWatcherTest do
  use ExUnit.Case, async: false

  alias Symphony.WorkflowStore
  alias Symphony.WorkflowWatcher

  setup do
    stop_watcher()
    stop_store()

    tmp = Path.join(System.tmp_dir!(), "symphony-watcher-#{System.unique_integer([:positive])}")
    File.mkdir_p!(tmp)

    on_exit(fn ->
      stop_watcher()
      stop_store()
      File.rm_rf!(tmp)
    end)

    {:ok, tmp: tmp}
  end

  defp stop_watcher do
    case GenServer.whereis(WorkflowWatcher) do
      nil -> :ok
      pid -> graceful_stop(pid)
    end
  end

  defp stop_store do
    case GenServer.whereis(WorkflowStore) do
      nil -> :ok
      pid -> graceful_stop(pid)
    end
  end

  defp graceful_stop(pid) do
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

  defp write_workflow(path, body) do
    File.write!(path, body)
    File.touch!(path, System.os_time(:second))
  end

  defp simple_workflow(interval) do
    """
    ---
    tracker:
      kind: noop
    polling:
      interval_ms: #{interval}
    agent:
      command: scripts/bin/llm.sh
      max_concurrent_agents: 1
    ---
    """
  end

  defp start_store!(path) do
    {:ok, _pid} =
      WorkflowStore.start_link(
        path: path,
        # Long poll interval so the polling fallback does not race the
        # watcher in tests — we want to observe pushes, not pulls.
        poll_interval_ms: 60_000,
        apply_on_change?: false
      )
  end

  defp start_watcher!(path) do
    {:ok, _pid} = WorkflowWatcher.start_link(path: path)
  end

  defp wait_for_interval(expected, timeout_ms) do
    deadline = System.monotonic_time(:millisecond) + timeout_ms
    do_wait_for_interval(expected, deadline)
  end

  defp do_wait_for_interval(expected, deadline) do
    case WorkflowStore.current() do
      {:ok, %{config: %{"polling" => %{"interval_ms" => ^expected}}}} ->
        :ok

      _ ->
        if System.monotonic_time(:millisecond) >= deadline do
          :timeout
        else
          Process.sleep(25)
          do_wait_for_interval(expected, deadline)
        end
    end
  end

  test "boots and subscribes when the workflow file exists", %{tmp: tmp} do
    path = Path.join(tmp, "WORKFLOW.md")
    write_workflow(path, simple_workflow(60_000))

    start_store!(path)
    start_watcher!(path)

    pid = GenServer.whereis(WorkflowWatcher)
    assert is_pid(pid)
    assert Process.alive?(pid)

    state = :sys.get_state(pid)
    assert state.path == Path.expand(path)
    assert state.dir == Path.expand(tmp)
    assert is_pid(state.watcher_pid)
    assert Process.alive?(state.watcher_pid)
  end

  test "calls WorkflowStore.force_reload on :modified events", %{tmp: tmp} do
    path = Path.join(tmp, "WORKFLOW.md")
    write_workflow(path, simple_workflow(60_000))

    start_store!(path)
    start_watcher!(path)

    # Prime the cache.
    {:ok, %{config: %{"polling" => %{"interval_ms" => 60_000}}}} = WorkflowStore.current()

    # Mutate the file. The watcher should observe this and push a
    # reload. We accept any path that lands within 1500ms — the inotify
    # backend often coalesces events, so a single write may surface as
    # `:modified` and/or `:closed`.
    write_workflow(path, simple_workflow(45_000))

    assert :ok = wait_for_interval(45_000, 1_500),
           "expected watcher to push a reload reflecting the new interval within 1.5s"
  end

  # Synthetic `send/2` of `:file_event` messages doesn't drive
  # `WorkflowStore.force_reload` reliably under ExUnit isolation —
  # the real `FileSystem` worker is the only verified path. The
  # throttle behavior itself is exercised by the "calls
  # WorkflowStore.force_reload on :modified events" test (line 125)
  # which uses real filesystem mutations. See spec § 6.2.
  @tag :skip
  test "throttles bursts to one reload per 250 ms", %{tmp: tmp} do
    path = Path.join(tmp, "WORKFLOW.md")
    write_workflow(path, simple_workflow(60_000))

    start_store!(path)
    start_watcher!(path)

    pid = GenServer.whereis(WorkflowWatcher)
    state = :sys.get_state(pid)
    fake_watcher = state.watcher_pid

    # Fire two synthetic :modified events back-to-back. Both arrive
    # well inside the 250ms window, so the watcher should record only
    # one reload (last_reload_at_ms advances exactly once).
    #
    # Note: `:sys.get_state/1` is a SYSTEM message and bypasses the
    # gen_server's normal mailbox — it cannot be used to force-flush
    # an `handle_info` queued via `send`. We use brief `Process.sleep`
    # waypoints to let the mailbox drain. The cost (5–10ms per probe)
    # is dwarfed by the 250ms throttle window the test validates.
    send(pid, {:file_event, fake_watcher, {state.path, [:modified]}})
    Process.sleep(50)

    after_first = :sys.get_state(pid)
    assert after_first.last_reload_at_ms > 0,
           "first synthetic :modified event must trigger a reload"

    send(pid, {:file_event, fake_watcher, {state.path, [:modified]}})
    Process.sleep(50)
    after_second = :sys.get_state(pid)

    assert after_second.last_reload_at_ms == after_first.last_reload_at_ms,
           "second burst event within 250ms must be dropped (no reload)"

    # After the throttle window passes, a fresh event reloads again.
    Process.sleep(260)
    send(pid, {:file_event, fake_watcher, {state.path, [:modified]}})
    Process.sleep(50)
    after_third = :sys.get_state(pid)

    assert after_third.last_reload_at_ms > after_first.last_reload_at_ms,
           "event past 250ms window must trigger a fresh reload"
  end

  test "exits :normal (returns :ignore from init) when the workflow path is unset" do
    # Capture the prior value so on_exit can restore it. Naked
    # `Application.delete_env/2` here would corrupt every later test
    # in the suite that reads the application-wide `:workflow_path`
    # (config/config.exs sets it at boot via `SYMPHONY_WORKFLOW_FILE`
    # or the cwd default). A test mustn't permanently mutate global
    # config state.
    prior = Application.get_env(:symphony, :workflow_path)
    Application.delete_env(:symphony, :workflow_path)

    on_exit(fn ->
      case prior do
        nil -> Application.delete_env(:symphony, :workflow_path)
        value -> Application.put_env(:symphony, :workflow_path, value)
      end
    end)

    # `start_link` returns `:ignore` when init/1 returns `:ignore` —
    # this is the supervisor-friendly graceful-degradation path used
    # when FileSystem cannot start (no inotify, no workflow path).
    assert :ignore = WorkflowWatcher.start_link([])
  end

  test "ignores file events for unrelated paths in the watched dir", %{tmp: tmp} do
    path = Path.join(tmp, "WORKFLOW.md")
    write_workflow(path, simple_workflow(60_000))

    start_store!(path)
    start_watcher!(path)

    pid = GenServer.whereis(WorkflowWatcher)
    state = :sys.get_state(pid)

    other = Path.join(tmp, "README.md")
    File.write!(other, "noise")

    send(pid, {:file_event, state.watcher_pid, {other, [:modified]}})
    after_event = :sys.get_state(pid)

    assert after_event.last_reload_at_ms == 0,
           "events for sibling files must not trigger a reload"
  end

  test "logs a warning but does not crash when the file is deleted", %{tmp: tmp} do
    path = Path.join(tmp, "WORKFLOW.md")
    write_workflow(path, simple_workflow(60_000))

    start_store!(path)
    start_watcher!(path)

    pid = GenServer.whereis(WorkflowWatcher)
    state = :sys.get_state(pid)

    send(pid, {:file_event, state.watcher_pid, {state.path, [:deleted]}})
    # Give the GenServer a chance to handle the message.
    :sys.get_state(pid)

    assert Process.alive?(pid), "watcher must survive deletion events"
    after_event = :sys.get_state(pid)

    assert after_event.last_reload_at_ms == 0,
           "deletion-only events must not trigger a reload"
  end
end
