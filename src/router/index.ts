import { createRouter, createWebHistory } from "vue-router";
import Main from "@/views/main/index.vue";
import StakeEnterAmount from "@/views/stake-enter-amount/index.vue";
import StakeConfirm from "@/views/stake-confirm/index.vue";
import Portfolio from "@/views/portfolio/index.vue";
import Unstake from "@/views/unstake/index.vue";
import Withdraw from "@/views/withdraw/index.vue";

const routes = {
  main: {
    path: "/",
    components: {
      view: Main,
    },
    name: "main",
  },
  stake: {
    path: "/staking",
    children: [
      {
        path: "",
        components: {
          view: StakeEnterAmount,
        },
        name: "stake",
      },
      {
        path: "confirm",
        components: {
          view: StakeConfirm,
        },
        name: "stake-confirm",
      },
    ],
  },
  portfolio: {
    path: "/portfolio",
    components: {
      view: Portfolio,
    },
    name: "portfolio",
  },
  unstake: {
    path: "/unstake",
    components: {
      view: Unstake,
    },
    name: "unstake",
  },
  withdraw: {
    path: "/withdraw",
    components: {
      view: Withdraw,
    },
    name: "withdraw",
  },
};

export default createRouter({
  history: createWebHistory(),
  routes: Object.values(routes),
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
        top: 71,
      };
    }
  },
});

export { routes };
