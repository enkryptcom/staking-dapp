<template>
  <div class="fee-info">
    <p class="fee-info__title">Network fee:</p>
    <p class="fee-info__fiat">{{ $filters.currencyFormat(0.34, "USD") }}</p>
    <p class="fee-info__amount">
      {{ $filters.cryptoCurrencyFormat(0.037) }} <span>dot</span>
    </p>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.fee-info {
  padding: 0 0 0 60px !important;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;

  &__title {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.25px;
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
