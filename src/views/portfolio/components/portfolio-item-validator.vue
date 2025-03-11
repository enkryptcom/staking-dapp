<template>
  <div class="portfolio-item-validator" :class="{ last: isLast }">
    <div class="row justify-content-beetwen align-items-center">
      <div class="col-9">
        <div class="row justify-content-beetwen align-items-center">
          <div class="col-6">
            <div class="portfolio-item-validator__info">
              <img :src="validator.validatorData.image" alt="" />
              <div class="portfolio-item-validator__info-block">
                <h3>{{ validator.validatorData.name }}</h3>
                <div class="portfolio-item-validator__info-status" :class="statusClassObject">
                  <span>{{ item.status }}</span>
                  <info-tooltip 
                    v-if="isShowTooltip"
                    :text="infoTooltipText"
                    :fill="tooltipColor"
                    :opacity="tooltipOpacity"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-2">
            <h3 class="text">
              Balance
            </h3>
            <h3 class="portfolio-item-validator__info-amount">
              {{ $filters.cryptoCurrencyFormat(item.balance / LAMPORTS_IN_SOL) }} <span>{{ token?.symbol }}</span>
            </h3>
          </div>
          <div class="col-2">
            <h3 class="text">
              Reward
            </h3>
            <h3 class="portfolio-item-validator__info-amount" :class="amountClassObject">
              {{ $filters.cryptoCurrencyFormat(item.reward) }} <span>{{ token?.symbol }}</span>
            </h3>
          </div>
        </div>
      </div>
      <div class="col-3 portfolio-item-validator__buttons">
        <base-button v-if="item.status === Statuses.ACTIVE || item.status === Statuses.ACTIVATING"
          title="Unstake"
          :stroke="true"
          :small="true"
          @click="() => unstakeAction(indexValue)"
        />
        <base-button v-if="item.status === Statuses.INACTIVE" 
          title="Withdraw"
          :stroke="true"
          :small="true"
          @click="withdrawAction(indexValue)"
        />
        <!-- <base-button v-if="item.status === Statuses.EMPTY" title="Close" :stroke="true" :small="true" /> -->
        <!-- <base-button v-if="item.status === Statuses.INACTIVE" title="Stake" :small="true" /> -->

        <a @click="moreAction" class="portfolio-item-validator__buttons-more" href="javascript:void(0)">
          <more-icon />
          <div class="portfolio-item-validator__menu" v-on:click="detailsAction" :class="{ visible: isShowsMenu }" ref="menu">
            <a href="#">View in explorer</a>
          </div>
        </a>
      </div>    
    </div>    
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, ref } from "vue";
import BaseButton from "@/components/base-button/index.vue";
import { PortfolioItemStatus } from "@/types/portfolio";
import { PortfolioItem } from "@/core/interfaces";
import { validators } from "@/core/constants";
import MoreIcon from "@/icons/common/more-icon.vue";
import InfoTooltip from "@/components/info-tooltip/index.vue";
import { onClickOutside } from "@vueuse/core";
import { useRouter } from "vue-router";
import { Statuses, Token } from "@/core/interfaces";
import { StakingTypes } from "@/store/modules/staking/consts";
import { useStore } from "vuex";
import { SharedTypes } from "@/store/shared/consts";
import { openSolscanExplorerAddress } from "@/utils/browser";
import { LAMPORTS_IN_SOL } from "@/core/constants";

const router = useRouter();
const store = useStore();

const isShowsMenu = ref(false);
const menu = ref(null);

const props = defineProps({
  item: {
    type: Object as PropType<PortfolioItem>,
    default: () => ({}),
  },
  indexValue: {
    type: Number,
    default: null,
  },
  token: {
    type: Object as PropType<Token>,
    default: null,
  },
  isLast: {
    type: Boolean,
    default: false,
  },
});

const activeChain = computed(() => store.getters[SharedTypes.CHAIN_GETTER]);
const network = computed(() => store.getters[SharedTypes.NETWORK_GETTER]);

const amountClassObject = computed(() => ({
  'portfolio-item-validator__info-amount--green': props.item.reward > 0,
  'portfolio-item-validator__info-amount--gray':  props.item.reward == 0 && props.item.balance > 0
}));

const statusClassObject = computed(() => ({
  'portfolio-item-validator__info-status--activating': props.item.status == PortfolioItemStatus.activating,
  'portfolio-item-validator__info-status--active': props.item.status == PortfolioItemStatus.active,
  'portfolio-item-validator__info-status--deactivating': props.item.status == PortfolioItemStatus.deactivating,
  'portfolio-item-validator__info-status--unstaked': props.item.status == PortfolioItemStatus.unstaked,
  'portfolio-item-validator__info-status--empty': props.item.status == PortfolioItemStatus.empty,
}));

const isShowTooltip = computed(() => {
  return props.item.status == PortfolioItemStatus.activating || props.item.status == PortfolioItemStatus.deactivating || props.item.status == PortfolioItemStatus.empty
});

const infoTooltipText = computed(() => {
  if(props.item.status == PortfolioItemStatus.activating) {
    return "Your SOL is currently staked with a validator. You'll need to unstake to access these funds";
  } else if(props.item.status == PortfolioItemStatus.deactivating) {
    return "You will be able to withdraw your stake in the next couple days once the stake account becomes unstaked.";
  } 

  return "Your SOL is currently staked with a validator. You'll need to unstake to access these funds"
});

const validator = computed(() => {
  return validators[props.item.provider][activeChain.value];
});

