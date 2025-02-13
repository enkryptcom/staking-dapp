import { Token } from "./token";
import { Validator } from "./staking";

export interface PortfolioItem {
  id: number,
  items: PortfolioValidatorItem[],
  totalStaked: number,
  totalRewards: number,
  avgRewards: number,
  token: Token,
}

export interface PortfolioValidatorItem {
  id: number,
  validator: Validator,
  balance: number,
  reward: number,
  status: string,
  isStake: boolean,
  isUnStake: boolean,
  isClose: boolean,
  isWithdraw: boolean,
}

export const enum PortfolioItemStatus { 
  activating = "activating", 
  active = "active", 
  deactivating = "deactivating",
  unstaked = "unstaked", 
  empty = "empty", 
}