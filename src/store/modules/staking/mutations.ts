import {
  Chains,
  CreateStakeResponseResult,
  Portfolio,
  PortfolioByChain,
  PortfolioItem,
  Providers,
  StakeDeactivateResponseResult,
  StakeWithdrawResponseData,
  StakingItems,
  ValidatorsType
} from "@/core/interfaces";
import { BASE_TOKENS, chainsData, validators } from "@/core/constants";

export interface StakingState {
  stakingAmount: string | null,
  txId: string | null,
  portfolio: Portfolio,
  isLoading: boolean,
  isStakingLoading: boolean,
  deactivatingStake: PortfolioItem | null,
  withdrawStake: PortfolioItem | null,
  stakingItems: StakingItems,
  validators: ValidatorsType,
  stakingData: CreateStakeResponseResult | null,
  stakingFee: number,
  deactivatingData: StakeDeactivateResponseResult | null,
  deactivatingFee: number,
  withdrawData: StakeWithdrawResponseData | null,
  withdrawFee: number,
  error: string | null;
}


export const initialState: StakingState = {
  stakingAmount: null,
  txId: null,
  portfolio: {},
  isLoading: false,
  isStakingLoading: false,
  deactivatingStake: null,
  withdrawStake: null,
  stakingItems: {
    [Chains.SOLANA]: {
      name: "Solana staking",
      chainData: chainsData[Chains.SOLANA],
      apr: "",
      token: BASE_TOKENS[Chains.SOLANA],
    }
  },
  validators: {
    [Providers.p2p]: {
      [Chains.SOLANA]: {
        validatorData: validators[Providers.p2p][Chains.SOLANA].validatorData,
        apy: "",
        fee: "",
      }
    }
  },
  stakingData: null,
  stakingFee: 0,
  deactivatingData: null,
  deactivatingFee: 0,
  withdrawData: null,
  withdrawFee: 0,
  error: null,
};

export const mutations = {
  setStakingAmount(state: StakingState, stake: string) {
    state.stakingAmount = stake;
  },
  setDeactivatingStake(state: StakingState, stakingItem: PortfolioItem) {
    state.deactivatingStake = stakingItem;
  },
  setWithdrawStake(state: StakingState, stakingItem: PortfolioItem) {
    state.withdrawStake = stakingItem;
  },
  setTxId(state: StakingState, txId: string) {
    state.txId = txId;
  },
  setStakingAccounts(state: StakingState, [portfolioByChain, chain]: [PortfolioByChain, string]) {
    state.portfolio = {
      ...state.portfolio,
      [chain]: portfolioByChain,
    };
  },
  emptyPortfolio(state: StakingState) {
    state.portfolio = {};
  },
  updateValidatorData(state: StakingState, [provider, chain, apy, fee]: [string, string, string, string]) {
    state.validators[provider][chain].apy = apy;
    state.validators[provider][chain].fee = fee;
  },
  updateStakingData(state: StakingState, [chain, apr]: [string, string]) {
    state.stakingItems[chain].apr = apr;
  },
  updateLoadingState(state: StakingState, isLoading: boolean) {
    state.isLoading = isLoading;
  },
  updateStakingLoadingState(state: StakingState, isLoading: boolean) {
    state.isStakingLoading = isLoading;
  },
  setStakingData(state: StakingState, [stakngData, fee]: [CreateStakeResponseResult, number]) {
    state.stakingData = stakngData;
    state.stakingFee = fee;
  },
  setDeactivatingData(state: StakingState, [deactivatingData, fee]: [StakeDeactivateResponseResult, number]) {
    state.deactivatingData = deactivatingData;
    state.deactivatingFee = fee;
  },
  setWithdrawData(state: StakingState, [withdrawData, fee]: [StakeWithdrawResponseData, number]) {
    state.withdrawData = withdrawData;
    state.withdrawFee = fee;
  },
  setError(state: StakingState, error: string) {
    state.error = error;
  },
};
