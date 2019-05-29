const Contacts = {
  state: {
    contacts: [],
  },
  mutations: {
    setContacts(state, arr) {
      state.contacts = arr;
    },
    removeContact(state, removeId) {
      state.contacts = state.contacts.filter(x => x.ID !== removeId);
    },
    readContact(state, readId) {
      const stateCopy = state.contacts;
      const targetContact = stateCopy.find(x => x.ID === readId);
      const targetIndex = stateCopy.indexOf(targetContact);
      targetContact.New = 'N';
      stateCopy[targetIndex] = targetContact;
      state.contacts = stateCopy;
    },
    markContact(state, readId) {
      const stateCopy = state.contacts;
      const targetContact = stateCopy.find(x => x.ID === readId);
      const targetIndex = stateCopy.indexOf(targetContact);
      targetContact.Marked = '1';
      stateCopy[targetIndex] = targetContact;
      state.contacts = stateCopy;
    },
    unmarkContact(state, readId) {
      const stateCopy = state.contacts;
      const targetContact = stateCopy.find(x => x.ID === readId);
      const targetIndex = stateCopy.indexOf(targetContact);
      targetContact.Marked = '0';
      stateCopy[targetIndex] = targetContact;
      state.contacts = stateCopy;
    },
  },
};

export default Contacts;
