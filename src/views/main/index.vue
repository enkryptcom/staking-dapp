<template>
  <get-rewarded-banner />
  <staking-item
    v-for="(item, index) in stakingItems"
    :key="index"
    :item="item"
    :is-last="index == stakingItems.length - 1"
  ></staking-item>
</template>

<script setup lang="ts">
import GetRewardedBanner from "@/components/get-rewarded-banner/index.vue";
import { stakingItems } from "@/types/mock";
import StakingItem from "./components/staking-item.vue";
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";
</style>
