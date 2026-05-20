defmodule Symphony.EnvLoader do
  @moduledoc """
  Loads `.env` files for spawned agent subprocesses.

  The orchestrator inherits the BEAM process env, but spawned worker
  shells (`bash -lc <agent.command>`) only see what the user's shell rc
  files happen to export. API keys live in `~/.agents/.env` (and
  optionally `<project>/.env`); without an explicit injection point a
  spawned `claude`, `gemini`, or `codex` invocation runs without the
  credentials it needs and dies silently.

  Precedence (highest wins):

    1. Already-set process env (caller's explicit override)
    2. `<project_root>/.env`
    3. `~/.agents/.env`

  This module never mutates the BEAM process env (`System.put_env`).
  Callers receive a `[{name, value}]` list suitable for `Port.open`
  `:env` option or `System.cmd` `env:` keyword.
  """

  @global_env_path "~/.agents/.env"

  @doc """
  Build the env list for a spawned agent. `project_root` is the
  directory containing the project's `WORKFLOW.md` (resolved from
  `Config.source_path`); pass `nil` to skip project-level `.env`.

  Returns `[{charlist | binary, charlist | binary}]` matching the
  `Port.open` `:env` option shape — values are converted to charlists
  by the caller.
  """
  @spec env_for_agent(binary() | nil) :: [{binary(), binary()}]
  def env_for_agent(project_root) do
    global = load_dotenv(Path.expand(@global_env_path))
    project = if project_root, do: load_dotenv(Path.join(project_root, ".env")), else: %{}
    process = System.get_env()

    merged =
      global
      |> Map.merge(project)
      |> Map.merge(process)
      |> ensure_bun_on_path()

    Enum.map(merged, fn {k, v} -> {to_string(k), to_string(v)} end)
  end

  @doc """
  Parse a `.env` file into a map. Returns an empty map if the file is
  absent or unreadable. Supports `KEY=value`, `KEY="value"`,
  `KEY='value'`; ignores blank lines and `#` comments. Does not
  expand variable references — the file is data, not shell.
  """
  @spec load_dotenv(binary()) :: %{optional(binary()) => binary()}
  def load_dotenv(path) do
    case File.read(path) do
      {:ok, body} -> parse(body)
      {:error, _} -> %{}
    end
  end

  defp parse(body) do
    body
    |> String.split(~r/\r?\n/)
    |> Enum.reduce(%{}, &reduce_line/2)
  end

  defp reduce_line(line, acc) do
    trimmed = String.trim(line)

    cond do
      trimmed == "" -> acc
      String.starts_with?(trimmed, "#") -> acc
      true -> maybe_put(acc, trimmed)
    end
  end

  defp maybe_put(acc, line) do
    line = String.replace_prefix(line, "export ", "")

    case String.split(line, "=", parts: 2) do
      [k, v] ->
        key = String.trim(k)
        value = v |> strip_inline_comment() |> unquote_value() |> String.trim()

        if valid_key?(key) do
          Map.put(acc, key, value)
        else
          acc
        end

      _ ->
        acc
    end
  end

  defp valid_key?(key), do: Regex.match?(~r/^[A-Za-z_][A-Za-z0-9_]*$/, key)

  defp unquote_value(<<?", _::binary>> = v) do
    case Regex.run(~r/^"((?:[^"\\]|\\.)*)"/, v, capture: :all_but_first) do
      [inner] -> String.replace(inner, ~S(\"), ~S("))
      _ -> v
    end
  end

  defp unquote_value(<<?', _::binary>> = v) do
    case Regex.run(~r/^'([^']*)'/, v, capture: :all_but_first) do
      [inner] -> inner
      _ -> v
    end
  end

  defp unquote_value(v), do: v

  defp strip_inline_comment(<<?", _::binary>> = v), do: v
  defp strip_inline_comment(<<?', _::binary>> = v), do: v

  defp strip_inline_comment(v) do
    case String.split(v, " #", parts: 2) do
      [head, _tail] -> head
      [head] -> head
    end
  end

  # Prepend `~/.bun/bin` to PATH so spawned workers can invoke `bun`
  # without relying on the user's interactive bashrc. Idempotent — if
  # the bun bin dir is already on PATH the existing value is preserved.
  defp ensure_bun_on_path(env) do
    bun_dir = Path.expand("~/.bun/bin")
    current = Map.get(env, "PATH", "")

    cond do
      not File.dir?(bun_dir) -> env
      current == "" -> Map.put(env, "PATH", bun_dir)
      String.contains?(current, bun_dir) -> env
      true -> Map.put(env, "PATH", bun_dir <> ":" <> current)
    end
  end
end
