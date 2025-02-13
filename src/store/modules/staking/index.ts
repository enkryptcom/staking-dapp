import { actions } from "./actions";
import { mutations, initialState } from "./mutations";
import { getters } from "./getters";

const stakingStore = {
  namespaced: true,
  state: initialState,
  actions,
  mutations,
  getters,
};

export default stakingStore;
