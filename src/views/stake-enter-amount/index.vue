<template>
  <white-wrapper class="stake-enter-amount__wrap">
    <div class="stake-enter-amount__stack">
      <inner-page-header title="Enter staking amount" @back="back" />

      <amount-input
        :has-enough-balance="hasEnough"
        :is-min-value="isMinValue"
        :is-error="false"
        :token="nativeToken"
        :value="String(amount)"
        :max-value="availableBalance"
        :inner-error-message="minValueErrorMessage"
        @update:amount="inputAmount"
      />

      <validator-info class="stake-enter-amount__validator" :validator="p2p" />
    </div>

    <buttons-block :is-space="true">
      <div class="stake-enter-amount__estimated">
        <p class="stake-enter-amount__estimated-label">Estimated Returns in 1 year</p>
        <p class="stake-enter-amount__estimated-coast">
          {{ $filters.cryptoCurrencyFormat(2.738) }} <span>sol</span>
        </p>
        <p class="stake-enter-amount__estimated-fiat">
          ~{{ $filters.currencyFormat(360.10, "USD") }}
        </p>
      </div>
      <base-button
        title="Continue"
        :action="nextAction"
        :send="true"
        :disabled="!isValid"
      />
    </buttons-block>
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import AmountInput from "@/components/amount-input/index.vue";
import ValidatorInfo from "./components/validator-info/index.vue";
import InnerPageHeader from "@/components/inner-page-header/index.vue";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Token } from "@/types/token";
import { solana, p2p } from "@/types/mock";
import { cryptoCurrencyFormat } from "@/utils/filters";

const router = useRouter();

const amount = ref<number>(0);
const nativeToken = ref<Token>(solana)
const availableBalance = ref<number>(40);
const minAmount = ref<number>(2.5);

onMounted(() => {
 
});

const isValid = computed<boolean>(() => {
  return !isMinValue.value && hasEnough.value
});

const minValueErrorMessage = computed(() => {
  if (minAmount.value > amount.value) {
    return `Minimum stake amount is ${cryptoCurrencyFormat(minAmount.value)} ${nativeToken.value.symbol.toLocaleUpperCase()}`;
  }

  if (amount.value > availableBalance.value) {
    return `Insufficient funds`;
  }
  
  return "";
});

const isMinValue = computed(() => {
  return minAmount.value > amount.value
});

const hasEnough = computed(() => {
  return availableBalance.value > amount.value
});

const nextAction = () => {
  router.push({
    name: "stake-confirm",
  });
};

const back = () => {
  router.go(-1);
};

const inputAmount = (newVal: string) => {
  amount.value = Number(newVal);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-enter-amount {
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

  &__estimated {
    margin-right: 16px;
    padding: 16px 0;

    .screen-sm({
      width: 100%;
      margin-right: 0;
    });

    &-label {
      .caption__Regular();
      margin: 0;
      color: @secondaryLabel;
    }

    &-coast {
      .body1__Medium();
      margin: 0;
      color: @primaryLabel;
            
      span {
        text-transform: uppercase;
      }
    }

    &-fiat {
      .caption__Regular();
      margin: 0;
      color: @secondaryLabel;
    }
  }
}
</style>
