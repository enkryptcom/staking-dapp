import { Buffer } from "buffer";
import { ethers, utils } from "ethers";
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
  Chains,
  CreateStakeRequest,
  GetStakingAccountRequest,
  SendTransactionRequest,
  PortfolioItem,
  Providers,
  PortfolioByChain,
  StakeDeactivateRequest,
  StakeWithdrawRequest,
  Statuses,
} from "@/core/interfaces";
import { Transaction } from "@solana/web3.js";
import WalletService from "@/core/services/walletService";
import EvmWalletService from "@/core/services/evmWalletService";
import { SharedTypes } from "@/store/shared/consts";
import { BASE_TOKENS, LAMPORTS_IN_SOL, ROOTSTOCK_BACKER_MANAGER_ABI, ROOTSTOCK_BACKER_MANAGER_ADDRESS, ROOTSTOCK_BUILDER_REGISTRY_ABI, ROOTSTOCK_BUILDER_REGISTRY_ADDRESS, ROOTSTOCK_GAUGE_ABI, ROOTSTOCK_RBTC_TOKEN_ADDRESS, ROOTSTOCK_REWARD_DISTRIBUTOR_ABI, ROOTSTOCK_REWARD_DISTRIBUTOR_ADDRESS, ROOTSTOCK_RIF_TOKEN_ADDRESS, ROOTSTOCK_STRIF_TOKEN_ADDRESS, RIF_TOKEN_ABI, SOL_FEE, STRIF_TOKEN_ABI } from "@/core/constants";
import { deleteStorageStakingData, getStorageStakingData, saveStorageStakingAccounts } from "@/utils/storage";

import { StakingState } from "./mutations";

const walletService = WalletService.getInstance();
const evmWalletService = EvmWalletService.getInstance();
let portfolioUpdateTimeout: ReturnType<typeof setTimeout> | undefined;
const ROOTSTOCK_REWARD_DECIMALS = 18;
const ROOTSTOCK_ALLOCATION_DECIMALS = 18;

const ROOTSTOCK_REWARD_ASSETS = [
  { symbol: "rbtc", address: ROOTSTOCK_RBTC_TOKEN_ADDRESS },
  { symbol: "rif", address: ROOTSTOCK_RIF_TOKEN_ADDRESS },
];

function getBackerRewardPercentage(
  previous: ethers.BigNumber,
  next: ethers.BigNumber,
  cooldownEndTime: ethers.BigNumber,
  timestampInSeconds?: number
) {
  const currentTimestamp = timestampInSeconds ?? Math.floor(Date.now() / 1000);
  const cooldownTimestamp = cooldownEndTime.toNumber();
  const current = currentTimestamp < cooldownTimestamp ? previous : next;

  return {
    current,
    next,
    cooldownEndTime,
  };
}

