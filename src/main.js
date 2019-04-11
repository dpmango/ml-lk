import Vue from 'vue';
import VModal from 'vue-js-modal';
import VueTextareaAutosize from 'vue-textarea-autosize';
import VTooltip from 'v-tooltip';
import VueImg from 'v-img';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VModal);
Vue.use(VueTextareaAutosize);
Vue.use(VTooltip);
Vue.use(VueImg);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
