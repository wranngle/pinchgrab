defmodule Symphony.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = build_children()

    opts = [strategy: :one_for_one, name: Symphony.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Supervision tree (boot order matters; spec §§ 6.2, 7, 8 wiring):
  #
  #   1. Symphony.Logging.Sink           — log sink for ECS-jsonl events
  #   2. Symphony.WorkerSupervisor       — Task.Supervisor for run-attempt workers
  #   3. Symphony.WorkflowStore          — file watcher + cached workflow
  #   4. Symphony.Orchestrator           — scheduling brain
  #   5. Phoenix.PubSub (Symphony.PubSub) — observability fan-out (gated)
  #   6. Symphony.HttpServer             — Phoenix LiveView dashboard endpoint (gated)
  #
  # `auto_start_orchestrator?` = false (test env) skips both the
  # WorkflowStore and the Orchestrator so test helpers can boot
  # them on demand with synthetic fixtures.
  #
  # `dashboard_enabled?` (default true in :dev/:prod, false in :test) gates
  # the optional spec § 13.3 / § 13.6 surface — Phoenix.PubSub +
  # Symphony.HttpServer + Symphony.Web.Endpoint. When off, the dashboard
  # never opens a port and the pubsub broadcaster no-ops gracefully.
  defp build_children do
    # The WorkerSupervisor (a `Task.Supervisor`) is always started, even
    # in test mode where the orchestrator is started on demand. Spawning
    # workers under a fixed-name supervisor decouples the orchestrator's
    # lifecycle from the worker pool: the orchestrator can be restarted
    # without orphaning live worker tasks.
    base = [
      {Symphony.Logging.Sink, [sink: default_sink()]},
      {Task.Supervisor, name: Symphony.WorkerSupervisor}
    ]

    base
    |> Kernel.++(orchestrator_children())
    |> Kernel.++(dashboard_children())
  end

  defp orchestrator_children do
    if Application.get_env(:symphony, :auto_start_orchestrator?, true) do
      workflow_store_children() ++ [{Symphony.Orchestrator, []}]
    else
      []
    end
  end

  defp workflow_store_children do
    if Application.get_env(:symphony, :workflow_store_enabled?, true) do
      [{Symphony.WorkflowStore, []}] ++ workflow_watcher_children() ++ retry_promoter_children()
    else
      []
    end
  end

  # Spec § 6.2 primary path: push-reload via filesystem events. The
  # watcher is a side-car observer that sits AFTER WorkflowStore in
  # the boot order (it depends on the store's `force_reload/0`). It is
  # restarted as `:transient` so a graceful `:ignore`/`:normal` exit
  # (e.g. inotify unavailable) does not restart-loop and leave the
  # defensive reload in `Symphony.Workflow.current/0` as the fallback.
  defp workflow_watcher_children do
    if Application.get_env(:symphony, :workflow_watcher_enabled?, true) do
      [Supervisor.child_spec({Symphony.WorkflowWatcher, []}, restart: :transient)]
    else
      []
    end
  end

  # Bounded autonomous re-promotion loop for the LocalMarkdown tracker
  # (`Symphony.RetryPromoter`). Sits alongside the workflow_watcher
  # because it is a side-car: it depends on `Symphony.Workflow.current/0`
  # being callable (via `WorkflowStore`) but never calls back into the
  # orchestrator. Restarted `:transient` so a self-imposed `:normal`
  # exit (e.g. tests stopping the worker) does not restart-loop.
  defp retry_promoter_children do
    if Application.get_env(:symphony, :retry_promoter_enabled?, true) do
      [Supervisor.child_spec({Symphony.RetryPromoter, []}, restart: :transient)]
    else
      []
    end
  end

  # Spec § 13.3 / § 13.6 dashboard supervision children. The PubSub server
  # is registered under the well-known name `Symphony.PubSub` so the
  # presenter and the LiveView can subscribe without hardcoding pid lookup.
  #
  # Gated on `:dashboard_autostart?` (NOT `:dashboard_enabled?`) so the CLI
  # can disable per-subcommand boot without rewriting operator config —
  # `bin/symphony validate|list|once` does not need port 4040 (STACK-074).
  # `:dashboard_autostart?` defaults to `:dashboard_enabled?`, so operators
  # who haven't read the new key still get the historical behavior.
  defp dashboard_children do
    if dashboard_autostart?() do
      [
        {Phoenix.PubSub, name: Symphony.PubSub},
        {Symphony.HttpServer, []}
      ]
    else
      []
    end
  end

  defp dashboard_autostart? do
    Application.get_env(:symphony, :dashboard_autostart?, dashboard_enabled?())
  end

  defp dashboard_enabled? do
    Application.get_env(:symphony, :dashboard_enabled?, false)
  end

  # The default sink is configurable per environment so callers don't have
  # to remember to invoke `Symphony.Logging.Sink.configure/1` on boot. The
  # `:prod` environment defaults to a multi sink that fans out to stderr
  # AND a JSONL file under `.symphony/logs/symphony-elixir.jsonl`, which
  # is the path the local Vector config tails. `:dev` and `:test` keep
  # the historical `:stderr`-only behavior so test capture still works.
  #
  # Override via runtime config:
  #
  #     config :symphony, :logging_sink, {:file, "/var/log/symphony.jsonl"}
  #     config :symphony, :logging_sink, :stderr
  #     config :symphony, :logging_sink, {:multi, [:stderr, {:file, "..."}]}
  #
  # Or via env var: `SYMPHONY_LOG_FILE=/abs/path` upgrades the default
  # sink to `{:multi, [:stderr, {:file, $SYMPHONY_LOG_FILE}]}` regardless
  # of the configured environment.
  defp default_sink do
    explicit = Application.get_env(:symphony, :logging_sink)
    env_file = System.get_env("SYMPHONY_LOG_FILE")

    cond do
      not is_nil(explicit) -> explicit
      is_binary(env_file) and env_file != "" -> {:multi, [:stderr, {:file, env_file}]}
      true -> :stderr
    end
  end
end
