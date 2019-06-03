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
      man: 1714654,
      lady: 1552269,
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
    getAvatarFromSender: state => (users, sender) => {
      let res = {};
      const pair = findByUsers(state.info, users);
      if (pair) {
        const pairMan = pair.data.Man;
        const pairLady = pair.data.Lady;
        if (pairMan.ID === sender) {
          res = pairMan;
        } else if (pairLady.ID === sender) {
          res = pairLady;
        }
      }
      return res;
    },
  },
  mutations: {
    SET_CHAT_CURRENTUSERS(state, users) {
      state.currentUsers = users;
    },
    SET_CHAT_LIST(state, payload) {
      const stateCopy = state.chats;
      const targetChat = findByUsers(state.chats, payload.users);

      if (targetChat === undefined) {
        // new chat
        state.chats.push(payload);
      } else {
        // update
        const targetIndex = stateCopy.indexOf(targetChat);
        targetChat.list = payload.list;
        stateCopy[targetIndex] = targetChat;
        state.chats = stateCopy;
      }
    },
    SET_CHAT_INFO(state, payload) {
      const stateCopy = state.info;
      const targetChat = findByUsers(state.info, payload.users);

      if (targetChat === undefined) {
        // new chat
        state.info.push(payload);
      } else {
        // update
        const targetIndex = stateCopy.indexOf(targetChat);
        targetChat.data = payload.data;
        stateCopy[targetIndex] = targetChat;
        state.info = stateCopy;
      }
    },
    CHAT_ADD_FAVORITE(state, users) {
      const stateCopy = state.info;
      const targetChat = findByUsers(state.info, users);
      const targetIndex = stateCopy.indexOf(targetChat);

      targetChat.Favorite = true;
      stateCopy[targetIndex] = targetChat;
      state.info = stateCopy;
    },
    CHAT_REMOVE_FAVORITE(state, users) {
      const stateCopy = state.info;
      const targetChat = findByUsers(state.info, users);
      const targetIndex = stateCopy.indexOf(targetChat);

      targetChat.Favorite = false;
      stateCopy[targetIndex] = targetChat;
      state.info = stateCopy;
    },
    CHAT_ADD_BLOCKED(state, users) {
      const stateCopy = state.info;
      const targetChat = findByUsers(state.info, users);
      const targetIndex = stateCopy.indexOf(targetChat);

      targetChat.Blocked = true;
      stateCopy[targetIndex] = targetChat;
      state.info = stateCopy;
    },
    CHAT_REMOVE_BLOCKED(state, users) {
      const stateCopy = state.info;
      const targetChat = findByUsers(state.info, users);
      const targetIndex = stateCopy.indexOf(targetChat);

      targetChat.Blocked = false;
      stateCopy[targetIndex] = targetChat;
      state.info = stateCopy;
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
