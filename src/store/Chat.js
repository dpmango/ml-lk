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
    enterForSubmit: false,
    chats: [],
    info: [],
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
    getUserFromMessageSender: state => (users, sender) => {
      let res = {};
      const pair = findByUsers(state.info, users);
      if (pair) {
        const pairMan = pair.data.Man;
        const pairLady = pair.data.Lady;
        if (pairMan.ID === sender) {
          res = pairMan;
        } else if (pairLady.ID === sender) {
          res = { ...pairLady, ...{ isLady: true } };
        }
      }
      return res;
    },
  },
  mutations: {
    SET_CHAT_CURRENTUSERS(state, users) {
      if (state.currentUsers.man === users.man && state.currentUsers.lady === users.lady) {
        state.currentUsers = {
          man: undefined,
          lady: undefined,
        };
      } else {
        state.currentUsers = users;
      }
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
    PREPEND_CHAT_LIST(state, payload) {
      const stateCopy = state.chats;
      const targetChat = findByUsers(stateCopy, payload.users);

      const targetIndex = stateCopy.indexOf(targetChat);
      const shiftedPrepend = payload.list;
      targetChat.list = [...shiftedPrepend, ...targetChat.list];
      stateCopy[targetIndex] = targetChat;
      state.chats = stateCopy;
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
    CHAT_TOGGLE_FAVORITE(state, users) {
      const stateCopy = state.info;
      const targetChat = findByUsers(state.info, users);
      const targetIndex = stateCopy.indexOf(targetChat);

      targetChat.data.Favorite = !targetChat.data.Favorite;
      stateCopy[targetIndex] = targetChat;
      state.info = stateCopy;
    },
    CHAT_TOGGLE_BLOCKED(state, users) {
      const stateCopy = state.info;
      const targetChat = findByUsers(state.info, users);
      const targetIndex = stateCopy.indexOf(targetChat);

      targetChat.data.Blocked = !targetChat.data.Blocked;
      stateCopy[targetIndex] = targetChat;
      state.info = stateCopy;
    },
    CHAT_TOGGLE_MESSAGE_MARKED(state, payload) {
      const stateCopy = state.chats;
      const targetChat = findByUsers(stateCopy, payload.users);
      const chatIndex = stateCopy.indexOf(targetChat);
      const targetMessage = targetChat.list.find(x => x.ID === payload.messageID);
      const messageIndex = targetChat.list.indexOf(targetMessage);

      targetMessage.Marked = payload.isMarked ? '0' : '1';
      stateCopy[chatIndex].list[messageIndex] = targetMessage;
      state.chats = stateCopy;
    },
    TOGGLE_ENTER_TO_SUBMIT(state) {
      state.enterForSubmit = !state.enterForSubmit;
    },
  },
  actions: {},
};

export default Chat;
