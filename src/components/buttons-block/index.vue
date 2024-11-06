<template>
  <div class="buttons-block">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

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

  .screen-sm({
    display: block;
  });
}
</style>
