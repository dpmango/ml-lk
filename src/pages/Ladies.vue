<template>
  <div class="page">
    <Header/>
    <div class="page__content">
      <Container>
        <LadiesNotifications/>
        <StartMain/>
      </Container>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Shared/Header.vue';
import Container from '@/components/Shared/Layout/Container.vue';
import LadiesNotifications from '@/components/LadiesNotifications.vue';
import StartMain from '@/components/StartMain.vue';

export default {
  name: 'Ladies',
  components: {
    Header,
    Container,
    LadiesNotifications,
    StartMain,
  },
};
</script>

<style scoped lang="scss">
@import '@/theme/utils.scss';
</style>
