import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    translators: [],
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
    },
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
});
