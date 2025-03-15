<template>
  <white-wrapper class="portfolio-item__wrap">
    <div
      class="portfolio-item container-inner"
      @click="toggle"
    >
      <div class="row justify-content-beetwen align-items-center">
        <div class="col-8">
          <div class="portfolio-item__info">
            <img :src="item.baseToken?.image" alt="" />
            <div class="row justify-content-beetwen align-items-center portfolio-item__info-block">
              <div class="col-4">
                <h6 class="portfolio-item__info-label">Total staked</h6>
                <p class="portfolio-item__info-value">
                  {{ $filters.cryptoCurrencyFormat(item.totalStaked / LAMPORTS_IN_SOL) }} <span>{{ item.baseToken?.symbol }}</span>
                </p>
                <p v-if="prices?.[BASE_TOKENS[activeChain].symbol]" class="portfolio-item__info-amount">
                  ~{{ $filters.currencyFormat(totalStakedUsd, "USD") }}
                </p>
              </div>
              <div class="col-4">
                <h6 class="portfolio-item__info-label">Total rewards</h6>
                <p class="portfolio-item__info-value portfolio-item__info-value--green">
                  {{ $filters.cryptoCurrencyFormat(item.totalRewards) }} <span>{{ item.baseToken?.symbol }}</span>
                </p>
                <p class="portfolio-item__info-amount">
                  ~{{ $filters.currencyFormat(totalRewardsUsd, "USD") }}
                </p>
              </div>
              <div class="col-4">
                <h6 class="portfolio-item__info-label">Avg. Yield</h6>
                <p class="portfolio-item__info-value portfolio-item__info-value--regular">
                  ~{{ $filters.percentFormat(stakingItems[activeChain].apr) }}
                </p>
                <p class="portfolio-item__info-amount">&nbsp;</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4 row justify-content-end align-items-center">
          <base-button title="Stake more" :small="true" @click="onStakeMoreClicked" />

          <div class="portfolio-item__details">
            <span>Details</span>
            <expand class="portfolio-item__arrow" :class="{ open: isOpen }" />
          </div>
        </div>
      </div>
    </div>
    <Transition name="fade">
      <div v-show="isOpen" class="portfolio-item__detail">
        <div class="row justify-content-beetwen align-items-center portfolio-item__info-header">
          <div class="col-9">
            <div class="row justify-content-beetwen align-items-center">
              <div class="col-6">
                <p class="portfolio-item__info-header-label">Validator</p>
              </div>
              <div class="col-2">
                <p class="portfolio-item__info-header-label portfolio-item__info-header-label--right">Balance</p>
              </div>
              <div class="col-2">
                <p class="portfolio-item__info-header-label portfolio-item__info-header-label--right">Reward</p>
              </div>
            </div>
          </div>
        </div>      

        <portfolio-item-validator
          v-for="(validator, index) in item.items"
          :key="index"
          :item="validator"
          :indexValue="index"
          :token="item.baseToken"
          :is-last="index == item.items.length - 1"
        ></portfolio-item-validator>
      </div>
    </Transition>
  </white-wrapper>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import Expand from "@/icons/common/expand.vue";
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import { PortfolioByChain } from "@/core/interfaces";
import PortfolioItemValidator from "./portfolio-item-validator.vue";
import BaseButton from "@/components/base-button/index.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { SharedTypes } from "@/store/shared/consts";
import { BASE_TOKENS } from "@/core/constants";
import { LAMPORTS_IN_SOL } from "@/core/constants";
import { StakingTypes } from "@/store/modules/staking/consts";

const router = useRouter();
const store = useStore();

const isOpen = ref<boolean>(false);

const props = defineProps({
  item: {
    type: Object as PropType<PortfolioByChain>,
    default: () => ({}),
  },
});

