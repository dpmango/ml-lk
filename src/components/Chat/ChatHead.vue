<template>
  <div class="chat-head">
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
            <div
              class="user-head__name"
            >{{storeData.Man.RealName}}, {{getAge(storeData.Man.DateOfBirth)}}</div>
            <div class="user-head__actions">
              <div class="user-head__action user-head__action--heart">
                <svg-icon name="heart" width="14" height="13"/>
              </div>
              <div class="user-head__action user-head__action--block">
                <svg-icon name="block" width="13" height="13"/>
              </div>
              <head-actions :Favorite="storeData.Favorite" :Blocked="storeData.Blocked"/>
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
            <div
              class="user-head__name"
            >{{storeData.Lady.RealName}}, {{getAge(storeData.Lady.DateOfBirth)}}</div>

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
            <span>{{storeData.Msg_stats}}</span>
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
        <textarea class="chat-head__notearea" name id rows="4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum</textarea>
      </div>
      <div class="chat-head__col">
        <textarea class="chat-head__notearea" name id rows="4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum</textarea>
      </div>
      <div class="chat-head__col">
        <textarea class="chat-head__notearea" name id rows="4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum</textarea>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import Avatar from '@/components/Users/Avatar.vue';
import HeadActions from '@/components/Chat/HeadActions.vue';
import { dateToAge } from '@/helpers/Dates';

export default {
  name: 'ChatHead',
  components: {
    SvgIcon,
    Avatar,
    HeadActions,
  },
  mounted() {},
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
      color: #ff5722;
    }
    &--block {
      color: #ad0000;
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
</style>
