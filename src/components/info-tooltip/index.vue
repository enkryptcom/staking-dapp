<template>
  <div class="info-tooltip" :class="{ big: isBigIcon }" @mouseenter="onHover" @mouseleave="onHide">
    <info-icon v-if="isBigIcon" />
    <tooltip-info-icon v-else :fill="fill" :opacity="opacity" />
    <div v-show="show" class="info-tooltip__text" :class="classObject()">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import TooltipInfoIcon from "@/icons/common/tooltip-info-icon.vue";
import InfoIcon from "@/icons/common/info-icon.vue";

import { ref } from "vue";

const show = ref(false);
const visible = ref(false);
let timeout: ReturnType<typeof setTimeout> | null = null;

defineProps({
  text: {
    type: String,
    default: "",
  },
  isBigIcon: {
    type: Boolean,
    default: false,
  },
  fill: {
    type: String,
    default: "black"
  },
  opacity: {
    type: String,
    default: "0.32"
  },
});

const onHover = () => {
  if (timeout != null) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    if (!show.value) {
      show.value = true;
      setTimeout(() => {
        visible.value = true;
      }, 50);
    }
  }, 300);
};
const onHide = () => {
  if (timeout != null) {
    clearTimeout(timeout);
    timeout = null;
  }
  if (visible.value) {
    visible.value = false;
    setTimeout(() => {
      show.value = false;
    }, 200);
  } else {
    visible.value = false;
    show.value = false;
  }
};
const classObject = () => {
  return { normal: true, visible: visible.value };
};
</script>

<style lang="less">
@import "@/assets/styles/theme.less";

.info-tooltip {
  display: block;
  position: relative;
  font-size: 0;
  height: 12px;
  margin-left: 2px;

  &.big {
    height: 16px;
    margin-left: 0;
  }

  &__text {
    position: absolute;
    top: 12px;
    left: 100%;
    margin-left: 0;
    padding: 8px 12px;
    position: absolute;
    width: 176px;
    background: @white;
    border-radius: 8px;
    .sizing();
    .caption__Regular();
    letter-spacing: 0.25px;
    color: @secondaryLabel;
    .transition(opacity, 300ms);
    opacity: 0;
    box-shadow: @shadow16;
    z-index: 101;

    &.visible {
      opacity: 1;
    }
  }
}
</style>
