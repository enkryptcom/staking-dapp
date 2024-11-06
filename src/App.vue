<template>
  <app-header @toggle-menu="toggleMenu" :is-toggle-menu="isToggleMenu" />
  <app-menu :is-toggle-menu="isToggleMenu" />
  <div class="container">
    <div class="row justify-content-start">
      <div class="col-12">
        <main class="app__main">
          <router-view name="view"></router-view>
        </main>
      </div>
    </div>
  </div>
  <router-view name="modal"></router-view>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import AppHeader from "@/components/app-header/index.vue";
import AppMenu from "@/components/app-menu/index.vue";
import { useRoute } from 'vue-router'

const route = useRoute()

watch(() => route.path, () => {
  isToggleMenu.value = false
});

onMounted(() => {
  onResize()
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const onResize = () => {
  isToggleMenu.value = false
};

const isToggleMenu = ref<boolean>(false);

const toggleMenu = () => {
  isToggleMenu.value = !isToggleMenu.value;
};
</script>

<style lang="less">
@import "@/assets/styles/theme.less";

.app {
  position: relative;
  min-height: 100%;
  padding-bottom: 32px;
  box-sizing: border-box;
  padding-top: 88px;

  .screen-sm({
    padding-top: 0;
  });
}
</style>
