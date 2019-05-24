import Vue from 'vue';
import VModal from 'vue-js-modal';
import VueTextareaAutosize from 'vue-textarea-autosize';
import VTooltip from 'v-tooltip';
import VueImg from 'v-img';
import svg4everybody from 'svg4everybody';
import VueNativeSock from 'vue-native-websocket';
import App from './App.vue';
import store from './store';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VModal);
Vue.use(VueTextareaAutosize);
Vue.use(VTooltip);
Vue.use(VueImg);

Vue.use(VueNativeSock, 'wss://marmeladies.com/ws/', {
  connectManually: true,
  // store,
  format: 'json',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});

svg4everybody();

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
