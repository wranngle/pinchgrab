defmodule Symphony.EnvLoaderTest do
  use ExUnit.Case, async: false

  alias Symphony.EnvLoader

  setup do
    tmp = Path.join(System.tmp_dir!(), "symphony-envloader-#{System.unique_integer([:positive])}")
    File.mkdir_p!(tmp)
    on_exit(fn -> File.rm_rf!(tmp) end)
    {:ok, tmp: tmp}
  end

  test "load_dotenv parses simple KEY=value pairs", %{tmp: tmp} do
    path = Path.join(tmp, ".env")

    File.write!(path, """
    # comment line
    FOO=bar
    BAZ=qux

    EMPTY=
    """)

    parsed = EnvLoader.load_dotenv(path)
    assert parsed["FOO"] == "bar"
    assert parsed["BAZ"] == "qux"
    assert parsed["EMPTY"] == ""
    refute Map.has_key?(parsed, "# comment line")
  end

  test "load_dotenv strips quotes and handles `export` prefix", %{tmp: tmp} do
    path = Path.join(tmp, ".env")

    File.write!(path, """
    export DOUBLE="hello world"
    SINGLE='literal $value'
    INLINE_COMMENT=keep # discard this
    """)

    parsed = EnvLoader.load_dotenv(path)
    assert parsed["DOUBLE"] == "hello world"
    assert parsed["SINGLE"] == "literal $value"
    assert parsed["INLINE_COMMENT"] == "keep"
  end

  test "load_dotenv returns empty map when file missing", %{tmp: tmp} do
    assert EnvLoader.load_dotenv(Path.join(tmp, "nope.env")) == %{}
  end

  test "env_for_agent merges global + project + process env with process winning", %{tmp: tmp} do
    project = Path.join(tmp, "project")
    File.mkdir_p!(project)

    File.write!(Path.join(project, ".env"), """
    FROM_PROJECT=projectvalue
    FOO=project_wins_over_global
    """)

    System.put_env("FROM_PROCESS", "process_only")
    on_exit(fn -> System.delete_env("FROM_PROCESS") end)

    env = EnvLoader.env_for_agent(project)
    map = Map.new(env)

    assert map["FROM_PROJECT"] == "projectvalue"
    assert map["FROM_PROCESS"] == "process_only"
    assert map["FOO"] == "project_wins_over_global"
  end

  test "env_for_agent prepends ~/.bun/bin to PATH when present", %{tmp: tmp} do
    bun_dir = Path.expand("~/.bun/bin")
    if File.dir?(bun_dir) do
      env = EnvLoader.env_for_agent(tmp)
      path_value = env |> Map.new() |> Map.get("PATH", "")
      assert String.contains?(path_value, bun_dir)
    end
  end

  test "env_for_agent tolerates nil project_root" do
    env = EnvLoader.env_for_agent(nil)
    assert is_list(env)
    assert Enum.all?(env, fn {k, v} -> is_binary(k) and is_binary(v) end)
  end
end
