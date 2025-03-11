<template>
  <a
    class="base-button"
    :class="{
      stroke: stroke,
      disabled: disabled,
      small: small,
      send: send,
      secondary: secondary,
    }"
    href="javascript:void(0)"
    @click="action()"
  >
    <div v-if="!loading">{{ title }}</div>
    <div v-else class="base-button__loader">
      <spinner-animation />
    </div>
  </a>
</template>

<script setup lang="ts">
import SpinnerAnimation from "@/icons/animation/spinner.vue";

defineProps({
  title: {
    type: String,
    default: "",
  },
  action: {
    type: Function,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  stroke: {
    type: Boolean,
    default: false,
  },
  small: {
    type: Boolean,
    default: false,
  },
  send: {
    type: Boolean,
    default: false,
  },
  secondary: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  }
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.base-button {
  padding: 12px 20px;
  height: 48px;
  background: @accent;
  border-radius: 24px;
  .sizing();
  text-decoration: none;
  cursor: pointer;
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 22px;
  color: @white;
  display: inline-block;
  .transition(background, 0.3s);

  &:hover {
    background: @accentHover;
  }

  &:active {
    background: @accentPressed;
  }

  &.small {
    padding: 8px 12px;
    height: 32px;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
  }

  &.send {
    min-width: 196px;
    text-align: center;

    .screen-md({
      min-width: auto;
    });
  }

  &.stroke {
    border: 1px solid @accent;
    background: transparent;
    color: @accent;

    &.small {
      line-height: 14px;
    }

    &:hover {
      background: @white;
      border: 1px solid @accent;
    }

    &:active {
      color: @accent01;
      border: 1px solid @accent01;
    }
  }

  &.disabled {
    background: @gray004;
    border: 0 none;
    color: @gray016;
    pointer-events: none;
  }

  &.secondary {
    background: @accent01;
    color: @accent;
  }

  &__loader {
    justify-self: center;

    svg {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
