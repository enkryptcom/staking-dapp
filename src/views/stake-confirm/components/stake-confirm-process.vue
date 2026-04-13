<template>
  <div v-if="isDone" class="stake-confirm-process">
    <div class="stake-confirm-process__stack">
      <done-animation />
      <h3>{{ tokenSymbol }} staked!</h3>
      <p>Your {{ tokenSymbol }} will begin earning rewards in the next couple days once the stake account is activated.</p>
      <base-button title="View details" :action="detailsAction" :stroke="true" :small="true" />
    </div>
    <div class="stake-confirm-process__button">
      <base-button title="Done" :action="doneAction" :send="true" />
    </div>
  </div>
  <div v-else-if="isError" class="stake-confirm-process">
    <div class="stake-confirm-process__stack">
      <error-animation />
      <h3>Something went wrong...</h3>
      <p>We’re sorry, but it looks like there’s been an error. Please refresh the page or try again later.</p>
      <p>If the error persists, please <a href="javascript:void(0)" @click="openContactSupport">contact support</a></p>
    </div>
    <div class="stake-confirm-process__button">
      <base-button title="Go Back" :action="backAction" :send="true" />
    </div>
  </div>
  <div v-else class="stake-confirm-process stake-confirm-process--center">
    <spinner-animation />
    <h3>Staking {{ tokenSymbol }}</h3>
    <p>{{ stakingDescription }}</p>
    <div v-if="activeChain === Chains.ROOTSTOCK" class="stake-confirm-process__timeline">
      <div
        v-for="(step, index) in rootstockFlowSteps"
        :key="step.id"
        class="stake-confirm-process__timeline-item"
      >
        <div class="stake-confirm-process__timeline-indicator" :class="step.status">
          {{ step.status === "done" ? "v" : index + 1 }}
        </div>
        <div class="stake-confirm-process__timeline-content">
          <p class="stake-confirm-process__timeline-title" :class="`stake-confirm-process__timeline-title--${step.status}`">
            {{ step.title }}
          </p>
          <p class="stake-confirm-process__timeline-status" :class="`stake-confirm-process__timeline-status--${step.status}`">
            {{ formatStepStatus(step.status) }}
          </p>
        </div>
      </div>
    </div>
    <base-button v-if="stakingAccountTxId" title="View details" :action="detailsAction" :stroke="true" :small="true" />
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import DoneAnimation from "@/icons/animation/done.vue";
import ErrorAnimation from "@/icons/animation/error.vue";
import SpinnerAnimation from "@/icons/animation/spinner.vue";
import BaseButton from "@/components/base-button/index.vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { StakingTypes } from "@/store/modules/staking/consts";
import { useStore } from "vuex";
import { SharedTypes } from "@/store/shared/consts";
import { openExplorerTransaction, openContactSupport } from "@/utils/browser";
import { trackButtonsEvents, trackScreenEvents } from '@/libs/metrics';
import { ButtonsActionEventType, ScreenEventType } from '@/libs/metrics/types';
import { BASE_TOKENS } from "@/core/constants/index";
import { Chains } from "@/core/interfaces";

const router = useRouter();
const store = useStore();

const stakingAccountTxId = computed(() => store.getters[StakingTypes.TX_ID_GETTER]);
const network = computed(() => store.getters[SharedTypes.NETWORK_GETTER]);
const activeChain = computed(() => store.getters[SharedTypes.CHAIN_GETTER]);
const tokenSymbol = computed(() => BASE_TOKENS[activeChain.value]?.symbol?.toUpperCase?.() ?? "");
const rootstockStakeFlowSteps = computed(() => store.getters[StakingTypes.ROOTSTOCK_STAKE_FLOW_STEPS_GETTER]);
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
const stakingDescription = computed(() => {
  if (activeChain.value === Chains.ROOTSTOCK) {
    return `Processing your ${tokenSymbol.value} stake on Rootstock. This may take a moment.`;
  }

  return `Creating your staking account and delegating your ${tokenSymbol.value} to P2P.org validator.`;
});

const props = defineProps({
  isDone: {
    type: Boolean,
    default: false,
  },
  isError: {
    type: Boolean,
    default: false,
  },
});

watch(() => props.isError, (newValue) => {
  if(newValue) {
    trackScreenEvents(ScreenEventType.StackingErrorScreenShown);
  }
});

const formatStepStatus = (status: string) => {
  if (status === "done") {
    return "Done";
  }
  if (status === "in_progress") {
    return "In progress";
  }
  return "Pending";
};

const backAction = () => {
  trackButtonsEvents(ButtonsActionEventType.StakingConfirmScreenErrorBackButtonClicked);
  router.push({ name: "stake" });
};

const detailsAction = () => {
  trackButtonsEvents(ButtonsActionEventType.StakingConfirmScreenDetailsButtonClicked);
  openExplorerTransaction(stakingAccountTxId.value, activeChain.value, network.value);
};

const doneAction = () => {
  trackButtonsEvents(ButtonsActionEventType.StakingConfirmScreenDoneButtonClicked);
  router.push({ name: "portfolio" });
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-confirm-process {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &--center {
    justify-content: center;
  }

  svg {
    width: 64px;
    height: 64px;
  }

  h3 {
    .headline5__Medium();
    color: @primaryLabel;
    margin: 16px 0;
    text-align: center;
  }

  p {
    .body1__Regular();
    color: @secondaryLabel;
    margin: 0;
    text-align: center;
    padding: 0 20%;

    a {
      color: @primaryLabel;

      &:hover {
        text-decoration: none;
      }
    }

    .screen-xs({
      padding: 0 16px;
    });
  }

  .base-button {
    margin: 16px 0 0 0;
  }

  &__stack {
    width: 100%;
    text-align: center;
    padding: 76px 0;
  }

  &__button {
    text-align: center;
    padding: 0 16px 32px 16px;
    width: 100%;

    .base-button {
      margin: 0;

      .screen-sm({
        width: 100%;
        min-width: 100%;
      });
    }

    .screen-sm({
      padding: 0 0 16px 0;

    });
  }

  &__timeline {
    margin-top: 16px;
    width: 100%;
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
  }

  &__timeline-item {
    display: flex;
    align-items: flex-start;
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
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  &__timeline-title {
    .caption__Regular();
    margin: 0;
    color: @primaryLabel;
    padding: 0 !important;
    text-align: left !important;
  }

  &__timeline-status {
    .caption__Regular();
    margin: 0;
    color: @secondaryLabel;
    padding: 0 !important;
    text-align: left !important;

    &--pending {
      color: @secondaryLabel;
    }

    &--in_progress {
      color: @accent;
    }

    &--done {
      color: @success;
    }
  }

  &__timeline-title {
    &--pending {
      color: @primaryLabel;
    }

    &--in_progress {
      color: @accent;
    }

    &--done {
      color: @success;
    }
  }
}
</style>
