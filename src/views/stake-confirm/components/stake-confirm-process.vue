<template>
  <div v-if="isDone" class="stake-confirm-process">
    <div class="stake-confirm-process__stack">
      <done-animation />
      <h3>SOL staked!</h3>
      <p>Your SOL will begin earning rewards in the next couple days once the stake account is activated.</p>
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
    </div>
    <div class="stake-confirm-process__button">
      <base-button title="Go Back" :action="backAction" :send="true" />
    </div>
  </div>
  <div v-else class="stake-confirm-process stake-confirm-process--center">
    <spinner-animation />
    <h3>Staking SOL</h3>
    <p>Creating your staking account and delegating your SOL to P2P.org validator.</p>
    <base-button title="View details" :action="detailsAction" :stroke="true" :small="true" />
  </div>
</template>

<script setup lang="ts">
import DoneAnimation from "@/icons/animation/done.vue";
import ErrorAnimation from "@/icons/animation/error.vue";
import SpinnerAnimation from "@/icons/animation/spinner.vue";
import BaseButton from "@/components/base-button/index.vue";
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
  isDone: {
    type: Boolean,
    default: false,
  },
  isError: {
    type: Boolean,
    default: false,
  },
});

const backAction = () => {
  router.push({ name: "stake" });
};

const detailsAction = () => {
  router.push({ name: "stake" });
};

const doneAction = () => {
  router.push({ name: "main" });
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
