<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>


<style lang="scss">
@import 'normalize-scss';
@include normalize();
@import '@/theme/app.scss';

@import '@/theme/vendor/tooltip.scss';
@import '@/theme/vendor/select.scss';
.v--modal-overlay {
  * {
    -webkit-overflow-scrolling: touch;
  }
  .v--modal-box {
    overflow: visible !important;
    margin-top: 25px;
    margin-bottom: 25px;
  }
  &.scrollable {
    .v--modal-box {
      margin-bottom: 25px;
    }
  }
}
</style>
