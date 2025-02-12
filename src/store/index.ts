import { createStore } from "vuex";
import sharedStore from "./shared";
import stakingStore from "./modules/staking";

export const store = createStore({
  modules: {
    sharedStore,
    stakingStore
  },
});
