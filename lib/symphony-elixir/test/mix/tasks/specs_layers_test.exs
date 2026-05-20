defmodule Mix.Tasks.Specs.LayersTest do
  use ExUnit.Case, async: false

  import ExUnit.CaptureIO

  alias Mix.Tasks.Specs.Layers

  setup do
    Mix.Task.reenable("specs.layers")
    :ok
  end

  test "passes on the actual symphony tree" do
    output =
      capture_io(fn ->
        assert :ok = Layers.run([])
      end)

    assert output =~ "specs.layers: no layer violations"
    assert output =~ "Tier dependency matrix"
  end

  test "fails when a Repo-tier module references a UI-tier module" do
    in_temp_layer_tree(fn root ->
      write_module!(Path.join(root, "tracker/local_markdown.ex"), """
      defmodule Symphony.Tracker.LocalMarkdown do
        @behaviour Symphony.Tracker
        alias Symphony.Web.Endpoint

        def fake, do: Endpoint
      end
      """)

      write_module!(Path.join(root, "web/endpoint.ex"), """
      defmodule Symphony.Web.Endpoint do
        def url, do: "/"
      end
      """)

      stderr =
        capture_io(:stderr, fn ->
          assert_raise Mix.Error,
                       ~r/specs.layers failed with 1 forward-dependency violation/,
                       fn ->
                         capture_io(fn -> Layers.run(["--path", root]) end)
                       end
        end)

      assert stderr =~ "Symphony.Tracker.LocalMarkdown (L1 Repo) -> Symphony.Web.Endpoint (L4 UI)"
    end)
  end

  test "allows cross-cutting modules to be referenced from any tier" do
    in_temp_layer_tree(fn root ->
      write_module!(Path.join(root, "tracker/local_markdown.ex"), """
      defmodule Symphony.Tracker.LocalMarkdown do
        @behaviour Symphony.Tracker
        alias Symphony.Logging
        alias Symphony.Config

        def fake(payload) do
          Logging.event(payload)
          Config.tracker_kind(payload)
        end
      end
      """)

      output =
        capture_io(fn ->
          assert :ok = Layers.run(["--path", root])
        end)

      assert output =~ "specs.layers: no layer violations"
    end)
  end

  test "@behaviour declarations are not counted as layer dependencies" do
    in_temp_layer_tree(fn root ->
      # Adapter (Repo tier) declares @behaviour Symphony.Tracker (Cross-cutting),
      # which would otherwise be caught even though we treat it as a contract.
      # We swap in a hypothetical behaviour at a higher tier (Runtime) to
      # prove the special case actually skips behaviour declarations rather
      # than passing because the target tier is permissive.
      write_module!(Path.join(root, "tracker/local_markdown.ex"), """
      defmodule Symphony.Tracker.LocalMarkdown do
        @behaviour Symphony.Orchestrator

        def fake, do: :ok
      end
      """)

      output =
        capture_io(fn ->
          assert :ok = Layers.run(["--path", root])
        end)

      assert output =~ "specs.layers: no layer violations"
    end)
  end

  defp in_temp_layer_tree(fun) do
    root =
      Path.join(
        System.tmp_dir!(),
        "specs-layers-test-#{System.unique_integer([:positive, :monotonic])}"
      )

    File.rm_rf!(root)
    File.mkdir_p!(root)

    try do
      fun.(root)
    after
      File.rm_rf!(root)
    end
  end

  defp write_module!(path, source) do
    File.mkdir_p!(Path.dirname(path))
    File.write!(path, source)
  end
end
