<template>
  <header class="header" :class="{ 'header--attach': modifier }">
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
          <Button primary @click="openAddEdit">Добавить переводчика</Button>
        </div>
        <div class="header__logo">
          <svg-icon name="logo" width="150" height="38"/>
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
    margin-left: 30px;
  }
  &__logo {
    margin-left: auto;
    margin-right: auto;
  }
  &--attach{
    .header__logo{
      // centrify logo by hamburger + cta
      padding-right: calc(225px + 30px + 40px - 10px);
    }
  }
}

.menu{
  position: absolute;
  z-index: 2;
  left: -20px;
  top: 50px;
  min-width: 400px;
  background: #FFFFFF;
  padding: 15px 20px 20px;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.14);
  opacity: 0;
  transform: translate(-100%,0);
  pointer-events: none;
  transition: opacity .05s ease, transform .25s ease-in-out;
  &.is-active{
    opacity: 1;
    pointer-events: all;
    transform: translate(0,0);
  }
  &__list{
    list-style: none;
    margin: 0;
    padding: 0;
    li{
      display: block;
    }
    a{
      display: inline-block;
      padding: 5px;
      font-size: 15px;
      transition: color .25s ease-in-out;
      &:hover{
        color: $colorOrange;
      }
    }
  }
}
</style>
