export const saveToken = token => {
  try {
    const serializedToken = JSON.stringify(token);
    localStorage.setItem('MLTranslatorToken', serializedToken);
  } catch (err) {
    console.log('We received an error while saving the token');
  }
};

export const getToken = () => {
  try {
    const serializedToken = localStorage.getItem('MLTranslatorToken');
    if (serializedToken) {
      return JSON.parse(serializedToken);
    }
    return undefined;
  } catch (err) {
    return undefined;
  }
};

export const saveTokenIfEmpty = token => {
  if (!getToken()) {
    saveToken(token);
  }
};

export const clearToken = () => {
  try {
    localStorage.clear();
    return true;
  } catch (err) {
    return undefined;
  }
};
