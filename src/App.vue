<template>
  <div id="app">
    <div class="page">
      <Header/>
      <div class="page__content">
        <Messenger/>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Shared/Header.vue';
import Messenger from '@/pages/Messenger.vue';

export default {
  name: 'app',
  components: {
    Messenger,
    Header,
  },
};
</script>

<style lang="scss">
@import 'normalize-scss';
@include normalize();
@import '@/theme/app.scss';

@import '@/theme/vendor/tooltip.scss';
@import '@/theme/vendor/select.scss';
.v--modal-overlay .v--modal-box {
  overflow: visible;
}
</style>
