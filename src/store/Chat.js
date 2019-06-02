import Vue from 'vue';

const findByUsers = (arr, users) => {
  return arr.find(x => x.users.man === users.man && x.users.lady === users.lady);
};

// chats = Array{
//   users: {},
//   list: [],
// }

// info = Array{
//   users: {},
//   data: {},
// }

const Chat = {
  state: {
    currentUsers: {
      man: undefined,
      lady: undefined,
    },
    chats: [],
    info: [],
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
    },
  },
  getters: {
    haveCurrentUsers: state => state.currentUsers.man && state.currentUsers.lady,
    selectChatByUsers: state => users => {
      const res = findByUsers(state.chats, users);
      return res ? res.list : [];
    },
    selectInfoByUsers: state => users => {
      const res = findByUsers(state.info, users);
      return res ? res.data : {};
    },
  },
  mutations: {
    SET_CHAT_CURRENTUSERS(state, users) {
      state.currentUsers = users;
    },
    SET_CHAT_LIST(state, payload) {
      const stateCopy = state.chats;
      const storeChat = findByUsers(state.chats, payload.users);

      if (storeChat === undefined) {
        // new chat
        state.chats.push(payload);
      } else {
        // update
        const targetIndex = stateCopy.indexOf(storeChat);
        storeChat.list = payload.list;
        stateCopy[targetIndex] = storeChat;
        state.chats = stateCopy;
      }
    },
    SET_CHAT_INFO(state, payload) {
      const stateCopy = state.info;
      const storeChat = findByUsers(state.info, payload.users);

      if (storeChat === undefined) {
        // new chat
        state.info.push(payload);
      } else {
        // update
        const targetIndex = stateCopy.indexOf(storeChat);
        storeChat.data = payload.data;
        stateCopy[targetIndex] = storeChat;
        state.info = stateCopy;
      }
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
