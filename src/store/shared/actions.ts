import { Commit, Dispatch } from "vuex";
import { BASE_TOKENS } from "@/core/constants/index";
import WalletService from "@/core/services/walletService";
import { StakingTypes } from "../modules/staking/consts";
import { getNetworkAPR, getSolanaPrice, getValidatorAPY, getValidatorFee } from "@/core/api";
import { SharedTypes } from "./consts";
import { Providers } from "@/core/interfaces";
import { Account } from "@/types/account";

const walletService = WalletService.getInstance();

export const actions = {
  async walletConnectedAction (
    { commit, dispatch } : 
    { commit: Commit, dispatch: Dispatch },
    address: string,
  ) {
    try {
      await walletService.init();
      await dispatch("loadWalletBalance", address);

      const accountData: Account = {
        name: "Wallet",
        image: require("@/assets/pic/account1.png"),
        address: address,
        isLedger: false,
      };
      commit("setAccount", accountData);
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
    { commit, dispatch } :
    { commit: Commit, dispatch: Dispatch },
    address: string
  ) {
    const solBalance = await walletService.loadBalance(address) as number;
    commit("setBalance", solBalance);

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
      const solPrice = await getSolanaPrice();
      const solPriceData = solPrice.data.getCoinGeckoTokenMarketDataByIds[0];
      commit("setPrice", [BASE_TOKENS.solana.symbol, solPriceData.current_price]);
      commit("setPriceStats", 
        [
          solPriceData.price_change_percentage_24h,
          solPriceData.price_change_24h,
          solPriceData.sparkline_in_24h.price,
          solPriceData.market_cap,
        ]
      );

      const chain = rootGetters[SharedTypes.CHAIN_GETTER];
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
  },

  async connectModalAction({ commit }: {
    commit: Commit,
  }, value: boolean ) {
    commit("setIsConnectModalVisible", value);
  }
};
