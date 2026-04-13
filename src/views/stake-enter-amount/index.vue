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

      <validator-info
        v-if="showValidatorInfo"
        class="stake-enter-amount__validator"
        :validator="validators[Providers.p2p][activeChain]"
      />
      <p v-if="isRootstock" class="stake-enter-amount__rootstock-note">
        The staking amount will be automatically distributed among top builders in Rootstock ecosystem. You as
        a backer will automatically earn the yield shared by builders in Rootstock ecosystem. The staking process will
        ask you to approve total of 3 transaction (approve RIF spending, staking, backing builders) to complete the staking process.
      </p>
      <div v-if="isRootstock" class="stake-enter-amount__timeline">
        <div
          v-for="(step, index) in rootstockFlowSteps"
          :key="step.id"
          class="stake-enter-amount__timeline-item"
        >
          <div
            class="stake-enter-amount__timeline-indicator"
            :class="step.status"
          >
            {{ step.status === "done" ? "v" : index + 1 }}
          </div>
          <div class="stake-enter-amount__timeline-content">
            <p class="stake-enter-amount__timeline-title">{{ step.title }}</p>
            <!-- <p class="stake-enter-amount__timeline-status">{{ formatStepStatus(step.status) }}</p> -->
          </div>
        </div>
      </div>
    </div>

    <buttons-block :is-space="true">
      <div class="stake-enter-amount__estimated">
        <p class="stake-enter-amount__estimated-label">
          {{ estimatedLabel }}
        </p>

        <p class="stake-enter-amount__estimated-coast">
          <template v-if="isRootstock">
            {{ abiValue.toFixed(2) }}% ABI
          </template>
          <template v-else>
            {{ $filters.cryptoCurrencyFormat(returns) }} <span>{{ BASE_TOKENS[activeChain].symbol }}</span>
          </template>
        </p>
        <p v-if="!isRootstock" class="stake-enter-amount__estimated-fiat">
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
import { trackScreenEvents, trackButtonsEvents } from '@/libs/metrics';
import { ScreenEventType, ButtonsActionEventType } from '@/libs/metrics/types';

const router = useRouter();
const store = useStore();

const walletBalance = computed(() => store.getters[SharedTypes.WALLET_BALANCE_GETTER]);
const activeChain = computed(() => store.getters[SharedTypes.CHAIN_GETTER]);
const prices = computed(() => store.getters[SharedTypes.PRICE_GETTER]);
const validators = computed(() => store.getters[StakingTypes.VALIDATORS_GETTER]);
const stakingItems = computed(() => store.getters[StakingTypes.STAKING_ITEMS_GETTER]);
const walletAccount = computed(() => store.getters[SharedTypes.WALLET_ACCOUNT_GETTER]);
const isLoading = computed(() => store.getters[StakingTypes.IS_STAKING_LOADING_GETTER]);
const isRootstock = computed(() => activeChain.value === Chains.ROOTSTOCK);
const rootstockStakeFlowSteps = computed(() => store.getters[StakingTypes.ROOTSTOCK_STAKE_FLOW_STEPS_GETTER]);
const abiValue = computed(() => {
  const raw = stakingItems.value?.[activeChain.value]?.apr ?? "0";
  const parsed = parseFloat(String(raw));
  return Number.isFinite(parsed) ? parsed : 0;
});
const estimatedLabel = computed(() => (isRootstock.value ? "ABI" : "Estimated Balance in 1 year"));
const returns = computed(() => {
  const apy = Number(validators.value[Providers.p2p][activeChain.value].apy || 0);
  return amount.value * (1 + apy);
});
const returnsUSD = computed(() => {
  const value = returns.value || 0;
  const price = prices.value?.[BASE_TOKENS[activeChain.value].symbol] || 0;
  return value * price;
});

const amount = ref<number>(0);
const nativeToken = computed<Token>(() => BASE_TOKENS[activeChain.value]);
const showValidatorInfo = computed(() => activeChain.value === Chains.SOLANA);
const minAmount = ref<number>(1.003);
const rootstockFlowSteps = computed(() => [
  {
    id: "approve",
    title: "Allow RIF spending",
    status: rootstockStakeFlowSteps.value?.approve ?? "pending",
  },
  {
    id: "stake",
    title: "Stake RIF",
    status: rootstockStakeFlowSteps.value?.stake ?? "pending",
  },
  {
    id: "backBuilders",
    title: "Back Top Builders",
    status: rootstockStakeFlowSteps.value?.backBuilders ?? "pending",
  },
]);

trackScreenEvents(ScreenEventType.StackingScreenShown);

onMounted(async () => {
  if (isRootstock.value) {
    store.commit(StakingTypes.RESET_ROOTSTOCK_STAKE_FLOW_STEPS);
  }
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
  trackButtonsEvents(ButtonsActionEventType.StakingScreenContinueButtonClicked);
  await store.dispatch(StakingTypes.CREATE_STAKE_ACTION, [walletAccount.value.address, walletBalance.value]);
  router.push({
    name: "stake-confirm",
  });
};

const back = () => {
  trackButtonsEvents(ButtonsActionEventType.StakingScreenBackButtonClicked);
  router.go(-1);
};

const inputAmount = (newVal: string) => {
  amount.value = Number(newVal);
  store.commit(StakingTypes.SET_STAKING_AMOUNT, newVal);
};

const formatStepStatus = (status: string) => {
  if (status === "done") {
    return "Done";
  }
  if (status === "in_progress") {
    return "In progress";
  }
  return "Pending";
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
  
  &__rootstock-note {
    .caption__Regular();
    margin: 12px 0 0 0;
    color: @secondaryLabel;
  }

  &__timeline {
    margin-top: 12px;
  }

  &__timeline-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  &__timeline-indicator {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid @gray016;
    color: @gray016;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-size: 12px;
    font-weight: 600;

    &.in_progress {
      border-color: @accent;
      color: @accent;
    }

    &.done {
      border-color: @success;
      color: @success;
    }
  }

  &__timeline-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__timeline-title {
    .caption__Regular();
    margin: 0;
    color: @primaryLabel;
  }

  &__timeline-status {
    .caption__Regular();
    margin: 0;
    color: @secondaryLabel;
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
