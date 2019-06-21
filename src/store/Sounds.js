const Sounds = {
  state: {
    // activeModules: ['SendInvite'],
    activeSounds: [],
  },
  getters: {
    isSoundModuleActive: state => name => {
      return state.activeSounds.indexOf(name) !== -1;
    },
  },
  mutations: {
    INITIAL_ADD_SOUNDS(state) {
      const ls = localStorage.marmeladies;
      if (!ls) {
        state.activeSounds = ['contactList', 'notificationList'];
      }
    },
    TOGGLE_SOUND_ACTIVE_MODULES(state, payload) {
      const index = state.activeSounds.indexOf(payload);
      const isActiveAlready = index !== -1;
      if (isActiveAlready) {
        state.activeSounds = state.activeSounds.filter(x => x !== payload);
      } else {
        state.activeSounds.push(payload);
      }
    },
  },
};

export default Sounds;
