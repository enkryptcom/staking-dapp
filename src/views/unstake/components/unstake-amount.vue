<template>
  <div class="unstake-amount">
    <img class="unstake-amount__icon" :src="token.image" />
    <div class="unstake-amount__info">
      <div class="unstake-amount__info-title">Unstaking amount</div>
      <h2 class="unstake-amount__info-amount">
        {{ $filters.cryptoCurrencyFormat(amount) }}
        <span>{{ token.symbol }}</span>
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { solana } from "@/types/mock";
import { Token } from "@/types/token";
import { PropType } from "vue";

defineProps({
  token: {
    type: Object as PropType<Token>,
    default: solana,
  },
  amount: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.unstake-amount {
  width: 100%;
  height: 64%;
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

    &-amount {
      .headline6__Regular();
      color: @primaryLabel;
      margin: 0 0 4px 0;

      span {
        font-variant: small-caps;
        display: inline-block;
      }
    }

    &-title {
      .body2__Regular();
      color: @secondaryLabel;
      margin: 0;
    }
  }
}
</style>
