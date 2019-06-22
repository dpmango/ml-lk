import { toggleObjectKey } from '@/helpers/StoreHelpers';

const findByUsers = (arr, users) => {
  return arr.find(x => x.Man.ID === users.man && x.Lady.ID === users.lady);
};

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
    getActiveNotification: state => users => {
      const res = findByUsers(state.notifications, users);
      return res ? res.ID : {};
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
    NOTIFICATION_UPDATE_OR_PREPEND(state, payload) {
      const stateCopy = state.notifications;
      const targetNtf = stateCopy.find(x => x.ID === payload.notification.ID);
      if (targetNtf) {
        // existing notification
        const targetIndex = stateCopy.indexOf(targetNtf);
        targetNtf.Marked = payload.notification.Marked;
        targetNtf.Message = payload.notification.Message;
        targetNtf.LastMessageDate = payload.notification.LastMessageDate;
        targetNtf.Man.Online = payload.notification.Man.Online;
        targetNtf.Lady.Online = payload.notification.Lady.Online;
        if (!payload.isCurrentChat) {
          targetNtf.New = payload.notification.New;
        }
        stateCopy[targetIndex] = targetNtf;
        /* eslint-disable */
        stateCopy.sort((x, y) =>
          x.ID === payload.notification.ID ? -1 : y.ID === payload.notification.ID ? 1 : 0,
        );
        /* eslint-enable */
        state.notifications = stateCopy;
      } else {
        state.notifications.unshift(payload.notification);
      }
    },
    NOTIFICATION_READ(state, users) {
      const stateCopy = state.notifications;
      const targetNtf = findByUsers(stateCopy, users);
      if (targetNtf) {
        const targetIndex = stateCopy.indexOf(targetNtf);
        targetNtf.New = 'N';
        stateCopy[targetIndex] = targetNtf;
        state.notifications = stateCopy;
      }
    },
    NOTIFICATION_TOGGLE_MARKED(state, tId) {
      const stateCopy = state.notifications;
      state.notifications = toggleObjectKey(stateCopy, tId, 'Marked');
    },
    NOTIFICATION_TOGGLE_LADY_ONLINE(state, payload) {
      const stateCopy = state.notifications;
      const ids = payload.ladiesIDs ? payload.ladiesIDs : [payload.ladyId];
      const targetNotifications = stateCopy.filter(x => ids.indexOf(x.Lady.ID) !== -1);
      targetNotifications.forEach(x => {
        x.Lady.Online = payload.shouldOn ? '1' : '0';
      });
      state.notifications = stateCopy;
    },
  },
};

export default Notifications;
