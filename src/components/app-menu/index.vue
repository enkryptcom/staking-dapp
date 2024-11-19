<template>
  <div class="app-menu container-fluid" :class="{ 'open-mobile': isToggleMenu }">
    <div class="app-menu__container">
      <div class="app-menu__wrap">
        <router-link :to="{ name: 'main' }" class="main with-submenu">
          <home-icon />
          <span>Staking home</span>
        </router-link>
        <div class="app-menu__sub-menu">
          <a href="#">Solana staking</a>
          <a href="#">Ethereum staking</a>
          <a href="#">Aptos staking</a>
          <span>+36 other chains</span>
        </div>
        <router-link :to="{ name: 'portfolio' }" class="portfolio">
          <portfolio-icon />
          <span>My staking portfolio</span>
        </router-link>
        <router-link :to="{ path: 'swap' }" class="swap">
          <swap-icon />
          <span>Swap</span>
        </router-link>
        <router-link :to="{ path: 'buy-crypto' }" class="buy">
          <buy-icon />
          <span>Buy crypto</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeIcon from "@/icons/menu/home-icon.vue";
import PortfolioIcon from "@/icons/menu/portfolio-icon.vue";
import SwapIcon from "@/icons/menu/swap-icon.vue";
import BuyIcon from "@/icons/menu/buy-icon.vue";

defineProps({
  isToggleMenu: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.app-menu {
  height: 100vh;
  box-sizing: border-box;
  padding-top: 91px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 0;
  width: 100%;

  .screen-sm({
    display: none;
  });

  &.open-mobile {
    background-color: @primaryBg;
    z-index: 99;

    .screen-sm({
      display: block;
    });
  }

  &__container {
    position: relative;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
  }

  &__wrap {
    box-sizing: border-box;
    padding-left: 0;
    padding-right: 24px;
    .sizing();
    width: 23%;

    .screen-sm({
      width: 100%;
    });

    .screen-md-min({
      width: 20.8595%;
    });

    @media (min-width: 1400px) {
      width: 21.214%;
    }

    .screen-lg({
      padding-right: 16px;
    });

    a {
      .body1__Regular();
      .transition(color, 0.3s);
      color: @primaryLabel;
      text-decoration: none;
      display: block;
      margin-bottom: 19px;

      &.with-submenu {
        margin-bottom: 0;
      }

      svg {
        margin-right: 4px;
      }

      span, svg {
        display: inline;
        vertical-align: middle;
      }

      &:hover {
        color: @primaryLabel;
      }

      &:active {
        color: @tertiaryLabel;
      }

      &.main, &.swap {
        svg {
          stroke: @black;
          opacity: 0.9;
        }
      }

      &.portfolio, &.buy {
        svg {
          fill: @black;
          stroke: @black;
          opacity: 0.9;
        }
      }

      &.router-link-active {
        color: @accent;
        .body1__Bold();

        &.main, &.swap {
          svg {
            stroke: @accent;
            opacity: 1;
          }
        }

        &.portfolio, &.buy {
          svg {
            fill: @accent;
            stroke: @accent;
            opacity: 1;
          }
        }
      }
    }

    .enkrypt-banner {
      margin-top: 44px;
    }
  }

  &__sub-menu {
    padding-left: 24px;
    margin-bottom: 18px;

    a, span {
      .body1__Regular();
      .transition(color, 0.3s);
      color: @primaryLabel;
      text-decoration: none;
      display: block;
      margin: 8px 0 0 0;
    }
  }
}
</style>
