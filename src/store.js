import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    translators: [],
  },
  mutations: {
    updateTranslators(state, arr) {
      // eslint-disable-next-line
      state.translators = arr;
      // Vue.set(state, 'translators', [...arr]);
    },
  },
  actions: {

  },
});
