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
    TOGGLE_LADIESNTF_ONLINE_ALL(state, payload) {
      const stateCopy = state.ladies;
      const targetLadies = stateCopy.filter(x => payload.ladiesIDs.indexOf(x.ID) !== -1);
      targetLadies.forEach(x => {
        x.Online = payload.shouldOn ? '1' : '0';
      });
      state.ladies = stateCopy;
    },
    TOGGLE_LADIESNTF_INVITATION(state, tId) {
      const stateCopy = state.ladies;
      state.ladies = toggleObjectKey(stateCopy, tId, 'Invitation');
    },
    TOGGLE_LADIESNTF_INVITATION_ALL(state, payload) {
      const stateCopy = state.ladies;
      const targetLadies = stateCopy.filter(x => payload.ladiesIDs.indexOf(x.ID) !== -1);
      targetLadies.forEach(x => {
        x.Invitation = payload.shouldOn ? '1' : '0';
      });
      state.ladies = stateCopy;
    },
  },
};

export default LadiesNtf;
