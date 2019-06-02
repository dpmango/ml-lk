import Vue from 'vue';

const Chat = {
  state: {
    users: {
      man: undefined,
      lady: undefined,
    },
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
    },
  },
  mutations: {
    setChatUsers(state, user) {
      state.users = user;
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
};

export default Chat;
