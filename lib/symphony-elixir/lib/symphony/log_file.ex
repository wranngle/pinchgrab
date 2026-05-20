defmodule Symphony.LogFile do
  @moduledoc """
  Configures OTP's built-in rotating disk log handler so raw `Logger` output
  lands as ECS-shaped JSONL alongside `Symphony.Logging.Sink` operator events.

  Canonical runtime layout (mirrors `composio-orchestrator/src/artifactPaths.ts`
  and `scripts/bin/git-awesome`'s `artifact_path` resolver):

      <project_root>/.artifacts/symphony/events.<yyyy-mm-dd>.jsonl

  `<project_root>` walks up from `cwd` looking for the same markers
  (`.git`, `mix.exs`, `package.json`, `pyproject.toml`, `Cargo.toml`,
  `go.mod`, `WORKFLOW.md`, `.dotfiles.sh`) and falls back to `cwd` when
  no marker is found.

  Configuration is driven by application env keys under `:symphony`:

    * `:log_file` — absolute path. Defaults to the canonical artifact path above.
    * `:log_file_max_bytes` — wrap size per file. Default 10 MiB.
    * `:log_file_max_files` — number of rotated files retained. Default 5.

  Call `configure/0` once during application boot. The module is otherwise
  idempotent: re-invocation removes the prior handler and re-attaches.
  """

  require Logger

  @handler_id :symphony_disk_log
  @artifact_system "symphony"
  @default_max_bytes 10 * 1024 * 1024
  @default_max_files 5
  @project_root_markers [
    ".git",
    "mix.exs",
    "package.json",
    "pyproject.toml",
    "Cargo.toml",
    "go.mod",
    "WORKFLOW.md",
    ".dotfiles.sh"
  ]

  @spec default_log_file() :: Path.t()
  def default_log_file do
    default_log_file(File.cwd!())
  end

  @spec default_log_file(Path.t()) :: Path.t()
  def default_log_file(start_dir) when is_binary(start_dir) do
    root = resolve_project_root(start_dir)
    date = Date.utc_today() |> Date.to_iso8601()
    Path.join([root, ".artifacts", @artifact_system, "events.#{date}.jsonl"])
  end

  @spec configure() :: :ok
  def configure do
    log_file = Application.get_env(:symphony, :log_file, default_log_file())
    max_bytes = Application.get_env(:symphony, :log_file_max_bytes, @default_max_bytes)
    max_files = Application.get_env(:symphony, :log_file_max_files, @default_max_files)

    setup_disk_handler(log_file, max_bytes, max_files)
  end

  defp resolve_project_root(start_dir) do
    expanded = Path.expand(start_dir)
    walk_up(expanded, expanded)
  end

  defp walk_up(current, fallback) do
    cond do
      Enum.any?(@project_root_markers, &File.exists?(Path.join(current, &1))) ->
        current

      Path.dirname(current) == current ->
        fallback

      true ->
        walk_up(Path.dirname(current), fallback)
    end
  end

  defp setup_disk_handler(log_file, max_bytes, max_files) do
    expanded_path = Path.expand(log_file)
    :ok = File.mkdir_p(Path.dirname(expanded_path))
    :ok = remove_existing_handler()

    case :logger.add_handler(
           @handler_id,
           :logger_disk_log_h,
           disk_log_handler_config(expanded_path, max_bytes, max_files)
         ) do
      :ok ->
        :ok

      {:error, reason} ->
        Logger.warning("Failed to configure rotating log file handler: #{inspect(reason)}")
        :ok
    end
  end

  defp remove_existing_handler do
    case :logger.remove_handler(@handler_id) do
      :ok -> :ok
      {:error, {:not_found, @handler_id}} -> :ok
      {:error, _reason} -> :ok
    end
  end

  defp disk_log_handler_config(path, max_bytes, max_files) do
    %{
      level: :all,
      formatter: {Symphony.LogFile.EcsJsonFormatter, %{}},
      config: %{
        file: String.to_charlist(path),
        type: :wrap,
        max_no_bytes: max_bytes,
        max_no_files: max_files
      }
    }
  end
end

