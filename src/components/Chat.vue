<template>
  <div class="chat">
    <div class="chat__head">
      <chat-head :enabled.sync="enabled"/>
    </div>
    <div class="chat__messenger">
      <div class="messenger">
        <div class="messenger__list">
          <message/>
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
    };
  },
  mounted() {
    this.$connect(); // ws
    this.$options.sockets.onopen = data => console.log('onopen', data);
    this.$options.sockets.onmessage = data => console.log('onmessage', data);
  },
  beforeDestroy() {
    this.$disconnect();
  },
  methods: {
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
  flex-direction: column;
  &__list {
    flex: 1 1 auto;
  }
  &__add-message {
    flex: 0 0 auto;
  }
}
</style>
