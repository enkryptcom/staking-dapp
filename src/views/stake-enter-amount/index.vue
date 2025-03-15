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
        :max-value="walletBalance"
        :inner-error-message="minValueErrorMessage"
        @update:amount="inputAmount"
      />

      <validator-info class="stake-enter-amount__validator" :validator="validators[Providers.p2p][activeChain]" />
    </div>

    <buttons-block :is-space="true">
      <div class="stake-enter-amount__estimated">
        <p class="stake-enter-amount__estimated-label">Estimated Balance in 1 year</p>

        <p class="stake-enter-amount__estimated-coast">
          {{ $filters.cryptoCurrencyFormat(returns) }} <span>{{ BASE_TOKENS[activeChain].symbol }}</span>
        </p>
        <p class="stake-enter-amount__estimated-fiat">
          ~{{ $filters.currencyFormat(returnsUSD, "USD") }}
        </p>
      </div>
      <base-button
        title="Continue"
        :action="nextAction"
        :send="true"
        :loading="isLoading"
        :disabled="!isValid || isLoading"
      />
    </buttons-block>
  </white-wrapper>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import AmountInput from "@/components/amount-input/index.vue";
import ValidatorInfo from "./components/validator-info/index.vue";
import InnerPageHeader from "@/components/inner-page-header/index.vue";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { cryptoCurrencyFormat } from "@/utils/filters";
import { SharedTypes } from "@/store/shared/consts";
import { StakingTypes } from "@/store/modules/staking/consts";
import { Chains, Providers, Token } from "@/core/interfaces";
import { BASE_TOKENS } from "@/core/constants";

const router = useRouter();
const store = useStore();

const walletBalance = computed(() => store.getters[SharedTypes.WALLET_BALANCE_GETTER]);
const activeChain = computed(() => store.getters[SharedTypes.CHAIN_GETTER]);
const prices = computed(() => store.getters[SharedTypes.PRICE_GETTER]);
const validators = computed(() => store.getters[StakingTypes.VALIDATORS_GETTER]);
const walletAccount = computed(() => store.getters[SharedTypes.WALLET_ACCOUNT_GETTER]);
const isLoading = computed(() => store.getters[StakingTypes.IS_STAKING_LOADING_GETTER]);
const returns = computed(() => {
  return amount.value * (1 + validators.value[Providers.p2p][activeChain.value].apy);
});
const returnsUSD = computed(() => {
  const value = returns.value || 0;
  const price = prices.value?.[BASE_TOKENS[activeChain.value].symbol] || 0;
  return value * price;
});

const amount = ref<number>(0);
const nativeToken = ref<Token>(BASE_TOKENS[Chains.SOLANA]);
const minAmount = ref<number>(1.003);

onMounted(async () => {
   await store.dispatch(
    StakingTypes.SET_ERROR_STATE, 
    null,
  );
});

const isValid = computed<boolean>(() => {
  return !isMinValue.value && hasEnough.value
});

const minValueErrorMessage = computed(() => {
  if (minAmount.value > amount.value) {
    return `Minimum stake amount is ${cryptoCurrencyFormat(minAmount.value)} ${nativeToken.value.symbol.toLocaleUpperCase()}`;
  }

  if (amount.value > walletBalance.value) {
    return `Insufficient funds`;
  }
  
  return "";
});

const isMinValue = computed(() => {
  return minAmount.value > amount.value
});

const hasEnough = computed(() => {
  return walletBalance.value >= amount.value
});

const nextAction = async () => {
  await store.dispatch(StakingTypes.CREATE_STAKE_ACTION, [walletAccount.value.address, walletBalance.value]);
  router.push({
    name: "stake-confirm",
  });
};

const back = () => {
  router.go(-1);
};

const inputAmount = (newVal: string) => {
  amount.value = Number(newVal);
  store.commit(StakingTypes.SET_STAKING_AMOUNT, newVal);
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
