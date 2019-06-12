import { toggleObjectKey } from '@/helpers/StoreHelpers';

const LadiesNtf = {
  state: {
    ladies: [],
  },
  getters: {
    ladiesNtfListLastId: state => {
      return state.ladies[state.ladies.length - 2].ID;
    },
  },
  mutations: {
    SET_LADIESNTF(state, arr) {
      state.ladies = arr;
    },
    APPEND_LADIESNTF(state, arr) {
      state.ladies = state.ladies.concat(arr);
    },
    TOGGLE_LADIESNTF_ONLINE(state, tId) {
      const stateCopy = state.ladies;
      state.ladies = toggleObjectKey(stateCopy, tId, 'Online');
    },
    TOGGLE_LADIESNTF_INVITATION(state, tId) {
      const stateCopy = state.ladies;
      state.ladies = toggleObjectKey(stateCopy, tId, 'Invitation');
    },
  },
};

export default LadiesNtf;
