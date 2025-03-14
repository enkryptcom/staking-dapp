<template>
  <white-wrapper v-if="!isSend && withdrawStake" class="withdraw__wrap">
    <div class="withdraw__stack">
      <inner-page-header title="Withdraw" @back="back" />

      <div class="withdraw__block">
        <withdraw-validator :validator="validators[withdrawStake.provider][withdrawStake.chain]" />
        <withdraw-amount :token="portfolioByChain.baseToken" :amount="withdrawStake.balance / LAMPORTS_IN_SOL" />   
      </div>

      <div class="withdraw__arrow">
        <arrow-down-big />
      </div>

      <div class="withdraw__block">
        <withdraw-account
            :account="walletAccount.address"
            title="To"
            :amount="walletBalance"
          />
      </div>

      <withdraw-fee :fee="fee" />
    </div>

    <buttons-block :is-space="true">
      <!-- functionality is not available in the P2P.org API -->
      <!-- <div class="withdraw__close">
        <Switch :is-checked="isCloseAccount" @update:check="updateCloseAccount" />
        <p>Close my staking account</p>
        <info-tooltip
          text="You can safely close this account if you don't need access to the rewards history."
          :is-big-icon="true"
        />
      </div> -->
      
      <base-button
        :title="`Withdraw ${$filters.cryptoCurrencyFormat(
          withdrawStake.balance / LAMPORTS_IN_SOL
        )} ${BASE_TOKENS[activeChain].symbol.toLocaleUpperCase()}`"
        :action="nextAction"
        :disabled="isLoading || isPreLoading"
        :loading="isPreLoading"
        :send="true"
      />
    </buttons-block>
  </white-wrapper>

  <white-wrapper v-else class="withdraw__wrap">
    <withdraw-process :is-done="isSendDone" :is-error="isError || !!error" />
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
// import Switch from "@/components/switch/index.vue";
// import InfoTooltip from "@/components/info-tooltip/index.vue";
import InnerPageHeader from "@/components/inner-page-header/index.vue";
import WithdrawAmount from "./components/withdraw-amount.vue";
import WithdrawAccount from "./components/withdraw-account.vue";
import WithdrawFee from "./components/withdraw-fee.vue";
import WithdrawValidator from "./components/withdraw-validator.vue";
import WithdrawProcess from "./components/withdraw-process.vue";
import ArrowDownBig from "@/icons/common/arrow-down-big.vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { StakingTypes } from "@/store/modules/staking/consts";
import { SharedTypes } from "@/store/shared/consts";
import { useStore } from "vuex";
import { BASE_TOKENS, validators } from "@/core/constants";
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
// const isCloseAccount = ref<boolean>(true);

const activeChain = computed(() => store.getters[SharedTypes.CHAIN_GETTER]);
const portfolioByChain = computed(() => store.getters[StakingTypes.PORTFOLIO_BY_CHAIN_GETTER](activeChain.value));
const withdrawStake = computed(() => store.getters[StakingTypes.WITHDRAW_STAKE_GETTER]);
const walletAccount = computed(() => store.getters[SharedTypes.WALLET_ACCOUNT_GETTER]);
const walletBalance = computed(() => store.getters[SharedTypes.WALLET_BALANCE_GETTER]);
const withdrawData = computed(() => store.getters[StakingTypes.WITHDRAW_DATA_GETTER]);
const isPreLoading = computed(() => store.getters[StakingTypes.IS_LOADING_GETTER]);
const error = computed(() => store.getters[StakingTypes.ERROR_GETTER]);
const fee = computed(() => store.getters[StakingTypes.WITHDRAW_FEE_GETTER]);

onMounted(async () => {
  isLoading.value = true;
  try {
    if (withdrawStake.value) {
      await store.dispatch(
        StakingTypes.WITHDRAW_STAKE_ACTION,
        [walletAccount.value.address, withdrawStake.value.stakeAccount, withdrawStake.value.balance],
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
    const decodedTransaction = Buffer.from(withdrawData.value.unsignedTransaction, 'base64');
    const transaction = Transaction.from(decodedTransaction);
    const signedTransaction = await wallet.signTransaction.value?.(transaction);
    const serializedTransaction = signedTransaction?.serialize();
    
    const base64Transaction = serializedTransaction?.toString('base64');
    const result = await store.dispatch(
      StakingTypes.START_WITHDRAW_ACTION,
      [base64Transaction, withdrawStake.value.stakeAccount]
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

// const updateCloseAccount = () => {
//   isCloseAccount.value = !isCloseAccount.value
// };
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.withdraw {
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

  &__close {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;

    .screen-sm({
      margin-bottom: 16px;
    });

    p {
      .body2__Regular();
      margin: 0 8px;
      color: @primaryLabel;
    }
  }
}
</style>
