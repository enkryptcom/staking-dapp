<template>
  <div class="account-select" v-if="account">
    <a ref="toggle" class="account-select__block" @click="toggleAction">
      <img :src="wallet.wallet.value?.adapter.icon" />
      <span>{{ $filters.replaceWithEllipsis(account.address, 4, 4) }}</span>
      <arrow-down />
    </a>
    <div v-show="isOpen" ref="dropdown" class="account-select__dropdown">
      <div class="account-select__info">
        <img :src="wallet.wallet.value?.adapter.icon" />
        <span>{{ $filters.replaceWithEllipsis(account.address, 4, 4) }}</span>
        <div class="account-select__info-action" @click="onCopyClicked">
          <copy-icon />
        </div>
        <div class="account-select__info-action" @click="onLinkClicked">
          <link-icon />
        </div>
      </div>
      <div class="account-select__amount">
        {{ $filters.cryptoCurrencyFormat(walletBalance) }} <span>sol</span>
      </div>
      <a @click="disconnectAction" class="account-select__disconnect">
        <logout-icon />
        <span>Disconnect</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { PropType, ref, computed } from "vue";
import { Account } from "@/types/account";
import ArrowDown from "@/icons/common/arrow-down.vue";
import { onClickOutside } from "@vueuse/core";
import CopyIcon from "@/icons/common/copy-icon.vue";
import LinkIcon from "@/icons/common/link-icon.vue";
import LogoutIcon from "@/icons/common/logout-icon.vue";
import { SharedTypes } from "@/store/shared/consts";
import { copyToClipboard, openSolscanExplorerAddress } from "@/utils/browser";
import { useWallet } from "solana-wallets-vue";

const wallet = useWallet();
const isOpen = ref<boolean>(false);
const dropdown = ref(null);
const toggle = ref(null);
const store = useStore();

const walletBalance = computed(() => store.getters[SharedTypes.WALLET_BALANCE_GETTER]);
const network = computed(() => store.getters[SharedTypes.NETWORK_GETTER]);

const props = defineProps({
  account: {
    type: Object as PropType<Account>,
    default: null,
  },
});

const emit = defineEmits(["disconnect"]);

const toggleAction = () => {
  isOpen.value = !isOpen.value;
};

const disconnectAction = () => {
  emit("disconnect");
  toggleAction();
};

const onCopyClicked = () => {
  copyToClipboard(props.account.address);
  alert("Address has been copied")
}

const onLinkClicked = () => {
  openSolscanExplorerAddress(props.account.address, network.value);
}

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

.account-select {
  .sizing();
  position: relative;

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
      margin-right: 8px;
    }

    span {
      .body1__Medium();
      color: @accent;
      display: block;
      margin-right: 8px;
    }
  }

  &__dropdown {
    position: absolute;
    right: 0;
    top: 42px;
    background: @white;
    box-shadow: @shadow16;
    border-radius: 16px;
    min-width: calc(~"100% - 4px");
    z-index: 2;
  }

  &__info {
    padding: 16px 16px 9px 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    img {
      width: 24px;
    }

    span {
      .body1__Medium();
      color: @primaryLabel;
      display: block;
      margin: 0 8px;
    }

    &-action {
      display: block;
      margin-right: 4px;
      font-size: 0;
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__amount {
    padding: 0 16px 15px 48px;
    .headline6__Medium();
    color: @primaryLabel;

    span {
      text-transform: uppercase;
    }
  }

  &__disconnect {
    padding: 16px;
    border-top: 1px solid @accent01;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    text-decoration: none;
    cursor: pointer;

    span {
      display: block;
      .body1__Medium();
      color: @primaryLabel;
      margin-left: 8px;
    }
  }
}
</style>
