export interface CreateStakeRequest {
  feePayer: string,
  fromPublicKey: string,
  amount: number,
  stakeAuthority?: string,
  withdrawAuthority?: string
}

export interface CreateStakeResponse {
  result: CreateStakeResponseResult,
  error: any,
}

export interface CreateStakeResponseResult {
  feePayer: string,
  fromPublicKey: string,
  stakeAccount: string,
  stakeAuthority: string,
  withdrawAuthority: string,
  amount: number,
  unsignedTransaction: string,
  createdAt: string,
}

export interface SendTransactionRequest {
  signedTransaction: string,
}

export interface SendTransactionResponse {
  result: {
    transactionId: string,
    slot: number,
    signerAccounts: string[],
    createdAt: string
  }
  error: any,
}

export type StakeStatus = "active" | "inactive" | "activating" | "deactivating";

export interface GetStakingAccountRequest {
  stakeAuthorities: string[],
  stakeAccounts?: string[],
  withdrawAuthorities: string[],
  status?: StakeStatus,
}

export interface StakingAccount {
  amount: number,
  stakeAccount: string,
  withdrawAuthority: string,
  stakeAuthority: string,
  voteAccount: string,
  status: StakeStatus,
}

export interface GetStakingAccountResponse {
  error: string | null,
  result: {
    accounts: StakingAccount[],
  },
}

export interface StakeDeactivateRequest {
  feePayer: string,
  stakeAccount: string,
  stakeAuthority: string,
}

export interface StakeDeactivateResponse {
  result: StakeDeactivateResponseResult,
  error: any,
}

export interface StakeDeactivateResponseResult {
  feePayer: string,
  stakeAccount: string,
  stakeAuthority: string,
  unsignedTransaction: string,
  createdAt: string,
}

export interface StakeWithdrawRequest {
  feePayer: string,
  stakeAccount?: string,
  withdrawAuthority?: string,
  recipient?: string,
  amount: string,
}

export interface StakeWithdrawResponse {
  result: StakeWithdrawResponseData,
  error: any,
}

export interface StakeWithdrawResponseData {
  feePayer: string,
  stakeAccount: string,
  withdrawAuthority: string,
  unsignedTransaction: string,
  createdAt: string,
  recipient: string,
  amount: string,
}

export interface GetNetworkAPRResponse {
  result: {
    list: NetworkAPR[],
  }
}

export interface NetworkAPR {
  stakingPeriodNumber: number,
  stakingPeriodStart: string,
  stakingPeriodEnd: string,
  networkApr: number,
  updatedAt: string
}


export interface GetValidatorAPYResponse {
  result: {
    list: ValidatorAPY[],
  }
}

export interface ValidatorAPY {
  updatedAt: string
  stakingPeriod: string,
  stakingPeriodStart: string,
  stakingPeriodEnd: string,
  apy: number
}


export interface GetValidatorFeeResponse {
  result: {
    list: ValidatorFee[],
  }
}

export interface ValidatorFee {
  stakingPeriod: string,
  stakingPeriodEnd: string,
  stakingPeriodStart: string,
  fee: number
}

export interface GetValidatorSummaryResponse {
  result: {
    list: ValidatorSummary[],
  }
}

export interface ValidatorSummary {
  stakingPeriod: string,
  stakingPeriodEnd: string,
  stakingPeriodStart: string,
  apy: number,
  stake: number,
  stakeUsd: number,
  tokenPrice: number,
  rewards: ValidatorSummaryReward[],
}

export interface ValidatorSummaryReward {
  amount: number,
  amountUsd: number,
  type: string,
  currency: string,
  recipient: string
}

export interface getDelegatorRewardsResponse {
  error: string,
  result: getDelegatorRewardsResponseResult,
}

export interface getDelegatorRewardsResponseResult{
  list: DelegatorReward[],
}

export interface DelegatorReward {
  stakingPeriod: string,
  stakingPeriodEnd: string,
  stakingPeriodStart: string,
  validator: string,
  rewards: RewardItem[],
}

export interface RewardItem {
  type: string,
  amount: number,
  amountUsd: number,
  netAmount: number,
  netAmountUsd: number,
  fee: number,
  feeUsd: number,
  currency: string,
  tokenPrice: number,
}

export interface GetDelegatorApyResponse {
  error: string,
  result: GetDelegatorApyResponseResult
}

export interface GetDelegatorApyResponseResult {
  list: DelegatorApy[],
  limit: number
}

export interface DelegatorApy {
  stakingPeriod: string,
  stakingPeriodEnd: string,
  stakingPeriodStart: string,
  validator: string,
  grossApy: number,
  netApy: number,
}
