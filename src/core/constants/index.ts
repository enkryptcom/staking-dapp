// import { Validator } from "@/types/staking";
import { BaseTokens, ChainData, Chains, Providers, ValidatorByChain } from "../interfaces";

export const WALLET_TYPES = {
  PHANTOM: "phantom",
  ENKRYPT: "enkrypt",
  METAMASK: "metamask",
};

export const P2P_VALIDATOR = "FKsC411dik9ktS6xPADxs4Fk2SCENvAiuccQHLAPndvk";
export const LAMPORTS_IN_SOL = 1_000_000_000;
export const SOL_FEE = 5000;
export const MIN_BALANCE_EVM = 0.00001;

export const BASE_TOKENS: BaseTokens = {
  [Chains.SOLANA]: {
    id: 1,
    name: "Solana",
    image: require("@/assets/pic/solana.token.svg"),
    symbol: "sol",
    coinGeckoId: "solana",
  },
  [Chains.ETHEREUM]: {
    id: 2,
    name: "Ethereum",
    image: require("@/assets/pic/ethereum.network.png"),
    symbol: "eth",
    coinGeckoId: "ethereum",
  },
  [Chains.ROOTSTOCK]: {
    id: 3,
    name: "Rootstock",
    image: require("@/assets/pic/rif-logo.png"),
    symbol: "rif",
    coinGeckoId: "rif-token",
  }
};

export const chainsData: ChainData = {
  [Chains.SOLANA]: {
    id: "solana",
    name: "Solana",
    image: require("@/assets/pic/solana.network.png"),
  },
  [Chains.ROOTSTOCK]: {
    id: "rootstock",
    name: "Rootstock",
    image: require("@/assets/pic/rootstock.png"),
  }
}

export const validators: {
  [provider: string]: {
    [chain: string]: ValidatorByChain,
  }
} = {
  [Providers.p2p]: {
    [Chains.SOLANA]: {
      apy: "",
      fee: "",
      validatorData: {
        id: "p2p",
        name: "P2P.org",
        image: require("@/assets/pic/p2p.validator.svg"),
        address: "FKsC411dik9ktS6xPADxs4Fk2SCENvAiuccQHLAPndvk",
      }
    },
    [Chains.ROOTSTOCK]: {
      apy: "",
      fee: "",
      validatorData: {
        id: "rootstockcollective",
        name: "RootstockCollective",
        image: require("@/assets/pic/collective-logo.jpg"),
        address: "0x0000000000000000000000000000000000000000",
      }
    }
  }
}

export const ROOTSTOCK_RIF_TOKEN_ADDRESS = "0x2acc95758f8b5f583470ba265eb685a8f45fc9d5";
export const ROOTSTOCK_STRIF_TOKEN_ADDRESS = "0x5db91e24bd32059584bbdb831a901f1199f3d459";
export const ROOTSTOCK_RBTC_TOKEN_ADDRESS = "0xf7ab6cfaebbadfe8b5494022c4c6db776bd63b6b";
export const ROOTSTOCK_BUILDER_REGISTRY_ADDRESS = "0x8cb62c58AC3D1253c6467537FDDc563857eD76cb";
export const ROOTSTOCK_REWARD_DISTRIBUTOR_ADDRESS = "0x5603Ba40257e317e45BA13C3732819Af5E81a9A1";
export const ROOTSTOCK_BACKER_MANAGER_ADDRESS = "0x7995C48D987941291d8008695A4133E557a11530";
export const ROOTSTOCK_USDRIF_TOKEN_ADDRESS = "0x3a15461d8ae0f0fb5fa2629e9da7d66a794a6e37";

export const RIF_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

export const STRIF_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function depositAndDelegate(address to, uint256 value)",
  "function withdrawTo(address account, uint256 value) returns (bool)",
];

export const ROOTSTOCK_BUILDER_REGISTRY_ABI = [
  "function getGaugesLength() view returns (uint256)",
  "function getHaltedGaugesLength() view returns (uint256)",
  "function getGaugeAt(uint256 index_) view returns (address)",
  "function getHaltedGaugeAt(uint256 index_) view returns (address)",
  "function gaugeToBuilder(address gauge) view returns (address builder)",
  "function backerRewardPercentage(address builder) view returns (uint64 previous, uint64 next, uint128 cooldownEndTime)",
];

export const ROOTSTOCK_GAUGE_ABI = [
  "function rewardShares() view returns (uint256)",
  "function earned(address rewardToken_, address backer_) external view returns (uint256)",
  "function allocationOf(address backer) external view returns (uint256 allocation)",
];

export const ROOTSTOCK_REWARD_DISTRIBUTOR_ABI = [
  "function defaultRifAmount() view returns (uint256)",
  "function defaultNativeAmount() view returns (uint256)",
];

export const ROOTSTOCK_BACKER_MANAGER_ABI = [
  "function totalPotentialReward() view returns (uint256)",
  "function backerTotalAllocation(address backer) view returns (uint256 allocation)",
  "function allocateBatch(address[] gauges_, uint256[] allocations_) external",
  "function claimBackerRewards(address[] gauges_) external",
];