async function allocateRootstockBuilders(
  signer: ethers.Signer,
  accountAddress: string
): Promise<string | null> {
  const provider = signer.provider;
  if (!provider) {
    throw new Error("EVM provider not found");
  }

  const registryContract = new ethers.Contract(
    ROOTSTOCK_BUILDER_REGISTRY_ADDRESS,
    ROOTSTOCK_BUILDER_REGISTRY_ABI,
    provider
  );
  const rewardDistributorContract = new ethers.Contract(
    ROOTSTOCK_REWARD_DISTRIBUTOR_ADDRESS,
    ROOTSTOCK_REWARD_DISTRIBUTOR_ABI,
    provider
  );
  const backerManagerContract = new ethers.Contract(
    ROOTSTOCK_BACKER_MANAGER_ADDRESS,
    ROOTSTOCK_BACKER_MANAGER_ABI,
    signer
  );
  const stRifContract = new ethers.Contract(
    ROOTSTOCK_STRIF_TOKEN_ADDRESS,
    STRIF_TOKEN_ABI,
    provider
  );

  await Promise.all([
    rewardDistributorContract.defaultRifAmount(),
    rewardDistributorContract.defaultNativeAmount(),
    backerManagerContract.totalPotentialReward(),
    backerManagerContract.backerTotalAllocation(accountAddress),
  ]);

  const [activeLength, haltedLength] = await Promise.all([
    registryContract.getGaugesLength(),
    registryContract.getHaltedGaugesLength(),
  ]);

  const activeLen = Number(activeLength.toString()) ?? 0;
  const haltedLen = Number(haltedLength.toString()) ?? 0;

  const activeGauges = await Promise.all(
    Array.from({ length: activeLen }, (_, index) => registryContract.getGaugeAt(index))
  );
  const haltedGauges = await Promise.all(
    Array.from({ length: haltedLen }, (_, index) => registryContract.getHaltedGaugeAt(index))
  );
  const gauges = [...activeGauges, ...haltedGauges];
  if (!gauges.length) {
    return null;
  }

  const builders = await Promise.all(
    gauges.map((gauge: string) => registryContract.gaugeToBuilder(gauge))
  );

  const backerRewardPercentageRaw = await Promise.all(
    builders.map((builder: string) => registryContract.backerRewardPercentage(builder))
  );

  const myCurrentAllocation = await Promise.all(
    gauges.map((gauge: string) => {
      const contract = new ethers.Contract(gauge, ROOTSTOCK_GAUGE_ABI, provider);
      return contract.allocationOf(accountAddress);
    })
  );


  const buildersList = builders.map((builder: string, index: number) => {
    const backerRewardPercentage = getBackerRewardPercentage(
      backerRewardPercentageRaw[index].previous,
      backerRewardPercentageRaw[index].next,
      backerRewardPercentageRaw[index].cooldownEndTime
    );
    const backerRewardShare = 100 * Number(
      ethers.utils.formatUnits(
        (backerRewardPercentage?.current ?? 0).toString(),
        ROOTSTOCK_REWARD_DECIMALS
      )
    );

    return {
      builderAddress: builder,
      backerRewardShare,
      myAllocation: myCurrentAllocation[index] as ethers.BigNumber,
      gauge: gauges[index],
    };
  });

  let topBuilders = buildersList
    .slice()
    .sort((a, b) => b.backerRewardShare - a.backerRewardShare)
    .slice(0, 5);

  const myStRifBalance = await stRifContract.balanceOf(accountAddress);
  const totalAllocated = myCurrentAllocation.reduce(
    (acc: ethers.BigNumber, allocation: ethers.BigNumber) => acc.add(allocation),
    ethers.constants.Zero
  );
  const availableAllocation = myStRifBalance.gt(totalAllocated)
    ? myStRifBalance.sub(totalAllocated)
    : ethers.constants.Zero;
  const minAllocation = ethers.utils.parseUnits("1", ROOTSTOCK_ALLOCATION_DECIMALS);

  if (availableAllocation.gt(0) && topBuilders.length) {
    const newAlloc = availableAllocation.div(topBuilders.length);

    if (newAlloc.gte(minAllocation)) {
      topBuilders = topBuilders.map((builder) => ({
        ...builder,
        myAllocation: builder.myAllocation.add(newAlloc),
      }));
    } else {
      topBuilders[0] = {
        ...topBuilders[0],
        myAllocation: topBuilders[0].myAllocation.add(newAlloc),
      };
    }
  }

  const buildersWithAllocs = topBuilders.filter((builder) => builder.myAllocation.gt(0));
  if (!buildersWithAllocs.length) {
    return null;
  }

  const tx = await backerManagerContract.allocateBatch(
    buildersWithAllocs.map((builder) => builder.gauge),
    buildersWithAllocs.map((builder) => builder.myAllocation)
  );

  const receipt = await tx.wait();
  return receipt?.transactionHash ?? tx.hash ?? null;
}

