defmodule Symphony.AgentRunner.LocalShellTest do
  use ExUnit.Case, async: false

  alias Symphony.{Config, Tracker, WorkflowLoader, WorkspaceManager}
  alias Symphony.AgentRunner.LocalShell

  setup do
    tmp = Path.join(System.tmp_dir!(), "symphony-runner-#{System.unique_integer([:positive])}")
    File.mkdir_p!(tmp)
    on_exit(fn -> File.rm_rf!(tmp) end)
    {:ok, tmp: tmp}
  end

  defp make_config(tmp, agent_command_script) do
    workflow_path = Path.join(tmp, "WORKFLOW.md")
    workspace_root = Path.join(tmp, "ws")

    File.write!(workflow_path, """
    ---
    workspace:
      root: #{workspace_root}
    agent:
      command: #{agent_command_script}
    ---
    Echo template: {{ issue.identifier }}.
    """)

    {:ok, workflow} = WorkflowLoader.load(workflow_path)
    {:ok, config} = Config.from_workflow(workflow)
    config
  end

  defp make_issue do
    %Tracker.Issue{
      id: "WGTE-LR-001",
      identifier: "WGTE-LR-001",
      title: "Local shell smoke",
      description: "smoke",
      state: "todo",
      priority: 1
    }
  end

  test "pipes prompt through agent.command and writes rendered + output", %{tmp: tmp} do
    # Tiny shell script that echoes its stdin back, prefixed with a marker.
    fake_agent = Path.join(tmp, "fake-agent.sh")

    File.write!(fake_agent, """
    #!/usr/bin/env bash
    echo "AGENT-OUTPUT-START"
    cat
    echo
    echo "AGENT-OUTPUT-END"
    """)

    File.chmod!(fake_agent, 0o755)

    config = make_config(tmp, fake_agent)
    issue = make_issue()
    {:ok, ws} = WorkspaceManager.ensure_exists(config, issue.identifier)

    assert {:ok, result} = LocalShell.run(config, issue, ws)
    assert result.exit_code == 0

    rendered = File.read!(result.rendered_prompt_path)
    assert rendered =~ "Echo template: WGTE-LR-001."

    output = File.read!(result.output_path)
    assert output =~ "AGENT-OUTPUT-START"
    assert output =~ "Echo template: WGTE-LR-001."
    assert output =~ "AGENT-OUTPUT-END"
  end

  test "captures non-zero exit codes from the agent", %{tmp: tmp} do
    fake_agent = Path.join(tmp, "fake-agent-fail.sh")

    File.write!(fake_agent, """
    #!/usr/bin/env bash
    cat >/dev/null
    echo "I failed on purpose"
    exit 7
    """)

    File.chmod!(fake_agent, 0o755)

    config = make_config(tmp, fake_agent)
    issue = make_issue()
    {:ok, ws} = WorkspaceManager.ensure_exists(config, issue.identifier)

    assert {:ok, result} = LocalShell.run(config, issue, ws)
    assert result.exit_code == 7
    assert File.read!(result.output_path) =~ "I failed on purpose"
  end

  test "fails the attempt when the prompt template references an unknown variable", %{tmp: tmp} do
    workflow_path = Path.join(tmp, "WORKFLOW.md")
    workspace_root = Path.join(tmp, "ws")

    File.write!(workflow_path, """
    ---
    workspace:
      root: #{workspace_root}
    agent:
      command: /bin/true
    ---
    Bad template: {{ issue.bogus }}
    """)

    {:ok, workflow} = WorkflowLoader.load(workflow_path)
    {:ok, config} = Config.from_workflow(workflow)
    {:ok, ws} = WorkspaceManager.ensure_exists(config, "WGTE-LR-002")

    issue = make_issue()
    assert {:error, {:template_render_error, _}} = LocalShell.run(config, issue, ws)
  end

  test "injects ~/.agents/.env + project .env into the spawned agent's environment", %{tmp: tmp} do
    # Stand up a project directory with a .env that the agent should see.
    project_root = Path.join(tmp, "project")
    File.mkdir_p!(project_root)
    File.write!(Path.join(project_root, ".env"), "SYMPHONY_TEST_ENV_INJECTED=yes\n")

    workflow_path = Path.join(project_root, "WORKFLOW.md")
    workspace_root = Path.join(project_root, ".symphony/workspaces")

    fake_agent = Path.join(tmp, "echo-env.sh")

    File.write!(fake_agent, """
    #!/usr/bin/env bash
    cat >/dev/null
    echo "INJECTED=${SYMPHONY_TEST_ENV_INJECTED:-MISSING}"
    """)

    File.chmod!(fake_agent, 0o755)

    File.write!(workflow_path, """
    ---
    workspace:
      root: #{workspace_root}
    agent:
      command: #{fake_agent}
    ---
    {{ issue.identifier }}
    """)

    {:ok, workflow} = WorkflowLoader.load(workflow_path)
    {:ok, config} = Config.from_workflow(workflow)
    issue = make_issue()
    {:ok, ws} = WorkspaceManager.ensure_exists(config, issue.identifier)

    assert {:ok, result} = LocalShell.run(config, issue, ws)
    assert result.exit_code == 0
    output = File.read!(result.output_path)
    assert output =~ "INJECTED=yes"
  end

  test "after_create failure aborts and removes a newly-created workspace", %{tmp: tmp} do
    workflow_path = Path.join(tmp, "WORKFLOW.md")
    workspace_root = Path.join(tmp, "ws")

    File.write!(workflow_path, """
    ---
    workspace:
      root: #{workspace_root}
    agent:
      command: /bin/true
    hooks:
      after_create: |
        exit 3
    ---
    Echo template: {{ issue.identifier }}.
    """)

    {:ok, workflow} = WorkflowLoader.load(workflow_path)
    {:ok, config} = Config.from_workflow(workflow)
    issue = make_issue()
    {:ok, ws} = WorkspaceManager.ensure_exists(config, issue.identifier)

    assert File.dir?(ws.path)
    assert {:error, {:hook_nonzero_exit, 3}} = LocalShell.run(config, issue, ws)
    refute File.exists?(ws.path)
  end
end
