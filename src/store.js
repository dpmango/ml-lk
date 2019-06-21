import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import Page from '@/store/Page';
import Translators from '@/store/Translators';
import Notifications from '@/store/Notifications';
import Contacts from '@/store/Contacts';
import LadiesNtf from '@/store/LadiesNtf';
import Chat from '@/store/Chat';
import Sounds from '@/store/Sounds';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'marmeladies',
  storage: localStorage,
  supportCircular: true,
});

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  modules: {
    page: Page,
    translators: Translators,
    notifications: Notifications,
    contacts: Contacts,
    ladiesNtf: LadiesNtf,
    chat: Chat,
    sounds: Sounds,
  },
});
