<template>
    <white-wrapper class="staking-item" :class="{ last: isLast }">
        <div class="staking-item__wrap">
            <img :src="item.image" class="staking-item__logo" />
            <div class="staking-item__wrap-info">
                <div class="staking-item__wrap-info-name">
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.apr }}% APR</p>
                </div>

                <div class="staking-item__wrap-info-price">
                    <div class="staking-item__wrap-info-price-info">
                        <h4>${{ item.balance }}</h4>
                        <div class="staking-item__wrap-info-price-info-change green">
                            <span>+${{ item.priceChange }}</span>
                            <span>+{{ item.percentChange }}%</span>
                        </div>
                        <p>MCAP ${{ item.mcap }}B</p>
                    </div>
                    <div class="staking-item__wrap-info-price-graph">
                        <img src="../../../assets/pic/green.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
        <div class="staking-item__buttons">
            <base-button title="Start staking" :action="startAction" :send="true" />
            <base-button :title="`Buy ${item.network.name}`" :action="buyAction" :secondary="true" />
            <base-button title="Swap" :action="swapAction" :secondary="true" />
        </div>
    </white-wrapper>
</template>
  
<script setup lang="ts">
import { PropType } from "vue";
import BaseButton from "@/components/base-button/index.vue";
import { StakingItem } from "@/types/stakingItem";
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
  item: {
    type: Object as PropType<StakingItem>,
    default: () => ({}),
  },
  isLast: {
    type: Boolean,
    default: false,
  },
});

const startAction = () => {
  router.push({ name: "stake" });
};

const buyAction = () => {
  
};

const swapAction = () => {
  
};
</script>
  
<style lang="less" scoped>
@import "@/assets/styles/theme.less";
  
.staking-item {
  margin-bottom: 32px;
  padding: 32px;

  .screen-sm({
    padding: 16px;
    margin-bottom: 24px;
  });

  &__logo {
    width: 64px;
    height: 64px;
    display: block;
    margin-right: 24px;
  }

  &__wrap {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    margin-bottom: 24px;

    .screen-sm({
      align-items: start;
    });

    &-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .screen-sm({
          display: block;
        });

        &-name {
            h4 {
                .headline5__Regular();
                margin: 0;
                color: @primaryLabel;
            }

            p {
                .headline6__Regular();
                margin: 0;
                color: @accent;
            }
        }

        &-price {
            display: flex;
            flex-direction: row;
            justify-content: end;
            align-items: center;

            .screen-sm({
              justify-content: start;
              padding-top: 8px;
            });

            &-info {
                h4 {
                    .body1__Medium();
                    margin: 0;
                    color: @primaryLabel;
                }

                p {
                    margin: 0;
                    color: @secondaryLabel;
                    .small__Medium();
                }

                &-change {
                    padding: 3px 4px;
                    border-radius: 4px;
                    display: inline-block;
                    margin: 1px 0;
                    vertical-align: middle;
                    font-size: 0;

                    span {
                        .small__Semibold();
                        color: @white;
                        margin-right: 4px;
                        display: inline-block;

                        &:last-child {
                            margin-right: 0;
                        }
                    }

                    &.green {
                        background-color: @success;
                    }

                    &.red {
                        background-color: @error;
                    }
                }
            }

            &-graph {
                margin-left: 16px;
            }
        }
    }
  }

  &__buttons {
    padding-left: 88px;

    .screen-sm({
      padding-left: 0;
    });

    a {
        margin-right: 16px;

        &:last-child {
            margin-right: 0;
        }

        .screen-sm({
          width: 100%;
          margin: 0 0 16px 0;
          text-align: center;
        });
    }
  }
}
</style>