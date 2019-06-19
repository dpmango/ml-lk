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
    TOGGLE_LADIESNTF_ONLINE_ALL(state, shouldOn) {
      const stateCopy = state.ladies;
      stateCopy.forEach(x => {
        x.Online = shouldOn ? '1' : '0';
      });
      state.ladies = stateCopy;
    },
    TOGGLE_LADIESNTF_INVITATION(state, tId) {
      const stateCopy = state.ladies;
      state.ladies = toggleObjectKey(stateCopy, tId, 'Invitation');
    },
    TOGGLE_LADIESNTF_INVITATION_ALL(state, shouldOn) {
      const stateCopy = state.ladies;
      stateCopy.forEach(x => {
        x.Invitation = shouldOn ? '1' : '0';
      });
      state.ladies = stateCopy;
    },
  },
};

export default LadiesNtf;
