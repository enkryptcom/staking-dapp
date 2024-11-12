import { Token } from "./token";
import { Validator } from "./staking";

export interface PortfolioItem {
  id: number,
  items: PortfolioValidatorItem[]
  totalStaked: number
  totalRewards: number
  avgRewards: number
  token: Token
}

export interface PortfolioValidatorItem {
  id: number
  validator: Validator
  balance: number
  reward: number
  status: PortfolioItemStatus
  isStake: boolean
  isUnStake: boolean
  isClose: boolean
  isWithdraw: boolean
}

export const enum PortfolioItemStatus { 
  activating = "Activating", 
  active = "Active", 
  deactivating = "Deactivating",
  unstaked = "Unstaked", 
  empty = "Empty", 
}