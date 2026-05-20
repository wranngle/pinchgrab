defmodule Symphony.LiveE2ETest do
  use Symphony.TestSupport

  require Logger

  @moduletag :live_e2e
  @moduletag timeout: 300_000

  @default_team_key "SYME2E"
  @result_file "LIVE_E2E_RESULT.txt"

  # ============== `make e2e` integration scenarios ==============
  #
  # Two additional scenarios run under the same `:live_e2e` tag so the
  # whole live surface lives in one file. Each scenario has its own
  # second-level tag (`:live_e2e_local` and `:live_e2e_linear`) so the
  # Makefile targets can pick exactly one with
  # `mix test --only live_e2e_<scenario>`.
  #
  # `e2e-local` exercises the LocalMarkdown tracker end-to-end through the
  # in-process orchestrator using a deterministic shell sentinel for the
  # agent command (no LLM tokens consumed). `e2e-linear` does the same
  # against a real Linear workspace, gated on `LINEAR_API_KEY` so the
  # default `make e2e` skips it cleanly when credentials are unset.

  @e2e_local_skip_reason if(System.get_env("SYMPHONY_RUN_LIVE_E2E_LOCAL") != "1",
                           do:
                             "set SYMPHONY_RUN_LIVE_E2E_LOCAL=1 (or run `make e2e-local`) to enable the LocalMarkdown integration test"
                         )

  @e2e_linear_skip_reason (cond do
                             System.get_env("SYMPHONY_RUN_LIVE_E2E_LINEAR") != "1" ->
                               "set SYMPHONY_RUN_LIVE_E2E_LINEAR=1 (or run `make e2e-linear`) to enable the Linear integration test"

                             (System.get_env("LINEAR_API_KEY") || "") == "" ->
                               "LINEAR_API_KEY is unset; cannot exercise the Linear integration path"

                             true ->
                               false
                           end)

  # E2E budget: dispatch + sentinel write + state transition complete in
  # well under 5s on a warm BEAM. We give the orchestrator 60s to drive
  # the issue from `todo` to `done` so a cold compile / slow CI doesn't
  # flake; on the host this typically resolves in ~1-2s.
  @e2e_local_deadline_ms 60_000
  @e2e_linear_deadline_ms 90_000

  @team_query """
  query SymphonyLiveE2ETeam($key: String!) {
    teams(filter: {key: {eq: $key}}, first: 1) {
      nodes {
        id
        key
        name
        states(first: 50) {
          nodes {
            id
            name
            type
          }
        }
      }
    }
  }
  """

  @create_project_mutation """
  mutation SymphonyLiveE2ECreateProject($name: String!, $teamIds: [String!]!) {
    projectCreate(input: {name: $name, teamIds: $teamIds}) {
      success
      project {
        id
        name
        slugId
        url
      }
    }
  }
  """

  @create_issue_mutation """
  mutation SymphonyLiveE2ECreateIssue(
    $teamId: String!
    $projectId: String!
    $title: String!
    $description: String!
    $stateId: String
  ) {
    issueCreate(
      input: {
        teamId: $teamId
        projectId: $projectId
        title: $title
        description: $description
        stateId: $stateId
      }
    ) {
      success
      issue {
        id
        identifier
        title
        description
        url
        state {
          name
        }
      }
    }
  }
  """

  @project_statuses_query """
  query SymphonyLiveE2EProjectStatuses {
    projectStatuses(first: 50) {
      nodes {
        id
        name
        type
      }
    }
  }
  """

  @issue_details_query """
  query SymphonyLiveE2EIssueDetails($id: String!) {
    issue(id: $id) {
      id
      identifier
      state {
        name
        type
      }
      comments(first: 20) {
        nodes {
          body
        }
      }
    }
  }
  """

  @complete_project_mutation """
  mutation SymphonyLiveE2ECompleteProject($id: String!, $statusId: String!, $completedAt: DateTime!) {
    projectUpdate(id: $id, input: {statusId: $statusId, completedAt: $completedAt}) {
      success
    }
  }
  """

  # ============== `make e2e-local` ==============

  @tag :live_e2e_local
  @tag skip: @e2e_local_skip_reason
  test "e2e-local: LocalMarkdown tracker drives an issue from todo to done via the orchestrator" do
    run_e2e_local_issue_flow!()
  end

  # ============== `make e2e-linear` ==============

  @tag :live_e2e_linear
  @tag skip: @e2e_linear_skip_reason
  test "e2e-linear: Linear tracker drives a real issue from active to terminal via the orchestrator" do
    run_e2e_linear_issue_flow!()
  end

  # ============== e2e-local helpers ==============

  defp run_e2e_local_issue_flow! do
    # Each scenario lives in a tmp tree:
    #
    #   <test_root>/
    #     WORKFLOW.md            <- workflow we hand the orchestrator
    #     issues/
    #       todo/E2E-LOCAL-<n>.md <- fixture that the orchestrator picks up
    #       done/                  <- success_state target dir
    #     workspaces/             <- per-issue workspace root
    #     sentinel/agent.sh       <- deterministic agent.command (no LLM)
    #
    # The sentinel writes `LIVE_E2E_RESULT.txt` and exits 0 inside the
    # workspace cwd so we can assert the LocalShell adapter ran the
    # command in the right place AND that orchestrator transitioned
    # the issue file on the worker's clean exit.
    run_id = "symphony-e2e-local-#{System.unique_integer([:positive])}"
    test_root = Path.join(System.tmp_dir!(), run_id)
    workflow_file = Path.join(test_root, "WORKFLOW.md")
    issues_root = Path.join(test_root, "issues")
    todo_dir = Path.join(issues_root, "todo")
    done_dir = Path.join(issues_root, "done")
    workspaces_root = Path.join(test_root, "workspaces")
    sentinel_dir = Path.join(test_root, "sentinel")
    sentinel_path = Path.join(sentinel_dir, "agent.sh")
    identifier = "E2E-LOCAL-#{System.unique_integer([:positive])}"
    issue_file = Path.join(todo_dir, "#{identifier}.md")
    expected_done_file = Path.join(done_dir, "#{identifier}.md")
    original_workflow_path = Workflow.workflow_file_path()
    orchestrator_pid = Process.whereis(Symphony.Orchestrator)

    File.mkdir_p!(todo_dir)
    File.mkdir_p!(done_dir)
    File.mkdir_p!(workspaces_root)
    File.mkdir_p!(sentinel_dir)

    write_local_sentinel!(sentinel_path)
    write_local_issue_fixture!(issue_file, identifier)

    write_local_e2e_workflow!(workflow_file,
      issues_root: issues_root,
      workspace_root: workspaces_root,
      agent_command: sentinel_path,
      prompt: "E2E sentinel for {{ issue.identifier }}."
    )

    try do
      if is_pid(orchestrator_pid) do
        assert :ok = Supervisor.terminate_child(Symphony.Supervisor, Symphony.Orchestrator)
      end

      Workflow.set_workflow_file_path(workflow_file)
      ensure_worker_supervisor()
      stop_named_orchestrator()

      {:ok, _pid} = Symphony.Orchestrator.start_link([])
      {:ok, workflow} = Symphony.WorkflowLoader.load(workflow_file)
      :ok = Symphony.Orchestrator.apply_workflow(workflow)

      # Drive one tick synchronously so the worker spawns immediately,
      # rather than waiting for the scheduled timer.
      :ok = Symphony.Orchestrator.tick_now()

      # Wait for the orchestrator to (a) spawn the worker, (b) observe
      # its :normal exit, and (c) transition the issue file via the
      # `tracker.success_state: done` hand-off.
      assert eventually(
               fn ->
                 File.exists?(expected_done_file) and not File.exists?(issue_file)
               end,
               @e2e_local_deadline_ms
             ),
             "expected #{identifier}.md to be moved from todo/ to done/ within #{@e2e_local_deadline_ms}ms"

      # The LocalShell adapter writes one `agent-output-<utc>.md` per
      # attempt under the per-issue workspace. The workspace root layout
      # is `<workspaces_root>/<sanitized identifier>/`.
      workspace_dir = locate_workspace_dir!(workspaces_root, identifier)
      assert File.exists?(Path.join(workspace_dir, "rendered-prompt.md"))

      agent_outputs =
        workspace_dir
        |> File.ls!()
        |> Enum.filter(&String.match?(&1, ~r/^agent-output-.+\.md$/))

      assert agent_outputs != [],
             "expected at least one agent-output-*.md in #{workspace_dir}, saw: #{inspect(File.ls!(workspace_dir))}"

      # The sentinel writes a result file; verifying it confirms the
      # LocalShell adapter ran the configured `agent.command` end-to-end
      # (workspace cwd, prompt rendered, exit 0, output captured).
      assert File.read!(Path.join(workspace_dir, @result_file)) =~
               "identifier=#{identifier}"
    after
      stop_named_orchestrator()
      restart_orchestrator_if_needed()
      Workflow.set_workflow_file_path(original_workflow_path)
      File.rm_rf(test_root)
    end
  end

  defp write_local_sentinel!(path) do
    contents = """
    #!/usr/bin/env bash
    # Deterministic e2e sentinel. Drains stdin (the rendered prompt),
    # writes #{@result_file} into the workspace cwd, and exits 0. No LLM
    # tokens consumed; no network. Mirrors the contract that
    # `Symphony.AgentRunner.LocalShell` expects of `agent.command`.
    set -euo pipefail
    prompt=$(cat)
    identifier=$(printf '%s' "$prompt" | sed -n 's/.*identifier:[[:space:]]*\\([A-Za-z0-9._-][A-Za-z0-9._-]*\\).*/\\1/p' | head -n1)
    if [ -z "${identifier}" ]; then
      identifier=$(printf '%s' "$prompt" | grep -oE 'E2E-LOCAL-[0-9]+' | head -n1 || true)
    fi
    cat > #{@result_file} <<EOF
    identifier=${identifier}
    workspace=$(pwd)
    EOF
    cat #{@result_file}
    exit 0
    """

    File.write!(path, contents)
    File.chmod!(path, 0o755)
  end

  defp write_local_issue_fixture!(path, identifier) do
    File.write!(path, """
    ---
    priority: 1
    ---
    # #{identifier}: e2e sentinel issue

    identifier: #{identifier}

    Drive the orchestrator end-to-end against the LocalMarkdown tracker.
    The sentinel `agent.command` writes `#{@result_file}` and exits 0;
    the orchestrator transitions this file from todo/ to done/.
    """)
  end

  defp write_local_e2e_workflow!(path, opts) do
    issues_root = Keyword.fetch!(opts, :issues_root)
    workspace_root = Keyword.fetch!(opts, :workspace_root)
    agent_command = Keyword.fetch!(opts, :agent_command)
    prompt = Keyword.fetch!(opts, :prompt)

    File.write!(path, """
    ---
    tracker:
      kind: local_markdown
      issues_root: #{issues_root}
      active_states: [todo, in_progress]
      terminal_states: [done, cancelled]
      success_state: done
      failure_state: cancelled
      failure_max_attempts: 1
    polling:
      interval_ms: 5000
    workspace:
      root: #{workspace_root}
    agent:
      command: #{agent_command}
      max_concurrent_agents: 1
      max_turns: 1
    codex:
      command: scripts/bin/llm.sh
      stall_timeout_ms: 0
      turn_timeout_ms: 30000
      read_timeout_ms: 5000
    hooks:
      timeout_ms: 30000
    observability:
      dashboard_enabled: false
      refresh_ms: 1000
      render_interval_ms: 16
    ---
    #{prompt}
    """)
  end

  defp locate_workspace_dir!(workspaces_root, identifier) do
    # Spec § 9.5 invariant 3: workspace dirs are named after the
    # `Symphony.PathSafety.sanitize_key/1` of the issue identifier
    # (alphanumeric + `._-` preserved; everything else replaced with
    # `_`). Match against that exact name.
    expected = Symphony.PathSafety.sanitize_key(identifier)

    case File.ls(workspaces_root) do
      {:ok, entries} ->
        candidates =
          for entry <- entries,
              dir = Path.join(workspaces_root, entry),
              File.dir?(dir),
              entry == expected,
              do: dir

        case candidates do
          [single] ->
            single

          [] ->
            flunk(
              "no workspace dir under #{workspaces_root} matched #{expected}; saw: #{inspect(entries)}"
            )

          many ->
            flunk("multiple workspace dirs matched #{expected}: #{inspect(many)}")
        end

      {:error, reason} ->
        flunk("failed to list workspaces under #{workspaces_root}: #{inspect(reason)}")
    end
  end

  defp stop_named_orchestrator do
    case GenServer.whereis(Symphony.Orchestrator) do
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

  defp ensure_worker_supervisor do
    case Process.whereis(Symphony.WorkerSupervisor) do
      nil ->
        {:ok, _} = Task.Supervisor.start_link(name: Symphony.WorkerSupervisor)
        :ok

      pid when is_pid(pid) ->
        :ok
    end
  end

  defp eventually(fun, deadline_ms) when is_function(fun, 0) and is_integer(deadline_ms) do
    deadline = System.monotonic_time(:millisecond) + deadline_ms
    do_eventually(fun, deadline)
  end

  defp do_eventually(fun, deadline) do
    cond do
      fun.() ->
        true

      System.monotonic_time(:millisecond) >= deadline ->
        false

      true ->
        Process.sleep(200)
        do_eventually(fun, deadline)
    end
  end

  # ============== e2e-linear helpers ==============

  defp run_e2e_linear_issue_flow! do
    # The Linear scenario reuses the existing `live_e2e_test.exs` GraphQL
    # helpers (team lookup, project + issue creation, terminal state
    # discovery) but drives the orchestrator end-to-end via `tick_now/0`
    # against an in-process Orchestrator — same shape as e2e-local — so
    # the agent.command is still a deterministic sentinel and the test
    # never consumes LLM tokens. The orchestrator's tracker.update_issue_state
    # hand-off then closes the Linear issue, which we verify over GraphQL
    # before deleting the temp project.
    run_id = "symphony-e2e-linear-#{System.unique_integer([:positive])}"
    test_root = Path.join(System.tmp_dir!(), run_id)
    workflow_file = Path.join(test_root, "WORKFLOW.md")
    workspaces_root = Path.join(test_root, "workspaces")
    sentinel_dir = Path.join(test_root, "sentinel")
    sentinel_path = Path.join(sentinel_dir, "agent.sh")
    team_key = System.get_env("SYMPHONY_LIVE_LINEAR_TEAM_KEY") || @default_team_key
    original_workflow_path = Workflow.workflow_file_path()
    orchestrator_pid = Process.whereis(Symphony.Orchestrator)

    File.mkdir_p!(workspaces_root)
    File.mkdir_p!(sentinel_dir)
    write_local_sentinel!(sentinel_path)

    try do
      if is_pid(orchestrator_pid) do
        assert :ok = Supervisor.terminate_child(Symphony.Supervisor, Symphony.Orchestrator)
      end

      team = fetch_team!(team_key)
      active_state = active_state!(team)
      terminal_states = terminal_state_names(team)
      [terminal_state_name | _] = terminal_states
      completed_status = completed_project_status!()

      project =
        create_project!(
          team["id"],
          "Symphony e2e-linear #{System.unique_integer([:positive])}"
        )

      issue =
        create_issue!(
          team["id"],
          project["id"],
          active_state["id"],
          "Symphony e2e-linear: deterministic orchestrator roundtrip"
        )

      write_linear_e2e_workflow!(workflow_file,
        project_slug: project["slugId"],
        active_states: active_state_names(team),
        terminal_states: terminal_states,
        success_state: terminal_state_name,
        workspace_root: workspaces_root,
        agent_command: sentinel_path,
        prompt: "E2E sentinel for {{ issue.identifier }}."
      )

      Workflow.set_workflow_file_path(workflow_file)
      ensure_worker_supervisor()
      stop_named_orchestrator()

      {:ok, _pid} = Symphony.Orchestrator.start_link([])
      {:ok, workflow} = Symphony.WorkflowLoader.load(workflow_file)
      :ok = Symphony.Orchestrator.apply_workflow(workflow)
      :ok = Symphony.Orchestrator.tick_now()

      # Poll Linear until our orchestrator hand-off transitions the issue
      # into a terminal state.
      assert eventually(
               fn ->
                 issue_completed?(fetch_issue_details!(issue.id))
               end,
               @e2e_linear_deadline_ms
             ),
             "expected Linear issue #{issue.identifier} to land in a terminal state within #{@e2e_linear_deadline_ms}ms"

      # The local sentinel always writes the agent-output sidecar; assert
      # the orchestrator actually invoked the runner (rather than failing
      # tracker preflight and silently re-queueing).
      workspace_dir = locate_workspace_dir!(workspaces_root, issue.identifier)
      assert File.exists?(Path.join(workspace_dir, "rendered-prompt.md"))

      agent_outputs =
        workspace_dir
        |> File.ls!()
        |> Enum.filter(&String.match?(&1, ~r/^agent-output-.+\.md$/))

      assert agent_outputs != [],
             "expected at least one agent-output-*.md in #{workspace_dir}, saw: #{inspect(File.ls!(workspace_dir))}"

      # Cleanup: mark the temp project completed so it stays out of
      # active filters AND delete the temporary issue so repeated CI
      # runs don't pollute the workspace.
      _ = complete_project(project["id"], completed_status["id"])
      _ = delete_linear_issue(issue.id)
    after
      stop_named_orchestrator()
      restart_orchestrator_if_needed()
      Workflow.set_workflow_file_path(original_workflow_path)
      File.rm_rf(test_root)
    end
  end

  defp write_linear_e2e_workflow!(path, opts) do
    project_slug = Keyword.fetch!(opts, :project_slug)
    active_states = Keyword.fetch!(opts, :active_states)
    terminal_states = Keyword.fetch!(opts, :terminal_states)
    success_state = Keyword.fetch!(opts, :success_state)
    workspace_root = Keyword.fetch!(opts, :workspace_root)
    agent_command = Keyword.fetch!(opts, :agent_command)
    prompt = Keyword.fetch!(opts, :prompt)

    File.write!(path, """
    ---
    tracker:
      kind: linear
      endpoint: https://api.linear.app/graphql
      api_key: $LINEAR_API_KEY
      project_slug: #{project_slug}
      active_states: #{yaml_string_list(active_states)}
      terminal_states: #{yaml_string_list(terminal_states)}
      success_state: "#{success_state}"
    polling:
      interval_ms: 5000
    workspace:
      root: #{workspace_root}
    agent:
      command: #{agent_command}
      max_concurrent_agents: 1
      max_turns: 1
    codex:
      command: scripts/bin/llm.sh
      stall_timeout_ms: 0
      turn_timeout_ms: 30000
      read_timeout_ms: 5000
    hooks:
      timeout_ms: 30000
    observability:
      dashboard_enabled: false
      refresh_ms: 1000
      render_interval_ms: 16
    ---
    #{prompt}
    """)
  end

  defp yaml_string_list(values) when is_list(values) do
    "[" <>
      Enum.map_join(values, ", ", fn v ->
        "\"" <> String.replace(to_string(v), "\"", "\\\"") <> "\""
      end) <> "]"
  end

  @issue_delete_mutation """
  mutation SymphonyE2ELinearIssueDelete($id: String!) {
    issueDelete(id: $id) {
      success
    }
  }
  """

  defp delete_linear_issue(issue_id) when is_binary(issue_id) do
    update_entity(@issue_delete_mutation, %{id: issue_id}, "issueDelete", "issue")
  end

  defp fetch_team!(team_key) do
    @team_query
    |> graphql_data!(%{key: team_key})
    |> get_in(["teams", "nodes"])
    |> case do
      [team | _] ->
        team

      _ ->
        flunk("expected Linear team #{inspect(team_key)} to exist")
    end
  end

  defp active_state!(%{"states" => %{"nodes" => states}}) when is_list(states) do
    Enum.find(states, &(&1["type"] == "started")) ||
      Enum.find(states, &(&1["type"] == "unstarted")) ||
      Enum.find(states, &(&1["type"] not in ["completed", "canceled"])) ||
      flunk("expected team to expose at least one non-terminal workflow state")
  end

  defp terminal_state_names(%{"states" => %{"nodes" => states}}) when is_list(states) do
    states
    |> Enum.filter(&(&1["type"] in ["completed", "canceled"]))
    |> Enum.map(& &1["name"])
    |> case do
      [] -> ["Done", "Canceled", "Cancelled"]
      names -> names
    end
  end

  defp active_state_names(%{"states" => %{"nodes" => states}}) when is_list(states) do
    states
    |> Enum.reject(&(&1["type"] in ["completed", "canceled"]))
    |> Enum.map(& &1["name"])
    |> case do
      [] -> ["Todo", "In Progress", "In Review"]
      names -> names
    end
  end

  defp completed_project_status! do
    @project_statuses_query
    |> graphql_data!(%{})
    |> get_in(["projectStatuses", "nodes"])
    |> case do
      statuses when is_list(statuses) ->
        Enum.find(statuses, &(&1["type"] == "completed")) ||
          flunk("expected workspace to expose a completed project status")

      payload ->
        flunk("expected project statuses list, got: #{inspect(payload)}")
    end
  end

  defp create_project!(team_id, name) do
    @create_project_mutation
    |> graphql_data!(%{teamIds: [team_id], name: name})
    |> fetch_successful_entity!("projectCreate", "project")
  end

  defp create_issue!(team_id, project_id, state_id, title) do
    issue =
      @create_issue_mutation
      |> graphql_data!(%{
        teamId: team_id,
        projectId: project_id,
        title: title,
        description: title,
        stateId: state_id
      })
      |> fetch_successful_entity!("issueCreate", "issue")

    %Issue{
      id: issue["id"],
      identifier: issue["identifier"],
      title: issue["title"],
      description: issue["description"],
      state: get_in(issue, ["state", "name"]),
      url: issue["url"],
      labels: [],
      blocked_by: []
    }
  end

  defp complete_project(project_id, completed_status_id)
       when is_binary(project_id) and is_binary(completed_status_id) do
    update_entity(
      @complete_project_mutation,
      %{
        id: project_id,
        statusId: completed_status_id,
        completedAt: DateTime.utc_now() |> DateTime.truncate(:second) |> DateTime.to_iso8601()
      },
      "projectUpdate",
      "project"
    )
  end

  defp fetch_issue_details!(issue_id) when is_binary(issue_id) do
    @issue_details_query
    |> graphql_data!(%{id: issue_id})
    |> get_in(["issue"])
    |> case do
      %{} = issue -> issue
      payload -> flunk("expected issue details payload, got: #{inspect(payload)}")
    end
  end

  defp issue_completed?(%{"state" => %{"type" => type}}), do: type in ["completed", "canceled"]
  defp issue_completed?(_issue), do: false

  defp update_entity(mutation, variables, mutation_name, entity_name) do
    case Client.graphql(mutation, variables) do
      {:ok, %{"data" => %{^mutation_name => %{"success" => true}}}} ->
        :ok

      {:ok, %{"errors" => errors}} ->
        Logger.warning("Live e2e finalization failed for #{entity_name}: #{inspect(errors)}")
        :ok

      {:ok, payload} ->
        Logger.warning("Live e2e finalization failed for #{entity_name}: #{inspect(payload)}")
        :ok

      {:error, reason} ->
        Logger.warning("Live e2e finalization failed for #{entity_name}: #{inspect(reason)}")
        :ok
    end
  end

  # Minimal Symphony config for Linear GraphQL — `Client.graphql/4` requires
  # a `Config.t()` first arg, but the test only needs the env-resolved
  # `LINEAR_API_KEY` plus the default Linear endpoint for these e2e probes.
  # Built lazily so the helper is cheap when only one call needs it.
  defp linear_config!() do
    api_key =
      System.get_env("LINEAR_API_KEY") ||
        flunk("LINEAR_API_KEY must be set for the live Linear e2e flow")

    {:ok, schema} =
      Symphony.Config.Schema.parse(%{
        "tracker" => %{
          "kind" => "linear",
          "api_key" => api_key,
          "project_slug" => "symphony-live-e2e"
        }
      })

    %Symphony.Config.Settings{schema: schema, source_path: nil}
  end

  defp graphql_data!(query, variables) when is_binary(query) and is_map(variables) do
    case Client.graphql(linear_config!(), query, variables) do
      {:ok, %{"data" => data, "errors" => errors}} when is_map(data) and is_list(errors) ->
        flunk("Linear GraphQL returned partial errors: #{inspect(errors)}")

      {:ok, %{"errors" => errors}} when is_list(errors) ->
        flunk("Linear GraphQL failed: #{inspect(errors)}")

      {:ok, %{"data" => data}} when is_map(data) ->
        data

      {:ok, payload} ->
        flunk("Linear GraphQL returned unexpected payload: #{inspect(payload)}")

      {:error, reason} ->
        flunk("Linear GraphQL request failed: #{inspect(reason)}")
    end
  end

  defp fetch_successful_entity!(data, mutation_name, entity_name)
       when is_map(data) and is_binary(mutation_name) and is_binary(entity_name) do
    case data do
      %{^mutation_name => %{"success" => true, ^entity_name => %{} = entity}} ->
        entity

      _ ->
        flunk("expected successful #{mutation_name} response, got: #{inspect(data)}")
    end
  end

  defp restart_orchestrator_if_needed do
    if is_nil(Process.whereis(Symphony.Orchestrator)) do
      case Supervisor.restart_child(Symphony.Supervisor, Symphony.Orchestrator) do
        {:ok, _pid} -> :ok
        {:error, {:already_started, _pid}} -> :ok
        # In :test, `auto_start_orchestrator?` defaults to false, so the
        # orchestrator was never registered as a child of
        # `Symphony.Supervisor` to begin with. The e2e scenarios manage
        # their own ad-hoc Orchestrator via `start_link/1` +
        # `stop_named_orchestrator/0`, so a restart-by-supervisor is a
        # no-op here.
        {:error, :not_found} -> :ok
        {:error, :running} -> :ok
      end
    end
  end
end
