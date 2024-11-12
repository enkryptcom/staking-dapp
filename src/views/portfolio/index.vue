<template>
  <div class="portfolio">
    <h2 class="portfolio__title">My staking portfolio</h2>
      <portfolio-item
        v-for="(item, index) in myPortfolio"
        :key="index"
        :item="item"
      ></portfolio-item>
  </div>
</template>

<script setup lang="ts">
import PortfolioItem from "./components/portfolio-item.vue";
import { myPortfolio } from "@/types/mock";
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
}
</style>