async function deAllocateRootstockBuilders(
  signer: ethers.Signer,
  accountAddress: string
): Promise<string | null> {
  const provider = signer.provider;
  if (!provider) {
    throw new Error("EVM provider not found");
  }

  const registryContract = new ethers.Contract(
    ROOTSTOCK_BUILDER_REGISTRY_ADDRESS,
    ROOTSTOCK_BUILDER_REGISTRY_ABI,
    provider
  );
  const rewardDistributorContract = new ethers.Contract(
    ROOTSTOCK_REWARD_DISTRIBUTOR_ADDRESS,
    ROOTSTOCK_REWARD_DISTRIBUTOR_ABI,
    provider
  );
  const backerManagerContract = new ethers.Contract(
    ROOTSTOCK_BACKER_MANAGER_ADDRESS,
    ROOTSTOCK_BACKER_MANAGER_ABI,
    signer
  );

  await Promise.all([
    rewardDistributorContract.defaultRifAmount(),
    rewardDistributorContract.defaultNativeAmount(),
    backerManagerContract.totalPotentialReward(),
    backerManagerContract.backerTotalAllocation(accountAddress),
  ]);

  const [activeLength, haltedLength] = await Promise.all([
    registryContract.getGaugesLength(),
    registryContract.getHaltedGaugesLength(),
  ]);

  const activeLen = Number(activeLength.toString()) ?? 0;
  const haltedLen = Number(haltedLength.toString()) ?? 0;

  const activeGauges = await Promise.all(
    Array.from({ length: activeLen }, (_, index) => registryContract.getGaugeAt(index))
  );
  const haltedGauges = await Promise.all(
    Array.from({ length: haltedLen }, (_, index) => registryContract.getHaltedGaugeAt(index))
  );
  const gauges = [...activeGauges, ...haltedGauges];
  if (!gauges.length) {
    return null;
  }

  const builders = await Promise.all(
    gauges.map((gauge: string) => registryContract.gaugeToBuilder(gauge))
  );

  const myCurrentAllocation = await Promise.all(
    gauges.map((gauge: string) => {
      const contract = new ethers.Contract(gauge, ROOTSTOCK_GAUGE_ABI, provider);
      return contract.allocationOf(accountAddress);
    })
  );


  const buildersList = builders.map((builder: string, index: number) => {

    return {
      builderAddress: builder,
      myAllocation: myCurrentAllocation[index] as ethers.BigNumber,
      gauge: gauges[index],
    };
  });

  const buildersWithAllocs = buildersList.filter((builder) => builder.myAllocation.gt(0));
  if (!buildersWithAllocs.length) {
    return null;
  }

  const tx = await backerManagerContract.allocateBatch(
    buildersWithAllocs.map((builder) => builder.gauge),
    buildersWithAllocs.map((builder) => builder.myAllocation)
  );

  const receipt = await tx.wait();
  return receipt?.transactionHash ?? tx.hash ?? null;
}

async function claimRootstockRewards(
  signer: ethers.Signer,
  accountAddress: string
): Promise<string | null> {
  const provider = signer.provider;
  if (!provider) {
    throw new Error("EVM provider not found");
  }

  const registryContract = new ethers.Contract(
    ROOTSTOCK_BUILDER_REGISTRY_ADDRESS,
    ROOTSTOCK_BUILDER_REGISTRY_ABI,
    provider
  );
  const backerManagerContract = new ethers.Contract(
    ROOTSTOCK_BACKER_MANAGER_ADDRESS,
    ROOTSTOCK_BACKER_MANAGER_ABI,
    signer
  );

  const [activeLength, haltedLength] = await Promise.all([
    registryContract.getGaugesLength(),
    registryContract.getHaltedGaugesLength(),
  ]);

  const activeLen = Number(activeLength.toString()) ?? 0;
  const haltedLen = Number(haltedLength.toString()) ?? 0;

  const activeGauges = await Promise.all(
    Array.from({ length: activeLen }, (_, index) => registryContract.getGaugeAt(index))
  );
  const haltedGauges = await Promise.all(
    Array.from({ length: haltedLen }, (_, index) => registryContract.getHaltedGaugeAt(index))
  );
  const gauges = [...activeGauges, ...haltedGauges];
  if (!gauges.length) {
    return null;
  }

  const myCurrentAllocation = await Promise.all(
    gauges.map((gauge: string) => {
      const contract = new ethers.Contract(gauge, ROOTSTOCK_GAUGE_ABI, provider);
      return contract.allocationOf(accountAddress);
    })
  );

  const gaugesWithAllocs = gauges.filter((_, index) => myCurrentAllocation[index].gt(0));
  if (!gaugesWithAllocs.length) {
    return null;
  }

  const tx = await backerManagerContract.claimBackerRewards(gaugesWithAllocs);
  const receipt = await tx.wait();
  return receipt?.transactionHash ?? tx.hash ?? null;
}

