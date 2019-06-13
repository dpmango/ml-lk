const Page = {
  state: {
    // activeModules: ['SendInvite'],
    activeModules: [],
  },
  mutations: {
    TOGGLE_PAGE_ACTIVE_MODULES(state, payload) {
      const index = state.activeModules.indexOf(payload);
      const isActiveAlready = index !== -1;

      if (isActiveAlready) {
        state.activeModules = state.activeModules.filter(x => x !== payload);
      } else {
        state.activeModules.push(payload);
      }
    },
  },
};

export default Page;
