const Contacts = {
  state: {
    contacts: [],
  },
  mutations: {
    CONTACTS_SET(state, arr) {
      state.contacts = arr;
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
    CONTACT_TOGGLE_MARKED(state, readId) {
      const stateCopy = state.contacts;
      const targetContact = stateCopy.find(x => x.ID === readId);
      const targetIndex = stateCopy.indexOf(targetContact);
      targetContact.Marked = targetContact.Marked === '1' ? '0' : '1';
      stateCopy[targetIndex] = targetContact;
      state.contacts = stateCopy;
    },
  },
};

export default Contacts;
