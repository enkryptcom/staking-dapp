<template>
  <div class="account-select" v-if="account">
    <a ref="toggle" class="account-select__block" @click="toggleAction" href="javascript:void(0)">
      <img :src="walletIcon" />
      <span>{{ $filters.replaceWithEllipsis(account.address, 4, 4) }}</span>
      <arrow-down />
    </a>
    <div v-show="isOpen" ref="dropdown" class="account-select__dropdown">
      <div class="account-select__info">
        <img :src="walletIcon" />
        <span>{{ $filters.replaceWithEllipsis(account.address, 4, 4) }}</span>
        <a class="account-select__info-action" @click="onCopyClicked" href="javascript:void(0)">
          <copy-icon />
        </a>
        <a class="account-select__info-action" @click="onLinkClicked" href="javascript:void(0)">
          <link-icon />
        </a>
      </div>
      <div v-if="isRootstock" class="account-select__amount">
       {{rbtcBalance <= MIN_BALANCE_EVM ? '<': ''  }} {{ $filters.cryptoCurrencyFormat(rbtcBalance) }} <span>RBTC</span>
      </div>
      <div class="account-select__amount">
        <template v-if="isRootstock">
          {{ Number(walletBalance || 0).toFixed(0) }}&nbsp;
        </template>
        <template v-else>
          {{ $filters.cryptoCurrencyFormat(walletBalance) }}
        </template>
        <span>{{ balanceSymbol }}</span>
      </div>
      <div v-if="isRootstock" class="account-select__amount">
        {{ Number(usdrifBalance || 0).toFixed(0) }} <span>USDRIF</span>
      </div>
      <a @click="disconnectAction" class="account-select__disconnect" href="javascript:void(0)">
        <logout-icon />
        <span>Disconnect</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { PropType, ref, computed, watch } from "vue";
import { Account } from "@/types/account";
import ArrowDown from "@/icons/common/arrow-down.vue";
import { onClickOutside } from "@vueuse/core";
import CopyIcon from "@/icons/common/copy-icon.vue";
import LinkIcon from "@/icons/common/link-icon.vue";
import LogoutIcon from "@/icons/common/logout-icon.vue";
import { SharedTypes } from "@/store/shared/consts";
import { copyToClipboard, openExplorerAddress } from "@/utils/browser";
import { useWallet } from "solana-wallets-vue";
import { Chains } from "@/core/interfaces";
import { BASE_TOKENS, MIN_BALANCE_EVM, ROOTSTOCK_USDRIF_TOKEN_ADDRESS } from "@/core/constants/index";
import EvmWalletService from "@/core/services/evmWalletService";

const wallet = useWallet();
const isOpen = ref<boolean>(false);
const dropdown = ref(null);
const toggle = ref(null);
const store = useStore();
const evmWalletService = EvmWalletService.getInstance();

const props = defineProps({
  account: {
    type: Object as PropType<Account>,
    default: null,
  },
});

const walletBalance = computed(() => store.getters[SharedTypes.WALLET_BALANCE_GETTER]);
const network = computed(() => store.getters[SharedTypes.NETWORK_GETTER]);
const activeChain = computed(() => store.getters[SharedTypes.CHAIN_GETTER]);
const walletIcon = computed(() => props.account?.image ?? wallet.wallet.value?.adapter.icon ?? "");
const isRootstock = computed(() => activeChain.value === Chains.ROOTSTOCK);
const rbtcBalance = ref<number>(0);
const usdrifBalance = ref<number>(0);
const balanceSymbol = computed(() => {
  const chain = activeChain.value as Chains;
  return BASE_TOKENS[chain]?.symbol?.toUpperCase?.() ?? "";
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
  openExplorerAddress(props.account.address, activeChain.value as Chains, network.value);
}

watch(
  [() => props.account?.address, activeChain],
  async ([address, chain]) => {
    if (!address || chain !== Chains.ROOTSTOCK) {
      rbtcBalance.value = 0;
      usdrifBalance.value = 0;
      return;
    }

    try {
      const [nextRbtcBalance, nextUsdrifBalance] = await Promise.all([
        evmWalletService.loadBalance(address),
        evmWalletService.loadTokenBalance(address, ROOTSTOCK_USDRIF_TOKEN_ADDRESS),
      ]);
      rbtcBalance.value = nextRbtcBalance;
      usdrifBalance.value = nextUsdrifBalance;
    } catch {
      rbtcBalance.value = 0;
      usdrifBalance.value = 0;
    }
  },
  { immediate: true }
);

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
    text-decoration: none;

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

    &--secondary {
      padding-top: 0;
      color: @secondaryLabel;
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
