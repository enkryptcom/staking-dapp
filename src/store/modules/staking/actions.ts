import { Buffer } from "buffer";
import { utils } from "ethers";
import { Commit, Dispatch } from "vuex";
import {
  createStake,
  sendTransaction,
  getStakingAccount,
  stakeDeactivate,
  stakeWithdraw,
  getDelegatorRewards,
} from "@/core/api";
import { 
  CreateStakeRequest,
  GetStakingAccountRequest,
  SendTransactionRequest,
  PortfolioItem,
  Providers,
  PortfolioByChain,
  StakeDeactivateRequest,
  StakeWithdrawRequest,
} from "@/core/interfaces";
import { Transaction } from "@solana/web3.js";
import WalletService from "@/core/services/walletService";
import { SharedTypes } from "@/store/shared/consts";
import { BASE_TOKENS } from "@/core/constants";
import { LAMPORTS_IN_SOL, SOL_FEE } from "@/core/constants";
import { getStorageStakingData, saveStorageStakingAccounts } from "@/utils/storage";

import { StakingState } from "./mutations";

const walletService = WalletService.getInstance();

export const actions = {
  async createStakeAction ({ state, commit, rootGetters }: { 
    state: StakingState,
    commit: Commit,
    rootGetters: any,
  }, [accountAddress, walletBalance]: [string, number]) {
    try {
      commit("updateStakingLoadingState", true);
      const chain = rootGetters[SharedTypes.CHAIN_GETTER];
      const network = rootGetters[SharedTypes.NETWORK_GETTER];

      const amount = parseFloat(utils.parseUnits(state.stakingAmount as string, 9).toString());
      const balance = parseFloat(utils.parseUnits(`${walletBalance}`, 9).toString());
      
      const payload: CreateStakeRequest = {
        amount: amount > balance - SOL_FEE ? amount - SOL_FEE : amount,
        fromPublicKey: accountAddress,
        feePayer: accountAddress,
      };

      const createStakeResponse = await createStake(payload, chain, network);

      if (createStakeResponse?.error) {
        console.error(`API request failed with status: ${createStakeResponse?.error}`);
        throw new Error("Something went wrong");
      }

      const tx = Transaction.from(Buffer.from(createStakeResponse.result.unsignedTransaction, 'base64'));
      const fee = await walletService.getTransactionFee(tx) as number;
      commit("setStakingData", [createStakeResponse.result, fee / LAMPORTS_IN_SOL]);
      commit("updateStakingLoadingState", false);
    } catch (e: any) {
      commit("updateStakingLoadingState", false);
      commit("setError", e?.message);
    }
  },

  async startStakeAction ({ state, commit, rootGetters }: { 
    state: StakingState,
    commit: Commit,
    rootGetters: any,
  }, signedTransaction: string) {
    commit("updateLoadingState", true);
    const chain = rootGetters[SharedTypes.CHAIN_GETTER];
    const network = rootGetters[SharedTypes.NETWORK_GETTER];

    try {
      if (state.stakingData) {
        const txPayload: SendTransactionRequest = {
          signedTransaction,
        }
        const sendTxResponse = await sendTransaction(txPayload, chain, network);

        if (sendTxResponse?.error) {
          console.error(`API request failed with status: ${sendTxResponse?.error}`);
          throw new Error("Something went wrong");
        }
        
        commit("setTxId", sendTxResponse.result.transactionId);
        const txStatus = await walletService.getTxStatus(sendTxResponse.result.transactionId);
        commit("updateLoadingState", false);
        return txStatus;
      } else {
        throw new Error("Something went wrong");
      }
    } catch (e: any) {
      commit("updateLoadingState", false);
      commit("setError", e?.message);
    }
  },

  async setDeactivatingStakeAction ({ state, commit, rootGetters }: { 
    state: StakingState,
    commit: Commit,
    rootGetters: any,
  }, index: number ) {
    const chain = rootGetters[SharedTypes.CHAIN_GETTER];
    commit("setDeactivatingStake", state.portfolio[chain].items[index]);
  },

  async setWithdrawStakeAction ({ state, commit, rootGetters }: { 
    state: StakingState,
    commit: Commit,
    rootGetters: any,
  }, index: number ) {
    const chain = rootGetters[SharedTypes.CHAIN_GETTER];
    commit("setWithdrawStake", state.portfolio[chain].items[index]);
  },

  async deactivateStakeAction ({ commit, rootGetters }: { 
    dispatch: Dispatch,
    commit: Commit,
    rootGetters: any,
  }, [accountAddress, stakeAccount]: [string, string] ) {
    try {
      commit("updateLoadingState", true);
      const chain = rootGetters[SharedTypes.CHAIN_GETTER];
      const network = rootGetters[SharedTypes.NETWORK_GETTER];
      const payload: StakeDeactivateRequest = {
        feePayer: accountAddress,
        stakeAuthority: accountAddress,
        stakeAccount
      };

      const createStakeResponse = await stakeDeactivate(payload, chain, network);

      if (createStakeResponse?.error) {
        console.error(`API request failed with status: ${createStakeResponse?.error}`);
        throw new Error("Something went wrong");
      }

      const tx = Transaction.from(Buffer.from(createStakeResponse.result.unsignedTransaction, 'base64'));
      const fee = await walletService.getTransactionFee(tx) as number;
      commit("setDeactivatingData", [createStakeResponse.result, fee / LAMPORTS_IN_SOL]);
      commit("updateLoadingState", false);
    } catch (e: any) {
      commit("updateLoadingState", false);
      commit("setError", e?.message);
    }
  },

  async startDeactivateStakeAction ({ state, commit, rootGetters }: { 
    state: StakingState,
    commit: Commit,
    rootGetters: any,
  }, [signedTransaction, stakeAccount]: [string, string]) {
    try {
      commit("updateLoadingState", true);
      const chain = rootGetters[SharedTypes.CHAIN_GETTER];
      const network = rootGetters[SharedTypes.NETWORK_GETTER];

      if (state.deactivatingData) {
        const txPayload: SendTransactionRequest = {
          signedTransaction,
        }
        const sendTxResponse = await sendTransaction(txPayload, chain, network);

        if (sendTxResponse?.error) {
          console.error(`API request failed with status: ${sendTxResponse?.error}`);
          throw new Error("Something went wrong");
        }
        
        commit("setTxId", sendTxResponse.result.transactionId);
        commit("disablePortfolioItem", stakeAccount);
        const txStatus = await walletService.getTxStatus(sendTxResponse.result.transactionId);

        commit("updateLoadingState", false);
        return txStatus;
      } else {
        throw new Error("Something went wrong");
      }
    } catch (e: any) {
      commit("updateLoadingState", false);
      commit("setError", e?.message);
    }
  },

  async withdrawStakeAction ({ commit, rootGetters }: { 
    dispatch: Dispatch,
    commit: Commit,
    rootGetters: any,
  }, [accountAddress, stakeAccount, amount]: [string, string, string] ) {
    try {
      commit("updateLoadingState", true);
      const chain = rootGetters[SharedTypes.CHAIN_GETTER];
      const network = rootGetters[SharedTypes.NETWORK_GETTER];
      const payload: StakeWithdrawRequest = {
        feePayer: accountAddress,
        withdrawAuthority: accountAddress,
        stakeAccount,
        recipient: accountAddress,
        amount,
      };
  
      const createStakeResponse = await stakeWithdraw(payload, chain, network);

      if (createStakeResponse?.error) {
        console.error(`API request failed with status: ${createStakeResponse?.error}`);
        throw new Error("Something went wrong");
      }
      
      const tx = Transaction.from(Buffer.from(createStakeResponse.result.unsignedTransaction, 'base64'));
      const fee = await walletService.getTransactionFee(tx) as number;
      commit("setWithdrawData", [createStakeResponse.result, fee / LAMPORTS_IN_SOL]);
      commit("updateLoadingState", false);
    } catch (e: any) {
      commit("updateLoadingState", false);
      commit("setError", e?.message);
    }
  },

  async startWithdrawStakeAction ({ state, commit, rootGetters }: { 
    state: StakingState,
    commit: Commit,
    rootGetters: any,
  }, [signedTransaction, stakeAccount]: [string, string]) {
    commit("updateLoadingState", true);
    try {
      const chain = rootGetters[SharedTypes.CHAIN_GETTER];
      const network = rootGetters[SharedTypes.NETWORK_GETTER];
      if (state.withdrawData) {
        const txPayload: SendTransactionRequest = {
          signedTransaction,
        }
        const sendTxResponse = await sendTransaction(txPayload, chain, network);

        if (sendTxResponse?.error) {
          console.error(`API request failed with status: ${sendTxResponse?.error}`);
          throw new Error("Something went wrong");
        }
        
        commit("setTxId", sendTxResponse.result.transactionId);
        commit("disablePortfolioItem", stakeAccount);
        const txStatus = await walletService.getTxStatus(sendTxResponse.result.transactionId);
        commit("updateLoadingState", false);

        return txStatus;
      } else {
        throw new Error("Something went wrong");
      }
    } catch (e: any) {
      commit("updateLoadingState", false);
      commit("setError", e?.message);
    }
  },

  async loadStakingAccounts ({ state, commit, rootGetters, dispatch }: {
    state: StakingState,
    commit: Commit,
    rootGetters: any,
    dispatch: Dispatch,
  }, accountAddress: string ) {
    const chain = rootGetters[SharedTypes.CHAIN_GETTER];
    const network = rootGetters[SharedTypes.NETWORK_GETTER];
    const account = rootGetters[SharedTypes.WALLET_ACCOUNT_GETTER];

    try {
      if (account) {
        const payload: GetStakingAccountRequest = {
          stakeAuthorities: [accountAddress],
          withdrawAuthorities: [accountAddress],
        };
        let totalStaked = 0, totalRewards = 0;
        const stakingData = getStorageStakingData();
        if (stakingData) {
          if (Object.keys(state.portfolio).length === 0) {
            const data = JSON.parse(stakingData) as PortfolioByChain;
            commit("setStakingAccounts", [data, chain]);
          }
        } else {
          commit("updateLoadingState", true);
        }
        const stakingAccountsResponse = await getStakingAccount(payload, chain, network);
        const items = [];

        if (stakingAccountsResponse.result.accounts.length > 0) {
          for(const acc of stakingAccountsResponse.result.accounts) {
            const stakeAmount = acc.amount;
            totalStaked += stakeAmount;

            const delegatorRewards =  await getDelegatorRewards(chain, acc.stakeAccount);
            let rewardSum = 0;
            if (delegatorRewards.result.list.length > 0) {
              for(const item of delegatorRewards.result.list) {
                const listReward = item.rewards.reduce((accumulator, current) => accumulator + current.amount, 0);
                rewardSum += listReward;
              }
              totalRewards += rewardSum;
            }

            const accInState = state.portfolio[chain].items.find((item) => {
              return item.stakeAccount === acc.stakeAccount;
            })

            const item: PortfolioItem = {
              balance: stakeAmount,
              reward: rewardSum,
              status: acc.status,
              stakeAccount: acc.stakeAccount,
              stakeAuthority: acc.stakeAuthority,
              voteAccount: acc.voteAccount,
              withdrawAuthority: acc.withdrawAuthority,
              provider: Providers.p2p,
              chain: chain,
              isEnabled: accInState && acc.status === accInState.status ? accInState.isEnabled : true,
            }
      
            items.push(item);
          }
          items.sort((a, b) => a.balance - b.balance);

          const portfolioByChain: PortfolioByChain = {
            items,
            totalStaked,
            totalRewards,
            avgRewards: 0,
            baseToken: BASE_TOKENS[chain],
          };
      
          saveStorageStakingAccounts(portfolioByChain);
          
          commit("setStakingAccounts", [portfolioByChain, chain]);
        }
      } else {
        localStorage.removeItem("staking_accounts");
        commit("emptyPortfolio");
      }
      setTimeout(async () => {
        await dispatch("loadStakingAccounts", accountAddress);
      }, 15000);
    } catch (e) {
      console.error(`API request failed with status: ${e}`);
      setTimeout(async () => {
        await dispatch("loadStakingAccounts", accountAddress);
      }, 15000);
    }
    commit("updateLoadingState", false);
  },

  async emptyStakingAccountsAction ({ commit }: {
    commit: Commit,
  }) {
    localStorage.removeItem("staking_accounts");
    commit("emptyPortfolio");
  },

  async updateStakingAction ({ commit }: {
    commit: Commit,
  }, [chain, networkAPR]: [string, string] ) {
    commit("updateStakingData", [chain, networkAPR]);
  },

  async updateValidatorAction ({ commit }: {
    commit: Commit,
  }, [provider, chain, apy, fee]: [string, string, string, string] ) {
    commit("updateValidatorData", [provider, chain, apy, fee]);
  },

  async setErrorState ({ commit } : {
    commit: Commit
  }, state: string) {
    commit("setError", state);
  }
};
