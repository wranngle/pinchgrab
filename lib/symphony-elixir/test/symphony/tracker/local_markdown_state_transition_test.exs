defmodule Symphony.Tracker.LocalMarkdownStateTransitionTest do
  # async safe: each test uses a unique tmp_dir under System.tmp_dir!() and
  # never touches Application env or shared cwd.
  use ExUnit.Case, async: true

  alias Symphony.Config
  alias Symphony.Tracker.LocalMarkdown
  alias Symphony.WorkflowLoader

  setup do
    tmp =
      Path.join(
        System.tmp_dir!(),
        "symphony-lm-state-#{System.unique_integer([:positive])}-#{:erlang.unique_integer([:positive])}"
      )

    issues_root = Path.join(tmp, "issues")
    File.mkdir_p!(issues_root)

    on_exit(fn ->
      _ = File.chmod(issues_root, 0o755)
      File.rm_rf!(tmp)
    end)

    {:ok, tmp: tmp, issues_root: issues_root}
  end

  defp build_config(tmp, issues_root) do
    workflow_path = Path.join(tmp, "WORKFLOW.md")

    File.write!(workflow_path, """
    ---
    tracker:
      kind: local_markdown
      issues_root: #{issues_root}
      active_states: [todo, in_progress]
      terminal_states: [done, failed]
    agent:
      command: scripts/bin/llm.sh
    ---
    body
    """)

    {:ok, workflow} = WorkflowLoader.load(workflow_path)
    {:ok, config} = Config.from_workflow(workflow)
    config
  end

  defp seed_issue(issues_root, state, identifier, body \\ "# Hello") do
    dir = Path.join(issues_root, state)
    File.mkdir_p!(dir)
    path = Path.join(dir, "#{identifier}.md")
    File.write!(path, body)
    path
  end

  test "moves issue file from todo/ to done/ on success", %{tmp: tmp, issues_root: root} do
    seed_issue(root, "todo", "T-001", "# T-001 body")
    config = build_config(tmp, root)

    assert :ok = LocalMarkdown.update_issue_state(config, "T-001", "done")

    refute File.exists?(Path.join([root, "todo", "T-001.md"]))
    assert File.exists?(Path.join([root, "done", "T-001.md"]))
    assert File.read!(Path.join([root, "done", "T-001.md"])) == "# T-001 body"
  end

  test "is a no-op when already in target state", %{tmp: tmp, issues_root: root} do
    path = seed_issue(root, "done", "T-002", "# already done")
    config = build_config(tmp, root)

    assert :ok = LocalMarkdown.update_issue_state(config, "T-002", "done")
    assert File.exists?(path)
    assert File.read!(path) == "# already done"
  end

  test "returns {:error, :issue_not_found} for unknown identifier",
       %{tmp: tmp, issues_root: root} do
    config = build_config(tmp, root)

    assert {:error, :issue_not_found} =
             LocalMarkdown.update_issue_state(config, "NOPE-404", "done")
  end

  test "creates the target state directory if missing", %{tmp: tmp, issues_root: root} do
    seed_issue(root, "todo", "T-003")
    refute File.exists?(Path.join(root, "in_progress"))
    config = build_config(tmp, root)

    assert :ok = LocalMarkdown.update_issue_state(config, "T-003", "in_progress")

    assert File.dir?(Path.join(root, "in_progress"))
    assert File.exists?(Path.join([root, "in_progress", "T-003.md"]))
    refute File.exists?(Path.join([root, "todo", "T-003.md"]))
  end

  test "returns {:error, {:rename_failed, _}} when target path already exists as a directory",
       %{tmp: tmp, issues_root: root} do
    seed_issue(root, "todo", "T-004")
    # Pre-create a non-empty directory at the target file path so File.rename/2
    # fails with a tuple error (hits the rename-failure branch, not the rescue).
    File.mkdir_p!(Path.join([root, "done", "T-004.md", "blocker"]))

    config = build_config(tmp, root)

    assert {:error, {:rename_failed, _reason}} =
             LocalMarkdown.update_issue_state(config, "T-004", "done")
  end

  test "rescues filesystem failures into {:error, _}", %{tmp: tmp, issues_root: root} do
    seed_issue(root, "todo", "T-005")
    # Make issues_root read-only so File.mkdir_p!/1 raises when trying to
    # create a brand-new state dir under it. The rescue clause should catch
    # the exception and return an {:error, _} tuple.
    File.chmod!(root, 0o555)

    config = build_config(tmp, root)

    result = LocalMarkdown.update_issue_state(config, "T-005", "in_progress")

    # Restore perms so the on_exit cleanup can rm_rf the tmp dir.
    File.chmod!(root, 0o755)

    assert {:error, _reason} = result
  end
end
