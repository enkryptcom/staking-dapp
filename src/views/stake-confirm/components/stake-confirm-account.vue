<template>
  <div class="stake-confirm-account">
    <img class="stake-confirm-account__icon" :src="createIcon(account?.address)" />
    <div class="stake-confirm-account__info">
      <h5 class="stake-confirm-account__info-title">{{ title }}</h5>
      <div v-if="!!account?.name" class="stake-confirm-account__info-address">
        {{ account?.name }}
        <span>{{ $filters.replaceWithEllipsis(account?.address, 6, 6) }}</span>
        <span>{{ $filters.cryptoCurrencyFormat(amount) }} <span>{{ token.symbol }}</span></span>
      </div>
      <div v-else class="stake-confirm-account__info-address">
        {{ account?.address }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BASE_TOKENS } from "@/core/constants";
import { Chains, Token } from "@/core/interfaces";
import { Account } from "@/types/account";
import { PropType } from "vue";
import createIcon from "@/utils/blockies";

defineProps({
  account: {
    type: Object as PropType<Account>,
    default: null,
  },
  title: {
    type: String,
    default: "",
  },
  amount: {
    type: Number,
    default: 0,
  },
  token: {
    type: Object as PropType<Token>,
    default: BASE_TOKENS[Chains.SOLANA],
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-confirm-account {
  width: 100%;
  height: 64px;
  text-decoration: none;
  position: relative;
  box-sizing: border-box;
  padding-left: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;

  &__icon {
    position: absolute;
    box-shadow: @shadowIcon;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    left: 16px;
    top: 50%;
    margin-top: -16px;
  }

  &__info {
    text-decoration: none;
    position: relative;
    width: 100%;

    &-title {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.5px;
      color: @secondaryLabel;
      margin: 0 0 2px 0;
    }

    &-address {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: row;
      word-break: break-all;
      .body1__Regular();

      span {
        color: @tertiaryLabel;
        display: inline-block;
        margin-left: 8px;

        span {
          font-variant: small-caps;
          margin-left: 0;
        }

        .screen-sm({
          display: none;
        });
      }
    }
  }
}
</style>
