import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    translators: [],
  },
  getters: {
    activeTranslators: state => state.translators.filter(x => x.RemovalDate.length <= 1 && x.BlockDate.length <= 1),
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
