const initialState = {};

export default (state = initialState, action) => {
  if (action.type === 'REMOVE_TEXT_ITEM') {
    const { payload: { textItem, url: urlId } } = action;
      const previousTextItemState = JSON.parse(JSON.stringify({...state}));
      const { url } = textItem;
      // previousTextItemState[url] = textItem;
      // return previousTextItemState;
      return {
        ...previousTextItemState,
        [ url ]: {...textItem}
      }
  }

  if (action.type === 'PREVIOUS_TEXT_ITEM_ADDED') {
    const { payload: { text, url, urlString } } = action;
    const previousTextItemState = JSON.parse(JSON.stringify({...state}));
    // previousTextItemState[url] = {text, url, urlString};
    // return previousTextItemState;
    return {
      ...previousTextItemState,
      [ url ]: {...{text, url, urlString}}
    }
  }

  if (action.type === 'REMOVE_PREVIOUS_TEXT_ITEM') {
    const previousTextItemState = JSON.parse(JSON.stringify({...state}));
    const { payload: { url: urlId } } = action;
    const urlIdToRemove = String(urlId);
    const previousStateUrls = Object.keys({...previousTextItemState});
    let updatedState = {};
    
    for (let i = 0, len = previousStateUrls.length; i < len; i++ ) {
      const id = String(previousStateUrls[i]);
      if (id !== urlIdToRemove) {
        const textItem = ({...previousTextItemState})[id];
        updatedState = {
          ...updatedState, 
          [id]: {...textItem}
        }
      }
    }
    return updatedState;
  }
  return state;
};

