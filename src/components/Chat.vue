<template>
  <div class="chat">
    <div class="chat__head head-chat">head</div>
    <div class="chat__messenger">
      <div class="messenger">
        <div class="messenger__list">
          <message/>
        </div>
        <div class="messenger__add-message">
          <textarea name id rows="5"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Message from '@/components/Chat/Message.vue';

export default {
  name: 'Chat',
  components: {
    Message,
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
  &__list {
    flex: 1 1 auto;
  }
  &__add-message {
    flex: 0 0 auto;
  }
}
</style>