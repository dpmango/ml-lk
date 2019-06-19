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
          :class="{'is-visible': shouldShowTimeStamp}"
          v-if="activeTimestamp && !scrollFetch.isLoading"
        >{{activeTimestamp.timestamp}}</div>
        <spinner
          class="messenger__loader"
          v-if="scrollFetch.isLoading"
          size="medium"
          line-fg-color="#5aa6ff"
        />
        <div class="messenger__list" ref="list">
          <template v-for="(sess, sessIdx) in chatListWithSession">
            <div class="messenger__session-separator" :key="sessIdx">
              <span>{{sess.timestamp}}</span>
            </div>
            <message
              v-for="(message, idx) in sess.list"
              :key="`${sessIdx}_${idx}`"
              :data="message"
            />
          </template>

          <div
            class="messenger__typing-notification"
            v-if="typingNotificationActive"
          >{{typingNotificationActive}} вводит текст..</div>
        </div>
        <div class="messenger__add-message">
          <add-message
            @addMessage="sendMessage"
            @sendTypingNotification="typingNotification"
            @finishChat="finishChat"
          />
        </div>
      </div>
    </div>
    <modal-photo-list-lady @addMessage="sendMessage"/>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
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
import { getToken } from '@/helpers/storeToken';
import { scrollToEnd } from '@/helpers/ScrollTo';

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
        dates: this.initialDates(),
      },
      scrollFetch: {
        isLoading: false,
        moreResultsAvailable: true,
      },
      lastScrollDir: undefined,
      MountWithDebounceScroll: 2500,
      shouldShowTimeStamp: true,
      scrollMessageID: undefined,
      lastLoadId: undefined,
      typingNotificationActive: false,
      sounds: {
        notificationListSound: undefined,
        contactListSound: undefined,
      },
    };
  },
  created() {
    this.typingResetDebounce = debounce(this.typingReset, 10000, {
      leading: false,
      trailing: true,
    });
  },
  mounted() {
    this.mountSounds();
    this.fetchChats();
    this.fetchChatInfo();
    this.mountSocket();
  },
  beforeDestroy() {
    this.finishChat();
  },
  computed: {
    currentUsers() {
      return this.$store.state.chat.currentUsers;
    },
    currentActiveContact() {
      return this.$store.getters.getActiveContact(this.currentUsers);
    },
    currentActiveNotification() {
      return this.$store.getters.getActiveNotification(this.currentUsers);
    },
    chatList() {
      return this.$store.getters.selectChatByUsers(this.currentUsers);
    },
    contactListSoundActive() {
      return this.$store.getters.isSoundModuleActive('contactList');
    },
    notificationListSoundActive() {
      return this.$store.getters.isSoundModuleActive('notificationList');
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
    chatListWithSession() {
      return this.groupedDates.map((ts, idx) => {
        const targetList = this.chatList.filter(msg => {
          const msgId = parseInt(msg.ID, 10);
          const lastIdx = this.groupedDates.length - 1;
          if (idx === lastIdx) {
            return msgId >= parseInt(ts.messageID, 10);
          } else {
            return (
              msgId >= parseInt(ts.messageID, 10) &&
              msgId < parseInt(this.groupedDates[idx + 1].messageID, 10)
            );
          }
        });
        return {
          timestamp: ts.timestamp,
          list: targetList,
        };
      });
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
    initialDates() {
      let oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return {
        start: oneWeekAgo,
        end: Date.now(),
      };
    },
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
        return undefined;
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
    sendMessage(opt) {
      let options = {
        man: this.currentUsers.man,
        lady: this.currentUsers.lady,
      };
      if (opt.text) {
        options = { ...options, ...{ text: opt.text } };
      }
      if (opt.file) {
        options = { ...options, ...{ text: '', file: opt.file } };
      }
      api
        .post('chats', options)
        .then(res => {
          const apiData = res.data[0];
          console.log('res post /chats', apiData);
          if (apiData.success) {
            // this.showNotification({ type: 'success', title: 'сообщение отправлено' });
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
      let MessageNodesReverse = [...childNodes].reverse();
      let currentScrollID;

      MessageNodesReverse = MessageNodesReverse.filter(
        x => x.nodeType !== 8 && x.hasAttribute('data-id'),
      );
      const BreakException = {};
      try {
        MessageNodesReverse.forEach(x => {
          if (scrollTop + 60 >= x.offsetTop) {
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
      const scrollDir = scrollRemaining > this.lastScrollDir ? 'down' : 'up';
      this.lastScrollDir = scrollRemaining;
      this.shouldShowTimeStamp = true;

      if (
        scrollRemaining <= 150 &&
        scrollDir === 'up' &&
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
    handleListScrollDebounce() {
      this.shouldShowTimeStamp = false;
    },
    resetScrollFetch() {
      this.scrollFetch.isLoading = false;
      this.scrollFetch.moreResultsAvailable = true;
      this.scrollMessageID = undefined;
    },
    scrollToLastMsg() {
      const listDOM = this.$refs.list;
      const { childNodes } = listDOM;
      const MessageNodesReverse = [...childNodes].reverse();

      let lastMsgPos;
      MessageNodesReverse.forEach(x => {
        if (
          x.nodeType !== 8 &&
          x.hasAttribute('data-id') &&
          x.getAttribute('data-id') === this.lastLoadId
        ) {
          lastMsgPos = x.offsetTop;
        }
      });

      listDOM.scrollTop = lastMsgPos;
    },
    mountSocket() {
      const isDebug = true;

      /* eslint-disable */
      // ab._debugrpc = isDebug;
      ab._debugpubsub = isDebug;
      // ab._debugws  = isDebug;

      ab._MESSAGE_TYPEID_WELCOME = 0;
      ab._MESSAGE_TYPEID_PREFIX = 1;
      ab._MESSAGE_TYPEID_CALL = 2;
      ab._MESSAGE_TYPEID_CALL_RESULT = 3;
      ab._MESSAGE_TYPEID_CALL_ERROR = 4;
      ab._MESSAGE_TYPEID_SUBSCRIBE = 5;
      ab._MESSAGE_TYPEID_UNSUBSCRIBE = 6;
      ab._MESSAGE_TYPEID_PUBLISH = 7;
      ab._MESSAGE_TYPEID_EVENT = 8;
      /* eslint-enable */

      let sess;
      const soketOpen = () => {
        // console.log('Connected!', session);

        // 1) subscribe to a topic
        const topicuri = `translator-${getToken()}`;
        // JSON.stringify([ab._MESSAGE_TYPEID_SUBSCRIBE, topicuri])
        sess.subscribe(topicuri, (topic, data) => {
          this.handleSocketResponce(data);
        });
      };

      const soketClose = () => {
        console.log('Connection closed');
      };

      /* eslint-disable */
      ab.connect(
        'wss://marmeladies.com/ws/',
        //'ws://localhost:8081',
        session => {
          sess = session;
          soketOpen();
        },
        (code, reason, detail) => soketClose(),
        {
          maxRetries: 60,
          retryDelay: 2000,
          skipSubprotocolCheck: true,
        },
      );
      /* eslint-enable */
    },
    handleSocketResponce(data) {
      const msgType = data[3];
      const senderId = data[1].toString();
      const senderName = data[2];
      const messageId = data[10].toString();
      const receiverId = data[11].toString();

      if (msgType === 'typing_notification') {
        //  собеседник вводит текст
        if (this.currentUsers.man === senderId && this.currentUsers.lady === receiverId) {
          this.typingNotificationActive = senderName;
          this.typingResetDebounce();
          scrollToEnd(800, this.$refs.list);
        }
      } else if (msgType === 'chat_finish_1_notification') {
        this.showInfoNotification({
          message: `${senderName} have left the conversation`,
        });
      } else if (msgType === 'chat_finish_2_notification') {
        this.showInfoNotification({
          message: `${senderName} missed your invite. Please try again. A lot of other ladies are online and available to Chat Now`,
        });
      } else if (msgType === 'chat_finish_5_notification') {
        this.showInfoNotification({
          message: `You have left the conversation. To resume chat please send another message`,
        });
      } else if (msgType === 'chat_start_notification') {
        // старт чата, показываем кнопки «finish_chat» и «attach»
        this.showInfoNotification({
          message: `старт чата, показываем кнопки «finish_chat» и «attach»`,
        });
      } else if (msgType === 'delete_chat_message') {
        // удаляем сообщение id из ленты
        this.fetchChats();
      } else if (msgType === 'chat_page_open_notification') {
        // обрабатываем уведомление
        // this.showInfoNotification({
        //   message: `chat_page_open_notification`,
        // });
        this.playNotificationListSound();
        api
          .get(`notifications/${messageId}`)
          .then(res => {
            const apiData = res.data[0];
            const isCurrentChat =
              this.currentUsers.man === apiData.Man.ID &&
              this.currentUsers.lady === apiData.Lady.ID;
            this.$store.commit('NOTIFICATION_UPDATE_OR_PREPEND', {
              notification: apiData,
              isCurrentChat,
            });
          })
          .catch(err => {
            this.showNotification({ message: err });
          });
      } else {
        // текст сообщение, выводим в чат, если открыт экран чата с отправителем или в уведомления
        this.typingNotificationActive = false;
        this.playContactListSound();
        api
          // .get(`chats/messages/${messageId}`)
          .get(`contacts/messages/${messageId}`)
          .then(res => {
            const apiData = res.data[0];
            const isCurrentChat =
              this.currentUsers.man === apiData.Man.ID &&
              this.currentUsers.lady === apiData.Lady.ID;
            this.$store.commit('CONTACT_UPDATE_OR_PREPEND', {
              contact: apiData,
              isCurrentChat,
            });
            if (isCurrentChat) {
              this.markContactAsRead();
              this.markNotificationAsRead();
            }
          })
          .catch(err => {
            this.showNotification({ message: err });
          });

        this.fetchChats();
      }
    },
    markContactAsRead() {
      api
        .get(`contacts/${this.currentActiveContact}/read`)
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
            this.$store.commit('CONTACT_READ', this.currentUsers);
          } else {
            this.showNotification({ title: 'Ошибка при прочтении', message: apiData.message });
          }
        })
        .catch(error => {
          this.showNotification({ title: 'Ошибка при прочтении', message: error });
        });
    },
    markNotificationAsRead() {
      api
        .get(`notifications/${this.currentActiveNotification}/read`)
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
            this.$store.commit('NOTIFICATION_READ', this.currentUsers);
          } else {
            this.showNotification({ title: 'Ошибка при прочтении', message: apiData.message });
          }
        })
        .catch(error => {
          this.showNotification({ title: 'Ошибка при прочтении', message: error });
        });
    },
    typingReset() {
      this.typingNotificationActive = false;
    },
    mountSounds() {
      this.sounds.notificationListSound = new Audio('sounds/open_chat_page.mp3');
      this.sounds.contactListSound = new Audio('sounds/bell.mp3');
      window.sounds = this.sounds;
    },
    playNotificationListSound() {
      if (this.notificationListSoundActive) {
        this.sounds.notificationListSound.play();
      }
    },
    playContactListSound() {
      if (this.contactListSoundActive) {
        this.sounds.contactListSound.play();
      }
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
    showInfoNotification: {
      title: '',
      type: 'info',
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
  &__typing-notification {
    font-size: 12px;
    line-height: 23px;
    color: #1e1e1e;
    padding-left: 70px;
  }
  &__add-message {
    flex: 0 0 auto;
  }
  &__session-separator {
    position: relative;
    font-size: 12px;
    text-align: center;
    margin: 30px 0;
    span {
      position: relative;
      z-index: 2;
      display: inline-block;
      background: white;
      min-width: 80px;
      padding-left: 10px;
      padding-right: 10px;
      text-align: center;
    }
    &::before {
      display: inline-block;
      content: ' ';
      position: absolute;
      z-index: 1;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      right: 0;
      height: 1px;
      background: rgba($fontColor, 0.2);
    }
  }
  &__timestamp {
    position: absolute;
    z-index: 3;
    top: 10px;
    left: 50%;
    transform: translate(-50%, -10px);
    padding: 3px 15px;
    font-size: 12px;
    line-height: 23px;
    text-align: center;
    min-width: 115px;
    background: #ffffff;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
    border-radius: 50px;
    opacity: 0;
    pointer-events: none;
    transition: transform 0.25s ease-out, opacity 0.25s ease;
    &.is-visible {
      opacity: 1;
      pointer-events: all;
      transform: translate(-50%, 0px);
    }
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
    &__typing-notification {
      padding-left: 40px;
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
