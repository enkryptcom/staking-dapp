import { Chains, Price } from "@/core/interfaces";
import { Account } from "@/types/account";

export interface SharedState {
  account: Account | null;
  provider: any | null;
  walletType: string | null;
  error: string | null;
  balance: number;
  chain: string;
  network: string;
  price: Price;
  priceStats: {
    priceChangePercentage: number;
    priceChange: number;
    priceSparkline: number[];
    marketCap: number;
  };
  isConnectModalVisible: boolean;
}

export const initialState: SharedState = {
  account: null,
  provider: null,
  walletType: null,
  error: null,
  balance: 0,
  chain: Chains.SOLANA,
  network: import.meta.env.VITE_SOLANA_NETWORK,
  price: {},
  priceStats: {
    priceChangePercentage: 0,
    priceChange: 0,
    priceSparkline: [],
    marketCap: 0,
  },
  isConnectModalVisible: false,
};

export const mutations = {
  setAccount(state: SharedState, account: Account) {
    state.account = account;
  },
  setWalletType(state: SharedState, walletType: string) {
    state.walletType = walletType;
  },
  setProvider(state: SharedState, provider: any) {
    state.provider = provider;
  },
  setBalance(state: SharedState, balance: number) {
    state.balance = balance;
  },
  setPrice(state: SharedState, [currencyId, value]: [string, number]) {
    state.price[currencyId] = value;
  },
  setPriceStats(
    state: SharedState,
    [priceChange, priceChangePercentage, priceSparkline, marketCap]: [
      number,
      number,
      number[],
      number,
    ]
  ) {
    state.priceStats = {
      priceChangePercentage,
      priceChange,
      priceSparkline,
      marketCap,
    };
  },
  setError(state: SharedState, error: string) {
    state.error = error;
  },
  setIsConnectModalVisible(state: SharedState, value: boolean) {
    state.isConnectModalVisible = value;
  },
};
