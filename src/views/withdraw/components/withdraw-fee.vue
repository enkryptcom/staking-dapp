<template>
  <div class="withdraw-fee">
    <p class="withdraw-fee__title">Network fee:</p>
    <p class="withdraw-fee__fiat">
      {{ $filters.currencyFormat(fee.fiatValue, fee.fiatSymbol) }}
    </p>
    <p class="withdraw-fee__amount">
      {{ $filters.cryptoCurrencyFormat(fee.nativeValue) }} <span>{{ fee.nativeSymbol }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { GasFeeInfo } from "@/types/transaction";
import { PropType } from "vue";

defineProps({
  fee: {
    type: Object as PropType<GasFeeInfo>,
    default: () => ({
      nativeValue: 0,
      fiatValue: 0,
      nativeSymbol: "sol",
      fiatSymbol: "USD",
    }),
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.withdraw-fee {
  padding: 12px 12px 12px 60px !important;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;

  &__title {
    .body2__Regular();
    color: @secondaryLabel;
    margin: 0 10px 0 0;
  }

  &__fiat {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.25px;
    color: @secondaryLabel;
    margin: 0 10px 0 0;
  }

  &__amount {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.25px;
    color: @tertiaryLabel;
    margin: 0;

    span {
      text-transform: uppercase;
    }
  }
}
</style>
