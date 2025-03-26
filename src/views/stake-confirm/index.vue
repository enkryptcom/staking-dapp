<template>
  <white-wrapper v-if="!isSend" class="stake-confirm__wrap">
    <div class="stake-confirm__stack">
      <inner-page-header title="Review and confirm" @back="back" />

      <div class="stake-confirm__block">
        <div class="stake-confirm__block-item">
          <stake-confirm-account
            :account="walletAccount"
            title="From"
            :amount="walletBalance"
          />
        </div>

        <div class="stake-confirm__block-item">
          <stake-confirm-amount :token="nativeToken" :amount="amountValue" />
        </div>
      </div>

      <div class="stake-confirm__arrow">
        <arrow-down-big />
      </div>

      <div class="stake-confirm__block">
        <stake-confirm-validator-item :validator="validators[Providers.p2p][activeChain]" />
      </div>

      <stake-confirm-fee :fee="fee" />
    </div>

    <buttons-block>
      <base-button
        :title="`Stake ${$filters.cryptoCurrencyFormat(
          amountValue
        )} ${nativeToken.symbol.toLocaleUpperCase()}`"
        :action="nextAction"
        :disabled="isLoading"
        :send="true"
      />
    </buttons-block>
  </white-wrapper>

  <white-wrapper v-else class="stake-confirm__wrap">
    <stake-confirm-process :is-done="isSendDone" :is-error="isError || !!error" />
  </white-wrapper>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import InnerPageHeader from "@/components/inner-page-header/index.vue";
import StakeConfirmAmount from "./components/stake-confirm-amount.vue";
import StakeConfirmAccount from "./components/stake-confirm-account.vue";
import StakeConfirmFee from "./components/stake-confirm-fee.vue";
import StakeConfirmValidatorItem from "./components/stake-confirm-validator-item.vue";
import StakeConfirmProcess from "./components/stake-confirm-process.vue";
import ArrowDownBig from "@/icons/common/arrow-down-big.vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { SharedTypes } from "@/store/shared/consts";
import { StakingTypes } from "@/store/modules/staking/consts";
import { Chains, Providers, Token } from "@/core/interfaces";
import { BASE_TOKENS } from "@/core/constants";
import { useWallet } from "solana-wallets-vue";
import { Transaction } from "@solana/web3.js";
import { Buffer } from "buffer";

const router = useRouter();
const store = useStore();
const wallet = useWallet();

const isLoading = ref<boolean>(false);
const isSend = ref<boolean>(false);
const isSendDone = ref<boolean>(false);
const isError = ref<boolean>(false);
const nativeToken = ref<Token>(BASE_TOKENS[Chains.SOLANA]);

const walletBalance = computed(() => store.getters[SharedTypes.WALLET_BALANCE_GETTER]);
const amountValue = computed(() => store.getters[StakingTypes.STAKING_AMOUNT_GETTER]);
const walletAccount = computed(() => store.getters[SharedTypes.WALLET_ACCOUNT_GETTER]);
const stakingData = computed(() => store.getters[StakingTypes.STAKING_DATA_GETTER]);
const validators = computed(() => store.getters[StakingTypes.VALIDATORS_GETTER]);
const activeChain = computed(() => store.getters[SharedTypes.CHAIN_GETTER]);
const error = computed(() => store.getters[StakingTypes.ERROR_GETTER]);
const fee = computed(() => store.getters[StakingTypes.STAKING_FEE_GETTER]);

onMounted(async () => {
  if (amountValue.value === null) {
    back();
  }
});

const nextAction = async () => {
  isSend.value = true;

  try {
    const decodedTransaction = Buffer.from(stakingData.value.unsignedTransaction, 'base64');
    const transaction = Transaction.from(decodedTransaction);
    const signedTransaction = await wallet.signTransaction.value?.(transaction);
    const serializedTransaction = signedTransaction?.serialize();
    const base64Transaction = serializedTransaction?.toString('base64');

    const result = await store.dispatch(StakingTypes.START_STAKE_ACTION, base64Transaction);
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

.stake-confirm {
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