defmodule Symphony.LogFile.EcsJsonFormatter do
  @moduledoc """
  Logger formatter that emits one ECS-shaped JSON object per line. Shape
  matches `composio-orchestrator/src/jsonlAppender.ts` and the bash emitter
  in `scripts/bin/git-awesome`, so a single `jq` pipeline reads any file
  the dotfiles ecosystem writes.
  """

  @service_name "symphony"

  @spec format(:logger.log_event(), :logger.formatter_config()) :: iodata()
  def format(%{level: level, msg: msg, meta: meta}, _config) do
    timestamp =
      meta
      |> Map.get(:time, System.system_time(:microsecond))
      |> microsecond_unix_to_iso8601()

    rendered_message = render_message(msg, meta)

    action =
      meta
      |> Map.get(:event_action)
      |> coerce_action(meta)

    payload = %{
      "@timestamp" => timestamp,
      "log.level" => Atom.to_string(level),
      "event.action" => action,
      "event.outcome" => outcome_for_level(level),
      "event.id" => event_id(meta),
      "trace.id" => trace_id(meta),
      "service.name" => @service_name,
      "labels" => build_labels(meta, rendered_message)
    }

    payload =
      case level do
        l when l in [:error, :critical, :alert, :emergency] ->
          Map.put(payload, "error.message", rendered_message)

        _ ->
          payload
      end

    [Jason.encode_to_iodata!(payload), "\n"]
  end

  defp render_message({:string, chardata}, _meta), do: IO.chardata_to_string(chardata)

  defp render_message({:report, %{report: report}}, meta) do
    render_report(report, meta)
  end

  defp render_message({:report, report}, meta) when is_map(report) or is_list(report) do
    render_report(report, meta)
  end

  defp render_message({format, args}, _meta) when is_list(format) or is_binary(format) do
    :io_lib.format(format, args) |> IO.chardata_to_string()
  rescue
    _ -> inspect({format, args}, limit: :infinity)
  end

  defp render_message(other, _meta), do: inspect(other, limit: :infinity)

  defp render_report(report, _meta) when is_map(report) or is_list(report) do
    inspect(report, limit: :infinity, printable_limit: :infinity)
  end

  defp coerce_action(action, _meta) when is_binary(action), do: action
  defp coerce_action(action, _meta) when is_atom(action) and not is_nil(action), do: Atom.to_string(action)

  defp coerce_action(nil, meta) do
    case Map.get(meta, :mfa) do
      {mod, fun, arity} -> "#{inspect(mod)}.#{fun}/#{arity}"
      _ -> "logger.event"
    end
  end

  defp outcome_for_level(level) when level in [:error, :critical, :alert, :emergency], do: "failure"
  defp outcome_for_level(level) when level in [:debug, :info, :notice], do: "success"
  defp outcome_for_level(_), do: "unknown"

  defp event_id(meta) do
    base = Map.get(meta, :event_id) || Map.get(meta, :request_id) || random_token()
    to_string(base)
  end

  defp trace_id(meta) do
    case Map.get(meta, :trace_id) || Map.get(meta, :request_id) do
      nil -> random_token()
      value -> to_string(value)
    end
  end

  defp build_labels(meta, rendered_message) do
    base = %{"host" => "local", "detail" => rendered_message}

    meta
    |> Enum.reduce(base, fn
      {:pid, pid}, acc -> Map.put(acc, "pid", inspect(pid))
      {:gl, gl}, acc -> Map.put(acc, "group_leader", inspect(gl))
      {:mfa, {mod, fun, arity}}, acc -> Map.put(acc, "mfa", "#{inspect(mod)}.#{fun}/#{arity}")
      {:file, file}, acc -> Map.put(acc, "file", to_string(file))
      {:line, line}, acc when is_integer(line) -> Map.put(acc, "line", Integer.to_string(line))
      {:module, mod}, acc -> Map.put(acc, "module", inspect(mod))
      {:domain, domains}, acc when is_list(domains) ->
        Map.put(acc, "domain", Enum.map_join(domains, ",", &to_string/1))

      _, acc ->
        acc
    end)
  end

  defp microsecond_unix_to_iso8601(microseconds) when is_integer(microseconds) do
    microseconds
    |> DateTime.from_unix!(:microsecond)
    |> DateTime.to_iso8601()
  end

  defp microsecond_unix_to_iso8601(_), do: DateTime.utc_now() |> DateTime.to_iso8601()

  defp random_token do
    bytes = :crypto.strong_rand_bytes(8)
    Base.encode16(bytes, case: :lower)
  end
end
