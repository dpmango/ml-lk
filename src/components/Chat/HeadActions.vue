<template>
  <div class="head-actions" :class="{'is-active': isMoreOpen}">
    <div class="head-actions__toggle" @click="toggleMoreDropdown">
      <span>More</span>
      <svg-icon name="down-arrow" width="9" height="5"/>
    </div>
    <div class="head-actions__dropdown">
      <ul class="head-actions__list">
        <li>
          <a href="#" class="action-markadd" v-if="!Favorite">
            <svg-icon name="starmark" width="15" height="14"/>
            <span>Добавить в Избранное</span>
          </a>
          <a href="#" class="action-markremove" v-else>
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
          <a href="#" class="action-block" v-if="!Blocked">
            <svg-icon name="block" width="14" height="14"/>
            <span>Заблокировать</span>
          </a>
          <a href="#" class="action-unblock" v-else>
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
  methods: {
    toggleMoreDropdown() {
      this.isMoreOpen = !this.isMoreOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.head-actions {
  position: relative;
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
