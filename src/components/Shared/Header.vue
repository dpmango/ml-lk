<template>
  <header class="header">
    <Container>
      <div class="header__wrapper"></div>
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
};
</script>

<style scoped lang="scss">
@import '@/theme/utils.scss';

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: $colorBg;
  &__wrapper {
    display: flex;
    align-items: center;
    min-height: 60px;
  }
}
</style>
