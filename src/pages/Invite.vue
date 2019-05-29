<template>
  <div class="page">
    <Header/>
    <div class="page__content">
      <Container>
        <SendInvite/>
        <StartMain/>
      </Container>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Shared/Header.vue';
import Container from '@/components/Shared/Layout/Container.vue';
import StartMain from '@/components/StartMain.vue';
import SendInvite from '@/components/SendInvite.vue';

export default {
  name: 'Invite',
  components: {
    Header,
    Container,
    StartMain,
    SendInvite,
  },
};
</script>

<style scoped lang="scss">
@import '@/theme/utils.scss';
</style>
