<template>
    <white-wrapper class="staking-item" :class="{ last: isLast }">
        <div class="staking-item__wrap">
            <img :src="item.chainData.image" class="staking-item__logo" />
            <div class="staking-item__wrap-info">
                <div class="staking-item__wrap-info-name">
                    <h4>{{ item.name }}</h4>
                    <p v-if="item.apr">{{ (parseFloat(item.apr) * 100).toFixed(2) }}% APR</p>
                </div>

                <div class="staking-item__wrap-info-price">
                    <div class="staking-item__wrap-info-price-info">
                        <h4>${{ price[item.token.symbol] }}</h4>
                        <div class="staking-item__wrap-info-price-info-change" 
                          :class="{ red: priceStats.priceChange < 0, green: priceStats.priceChange > 0 }"
                        >
                            <span>
                              {{priceStats.priceChange > 0 ? 
                                `+$${priceStats.priceChange.toFixed(2)}` :
                                `-$${(priceStats.priceChange * -1).toFixed(2)}`}}
                            </span>
                            <span>
                              {{priceStats.priceChangePercentage > 0 ? 
                                `+${priceStats.priceChangePercentage.toFixed(2)}%` : 
                                `-${(priceStats.priceChangePercentage * -1).toFixed(2)}%`}}
                            </span>
                        </div>
                        <p>MCAP ${{ formatValue(priceStats.marketCap) }}</p>
                    </div>
                    <div class="staking-item__wrap-info-price-graph">  
                      <v-chart class="chart" :option="option" />
                    </div>
                </div>
            </div>
        </div>
        <div class="staking-item__buttons">
            <base-button title="Start staking" :action="startAction" :send="true" />
            <base-button :title="`Buy ${item.chainData.name}`" :action="buyAction" :secondary="true" />
            <base-button title="Swap" :action="swapAction" :secondary="true" />
        </div>
    </white-wrapper>
</template>
  
<script setup lang="ts">
import { computed, PropType } from "vue";
import BaseButton from "@/components/base-button/index.vue";
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import { useRouter } from "vue-router";
import { StakingItemByChain } from "@/core/interfaces";
import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import VChart from 'vue-echarts';
import { useStore } from "vuex";
import { SharedTypes } from "@/store/shared/consts";
import { SVGRenderer } from 'echarts/renderers';;
import { TooltipComponent, GridComponent } from 'echarts/components';
import { formatValue } from "@/core/utils";

const router = useRouter();
const store = useStore();

const priceStats = computed(() => store.getters[SharedTypes.PRICE_STATS_GETTER]);
const price = computed(() => store.getters[SharedTypes.PRICE_GETTER]);

defineProps({
  item: {
    type: Object as PropType<StakingItemByChain>,
    default: () => ({}),
  },
  isLast: {
    type: Boolean,
    default: false,
  },
});

use([SVGRenderer, LineChart, TooltipComponent, GridComponent]);

const option = computed(() => {
  return {
    width: 128,
    height: 384,
    color: [priceStats.value.priceChangePercentage >= 0 ? '#15fb3b' : '#e01f43'],
    grid: { show: false, left: 0, top: 0 },
    xAxis: [
      {
        show: false,
        type: 'category',
        showGrid: false,
        boundaryGap: false,
        splitLine: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        show: false,
        type: 'value',
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 1.5,
        },
        showSymbol: false,
        emphasis: {
          focus: 'none',
        },
        data: priceStats.value.priceSparkline ? priceStats.value.priceSparkline : [],
      },
    ],
  }
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
.chart {
  height: 56px;
  width: 128px;
}
  
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
                        
                        .screen-m({
                          line-height: 11px;
                        });

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