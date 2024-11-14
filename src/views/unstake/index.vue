<template>
  <white-wrapper v-if="!isSend" class="unstake__wrap">
    <div class="unstake__stack">
      <inner-page-header title="Unstake" @back="back" />

      <div class="unstake__block">
        <unstake-validator :validator="p2p" />
        <unstake-amount :token="nativeToken" :amount="amount" />
      </div>

      <unstake-fee :fee="fee" />
    </div>

    <buttons-block>
      <base-button
        :title="`Unstake ${$filters.cryptoCurrencyFormat(
          amount
        )} ${nativeToken.symbol.toLocaleUpperCase()}`"
        :action="nextAction"
        :disabled="isLoading"
        :send="true"
      />
    </buttons-block>
  </white-wrapper>

  <white-wrapper v-else class="unstake__wrap">
    <unstake-process :is-done="isSendDone" :is-error="isError" />
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Token } from "@/types/token";
import { solana, fee, p2p } from "@/types/mock";

const router = useRouter();

const amount = ref<number>(40);
const isLoading = ref<boolean>(false);
const isSend = ref<boolean>(false);
const isSendDone = ref<boolean>(false);
const isError = ref<boolean>(false);
const nativeToken = ref<Token>(solana)

const nextAction = async () => {
  isSend.value = true

  setTimeout(() => {
    isSendDone.value = true
  }, 5000)
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
