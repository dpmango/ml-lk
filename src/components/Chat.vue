<template>
  <div class="chat">
    <div class="chat__head">
      <chat-head :enabled.sync="enabled"/>
    </div>
    <div class="chat__messenger">
      <div class="messenger">
        <div class="messenger__list">
          <message v-for="(message, idx) in chatList" :key="idx" :data="message" :selfID="selfID"/>
        </div>
        <div class="messenger__add-message">
          <add-message :enabled="enabled" @addMessage="sendMessage"/>
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
  },
  methods: {
    fetchApi() {
      api
        .get('chats', {
          params: {
            // man: 1156964,
            // lady: 1543646,
            man: 1714654,
            lady: 1552269,
          },
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
      console.log(val);
      // this.$socket.sendObj({msg: 'test'})
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
