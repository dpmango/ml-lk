<template>
  <header class="header">
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
        </div>
      </div>
    </Container>
  </header>
</template>

<script>
import Container from '@/components/Shared/Layout/Container.vue';

export default {
  name: 'Header',
  components: {
    Container,
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
  },
};
</script>

<style scoped lang="scss">
@import '@/theme/utils.scss';
@import '@/theme/vendor/hamburgers.scss';

.header {
  position: fixed;
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
    margin-left: -10px;
  }
}
</style>
