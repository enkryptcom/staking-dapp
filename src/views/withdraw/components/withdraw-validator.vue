<template>
  <div class="withdraw-validator">
    <div class="withdraw-validator__info">
      <img :src="validator.validatorData.image" alt="" />
      <div class="withdraw-validator__info-block">
        <p>From</p>
        <h3>
          {{ validator.validatorData.name }}
          <!-- <span
            v-if="validator.isHighRisk"
            :class="{ empty: validator.validatorData.name == '' }"
          >
            High risk
          </span> -->
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { ValidatorByChain } from "@/core/interfaces";

defineProps({
  validator: {
    type: Object as PropType<ValidatorByChain>,
    default: null,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.withdraw-validator {
  &__info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 64px;
    padding: 0 16px;

    img {
      width: 32px;
      margin-right: 12px;
      border-radius: 100%;
      box-shadow: @shadowIcon;
    }

    &-block {
      h3 {
        .headline6__Regular();
        color: @primaryLabel;
        margin: 0;

        span {
          padding: 0px 6px;
          height: 18px;
          box-sizing: border-box;
          display: inline-block;
          margin-left: 8px;
          background: @error01;
          border-radius: 20px;
          font-style: normal;
          font-weight: 700;
          font-size: 10px;
          line-height: 18px;
          color: @error;
          position: relative;
          top: -2px;

          &.empty {
            margin-left: 0;
          }
        }
      }

      p {
        .caption__Regular();
        color: @secondaryLabel;
        margin: 0;

        &.over {
          .caption__Bold();
          color: @orange;

          .info-tooltip {
            top: 3px;
            left: 2px;
          }
        }
      }
    }
  }
}
</style>
