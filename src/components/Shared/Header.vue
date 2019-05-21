<template>
  <header class="header" :class="{ 'header--attach': isTranslatorsPage }">
    <Container>
      <div class="header__wrapper">
        <div class="header__hamburger">
          <button
            @click="toggleHamburger"
            class="hamburger hamburger--elastic"
            :class="{ 'is-active': hamburgerActive }"
            type="button"
          >
            <span class="hamburger-box">
              <span class="hamburger-inner"></span>
            </span>
          </button>
          <div class="menu" :class="{ 'is-active' : hamburgerActive }">
            <ul class="menu__list">
              <li>
                <router-link to="/translators">Переводчики</router-link>
              </li>
              <li>
                <a href="#">Девушки</a>
              </li>
              <li>
                <a href="#">Сообщения</a>
              </li>
              <li>
                <a href="#">Мой профиль</a>
              </li>
              <li>
                <a href="#">Настройки</a>
              </li>
              <li>
                <a href="#">Выйти</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="header__actions">
          <template v-if="isTranslatorsPage">
            <Button primary @click="openAddEdit">Добавить переводчика</Button>
          </template>
          <template v-else>
            <Button primary>Отправить приглашение</Button>
            <router-link to="/ladies">
              <Button primary>Девушки</Button>
            </router-link>
          </template>
        </div>
        <div class="header__logo">
          <router-link to="/">
            <svg-icon name="logo" width="150" height="38"/>
          </router-link>
        </div>
      </div>
    </Container>
  </header>
</template>

<script>
import Container from '@/components/Shared/Layout/Container.vue';
import Button from '@/components/Shared/UI/Button.vue';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';

export default {
  name: 'Header',
  components: {
    Container,
    Button,
    SvgIcon,
  },
  props: {
    modifier: String,
  },
  data() {
    return {
      hamburgerActive: false,
    };
  },
  computed: {
    isTranslatorsPage() {
      return this.modifier === 'translators';
    },
  },
  methods: {
    toggleHamburger() {
      this.hamburgerActive = !this.hamburgerActive;
    },
    openAddEdit() {
      this.$modal.show('add-translator', {
        type: 'add',
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/theme/utils.scss';
@import '@/theme/vendor/hamburgers.scss';

.header {
  position: fixed;
  min-width: 320px;
  z-index: 9;
  top: 0;
  left: 0;
  right: 0;
  background: $colorBg;
  &__wrapper {
    display: flex;
    align-items: center;
    min-height: 60px;
  }
  &__hamburger {
    position: relative;
    margin-left: -10px;
  }
  &__actions {
    flex: 0 0 auto;
    margin-left: 30px;
    display: flex;
    align-items: center;
    button {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  &__logo {
    margin-left: auto;
    margin-right: auto;
    padding-right: calc(225px + 30px + 40px - 10px);
  }
  &--attach {
    .header__logo {
      // centrify logo by hamburger + cta
      padding-right: calc(235px + 10px + 130px + 30px + 40px - 10px);
    }
  }
}

@include r($lg) {
  .header {
    &__logo {
      padding-right: 0;
      margin-right: 0;
    }
  }
}

.menu {
  position: absolute;
  z-index: 2;
  left: -20px;
  top: 50px;
  min-width: 400px;
  background: #ffffff;
  padding: 15px 20px 20px;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.14);
  opacity: 0;
  transform: translate(-100%, 0);
  pointer-events: none;
  transition: opacity 0.05s ease, transform 0.25s ease-in-out;
  &.is-active {
    opacity: 1;
    pointer-events: all;
    transform: translate(0, 0);
  }
  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      display: block;
    }
    a {
      display: inline-block;
      padding: 5px;
      font-size: 15px;
      transition: color 0.25s ease-in-out;
      &:hover {
        color: $colorOrange;
      }
    }
  }
}
</style>
