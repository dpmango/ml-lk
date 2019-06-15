<template>
  <div class="chat" v-if="haveCurrentUsers">
    <div class="chat__head">
      <chat-head/>
      <chat-filter :filter="filter"/>
    </div>
    <div class="chat__messenger">
      <div class="messenger">
        <div
          class="messenger__timestamp"
          v-if="activeTimestamp && !scrollFetch.isLoading"
        >{{activeTimestamp.timestamp}}</div>
        <spinner
          class="messenger__loader"
          v-if="scrollFetch.isLoading"
          size="medium"
          line-fg-color="#5aa6ff"
        />
        <div class="messenger__list" ref="list">
          <message v-for="(message, idx) in chatList" :key="idx" :data="message"/>
        </div>
        <div class="messenger__add-message">
          <add-message
            @addMessage="sendMessage"
            @addFile="sendFile"
            @sendTypingNotification="typingNotification"
            @finishChat="finishChat"
          />
        </div>
      </div>
    </div>
    <modal-photo-list-lady/>
  </div>
</template>

<script>
import tryMount from '@/mixins/tryMount';
import Spinner from 'vue-simple-spinner';
import ChatHead from '@/components/Chat/ChatHead.vue';
import ChatFilter from '@/components/Chat/ChatFilter.vue';
import Message from '@/components/Chat/Message.vue';
import AddMessage from '@/components/Chat/AddMessage.vue';
import ModalPhotoListLady from '@/components/Chat/PhotoListLady.vue';
import { timestampToAgoStamp, dateToTimestamp } from '@/helpers/Dates';
import api from '@/helpers/Api';
import { setTimeout } from 'timers';
// import autobahn from 'autobahn';
// import '@/autobahn.wamp1.js';

