<template>
  <div id="app">
    <div class="page">
      <Header/>
      <div class="page__content">
        <img alt="Vue logo" src="./assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js App"/>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Shared/Header.vue';
import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'app',
  components: {
    Header,
    HelloWorld,
  },
};
</script>

<style lang="scss">
@import '@/theme/app.scss';
</style>
