import { Network } from "@/types/network";
import { StakingItem } from "@/types/stakingItem";
import { Token } from "@/types/token";
import { GasFeeInfo } from "@/types/transaction";
import { Account } from "@/types/account";
import { Validator } from "@/types/staking";
import { PortfolioItemStatus, PortfolioItem } from "@/types/portfolio";

export const selectNetwork: Network = {
  id: 1,
  name: "Solana",
  image: require("@/assets/pic/solana.network.png"),
};

export const selectNetworkItems: Network[] = [
  {
    id: 1,
    name: "Solana",
    image: require("@/assets/pic/solana.network.png"),
  },
  {
    id: 2,
    name: "Ethereum",
    image: require("@/assets/pic/ethereum.network.png"),
  },
];

export const stakingItems: StakingItem[] = [
  {
    id: 1,
    name: "Solana staking",
    image: require("@/assets/pic/solana.network.png"),
    apr: 7.31,
    balance: 134.07,
    priceChange: 0.30,
    percentChange: 0.21,
    mcap: 49.54,
    network: {
      id: 1,
      name: "Solana",
      image: require("@/assets/pic/solana.network.png"),
    }
  },
  {
    id: 2,
    name: "Ethereum staking",
    image: require("@/assets/pic/ethereum.network.png"),
    apr: 4.3,
    balance: 134.07,
    priceChange: 0.30,
    percentChange: 0.21,
    mcap: 49.54,
    network: {
      id: 2,
      name: "Ethereum",
      image: require("@/assets/pic/ethereum.network.png"),
    }
  },
];

export const solana: Token = {
  id: 1,
  name: "Solana",
  image: require("@/assets/pic/solana.token.svg"),
  symbol: "sol",
  price: 10.2,
};

export const ethereum: Token = {
  id: 1,
  name: "Ethereum",
  image: require("@/assets/pic/ethereum.network.png"),
  symbol: "eth",
  price: 2460.2,
};

export const fee: GasFeeInfo = {
  nativeValue: 10,
  fiatValue: 200,
  nativeSymbol: "sol",
  fiatSymbol: "USD",
};

export const fromAccount: Account = {
  id: 1,
  name: "My account nickname",
  image: require("@/assets/pic/account1.png"),
  address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
  isLedger: false,
}

export const accounts: Account[] = [
  {
    id: 1,
    name: "Account #1",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    isLedger: false,
  },
  {
    id: 2,
    name: "Main account",
    image: require("@/assets/pic/account2.png"),
    address: "1qnJN7FViy3HZaxZK9tGAA71zxHSBeUweirKqCaox4t8GT7",
    isLedger: true,
  },
  {
    id: 3,
    name: "My account nickname",
    image: require("@/assets/pic/account2.png"),
    address: "1qnJN7FViy3HZaxZK9tGAA71zxHSBeUweirKqCaox4t8GT7",
    isLedger: true,
  },
];

export const recent: Account[] = [
  {
    id: 1,
    name: "Alex",
    image: require("@/assets/pic/account1.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    isLedger: false,
  },
  {
    id: 2,
    name: "",
    image: require("@/assets/pic/account2.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    isLedger: true,
  },
  {
    id: 3,
    name: "Ledger",
    image: require("@/assets/pic/account1.png"),
    address: "1c8vCnfzHCjZRUTYsFQF53nzPsW6yHd8vJPnmMXocPCtvvp",
    isLedger: true,
  },
  {
    id: 4,
    name: "",
    image: require("@/assets/pic/account2.png"),
    address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
    isLedger: true,
  },
  {
    id: 5,
    name: "",
    image: require("@/assets/pic/account1.png"),
    address: "1c8vCnfzHCjZRUTYsFQF53nzPsW6yHd8vJPnmMXocPCtvvp",
    isLedger: true,
  },
];

export const p2p: Validator = {
  id: 1,
  name: "P2P.org",
  image: require("@/assets/pic/p2p.validator.svg"),
  address: "1c8vCnfzHCjZRUTYsFQF53nzPsW6yHd8vJPnmMXocPCtvvp",
  nominators: 0.0706,
  commission: 0.07,
  total: 100,
  bonded: 100,
  returns: 100,
  token: solana,
  isActive: true,
  isBlocking: true,
  isElected: true,
  isNominating: true,
  isHighRisk: false,
  isOversubscribed: true,
};

export const stakefish: Validator = {
  id: 1,
  name: "P2P.org",
  image: require("@/assets/pic/stakefish.validator.png"),
  address: "15pSLMoW287q4jYKBRsKr6bydqwR8xrZpAmxGFyUZBB4m73P",
  nominators: 0.0406,
  commission: 0.08,
  total: 40,
  bonded: 20,
  returns: 10,
  token: solana,
  isActive: true,
  isBlocking: true,
  isElected: true,
  isNominating: true,
  isHighRisk: false,
  isOversubscribed: true,
};

export const myPortfolio: PortfolioItem[] = [
  {
    id: 1,
    items: [
      {
        id: 1,
        validator: p2p,
        balance: 40,
        reward: 0,
        status: PortfolioItemStatus.activating,
        isStake: false,
        isUnStake: true,
        isClose: false,
        isWithdraw: false
      },
      {
        id: 2,
        validator: stakefish,
        balance: 24,
        reward: 0.124,
        status: PortfolioItemStatus.active,
        isStake: false,
        isUnStake: true,
        isClose: false,
        isWithdraw: false
      },
      {
        id: 3,
        validator: stakefish,
        balance: 40,
        reward: 0.23,
        status: PortfolioItemStatus.deactivating,
        isStake: false,
        isUnStake: false,
        isClose: false,
        isWithdraw: false
      },
      {
        id: 4,
        validator: p2p,
        balance: 40,
        reward: 0.23,
        status: PortfolioItemStatus.unstaked,
        isStake: true,
        isUnStake: false,
        isClose: false,
        isWithdraw: true
      },
      {
        id: 5,
        validator: stakefish,
        balance: 0,
        reward: 0,
        status: PortfolioItemStatus.empty,
        isStake: false,
        isUnStake: false,
        isClose: true,
        isWithdraw: false
      }
    ],
    totalStaked: 40,
    totalRewards: 0,
    avgRewards: 0.0646,
    token: solana,
  },
  {
    id: 2,
    items: [
      {
        id: 1,
        validator: p2p,
        balance: 40,
        reward: 0,
        status: PortfolioItemStatus.active,
        isStake: false,
        isUnStake: true,
        isClose: false,
        isWithdraw: false
      }
    ],
    totalStaked: 0.345,
    totalRewards: 0.023,
    avgRewards: 0.0446,
    token: ethereum,
  },
];