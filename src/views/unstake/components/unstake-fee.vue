<template>
  <div class="stake-confirm-fee" v-if="fee">
    <p class="stake-confirm-fee__title">Network fee:</p>
    <p class="stake-confirm-fee__fiat" v-if="Object.keys(prices).length > 0">
      {{ floatFormat(feeUSD.toString()) }} $ 
    </p>
    <p class="stake-confirm-fee__amount">
      {{ floatFormat(fee.toString()) }} <span>{{ feeSymbol }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { BASE_TOKENS } from "@/core/constants";
import { floatFormat } from "@/core/utils";
import { SharedTypes } from "@/store/shared/consts";
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const props = defineProps({
  fee: {
    type: Number,
    default: 0,
  },
});

const prices = computed(() => store.getters[SharedTypes.PRICE_GETTER]);
const activeChain = computed(() => store.getters[SharedTypes.CHAIN_GETTER]);
const feeUSD = computed(() => {
  const feeVal = parseFloat(props.fee.toString());
  const price = prices.value?.[BASE_TOKENS[activeChain.value].symbol] || 0;
  return feeVal * price;
});
const feeSymbol = computed(() => BASE_TOKENS[activeChain.value].symbol);

</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-confirm-fee {
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
