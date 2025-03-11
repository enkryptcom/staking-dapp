<template>
  <div class="get-rewarded-banner">
    <h3>Get rewarded by staking your SOL and ETH</h3>
    <p>Help secure these networks and stake with confidence.<br /><a target="_blank" href="https://ccswap.myetherwallet.com/?network=SOLANA&crypto=SOL&platform=enkrypt">Buy tokens</a> or swap assets, and create any staking portfolio you like.</p>
    <p>New to staking? Learn <a href="#">what is staking and how to do it</a>?</p>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.get-rewarded-banner {
  padding: 0 32px 0 32px;
  box-sizing: border-box;
  isolation: isolate;
  margin-bottom: 32px;

  .screen-sm({
    padding: 0;
    margin-bottom: 24px;
  });

  h3 {
    .headline1__Medium();
    color: @accent;
    margin: 0 0 8px 0;
    padding-right: 20%;
    letter-spacing: 1.1px;

    .screen-sm({
      padding-right: 0;
      margin: 0 0 12px 0;
    });
  }

  p {
    .body1__Regular();
    color: @primaryLabel;
    margin: 0 0 38px 0;
    padding-right: 20%;

    .screen-md({
      padding-right: 0;
    });

    &:last-child {
      margin: 0;
    }

    a {
      text-decoration: underline;
      color: @primaryLabel;

      &:hover {
        text-decoration: none;
      }
    }
  }
}
</style>
