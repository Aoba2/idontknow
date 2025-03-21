import { createStore } from "vuex";
import { getAcessManager } from "../services/accessManeger";
import { getLocalStorageWithExpiry, removeLocalStorage } from "../utils/utils";

export default createStore({
  state: {
    user: null,
    accessManager: {},
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setAccessManager(state, accessManager) {
      state.accessManager = accessManager;
    },
  },
  actions: {
    async getAccessManager({ commit }) {
      const response = await getAcessManager();
      commit("setAccessManager", response.data);
    },
    loadUser({ commit }) {
      const userSalvo = getLocalStorageWithExpiry("userPublicar");

      if (userSalvo !== null) {
        commit("setUser", userSalvo);
      } else {
        removeLocalStorage("user");
        commit("setUser", null);
      }
    },
  },
  getters: {
    getuser: (state) => state.user,
  },
});
