<template>
  <div class="buttons-block" :class="{ space: isSpace, border: isBorder }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isSpace: {
    type: Boolean,
    default: false,
  },
  isBorder: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.buttons-block {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  background-color: @white;
  box-sizing: border-box;

  &.space {
    justify-content: space-between;
  }

  &.border {
    box-shadow: @shadow16;
  }

  .screen-sm({
    display: block;
  });
}
</style>
