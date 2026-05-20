defmodule Symphony.Web.Live.DashboardLiveTest do
  @moduledoc """
  Spec § 13.3 dashboard smoke: mount, render, assert running/retrying/
  codex_totals fields appear in the rendered HTML.
  """

  use Symphony.WebCase, async: false

  setup do
    on_exit(fn ->
      Symphony.WebCase.terminate_existing_orchestrator!()
    end)

    :ok
  end

  test "mounts and renders the dashboard with snapshot fields" do
    Symphony.WebCase.start_stub_snapshot!(%{
      running: [
        %{
          issue_id: "x",
          identifier: "WGTE-001",
          state: "in_progress",
          phase: :running,
          status: :running,
          workspace_path: "/tmp/x",
          session_id: "thread-1-turn-2",
          thread_id: "thread-1",
          turn_id: "turn-2",
          codex_app_server_pid: nil,
          last_codex_event: :turn_started,
          last_codex_timestamp: DateTime.utc_now(),
          last_codex_message: %{
            "method" => "turn/started",
            "params" => %{"turn" => %{"id" => "turn-2"}}
          },
          codex_input_tokens: 1_234,
          codex_output_tokens: 5_678,
          codex_total_tokens: 6_912,
          last_reported_input_tokens: 0,
          last_reported_output_tokens: 0,
          last_reported_total_tokens: 0,
          turn_count: 1,
          started_at: DateTime.utc_now(),
          runtime_seconds: 0
        }
      ],
      retrying: [
        %{
          issue_id: "y",
          identifier: "WGTE-002",
          attempt: 2,
          due_in_ms: 30_000,
          reason: :failure,
          error: "simulated error"
        }
      ],
      codex_totals: %{
        input_tokens: 1_234,
        output_tokens: 5_678,
        total_tokens: 6_912,
        seconds_running: 12
      },
      rate_limits: nil,
      workflow_loaded: true,
      tracker_kind: :local_markdown,
      last_tick_at: nil,
      polling: %{poll_interval_ms: 60_000, next_poll_in_ms: 0, checking?: true}
    })

    conn = build_conn(:get, "/")
    {:ok, _view, html} = live(conn, "/")

    # Spec § 13.3 fields surface in the rendered HTML.
    assert html =~ "Operations Dashboard"
    assert html =~ "Running"
    assert html =~ "Retrying"
    assert html =~ "WGTE-001"
    assert html =~ "WGTE-002"
    assert html =~ "thread-1-tur"
    # Token total formatted with thousands separators
    assert html =~ "6,912"
    assert html =~ "Total tokens"
    assert html =~ "Polling"
    assert html =~ "Checking now"
    assert html =~ "Recent events"
  end

  test "interactive elements have routed targets or LiveView actions" do
    now = DateTime.utc_now()

    Symphony.WebCase.start_stub_snapshot!(%{
      running: [
        %{
          issue_id: "x",
          identifier: "WGTE-001",
          state: "in_progress",
          phase: :running,
          status: :running,
          workspace_path: "/tmp/x",
          session_id: "thread-1-turn-2",
          thread_id: "thread-1",
          turn_id: "turn-2",
          codex_app_server_pid: nil,
          last_codex_event: :turn_started,
          last_codex_timestamp: now,
          last_codex_message: %{"method" => "turn/started"},
          codex_input_tokens: 1,
          codex_output_tokens: 2,
          codex_total_tokens: 3,
          last_reported_input_tokens: 0,
          last_reported_output_tokens: 0,
          last_reported_total_tokens: 0,
          turn_count: 1,
          started_at: now,
          runtime_seconds: 0
        }
      ],
      retrying: [
        %{
          issue_id: "y",
          identifier: "WGTE-002",
          attempt: 2,
          due_in_ms: 30_000,
          reason: :failure,
          error: "simulated error"
        }
      ],
      codex_totals: %{input_tokens: 1, output_tokens: 2, total_tokens: 3, seconds_running: 0},
      rate_limits: nil,
      workflow_loaded: true,
      tracker_kind: :local_markdown,
      last_tick_at: nil,
      polling: %{poll_interval_ms: 60_000, next_poll_in_ms: 0, checking?: false}
    })

    conn = build_conn(:get, "/")
    {:ok, _view, html} = live(conn, "/")
    {:ok, document} = Floki.parse_document(html)

    hrefs =
      document
      |> Floki.find("a")
      |> Enum.map(&required_attr!(&1, "href"))

    assert Enum.sort(hrefs) == ["/api/v1/WGTE-001", "/api/v1/WGTE-002"]

    Enum.each(hrefs, fn href ->
      conn =
        build_conn(:get, href)
        |> Symphony.Web.Endpoint.call(Symphony.Web.Endpoint.init([]))

      assert conn.status == 200
    end)

    dead_buttons =
      document
      |> Floki.find("button, [role=\"button\"]")
      |> Enum.reject(&has_live_action?/1)

    assert dead_buttons == []
  end

  test "dashboard stylesheet carries Wranngle design system primitives" do
    assert {:ok, "text/css", css} = Symphony.Web.StaticAssets.fetch("/dashboard.css")

    assert css =~ "--sunset-500: #ff5f00"
    assert css =~ "--violet-500: #cf3c69"
    assert css =~ "--radius-lasso: 24px 4px 24px 4px"
    assert css =~ "font-family: var(--font-mono)"
    assert css =~ ".status-badge-live::before"
    assert css =~ ".table-wrap"
    assert css =~ "max-width: 100%"
  end

  test "renders the error state when snapshot is unavailable" do
    # No stub orchestrator — snapshot returns {:error, :unavailable}
    conn = build_conn(:get, "/")
    {:ok, _view, html} = live(conn, "/")

    assert html =~ "Snapshot unavailable"
    assert html =~ "snapshot_unavailable"
  end

  defp required_attr!(node, name) do
    case Floki.attribute(node, name) do
      [value | _] when value != "" -> value
      _ -> flunk("expected #{inspect(node)} to have non-empty #{name}")
    end
  end

  defp has_live_action?(node) do
    node
    |> Floki.attribute("phx-click")
    |> Enum.any?(&(&1 != ""))
  end
end
