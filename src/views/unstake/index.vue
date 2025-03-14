<template>
  <white-wrapper v-if="!isSend && deactivatingStake" class="unstake__wrap">
    <div class="unstake__stack">
      <inner-page-header title="Unstake" @back="back" />

      <div class="unstake__block">
        <unstake-validator :validator="validators[deactivatingStake.provider][deactivatingStake.chain]" />
        <unstake-amount :token="portfolioByChain.baseToken" :amount="deactivatingStake.balance / LAMPORTS_IN_SOL" />
      </div>

      <unstake-fee :fee="fee" />
    </div>

    <buttons-block>
      <base-button
        :title="`Unstake ${$filters.cryptoCurrencyFormat(
          deactivatingStake.balance / LAMPORTS_IN_SOL
        )} ${portfolioByChain.baseToken.symbol.toLocaleUpperCase()}`"
        :action="nextAction"
        :disabled="isLoading || isPreLoading"
        :loading="isPreLoading"
        :send="true"
      />
    </buttons-block>
  </white-wrapper>

  <white-wrapper v-else class="unstake__wrap">
    <unstake-process :is-done="isSendDone" :is-error="isError || !!error" />
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import InnerPageHeader from "@/components/inner-page-header/index.vue";
import UnstakeAmount from "./components/unstake-amount.vue";
import UnstakeFee from "./components/unstake-fee.vue";
import UnstakeValidator from "./components/unstake-validator.vue";
import UnstakeProcess from "./components/unstake-process.vue";
import { useRouter } from "vue-router";
import { StakingTypes } from "@/store/modules/staking/consts";
import { useStore } from "vuex";
import { SharedTypes } from "@/store/shared/consts";
import { ref, computed, onMounted } from "vue";
import { validators } from "@/core/constants";
import { useWallet } from "solana-wallets-vue";
import { Transaction } from "@solana/web3.js";
import { LAMPORTS_IN_SOL } from "@/core/constants";
import { Buffer } from "buffer";

const router = useRouter();
const store = useStore();
const wallet = useWallet();

const isLoading = ref<boolean>(false);
const isSend = ref<boolean>(false);
const isSendDone = ref<boolean>(false);
const isError = ref<boolean>(false);

const walletAccount = computed(() => store.getters[SharedTypes.WALLET_ACCOUNT_GETTER]);
const activeChain = computed(() => store.getters[SharedTypes.CHAIN_GETTER]);
const portfolioByChain = computed(() => store.getters[StakingTypes.PORTFOLIO_BY_CHAIN_GETTER](activeChain.value));
const deactivatingStake = computed(() => store.getters[StakingTypes.DEACTIVATING_STAKE_GETTER]);
const deactivatingData = computed(() => store.getters[StakingTypes.DEACTIVATING_DATA_GETTER]);
const error = computed(() => store.getters[StakingTypes.ERROR_GETTER]);
const fee = computed(() => store.getters[StakingTypes.DEACTIVATING_FEE_GETTER]);
const isPreLoading = computed(() => store.getters[StakingTypes.IS_LOADING_GETTER]);

onMounted(async () => {
  isLoading.value = true;
  try {
    if (deactivatingStake.value) {
      await store.dispatch(
        StakingTypes.DEACTIVATE_STAKE_ACTION, 
        [walletAccount.value.address, deactivatingStake.value.stakeAccount],
      );
    } else {
      router.push({ name: "portfolio" });
    }
  } catch (error) {
    console.error("Error fetching initial data:", error);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
});

const nextAction = async () => {
  isSend.value = true;

  try {
    const decodedTransaction = Buffer.from(deactivatingData.value.unsignedTransaction, 'base64');
    const transaction = Transaction.from(decodedTransaction);
    const signedTransaction = await wallet.signTransaction.value?.(transaction);
    const serializedTransaction = signedTransaction?.serialize();
    
    const base64Transaction = serializedTransaction?.toString('base64');
    const result = await store.dispatch(
      StakingTypes.START_DEACTIVATING_ACTION,
      [base64Transaction, deactivatingStake.value.stakeAccount],
    );
    if (result) {
      isSendDone.value = true;
    }
  } catch (error) {
    console.error("Error:", error);
    isError.value = true;
  }
};

const back = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.unstake {
  &__wrap {
    padding: 16px 32px;
    height: 500px;
    .sizing();
    display: flex;
    justify-content: space-between;
    align-items: start;
    flex-direction: column;

    .screen-sm({
      padding: 16px;
    });

    .base-button {
      .screen-sm({
        width: 100%;
        min-width: 100%;
      });
    }
  }

  &__stack {
    width: 100%;
  }

  &__header {
    position: relative;
  }

  &__block {
    background: @gray002;
    border-radius: 16px;
    .sizing();

    &-item {
      position: relative;

      &:last-child {
        &::after {
          display: none;
        }
      }
    }
  }

  &__arrow {
    padding: 8px 20px;
  }

  &__loading {
    padding: 48px 0 48px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
</style>
