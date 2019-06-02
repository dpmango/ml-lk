const Users = {
  state: {
    users: [],
  },
  getters: {
    getUserByID: state => id => state.users.find(x => x.ID === id),
  },
  mutations: {
    ADD_USER(state, arr) {
      state.users = arr;
    },
    REMOVE_USER(state, removeId) {
      state.users = state.users.filter(x => x.ID !== removeId);
    },
  },
};

export default Users;
