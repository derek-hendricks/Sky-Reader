export const stateWithNewTextItemAdded = (state, action) => {
  const newTextItemAddedState = JSON.parse(JSON.stringify({...state}));

  const {
    payload: {
      url,
      text,
      urlString
    }
  } = action;

  // newTextItemAddedState[url] = {url, urlString, text};

  // return newTextItemAddedState;
  return {
    ...newTextItemAddedState,
    [ url ]: {...{url, urlString, text}}
  }
};