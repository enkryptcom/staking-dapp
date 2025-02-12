import { Token } from "./portfolio";

export enum Providers {
  p2p = "p2p",
};

export enum Chains {
  ETHEREUM = "ethereum",
  SOLANA = "solana",
};

export enum Networks {
  mainnet = "mainnet-beta",
  testnet = "testnet",
};

export interface ChainData {
  [chain: string]: ChainDataItem,
}

export interface ChainDataItem {
  id: string,
  name: string,
  image?: any,
}

export interface StakingItems {
  [chain: string]: StakingItemByChain,
}

export interface StakingItemByChain {
  chainData: ChainDataItem,
  name: string,
  apr: string,
  token: Token,
}

export interface ValidatorsType {
  [provider: string]: {
    [chain: string]: ValidatorByChain,
  },
}

export interface ValidatorByChain {
  validatorData: ValidatorTypeItem,
  apy: string,
  fee: string,
}

export interface ValidatorTypeItem {
  id: string,
  name: string,
  image: any,
  address: string,
}

export interface Price {
  [currencyId: string]: number;
}
