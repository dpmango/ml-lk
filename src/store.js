import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const Translators = {
  state: {
    translators: [],
  },
  getters: {
    activeTranslators: state =>
      state.translators.filter(x => x.RemovalDate.length <= 1 && x.BlockDate.length <= 1),
  },
  mutations: {
    updateTranslators(state, arr) {
      state.translators = arr;
      // Vue.set(state, 'translators', [...arr]);
    },
  },
};

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
  },
};

const Chat = {
  state: {
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
    },
  },
  mutations: {
    SOCKET_ONOPEN(state, event) {
      Vue.prototype.$socket = event.currentTarget;
      state.socket.isConnected = true;
    },
    SOCKET_ONCLOSE(state, event) {
      state.socket.isConnected = false;
      console.log('socket closed', event);
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event);
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE(state, message) {
      state.socket.message = message;
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count);
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },
  },
  actions: {
    // sendMessage: function(context, message) {
    //   // .....
    //   Vue.prototype.$socket.send(message);
    //   // .....
    // },
  },
};

export default new Vuex.Store({
  modules: {
    translators: Translators,
    notifications: Notifications,
    chat: Chat,
  },
});
