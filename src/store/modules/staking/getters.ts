import { StakingState } from "./mutations";

export const getters = {
  getStakingAmount: (state: StakingState) => state.stakingAmount,
  getStakingTxID: (state: StakingState) => state.txId,
  getPortfolio: (state: StakingState) => state.portfolio,
  getPortfolioByChain: (state: StakingState) => (chain: string) => {
    return state.portfolio[chain]
  },
  getDeactivatingStake: (state: StakingState) => state.deactivatingStake,
  getDeactivatingData: (state: StakingState) => state.deactivatingData,
  getWithdrawStake: (state: StakingState) => state.withdrawStake,
  getWithdrawData: (state: StakingState) => state.withdrawData,
  getStakingItems: (state: StakingState) => state.stakingItems,
  getValidators: (state: StakingState) => state.validators,
  getIsLoading: (state: StakingState) => state.isLoading,
  getIsStakingLoading: (state: StakingState) => state.isStakingLoading,
  getStakingData: (state: StakingState) => state.stakingData,
  getStakingFee: (state: StakingState) => state.stakingFee,
  getDeactivatingFee: (state: StakingState) => state.deactivatingFee,
  getWithdrawFee: (state: StakingState) => state.withdrawFee,
  getError: (state: StakingState) => state.error,
};