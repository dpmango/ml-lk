<template>
  <div class="chat" v-if="storeUsers.man && storeUsers.lady">
    <div class="chat__head">
      <chat-head :enabled.sync="enabled" :params="storeUsers"/>
    </div>
    <div class="chat__messenger">
      <div class="messenger">
        <div class="messenger__list">
          <message v-for="(message, idx) in chatList" :key="idx" :data="message" :selfID="selfID"/>
        </div>
        <div class="messenger__add-message">
          <add-message :enabled="enabled" :params="storeUsers" @addMessage="sendMessage"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatHead from '@/components/Chat/ChatHead.vue';
import Message from '@/components/Chat/Message.vue';
import AddMessage from '@/components/Chat/AddMessage.vue';
import api from '@/helpers/Api';

export default {
  name: 'Chat',
  components: {
    ChatHead,
    Message,
    AddMessage,
  },
  data() {
    return {
      enabled: {
        isEnabled: true,
        reason: '',
      },
      selfID: 1552269,
      chatList: [],
    };
  },
  mounted() {
    this.$connect(); // ws
    this.$options.sockets.onopen = data => console.log('onopen', data);
    this.$options.sockets.onmessage = data => console.log('onmessage', data);
    this.fetchApi();
  },
  beforeDestroy() {
    this.$disconnect();
    this.finishChat();
  },
  computed: {
    storeUsers() {
      return this.$store.state.chat.users;
    },
  },
  methods: {
    fetchApi() {
      if (!this.storeUsers.man || !this.storeUsers.lady) {
        console.log('no store users defined');
        return;
      }
      api
        .get('chats', {
          params: this.storeUsers,
        })
        .then(res => {
          console.log('res /chats', res.data);
          this.chatList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    sendMessage(val) {
      api
        .post('chats', {
          man: this.storeUsers.man,
          lady: this.storeUsers.lady,
          text: val,
        })
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
            console.log('res post /chats', apiData);
          } else {
            this.showNotification({ message: apiData.message });
          }
        })
        .catch(err => {
          this.showNotification({ message: err });
        });
      // this.$socket.sendObj({msg: 'test'})
    },
    finishChat() {
      api
        .post('chats/finish', {
          man: this.storeUsers.man,
          lady: this.storeUsers.lady,
        })
        .then(res => {})
        .catch(err => {
          console.log(err);
        });
    },
    // watchStore() {
    //   this.$store.watch(
    //     (state, getters) => state.chat.users,
    //     (newValue, oldValue) => {
    //       // // Do whatever makes sense now
    //       if (oldValue !== newValue) {
    //         this.params = newValue;
    //         this.fetchApi();
    //       }
    //     },
    //   );
    // },
  },
  watch: {
    storeUsers(Old, New) {
      if (Old.man !== New.man || Old.lady !== New.lady) {
        this.fetchApi();
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