export default {
  name: 'Chat',
  mixins: [tryMount],
  components: {
    Spinner,
    ChatHead,
    ChatFilter,
    Message,
    AddMessage,
    ModalPhotoListLady,
  },
  data() {
    return {
      filter: {
        checkbox: '0',
        dates: {
          start: undefined,
          end: undefined,
        },
      },
      scrollFetch: {
        isLoading: false,
        moreResultsAvailable: true,
      },
      scrollMessageID: undefined,
      lastLoadId: undefined,
    };
  },
  mounted() {
    this.fetchChats();
    this.fetchChatInfo();

    // const socket = new WebSocket('wss://marmeladies.com/ws/');
    // socket.onopen = event => {
    //   console.log('onopen', event, socket);

    //   const msg = {
    //     topic: 'translator-fEYfNEUlMlVhEkQYQGanvihAWGeLqI19',
    //   };
    //   // JSON.stringify(msg)
    //   socket.send(JSON.stringify([5, 'translator-fEYfNEUlMlVhEkQYQGanvihAWGeLqI19']));
    // };
    // socket.onmessage = event => {
    //   const msg = JSON.parse(event.data);
    //   console.log('onmessage', event, msg);
    // };

    // var connection = ab.Connection({ url: 'wss://marmeladies.com/ws/', realm: 'realm1' });

    // connection.onopen = function(session) {
    //   console.log(session);

    //   // 1) subscribe to a topic
    //   session.subscribe('translator-fEYfNEUlMlVhEkQYQGanvihAWGeLqI19', args => {
    //     console.log('Event:', args[0]);
    //   });

    //   // // 2) publish an event
    //   // session.publish('com.myapp.hello', ['Hello, world!']);

    //   // // 3) register a procedure for remoting
    //   // function add2(args) {
    //   //   return args[0] + args[1];
    //   // }
    //   // session.register('com.myapp.add2', add2);

    //   // // 4) call a remote procedure
    //   // session.call('com.myapp.add2', [2, 3]).then(function(res) {
    //   //   console.log('Result:', res);
    //   // });
    // };

    this.wamp();
  },
  beforeDestroy() {
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
      const grouped = [];
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
      return undefined;
    },
  },
  methods: {
    filterToParams() {
      const result = {};

      if (this.filter.checkbox !== '0') {
        result.filter = this.filter.checkbox;
      }
      if (this.filter.checkbox === '3') {
        result.date_1 = dateToTimestamp(this.filter.dates.start);
        result.date_2 = dateToTimestamp(this.filter.dates.end);
      }
      return result;
    },
    buildFetchQuery() {
      if (!this.haveCurrentUsers) {
        return;
      }

      let queryObj = this.currentUsers;

      const filter = this.filterToParams();
      if (filter) {
        queryObj = { ...queryObj, ...filter };
      }
      return queryObj;
    },
    fetchChats() {
      const queryObj = this.buildFetchQuery();
      if (!queryObj) {
        return;
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
          // scroll to the end of the list
          setTimeout(() => {
            this.$refs.list.scrollTop = this.$refs.list.scrollHeight;
          }, 100);
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
      const formData = new FormData();
      formData.append('file', file);
      formData.append('man', this.currentUsers.man);
      formData.append('lady', this.currentUsers.lady);

      api
        .post('chats/photos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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
        .get('chats/finish', { params: this.currentUsers })
        .then(res => {
          console.log('finish responsce', res.data);
        })
        .catch(err => {
          this.showNotification({ message: err });
        });
    },
    handleListScroll() {
      const listDOM = this.$refs.list;
      const { scrollTop, childNodes } = listDOM;
      const MessageNodesReverse = [...childNodes].reverse();
      let currentScrollID;

      const BreakException = {};
      try {
        MessageNodesReverse.forEach(x => {
          if (scrollTop + 40 >= x.offsetTop) {
            currentScrollID = x.getAttribute('data-id');
            throw BreakException;
          }
        });
      } catch (e) {
        if (e !== BreakException) throw e;
      }
      this.scrollMessageID = currentScrollID;

      // scroll fetch logic
      // const scrollRemaining = listDOM.scrollHeight - listDOM.scrollTop - listDOM.offsetHeight;
      const scrollRemaining = listDOM.scrollTop;

      if (
        scrollRemaining <= 150 &&
        !this.scrollFetch.isLoading &&
        this.scrollFetch.moreResultsAvailable
      ) {
        const firstId = this.chatList[1].ID;
        this.scrollFetch.isLoading = true;
        const queryObj = this.buildFetchQuery();
        if (!queryObj) {
          return;
        }

        api
          .get(`chats?last_id=${firstId}`, {
            params: queryObj,
          })
          .then(res => {
            this.lastLoadId = this.chatList[0].ID;
            this.$store.commit('PREPEND_CHAT_LIST', {
              users: this.currentUsers,
              list: res.data.slice(0, res.data.length - 1),
            });
            setTimeout(() => {
              this.scrollToLastMsg();
            }, 100);

            this.scrollFetch.isLoading = false;
            this.scrollFetch.moreResultsAvailable = res.data.length === 21;
          })
          .catch(err => {
            this.showNotification({ message: err });
          });
      }
    },
    resetScrollFetch() {
      this.scrollFetch.isLoading = false;
      this.scrollFetch.moreResultsAvailable = true;
      this.scrollMessageID = undefined;
    },
    scrollToLastMsg() {
      const listDOM = this.$refs.list;
      const { scrollTop, childNodes } = listDOM;
      const MessageNodesReverse = [...childNodes].reverse();

      let lastMsgPos;

      MessageNodesReverse.forEach(x => {
        if (x.getAttribute('data-id') === this.lastLoadId) {
          lastMsgPos = x.offsetTop;
        }
      });

      listDOM.scrollTop = lastMsgPos;
    },
    wamp() {
      // const optDebug = true;

      // ab._debugrpc = optDebug;
      // ab._debugpubsub = optDebug;
      // ab._debugws = optDebug;
      ab._MESSAGE_TYPEID_WELCOME = 0;
      ab._MESSAGE_TYPEID_PREFIX = 1;
      ab._MESSAGE_TYPEID_CALL = 2;
      ab._MESSAGE_TYPEID_CALL_RESULT = 3;
      ab._MESSAGE_TYPEID_CALL_ERROR = 4;
      ab._MESSAGE_TYPEID_SUBSCRIBE = 5;
      ab._MESSAGE_TYPEID_UNSUBSCRIBE = 6;
      ab._MESSAGE_TYPEID_PUBLISH = 7;
      ab._MESSAGE_TYPEID_EVENT = 8;

      const soketOpen = session => {
        console.log('Connected!', session);

        // 1) subscribe to a topic
        const topicuri = 'translator-fEYfNEUlMlVhEkQYQGanvihAWGeLqI19';

        session.subscribe(JSON.stringify([ab._MESSAGE_TYPEID_SUBSCRIBE, topicuri]), args => {
          console.log('Event:', args[0]);
        });
      };

      const soketClose = session => {
        console.log('Connection closed');
      };

      ab.connect(
        'wss://marmeladies.com/ws/',
        //'ws://localhost:8081',
        session => soketOpen(session),
        (code, reason, detail) => soketClose(),
        {
          maxRetries: 60,
          retryDelay: 2000,
          skipSubprotocolCheck: true,
        },
      );
    },
  },
  watch: {
    currentUsers(Old, New) {
      // when current users change
      if (Old.man !== New.man || Old.lady !== New.lady) {
        this.fetchChats();
        this.fetchChatInfo();
        this.resetScrollFetch();
      }
    },
    filter: {
      handler() {
        this.fetchChats();
        this.resetScrollFetch();
      },
      deep: true,
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
  &__loader {
    position: absolute;
    z-index: 3;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
  }
}
@include r(640) {
  .messenger {
    &__list {
      // padding: 15px 10px;
    }
  }
}
@include r($sm) {
  .chat {
    padding: 12px 20px;
    // height: calc(100vh - 80px - 40px);
    height: auto;
    &__messenger {
      margin-left: -20px;
      margin-right: -20px;
    }
  }
  .messenger {
    &__timestamp {
      font-size: 10px;
    }
    &__list {
      height: calc(100vh - 80px - 120px);
      // padding-left: 20px;
      // padding-right: 20px;
    }
  }
}
</style>
