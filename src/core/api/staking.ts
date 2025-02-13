import {
  CreateStakeRequest,
  CreateStakeResponse,
  SendTransactionRequest,
  SendTransactionResponse,
  GetStakingAccountRequest,
  GetStakingAccountResponse,
  StakeDeactivateRequest,
  StakeDeactivateResponse,
  StakeWithdrawRequest,
  StakeWithdrawResponse,
  GetNetworkAPRResponse,
  GetValidatorAPYResponse,
  GetValidatorFeeResponse,
  GetValidatorSummaryResponse,
  GetDelegatorApyResponse,
  getDelegatorRewardsResponse,
} from "@/core/interfaces";
import { makeRequest } from "@/utils/request";
import { P2P_VALIDATOR } from "@/core/constants"

export async function createStake(
  request: CreateStakeRequest,
  chain: string,
  network: string,
): Promise<CreateStakeResponse> {
  return makeRequest<CreateStakeRequest, CreateStakeResponse>({
    route: `/${chain}/${network}/staking/stake`,
    method: "POST",
    body: request,
  });
};

export async function sendTransaction(
  request: SendTransactionRequest,
  chain: string,
  network: string,
): Promise<SendTransactionResponse> {
  return makeRequest<SendTransactionRequest, SendTransactionResponse>({
    route: `/${chain}/${network}/tx/send`,
    method: "POST",
    body: request,
  });
};

export async function stakeDeactivate(
  request: StakeDeactivateRequest,
  chain: string,
  network: string,
): Promise<StakeDeactivateResponse> {
  return makeRequest<StakeDeactivateRequest, StakeDeactivateResponse>({
    route: `/${chain}/${network}/staking/deactivate`,
    method: "POST",
    body: request,
  });
};

export async function stakeWithdraw(
  request: StakeWithdrawRequest,
  chain: string,
  network: string,
): Promise<StakeWithdrawResponse> {
  return makeRequest<StakeWithdrawRequest, StakeWithdrawResponse>({
    route: `/${chain}/${network}/staking/withdraw`,
    method: "POST",
    body: request,
  });
};

export async function getStakingAccount(
  request: GetStakingAccountRequest,
  chain: string,
  network: string,
): Promise<GetStakingAccountResponse> {
  const stakeAuthorities = request.stakeAuthorities.join(",");
  const stakeAccounts = request.stakeAccounts?.join(",");
  const withdrawAuthorities = request.withdrawAuthorities.join(",");


  return makeRequest<void, GetStakingAccountResponse>({
    route: `/${chain}/${network}/account/staking?stakeAuthorities=${stakeAuthorities}&withdrawAuthorities=${withdrawAuthorities}
    ${stakeAccounts ? `&stakeAccounts=${stakeAccounts}` : ""}
    ${request?.status ? `&status=${request?.status}` : ""}`,
    method: "GET",
  });
};

export async function getNetworkAPR(
  chain: string,
): Promise<GetNetworkAPRResponse> {
  return makeRequest<void, GetNetworkAPRResponse>({
    route: `/${chain}/data/network/apr?limit=1`,
    method: "GET",
  });
};

export async function getValidatorAPY(
  chain: string,
): Promise<GetValidatorAPYResponse> {
  return makeRequest<void, GetValidatorAPYResponse>({
    route: `/${chain}/data/validator/apy?limit=1&address=${P2P_VALIDATOR}`,
    method: "GET",
  });
};

export async function getValidatorFee(
  chain: string,
): Promise<GetValidatorFeeResponse> {
  return makeRequest<void, GetValidatorFeeResponse>({
    route: `/${chain}/data/validator/fee?limit=1&address=${P2P_VALIDATOR}`,
    method: "GET",
  });
};

export async function getValidatorSummary(
  chain: string,
): Promise<GetValidatorSummaryResponse> {
  return makeRequest<void, GetValidatorSummaryResponse>({
    route: `/${chain}/data/validator/summary?limit=1&address=${P2P_VALIDATOR}`,
    method: "GET",
  });
};

export async function getDelegatorRewards(
  chain: string,
  stakingAddress: string,
  addressType: string = "stake_account"
): Promise<getDelegatorRewardsResponse> {
  return makeRequest<void, getDelegatorRewardsResponse>({
    route: `/${chain}/data/delegator/rewards?address=${stakingAddress}&addressType=${addressType}`,
    method: "GET",
  });
};

export async function getDelegatorApy(
  chain: string,
  stakingAddress: string,
  addressType: string = "stake_account"
): Promise<GetDelegatorApyResponse> {
  return makeRequest<void, GetDelegatorApyResponse>({
    route: `/${chain}/data/delegator/apy?address=${stakingAddress}&addressType=${addressType}&limit=1`,
    method: "GET",
  });
};
