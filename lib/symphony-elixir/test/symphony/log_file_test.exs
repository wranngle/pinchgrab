defmodule Symphony.LogFileTest do
  use ExUnit.Case, async: false

  alias Symphony.LogFile
  alias Symphony.LogFile.EcsJsonFormatter

  describe "default_log_file/0" do
    test "resolves to <project_root>/.artifacts/symphony/events.<date>.jsonl using a marker walk" do
      path = LogFile.default_log_file()
      assert String.ends_with?(path, ".jsonl"), path
      assert path =~ ~r"/\.artifacts/symphony/events\.\d{4}-\d{2}-\d{2}\.jsonl$", path
    end
  end

  describe "default_log_file/1" do
    test "uses an explicit directory as fallback when no marker is present" do
      tmp = make_isolated_dir!()

      try do
        path = LogFile.default_log_file(tmp)
        date = Date.utc_today() |> Date.to_iso8601()
        assert path == Path.join([tmp, ".artifacts", "symphony", "events.#{date}.jsonl"])
      after
        File.rm_rf!(tmp)
      end
    end

    test "walks up to find a project-root marker before falling back" do
      tmp = make_isolated_dir!()
      File.write!(Path.join(tmp, "mix.exs"), "# marker\n")
      nested = Path.join([tmp, "apps", "child"])
      File.mkdir_p!(nested)

      try do
        path = LogFile.default_log_file(nested)
        date = Date.utc_today() |> Date.to_iso8601()
        assert path == Path.join([tmp, ".artifacts", "symphony", "events.#{date}.jsonl"])
      after
        File.rm_rf!(tmp)
      end
    end
  end

  describe "EcsJsonFormatter.format/2" do
    test "emits one ECS-shaped JSON object per line for a plain string message" do
      event = %{
        level: :info,
        msg: {:string, "hello world"},
        meta: %{time: 1_715_730_000_000_000}
      }

      output = EcsJsonFormatter.format(event, %{}) |> IO.iodata_to_binary()
      assert String.ends_with?(output, "\n")

      [json_line] = String.split(output, "\n", trim: true)
      payload = Jason.decode!(json_line)

      assert payload["@timestamp"] =~ ~r"^\d{4}-\d{2}-\d{2}T"
      assert payload["log.level"] == "info"
      assert payload["event.outcome"] == "success"
      assert payload["service.name"] == "symphony"
      assert payload["labels"]["host"] == "local"
      assert payload["labels"]["detail"] == "hello world"
      assert is_binary(payload["event.id"])
      assert is_binary(payload["trace.id"])
      assert is_binary(payload["event.action"])
    end

    test "promotes the message into error.message when level is :error" do
      event = %{
        level: :error,
        msg: {:string, "boom"},
        meta: %{}
      }

      output = EcsJsonFormatter.format(event, %{}) |> IO.iodata_to_binary()
      payload = output |> String.trim() |> Jason.decode!()

      assert payload["log.level"] == "error"
      assert payload["event.outcome"] == "failure"
      assert payload["error.message"] == "boom"
    end

    test "uses meta.event_action when provided, falling back to MFA, then logger.event" do
      explicit = %{level: :info, msg: {:string, "x"}, meta: %{event_action: "sync.ok"}}
      mfa_event = %{level: :info, msg: {:string, "x"}, meta: %{mfa: {SomeMod, :do_it, 2}}}
      bare = %{level: :info, msg: {:string, "x"}, meta: %{}}

      assert decode_action(explicit) == "sync.ok"
      assert decode_action(mfa_event) == "SomeMod.do_it/2"
      assert decode_action(bare) == "logger.event"
    end
  end

  defp decode_action(event) do
    EcsJsonFormatter.format(event, %{})
    |> IO.iodata_to_binary()
    |> String.trim()
    |> Jason.decode!()
    |> Map.fetch!("event.action")
  end

  defp make_isolated_dir! do
    base = System.tmp_dir!()
    suffix = :crypto.strong_rand_bytes(6) |> Base.encode16(case: :lower)
    dir = Path.join(base, "symphony-logfile-test-#{suffix}")
    File.mkdir_p!(dir)
    dir
  end
end
