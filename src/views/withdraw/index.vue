<template>
  <white-wrapper v-if="!isSend" class="withdraw__wrap">
    <div class="withdraw__stack">
      <inner-page-header title="Withdraw" @back="back" />

      <div class="withdraw__block">
        <withdraw-validator  :validator="p2p" />
        <withdraw-amount :token="nativeToken" :amount="amount" />      
      </div>

      <div class="withdraw__arrow">
        <arrow-down-big />
      </div>

      <div class="withdraw__block">
        <withdraw-account
            :account="fromAccount"
            title="To"
            :amount="availableBalance"
          />
      </div>

      <withdraw-fee :fee="fee" />
    </div>

    <buttons-block :is-space="true">
      <div class="withdraw__close">
        <Switch :is-checked="isCloseAccount" @update:check="updateCloseAccount" />
        <p>Close my staking account</p>
        <info-tooltip
          text="You can safely close this account if you don't need access to the rewards history."
          :is-big-icon="true"
        />
      </div>
      
      <base-button
        :title="`Withdraw ${$filters.cryptoCurrencyFormat(
          amount
        )} ${nativeToken.symbol.toLocaleUpperCase()}`"
        :action="nextAction"
        :disabled="isLoading"
        :send="true"
      />
    </buttons-block>
  </white-wrapper>

  <white-wrapper v-else class="withdraw__wrap">
    <withdraw-process :is-done="isSendDone" :is-error="isError" />
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import Switch from "@/components/switch/index.vue";
import InfoTooltip from "@/components/info-tooltip/index.vue";
import InnerPageHeader from "@/components/inner-page-header/index.vue";
import WithdrawAmount from "./components/withdraw-amount.vue";
import WithdrawAccount from "./components/withdraw-account.vue";
import WithdrawFee from "./components/withdraw-fee.vue";
import WithdrawValidator from "./components/withdraw-validator.vue";
import WithdrawProcess from "./components/withdraw-process.vue";
import ArrowDownBig from "@/icons/common/arrow-down-big.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Token } from "@/types/token";
import { solana, fee, fromAccount, p2p } from "@/types/mock";

const router = useRouter();

const amount = ref<number>(40);
const availableBalance = ref<number>(40);
const isLoading = ref<boolean>(false);
const isSend = ref<boolean>(false);
const isSendDone = ref<boolean>(false);
const isError = ref<boolean>(false);
const nativeToken = ref<Token>(solana)
const isCloseAccount = ref<boolean>(true);

const nextAction = async () => {
  isSend.value = true

  setTimeout(() => {
    isSendDone.value = true
  }, 5000)
};

const back = () => {
  router.go(-1);
};

const updateCloseAccount = () => {
  isCloseAccount.value = !isCloseAccount.value
};
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
