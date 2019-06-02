<template>
  <div class="chat" v-if="haveCurrentUsers">
    <div class="chat__head">
      <chat-head/>
    </div>
    <div class="chat__messenger">
      <div class="messenger">
        <div class="messenger__list">
          <message v-for="(message, idx) in chatList" :key="idx" :data="message" :selfID="selfID"/>
        </div>
        <div class="messenger__add-message">
          <add-message @addMessage="sendMessage" @sendTypingNotification="typingNotification"/>
        </div>
      </div>
    </div>
    <modal-photo-list-lady/>
  </div>
</template>

<script>
import ChatHead from '@/components/Chat/ChatHead.vue';
import Message from '@/components/Chat/Message.vue';
import AddMessage from '@/components/Chat/AddMessage.vue';
import ModalPhotoListLady from '@/components/Chat/PhotoListLady.vue';
import api from '@/helpers/Api';

export default {
  name: 'Chat',
  components: {
    ChatHead,
    Message,
    AddMessage,
    ModalPhotoListLady,
  },
  data() {
    return {
      selfID: 1552269,
    };
  },
  mounted() {
    // this.$connect(); // ws
    // this.$options.sockets.onopen = data => console.log('onopen', data);
    // this.$options.sockets.onmessage = data => console.log('onmessage', data);
    this.fetchChats();
    this.fetchChatInfo();
  },
  beforeDestroy() {
    // this.$disconnect();
    this.finishChat();
  },
  computed: {
    currentUsers() {
      return this.$store.state.chat.currentUsers;
    },
    chatList() {
      return this.$store.getters.selectChatByUsers(this.currentUsers);
    },
    haveCurrentUsers() {
      return this.$store.getters.haveCurrentUsers;
    },
  },
  methods: {
    fetchChats() {
      if (!this.haveCurrentUsers) {
        return;
      }
      api
        .get('chats', {
          params: this.currentUsers,
        })
        .then(res => {
          this.$store.commit('SET_CHAT_LIST', {
            users: this.currentUsers,
            list: res.data,
          });
        })
        .catch(err => {
          this.showNotification({ message: err });
        });
    },
    fetchChatInfo() {
      if (!this.haveCurrentUsers) {
        return;
      }
      api
        .get('chats/info', {
          params: this.currentUsers,
        })
        .then(res => {
          this.$store.commit('SET_CHAT_INFO', {
            users: this.currentUsers,
            data: res.data[0],
          });
        })
        .catch(err => {
          this.showNotification({ message: err });
        });
    },
    sendMessage(val) {
      api
        .post('chats', {
          man: this.currentUsers.man,
          lady: this.currentUsers.lady,
          text: val,
        })
        .then(res => {
          const apiData = res.data[0];
          console.log('res post /chats', apiData);
          if (apiData.success) {
          } else {
            this.showNotification({ message: apiData.message });
          }
        })
        .catch(err => {
          this.showNotification({ message: err });
        });
      // this.$socket.sendObj({msg: 'test'})
    },
    typingNotification() {
      api
        .get('chats/typing', {
          params: this.currentUsers,
        })
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
            console.log('res get /chats/typing', apiData);
          } else {
            this.showNotification({ message: apiData.message });
          }
        })
        .catch(err => {
          this.showNotification({ message: err });
        });
    },
    finishChat() {
      api
        .post('chats/finish', this.currentUsers)
        .then(res => {})
        .catch(err => {
          this.showNotification({ message: err });
        });
    },
  },
  watch: {
    currentUsers(Old, New) {
      // when current users change - request new data from API
      if (Old.man !== New.man || Old.lady !== New.lady) {
        this.fetchChats();
        this.fetchChatInfo();
      }
    },
  },
  notifications: {
    showNotification: {
      title: 'Ошибка',
      type: 'error',
    },
  },
};
</script>


<style lang="scss" scoped>
@import '@/theme/utils.scss';

.chat {
  background: $colorBg;
  height: calc(100vh - 80px - 40px);
  display: flex;
  flex-direction: column;
  padding: 12px;
  &__head {
    flex: 0 0 auto;
  }
  &__messenger {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 2px;
  }
}

.messenger {
  flex: 1 1 auto;
  display: flex;
  max-height: 100%;
  flex-direction: column;
  &__list {
    flex: 1 1 auto;
    max-height: 100%;
    padding: 15px 20px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 3px;
      margin-top: 10px;
    }

    &::-webkit-scrollbar-track {
      border-left: 3px solid rgba(black, 0.2);
      margin-top: 20px;
      margin-bottom: 20px;
    }

    &::-webkit-scrollbar-thumb {
      border-left: 3px solid $colorOrange;
    }
  }
  &__add-message {
    flex: 0 0 auto;
  }
}
</style>
