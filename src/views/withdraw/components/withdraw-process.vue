<template>
  <div v-if="isDone" class="withdraw-process">
    <div class="withdraw-process__stack">
      <done-animation />
      <h3>SOL Withdrawn</h3>
      <p>Your SOL has been withdrawn.</p>
      <base-button title="View details" :action="detailsAction" :stroke="true" :small="true" />
    </div>
    <div class="withdraw-process__button">
      <base-button title="Done" :action="doneAction" :send="true" />
    </div>
  </div>
  <div v-else-if="isError" class="withdraw-process">
    <div class="withdraw-process__stack">
      <error-animation />
      <h3>Something went wrong...</h3>
      <p>We’re sorry, but it looks like there’s been an error. Please refresh the page or try again later.</p>
      <p>If the error persists, please <a href="mailto:support@enkrypt.com?subject=Enkrypt Staking Dapp Enquiry">contact support</a></p>
    </div>
    <div class="withdraw-process__button">
      <base-button title="Go Back" :action="backAction" :send="true" />
    </div>
  </div>
  <div v-else class="withdraw-process withdraw-process--center">
    <spinner-animation />
    <h3>Withdrawing SOL</h3>
    <p>We are withdrawing your SOL from this stake account.</p>
    <base-button v-if="withdrawTxId" title="View details" :action="detailsAction" :stroke="true" :small="true" />
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import DoneAnimation from "@/icons/animation/done.vue";
import ErrorAnimation from "@/icons/animation/error.vue";
import SpinnerAnimation from "@/icons/animation/spinner.vue";
import BaseButton from "@/components/base-button/index.vue";
import { useRouter } from "vue-router";
import { StakingTypes } from "@/store/modules/staking/consts";
import { useStore } from "vuex";
import { computed } from "vue";
import { SharedTypes } from "@/store/shared/consts";
import { openSolscanExplorerTransaction } from "@/utils/browser";
import { trackButtonsEvents, trackScreenEvents } from '@/libs/metrics';
import { ButtonsActionEventType, ScreenEventType } from '@/libs/metrics/types';

const store = useStore();
const router = useRouter();

const network = computed(() => store.getters[SharedTypes.NETWORK_GETTER]);
const withdrawTxId = computed(() => store.getters[StakingTypes.TX_ID_GETTER]);

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
    trackScreenEvents(ScreenEventType.WithdrawErrorScreenShown);
  }
});

const backAction = () => {
  trackButtonsEvents(ButtonsActionEventType.WithdrawScreenErrorBackButtonClicked);
  router.push({ name: "portfolio" });
};

const detailsAction = () => {
  trackButtonsEvents(ButtonsActionEventType.WithdrawScreenDetailsButtonClicked);
  openSolscanExplorerTransaction(withdrawTxId.value, network.value);
};

const doneAction = () => {
  trackButtonsEvents(ButtonsActionEventType.WithdrawScreenDoneButtonClicked);
  router.push({ name: "portfolio" });
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.withdraw-process {
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
