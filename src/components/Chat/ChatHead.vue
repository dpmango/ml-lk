<template>
  <div class="chat-head">
    <div class="chat-head__wrapper">
      <div class="chat-head__col">
        <div class="chat-head__user user-head">
          <Avatar
            :size="44"
            :Thumbnail="data.Man.Thumbnail"
            :RealName="data.Man.RealName"
            :Online="data.Man.Online"
          />
          <div class="user-head__content">
            <div class="user-head__name">{{data.Man.RealName}}, {{getAge(data.Man.DateOfBirth)}}</div>
            <div class="user-head__actions">
              <div class="user-head__action user-head__action--heart">
                <svg-icon name="heart" width="14" height="13"/>
              </div>
              <div class="user-head__action user-head__action--block">
                <svg-icon name="block" width="13" height="13"/>
              </div>
              <head-actions :Favorite="data.Favorite" :Blocked="data.Blocked"/>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-head__col">
        <div class="chat-head__user user-head">
          <Avatar
            :size="44"
            :Thumbnail="data.Lady.Thumbnail"
            :RealName="data.Lady.RealName"
            :Online="data.Lady.Online"
          />
          <div class="user-head__content">
            <div class="user-head__name">{{data.Lady.RealName}}, {{getAge(data.Lady.DateOfBirth)}}</div>
            <div class="user-head__actions">TODO - Фото</div>
          </div>
        </div>
      </div>
      <div class="chat-head__col">
        <div class="chat-head__info">
          <div class="chat-head__info-row">
            <span>Письма:</span>
            <span>{{data.Msg_stats}}</span>
          </div>
          <div class="chat-head__info-row">
            <span>Чаты:</span>
            <span>{{data.Chat_stats}}</span>
          </div>
          <div class="chat-head__info-row">
            <span>Доставки:</span>
            <span>{{data.Dlv_stats}}</span>
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
import api from '@/helpers/Api';

export default {
  name: 'ChatHead',
  components: {
    SvgIcon,
    Avatar,
    HeadActions,
  },
  mounted() {
    this.fetchApi();
  },
  data() {
    return {
      isPhotosOpen: false,
      data: {
        Man: {
          ID: '',
          RealName: '',
          DateOfBirth: '',
          Status: '',
          Online: '',
          Thumbnail: '',
        },
        Lady: {
          ID: '',
          RealName: '',
          DateOfBirth: '',
          Status: '',
          Online: '',
          Thumbnail: '',
        },
        Favorite: false,
        Blocked: false,
        Chat_enable: false,
        Chat_reason: '',
        Msg_stats: '',
        Chat_stats: '',
        Dlv_stats: '',
        // Comments_man: '',
        // Comments_lady: '',
        // Comments_pair: '',
      },
    };
  },
  computed: {
    // getAge(DateOfBirth) {
    //   return dateToAge(DateOfBirth);
    // },
  },
  methods: {
    fetchApi() {
      api
        .get('chats/info', {
          params: {
            man: 1156964,
            lady: 1543646,
          },
        })
        .then(res => {
          console.log('res', res.data[0]);
          this.data = res.data[0];
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAge(DateOfBirth) {
      return dateToAge(DateOfBirth);
    },
    togglePhotosDropdown() {
      this.isPhotosOpen = !this.isPhotosOpen;
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
}
</style>
