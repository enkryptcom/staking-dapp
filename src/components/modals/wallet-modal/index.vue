<template>
  <CommonModal
    :isVisible="isModalVisible"
    @update:isVisible="updateModalVisibility"
  >
    <template #header>
      <h3>Select Wallet</h3>
    </template>

    <template #body>
      <div class="wallet-modal">
        <div class="wallet-modal__overlay" @click="$emit('close')"></div>
        <div class="wallet-modal__content">
          <ul v-if="installedWallets.length > 0">
            <li
              v-for="wallet in installedWallets"
              :key="wallet.adapter.name"
              @click="connectWallet(wallet)"
            >
              <img
                :src="wallet.adapter.icon"
                alt="wallet icon"
                class="wallet-icon"
              />
              {{ wallet.adapter.name }}
              <span
                v-if="wallet.adapter.readyState !== 'Installed'"
                class="wallet-status"
              >
                ({{ wallet.adapter.readyState }})
              </span>
            </li>
          </ul>

          <base-button
            :title="`Install Enkrypt Wallet`"
            v-else
            :send="true"
            @click="installEnkryptClicked()"
          ></base-button>
        </div>
      </div>
    </template>

    <template #footer>
      <base-button :title="`Close`" :action="closeModal" :secondary="true" />
    </template>
  </CommonModal>
</template>

<script setup lang="ts">
import CommonModal from "@/components/common-modal/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import { ref, watch, computed } from "vue";
import { useWallet } from "solana-wallets-vue";
import type { Adapter, WalletReadyState } from "@solana/wallet-adapter-base";

export type Wallet = {
  adapter: Adapter;
  readyState: WalletReadyState;
};

const wallet = useWallet();

const installedWallets = computed(() => {
  const availableWallets = wallet.wallets ?? [];
  return availableWallets.value
    .filter(
      (wallet: Wallet) =>
        wallet.adapter.readyState === "Installed" ||
        wallet.adapter.readyState === "Loadable"
    )
    .sort((a: Wallet, b: Wallet) => {
      if (a.adapter.name == "Enkrypt") {
        return -1;
      }

      return 0;
    });
});
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["close", "connect", "update:isVisible"]);

const isModalVisible = ref(false);

const closeModal = () => {
  isModalVisible.value = false;
  emit("update:isVisible", false);
};

const updateModalVisibility = (visible: boolean) => {
  isModalVisible.value = visible;
  emit("update:isVisible", visible);
};

const installEnkryptClicked = () => {
  window.open("https://www.enkrypt.com/", "_blank");
};

const connectWallet = async (selectedWallet: any) => {
  isModalVisible.value = false;
  try {
    await wallet.select(selectedWallet.adapter.name);
    await wallet.connect();
  } catch (err) {
    console.error("Wallet connection failed:", err);
  }
  emit("update:isVisible", false);
};

watch(
  () => props.isVisible,
  (newValue) => {
    isModalVisible.value = newValue;
  }
);
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.wallet-modal {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .wallet-icon {
      width: 30px;
      height: 30px;
      margin-right: 20px;
    }

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        flex-direction: row;
        padding: 20px;
        border-radius: 8px;
        align-items: center;
        margin-bottom: 20px;
        cursor: pointer;
        color: #684cff;
        background-color: rgba(104, 76, 255, 0.1);
      }
    }
  }
}
</style>
