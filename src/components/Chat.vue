<template>
  <div class="chat" v-if="haveCurrentUsers">
    <div class="chat__head">
      <chat-head/>
      <chat-filter @update="onFilterUpdate"/>
    </div>
    <div class="chat__messenger">
      <div class="messenger">
        <div class="messenger__timestamp" v-if="activeTimestamp">{{activeTimestamp.timestamp}}</div>
        <div class="messenger__list" ref="list">
          <message v-for="(message, idx) in chatList" :key="idx" :data="message" :selfID="selfID"/>
        </div>
        <div class="messenger__add-message">
          <add-message
            @addMessage="sendMessage"
            @addFile="sendFile"
            @sendTypingNotification="typingNotification"
          />
          <span @click="finishChat" class="test">завершить чат (test)</span>
        </div>
      </div>
    </div>
    <modal-photo-list-lady/>
  </div>
</template>

<script>
import throttle from 'lodash/throttle';
import ChatHead from '@/components/Chat/ChatHead.vue';
import ChatFilter from '@/components/Chat/ChatFilter.vue';
import Message from '@/components/Chat/Message.vue';
import AddMessage from '@/components/Chat/AddMessage.vue';
import ModalPhotoListLady from '@/components/Chat/PhotoListLady.vue';
import { timestampToAgoStamp } from '@/helpers/Dates';
import api from '@/helpers/Api';

export default {
  name: 'Chat',
  components: {
    ChatHead,
    ChatFilter,
    Message,
    AddMessage,
    ModalPhotoListLady,
  },
  data() {
    return {
      listMounted: false,
      scrollMessageID: undefined,
      selfID: 1552269,
    };
  },
  created() {
    this.scrollWithThrottle = throttle(this.handleListScroll, 100);
  },
  mounted() {
    this.tryMount();
    // this.$connect(); // ws
    // this.$options.sockets.onopen = data => console.log('onopen', data);
    // this.$options.sockets.onmessage = data => console.log('onmessage', data);
    this.fetchChats();
    this.fetchChatInfo();
  },
  updated() {
    this.tryMount();
  },
  beforeDestroy() {
    this.$refs.list.removeEventListener('scroll', this.scrollWithThrottle, false);
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
    messageDates() {
      return this.chatList.map(x => ({
        messageID: x.ID,
        timestamp: timestampToAgoStamp(x.Date),
      }));
    },
    groupedDates() {
      let grouped = [];
      this.messageDates.forEach(x => {
        if (!grouped.some(g => g.timestamp === x.timestamp)) {
          grouped.push(x);
        }
      });
      return grouped;
    },
    activeTimestamp() {
      if (this.scrollMessageID) {
        let curIndex = 0;
        this.groupedDates.forEach((x, index) => {
          if (this.scrollMessageID >= x.messageID) {
            curIndex = index;
          }
        });
        return this.groupedDates[curIndex];
      }
    },
  },
  methods: {
    tryMount() {
      if (!this.listMounted && this.$refs.list) {
        this.listMounted = true;
        this.$refs.list.addEventListener('scroll', this.scrollWithThrottle, false);
      }
    },
    fetchChats(filterParams) {
      if (!this.haveCurrentUsers) {
        return;
      }
      let queryObj = this.currentUsers;

      if (filterParams) {
        queryObj = { ...queryObj, ...filterParams };
      }

      api
        .get('chats', {
          params: queryObj,
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
            this.showNotification({ type: 'success', title: 'сообщение отправлено' });
            this.fetchChats();
          } else {
            this.showNotification({ message: apiData.message });
          }
        })
        .catch(err => {
          this.showNotification({ message: err });
        });
      // this.$socket.sendObj({msg: 'test'})
    },
    sendFile(file) {
      console.log(file);
      api
        .post(
          'chats/photos',
          {
            man: this.currentUsers.man,
            lady: this.currentUsers.lady,
            file: file,
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        .then(res => {
          const apiData = res.data[0];
          console.log('res post /chats/photos', apiData);
          if (apiData.success) {
            this.showNotification({ type: 'success', title: 'фото загружено' });
            this.fetchChats();
          } else {
            this.showNotification({ message: apiData.message });
          }
        })
        .catch(err => {
          this.showNotification({ message: err });
        });
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
    onFilterUpdate(filter) {
      this.fetchChats(filter);
    },
    handleListScroll() {
      const listDOM = this.$refs.list;
      const scrollTop = listDOM.scrollTop;
      const childNodes = listDOM.childNodes;
      let currentScrollID = undefined;
      childNodes.forEach(x => {
        if (scrollTop + 40 >= x.offsetTop) {
          currentScrollID = x.getAttribute('data-id');
          return;
        }
      });
      this.scrollMessageID = currentScrollID;
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
  position: relative;
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
  &__timestamp {
    position: absolute;
    z-index: 2;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    padding: 3px 15px;
    font-size: 12px;
    line-height: 23px;
    text-align: center;
    min-width: 115px;
    background: #ffffff;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
    border-radius: 50px;
  }
}

.test {
  font-size: 11px;
  padding: 0px 0px 5px 20px;
  cursor: pointer;
}
</style>
