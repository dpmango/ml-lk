import { toggleObjectKey } from '@/helpers/StoreHelpers';

const Contacts = {
  state: {
    contacts: [],
  },
  getters: {
    contactsListLastId: state => {
      return state.contacts[state.contacts.length - 1].ID;
    },
  },
  mutations: {
    CONTACTS_SET(state, arr) {
      state.contacts = arr;
    },
    CONTACTS_APPEND(state, arr) {
      // slice(1)
      state.contacts = state.contacts.concat(arr);
    },
    CONTACT_REMOVE(state, removeId) {
      state.contacts = state.contacts.filter(x => x.ID !== removeId);
    },
    CONTACT_READ(state, readId) {
      const stateCopy = state.contacts;
      const targetContact = stateCopy.find(x => x.ID === readId);
      const targetIndex = stateCopy.indexOf(targetContact);
      targetContact.New = 'N';
      stateCopy[targetIndex] = targetContact;
      state.contacts = stateCopy;
    },
    CONTACT_TOGGLE_MARKED(state, tId) {
      const stateCopy = state.contacts;
      state.contacts = toggleObjectKey(stateCopy, tId, 'Marked');
    },
  },
};

export default Contacts;
