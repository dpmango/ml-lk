<template>
  <div
    class="message"
    :data-id="data.ID"
    :class="{'is-outgoing' : data.Sender === selfID.toString()}"
  >
    <UiNotification v-if="errorMessage" type="danger">{{errorMessage}}</UiNotification>
    <div class="message__wrapper">
      <Avatar
        :Thumbnail="storeUser.Thumbnail"
        :RealName="storeUser.RealName"
        :Online="storeUser.Online"
      />
      <div class="message__text" v-html="data.Text" v-if="!hasFile"/>
      <div class="message__file" v-if="hasFile">
        <img v-img :src="getFile(data.File.Url_1)">
      </div>
      <div class="message__actions">
        <div class="message__mark" v-if="!hasFile" :class="{'is-active': data.Marked ==='1'}">
          <svg-icon name="starmark" width="16" height="15"/>
        </div>
        <div class="message__timestamp">{{timeStamp}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { timestampToTime } from '@/helpers/Dates';
import UiNotification from '@/components/Shared/UI/Notification.vue';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import Avatar from '@/components/Users/Avatar.vue';
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
    selfID: Number,
  },
  data() {
    return {
      errorMessage: '',
      fileBase64: '',
    };
  },
  computed: {
    currentUsers() {
      return this.$store.state.chat.currentUsers;
    },
    storeUser() {
      return this.$store.getters.getAvatarFromSender(this.currentUsers, this.data.Sender);
    },
    hasFile() {
      return !Array.isArray(this.data.File);
    },
    timeStamp() {
      return timestampToTime(this.data.Date);
    },
  },
  methods: {
    getFile(url) {
      api
        .get(url, {
          responseType: 'arraybuffer',
        })
        .then(res => {
          const imgToBase64 = Buffer.from(res.data, 'binary').toString('base64');
          return `data:image/png;base64, ${imgToBase64}`;
        })
        .catch(err => {
          this.errorMessage = `File: ${err}`;
        });
    },
  },
};
</script>


<style lang="scss" scoped>
@import '@/theme/utils.scss';

.message {
  margin-bottom: 16px;
  &__wrapper {
    display: flex;
  }
  &__text {
    flex: 0 1 auto;
    padding: 10px 12px;
    margin-left: 20px;
    background: rgba(#e7e7e7, 0.6);
    border-radius: 10px 10px 10px 0px;
    font-weight: normal;
    font-size: 13px;
    line-height: 17px;
    img {
      vertical-align: baseline;
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
    .message {
      &__wrapper {
        flex-direction: row-reverse;
      }
      &__text {
        background: rgba($colorPrimary, 0.2);
        border-radius: 10px 10px 0px 10px;
        margin-right: 20px;
        margin-left: 0px;
      }
      &__actions {
        padding-right: 9px;
        padding-left: 0px;
      }
    }
  }
}
</style>
