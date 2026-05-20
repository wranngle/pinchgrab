defmodule Symphony.RetryPromoterTest do
  # async: false — mutates `Application.get_env(:symphony, :workflow_file_path)`
  # via `Symphony.Workflow.set_workflow_file_path/1`, which is global state.
  use ExUnit.Case, async: false

  alias Symphony.{RetryPromoter, Workflow}

  setup do
    tmp =
      Path.join(
        System.tmp_dir!(),
        "symphony-retry-promoter-#{System.unique_integer([:positive])}-#{:erlang.unique_integer([:positive])}"
      )

    issues_root = Path.join(tmp, "issues")
    File.mkdir_p!(issues_root)

    on_exit(fn ->
      Application.delete_env(:symphony, :workflow_file_path)
      File.rm_rf!(tmp)
    end)

    {:ok, tmp: tmp, issues_root: issues_root}
  end

  defp write_workflow!(tmp, issues_root, opts \\ []) do
    failure_state = Keyword.get(opts, :failure_state, "failed")
    failure_state_line = if is_nil(failure_state), do: "", else: "  failure_state: #{failure_state}"

    workflow_path = Path.join(tmp, "WORKFLOW.md")

    File.write!(workflow_path, """
    ---
    tracker:
      kind: local_markdown
      issues_root: #{issues_root}
      active_states: [todo, in_progress]
      terminal_states: [done, failed]
    #{failure_state_line}
    agent:
      command: scripts/bin/llm.sh
    ---
    body
    """)

    Workflow.set_workflow_file_path(workflow_path)
    workflow_path
  end

  defp seed_failed_issue(issues_root, identifier, body) do
    dir = Path.join(issues_root, "failed")
    File.mkdir_p!(dir)
    path = Path.join(dir, "#{identifier}.md")
    File.write!(path, body)
    path
  end

  defp start_promoter!(opts \\ []) do
    # Long interval so the scheduled tick never fires during tests; we
    # drive the sweep explicitly via `promote_now/1`.
    name =
      Keyword.get(
        opts,
        :name,
        :"retry_promoter_#{System.unique_integer([:positive])}"
      )

    interval_ms = Keyword.get(opts, :interval_ms, 60_000_000)

    {:ok, pid} = RetryPromoter.start_link(name: name, interval_ms: interval_ms)
    on_exit(fn -> if Process.alive?(pid), do: GenServer.stop(pid) end)
    {pid, name}
  end

  test "promotes failed issue with auto_retry_budget > 0 and decrements budget",
       %{tmp: tmp, issues_root: root} do
    write_workflow!(tmp, root)

    seed_failed_issue(root, "T-001", """
    ---
    auto_retry_budget: 2
    priority: 1
    ---
    # T-001
    body text
    """)

    {_pid, name} = start_promoter!()

    assert {:ok, 1} = RetryPromoter.promote_now(name)

    refute File.exists?(Path.join([root, "failed", "T-001.md"]))
    promoted_path = Path.join([root, "todo", "T-001.md"])
    assert File.exists?(promoted_path)

    contents = File.read!(promoted_path)
    assert contents =~ "auto_retry_budget: 1"
    assert contents =~ "priority: 1"
    assert contents =~ "# T-001"
    assert contents =~ "body text"
  end

  test "no-op when auto_retry_budget == 0 (file stays in failed/)",
       %{tmp: tmp, issues_root: root} do
    write_workflow!(tmp, root)

    failed_path =
      seed_failed_issue(root, "T-002", """
      ---
      auto_retry_budget: 0
      ---
      # T-002
      """)

    {_pid, name} = start_promoter!()

    assert {:ok, 0} = RetryPromoter.promote_now(name)
    assert File.exists?(failed_path)
    refute File.exists?(Path.join([root, "todo", "T-002.md"]))
  end

  test "no-op when auto_retry_budget key is missing entirely",
       %{tmp: tmp, issues_root: root} do
    write_workflow!(tmp, root)

    failed_path =
      seed_failed_issue(root, "T-003", """
      ---
      priority: 2
      ---
      # T-003
      """)

    {_pid, name} = start_promoter!()

    assert {:ok, 0} = RetryPromoter.promote_now(name)
    assert File.exists?(failed_path)
    refute File.exists?(Path.join([root, "todo", "T-003.md"]))
  end

  test "no-op when failure_state is unset in config",
       %{tmp: tmp, issues_root: root} do
    write_workflow!(tmp, root, failure_state: nil)

    # The file lives under failed/ on disk, but with no
    # tracker.failure_state configured the promoter does not know which
    # directory to scan and must leave the file alone.
    failed_path =
      seed_failed_issue(root, "T-004", """
      ---
      auto_retry_budget: 5
      ---
      # T-004
      """)

    {_pid, name} = start_promoter!()

    assert {:ok, 0} = RetryPromoter.promote_now(name)
    assert File.exists?(failed_path)
    refute File.exists?(Path.join([root, "todo", "T-004.md"]))
  end

  test "promotes multiple files independently in a single sweep",
       %{tmp: tmp, issues_root: root} do
    write_workflow!(tmp, root)

    seed_failed_issue(root, "T-A", """
    ---
    auto_retry_budget: 3
    ---
    # T-A
    """)

    seed_failed_issue(root, "T-B", """
    ---
    auto_retry_budget: 1
    ---
    # T-B
    """)

    # Mixed: this one has budget 0 and should stay parked.
    seed_failed_issue(root, "T-C", """
    ---
    auto_retry_budget: 0
    ---
    # T-C
    """)

    {_pid, name} = start_promoter!()

    assert {:ok, 2} = RetryPromoter.promote_now(name)

    assert File.exists?(Path.join([root, "todo", "T-A.md"]))
    assert File.exists?(Path.join([root, "todo", "T-B.md"]))
    refute File.exists?(Path.join([root, "todo", "T-C.md"]))

    # Budgets decremented independently.
    assert File.read!(Path.join([root, "todo", "T-A.md"])) =~ "auto_retry_budget: 2"
    assert File.read!(Path.join([root, "todo", "T-B.md"])) =~ "auto_retry_budget: 0"

    # Parked file untouched.
    assert File.exists?(Path.join([root, "failed", "T-C.md"]))
  end
end
