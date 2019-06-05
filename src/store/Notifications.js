const Notifications = {
  state: {
    notifications: [],
  },
  getters: {
    notificationsListLastId: state => {
      return state.notifications[state.notifications.length - 1].ID;
    },
  },
  mutations: {
    NOTIFICATIONS_SET(state, arr) {
      state.notifications = arr;
    },
    NOTIFICATIONS_APPEND(state, arr) {
      state.notifications = state.notifications.concat(arr.slice(1));
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
    NOTIFICATION_TOGGLE_MARKED(state, readId) {
      const stateCopy = state.notifications;
      const targetNtf = stateCopy.find(x => x.ID === readId);
      const targetIndex = stateCopy.indexOf(targetNtf);
      targetNtf.Marked = targetNtf.Marked === '1' ? '0' : '1';
      stateCopy[targetIndex] = targetNtf;
      state.notifications = stateCopy;
    },
  },
};

export default Notifications;
