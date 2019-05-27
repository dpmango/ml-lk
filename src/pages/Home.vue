<template>
  <div class="page">
    <Header/>
    <div class="page__content">
      <Container>
        <div class="grid">
          <div class="col col--left">
            <NotificationsList/>
          </div>
          <div class="col col--chat">
            <Chat/>
          </div>
        </div>
      </Container>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Shared/Header.vue';
import Container from '@/components/Shared/Layout/Container.vue';
import NotificationsList from '@/components/NotificationsList.vue';
import Chat from '@/components/Chat.vue';

export default {
  name: 'Home',
  components: {
    Header,
    Container,
    NotificationsList,
    Chat,
  },
};
</script>

<style scoped lang="scss">
@import '@/theme/utils.scss';

.grid {
  display: flex;
  margin-left: -5px;
  margin-right: -5px;
}
.col {
  width: 100%;
  max-width: 100%;
  flex: 0 0 100%;
  min-width: 1px;
  min-height: 0;
  padding-left: 5px;
  padding-right: 5px;
  &--left {
    flex: 0 1 380px;
    max-width: 380px;
  }
  &--chat {
    flex: 1 1 calc(100% - 380px);
    max-width: calc(100% - 380px);
  }
}
@include r($xl) {
  .grid {
    flex-wrap: wrap;
    padding-bottom: 40px;
  }
  .col {
  }
}
@include r($sm) {
  .grid {
    margin-left: -25px;
    margin-right: -25px;
  }
}
</style>
