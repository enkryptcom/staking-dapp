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

export const BASE_TOKENS: BaseTokens = {
  [Chains.SOLANA]: {
    id: 1,
    name: "Solana",
    image: require("@/assets/pic/solana.token.svg"),
    symbol: "sol",
  },
  [Chains.ETHEREUM]: {
    id: 2,
    name: "Ethereum",
    image: require("@/assets/pic/ethereum.network.png"),
    symbol: "eth",
  }
};

export const chainsData: ChainData = {
  [Chains.SOLANA]: {
    id: "solana",
    name: "Solana",
    image: require("@/assets/pic/solana.network.png"),
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
    }
  }
}
