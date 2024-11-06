import { createRouter, createWebHistory } from "vue-router";
import Main from "@/views/main/index.vue";
import StakeEnterAmount from "@/views/stake-enter-amount/index.vue";
import StakeConfirm from "@/views/stake-confirm/index.vue";

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
