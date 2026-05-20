defmodule Symphony.Codex.SymphonyStateDynamicToolTest do
  use ExUnit.Case, async: true

  alias Symphony.Codex.DynamicTool

  # A representative orchestrator snapshot in the shape produced by
  # `Symphony.Web.Presenter.state_payload/0`. Mixing atom and binary
  # keys mirrors the real payload (top-level atoms, nested user data
  # often binary).
  defp sample_payload do
    %{
      generated_at: "2026-05-02T10:00:00Z",
      counts: %{running: 2, retrying: 1},
      running: [
        %{
          identifier: "ENG-101",
          state: "in_progress",
          session_id: "sess_a"
        },
        %{
          identifier: "ENG-202",
          state: "in_progress",
          session_id: "sess_b"
        }
      ],
      retrying: [
        %{identifier: "ENG-303", attempt: 2, due_in_ms: 5_000}
      ],
      codex_totals: %{input_tokens: 10_000, output_tokens: 4_000},
      rate_limits: %{remaining: 50},
      polling: %{poll_interval_ms: 30_000, next_poll_in_ms: 12_000, checking?: false},
      recent_events: []
    }
  end

  describe "tool_specs/1" do
    test "advertises symphony_state for non-Linear trackers" do
      specs = DynamicTool.tool_specs(:github)
      names = Enum.map(specs, & &1["name"])

      assert "symphony_state" in names
      refute "linear_graphql" in names
    end

    test "advertises symphony_state alongside linear_graphql for Linear trackers" do
      specs = DynamicTool.tool_specs(:linear)
      names = Enum.map(specs, & &1["name"])

      assert "symphony_state" in names
      assert "linear_graphql" in names
    end

    test "advertises symphony_state when tracker kind is nil" do
      specs = DynamicTool.tool_specs(nil)
      assert Enum.any?(specs, &(&1["name"] == "symphony_state"))
    end

    test "exposes a path-only input schema" do
      [%{"inputSchema" => schema} | _] =
        Enum.filter(DynamicTool.tool_specs(:github), &(&1["name"] == "symphony_state"))

      assert schema["type"] == "object"
      assert schema["additionalProperties"] == false
      assert schema["required"] == []
      assert get_in(schema, ["properties", "path", "type"]) == "string"
    end
  end

  describe "execute/3 symphony_state full snapshot" do
    test "returns the full snapshot when path is empty string" do
      payload = sample_payload()

      response =
        DynamicTool.execute("symphony_state", %{"path" => ""}, state_fun: fn -> payload end)

      assert response["success"] == true
      decoded = Jason.decode!(response["output"])

      assert decoded["success"] == true
      assert get_in(decoded, ["value", "counts", "running"]) == 2
      assert length(decoded["value"]["running"]) == 2
    end

    test "returns the full snapshot when path argument is omitted" do
      payload = sample_payload()

      response = DynamicTool.execute("symphony_state", %{}, state_fun: fn -> payload end)

      decoded = Jason.decode!(response["output"])
      assert decoded["success"] == true
      assert decoded["value"]["polling"]["poll_interval_ms"] == 30_000
    end

    test "wraps the response in the dynamic-tool envelope (success + contentItems)" do
      payload = sample_payload()

      response = DynamicTool.execute("symphony_state", %{}, state_fun: fn -> payload end)

      assert response["success"] == true
      assert [%{"type" => "inputText", "text" => text}] = response["contentItems"]
      assert text == response["output"]
    end
  end

  describe "execute/3 symphony_state dotted-path navigation" do
    test "walks polling.poll_interval_ms" do
      payload = sample_payload()

      response =
        DynamicTool.execute(
          "symphony_state",
          %{"path" => "polling.poll_interval_ms"},
          state_fun: fn -> payload end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded == %{"success" => true, "value" => 30_000}
    end

    test "walks running.0.identifier (list index by integer string)" do
      payload = sample_payload()

      response =
        DynamicTool.execute(
          "symphony_state",
          %{"path" => "running.0.identifier"},
          state_fun: fn -> payload end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded == %{"success" => true, "value" => "ENG-101"}
    end

    test "walks counts.running for atom-keyed maps via string lookup" do
      payload = sample_payload()

      response =
        DynamicTool.execute(
          "symphony_state",
          %{"path" => "counts.running"},
          state_fun: fn -> payload end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded == %{"success" => true, "value" => 2}
    end

    test "trims surrounding whitespace and tolerates dotted strings" do
      payload = sample_payload()

      response =
        DynamicTool.execute(
          "symphony_state",
          %{"path" => "  retrying.0.attempt  "},
          state_fun: fn -> payload end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded == %{"success" => true, "value" => 2}
    end

    test "accepts a raw path string in place of an arguments map" do
      payload = sample_payload()

      response =
        DynamicTool.execute("symphony_state", "codex_totals.input_tokens",
          state_fun: fn -> payload end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded == %{"success" => true, "value" => 10_000}
    end
  end

  describe "execute/3 symphony_state path errors" do
    test "returns success: false for a missing top-level key" do
      payload = sample_payload()

      response =
        DynamicTool.execute(
          "symphony_state",
          %{"path" => "does_not_exist"},
          state_fun: fn -> payload end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded["success"] == false
      assert decoded["error"] =~ "path not found"
      assert decoded["error"] =~ "does_not_exist"
    end

    test "returns success: false for a missing nested key" do
      payload = sample_payload()

      response =
        DynamicTool.execute(
          "symphony_state",
          %{"path" => "polling.never_existed"},
          state_fun: fn -> payload end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded["success"] == false
      assert decoded["error"] =~ "path not found"
    end

    test "returns success: false for an out-of-range list index" do
      payload = sample_payload()

      response =
        DynamicTool.execute(
          "symphony_state",
          %{"path" => "running.99.identifier"},
          state_fun: fn -> payload end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded["success"] == false
      assert decoded["error"] =~ "path not found"
    end

    test "returns success: false when a non-numeric segment indexes a list" do
      payload = sample_payload()

      response =
        DynamicTool.execute(
          "symphony_state",
          %{"path" => "running.first.identifier"},
          state_fun: fn -> payload end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded["success"] == false
      assert decoded["error"] =~ "path not found"
    end

    test "returns success: false when path is a non-string argument" do
      payload = sample_payload()

      response =
        DynamicTool.execute(
          "symphony_state",
          %{"path" => 42},
          state_fun: fn -> payload end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded["success"] == false
      assert decoded["error"] =~ "must be a string"
    end
  end

  describe "execute/3 symphony_state orchestrator unavailable" do
    test "returns success: false when state_fun returns the snapshot_unavailable error envelope" do
      response =
        DynamicTool.execute(
          "symphony_state",
          %{},
          state_fun: fn ->
            %{
              generated_at: "2026-05-02T10:00:00Z",
              error: %{code: "snapshot_unavailable", message: "Snapshot unavailable"}
            }
          end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded["success"] == false
      assert decoded["error"] =~ "unavailable"
    end

    test "returns success: false when state_fun returns the snapshot_timeout error envelope" do
      response =
        DynamicTool.execute(
          "symphony_state",
          %{},
          state_fun: fn ->
            %{
              generated_at: "2026-05-02T10:00:00Z",
              error: %{code: "snapshot_timeout", message: "Snapshot timed out"}
            }
          end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded["success"] == false
      assert decoded["error"] =~ "unavailable"
    end

    test "returns success: false when state_fun raises (e.g. orchestrator not booted)" do
      response =
        DynamicTool.execute(
          "symphony_state",
          %{},
          state_fun: fn -> raise "orchestrator not running" end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded["success"] == false
      assert decoded["error"] =~ "unavailable"
    end

    test "returns success: false when state_fun exits (GenServer not alive)" do
      response =
        DynamicTool.execute(
          "symphony_state",
          %{},
          state_fun: fn -> exit(:noproc) end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded["success"] == false
      assert decoded["error"] =~ "unavailable"
    end

    test "returns success: false when state_fun returns an unexpected non-map value" do
      response =
        DynamicTool.execute(
          "symphony_state",
          %{},
          state_fun: fn -> :not_a_map end
        )

      decoded = Jason.decode!(response["output"])
      assert decoded["success"] == false
      assert decoded["error"] =~ "unavailable"
    end
  end
end
