<template>
  <div class="validator-info">
    <img :src="validator.validatorData.image" alt="" />
    <div class="validator-info__name">
      <p>Validator</p>
      <h5>{{ validator.validatorData.name }}</h5>
    </div>
    <div class="validator-info__apy">
      <h5>{{ $filters.percentFormat(validator.apy) }} APY</h5>
    </div>
    <div class="validator-info__fee">
      <h5>{{ $filters.percentFormat(validator.fee) }} fee</h5>
    </div>
  </div>
  <a href="https://solana.com/validators" target="_blank" rel="noopener noreferrer" class="validator-info__info">
    <info-icon />
    <span>What is a validator?</span>
  </a>
</template>

<script setup lang="ts">
import { ValidatorByChain } from "@/core/interfaces";
import { PropType } from "vue";
import InfoIcon from "@/icons/common/info-icon.vue";

defineProps({
  validator: {
    type: Object as PropType<ValidatorByChain>,
    default: null,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.validator-info {
  background: @white;
  .sizing();
  padding: 16px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin: 0 0 12px 0;

  &__name {
    padding-left: 12px;
    padding-right: 8px;
    min-width: 130px;

    .screen-sm({
      min-width: auto;
    });

    p {
      .caption__Regular();
      margin: 0 0 1px 0;
      color: @secondaryLabel;
    }

    h5 {
      .body1__Regular();
      margin: 0;
      color: @primaryLabel;
    }
  }

  &__apy {
    padding-right: 8px;
    padding-top: 17px;
    min-width: 120px;

    .screen-sm({
      min-width: auto;
    });

    h5 {
      .body1__Regular();
      margin: 0;
      color: @tertiaryLabel;
    }
  }

  &__fee {
    min-width: 67px;
    padding-top: 17px;

    .screen-sm({
      min-width: auto;
    });

    h5 {
      .body1__Regular();
      margin: 0;
      color: @tertiaryLabel;
    }
  }

  &__info {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    .caption__Regular();
    color: @secondaryLabel;
    padding-left: 32px;

    svg {
      margin-right: 12px;
    }

    &:hover {
      text-decoration: none;
    }
  }
}
</style>
  