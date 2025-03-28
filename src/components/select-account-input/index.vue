<template>
  <div class="select-account-input">
    <a ref="toggle" class="select-account-input__info" @click="toggleAccounts" href="javascript:void(0)">
      <img v-if="account.image" :src="account.image" />
      <div v-else class="select-account-input__info-icon"></div>
      <div class="select-account-input__info-name">
        <h5 class="select-account-input__title">{{ title }}</h5>
        <p>
          {{ account.name }}
          <span>
            {{ $filters.replaceWithEllipsis(account.address, 6, 6) }}
          </span>
          <span v-if="isAmount">
            {{ $filters.cryptoCurrencyFormat(15.9) }} <span>dot</span>
          </span>
        </p>
      </div>
      <chevron-small-down />
    </a>

    <dropdown-wrapper v-if="isOpenDropdown" ref="dropdown">
      <account-select
        :accounts="accounts"
        @update:select-account="selectAccount"
      />
    </dropdown-wrapper>
  </div>
</template>

<script setup lang="ts">
import ChevronSmallDown from "@/icons/common/chevron-small-down.vue";
import DropdownWrapper from "@/components/dropdown-wrapper/index.vue";
import AccountSelect from "@/components/account-select/index.vue";
import { Account } from "@/types/account";
import { PropType, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const isOpenDropdown = ref<boolean>(false);
const dropdown = ref(null);
const toggle = ref(null);

const emit = defineEmits<{
  (e: "update:select", account: Account): void;
}>();

defineProps({
  account: {
    type: Object as PropType<Account>,
    default: null,
  },
  accounts: {
    type: Object as PropType<Array<Account>>,
    default: () => ({}),
  },
  title: {
    type: String,
    default: "From",
  },
  isAmount: {
    type: Boolean,
    default: false,
  },
});

const toggleAccounts = () => {
  isOpenDropdown.value = !isOpenDropdown.value;
};

const selectAccount = (account: Account) => {
  emit("update:select", account);
  toggleAccounts();
};

onClickOutside(
  dropdown,
  () => {
    toggleAccounts();
  },
  { ignore: [toggle] }
);
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.select-account-input {
  width: 100%;
  height: 64px;
  display: block;
  text-decoration: none;
  position: relative;
  box-sizing: border-box;
  padding: 0 16px;
  border: 1px solid @gray01;
  border-radius: 16px;
  margin-bottom: 16px;
  .transition(all, 0.3s);

  &:hover {
    border: 1px solid @gray02;
  }

  &__title {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.5px;
    color: @secondaryLabel;
    margin: 0 0 3px 0;
  }

  &__info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    width: auto;
    text-decoration: none;
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 100%;

    &-icon {
      width: 32px;
      height: 32px;
      background: @gray004;
      box-shadow: inset 0px 0px 1px @gray016;
      margin-right: 12px;
      border-radius: 50%;
    }

    img {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      border-radius: 50%;
    }
    &-name {
      p {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        color: @primaryLabel;
        margin: 0;
      }
      span {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        color: @tertiaryLabel;
        display: inline-block;
        margin-left: 4px;

        & > span {
          text-transform: uppercase;
          margin-left: 0;
        }
      }
    }
    svg {
      position: absolute;
      top: 50%;
      right: 4px;
      margin-top: -12px;
    }
  }
}
</style>
