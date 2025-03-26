<template>
  <div class="portfolio">
    <h2 class="portfolio__title">My staking portfolio</h2>
      <div v-if="Object.keys(portfolio).length && !isLoading">
        <portfolio-item
          v-for="(item, index) in portfolio"
          :key="index"
          :item="item"
        ></portfolio-item>
      </div>
      <div class="portfolio__empty" v-else-if="!Object.keys(portfolio).length && !isLoading">
        There are no active stakes.
      </div>
      <div class="portfolio__loader" v-if="isLoading">
        <spinner-animation />
      </div>
      
  </div>
</template>

<script setup lang="ts">
import PortfolioItem from "./components/portfolio-item.vue";
import SpinnerAnimation from "@/icons/animation/spinner.vue";
import { StakingTypes } from "@/store/modules/staking/consts";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { trackScreenEvents } from '@/libs/metrics';
import { ScreenEventType } from '@/libs/metrics/types';

const store = useStore();

const portfolio = computed(() => store.getters[StakingTypes.PORTFOLIO_GETTER]);
const isLoading = computed(() => store.getters[StakingTypes.IS_LOADING_GETTER]);

trackScreenEvents(ScreenEventType.PortfolioScreenShown);

onMounted(async () => {
  await store.dispatch(
    StakingTypes.SET_ERROR_STATE, 
    null,
  );
});

</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.portfolio {
  &__title {
    .headline4__Medium();
    color: @primaryLabel;
    margin: 0 0 16px 0;
    padding: 0 16px 0 16px;

    .screen-xs({
      .headline5__Medium();
      padding: 0
    });
  }

  &__loader {
    margin-top: 20%;
    justify-self: center;

    svg {
      width: 50px;
      height: 50px;
    }
  }

  &__empty {
    text-align: center;
    margin-top: 20%;
  }
}
</style>
