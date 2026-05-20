defmodule Symphony.Orchestrator.AdapterUpdateStateTest do
  use ExUnit.Case, async: true

  alias Symphony.Config
  alias Symphony.Orchestrator
  alias Symphony.Orchestrator.State

  defmodule ThreeArityAdapter do
    @moduledoc false
    def update_issue_state(config, issue_id, state_name) do
      send(self(), {:three_arity_called, config, issue_id, state_name})
      :ok
    end
  end

  defmodule TwoArityAdapter do
    @moduledoc false
    def update_issue_state(issue_id, state_name) do
      send(self(), {:two_arity_called, issue_id, state_name})
      {:ok, :two_arity}
    end
  end

  defmodule NoTransitionAdapter do
    @moduledoc false
    def some_other_function, do: :noop
  end

  test "calls update_issue_state/3 when adapter exports the 3-arity callback" do
    config = Config.empty()
    state = %State{adapter: ThreeArityAdapter, config: config}

    assert :ok = Orchestrator.adapter_update_state_for_test(state, "ABC-1", "done")
    assert_received {:three_arity_called, ^config, "ABC-1", "done"}
  end

  test "falls back to update_issue_state/2 when only 2-arity callback exists" do
    state = %State{adapter: TwoArityAdapter, config: Config.empty()}

    assert {:ok, :two_arity} =
             Orchestrator.adapter_update_state_for_test(state, "ABC-2", "failed")

    assert_received {:two_arity_called, "ABC-2", "failed"}
  end

  test "returns {:error, {:adapter_no_state_transition, _}} when adapter exports neither" do
    state = %State{adapter: NoTransitionAdapter, config: Config.empty()}

    assert {:error, {:adapter_no_state_transition, NoTransitionAdapter}} =
             Orchestrator.adapter_update_state_for_test(state, "ABC-3", "done")
  end

  test "returns {:error, :no_adapter} when state.adapter is nil" do
    state = %State{adapter: nil, config: nil}

    assert {:error, :no_adapter} =
             Orchestrator.adapter_update_state_for_test(state, "ABC-4", "done")
  end
end
