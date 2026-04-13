import { Commit, Dispatch } from "vuex";
import { ethers } from "ethers";
import { BASE_TOKENS, ROOTSTOCK_RIF_TOKEN_ADDRESS, WALLET_TYPES } from "@/core/constants/index";
import WalletService from "@/core/services/walletService";
import EvmWalletService from "@/core/services/evmWalletService";
import { StakingTypes } from "../modules/staking/consts";
import { getNetworkAPR, getValidatorAPY, getValidatorFee, getRootstockAbi } from "@/core/api";
import { getTokenMarketData } from "@/core/api/price";
import { SharedTypes } from "./consts";
import { Chains, Providers } from "@/core/interfaces";
import { Account } from "@/types/account";
import { SharedState } from "./mutations";

const walletService = WalletService.getInstance();
const evmWalletService = EvmWalletService.getInstance();
let evmAccountChangeHandler: ((accounts: string[]) => void) | null = null;

export const actions = {
  async walletConnectedAction (
    { commit, dispatch, rootGetters } :
    { commit: Commit, dispatch: Dispatch, rootGetters: any },
    address: string,
  ) {
    try {
      const chain = rootGetters[SharedTypes.CHAIN_GETTER];
      if (chain === Chains.SOLANA) {
        await walletService.init();
      }

      const accountData: Account = {
        name: chain === Chains.ROOTSTOCK ? "EVM Wallet" : "Wallet",
        image: chain === Chains.ROOTSTOCK
          ? require("@/assets/pic/ethereum.network.png")
          : require("@/assets/pic/account1.png"),
        address: address,
        isLedger: false,
      };
      commit("setAccount", accountData);
      if (chain === Chains.ROOTSTOCK) {
        commit("setProvider", evmWalletService.getWeb3Provider());
        commit("setWalletType", WALLET_TYPES.METAMASK);
      }
      await dispatch("loadWalletBalance", address);
      await dispatch(StakingTypes.LOAD_STAKING_ACCOUNTS_ACTION, address, { root: true });
    } catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) {
        message = error.message;
      }
      commit("setError", message);
    }
  },

  async loadWalletBalance(
    { commit, dispatch, rootGetters } :
    { commit: Commit, dispatch: Dispatch, rootGetters: any },
    address: string
  ) {
    const chain = rootGetters[SharedTypes.CHAIN_GETTER];
    const connectedAccount = rootGetters[SharedTypes.WALLET_ACCOUNT_GETTER];
    if (!connectedAccount || connectedAccount.address !== address) {
      return;
    }

    let balance = 0;
    if (chain === Chains.SOLANA) {
      balance = await walletService.loadBalance(address) as number ?? 0;
    } else if (chain === Chains.ROOTSTOCK) {
      balance = await evmWalletService.loadTokenBalance(address, ROOTSTOCK_RIF_TOKEN_ADDRESS) as number;
    }
    commit("setBalance", balance);

    setTimeout(async () => {
      await dispatch("loadWalletBalance", address);
    }, 5000);
  },

  async loadWalletDataAction({
    commit,
    dispatch,
    rootGetters
  } : {
    commit: Commit,
    dispatch: Dispatch,
    rootGetters: any
  }) {
    try {
      const chain = rootGetters[SharedTypes.CHAIN_GETTER];
      const token = BASE_TOKENS[chain];
      const tokenId = token?.coinGeckoId ?? "solana";
      const tokenPriceResponse = await getTokenMarketData(tokenId);

      const tokenPriceData = tokenPriceResponse.data.getCoinGeckoTokenMarketDataByIds[0];
      commit("setPrice", [token.symbol, tokenPriceData.current_price]);
      commit("setPriceStats", 
        [
          tokenPriceData.price_change_percentage_24h,
          tokenPriceData.price_change_24h,
          tokenPriceData.sparkline_in_24h.price,
          tokenPriceData.market_cap,
        ]
      );

      if (chain === Chains.ROOTSTOCK) {
        const rbtcPriceResponse = await getTokenMarketData("rootstock");
        const rbtcPriceData = rbtcPriceResponse.data.getCoinGeckoTokenMarketDataByIds[0];
        commit("setPrice", ["rbtc", rbtcPriceData.current_price]);
      }

      if (chain === Chains.ROOTSTOCK) {
        const abiResponse = await getRootstockAbi();
        const abiValue = abiResponse?.data?.abi ?? "0";

        await dispatch(StakingTypes.UPDATE_STAKING_ACTION, [chain, abiValue], { root: true });
        await dispatch(StakingTypes.UPDATE_VALIDATOR_ACTION, [
          Providers.p2p,
          chain,
          "0",
          "0",
        ], { root: true });
      } else {
        const networkAPR = await getNetworkAPR(chain);
        const validatorAPY = await getValidatorAPY(chain);
        const validatorFee = await getValidatorFee(chain);

        await dispatch(StakingTypes.UPDATE_STAKING_ACTION, [chain, networkAPR.result.list[0].networkApr], { root: true });
        await dispatch(StakingTypes.UPDATE_VALIDATOR_ACTION, [
          Providers.p2p,
          chain,
          validatorAPY.result.list[0].apy,
          validatorFee.result.list[0].fee,
        ], { root: true });
      }
    } catch (e: any) {
      console.log(e?.message);
      setTimeout(async () => {
        await dispatch("loadWalletDataAction");
      }, 3000);
    }
  },

  async disconnectWallet(
    { dispatch, commit }: 
    { dispatch: Dispatch, commit: Commit }
  ) {
    await dispatch(StakingTypes.EMPTY_STAKING_ACCOUNTS_ACTION, [], { root: true });

    commit("setAccount", null);
    commit("setWalletType", null);
    commit("setProvider", null);
    commit("setBalance", 0);
    if (evmAccountChangeHandler) {
      evmWalletService.removeAccountChangeListener(evmAccountChangeHandler);
      evmAccountChangeHandler = null;
    }
    await evmWalletService.disconnect();
  },

  async connectModalAction({ commit }: {
    commit: Commit,
  }, value: boolean ) {
    commit("setIsConnectModalVisible", value);
  },

  async connectEvmWalletAction({ dispatch, commit, rootGetters }: {
    dispatch: Dispatch,
    commit: Commit,
    rootGetters: any,
  }) {
    try {
      const chain = rootGetters[SharedTypes.CHAIN_GETTER];
      if (chain !== Chains.ROOTSTOCK) {
        throw new Error("EVM wallet connection is only available for Rootstock network");
      }

      const address = await evmWalletService.connectWallet();
      commit("setProvider", evmWalletService.getWeb3Provider());
      commit("setWalletType", WALLET_TYPES.METAMASK);
      if (evmAccountChangeHandler) {
        evmWalletService.removeAccountChangeListener(evmAccountChangeHandler);
      }
      evmAccountChangeHandler = async (accounts: string[]) => {
        if (!accounts.length) {
          await dispatch(SharedTypes.DISCONNECT_WALLET_ACTION, undefined, { root: true });
        } else {
          await dispatch(SharedTypes.CONNECTED_WALLET_ACTION, ethers.utils.getAddress(accounts[0]), { root: true });
        }
      };
      evmWalletService.listenForAccountChanges(evmAccountChangeHandler);
      await dispatch(SharedTypes.CONNECTED_WALLET_ACTION, address, { root: true });
    } catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) {
        message = error.message;
      }
      commit("setError", message);
    }
  },

  async switchChainAction({ commit, dispatch, state }: {
    commit: Commit,
    dispatch: Dispatch,
    state: SharedState,
  }, chain: Chains) {
    if (state.chain === chain) {
      return;
    }

    if (state.account) {
      await dispatch(SharedTypes.DISCONNECT_WALLET_ACTION, undefined, { root: true });
    }

    const network = chain === Chains.SOLANA
      ? import.meta.env.VITE_SOLANA_NETWORK
      : import.meta.env.VITE_ROOTSTOCK_NETWORK;

    commit("setChain", chain);
    commit("setNetwork", network);
    commit("setPriceStats",
      [
        0,
        0,
        [],
        0,
      ]
    );
    commit("setPrice", [BASE_TOKENS[chain].symbol, 0]);
    commit("setError", null);

    await dispatch(SharedTypes.LOAD_WALLET_DATA_ACTION, undefined, { root: true });
  },
};
