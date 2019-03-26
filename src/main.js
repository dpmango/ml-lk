import Vue from 'vue';
import VModal from 'vue-js-modal';
import VueTextareaAutosize from 'vue-textarea-autosize';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VModal);
Vue.use(VueTextareaAutosize);

new Vue({
  render: h => h(App),
}).$mount('#app');
