import Vue from 'vue';
import VModal from 'vue-js-modal';
import VueTextareaAutosize from 'vue-textarea-autosize';
import VTooltip from 'v-tooltip';
import VueImg from 'v-img';
import VCalendar from 'v-calendar';
import VueNotifications from 'vue-notifications';
import miniToastr from 'mini-toastr';
import svg4everybody from 'svg4everybody';
import App from './App.vue';
import store from './store';
import router from './router';
import { saveToken } from '@/helpers/storeToken';

import 'v-calendar/lib/v-calendar.min.css';

Vue.config.productionTip = false;
saveToken('fEYfNEUlMlVhEkQYQGanvihAWGeLqI19');
// saveToken('BqxKJPW-BrOQA3YbNwp54gFaNcpnO9I');

Vue.use(VModal);
Vue.use(VueTextareaAutosize);
Vue.use(VTooltip);
Vue.use(VueImg);
Vue.use(VCalendar, {
  firstDayOfWeek: 2, // Monday
});
miniToastr.init({
  types: {
    success: 'success',
    error: 'error',
    info: 'info',
    warn: 'warn',
  },
});
function toast({ title, message, type, timeout, cb }) {
  return miniToastr[type](message, title, timeout, cb);
}
Vue.use(VueNotifications, {
  success: toast,
  error: toast,
  info: toast,
  warn: toast,
});

svg4everybody();

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
