<template>
  <div
    class="relation"
    :class="{'is-chat-active' : isChatActive }"
    :data-id="data.ID"
    @click="readContact"
  >
    <div class="relation__wrapper">
      <div class="relation__user relation__user--left">
        <user-relation
          :ID="data.Man.ID"
          :RealName="data.Man.RealName"
          :Age="data.Man.Age"
          :Country="data.Man.Country"
          :Online="data.Man.Online"
          :Thumbnail="data.Man.Thumbnail"
        />
      </div>
      <div class="relation__separator">
        <svg-icon name="relationSeparator" width="16" height="16" />
      </div>
      <div class="relation__user relation__user--right">
        <user-relation
          :ID="data.Lady.ID"
          :IDMan="data.Man.ID"
          :RealName="data.Lady.RealName"
          :Age="data.Lady.Age"
          :Online="data.Lady.Online"
          :Thumbnail="data.Lady.Thumbnail"
          :ChatNew="data.ChatNew"
          :MsgNew="data.MsgNew"
        />
      </div>
    </div>
    <div class="relation__info">
      <div class="relation__date">{{timeStamp}}</div>
      <div class="relation__message-wrapper">
        <div class="relation__message">{{textOnly}}</div>
        <div class="relation__file" v-if="hasFile">
          <img :src="fileBase64Thumb" />
        </div>
      </div>
    </div>
    <div class="relation__actions">
      <div
        class="relation__mark"
        :class="{'is-active': data.Marked ==='1'}"
        @click="markClickRouter"
      >
        <svg-icon name="starmark" width="16" height="15" />
      </div>
      <div class="relation__remove" @click="removeContact">
        <svg-icon name="close" width="12" height="12" />
      </div>
    </div>
  </div>
</template>

<script>
import { timestampToTime } from '@/helpers/Dates';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import UserRelation from '@/components/Users/UserRelation.vue';
import api from '@/helpers/Api';

export default {
  name: 'RelationContact',
  components: {
    SvgIcon,
    UserRelation,
  },
  props: {
    data: {
      ID: String,
      Man: {
        ID: String,
        RealName: String,
        Age: Number,
        Country: String,
        Online: String,
        Thumbnail: String,
      },
      Lady: {
        ID: String,
        RealName: String,
        Age: Number,
        Country: String,
        Online: String,
        Thumbnail: String,
      },
      ChatNew: String,
      LastMessage: String,
      LastMessageDate: String,
      MsgNew: String,
      Marked: String,
    },
  },
  data() {
    return {
      errorMessage: '',
      fileBase64Thumb: '',
    };
  },
  mounted() {
    if (this.hasFile) {
      this.getFile(this.data.File.Url_1, 'thumb');
    }
  },
  updated() {
    if (this.hasFile) {
      this.getFile(this.data.File.Url_1, 'thumb');
    }
  },
  computed: {
    isChatNew() {
      return this.data.ChatNew !== '0';
    },
    isMsgNew() {
      return this.data.MsgNew !== '0';
    },
    hasFile() {
      return !Array.isArray(this.data.File);
    },
    timeStamp() {
      return timestampToTime(this.data.LastMessageDate);
    },
    storeActiveUsers() {
      return this.$store.state.chat.currentUsers;
    },
    isChatActive() {
      const manMathch = this.storeActiveUsers.man === this.data.Man.ID;
      const ladyMatch = this.storeActiveUsers.lady === this.data.Lady.ID;
      return manMathch && ladyMatch;
    },
    textOnly() {
      return this.data.LastMessage.replace(/<img .*?>/g, '');
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
          this.fileBase64Thumb = `data:image/png;base64, ${imgToBase64}`;
        })
        .catch(err => {
          this.errorMessage = `File: ${err}`;
        });
    },
    markClickRouter(e) {
      e.stopPropagation();

      if (this.data.Marked === '0') {
        this.markContact();
      } else if (this.data.Marked === '1') {
        this.unmarkContact();
      }
    },
    removeContact(e) {
      e.stopPropagation();

      this.pingApi({
        apiAction: 'delete',
        urlSuffix: '',
        commitAction: 'CONTACT_REMOVE',
        errTitle: 'Ошибка при удалении',
      });
    },
    readContact() {
      this.$store.commit('SET_CHAT_CURRENTUSERS', {
        man: this.data.Man.ID,
        lady: this.data.Lady.ID,
      });
      this.pingApi({
        apiAction: 'get',
        urlSuffix: '/read',
        commitAction: ['CONTACT_READ', 'NOTIFICATION_READ'],
        commitByUsers: true,
        errTitle: 'Ошибка при прочтении',
      });
    },
    markContact() {
      this.pingApi({
        apiAction: 'get',
        urlSuffix: `/mark`,
        commitAction: 'CONTACT_TOGGLE_MARKED',
        errTitle: 'Ошибка при отметке',
      });
    },
    unmarkContact() {
      this.pingApi({
        apiAction: 'get',
        urlSuffix: `/unmark`,
        commitAction: 'CONTACT_TOGGLE_MARKED',
        errTitle: 'Ошибка при снятии отметки',
      });
    },
    pingApi(options) {
      api[options.apiAction](`contacts/${this.data.ID}${options.urlSuffix}`)
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
            if (Array.isArray(options.commitAction)) {
              options.commitAction.forEach(action => {
                this.$store.commit(
                  action,
                  options.commitByUsers ? this.storeActiveUsers : this.data.ID,
                );
              });
            } else {
              this.$store.commit(
                options.commitAction,
                options.commitByUsers ? this.storeActiveUsers : this.data.ID,
              );
            }
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

.relation {
  position: relative;
  transition: background 0.25s ease-in-out;
  padding: 13px 10px;
  &__wrapper {
    display: flex;
    align-items: center;
  }
  &__user {
    width: 100%;
    min-width: 0;
    min-height: 0;
    &--left {
      flex: 0 0 130px;
      max-width: 130px;
    }
    &--right {
      flex: 0 0 130px;
      max-width: 130px;
    }
  }
  &__separator {
    flex: 0 0 auto;
    padding-left: 10px;
    padding-right: 18px;
  }
  &__info {
    margin-top: 0.5em;
    display: flex;
    align-items: center;
  }
  &__date {
    flex: 0 0 50px;
    max-width: 50px;
    font-size: 10px;
    text-align: center;
  }
  &__message-wrapper {
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .relation__file {
      margin-top: 5px;
    }
  }
  &__message {
    font-size: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 240px;
  }
  &__file {
    position: relative;
    z-index: 1;
    border-radius: 4px;
    overflow: hidden;
    font-size: 0;
    img {
      max-width: 100px;
      max-height: 40px;
    }
  }
  &__actions {
    position: absolute;
    z-index: 3;
    top: 18px;
    right: 5px;
    display: flex;
    align-items: center;
    font-size: 0;
    transition: opacity 0.25s ease;
    opacity: 0;
    pointer-events: none;
  }
  &__mark {
    padding: 3px;
    cursor: pointer;
    color: #a5a5a5;
    transition: color 0.25s ease;
    &.is-active,
    &:hover {
      color: $colorOrange;
    }
  }
  &__remove {
    padding: 3px;
    cursor: pointer;
    color: #a5a5a5;
    transition: color 0.25s ease;
    &:hover {
      color: $colorRed;
    }
  }
  &:hover {
    background: $colorBg;
    .relation__actions {
      opacity: 1;
      pointer-events: all;
    }
  }
  &.is-chat-active {
    background: $colorBg;
  }
}
</style>
