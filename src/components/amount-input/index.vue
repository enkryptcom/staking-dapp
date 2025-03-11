<template>
  <div class="amount-input" :class="{ error: isError }">
    <img :src="token.image" class="amount-input__icon" />
    <base-button
      class="amount-input__max"
      title="Max"
      @click="onMaxClicked"
      :class="{ error: !hasEnoughBalance }"
      :secondary="true"
      :small="true"
    />
    <div class="amount-input__balance" :class="{ error: !hasEnoughBalance }">
      Balance: {{ maxValue }}
    </div>
    <div class="amount-input__wrapper">
      <input
        ref="inputRef"
        v-model="amountValue"
        type="text"
        inputmode="decimal"
        class="amount-input__input"
        placeholder="0"
        :class="{ error: isMinValue && props.value != '0' }"
        oninput="this.size = this.value.length"
      />
      <span v-show="props.value != '0'" @click="focus" :class="{ error: isMinValue }">{{ token.symbol }}</span>
    </div>

    <p v-if="props.value !== '0'" class="amount-input__fiat">
      <span v-if="innerErrorMessage" class="amount-input__inner-error">
        <alert-icon-small />
        {{ innerErrorMessage }}
      </span>
      <span v-else>
        ~{{ $filters.currencyFormat(amountUsd, "USD") }}
      </span>
    </p>
    <p v-else class="amount-input__fiat">
      {{ $filters.currencyFormat(0, "USD") }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, ref, ComponentPublicInstance, onMounted } from "vue";
import BaseButton from "@/components/base-button/index.vue";
import AlertIconSmall from "@/icons/common/alert-icon-small.vue";
import { SharedTypes } from "@/store/shared/consts";
import { useStore } from "vuex";
import { BASE_TOKENS } from "@/core/constants";
import { Token } from "@/core/interfaces";

const store = useStore();

const inputRef = ref<ComponentPublicInstance<HTMLInputElement>>();

defineExpose({ inputRef });

const props = defineProps({
  token: {
    type: Object as PropType<Token>,
    default: null,
  },
  isError: {
    type: Boolean,
    default: false,
  },
  hasEnoughBalance: {
    type: Boolean,
    default: false,
  },
  isMinValue: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: () => {
      return "";
    },
  },
  maxValue: {
    type: Number,
    default: 0,
  },
  innerErrorMessage: {
    type: String,
    default: "",
  },
});

onMounted(() => {
  focus()
});

const emit = defineEmits(["update:amount"]);

const amountValue = computed({
  get: () => props.value,
  set: (value) => {
    value = value.replace(",", ".");

    if (value === "." || value === "") {
      emit("update:amount", "");
      return;
    }

    let sanitizedValue = value.match(/^\d*\.?\d*$/) ? value : "";

    if (/^0\d+/.test(sanitizedValue)) {
      sanitizedValue = sanitizedValue.replace(/^0+/, "");
    }

    emit("update:amount", sanitizedValue);

    if (sanitizedValue !== value && inputRef.value) {
      inputRef.value.value = sanitizedValue;
    }
  },
});

const prices = computed(() => store.getters[SharedTypes.PRICE_GETTER]);
const activeChain = computed(() => store.getters[SharedTypes.CHAIN_GETTER]);
const amountUsd = computed(() => {
  const value = parseFloat(amountValue.value || "0");
  const price = prices.value?.[BASE_TOKENS[activeChain.value].symbol] || 0;
  return value * price;
});

const focus = () => {
  if (inputRef.value) inputRef.value.focus();
};

const onMaxClicked = () => {
  amountValue.value = props.maxValue.toString();
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.amount-input {
  width: 100%;
  display: block;
  text-decoration: none;
  position: relative;
  box-sizing: border-box;
  padding: 12px 98px 12px 60px;
  border: 1.5px solid @accent;
  border-radius: 16px;
  margin-bottom: 12px;

  &.error {
    border: 1.5px solid @error;
    color: @error !important;
  }

  &__inner-error {
    color: @secondaryLabel;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    svg {
      margin-right: 8px;
    }
  }

  &__wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    span {
      .headline4__Regular();
      color: @primaryLabel;
      font-variant: small-caps;
      text-transform: uppercase;
      display: inline-block;
      margin-bottom: 4px;

      &.error {
        color: @error !important;
      }
    }
  }

  &__input {
    width: auto;
    .headline4__Regular();
    color: @primaryLabel;
    border: 0 none;
    outline: none;
    padding: 0;
    margin-bottom: 4px;

    &.error {
      color: @error !important;
    }

    &[type="number"]::-webkit-outer-spin-button,
    &[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    &::placeholder {
      color: @tertiaryLabel;
    }
  }

  &__icon {
    position: absolute;
    box-shadow: @shadowIcon;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    left: 16px;
    top: 16px;
  }

  &__max {
    position: absolute;
    right: 16px;
    top: 16px;
  }

  &__balance {
    position: absolute;
    right: 16px;
    top: 56px;
    .body2__Regular();
    color: @tertiaryLabel;

    &.error {
      color: @error !important;
    }
  }

  &__fiat {
    .body2__Regular();
    color: @tertiaryLabel;
    margin: 0;
  }
}
</style>
