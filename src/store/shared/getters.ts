// src/store/modules/wallet/getters.ts
import { SharedState } from "./mutations";

export const getters = {
  isWalletConnected: (state: SharedState) => !!state.account,
  walletAccount: (state: SharedState) => state.account,
  walletType: (state: SharedState) => state.walletType,
  walletError: (state: SharedState) => state.error,
  walletBalance: (state: SharedState) => state.balance,
  getChain: (state: SharedState) => state.chain,
  getNetwork: (state: SharedState) => state.network,
  getPrice: (state: SharedState) => state.price,
  getPriceStats: (state: SharedState) => state.priceStats,
  isConnectModalVisible: (state: SharedState) => state.isConnectModalVisible,
};
