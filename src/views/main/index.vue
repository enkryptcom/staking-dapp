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
import StakingItem from "./components/staking-item.vue";
import { computed } from "vue";
import { StakingTypes } from "@/store/modules/staking/consts";
import { useStore } from "vuex";

const store = useStore();

const stakingItems = computed(() => store.getters[StakingTypes.STAKING_ITEMS_GETTER]);

</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";
</style>
