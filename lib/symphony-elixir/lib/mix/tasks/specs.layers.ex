defmodule Mix.Tasks.Specs.Layers do
  use Mix.Task

  @moduledoc """
  Enforces layered domain dependency directions across `lib/symphony/`.

  Symphony's spec describes a tier diagram (Types → Config → Repo → Service →
  Runtime → UI, with Providers as cross-cutting). This linter walks every
  `.ex` file under `lib/symphony/`, parses `alias`/`import`/`require` and
  full-module-name references via the AST, looks up each referenced module's
  tier in the hand-coded map below, and fails with `mix raise` if any module
  references a HIGHER tier than itself (the forward-dependency rule). Modules
  marked cross-cutting (Providers, configuration, eventing) may be referenced
  from any tier.

  `@behaviour Module` declarations are NOT counted as layer dependencies:
  they are contract obligations, not directional imports, and treating them
  as deps would force every adapter to live at the same tier as its
  behaviour-defining module.

  Usage:

      mix specs.layers

  On success the full tier→tier reference matrix is logged for human review.
  """
  @shortdoc "Fails when a Symphony module imports from a higher domain tier"

  @tier_types 0
  @tier_repo 1
  @tier_service 2
  @tier_runtime 3
  @tier_ui 4
  @tier_cross_cutting :cross_cutting

  # Hand-coded tier map. Keys are fully-qualified module names; the longest
  # matching prefix wins so e.g. `Symphony.Tracker.Linear.Memory` is resolved
  # before the shorter `Symphony.Tracker` entry. Modules that do not appear
  # here (e.g. registered process names like `Symphony.PubSub`,
  # `Symphony.Supervisor`, or `Symphony.WorkerSupervisor`) are treated as
  # external/unknown and ignored — the linter only enforces directions on
  # modules it knows about.
  @tier_map %{
    # ---- Layer 0: Types / pure helpers -----------------------------------
    "Symphony.Config.Schema" => @tier_types,
    "Symphony.Config.Settings" => @tier_types,
    "Symphony.Tracker.Issue" => @tier_types,
    "Symphony.Tracker.Linear.Issue" => @tier_types,
    "Symphony.RunAttempt" => @tier_types,
    "Symphony.LiveSession" => @tier_types,
    "Symphony.LogFile" => @tier_types,
    "Symphony.SSH" => @tier_types,
    "Symphony.RetryQueue" => @tier_types,
    "Symphony.PathSafety" => @tier_types,

    # ---- Layer 1: Repo / data-access adapters ----------------------------
    "Symphony.Tracker.LocalMarkdown" => @tier_repo,
    "Symphony.Tracker.GitHubIssues" => @tier_repo,
    "Symphony.Tracker.Linear" => @tier_repo,
    "Symphony.Tracker.Linear.Client" => @tier_repo,
    "Symphony.Tracker.Linear.Memory" => @tier_repo,
    "Symphony.Tracker.Memory" => @tier_repo,
    "Symphony.Tracker.Noop" => @tier_repo,
    "Symphony.WorkspaceManager" => @tier_repo,
    "Symphony.WorkflowLoader" => @tier_repo,

    # ---- Layer 2: Service ------------------------------------------------
    "Symphony.RetryPromoter" => @tier_service,
    "Symphony.SpecsCheck" => @tier_service,

    # ---- Layer 3: Runtime / Agent ---------------------------------------
    "Symphony.Orchestrator" => @tier_runtime,
    "Symphony.Orchestrator.State" => @tier_runtime,
    "Symphony.AgentRunner" => @tier_runtime,
    "Symphony.AgentRunner.LocalShell" => @tier_runtime,
    "Symphony.AgentRunner.CodexAppServer" => @tier_runtime,
    "Symphony.Codex.AppServer" => @tier_runtime,
    "Symphony.Codex.DynamicTool" => @tier_runtime,
    "Symphony.PromptRenderer" => @tier_runtime,

    # ---- Layer 4: UI / HTTP / top-level entry ---------------------------
    "Symphony" => @tier_ui,
    "Symphony.CLI" => @tier_ui,
    "Symphony.HttpServer" => @tier_ui,
    "Symphony.StatusDashboard" => @tier_ui,
    "Symphony.SpecCompliance" => @tier_ui,
    "Symphony.Application" => @tier_ui,
    "Symphony.Web" => @tier_ui,
    "Symphony.Web.Endpoint" => @tier_ui,
    "Symphony.Web.Router" => @tier_ui,
    "Symphony.Web.Layouts" => @tier_ui,
    "Symphony.Web.Presenter" => @tier_ui,
    "Symphony.Web.StaticAssets" => @tier_ui,
    "Symphony.Web.StaticAssetController" => @tier_ui,
    "Symphony.Web.ErrorHTML" => @tier_ui,
    "Symphony.Web.ErrorJSON" => @tier_ui,
    "Symphony.Web.Live.DashboardLive" => @tier_ui,
    "Symphony.Web.ObservabilityApiController" => @tier_ui,
    "Symphony.Web.ObservabilityPubSub" => @tier_ui,

    # ---- Cross-cutting (Providers + system-wide config/discovery) -------
    "Symphony.Logging" => @tier_cross_cutting,
    "Symphony.Logging.Sink" => @tier_cross_cutting,
    "Symphony.Tracing" => @tier_cross_cutting,
    "Symphony.Providers" => @tier_cross_cutting,
    "Symphony.Providers.Anthropic" => @tier_cross_cutting,
    "Symphony.Config" => @tier_cross_cutting,
    "Symphony.Tracker" => @tier_cross_cutting,
    "Symphony.Workflow" => @tier_cross_cutting,
    "Symphony.WorkflowStore" => @tier_cross_cutting,
    "Symphony.WorkflowWatcher" => @tier_cross_cutting
  }

  @tier_labels %{
    @tier_types => "L0 Types",
    @tier_repo => "L1 Repo",
    @tier_service => "L2 Service",
    @tier_runtime => "L3 Runtime",
    @tier_ui => "L4 UI",
    @tier_cross_cutting => "X Cross-cutting"
  }

  @switches [path: :string]

  @impl Mix.Task
  def run(args) do
    {opts, _argv, _invalid} = OptionParser.parse(args, strict: @switches)
    root = Keyword.get(opts, :path, "lib/symphony")

    files = list_ex_files(root)

    references =
      files
      |> Enum.flat_map(&extract_references/1)
      |> Enum.reject(&is_nil/1)

    violations = Enum.filter(references, &violation?/1)

    if violations == [] do
      Mix.shell().info("specs.layers: no layer violations across #{length(files)} files")
      Mix.shell().info("")
      Mix.shell().info("Tier dependency matrix:")
      print_matrix(references)
      :ok
    else
      Enum.each(violations, fn ref ->
        Mix.shell().error(
          "#{ref.file}:#{ref.line} #{ref.from_module} (#{label(ref.from_tier)}) -> " <>
            "#{ref.to_module} (#{label(ref.to_tier)})"
        )
      end)

      Mix.raise("specs.layers failed with #{length(violations)} forward-dependency violation(s)")
    end
  end

  @doc false
  @spec tier_map() :: %{optional(binary()) => integer() | atom()}
  def tier_map, do: @tier_map

  @doc false
  @spec tier_labels() :: %{optional(integer() | atom()) => binary()}
  def tier_labels, do: @tier_labels

  @doc false
  @spec list_ex_files(binary()) :: [binary()]
  def list_ex_files(root) do
    if File.dir?(root) do
      root
      |> Path.join("**/*.ex")
      |> Path.wildcard()
      |> Enum.sort()
    else
      []
    end
  end

  @doc """
  Walks the AST of `file` and returns a flat list of cross-module reference
  records. Each record is a map with keys `:file`, `:line`, `:from_module`,
  `:from_tier`, `:to_module`, `:to_tier`.

  Module references inside docstrings, regular strings, and comments are
  not surfaced because we use the AST walker rather than text search.
  `@behaviour Module` declarations are special-cased: implementing a
  contract is not a directional dependency.
  """
  @spec extract_references(binary()) :: [map()]
  def extract_references(file) do
    source = File.read!(file)

    case Code.string_to_quoted(source, columns: false) do
      {:ok, ast} ->
        {top_module, modules} = collect_modules(ast)

        Enum.flat_map(modules, fn {mod, body} ->
          mod_string = mod || top_module || "<unknown>"
          extract_module_references(file, mod_string, body)
        end)

      {:error, _} ->
        []
    end
  end

  # Returns `{top_module, [{module_name, body_ast}]}` where each entry is a
  # defmodule found anywhere in the AST. Nested defmodules are flattened so
  # references inside them are attributed to their own name.
  defp collect_modules(ast) do
    modules = Enum.reverse(do_collect_modules(ast, []))

    top =
      case modules do
        [{name, _} | _] -> name
        _ -> nil
      end

    {top, modules}
  end

  defp do_collect_modules({:defmodule, _, [{:__aliases__, _, segments}, [do: body]]}, acc) do
    name = segments_to_string(segments)
    do_collect_modules(body, [{name, body} | acc])
  end

  defp do_collect_modules({:defmodule, _, args}, acc) when is_list(args) do
    Enum.reduce(args, acc, &do_collect_modules/2)
  end

  defp do_collect_modules({_form, _meta, args}, acc) when is_list(args) do
    Enum.reduce(args, acc, &do_collect_modules/2)
  end

  defp do_collect_modules({_form, _meta, _args}, acc), do: acc

  defp do_collect_modules({left, right}, acc) do
    do_collect_modules(right, do_collect_modules(left, acc))
  end

  defp do_collect_modules(list, acc) when is_list(list) do
    Enum.reduce(list, acc, &do_collect_modules/2)
  end

  defp do_collect_modules(_other, acc), do: acc

  defp extract_module_references(file, mod_string, body) do
    from_tier = lookup_tier(mod_string)

    refs = walk_for_refs(body, [], file, mod_string, from_tier)
    Enum.uniq_by(refs, fn ref -> {ref.line, ref.to_module} end)
  end

  # Recursive walker that skips nested defmodule bodies and behaviour
  # declarations so they are not double-counted as layer dependencies.
  defp walk_for_refs({:defmodule, _, _}, acc, _file, _from_module, _from_tier) do
    # Nested defmodule: handled separately by collect_modules/1.
    acc
  end

  defp walk_for_refs(
         {:@, _, [{:behaviour, _, [_target]}]},
         acc,
         _file,
         _from_module,
         _from_tier
       ) do
    # `@behaviour Module` is a contract obligation, not a layer dependency.
    acc
  end

  defp walk_for_refs(
         {:alias, meta, [{:__aliases__, _, _} = alias_node]},
         acc,
         file,
         from_module,
         from_tier
       ) do
    accumulate_alias(acc, alias_node, meta, file, from_module, from_tier)
  end

  defp walk_for_refs(
         {:alias, meta, [{:__aliases__, _, _} = alias_node, _opts]},
         acc,
         file,
         from_module,
         from_tier
       ) do
    accumulate_alias(acc, alias_node, meta, file, from_module, from_tier)
  end

  defp walk_for_refs(
         {:alias, meta,
          [{{:., _, [{:__aliases__, _, parent_segments}, :{}]}, _, children}]},
         acc,
         file,
         from_module,
         from_tier
       ) do
    new_refs =
      children
      |> Enum.map(fn child -> expand_alias_child(parent_segments, child) end)
      |> Enum.reject(&is_nil/1)
      |> Enum.map(fn target ->
        make_ref(file, line(meta), from_module, from_tier, target)
      end)
      |> Enum.reject(&is_nil/1)

    new_refs ++ acc
  end

  defp walk_for_refs(
         {:import, meta, [{:__aliases__, _, _} = alias_node | _]},
         acc,
         file,
         from_module,
         from_tier
       ) do
    accumulate_alias(acc, alias_node, meta, file, from_module, from_tier)
  end

  defp walk_for_refs(
         {:require, meta, [{:__aliases__, _, _} = alias_node | _]},
         acc,
         file,
         from_module,
         from_tier
       ) do
    accumulate_alias(acc, alias_node, meta, file, from_module, from_tier)
  end

  defp walk_for_refs(
         {:__aliases__, meta, segments},
         acc,
         file,
         from_module,
         from_tier
       ) do
    target = segments_to_string(segments)

    case make_ref(file, line(meta), from_module, from_tier, target) do
      nil -> acc
      ref -> [ref | acc]
    end
  end

  defp walk_for_refs({_form, _meta, args}, acc, file, from_module, from_tier)
       when is_list(args) do
    Enum.reduce(args, acc, fn arg, inner ->
      walk_for_refs(arg, inner, file, from_module, from_tier)
    end)
  end

  defp walk_for_refs({left, right}, acc, file, from_module, from_tier) do
    walk_for_refs(right, walk_for_refs(left, acc, file, from_module, from_tier), file, from_module, from_tier)
  end

  defp walk_for_refs(list, acc, file, from_module, from_tier) when is_list(list) do
    Enum.reduce(list, acc, fn item, inner ->
      walk_for_refs(item, inner, file, from_module, from_tier)
    end)
  end

  defp walk_for_refs(_other, acc, _file, _from_module, _from_tier), do: acc

  defp accumulate_alias(acc, {:__aliases__, _, segments}, meta, file, mod_string, from_tier) do
    target = segments_to_string(segments)

    case make_ref(file, line(meta), mod_string, from_tier, target) do
      nil -> acc
      ref -> [ref | acc]
    end
  end

  defp expand_alias_child(parent_segments, {:__aliases__, _, child_segments}) do
    segments_to_string(parent_segments ++ child_segments)
  end

  defp expand_alias_child(_parent_segments, _other), do: nil

  defp make_ref(file, line, from_module, from_tier, to_module) do
    cond do
      not String.starts_with?(to_module, "Symphony") ->
        nil

      to_module == from_module ->
        nil

      true ->
        case lookup_tier(to_module) do
          nil ->
            nil

          to_tier ->
            %{
              file: file,
              line: line,
              from_module: from_module,
              from_tier: from_tier,
              to_module: to_module,
              to_tier: to_tier
            }
        end
    end
  end

  defp lookup_tier(nil), do: nil

  defp lookup_tier(module) when is_binary(module) do
    if Map.has_key?(@tier_map, module) do
      Map.fetch!(@tier_map, module)
    else
      prefix_lookup(module)
    end
  end

  defp prefix_lookup(module) do
    @tier_map
    |> Enum.filter(fn {key, _tier} ->
      # The bare "Symphony" key matches by exact equality only (handled by
      # the caller); otherwise it would prefix-match every Symphony.* module.
      key != "Symphony" and String.starts_with?(module, key <> ".")
    end)
    |> Enum.max_by(fn {key, _tier} -> String.length(key) end, fn -> nil end)
    |> case do
      nil -> nil
      {_key, tier} -> tier
    end
  end

  defp segments_to_string(segments) do
    Enum.map_join(segments, ".", &Atom.to_string/1)
  end

  defp line(meta) when is_list(meta), do: Keyword.get(meta, :line, 0)
  defp line(_), do: 0

  defp violation?(%{from_tier: from, to_tier: to}) do
    case {from, to} do
      {nil, _} -> false
      {_, nil} -> false
      {@tier_cross_cutting, _} -> false
      {_, @tier_cross_cutting} -> false
      {f, t} when is_integer(f) and is_integer(t) -> t > f
      _ -> false
    end
  end

  defp label(tier), do: Map.get(@tier_labels, tier, "?")

  defp print_matrix(references) do
    by_pair =
      references
      |> Enum.reject(fn r -> is_nil(r.from_tier) or is_nil(r.to_tier) end)
      |> Enum.group_by(fn r -> {r.from_tier, r.to_tier} end)

    tiers = [
      @tier_types,
      @tier_repo,
      @tier_service,
      @tier_runtime,
      @tier_ui,
      @tier_cross_cutting
    ]

    for from <- tiers, to <- tiers do
      case Map.get(by_pair, {from, to}) do
        nil ->
          :ok

        refs ->
          Mix.shell().info(
            "  #{label(from)} -> #{label(to)}: #{length(refs)} reference(s)"
          )
      end
    end

    :ok
  end
end
