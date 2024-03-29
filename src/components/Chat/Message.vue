<template>
  <div class="message" :data-id="data.ID" :class="{'is-outgoing' : this.storeUser.isLady}">
    <UiNotification v-if="errorMessage" type="danger">{{errorMessage}}</UiNotification>
    <div class="message__wrapper">
      <Avatar
        :Thumbnail="storeUser.Thumbnail"
        :RealName="storeUser.RealName"
        :Online="storeUser.Online"
      />
      <div class="message__text-wrapper">
        <div class="message__text" v-html="TextOnlyEmoji" v-if="isTextNotEmpty" />
        <div class="message__file" v-if="hasFile">
          <!-- <a v-img="{'src': fileBase64Full}"></a> -->
          <img
            v-img="{'src': fileBase64Full, thumbnails: true, group: 'messageFiles'}"
            :src="fileBase64Thumb"
          />
        </div>
      </div>
      <div class="message__actions">
        <div
          class="message__mark"
          v-if="!hasFile"
          :class="{'is-active': data.Marked ==='1'}"
          @click="markMessage"
        >
          <svg-icon name="starmark" width="16" height="15" />
        </div>
        <div class="message__timestamp">{{timeStamp}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { timestampToAgoStamp, timestampToTime } from '@/helpers/Dates';
import UiNotification from '@/components/Shared/UI/Notification.vue';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import Avatar from '@/components/Users/Avatar.vue';
import replaceEmoji from '@/helpers/Emoji';
import api from '@/helpers/Api';

export default {
  name: 'Message',
  components: {
    UiNotification,
    SvgIcon,
    Avatar,
  },
  props: {
    data: {
      ID: String,
      Date: String,
      Sender: String,
      Recipient: String,
      Text: String,
      Marked: String,
      File: Array,
      Text_only: String,
    },
  },
  data() {
    return {
      errorMessage: '',
      fileBase64Thumb: '',
      fileBase64Full: '',
    };
  },
  computed: {
    currentUsers() {
      return this.$store.state.chat.currentUsers;
    },
    storeUser() {
      return this.$store.getters.getUserFromMessageSender(this.currentUsers, this.data.Sender);
    },
    hasFile() {
      return !Array.isArray(this.data.File);
    },
    isTextNotEmpty() {
      return this.data.Text_only.trim() !== '';
    },
    timeStamp() {
      // return timestampToAgoStamp(this.data.Date);
      return timestampToTime(this.data.Date);
      // return timestampToDate(this.data.Date);
    },
    TextOnlyEmoji() {
      return replaceEmoji(this.data.Text_only);
    },
  },
  mounted() {
    this.getFiles();
  },
  updated() {
    this.getFiles();
  },
  methods: {
    getFiles() {
      if (this.hasFile) {
        this.getFile(this.data.File.Url_1, 'thumb');
        this.getFile(this.data.File.Url_2, 'full');
      }
    },
    getFile(url, type) {
      api
        .get(url, {
          responseType: 'arraybuffer',
        })
        .then(res => {
          const imgToBase64 = Buffer.from(res.data, 'binary').toString('base64');
          if (type === 'thumb') {
            this.fileBase64Thumb = `data:image/png;base64, ${imgToBase64}`;
          } else if (type === 'full') {
            this.fileBase64Full = `data:image/png;base64, ${imgToBase64}`;
          }
        })
        .catch(err => {
          this.errorMessage = `File: ${err}`;
        });
    },
    markMessage() {
      const isMarked = this.data.Marked === '1';
      let options = {};
      if (!isMarked) {
        options = {
          action: 'mark',
          errTitle: 'Ошибка при отметке сообщения',
        };
      } else {
        options = {
          action: 'unmark',
          errTitle: 'Ошибка при удалении отметки сообщения',
        };
      }

      api
        .get(`chats/${this.data.ID}/${options.action}`, {
          params: this.currentUsers,
        })
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
            this.$store.commit('CHAT_TOGGLE_MESSAGE_MARKED', {
              users: this.currentUsers,
              messageID: this.data.ID,
              isMarked,
            });
          } else {
            this.showNotification({ title: options.errTitle, message: apiData.message });
          }
        })
        .catch(error => {
          this.showNotification({ title: options.errTitle, message: error });
        });
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

.message {
  margin-bottom: 16px;
  margin-right: 70px;
  .avatar {
    align-self: flex-end;
  }
  &__wrapper {
    display: flex;
  }
  &__text-wrapper {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .message__text + .message__file {
      margin-top: 8px;
    }
  }
  &__text {
    flex: 0 1 auto;
    padding: 10px 12px;
    background: rgba(#e7e7e7, 0.6);
    border-radius: 10px 10px 10px 0px;
    font-weight: normal;
    font-size: 13px;
    line-height: 17px;
    img {
      vertical-align: baseline;
    }
  }
  &__file {
    position: relative;
    border: 1px solid #e1e1e1;
    box-sizing: border-box;
    border-radius: 10px 10px 10px 0px;
    overflow: hidden;
    font-size: 0;
    a {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    img {
      max-width: 100%;
      // pointer-events: none;
    }
  }
  &__actions {
    display: flex;
    flex-direction: column;
    position: relative;
    padding-left: 9px;
  }
  &__mark {
    position: absolute;
    padding: 3px;
    top: -3px;
    left: 6px;
    cursor: pointer;
    color: #a5a5a5;
    transition: color 0.25s ease;
    &.is-active,
    &:hover {
      color: $colorOrange;
    }
  }
  &__timestamp {
    margin-top: auto;
    font-size: 11px;
    color: rgba($fontColor, 0.6);
  }
  &:last-child {
    margin-bottom: 0px;
  }
  &.is-outgoing {
    margin-left: 70px;
    margin-right: 0px;
    .message {
      &__wrapper {
        flex-direction: row-reverse;
      }
      &__text-wrapper {
        margin-right: 20px;
        margin-left: 0px;
      }
      &__text {
        background: rgba($colorPrimary, 0.2);
      }
      &__text,
      &__file {
        border-radius: 10px 10px 0px 10px;
      }
      &__actions {
        padding-right: 9px;
        padding-left: 0px;
      }
    }
  }
}

@include r(640) {
  .message {
    margin-right: 40px;
    .avatar {
      transform: scale(0.5);
      transform-origin: left bottom;
    }
    &__text-wrapper {
      margin-left: -10px;
    }

    &.is-outgoing {
      margin-left: 40px;
      // margin-right: 0px;
      .avatar {
        transform-origin: right bottom;
      }
      .message {
        &__text-wrapper {
          margin-right: -10px;
        }
      }
    }
  }
}
</style>
<style>
.emoji-img {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin: 0 0.2em;
  line-height: normal;
  vertical-align: middle;
}
</style>
