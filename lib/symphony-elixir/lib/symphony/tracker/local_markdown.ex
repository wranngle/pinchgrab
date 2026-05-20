defmodule Symphony.Tracker.LocalMarkdown do
  @moduledoc """
  Tracker adapter that reads Markdown task files under
  `tracker.issues_root`. Mirrors the Bash `scripts/symphony.sh`
  `local_markdown` adapter.

  Layout:

      <issues_root>/<state>/<identifier>.md

  Each issue file has YAML front matter (`priority`, `blocked_by`, plus
  any extension keys) and a Markdown body that becomes the description.
  The state is the parent directory name.

  Example:

      .symphony/issues/todo/WGTE-001.md
      .symphony/issues/in_progress/WGTE-002.md
      .symphony/issues/human_review/WGTE-003.md
  """

  @behaviour Symphony.Tracker

  alias Symphony.Config
  alias Symphony.Tracker.Issue

  require Logger

  @impl true
  def fetch_candidate_issues(config) do
    states = Config.tracker_active_states(config)
    fetch_issues_by_states(config, states)
  end

  @impl true
  def fetch_issues_by_states(config, states) do
    root = issues_root(config)

    issues =
      states
      |> Enum.flat_map(fn state ->
        list_state_files(root, state)
        |> Enum.map(&parse_issue_file(&1, state))
      end)
      |> Enum.reject(&is_nil/1)

    {:ok, issues}
  rescue
    e ->
      Logger.warning(
        "symphony.tracker.local_markdown.fetch_failed reason=#{Exception.message(e)}"
      )

      {:error, {:local_markdown_fetch, Exception.message(e)}}
  end

  @impl true
  def fetch_issue_states_by_ids(config, ids) do
    root = issues_root(config)
    all_states = Config.tracker_active_states(config) ++ Config.tracker_terminal_states(config)

    states_by_id =
      for state <- all_states,
          file <- list_state_files(root, state),
          identifier = Path.basename(file, ".md"),
          identifier in ids,
          into: %{} do
        {identifier, state}
      end

    {:ok, states_by_id}
  end

  @doc """
  Move an issue file from its current state directory to `state_name` —
  the on-disk equivalent of Linear's state-transition API. Used by the
  orchestrator to mark issues `done` / `failed` when a workflow defines
  `tracker.success_state` / `tracker.failure_state`. Without this, a
  LocalMarkdown item never leaves `active_states` and the `:continuation`
  retry loop spins forever (spec § 8.4 + § 11.1).

  Takes the typed `Config.t()` explicitly. The orchestrator already
  holds the parsed config (with `issues_root` anchored to the workflow
  file's directory per spec § 6.1), so threading it through avoids the
  default-fallback hazard in `Config.settings!()` — which can hand back
  the schema default `.symphony/issues` (relative to the BEAM cwd, NOT
  the workflow dir) when the workflow store transiently lacks a parsed
  workflow.
  """
  @spec update_issue_state(Config.t(), binary(), binary()) :: :ok | {:error, term()}
  def update_issue_state(config, identifier, state_name)
      when is_binary(identifier) and is_binary(state_name) do
    root = issues_root(config)
    target_dir = Path.join(root, state_name)

    case locate_issue_file(root, identifier) do
      {:ok, _source_path, current_state} when current_state == state_name ->
        Logger.debug(
          "symphony.tracker.local_markdown.update_state.noop identifier=#{identifier} state=#{state_name}"
        )

        :ok

      {:ok, source_path, current_state} ->
        target_path = Path.join(target_dir, "#{identifier}.md")
        File.mkdir_p!(target_dir)

        case File.rename(source_path, target_path) do
          :ok ->
            Logger.info(
              "symphony.tracker.local_markdown.update_state identifier=#{identifier} from=#{current_state} to=#{state_name}"
            )

            :ok

          {:error, reason} ->
            Logger.warning(
              "symphony.tracker.local_markdown.update_state.failed identifier=#{identifier} reason=#{inspect(reason)}"
            )

            {:error, {:rename_failed, reason}}
        end

      :not_found ->
        Logger.warning(
          "symphony.tracker.local_markdown.update_state.missing identifier=#{identifier} root=#{root}"
        )

        {:error, :issue_not_found}
    end
  rescue
    e ->
      Logger.warning(
        "symphony.tracker.local_markdown.update_state.exception identifier=#{identifier} reason=#{Exception.message(e)}"
      )

      {:error, {:exception, Exception.message(e)}}
  end

  # Walk every state directory under issues_root and return the first match.
  # Cheap on a typical repo (a few dozen files at most); avoids needing the
  # caller to know which state the issue is currently in.
  defp locate_issue_file(root, identifier) do
    target = "#{identifier}.md"

    case File.ls(root) do
      {:ok, entries} ->
        Enum.reduce_while(entries, :not_found, fn entry, _acc ->
          dir = Path.join(root, entry)
          file = Path.join(dir, target)

          if File.dir?(dir) and File.exists?(file) do
            {:halt, {:ok, file, entry}}
          else
            {:cont, :not_found}
          end
        end)

      {:error, _reason} ->
        :not_found
    end
  end

  # ============== Helpers ==============

  defp issues_root(config) do
    case Config.tracker_issues_root(config) do
      nil -> ".symphony/issues"
      "" -> ".symphony/issues"
      value -> value
    end
  end

  defp list_state_files(root, state) do
    dir = Path.join(root, state)

    case File.ls(dir) do
      {:ok, entries} ->
        for name <- entries, String.ends_with?(name, ".md"), name != ".gitkeep" do
          Path.join(dir, name)
        end

      {:error, :enoent} ->
        []

      {:error, _} ->
        []
    end
  end

  defp parse_issue_file(path, state) do
    identifier = Path.basename(path, ".md")
    contents = File.read!(path)
    {front_matter, body} = split_front_matter(contents)
    title = first_h1(body)

    %Issue{
      id: identifier,
      identifier: identifier,
      title: title || identifier,
      description: trim_body_after_h1(body),
      priority: parse_priority(front_matter["priority"]),
      state: state,
      branch_name: front_matter["branch_name"],
      url: nil,
      labels: parse_labels(front_matter["labels"]),
      blocked_by: parse_blocked_by(front_matter["blocked_by"])
    }
  rescue
    e ->
      Logger.warning(
        "symphony.tracker.local_markdown.parse_failed file=#{path} reason=#{Exception.message(e)}"
      )

      nil
  end

  defp split_front_matter(contents) do
    lines = String.split(contents, ~r/\r?\n/, trim: false)

    case lines do
      ["---" | rest] ->
        case Enum.split_while(rest, &(&1 != "---")) do
          {fm, ["---" | body]} ->
            front = decode_front_matter(Enum.join(fm, "\n"))
            {front, Enum.join(body, "\n")}

          _ ->
            {%{}, contents}
        end

      _ ->
        {%{}, contents}
    end
  end

  defp decode_front_matter(""), do: %{}

  defp decode_front_matter(yaml) do
    case YamlElixir.read_from_string(yaml) do
      {:ok, value} when is_map(value) -> value
      _ -> %{}
    end
  end

  defp first_h1(body) do
    body
    |> String.split(~r/\r?\n/)
    |> Enum.find_value(fn line ->
      case Regex.run(~r/^#\s+(.+)$/, line) do
        [_, title] -> String.trim(title)
        _ -> nil
      end
    end)
  end

  defp trim_body_after_h1(body) do
    case Regex.split(~r/^#\s+.+$/m, body, parts: 2) do
      [_, after_h1] -> String.trim(after_h1)
      _ -> String.trim(body)
    end
  end

  defp parse_priority(nil), do: nil
  defp parse_priority(n) when is_integer(n), do: n

  defp parse_priority(s) when is_binary(s) do
    case Integer.parse(s) do
      {n, _} -> n
      :error -> nil
    end
  end

  defp parse_priority(_), do: nil

  defp parse_labels(nil), do: []
  defp parse_labels(list) when is_list(list), do: Enum.map(list, &to_string/1)

  defp parse_labels(s) when is_binary(s) do
    s
    |> String.split(",")
    |> Enum.map(&String.trim/1)
    |> Enum.reject(&(&1 == ""))
  end

  defp parse_labels(_), do: []

  defp parse_blocked_by(nil), do: []
  defp parse_blocked_by(""), do: []

  defp parse_blocked_by(list) when is_list(list) do
    for v <- list, do: %{id: to_string(v), identifier: to_string(v), state: nil}
  end

  defp parse_blocked_by(s) when is_binary(s) do
    s
    |> String.split(",")
    |> Enum.map(&String.trim/1)
    |> Enum.reject(&(&1 == ""))
    |> Enum.map(fn id -> %{id: id, identifier: id, state: nil} end)
  end

  defp parse_blocked_by(_), do: []
end