const prices = computed(() => store.getters[SharedTypes.PRICE_GETTER]);
const activeChain = computed(() => store.getters[SharedTypes.CHAIN_GETTER]);
const stakingItems = computed(() => store.getters[StakingTypes.STAKING_ITEMS_GETTER]);

const totalStakedUsd = computed(() => {
  const price = prices.value?.[BASE_TOKENS[activeChain.value].symbol] || 0;
  return (props.item.totalStaked / LAMPORTS_IN_SOL) * price;
});
const totalRewardsUsd = computed(() => {
  const price = prices.value?.[BASE_TOKENS[activeChain.value].symbol] || 0;
  return props.item.totalRewards * price;
});

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const onStakeMoreClicked = (e: Event) => {
  e.stopPropagation();
  router.push({ name: "stake" });
}
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.portfolio-item {
  height: 64px;
  cursor: pointer;
  border-radius: 8px;
  .transition(background, 0.3s);
  padding: 0 0 0 16px;
  position: relative;

  .screen-xs({
    padding: 0;
    height: auto;
  });

  &__wrap {
    margin-bottom: 16px;
  }

  .col-4, .col-8 {
    .screen-xs({
      -webkit-box-flex: 0;
      -ms-flex: 0 0 100%;
      flex: 0 0 100%;
      max-width: 100%;
    });
  }

  &__info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 64px;

    .screen-xs({
      height: auto;
      align-items: start;
    });

    img {
      width: 32px;
      margin-right: 16px;

      .screen-xs({
        margin-top: 14px;
      });
    }

    &-label {
      .caption__Regular();
      color: @secondaryLabel;
      margin: 0;
    }

    &-value {
      .headline6__Medium();
      color: @primaryLabel;
      margin: 0;

      span {
        text-transform: uppercase;
      }

      &--green {
        color: @success;
      }

      &--regular {
        .headline6__Regular();
      }
    }

    &-amount {
      .caption__Regular();
      color: @secondaryLabel;
      margin: 0;
    }

    &-block {
      width: 100%;

      .col-4 {
        &:not(:first-child) {
          .screen-xs({
            -webkit-box-flex: 0;
            -ms-flex: 0 0 50%;
            flex: 0 0 50%;
            max-width: 50%;
            padding: 16px 0;
          });
        }
      }
    }

    &-header {
      padding-left: 64px;
      margin-bottom: 8px;

      .screen-xs({
        display: none;
      });

      .col-6, .col-2 {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 30.7%;
        flex: 0 0 30.7%;
        max-width: 30.7%;
      }

      .col-9 {
        .screen-lg({
          -webkit-box-flex: 0;
          -ms-flex: 0 0 65%;
          flex: 0 0 65%;
          max-width: 65%;
        });
      }

      .col-3 {
        .screen-lg({
          -webkit-box-flex: 0;
          -ms-flex: 0 0 35%;
          flex: 0 0 35%;
          max-width: 35%;
        });
      }

      &-label {
        .button__Small();
        color: @secondaryLabel;
        margin: 0;

        &--right {
          text-align: right
        }
      }
    }
  }

  &__arrow {
    margin-left: 4px;
    .transition(all, 0.3s);

    &.open {
      .rotate(180deg);
    }
  }

  &__details {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 32px;
    padding: 0 4px;
    margin-left: 12px;

    span {
      .button__Small();
      color: @primaryLabel;
    }
  }

  &__detail {
    padding: 16px 0 0 0;
    margin: 16px 0 0 0;
    border-top: 1px solid @accent01;

    .screen-xs({
      border-top: 0 none;
      padding: 0;
    });
  }

  .justify-content-end {
    .screen-xs({
      -webkit-box-pack: center !important;
      -ms-flex-pack: center !important;
      justify-content: center !important;
      position: static;
    });
  }

  .base-button {
    .screen-xs({
      position: absolute;
      right: 0;
      top: 14px;
    });
  }
}

.fade-enter-active {
  animation: fadeIn 0.3s;
}
.fade-leave-active {
  animation: fadeOut 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
