<template>
  <div class="head-actions" :class="{'is-active': isMoreOpen}" v-click-outside="hideDropdown">
    <div class="head-actions__toggle" @click="toggleMoreDropdown">
      <span>More</span>
      <svg-icon name="down-arrow" width="9" height="5"/>
    </div>
    <div class="head-actions__dropdown">
      <ul class="head-actions__list">
        <li>
          <a href="#" class="action-markadd" v-if="!Favorite" @click="addFavorite">
            <svg-icon name="starmark" width="15" height="14"/>
            <span>Добавить в Избранное</span>
          </a>
          <a href="#" class="action-markremove" v-else @click="removeFavorite">
            <svg-icon name="starmark" width="15" height="14"/>
            <span>Удалить из Избранного</span>
          </a>
          <a href="#" class="action-kiss" @click="sendKiss">
            <svg-icon name="kisssmile" width="15" height="15"/>
            <span>Подмигнуть</span>
          </a>
          <a href="#" class="action-letter" @click="sendLetter">
            <svg-icon name="mail" width="14" height="10"/>
            <span>Написать письмо</span>
          </a>
          <a href="#" class="action-block" v-if="!Blocked" @click="addBlocked">
            <svg-icon name="block" width="14" height="14"/>
            <span>Заблокировать</span>
          </a>
          <a href="#" class="action-unblock" v-else @click="removeBlocked">
            <svg-icon name="block" width="14" height="14"/>
            <span>Разблокировать</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import ClickOutside from 'vue-click-outside';
import api from '@/helpers/Api';

export default {
  name: 'ChatHead',
  components: {
    SvgIcon,
  },
  props: {
    Favorite: Boolean,
    Blocked: Boolean,
  },
  data() {
    return {
      isMoreOpen: false,
    };
  },
  computed: {
    currentUsers() {
      return this.$store.state.chat.currentUsers;
    },
  },
  methods: {
    hideDropdown() {
      this.isMoreOpen = false;
    },
    toggleMoreDropdown() {
      this.isMoreOpen = !this.isMoreOpen;
    },
    addFavorite() {
      this.pingApi({
        apiAction: 'post',
        apiEndpoint: `favorites`,
        commitAction: 'CHAT_ADD_FAVORITE',
        errTitle: 'Ошибка при добавлении в избранное',
      });
    },
    removeFavorite() {
      this.pingApi({
        apiAction: 'delete',
        apiEndpoint: `favorites`,
        commitAction: 'CHAT_REMOVE_FAVORITE',
        errTitle: 'Ошибка при удалении из избранного',
      });
    },
    sendKiss() {
      this.pingApi({
        apiAction: 'post',
        apiEndpoint: `kisses`,
        // commitAction: 'CHAT_ADD_BLOCKED',
        errTitle: 'Ошибка при подмигивании',
      });
    },
    sendLetter() {},
    addBlocked() {
      this.pingApi({
        apiAction: 'post',
        apiEndpoint: `blocklists`,
        commitAction: 'CHAT_ADD_BLOCKED',
        errTitle: 'Ошибка при добавлении в блоклист',
      });
    },
    removeBlocked() {
      this.pingApi({
        apiAction: 'delete',
        apiEndpoint: `blocklists`,
        commitAction: 'CHAT_REMOVE_BLOCKED',
        errTitle: 'Ошибка при удалении из блоклиста',
      });
    },
    pingApi(options) {
      api[options.apiAction](options.apiEndpoint, {
        params: this.currentUsers,
      })
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
            if (options.commitAction) {
              this.$store.commit(options.commitAction, this.currentUsers);
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
  directives: {
    ClickOutside,
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.head-actions {
  position: relative;
  z-index: 5;
  margin-left: 5px;
  transform: translateY(0.1em);
  &__toggle {
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
  &__dropdown {
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
  &__list {
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
    .head-actions {
      &__dropdown {
        opacity: 1;
        transform: translate(0, 0);
        pointer-events: all;
      }
    }
  }
}
</style>
