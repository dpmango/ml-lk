const Translators = {
  state: {
    translators: [],
  },
  getters: {
    activeTranslators: state =>
      state.translators.filter(x => x.RemovalDate.length <= 1 && x.BlockDate.length <= 1),
  },
  mutations: {
    updateTranslators(state, arr) {
      state.translators = arr;
      // Vue.set(state, 'translators', [...arr]);
    },
  },
};

export default Translators;
