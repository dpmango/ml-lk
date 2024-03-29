import { toggleObjectKey } from '@/helpers/StoreHelpers';

const findByUsers = (arr, users) => {
  return arr.find(x => x.Man.ID === users.man && x.Lady.ID === users.lady);
};

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
    getActiveContact: state => users => {
      const res = findByUsers(state.contacts, users);
      return res ? res.ID : {};
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
    CONTACT_UPDATE_OR_PREPEND(state, payload) {
      const stateCopy = state.contacts;
      const targetContact = stateCopy.find(x => x.ID === payload.contact.ID);
      if (targetContact) {
        // existing notification
        const targetIndex = stateCopy.indexOf(targetContact);
        targetContact.Marked = payload.contact.Marked;
        targetContact.File = payload.contact.File;
        targetContact.LastMessage = payload.contact.LastMessage;
        targetContact.LastMessageDate = payload.contact.LastMessageDate;
        targetContact.Man.Online = payload.contact.Man.Online;
        targetContact.Lady.Online = payload.contact.Lady.Online;
        if (!payload.isCurrentChat) {
          targetContact.ChatNew = payload.contact.ChatNew;
          targetContact.MsgNew = payload.contact.MsgNew;
        }
        stateCopy[targetIndex] = targetContact;
        /* eslint-disable */
        stateCopy.sort((x, y) =>
          x.ID === payload.contact.ID ? -1 : y.ID === payload.contact.ID ? 1 : 0,
        );
        /* eslint-enable */
        state.contacts = stateCopy;
      } else {
        state.contacts.unshift(payload.contact);
      }
    },
    CONTACT_READ(state, users) {
      const stateCopy = state.contacts;
      const targetContact = findByUsers(stateCopy, users);
      if (targetContact) {
        const targetIndex = stateCopy.indexOf(targetContact);
        targetContact.ChatNew = '0';
        stateCopy[targetIndex] = targetContact;
        state.contacts = stateCopy;
      }
    },
    CONTACT_TOGGLE_MARKED(state, tId) {
      const stateCopy = state.contacts;
      state.contacts = toggleObjectKey(stateCopy, tId, 'Marked');
    },
    CONTACT_TOGGLE_LADY_ONLINE(state, payload) {
      const stateCopy = state.contacts;
      const ids = payload.ladiesIDs ? payload.ladiesIDs : [payload.ladyId];
      const targetContacts = stateCopy.filter(x => ids.indexOf(x.Lady.ID) !== -1);
      targetContacts.forEach(x => {
        x.Lady.Online = payload.shouldOn ? '1' : '0';
      });
      state.contacts = stateCopy;
    },
  },
};

export default Contacts;