const tooltipColor = computed(() => {
  if(props.item.status == PortfolioItemStatus.activating) {
    return "#0099FF";
  } else if(props.item.status == PortfolioItemStatus.deactivating) {
    return "#FFCC00";
  } 

  return "black"
});

const tooltipOpacity = computed(() => {
  if(props.item.status == PortfolioItemStatus.activating || props.item.status == PortfolioItemStatus.deactivating) {
    return "1";
  } 

  return "0.32"
});

const moreAction = () => {
  isShowsMenu.value = true;
};

onClickOutside(menu, () => {
  if (isShowsMenu.value) isShowsMenu.value = false;
});

const unstakeAction = async (index: number) => {
  store.dispatch(StakingTypes.SET_DEACTIVATING_STAKE_ACTION, index);
  router.push({ name: 'unstake' });
};

const withdrawAction = async (index: number) => {
  store.dispatch(StakingTypes.SET_WITHDRAW_STAKE_ACTION, index);
  router.push({ name: 'withdraw' });
};

const detailsAction = () => {
  openSolscanExplorerAddress(props.item.stakeAccount, network.value);
};

</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.portfolio-item-validator {
  padding: 0 0 0 64px;
  box-sizing: border-box;
  font-size: 0;
  background-color: @gray002;
  margin-bottom: 8px;
  border-radius: 16px;

  .screen-xs({
    padding: 16px;
    position: relative;
  });

  &.last {
    margin-bottom: 0;
  }

  & > .row {
    min-height: 32px;
  }

  .col-6, .col-2 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 30.7%;
    flex: 0 0 30.7%;
    max-width: 30.7%;
    align-items: center;

    .screen-xs({
      -webkit-box-flex: 0;
      -ms-flex: 0 0 100%;
      flex: 0 0 100%;
      max-width: 100%;
      flex-direction: row;
      display: flex;
    });

    .text {
      display: none;
      .body1__Regular();
      color: @secondaryLabel;

      .screen-xs({
        display: inline-block;
      });
    }
  }

  .col-9 {
    .screen-lg({
      -webkit-box-flex: 0;
      -ms-flex: 0 0 65%;
      flex: 0 0 65%;
      max-width: 65%;
    });

    .screen-xs({
      -webkit-box-flex: 0;
      -ms-flex: 0 0 100%;
      flex: 0 0 100%;
      max-width: 100%
    });
  }

  .col-3 {
    .screen-lg({
      -webkit-box-flex: 0;
      -ms-flex: 0 0 35%;
      flex: 0 0 35%;
      max-width: 35%;
    });

    .screen-xs({
      -webkit-box-flex: 0;
      -ms-flex: 0 0 100%;
      flex: 0 0 100%;
      max-width: 100%
    });
  }

  &__info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 64px;
    padding: 0 16px 0 0;
    position: relative;

    .screen-xs({
      height: auto;
      padding: 0;
      margin-bottom: 16px;
    });

    img {
      width: 32px;
      height: 32px;
      border-radius: 100%;
      box-shadow: @shadowIcon;
      position: absolute;
      left: -48px;
      top: 50%;
      margin-top: -16px;

      .screen-xs({
        position: relative;
        left: 0;
        top: 0;
        margin-top: 0;
        margin-right: 16px;
      });
    }

    &-amount {
      .body1__Regular();
      margin: 0;
      color: @primaryLabel;
      text-align: right;

      .screen-xs({
        text-align: left;
        margin-left: auto;
        display: inline-block
      });

      span {
        text-transform: uppercase
      }

      &--gray {
        color: @tertiaryLabel;
      }

      &--green {
        color: @success;

        &::before {
          content: "+";
        }
      }
    }

    &-block {
      h3 {
        .body1__Regular();
        margin: 0;
        color: @primaryLabel;
      }
    }

    &-status {
      .caption__Regular();
      color: @secondaryLabel;
      margin: 0;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      span {
        text-transform: capitalize;
      }
      
      svg {
        margin-left: 2px;
      }

      &--activating {
        color: @alertsBlue;
      }

      &--active {
        color: @alertsGreen;
      }

      &--deactivating {
        color: @alertsYellow;
      }

      &--unstaked {
        color: @alertsOrange;
      }

      &--empty {
        color: @tertiaryLabel;
      }
    }
  }

  &__buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    .screen-xs({
      justify-content: stretch;
      position: static;
    });

    &-more {
      padding: 8px;
      display: block;
      position: relative;
      margin: 0 8px;
      cursor: pointer;

      .screen-xs({
        position: absolute;
        right: 0;
        top: 14px;
      });
    }

    .base-button {
      margin-left: 8px;

      &:first-child {
        margin-left: 0;
      }

      .screen-xs({
        width: 100% !important;
        text-align: center
      });
    }
  }

  &__menu {
    position: absolute;
    top: 12px;
    left: 100%;
    margin-left: 0;
    padding: 18px 16px;
    position: absolute;
    width: 205px;
    background: @white;
    border-radius: 8px;
    .sizing();
    .transition(opacity, 300ms);
    opacity: 0;
    box-shadow: @shadow16;
    z-index: 101;
    display: none;

    .screen-xs({
      left: auto;
      right: 100%;
      top: 20px;
    });

    a {
      text-decoration: none;
      .body2__Medium();
      color: @primaryLabel;

      &:hover {
        text-decoration: underline;
      }
    }

    &.visible {
      opacity: 1;
      display: block;
    }
  }
}
</style>
