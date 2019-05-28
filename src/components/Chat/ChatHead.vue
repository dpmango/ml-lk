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
              <div class="user-head__more" :class="{'is-active': isMoreOpen}">
                <div class="user-head__more-toggle" @click="toggleMoreDropdown">
                  <span>More</span>
                  <svg-icon name="down-arrow" width="9" height="5"/>
                </div>
                <div class="user-head__more-dropdown">
                  <ul class="user-head__more-list">
                    <li>
                      <a href="#" class="action-markadd">
                        <svg-icon name="starmark" width="15" height="14"/>
                        <span>Добавить в Избранное</span>
                      </a>
                      <a href="#" class="action-markremove">
                        <svg-icon name="starmark" width="15" height="14"/>
                        <span>Удалить из Избранного</span>
                      </a>
                      <a href="#" class="action-kiss">
                        <svg-icon name="kisssmile" width="15" height="15"/>
                        <span>Подмигнуть</span>
                      </a>
                      <a href="#" class="action-letter">
                        <svg-icon name="mail" width="14" height="10"/>
                        <span>Написать письмо</span>
                      </a>
                      <a href="#" class="action-block">
                        <svg-icon name="block" width="14" height="14"/>
                        <span>Заблокировать</span>
                      </a>
                      <a href="#" class="action-unblock">
                        <svg-icon name="block" width="14" height="14"/>
                        <span>Разблокировать</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
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
import { dateToAge } from '@/helpers/Dates';
import api from '@/helpers/Api';

export default {
  name: 'ChatHead',
  components: {
    SvgIcon,
    Avatar,
  },
  mounted() {
    this.fetchApi();
  },
  data() {
    return {
      isMoreOpen: false,
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
    toggleMoreDropdown() {
      this.isMoreOpen = !this.isMoreOpen;
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
  &__more {
    position: relative;
    margin-left: 5px;
    transform: translateY(0.1em);
    &-toggle {
      display: flex;
      align-items: center;
      cursor: pointer;
      span {
        display: inline-block;
        font-size: 11px;
        margin-right: 4px;
      }
      .svg-icon {
      }
    }
    &-dropdown {
      position: absolute;
      z-index: 3;
      top: 100%;
      left: 0;
      width: 180px;
      background: #ffffff;
      box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
      transition: opacity 0.25s ease, transform 0.35s ease;
      opacity: 0;
      pointer-events: none;
      transform: translate(0px, 7px);
    }
    &-list {
      list-style: none;
      margin: 0;
      padding: 7px 8px;
      li {
        display: block;
        margin: 0 -5px;
      }
      a {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 6px 5px;
        transition: 0.25s ease;
        span {
          flex: 0 0 auto;
          font-size: 12px;
          padding-left: 22px;
        }
        &:hover {
          color: $colorPrimary;
        }
        .svg-icon {
          position: absolute;
          top: 50%;
          left: 5px;
          transform: translateY(-50%);
        }
        &.action-markadd {
          .svg-icon {
            color: $colorOrange;
          }
        }
        &.action-markremove {
          .svg-icon {
            color: #c6c5c5;
          }
        }
        &.action-kiss {
          .svg-icon {
            color: $colorOrange;
          }
        }
        &.action-letter {
          .svg-icon {
            color: #473f69;
          }
        }
        &.action-block {
          .svg-icon {
            color: #ad0000;
          }
        }
        &.action-unblock {
          .svg-icon {
            color: #a5a5a5;
          }
        }
      }
    }
    &.is-active {
      .user-head__more {
        &-dropdown {
          opacity: 1;
          transform: translate(0, 0);
          pointer-events: all;
        }
      }
    }
  }
}
</style>
