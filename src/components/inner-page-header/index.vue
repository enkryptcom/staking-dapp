<template>
    <div class="inner-page-header">
      <back-button :action="back" />
      <h1 class="inner-page-header__title">{{ title }}</h1>
    </div>
</template>

<script setup lang="ts">
import BackButton from "@/components/back-button/index.vue";

defineProps({
  title: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["back"]);

const back = () => {
  emit("back");
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.inner-page-header {
  position: relative;
  margin-bottom: 32px;

  &__title {
    .headline6__Medium();
    color: @primaryLabel;
    margin: 0 0 16px 0;
    padding-left: 60px;
    .sizing();
  }
}
</style>
