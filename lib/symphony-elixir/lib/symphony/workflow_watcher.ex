defmodule Symphony.WorkflowWatcher do
  @moduledoc """
  Filesystem watcher for `WORKFLOW.md` (spec § 6.2 primary path).

  Subscribes to `FileSystem` events on the parent directory of the
  configured workflow path and pushes a reload into
  `Symphony.WorkflowStore` whenever the watched file is modified,
  created, or closed-after-write. Throttles bursts to at most one
  reload per `@throttle_ms` so editor save patterns
  (e.g. Vim's write-and-rename) do not trigger multiple reloads.

  Side-car only — does not modify `WorkflowStore` or the orchestrator.
  The opportunistic reload path in `Symphony.Workflow.current/0`
  remains as a fallback when this watcher cannot start (e.g. systems
  without inotify).
  """

  use GenServer
  require Logger

  alias Symphony.{Logging, WorkflowStore}

  @throttle_ms 250
  @reload_event_types [:modified, :created, :closed]
  @absent_event_types [:deleted, :renamed]

  defmodule State do
    @moduledoc false

    defstruct [
      :path,
      :dir,
      :watcher_pid,
      :last_reload_at_ms
    ]
  end

  @spec start_link(keyword()) :: GenServer.on_start()
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: Keyword.get(opts, :name, __MODULE__))
  end

  @impl true
  def init(opts) do
    path = Keyword.get(opts, :path) || Application.get_env(:symphony, :workflow_path)

    cond do
      is_nil(path) ->
        Logging.emit(:warning, "symphony.workflow.fs_watch", :failure,
          message: "workflow_path is not configured; fs watcher will not start",
          fields: %{reason: "missing_workflow_path"}
        )

        :ignore

      true ->
        dir = Path.dirname(Path.expand(path))

        case start_file_system(dir) do
          {:ok, pid} ->
            FileSystem.subscribe(pid)

            Logging.emit(:info, "symphony.workflow.fs_watch", :success,
              message: "watching workflow file for changes",
              fields: %{path: path, dir: dir}
            )

            {:ok,
             %State{
               path: Path.expand(path),
               dir: dir,
               watcher_pid: pid,
               last_reload_at_ms: 0
             }}

          other ->
            # Either `{:error, reason}` (e.g. inotify-tools missing on
            # Linux/WSL) or `:ignore` (FileSystem worker explicitly
            # bowed out). In both cases we degrade gracefully so the
            # daemon stays up and the defensive reload in
            # `Symphony.Workflow.current/0` remains the fallback. We
            # return `:ignore` so the supervisor does not restart-loop.
            Logging.emit(:warning, "symphony.workflow.fs_watch", :failure,
              message: "FileSystem watcher failed to start; defensive reload still active",
              fields: %{path: path, dir: dir, reason: inspect(other)}
            )

            :ignore
        end
    end
  end

  @impl true
  def handle_info({:file_event, watcher_pid, {file_path, events}}, %State{watcher_pid: watcher_pid} = state) do
    cond do
      not same_path?(file_path, state.path) ->
        {:noreply, state}

      Enum.any?(events, &(&1 in @absent_event_types)) and
          not Enum.any?(events, &(&1 in @reload_event_types)) ->
        Logging.emit(:warning, "symphony.workflow.fs_watch", :unknown,
          message: "workflow file removed or renamed; awaiting recreation",
          fields: %{path: state.path, events: Enum.map(events, &Atom.to_string/1)}
        )

        {:noreply, state}

      Enum.any?(events, &(&1 in @reload_event_types)) ->
        {:noreply, maybe_reload(state, events)}

      true ->
        {:noreply, state}
    end
  end

  def handle_info({:file_event, watcher_pid, :stop}, %State{watcher_pid: watcher_pid} = state) do
    # Surface the stop so the supervisor can restart us with a fresh
    # FileSystem worker — the parent supervisor uses :one_for_one with
    # transient restart, so a non-:normal exit triggers a relaunch.
    Logging.emit(:warning, "symphony.workflow.fs_watch", :failure,
      message: "FileSystem watcher stopped; restarting",
      fields: %{path: state.path}
    )

    {:stop, :file_system_stopped, state}
  end

  def handle_info(_msg, state), do: {:noreply, state}

  defp start_file_system(dir) do
    try do
      FileSystem.start_link(dirs: [dir])
    rescue
      e -> {:error, e}
    catch
      :exit, reason -> {:error, reason}
    end
  end

  defp same_path?(event_path, watched_path) do
    Path.expand(to_string(event_path)) == watched_path
  end

  defp maybe_reload(%State{} = state, events) do
    now = System.monotonic_time(:millisecond)

    if now - state.last_reload_at_ms < @throttle_ms do
      state
    else
      do_reload(state, events, now)
    end
  end

  defp do_reload(%State{path: path} = state, events, now) do
    case WorkflowStore.force_reload() do
      :ok ->
        Logging.emit(:info, "symphony.workflow.fs_watch", :success,
          message: "workflow reload triggered by filesystem event",
          fields: %{path: path, events: Enum.map(events, &Atom.to_string/1)}
        )

      {:error, reason} ->
        Logging.emit(:warning, "symphony.workflow.fs_watch", :failure,
          message: "workflow reload failed after filesystem event",
          fields: %{path: path, events: Enum.map(events, &Atom.to_string/1), reason: inspect(reason)}
        )
    end

    %{state | last_reload_at_ms: now}
  end
end