async function loadRootstockTotalRewards(provider: ethers.providers.Provider, accountAddress: string, prices: Record<string, number>) {
  const registryContract = new ethers.Contract(
    ROOTSTOCK_BUILDER_REGISTRY_ADDRESS,
    ROOTSTOCK_BUILDER_REGISTRY_ABI,
    provider,
  );

  const [activeLength, haltedLength] = await Promise.all([
    registryContract.getGaugesLength(),
    registryContract.getHaltedGaugesLength(),
  ]);

  const activeLen = Number(activeLength.toString()) ?? 0;
  const haltedLen = Number(haltedLength.toString()) ?? 0;

  const activeGauges = await Promise.all(
    Array.from({ length: activeLen }, (_, index) => registryContract.getGaugeAt(index))
  );
  const haltedGauges = await Promise.all(
    Array.from({ length: haltedLen }, (_, index) => registryContract.getHaltedGaugeAt(index))
  );

  const gauges = [...activeGauges, ...haltedGauges];
  if (!gauges.length) {
    return 0;
  }

  let totalEarnedUsd = 0;
  for (const asset of ROOTSTOCK_REWARD_ASSETS) {
    const price = prices?.[asset.symbol] ?? 0;
    if (!price) {
      continue;
    }

    const earnedValues = await Promise.all(
      gauges.map((gauge: string) => {
        const contract = new ethers.Contract(gauge, ROOTSTOCK_GAUGE_ABI, provider);
        return contract.earned(asset.address, accountAddress);
      })
    );

    const earnedAmount = earnedValues
      .map((value: ethers.BigNumber) => ethers.utils.formatUnits(value, ROOTSTOCK_REWARD_DECIMALS))
      .reduce((acc: number, earned: string) => acc + Number(earned), 0);

    totalEarnedUsd += earnedAmount * price;
  }

  const rifPrice = prices?.rif ?? 0;
  if (!rifPrice) {
    return 0;
  }

  return totalEarnedUsd / rifPrice;
}

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

      if (chain === Chains.ROOTSTOCK) {
        commit("setStakingData", [null, 0]);
        commit("updateStakingLoadingState", false);
        return;
      }

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
  }, signedTransaction: string | null) {
    commit("updateLoadingState", true);
    const chain = rootGetters[SharedTypes.CHAIN_GETTER];
    const network = rootGetters[SharedTypes.NETWORK_GETTER];
    const walletAccount = rootGetters[SharedTypes.WALLET_ACCOUNT_GETTER];

    try {
      if (chain === Chains.ROOTSTOCK) {
        commit("resetRootstockStakeFlowSteps");

        if (!walletAccount?.address) {
          throw new Error("Wallet account not found");
        }

        if (!state.stakingAmount) {
          throw new Error("Staking amount is not defined");
        }

        const provider = evmWalletService.getWeb3Provider();
        if (!provider) {
          throw new Error("EVM wallet is not connected");
        }

        const signer = provider.getSigner();
        const parsedAmount = ethers.utils.parseEther(state.stakingAmount);

        if (parsedAmount.lte(0)) {
          throw new Error("Staking amount should be greater than zero");
        }

        const rifContract = new ethers.Contract(ROOTSTOCK_RIF_TOKEN_ADDRESS, RIF_TOKEN_ABI, signer);
        const stRifContract = new ethers.Contract(ROOTSTOCK_STRIF_TOKEN_ADDRESS, STRIF_TOKEN_ABI, signer);
        const rifBalance = await rifContract.balanceOf(walletAccount.address);

        if (rifBalance.lt(parsedAmount)) {
          throw new Error("You don't have enough RIF for staking");
        }

        commit("setRootstockStakeFlowStep", ["approve", "in_progress"]);
        const approveTx = await rifContract.approve(ROOTSTOCK_STRIF_TOKEN_ADDRESS, parsedAmount);
        await approveTx.wait();
        commit("setRootstockStakeFlowStep", ["approve", "done"]);

        commit("setRootstockStakeFlowStep", ["stake", "in_progress"]);
        const stakeTx = await stRifContract.depositAndDelegate(walletAccount.address, parsedAmount);
        const receipt = await stakeTx.wait();
        commit("setRootstockStakeFlowStep", ["stake", "done"]);

        commit("setRootstockStakeFlowStep", ["backBuilders", "in_progress"]);
        const allocationTxId = await allocateRootstockBuilders(signer, walletAccount.address);
        commit("setRootstockStakeFlowStep", ["backBuilders", "done"]);
        commit("setTxId", allocationTxId ?? receipt?.transactionHash ?? stakeTx.hash);
        commit("updateLoadingState", false);
        return receipt;
      }

      if (state.stakingData) {
        if (!signedTransaction) {
          throw new Error("Signed transaction is required");
        }
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

  async claimRootstockRewardsAction ({ commit, rootGetters, dispatch }: { 
    commit: Commit,
    rootGetters: any,
    dispatch: Dispatch,
  }) {
    commit("updateLoadingState", true);
    const chain = rootGetters[SharedTypes.CHAIN_GETTER];
    const walletAccount = rootGetters[SharedTypes.WALLET_ACCOUNT_GETTER];

    try {
      if (chain !== Chains.ROOTSTOCK) {
        throw new Error("Rootstock rewards are not available on this network");
      }

      if (!walletAccount?.address) {
        throw new Error("Wallet account not found");
      }

      const provider = evmWalletService.getWeb3Provider();
      if (!provider) {
        throw new Error("EVM wallet is not connected");
      }

      const signer = provider.getSigner();
      const txId = await claimRootstockRewards(signer, walletAccount.address);
      if (txId) {
        commit("setTxId", txId);
      }
      await dispatch("loadStakingAccounts", walletAccount.address);
    } catch (e: any) {
      commit("setError", e?.message);
    } finally {
      commit("updateLoadingState", false);
    }
  },

  async setDeactivatingStakeAction ({ state, commit, rootGetters }: { 
    state: StakingState,
    commit: Commit,
    rootGetters: any,
  }, index: number ) {
    const chain = rootGetters[SharedTypes.CHAIN_GETTER];
    commit("setDeactivatingStake", state?.portfolio[chain]?.items[index]);
  },

  async setWithdrawStakeAction ({ state, commit, rootGetters }: { 
    state: StakingState,
    commit: Commit,
    rootGetters: any,
  }, index: number ) {
    const chain = rootGetters[SharedTypes.CHAIN_GETTER];
    commit("setWithdrawStake", state?.portfolio[chain]?.items[index]);
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

  async rootstockUnstakeAction ({ commit, rootGetters, dispatch }: {
    commit: Commit,
    rootGetters: any,
    dispatch: Dispatch,
  }, amount: number) {
    try {
      commit("updateLoadingState", true);
      const chain = rootGetters[SharedTypes.CHAIN_GETTER];
      const walletAccount = rootGetters[SharedTypes.WALLET_ACCOUNT_GETTER];

      if (chain !== Chains.ROOTSTOCK) {
        throw new Error("Rootstock unstake action is not available on this network");
      }

      if (!walletAccount?.address) {
        throw new Error("Wallet account not found");
      }

      if (!amount || amount <= 0) {
        throw new Error("Nothing to unstake");
      }

      const provider = evmWalletService.getWeb3Provider();
      if (!provider) {
        throw new Error("EVM wallet is not connected");
      }

      const signer = provider.getSigner();
      const stRifContract = new ethers.Contract(ROOTSTOCK_STRIF_TOKEN_ADDRESS, STRIF_TOKEN_ABI, signer);
      const parsedAmount = ethers.utils.parseEther(amount.toString());

      await deAllocateRootstockBuilders(signer, walletAccount.address);
      
      const withdrawTx = await stRifContract.withdrawTo(walletAccount.address, parsedAmount);
      const receipt = await withdrawTx.wait();

      commit("setTxId", receipt?.transactionHash ?? withdrawTx.hash);
      commit("updateLoadingState", false);
      await dispatch("loadStakingAccounts", walletAccount.address);

      return receipt;
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
      if (chain === Chains.ROOTSTOCK) {
        try {
          if (account) {
            commit("updateLoadingState", true);
            const provider = evmWalletService.getRpcProvider();
            const stRifContract = new ethers.Contract(ROOTSTOCK_STRIF_TOKEN_ADDRESS, STRIF_TOKEN_ABI, provider);
            const stakedBalance = await stRifContract.balanceOf(accountAddress);
            const formattedBalance = Number(ethers.utils.formatEther(stakedBalance));
            const prices = rootGetters[SharedTypes.PRICE_GETTER] ?? {};
            let totalRewards = 0;
            try {
              totalRewards = await loadRootstockTotalRewards(provider, accountAddress, prices);
            } catch (error) {
              console.error(`Failed to load Rootstock rewards: ${error}`);
            }

            if (formattedBalance > 0) {
              const rootstockItem: PortfolioItem = {
                balance: formattedBalance,
                reward: totalRewards,
                status: Statuses.ACTIVE,
                stakeAccount: accountAddress,
                stakeAuthority: accountAddress,
                voteAccount: "",
                withdrawAuthority: accountAddress,
                provider: Providers.p2p,
                chain,
                isEnabled: true,
              };

              const portfolioByChain: PortfolioByChain = {
                items: [rootstockItem],
                totalStaked: formattedBalance,
                totalRewards,
                avgRewards: 0,
                baseToken: BASE_TOKENS[chain],
              };

              commit("setStakingAccounts", [portfolioByChain, chain]);
            } else {
              deleteStorageStakingData();
              commit("emptyPortfolio");
            }
          } else {
            deleteStorageStakingData();
            commit("emptyPortfolio");
          }
        } catch (error) {
          console.error(`Failed to load Rootstock staking data: ${error}`);
        }

        portfolioUpdateTimeout = setTimeout(async () => {
          await dispatch("loadStakingAccounts", accountAddress);
        }, 15000);
        commit("updateLoadingState", false);
        return;
      }

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

        if (stakingAccountsResponse?.result?.accounts?.length > 0) {
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

            const accInState = state?.portfolio[chain]?.items.find((item) => {
              return item.stakeAccount === acc.stakeAccount;
            });

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
        } else {
          deleteStorageStakingData();
          commit("emptyPortfolio");
        }
      } else {
        localStorage.removeItem("staking_accounts");
        commit("emptyPortfolio");
      }
      portfolioUpdateTimeout = setTimeout(async () => {
        await dispatch("loadStakingAccounts", accountAddress);
      }, 15000);
    } catch (e) {
      console.error(`API request failed with status: ${e}`);
      portfolioUpdateTimeout = setTimeout(async () => {
        await dispatch("loadStakingAccounts", accountAddress);
      }, 15000);
    }
    commit("updateLoadingState", false);
  },

  async emptyStakingAccountsAction ({ commit }: {
    commit: Commit,
  }) {
    if (portfolioUpdateTimeout) {
      clearTimeout(portfolioUpdateTimeout);
      portfolioUpdateTimeout = undefined;
    }
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
