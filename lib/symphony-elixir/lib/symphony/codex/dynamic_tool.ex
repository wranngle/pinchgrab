defmodule Symphony.Codex.DynamicTool do
  @moduledoc """
  Executes client-side tool calls requested by Codex app-server turns,
  per spec section 10.5.

  Two dynamic tools are advertised:

    * `linear_graphql` — forwards a raw GraphQL document plus optional
      variables to the configured Linear endpoint using the runtime's
      tracker auth. Only meaningful when `tracker.kind == :linear`; the
      orchestrator layer decides whether to advertise it (see
      `tool_specs/1`).

    * `symphony_state` — read-only inspection of the orchestrator
      snapshot exposed by `Symphony.Web.Presenter.state_payload/0`
      (running issues, retry queue, codex totals, polling cadence).
      Advertised unconditionally for any tracker because dispatched
      agents otherwise have no way to see sibling work.

  Tool result shape mirrors the Codex protocol's expected format:

      %{
        "success" => boolean(),
        "output" => binary(),               # JSON string preferred
        "contentItems" => [%{...}]          # text content for in-session inspection
      }

  This module deliberately keeps zero coupling to the AppServer module —
  it is invoked through the `tool_executor` callback so tests can inject
  alternate handlers without touching the JSON-RPC stream.
  """

  @linear_graphql_tool "linear_graphql"
  @linear_graphql_description """
  Execute a raw GraphQL query or mutation against Linear using Symphony's configured auth.
  """
  @linear_graphql_input_schema %{
    "type" => "object",
    "additionalProperties" => false,
    "required" => ["query"],
    "properties" => %{
      "query" => %{
        "type" => "string",
        "description" => "GraphQL query or mutation document to execute against Linear."
      },
      "variables" => %{
        "type" => ["object", "null"],
        "description" => "Optional GraphQL variables object.",
        "additionalProperties" => true
      }
    }
  }

  @symphony_state_tool "symphony_state"
  @symphony_state_description "Inspect Symphony orchestrator state (currently running issues, retry queue, codex_totals, polling cadence)."
  @symphony_state_input_schema %{
    "type" => "object",
    "additionalProperties" => false,
    "required" => [],
    "properties" => %{
      "path" => %{
        "type" => "string",
        "description" =>
          "Optional dotted path into the snapshot (e.g. `polling.poll_interval_ms` or `running.0.identifier`). Empty or omitted returns the full snapshot."
      }
    }
  }

  @doc """
  Execute a dynamic tool by name. Unsupported tool names return a
  failure payload that the app-server can surface to the agent without
  stalling the turn (spec § 10.5).

  Options:

    * `:linear_client` — 3-arity function `(query, variables, opts) ->
      {:ok, response} | {:error, reason}`. Defaults to a HTTP forwarder
      that pulls credentials from the active workflow config.
    * `:tracker_endpoint` — overrides the Linear GraphQL endpoint URL.
    * `:tracker_api_key` — overrides the Linear API key string.
  """
  @spec execute(String.t() | nil, term(), keyword()) :: map()
  def execute(tool, arguments, opts \\ []) do
    case tool do
      @linear_graphql_tool ->
        execute_linear_graphql(arguments, opts)

      @symphony_state_tool ->
        execute_symphony_state(arguments, opts)

      other ->
        failure_response(%{
          "error" => %{
            "message" => "Unsupported dynamic tool: #{inspect(other)}.",
            "supportedTools" => supported_tool_names()
          }
        })
    end
  end

  @doc """
  Tracker-gated list of advertised tool specifications (legacy 0-arity
  shape preserved for callers that don't yet thread tracker kind).

  Returns only `linear_graphql` since that's the historically-gated
  surface; `symphony_state` is advertised through `tool_specs/1` /
  `supported_tool_names/0` so it appears unconditionally to live
  sessions and in error payloads.
  """
  @spec tool_specs() :: [map()]
  def tool_specs do
    [linear_graphql_spec()]
  end

  @doc """
  Tracker-aware advertised tool specifications.

  `symphony_state` is always advertised because read-only orchestrator
  introspection is safe regardless of tracker. `linear_graphql` is only
  advertised when the tracker kind is `:linear`.
  """
  @spec tool_specs(atom() | nil) :: [map()]
  def tool_specs(tracker_kind) do
    case tracker_kind do
      :linear -> [linear_graphql_spec(), symphony_state_spec()]
      _ -> [symphony_state_spec()]
    end
  end

  defp linear_graphql_spec do
    %{
      "name" => @linear_graphql_tool,
      "description" => @linear_graphql_description,
      "inputSchema" => @linear_graphql_input_schema
    }
  end

  defp symphony_state_spec do
    %{
      "name" => @symphony_state_tool,
      "description" => @symphony_state_description,
      "inputSchema" => @symphony_state_input_schema
    }
  end

  defp execute_linear_graphql(arguments, opts) do
    linear_client = Keyword.get(opts, :linear_client, &default_linear_client/3)

    with {:ok, query, variables} <- normalize_linear_graphql_arguments(arguments),
         {:ok, response} <- linear_client.(query, variables, opts) do
      graphql_response(response)
    else
      {:error, reason} ->
        failure_response(tool_error_payload(reason))
    end
  end

  defp normalize_linear_graphql_arguments(arguments) when is_binary(arguments) do
    case String.trim(arguments) do
      "" -> {:error, :missing_query}
      query -> {:ok, query, %{}}
    end
  end

  defp normalize_linear_graphql_arguments(arguments) when is_map(arguments) do
    case normalize_query(arguments) do
      {:ok, query} ->
        case normalize_variables(arguments) do
          {:ok, variables} -> {:ok, query, variables}
          {:error, reason} -> {:error, reason}
        end

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp normalize_linear_graphql_arguments(_arguments), do: {:error, :invalid_arguments}

  defp normalize_query(arguments) do
    case Map.get(arguments, "query") || Map.get(arguments, :query) do
      query when is_binary(query) ->
        case String.trim(query) do
          "" -> {:error, :missing_query}
          trimmed -> {:ok, trimmed}
        end

      _ ->
        {:error, :missing_query}
    end
  end

  defp normalize_variables(arguments) do
    case Map.get(arguments, "variables") || Map.get(arguments, :variables) || %{} do
      variables when is_map(variables) -> {:ok, variables}
      _ -> {:error, :invalid_variables}
    end
  end

  defp execute_symphony_state(arguments, opts) do
    state_fun = Keyword.get(opts, :state_fun, &Symphony.Web.Presenter.state_payload/0)

    with {:ok, path} <- normalize_symphony_state_path(arguments),
         {:ok, payload} <- safe_state_call(state_fun) do
      case walk_path(payload, path) do
        {:ok, value} ->
          dynamic_tool_response(true, encode_payload(%{"success" => true, "value" => value}))

        :error ->
          dynamic_tool_response(
            true,
            encode_payload(%{
              "success" => false,
              "error" => "path not found: #{format_path(path)}"
            })
          )
      end
    else
      {:error, :invalid_path} ->
        dynamic_tool_response(
          true,
          encode_payload(%{
            "success" => false,
            "error" => "`symphony_state.path` must be a string when provided."
          })
        )

      {:error, :unavailable} ->
        dynamic_tool_response(
          true,
          encode_payload(%{
            "success" => false,
            "error" => "Symphony orchestrator is unavailable."
          })
        )
    end
  end

  defp normalize_symphony_state_path(arguments) when is_map(arguments) do
    case Map.get(arguments, "path") || Map.get(arguments, :path) do
      nil -> {:ok, []}
      "" -> {:ok, []}
      path when is_binary(path) -> {:ok, split_path(path)}
      _ -> {:error, :invalid_path}
    end
  end

  defp normalize_symphony_state_path(arguments)
       when is_nil(arguments) or arguments == "" do
    {:ok, []}
  end

  defp normalize_symphony_state_path(path) when is_binary(path) do
    case String.trim(path) do
      "" -> {:ok, []}
      trimmed -> {:ok, split_path(trimmed)}
    end
  end

  defp normalize_symphony_state_path(_), do: {:error, :invalid_path}

  defp split_path(path) do
    path
    |> String.split(".", trim: true)
    |> Enum.map(&String.trim/1)
    |> Enum.reject(&(&1 == ""))
  end

  defp safe_state_call(state_fun) do
    payload = state_fun.()

    case payload do
      %{error: %{code: code}} when code in ["snapshot_unavailable", "snapshot_timeout"] ->
        {:error, :unavailable}

      %{} ->
        {:ok, payload}

      _ ->
        {:error, :unavailable}
    end
  rescue
    _ -> {:error, :unavailable}
  catch
    :exit, _ -> {:error, :unavailable}
  end

  defp walk_path(value, []), do: {:ok, value}

  defp walk_path(value, [segment | rest]) when is_map(value) do
    cond do
      Map.has_key?(value, segment) ->
        walk_path(Map.get(value, segment), rest)

      match?({:ok, _}, atomize_lookup(value, segment)) ->
        {:ok, atom_value} = atomize_lookup(value, segment)
        walk_path(atom_value, rest)

      true ->
        :error
    end
  end

  defp walk_path(value, [segment | rest]) when is_list(value) do
    case Integer.parse(segment) do
      {idx, ""} when idx >= 0 ->
        case Enum.at(value, idx, :__symphony_state_missing__) do
          :__symphony_state_missing__ -> :error
          element -> walk_path(element, rest)
        end

      _ ->
        :error
    end
  end

  defp walk_path(_, _), do: :error

  defp atomize_lookup(map, segment) when is_map(map) and is_binary(segment) do
    atom_key = String.to_existing_atom(segment)

    if Map.has_key?(map, atom_key) do
      {:ok, Map.get(map, atom_key)}
    else
      :error
    end
  rescue
    ArgumentError -> :error
  end

  defp format_path([]), do: "<root>"
  defp format_path(segments), do: Enum.join(segments, ".")

  defp graphql_response(response) do
    success =
      case response do
        %{"errors" => errors} when is_list(errors) and errors != [] -> false
        %{errors: errors} when is_list(errors) and errors != [] -> false
        _ -> true
      end

    dynamic_tool_response(success, encode_payload(response))
  end

  defp failure_response(payload) do
    dynamic_tool_response(false, encode_payload(payload))
  end

  defp dynamic_tool_response(success, output) when is_boolean(success) and is_binary(output) do
    %{
      "success" => success,
      "output" => output,
      "contentItems" => [
        %{
          "type" => "inputText",
          "text" => output
        }
      ]
    }
  end

  defp encode_payload(payload) when is_map(payload) or is_list(payload) do
    Jason.encode!(payload, pretty: true)
  end

  defp encode_payload(payload), do: inspect(payload)

  defp tool_error_payload(:missing_query) do
    %{
      "error" => %{
        "message" => "`linear_graphql` requires a non-empty `query` string."
      }
    }
  end

  defp tool_error_payload(:invalid_arguments) do
    %{
      "error" => %{
        "message" =>
          "`linear_graphql` expects either a GraphQL query string or an object with `query` and optional `variables`."
      }
    }
  end

  defp tool_error_payload(:invalid_variables) do
    %{
      "error" => %{
        "message" => "`linear_graphql.variables` must be a JSON object when provided."
      }
    }
  end

  defp tool_error_payload(:missing_linear_api_token) do
    %{
      "error" => %{
        "message" =>
          "Symphony is missing Linear auth. Set `tracker.api_key` in `WORKFLOW.md` or export the configured `$VAR`."
      }
    }
  end

  defp tool_error_payload({:linear_api_status, status}) do
    %{
      "error" => %{
        "message" => "Linear GraphQL request failed with HTTP #{status}.",
        "status" => status
      }
    }
  end

  defp tool_error_payload({:linear_api_request, reason}) do
    %{
      "error" => %{
        "message" => "Linear GraphQL request failed before receiving a successful response.",
        "reason" => inspect(reason)
      }
    }
  end

  defp tool_error_payload(reason) do
    %{
      "error" => %{
        "message" => "Linear GraphQL tool execution failed.",
        "reason" => inspect(reason)
      }
    }
  end

  defp supported_tool_names do
    Enum.map(tool_specs(), & &1["name"])
  end

  # Default HTTP-backed Linear client. Honours the active session's
  # tracker endpoint and api_key (passed in via opts), with a fallback to
  # the LINEAR_API_KEY env var so command-line use of the tool still
  # works during development.
  defp default_linear_client(query, variables, opts) do
    endpoint =
      Keyword.get(opts, :tracker_endpoint, "https://api.linear.app/graphql")

    api_key =
      Keyword.get(opts, :tracker_api_key) ||
        System.get_env("LINEAR_API_KEY")

    cond do
      not is_binary(api_key) or api_key == "" ->
        {:error, :missing_linear_api_token}

      true ->
        body = %{"query" => query, "variables" => variables || %{}}

        request =
          Req.new(
            url: endpoint,
            headers: [
              {"authorization", "Bearer " <> api_key},
              {"content-type", "application/json"}
            ],
            json: body,
            retry: false,
            receive_timeout: 30_000
          )

        case Req.post(request) do
          {:ok, %Req.Response{status: status, body: body}}
          when status in 200..299 ->
            {:ok, body}

          {:ok, %Req.Response{status: status}} ->
            {:error, {:linear_api_status, status}}

          {:error, reason} ->
            {:error, {:linear_api_request, reason}}
        end
    end
  end
end
