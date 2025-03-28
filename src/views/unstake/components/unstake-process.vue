<template>
  <div v-if="isDone" class="unstake-process">
    <div class="unstake-process__stack">
      <done-animation />
      <h3>SOL Unstaked</h3>
      <p>You will be able to withdraw your stake in the next couple days once the stake account becomes unstaked.</p>
      <base-button title="View details" :action="detailsAction" :stroke="true" :small="true" />
    </div>
    <div class="unstake-process__button">
      <base-button title="Done" :action="doneAction" :send="true" />
    </div>
  </div>
  <div v-else-if="isError" class="unstake-process">
    <div class="unstake-process__stack">
      <error-animation />
      <h3>Something went wrong...</h3>
      <p>We’re sorry, but it looks like there’s been an error. Please refresh the page or try again later.</p>
      <p>If the error persists, please <a href="javascript:void(0)" @click="openContactSupport">contact support</a></p>
    </div>
    <div class="unstake-process__button">
      <base-button title="Go Back" :action="backAction" :send="true" />
    </div>
  </div>
  <div v-else class="unstake-process unstake-process--center">
    <spinner-animation />
    <h3>Unstaking SOL</h3>
    <p>We are starting the process to unstake your SOL.</p>
    <base-button v-if="unstakingAccountTxId" title="View details" :action="detailsAction" :stroke="true" :small="true" />
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
import { openSolscanExplorerTransaction, openContactSupport } from "@/utils/browser";
import { trackButtonsEvents, trackScreenEvents } from '@/libs/metrics';
import { ButtonsActionEventType, ScreenEventType } from '@/libs/metrics/types';

const store = useStore();
const router = useRouter();

const network = computed(() => store.getters[SharedTypes.NETWORK_GETTER]);
const unstakingAccountTxId = computed(() => store.getters[StakingTypes.TX_ID_GETTER]);

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
    trackScreenEvents(ScreenEventType.UnstakeErrorScreenShown);
  }
});

const backAction = () => {
  trackButtonsEvents(ButtonsActionEventType.UnstakeScreenErrorBackButtonClicked);
  router.push({ name: "portfolio" });
};

const detailsAction = () => {
  trackButtonsEvents(ButtonsActionEventType.UnstakeScreenDetailsButtonClicked);
  openSolscanExplorerTransaction(unstakingAccountTxId.value, network.value);
};

const doneAction = () => {
  trackButtonsEvents(ButtonsActionEventType.UnstakeScreenDoneButtonClicked);
  router.push({ name: "portfolio" });
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.unstake-process {
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
}
</style>
