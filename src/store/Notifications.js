const Notifications = {
  state: {
    notifications: [],
  },
  mutations: {
    setNotifications(state, arr) {
      state.notifications = arr;
    },
    removeNotification(state, removeId) {
      state.notifications = state.notifications.filter(x => x.ID !== removeId);
    },
    readNotification(state, readId) {
      const stateCopy = state.notifications;
      const targetNtf = stateCopy.find(x => x.ID === readId);
      const targetIndex = stateCopy.indexOf(targetNtf);
      targetNtf.New = 'N';
      stateCopy[targetIndex] = targetNtf;
      state.notifications = stateCopy;
    },
    markNotification(state, readId) {
      const stateCopy = state.notifications;
      const targetNtf = stateCopy.find(x => x.ID === readId);
      const targetIndex = stateCopy.indexOf(targetNtf);
      targetNtf.Marked = '1';
      stateCopy[targetIndex] = targetNtf;
      state.notifications = stateCopy;
    },
    unmarkNotification(state, readId) {
      const stateCopy = state.notifications;
      const targetNtf = stateCopy.find(x => x.ID === readId);
      const targetIndex = stateCopy.indexOf(targetNtf);
      targetNtf.Marked = '0';
      stateCopy[targetIndex] = targetNtf;
      state.notifications = stateCopy;
    },
  },
};

export default Notifications;
