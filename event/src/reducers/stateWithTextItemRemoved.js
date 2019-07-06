export const stateWithNewTextItemRemoved = (state, action) => {
    const textItemsState = JSON.parse(JSON.stringify({...state}));
    const { payload: { url: urlId } } = action;
    const urlIdToRemove = String(urlId);
    const previousStateUrls = Object.keys({...textItemsState});
    let updatedState = {};
    for (let i = 0, len = previousStateUrls.length; i < len; i++ ) {
      const id = String(previousStateUrls[i]);
      if (id !== urlIdToRemove) {
        const textItem = ({...textItemsState})[id];
        updatedState = {...updatedState, [id]: textItem}
      }
    }
    return updatedState;
  };