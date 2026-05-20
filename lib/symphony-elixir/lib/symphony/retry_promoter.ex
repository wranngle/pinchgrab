defmodule Symphony.RetryPromoter do
  @moduledoc """
  Bounded autonomous re-promotion loop for the LocalMarkdown tracker.

  After the orchestrator exhausts `tracker.failure_max_attempts`
  consecutive `:failure` retries it transitions the issue file to
  `tracker.failure_state` (typically `failed/`) and STOPS scheduling
  retries (spec § 8.4 + § 11.1). Without operator intervention the
  issue is parked forever — which violates the "agents self-correct on
  errors" property.

  This GenServer closes that loop. On a configurable cadence (default
  30 minutes, tunable via `tracker.failure_promotion_interval_ms`) it:

    1. Reads the current `Symphony.Workflow.current/0`.
    2. Locates `<issues_root>/<failure_state>/`.
    3. Parses each `*.md` file's YAML front matter for a numeric
       `auto_retry_budget` field.
    4. For files whose budget is `> 0`, decrements the budget in-place
       and moves the file back to the first entry in `active_states`
       (typically `todo/`).
    5. For files whose budget is `0` (or missing) emits
       `symphony.retry.promotion_skipped` and leaves them parked.

  No-ops (and emits no log spam) when:

    * `tracker.failure_state` is unset.
    * `tracker.active_states` is empty.
    * `<failure_state>/` does not exist or is empty.

  Side-car module — does NOT call back into the orchestrator. The
  orchestrator's normal poll picks up the freshly-promoted file on its
  next tick the same way it would for any operator-edited file.
  """

  use GenServer

  alias Symphony.{Config, Logging, Workflow, WorkflowLoader, WorkflowStore}

  require Logger

  @default_interval_ms 1_800_000

  defmodule State do
    @moduledoc false

    defstruct [
      :interval_ms,
      :timer_ref
    ]
  end

  @spec start_link(keyword()) :: GenServer.on_start()
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: Keyword.get(opts, :name, __MODULE__))
  end

  @doc """
  Force an immediate promotion sweep. Returns `{:ok, count}` where
  `count` is the number of files moved out of `failure_state/` this
  tick. Used by tests and by manual `bin/symphony` introspection
  commands.
  """
  @spec promote_now(GenServer.server()) :: {:ok, non_neg_integer()} | {:error, term()}
  def promote_now(server \\ __MODULE__) do
    GenServer.call(server, :promote_now)
  end

  @impl true
  def init(opts) do
    interval_ms = resolve_interval_ms(opts)

    state = %State{interval_ms: interval_ms, timer_ref: nil}
    {:ok, schedule_next(state)}
  end

  @impl true
  def handle_call(:promote_now, _from, state) do
    {:reply, {:ok, run_sweep()}, state}
  end

  @impl true
  def handle_info(:tick, state) do
    _ = run_sweep()
    {:noreply, schedule_next(%{state | timer_ref: nil})}
  end

  def handle_info(_msg, state), do: {:noreply, state}

  # ============== Sweep core ==============

  defp run_sweep do
    case load_config() do
      {:ok, config} ->
        sweep_with_config(config)

      :no_config ->
        0
    end
  end

  defp sweep_with_config(config) do
    failure_state = Config.tracker_failure_state(config)
    active_states = Config.tracker_active_states(config)
    promotion_target = List.first(active_states)
    issues_root = issues_root(config)

    cond do
      is_nil(failure_state) -> 0
      is_nil(promotion_target) -> 0
      is_nil(issues_root) -> 0
      true -> sweep_dir(issues_root, failure_state, promotion_target)
    end
  end

  defp sweep_dir(root, failure_state, promotion_target) do
    failed_dir = Path.join(root, failure_state)

    case File.ls(failed_dir) do
      {:ok, entries} ->
        entries
        |> Enum.filter(&String.ends_with?(&1, ".md"))
        |> Enum.reduce(0, fn name, acc ->
          source = Path.join(failed_dir, name)

          case promote_file(source, name, root, failure_state, promotion_target) do
            :promoted -> acc + 1
            :skipped -> acc
          end
        end)

      {:error, _reason} ->
        0
    end
  end

  defp promote_file(source, name, root, failure_state, promotion_target) do
    identifier = Path.basename(name, ".md")

    with {:ok, contents} <- File.read(source),
         {fm, body, fm_present?} <- split_front_matter(contents),
         budget when is_integer(budget) <- read_budget(fm) do
      cond do
        budget <= 0 ->
          Logging.emit(:info, "symphony.retry.promotion_skipped", :unknown,
            issue: identifier,
            message: "auto_retry_budget exhausted",
            fields: %{
              from_state: failure_state,
              budget: budget
            }
          )

          :skipped

        true ->
          new_budget = budget - 1
          new_contents = rewrite_budget(contents, fm, body, fm_present?, new_budget)
          target_dir = Path.join(root, promotion_target)
          target_path = Path.join(target_dir, name)

          with :ok <- File.mkdir_p(target_dir),
               :ok <- File.write(source, new_contents),
               :ok <- File.rename(source, target_path) do
            Logging.emit(:info, "symphony.retry.promoted", :success,
              issue: identifier,
              message: "promoted from failure_state",
              fields: %{
                from_state: failure_state,
                to_state: promotion_target,
                remaining_budget: new_budget
              }
            )

            :promoted
          else
            {:error, reason} ->
              Logger.warning(
                "symphony.retry.promotion_failed identifier=#{identifier} reason=#{inspect(reason)}"
              )

              :skipped
          end
      end
    else
      _ ->
        # No front matter, no budget key, or unreadable file — treat as
        # zero budget and skip. Operator-managed files without a budget
        # opt out of auto-promotion by default.
        Logging.emit(:info, "symphony.retry.promotion_skipped", :unknown,
          issue: identifier,
          message: "auto_retry_budget missing or invalid",
          fields: %{from_state: failure_state}
        )

        :skipped
    end
  rescue
    e ->
      Logger.warning(
        "symphony.retry.promotion_exception identifier=#{Path.basename(source)} reason=#{Exception.message(e)}"
      )

      :skipped
  end

  # ============== Front matter helpers ==============

  defp split_front_matter(contents) do
    lines = String.split(contents, ~r/\r?\n/, trim: false)

    case lines do
      ["---" | rest] ->
        case Enum.split_while(rest, &(&1 != "---")) do
          {fm_lines, ["---" | body_lines]} ->
            decoded = decode_front_matter(Enum.join(fm_lines, "\n"))
            {decoded, Enum.join(body_lines, "\n"), true}

          _ ->
            {%{}, contents, false}
        end

      _ ->
        {%{}, contents, false}
    end
  end

  defp decode_front_matter(""), do: %{}

  defp decode_front_matter(yaml) do
    case YamlElixir.read_from_string(yaml) do
      {:ok, value} when is_map(value) -> value
      _ -> %{}
    end
  end

  defp read_budget(fm) when is_map(fm) do
    case Map.get(fm, "auto_retry_budget") do
      v when is_integer(v) -> v
      v when is_binary(v) -> parse_int(v)
      _ -> nil
    end
  end

  defp parse_int(bin) do
    case Integer.parse(String.trim(bin)) do
      {n, ""} -> n
      _ -> nil
    end
  end

  # In-place budget rewrite. Preserves the original front matter
  # formatting (comments, indentation, key order) by only touching the
  # `auto_retry_budget` line. If the key was somehow stored without a
  # line representation (shouldn't happen given `read_budget/1` guards
  # this path) we fall through to a regenerated front matter block.
  defp rewrite_budget(contents, _fm, _body, true, new_budget) do
    {head, fm_block, tail} = extract_fm_block(contents)
    updated = update_budget_line(fm_block, new_budget)

    case updated do
      {:ok, replaced} -> head <> replaced <> tail
      :missing_line -> contents
    end
  end

  defp rewrite_budget(contents, _fm, _body, false, _new_budget), do: contents

  defp extract_fm_block(contents) do
    [head, rest] = String.split(contents, "---\n", parts: 2)

    case String.split(rest, "\n---", parts: 2) do
      [fm_block, tail] -> {head <> "---\n", fm_block, "\n---" <> tail}
      [_only] -> {head, rest, ""}
    end
  end

  defp update_budget_line(fm_block, new_budget) do
    lines = String.split(fm_block, "\n", trim: false)

    {replaced, found?} =
      Enum.map_reduce(lines, false, fn line, found? ->
        case Regex.run(~r/^(\s*auto_retry_budget\s*:\s*)(.*)$/, line) do
          [_, prefix, _value] ->
            {prefix <> Integer.to_string(new_budget), true}

          _ ->
            {line, found?}
        end
      end)

    if found? do
      {:ok, Enum.join(replaced, "\n")}
    else
      :missing_line
    end
  end

  # ============== Config plumbing ==============

  # Prefer the cached `WorkflowStore` snapshot when available — it carries
  # the `:source_path` that `Config.from_workflow/1` needs and avoids
  # re-reading the file each tick. Fall back to a direct
  # `WorkflowLoader.load/1` (which always populates `:source_path`) when
  # the store isn't running, e.g. under tests with the orchestrator gated
  # off (see `:auto_start_orchestrator?` in `config/test.exs`).
  defp load_config do
    case load_workflow() do
      {:ok, workflow} ->
        case Config.from_workflow(workflow) do
          {:ok, config} -> {:ok, config}
          _ -> :no_config
        end

      _ ->
        :no_config
    end
  end

  defp load_workflow do
    case Process.whereis(WorkflowStore) do
      pid when is_pid(pid) ->
        Workflow.current()

      _ ->
        WorkflowLoader.load(Workflow.workflow_file_path())
    end
  end

  defp issues_root(config) do
    case Config.tracker_issues_root(config) do
      v when is_binary(v) and v != "" -> v
      _ -> nil
    end
  end

  defp resolve_interval_ms(opts) do
    case Keyword.get(opts, :interval_ms) do
      v when is_integer(v) and v > 0 ->
        v

      _ ->
        case load_config() do
          {:ok, config} -> Config.tracker_failure_promotion_interval_ms(config)
          :no_config -> @default_interval_ms
        end
    end
  end

  defp schedule_next(%State{interval_ms: interval_ms} = state) do
    ref = Process.send_after(self(), :tick, interval_ms)
    %{state | timer_ref: ref}
  end
end
