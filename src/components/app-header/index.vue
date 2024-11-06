<template>
  <header class="container-fluid header__wrap">
    <div class="row justify-content-between align-items-center header">
      <div class="col-3 d-flex align-items-center">
        <router-link :to="{ name: 'main' }">
          <logo />
        </router-link>
        <a @click="toggleMenu" class="header__mobile-menu">
          <open-menu v-if="!isToggleMenu" />
          <close-menu v-else />
        </a>
      </div>
      <div class="col-6 row justify-content-end">
        <div class="header__menu" :class="{ scroll: isScroll }">
          <a v-if="!isConnect" class="header__get-enkrypt" href="#">
            <enkrypt-logo-min-white />
            <span>Get Enkrypt</span>
          </a>
          <select-list
            v-if="!isToggleMenu"
            :select="network"
            :items="selectNetworkItems"
            :is-minify="true"
            :is-list-image="true"
            @update:select="selectNetworkAction"
          />
          <account-select
            v-if="isConnect && !isToggleMenu"
            :account="fromAccount"
            @disconnect="disconnectAction"
          ></account-select>
          <a v-else-if="!isToggleMenu" class="header__connect" @click="connectAction">Connect</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import Logo from "@/icons/common/logo.vue";
import EnkryptLogoMinWhite from "@/icons/common/enkrypt-logo-min-white.vue";
import SelectList from "@/components/select-list/index.vue";
import AccountSelect from "@/components/account-select/index.vue";
import OpenMenu from "@/icons/header/open-menu.vue";
import CloseMenu from "@/icons/header/close-menu.vue";
import { Network } from "@/types/network";
import { selectNetwork, selectNetworkItems, fromAccount} from "@/types/mock";

const isScroll = ref<boolean>(false);
const isConnect = ref<boolean>(false);
const network = ref<Network>(selectNetwork);

defineProps({
  isToggleMenu: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle-menu"]);

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

const onScroll = () => {
  if (window.scrollY > 22) {
    if (isScroll.value == false) isScroll.value = true;
  } else {
    if (isScroll.value == true) isScroll.value = false;
  }
};

const selectNetworkAction = (item: Network) => {
  network.value = item;
};

const connectAction = () => {
  isConnect.value = true
};

const disconnectAction = () => {
  isConnect.value = false
};

const toggleMenu = () => {
  emit("toggle-menu");
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.header {
  height: 92px;
  max-width: 1280px;
  position: relative;
  margin: 0 auto;

  .screen-sm({
    height: 88px;
  });

  &__wrap {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 101;

    .screen-sm({
      position: relative;
    });
  }

  &__menu {
    padding: 4px;
    border-radius: 32px;
    display: flex;
    flex-direction: row;

    & > .select-list, & > a, & > .account-select {
      margin-left: 8px;

      &:first-child {
        margin-left: 0;
      }
    }

    &.scroll {
      background: @white;
      box-shadow: @shadow16;
    }

    .screen-sm({
      
    });
  }

  &__connect {
    padding: 8px 16px;
    border-radius: 24px;
    height: 40px;
    box-sizing: border-box;
    cursor: pointer;
    background-color: @accent01;
    display: block;
    .body1__Medium();
    color: @accent;
  }

  &__get-enkrypt {
    padding: 8px 16px;
    border-radius: 24px;
    height: 40px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    background-color: @accent;
    .body1__Medium();
    color: @white;
    text-decoration: none;

    svg {
      margin-right: 8px;
    }

    .screen-sm({
      display: none
    });
  }

  &__mobile-menu {
    display: none;

    .screen-sm({
      display: inline-block;
      padding: 12px;
      border-radius: 40px;
      background-color: @accent01;
      font-size: 0;
      width: 40px;
      height: 40px;
      margin-left: 11px;
    });
  }
}
</style>
