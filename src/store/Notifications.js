import { toggleObjectKey } from '@/helpers/StoreHelpers';

const Notifications = {
  state: {
    pagination: {
      current: 1,
      next: 1,
      all: 1,
      isNextAvaiable: true,
    },
    notifications: [],
  },
  getters: {
    notificationsListLastId: state => {
      return state.notifications[state.notifications.length - 1].ID;
    },
  },
  mutations: {
    SET_NOTIFICATIONS(state, arr) {
      state.notifications = arr;
    },
    APPEND_NOTIFICATIONS(state, arr) {
      // slice(1)
      state.notifications = state.notifications.concat(arr);
    },
    SET_NOTIFICATIONS_PAGINATION(state, payload) {
      const headers = {
        current: parseInt(payload['x-pagination-current-page'], 10),
        all: parseInt(payload['x-pagination-page-count'], 10),
      };
      const nextNum = headers.current + 1;
      state.pagination = {
        current: headers.current,
        next: nextNum,
        all: headers.all,
        isNextAvaiable: nextNum <= headers.all,
      };
    },
    NOTIFICATION_REMOVE(state, removeId) {
      state.notifications = state.notifications.filter(x => x.ID !== removeId);
    },
    NOTIFICATION_READ(state, readId) {
      const stateCopy = state.notifications;
      const targetNtf = stateCopy.find(x => x.ID === readId);
      const targetIndex = stateCopy.indexOf(targetNtf);
      targetNtf.New = 'N';
      stateCopy[targetIndex] = targetNtf;
      state.notifications = stateCopy;
    },
    NOTIFICATION_TOGGLE_MARKED(state, tId) {
      const stateCopy = state.notifications;
      state.notifications = toggleObjectKey(stateCopy, tId, 'Marked');
    },
  },
};

export default Notifications;
