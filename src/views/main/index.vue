<template>
  <get-rewarded-banner />
  <staking-item
    v-for="(item, index) in filteredStakingItems"
    :key="index"
    :item="item"
    :is-last="index == filteredStakingItems.length - 1"
  ></staking-item>
</template>

<script setup lang="ts">
import GetRewardedBanner from "@/components/get-rewarded-banner/index.vue";
import StakingItem from "./components/staking-item.vue";
import { computed } from "vue";
import { StakingTypes } from "@/store/modules/staking/consts";
import { useStore } from "vuex";
import { trackScreenEvents } from '@/libs/metrics';
import { ScreenEventType } from '@/libs/metrics/types';
import { SharedTypes } from "@/store/shared/consts";

const store = useStore();

const stakingItems = computed(() => store.getters[StakingTypes.STAKING_ITEMS_GETTER]);
const activeChain = computed(() => store.getters[SharedTypes.CHAIN_GETTER]);
const filteredStakingItems = computed(() => {
  const item = stakingItems.value?.[activeChain.value];
  return item ? [item] : [];
});

trackScreenEvents(ScreenEventType.MainScreenShown);
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";
</style>
