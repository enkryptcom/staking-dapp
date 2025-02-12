<template>
  <a
    class="select-list-item"
    :class="{ first: isSelected, image: isListImage }"
    @click="select"
  >
    <img v-if="isSelected || isListImage" :src="item.image" />
    <span>{{ item.name }}</span>
  </a>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { ChainDataItem } from "@/core/interfaces";

const emit = defineEmits<{
  (e: "update:select", item: ChainDataItem): void;
}>();

const props = defineProps({
  item: {
    type: Object as PropType<ChainDataItem>,
    default: () => ({}),
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  isListImage: {
    type: Boolean,
    default: false,
  },
});

const select = () => {
  emit("update:select", props.item);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.select-list-item {
  padding: 12px 36px 12px 44px;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  position: relative;

  &:before {
    content: "";
    width: 100%;
    height: 1px;
    background: @accent01;
    position: absolute;
    left: 0;
    top: 0;
  }

  &.first {
    padding-left: 12px;

    &:before {
      display: none;
    }
  }

  &.image {
    padding-left: 12px;
  }

  img {
    width: 24px;
    margin-right: 8px;
  }

  span {
    .body1__Medium();
    color: @primaryLabel;
    display: block;
    margin-right: 8px;
  }
}
</style>
