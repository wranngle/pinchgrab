defmodule Mix.Tasks.Symphony.LocalShellProbe do
  @moduledoc """
  Reproduce the port-spawn pattern used by `Symphony.AgentRunner.LocalShell`
  for forensic isolation of the long-running-port SIGKILL pathology.

  The task does NOT start the Symphony application; it just opens a Port
  exactly like `LocalShell.open_supervised_port/4`, runs a synthetic
  command for a configurable duration, and prints the lifecycle.

  Variants:

      # default — current LocalShell flags (binary, exit_status, stderr_to_stdout, hide)
      mix symphony.local_shell_probe --duration 60

      # no stderr merge
      mix symphony.local_shell_probe --duration 60 --variant no_stderr_merge

      # without :hide flag
      mix symphony.local_shell_probe --duration 60 --variant no_hide

      # without watchdog (proves/disproves watchdog-as-killer hypothesis)
      mix symphony.local_shell_probe --duration 60 --variant no_watchdog

      # actually spawn `claude --print` if available
      mix symphony.local_shell_probe --variant claude_real

  Output line format is regular logs; the task exits with the port's exit
  status (or 137 if SIGKILL'd, or 124 if it didn't finish within the
  outer timeout).
  """

  use Mix.Task

  require Logger

  @switches [duration: :integer, variant: :string, timeout: :integer]

  @impl Mix.Task
  def run(args) do
    {opts, _argv, invalid} = OptionParser.parse(args, strict: @switches)

    if invalid != [] do
      Mix.raise("invalid option(s): #{inspect(invalid)}")
    end

    duration = Keyword.get(opts, :duration, 60)
    variant = Keyword.get(opts, :variant, "default")
    outer_timeout_ms = Keyword.get(opts, :timeout, max(duration * 1000 + 30_000, 90_000))

    started_at = System.monotonic_time(:millisecond)

    {executable, port_args, watchdog?} = build_variant(variant, duration)

    Mix.shell().info(
      "probe.start variant=#{variant} duration=#{duration}s timeout_ms=#{outer_timeout_ms} executable=#{executable}"
    )

    port =
      Port.open({:spawn_executable, executable}, port_args)

    os_pid =
      case Port.info(port, :os_pid) do
        {:os_pid, pid} -> pid
        _ -> nil
      end

    Mix.shell().info("probe.port_open os_pid=#{inspect(os_pid)} self=#{inspect(self())}")

    if watchdog? do
      parent = self()

      spawn_link(fn ->
        ref = Process.monitor(parent)
        Process.flag(:trap_exit, true)

        receive do
          {:DOWN, ^ref, :process, _, reason} ->
            Logger.warning("probe.watchdog kill reason=parent_DOWN parent_reason=#{inspect(reason)} os_pid=#{inspect(os_pid)}")
            kill_pgrp(os_pid)

          {:EXIT, from, reason} ->
            Logger.warning("probe.watchdog kill reason=EXIT from=#{inspect(from)} exit_reason=#{inspect(reason)} os_pid=#{inspect(os_pid)}")
            kill_pgrp(os_pid)

          :release ->
            :ok
        end
      end)
    end

    case wait_loop(port, outer_timeout_ms, []) do
      {:ok, code, bytes} ->
        elapsed = System.monotonic_time(:millisecond) - started_at

        Mix.shell().info(
          "probe.exit code=#{code} duration_ms=#{elapsed} bytes=#{bytes} variant=#{variant}"
        )

        System.halt(code)

      {:timeout, bytes} ->
        elapsed = System.monotonic_time(:millisecond) - started_at

        Mix.shell().info(
          "probe.timeout duration_ms=#{elapsed} bytes=#{bytes} variant=#{variant}"
        )

        kill_pgrp(os_pid)
        System.halt(124)
    end
  end

  defp build_variant("claude_real", _duration) do
    bash = System.find_executable("bash") || "/bin/bash"

    shell_command = """
    exec claude --print --output-format stream-json --verbose <<'EOF'
    Read /home/wranngle/.dotfiles/lib/symphony-elixir/mix.exs and /home/wranngle/.dotfiles/lib/symphony-elixir/lib/symphony/orchestrator.ex, then run `cd /home/wranngle/.dotfiles/lib/symphony-elixir && mix compile 2>&1 | head` and report the result.
    EOF
    """

    {bash, [:binary, :exit_status, :stderr_to_stdout, :hide, args: ["-lc", shell_command]], true}
  end

  defp build_variant("no_watchdog", duration) do
    bash = System.find_executable("bash") || "/bin/bash"
    cmd = synthetic_command(duration)
    {bash, [:binary, :exit_status, :stderr_to_stdout, :hide, args: ["-lc", cmd]], false}
  end

  defp build_variant("no_stderr_merge", duration) do
    bash = System.find_executable("bash") || "/bin/bash"
    cmd = synthetic_command(duration)
    {bash, [:binary, :exit_status, :hide, args: ["-lc", cmd]], true}
  end

  defp build_variant("no_hide", duration) do
    bash = System.find_executable("bash") || "/bin/bash"
    cmd = synthetic_command(duration)
    {bash, [:binary, :exit_status, :stderr_to_stdout, args: ["-lc", cmd]], true}
  end

  defp build_variant(_default, duration) do
    bash = System.find_executable("bash") || "/bin/bash"
    cmd = synthetic_command(duration)
    {bash, [:binary, :exit_status, :stderr_to_stdout, :hide, args: ["-lc", cmd]], true}
  end

  defp synthetic_command(duration) do
    "for i in $(seq 1 #{duration}); do echo \"{\\\"type\\\":\\\"tick\\\",\\\"i\\\":$i}\"; sleep 1; done; echo done"
  end

  defp wait_loop(port, timeout_ms, acc) do
    receive do
      {^port, {:data, chunk}} ->
        wait_loop(port, timeout_ms, [acc, chunk])

      {^port, {:exit_status, code}} ->
        {:ok, code, IO.iodata_length(acc)}
    after
      timeout_ms ->
        {:timeout, IO.iodata_length(acc)}
    end
  end

  defp kill_pgrp(nil), do: :ok

  defp kill_pgrp(os_pid) do
    _ = System.cmd("kill", ["-KILL", "-#{os_pid}"], stderr_to_stdout: true)
    :ok
  end
end
