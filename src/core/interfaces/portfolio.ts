export interface Token {
  id: number;
  name: string;
  image: string;
  symbol: string;
  price?: number;
}

export interface BaseTokens {
  [chain: string]: Token,
}

export interface Portfolio {
  [chain: string]: PortfolioByChain,
}

export interface PortfolioByChain {
  items: PortfolioItem[],
  totalStaked: number,
  totalRewards: number,
  avgRewards: number,
  baseToken: Token,
}

export interface PortfolioItem {
  balance: number,
  reward: number,
  status: string,
  stakeAccount: string,
  stakeAuthority: string,
  voteAccount: string
  withdrawAuthority: string,
  provider: string,
  chain: string,
};

export enum Statuses {
  ACTIVE = "active",
  ACTIVATING = "activating",
  INACTIVE = "inactive",
  DEACTIVATING = "deactivating",
  EMPTY = "empty",
};
