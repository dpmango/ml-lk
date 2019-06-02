import Vue from 'vue';
import Vuex from 'vuex';
import Translators from '@/store/Translators';
import Notifications from '@/store/Notifications';
import Contacts from '@/store/Contacts';
import Chat from '@/store/Chat';
import Users from '@/store/Users';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    translators: Translators,
    notifications: Notifications,
    contacts: Contacts,
    chat: Chat,
    users: Users,
  },
});
