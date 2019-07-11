<template>
  <div class="chat-head" v-if="storeData.Man && storeData.Lady">
    <div class="chat-head__wrapper">
      <div class="chat-head__col">
        <div class="chat-head__user user-head">
          <Avatar
            :size="44"
            :Thumbnail="storeData.Man.Thumbnail"
            :RealName="storeData.Man.RealName"
            :Online="storeData.Man.Online"
          />
          <div class="user-head__content">
            <a
              class="user-head__name"
              :href="outProfileLinkMan"
              target="_blank"
              @click.stop
            >{{storeData.Man.RealName}}, {{getAge(storeData.Man.DateOfBirth)}}</a>
            <div class="user-head__actions">
              <div
                class="user-head__action user-head__action--heart"
                :class="{'is-active' : storeData.Favorite}"
              >
                <svg-icon name="heart" width="14" height="13" />
              </div>
              <div
                class="user-head__action user-head__action--block"
                :class="{'is-active' : storeData.Blocked}"
              >
                <svg-icon name="block" width="13" height="13" />
              </div>
              <head-actions :Favorite="storeData.Favorite" :Blocked="storeData.Blocked" />
            </div>
          </div>
        </div>
      </div>
      <div class="chat-head__col">
        <div class="chat-head__user user-head">
          <Avatar
            :size="44"
            :Thumbnail="storeData.Lady.Thumbnail"
            :RealName="storeData.Lady.RealName"
            :Online="storeData.Lady.Online"
          />
          <div class="user-head__content">
            <a
              class="user-head__name"
              :href="outProfileLinkLady"
              target="_blank"
              @click.stop
            >{{storeData.Lady.RealName}}, {{getAge(storeData.Lady.DateOfBirth)}}</a>

            <div class="user-head__modal-link" @click="openPhotoModal">
              <span>Фото</span>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-head__col">
        <div class="chat-head__info">
          <div class="chat-head__info-row">
            <span>Письма:</span>
            <span>
              <a
                :href="outLinkStatsPayed"
                target="_blank"
                @click.stop
                v-if="msgStatsPayed !== '0'"
                v-tooltip.bottom-start="'Оплаченные'"
              >{{msgStatsPayed}}</a>
              <span v-else>{{msgStatsPayed}}</span>
              /
              <a
                :href="outLinkStatsNew"
                target="_blank"
                @click.stop
                v-if="msgStatsNew !== '0'"
                v-tooltip.bottom-start="'Новые'"
              >{{msgStatsNew}}</a>
              <span v-else>{{msgStatsNew}}</span> /
              <a
                :href="outLinkStatsUnanswered"
                target="_blank"
                @click.stop
                v-if="msgStatsUnanswered !== '0'"
                v-tooltip.bottom-start="'Неотвеченные'"
              >{{msgStatsUnanswered}}</a>
              <span v-else>{{msgStatsUnanswered}}</span>
            </span>
          </div>
          <div class="chat-head__info-row">
            <span>Чаты:</span>
            <span>{{storeData.Chat_stats}}</span>
          </div>
          <div class="chat-head__info-row">
            <span>Доставки:</span>
            <span>{{storeData.Dlv_stats}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-head__wrapper">
      <div class="chat-head__col">
        <textarea
          class="chat-head__notearea"
          @input="textareaDebounce('Comments_man')"
          v-model="storeData.Comments_man"
          rows="4"
        />
      </div>
      <div class="chat-head__col">
        <textarea
          class="chat-head__notearea"
          @input="textareaDebounce('Comments_lady')"
          v-model="storeData.Comments_lady"
          rows="4"
        />
      </div>
      <div class="chat-head__col">
        <textarea
          class="chat-head__notearea"
          @input="textareaDebounce('Comments_pair')"
          v-model="storeData.Comments_pair"
          rows="4"
        />
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import Avatar from '@/components/Users/Avatar.vue';
import HeadActions from '@/components/Chat/HeadActions.vue';
import { dateToAge } from '@/helpers/Dates';
import api from '@/helpers/Api';

export default {
  name: 'ChatHead',
  components: {
    SvgIcon,
    Avatar,
    HeadActions,
  },
  mounted() {
    this.textareaDebounce = debounce(this.updateComments, 1000);
  },
  props: {},
  data() {
    return {
      isPhotosOpen: false,
    };
  },
  computed: {
    currentUsers() {
      return this.$store.state.chat.currentUsers;
    },
    storeData() {
      return this.$store.getters.selectInfoByUsers(this.currentUsers);
    },
    outProfileLinkMan() {
      return `https://marmeladies.com/profile.php?ID=${this.storeData.Man.ID}`;
    },
    outProfileLinkLady() {
      return `https://marmeladies.com/profile.php?ID=${this.storeData.Lady.ID}`;
    },
    msgStatsPayed() {
      return this.storeData.Msg_stats.split('/')[0].trim();
    },
    msgStatsNew() {
      return this.storeData.Msg_stats.split('/')[1].trim();
    },
    msgStatsUnanswered() {
      return this.storeData.Msg_stats.split('/')[2].trim();
    },
    outLinkStatsPayed() {
      return `https://marmeladies.com/moderators/messages.php?action=view_messages&user_id=${this.storeData.Man.ID}&user_id_1=${this.storeData.Lady.ID}&status=5`;
    },
    outLinkStatsNew() {
      return `https://marmeladies.com/moderators/messages.php?action=view_messages&user_id=${this.storeData.Man.ID}&user_id_1=${this.storeData.Lady.ID}&status=1`;
    },
    outLinkStatsUnanswered() {
      return `https://marmeladies.com/moderators/messages.php?action=view_messages&user_id=${this.storeData.Man.ID}&user_id_1=${this.storeData.Lady.ID}&status=4`;
    },
  },
  methods: {
    getAge(DateOfBirth) {
      return dateToAge(DateOfBirth);
    },
    togglePhotosDropdown() {
      this.isPhotosOpen = !this.isPhotosOpen;
    },
    openPhotoModal() {
      this.$modal.show('chat-lady-photos', {
        users: this.currentUsers,
      });
    },
    updateComments(type) {
      // Для комментариев о паре передаем man, lady и text,
      // для комментариев о мужчине передаем только man и text,
      // для комментариев о девушки передаем только lady и text
      let postOptions = {};

      if (type === 'Comments_man') {
        postOptions = {
          man: this.currentUsers.man,
          text: this.storeData.Comments_man,
        };
      } else if (type === 'Comments_lady') {
        postOptions = {
          lady: this.currentUsers.lady,
          text: this.storeData.Comments_lady,
        };
      } else if (type === 'Comments_pair') {
        postOptions = {
          man: this.currentUsers.man,
          lady: this.currentUsers.lady,
          text: this.storeData.Comments_pair,
        };
      } else {
        return false;
      }

      api
        .post('chats/comments', postOptions)
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
          } else {
            this.showNotification({ message: apiData.message });
          }
        })
        .catch(err => {
          this.showNotification({ message: err });
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

.chat-head {
  &__wrapper {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -7px 10px;
  }
  &__col {
    width: 100%;
    flex: 0 0 33.333%;
    max-width: 33.333%;
    min-width: 1px;
    min-height: 0;
    padding-left: 7px;
    padding-right: 7px;
  }
  &__user {
  }
  &__notearea {
    width: 100%;
    background: white;
    border: 0;
    border-radius: 4px;
    font-size: 11px;
    line-height: 14px;
    resize: vertical;
  }
  &__info {
    color: rgba($fontColor, 0.6);
    font-size: 10px;
    line-height: 1.5;
  }
  &__info-row {
    display: flex;
    display: flex;
    align-items: center;
    span {
      &:first-child {
        flex: 0 0 52px;
      }
      &:last-child {
        padding-left: 5px;
      }
    }
  }
}

.user-head {
  display: flex;
  align-items: center;

  &__content {
    margin-left: 10px;
  }
  &__name {
    font-size: 14px;
    display: block;
    transition: color 0.25s ease;
    &:hover {
      color: $colorPrimary;
    }
  }
  &__actions {
    margin: 2px -3px -3px;
    display: flex;
    align-items: center;
  }
  &__action {
    padding: 3px;
    font-size: 0;
    &--heart {
      color: #c6c5c5;
      &.is-active {
        color: #ff5722;
      }
    }
    &--block {
      color: #c6c5c5;
      &.is-active {
        color: #ad0000;
      }
    }
  }
  &__modal-link {
    margin-top: 5px;
    font-size: 11px;
    color: rgba($fontColor, 0.6);
    cursor: pointer;
    span {
      border-bottom: 1px solid rgba($fontColor, 0.6);
      transition: color 0.25s ease, border 0.25s ease;
    }
    &:hover {
      span {
        color: $colorPrimary;
        border-color: transparent;
      }
    }
  }
}
@include r($sm) {
  .chat-head {
    &__wrapper {
      margin-bottom: 0;
    }
    &__col {
      flex-basis: 100%;
      max-width: 100%;
      margin-bottom: 10px;
    }
  }
}
</style>
