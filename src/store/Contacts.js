import { toggleObjectKey } from '@/helpers/StoreHelpers';

const Contacts = {
  state: {
    pagination: {
      current: 1,
      next: 1,
      all: 1,
      isNextAvaiable: true,
    },
    contacts: [],
  },
  getters: {
    contactsListLastId: state => {
      return state.contacts[state.contacts.length - 1].ID;
    },
  },
  mutations: {
    SET_CONTACTS(state, arr) {
      state.contacts = arr;
    },
    APPEND_CONTACTS(state, arr) {
      // slice(1)
      state.contacts = state.contacts.concat(arr);
    },
    SET_CONTACTS_PAGINATION(state, payload) {
      const headers = {
        current: parseInt(payload['x-pagination-current-page'], 10),
        all: parseInt(payload['x-pagination-page-count'], 10),
      };
      const nextNum = headers.current + 1;
      state.pagination = {
        current: headers.current,
        next: nextNum,
        all: headers.all,
        isNextAvaiable: nextNum <= headers.all,
      };
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
