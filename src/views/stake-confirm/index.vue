<template>
  <white-wrapper v-if="!isSend" class="stake-confirm__wrap">
    <div class="stake-confirm__stack">
      <inner-page-header title="Review and confirm" @back="back" />

      <div class="stake-confirm__block">
        <div class="stake-confirm__block-item">
          <stake-confirm-account
            :account="fromAccount"
            title="From"
            :amount="availableBalance"
          />
        </div>

        <div class="stake-confirm__block-item">
          <stake-confirm-amount :token="nativeToken" :amount="amount" />
        </div>
      </div>

      <div class="stake-confirm__arrow">
        <arrow-down-big />
      </div>

      <div class="stake-confirm__block">
        <stake-confirm-validator-item  :validator="p2p" />
      </div>

      <stake-confirm-fee :fee="fee" />
    </div>

    <buttons-block>
      <base-button
        :title="`Stake ${$filters.cryptoCurrencyFormat(
          amount
        )} ${nativeToken.symbol.toLocaleUpperCase()}`"
        :action="nextAction"
        :disabled="isLoading"
        :send="true"
      />
    </buttons-block>
  </white-wrapper>

  <white-wrapper v-else class="stake-confirm__wrap">
    <stake-confirm-process :is-done="isSendDone" :is-error="isError" />
  </white-wrapper>
</template>

<script setup lang="ts">
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
