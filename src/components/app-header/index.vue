<template>
  <header class="container-fluid header__wrap">
    <div class="row justify-content-between align-items-center header">
      <div class="col-3 d-flex align-items-center">
        <router-link :to="{ name: 'main' }">
          <logo />
        </router-link>
        <a @click="toggleMenu" class="header__mobile-menu" href="javascript:void(0)">
          <open-menu v-if="!isToggleMenu" />
          <close-menu v-else />
        </a>
      </div>
      <div class="col-6 row justify-content-end">
        <div class="header__menu" :class="{ scroll: isScroll }">
          <a v-if="!wallet.connected.value" class="header__get-enkrypt" href="https://www.enkrypt.com/" target="_blank">
            <enkrypt-logo-min-white />
            <span>Get Enkrypt</span>
          </a>

          <!--
          <select-list
            v-if="!isToggleMenu"
            :select="network"
            :items="[chainsData[Chains.SOLANA]]"
            :is-minify="true"
            :is-list-image="true"
            @update:select="selectNetworkAction"
          />
          -->

          <account-select
            v-if="wallet.connected.value && !isToggleMenu"
            :account="walletAccount"
            @disconnect="disconnectWallet"
          ></account-select>
          <a v-else-if="!isToggleMenu && !wallet.connected.value" class="header__connect" @click="openWalletModal" href="javascript:void(0)">
            Connect
          </a>
        </div>
      </div>
    </div>
  </header>

  <wallet-modal
    :isVisible="isWalletModalOpen"
    @update:isVisible="updateWalletModalVisibility"
    @close="isWalletModalOpen = false"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Logo from "@/icons/common/logo.vue";
import EnkryptLogoMinWhite from "@/icons/common/enkrypt-logo-min-white.vue";
import WalletModal from "@/components/modals/wallet-modal/index.vue";
import SelectList from "@/components/select-list/index.vue";
import AccountSelect from "@/components/account-select/index.vue";
import OpenMenu from "@/icons/header/open-menu.vue";
import CloseMenu from "@/icons/header/close-menu.vue";
import { SharedTypes } from "@/store/shared/consts";
import { chainsData } from "@/core/constants/index";
import { ChainDataItem, Chains } from "@/core/interfaces";
import { useWallet } from "solana-wallets-vue";

const store = useStore();
const router = useRouter();
const isScroll = ref<boolean>(false);
const wallet = useWallet();
const network = ref<ChainDataItem>(chainsData[Chains.SOLANA]);
const walletAccount = computed(() => store.getters[SharedTypes.WALLET_ACCOUNT_GETTER]);
const isWalletModalOpen = computed(() => store.getters[SharedTypes.IS_CONNECT_MODAL_VISIBLE_GETTER]);

watch(
  () => wallet.publicKey?.value,
  (newVal) => {
    if (newVal) {
      store.dispatch(SharedTypes.CONNECTED_WALLET_ACTION, wallet.publicKey.value?.toString());
    }
  },
  { immediate: true }
);

const openWalletModal = () => {
  store.dispatch(SharedTypes.CONNECT_MODAL_ACTION, true);
};

const updateWalletModalVisibility = (visible: boolean) => {
  store.dispatch(SharedTypes.CONNECT_MODAL_ACTION, visible);
};

const disconnectWallet = async () => {
  try {
    if (wallet.connected.value) {
      await store.dispatch(SharedTypes.DISCONNECT_WALLET_ACTION);
      await wallet.disconnect();
      router.push('/');
    }
  } catch (err) {
    console.error('Failed to disconnect:', err);
  }
};

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
    if (!isScroll.value) {
      isScroll.value = true;
    }
  } else {
    if (isScroll.value) {
      isScroll.value = false;
    }
  }
};

const selectNetworkAction = (item: ChainDataItem) => {
  network.value = item;
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
    align-items: center;

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
