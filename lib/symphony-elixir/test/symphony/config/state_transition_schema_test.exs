defmodule Symphony.Config.StateTransitionSchemaTest do
  use ExUnit.Case, async: true

  alias Symphony.Config
  alias Symphony.WorkflowLoader

  setup do
    tmp =
      Path.join(
        System.tmp_dir!(),
        "symphony-config-state-#{System.unique_integer([:positive])}-#{:erlang.unique_integer([:positive])}"
      )

    File.mkdir_p!(tmp)
    on_exit(fn -> File.rm_rf!(tmp) end)
    {:ok, tmp: tmp}
  end

  defp load_config(tmp, body) do
    path = Path.join(tmp, "WORKFLOW.md")
    File.write!(path, body)
    {:ok, workflow} = WorkflowLoader.load(path)
    Config.from_workflow(workflow)
  end

  test "tracker.success_state populates Config.tracker_success_state/1", %{tmp: tmp} do
    {:ok, config} =
      load_config(tmp, """
      ---
      tracker:
        kind: local_markdown
        success_state: done
      ---
      body
      """)

    assert Config.tracker_success_state(config) == "done"
  end

  test "tracker.failure_state populates Config.tracker_failure_state/1", %{tmp: tmp} do
    {:ok, config} =
      load_config(tmp, """
      ---
      tracker:
        kind: local_markdown
        failure_state: failed
      ---
      body
      """)

    assert Config.tracker_failure_state(config) == "failed"
  end

  test "tracker.failure_max_attempts: 5 populates Config.tracker_failure_max_attempts/1",
       %{tmp: tmp} do
    {:ok, config} =
      load_config(tmp, """
      ---
      tracker:
        kind: local_markdown
        failure_max_attempts: 5
      ---
      body
      """)

    assert Config.tracker_failure_max_attempts(config) == 5
  end

  test "tracker.failure_max_attempts: 0 is rejected by the schema", %{tmp: tmp} do
    assert {:error, {:invalid_workflow_config, message}} =
             load_config(tmp, """
             ---
             tracker:
               kind: local_markdown
               failure_max_attempts: 0
             ---
             body
             """)

    assert message =~ "failure_max_attempts"
  end

  test "all three fields absent yields nil/nil/3 defaults", %{tmp: tmp} do
    {:ok, config} =
      load_config(tmp, """
      ---
      tracker:
        kind: local_markdown
      ---
      body
      """)

    assert Config.tracker_success_state(config) == nil
    assert Config.tracker_failure_state(config) == nil
    assert Config.tracker_failure_max_attempts(config) == 3
  end
end
