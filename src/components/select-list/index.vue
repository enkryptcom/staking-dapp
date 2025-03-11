<template>
  <div class="select-list">
    <a ref="toggle" class="select-list__block" @click="toggleAction" href="javascript:void(0)">
      <img :src="select.image" />
      <span v-if="!isMinify">{{ select.name }}</span>
      <arrow-down />
    </a>
    <div v-show="isOpen" ref="dropdown" class="select-list__dropdown">
      <select-list-item
        :item="select"
        :is-selected="true"
        :is-list-image="isListImage"
        @update:select="toggleAction"
      ></select-list-item>
      <select-list-item
        v-for="(item, index) in listItems"
        :key="index"
        :item="item"
        :is-list-image="isListImage"
        @update:select="selectItem"
      ></select-list-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArrowDown from "@/icons/common/arrow-down.vue";
import SelectListItem from "./components/select-list-item.vue";
import { PropType, ref, computed } from "vue";
import { onClickOutside } from "@vueuse/core";
import { ChainDataItem } from "@/core/interfaces";

const isOpen = ref<boolean>(false);
const dropdown = ref(null);
const toggle = ref(null);

const emit = defineEmits<{
  (e: "update:select", asset: ChainDataItem): void;
}>();

const props = defineProps({
  items: {
    type: Object as PropType<Array<ChainDataItem>>,
    default: () => ({}),
  },
  select: {
    type: Object as PropType<ChainDataItem>,
    default: () => ({}),
  },
  isMinify: {
    type: Boolean,
    default: false,
  },
  isListImage: {
    type: Boolean,
    default: false,
  },
});

const listItems = computed<Array<ChainDataItem>>(() => {
  if (!props.items.length) return [];
  return props.items.filter((item) => item.id !== props.select.id);
});

const toggleAction = () => {
  isOpen.value = !isOpen.value;
};
const selectItem = (item: ChainDataItem) => {
  emit("update:select", item);
  toggleAction();
};

onClickOutside(
  dropdown,
  () => {
    if (isOpen.value) isOpen.value = false;
  },
  { ignore: [toggle] }
);
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.select-list {
  position: relative;
  margin-right: 10px;

  &__block {
    padding: 8px;
    border-radius: 24px;
    height: 40px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    background-color: @accent01;

    img {
      width: 24px;
      margin-right: 4px;
    }

    span {
      .body1__Medium();
      color: @primaryLabel;
      display: block;
      margin-right: 8px;
    }
  }

  &__dropdown {
    position: absolute;
    left: 0;
    top: 42px;
    background: @white;
    box-shadow: @shadow16;
    border-radius: 16px;
    min-width: calc(~"100% - 2px");
    z-index: 2;
  }
}
</style>
