const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'NEW_TAB_URL':

      return stateWithNewUrlAdded(state, action);
    // case 'EXISTING_TAB_URL_NEW_TAB':

    //   return stateWithExistingTabUrlAndNewTab(state, action);
    // case 'EXISTING_TAB_RENDERED':

    //   return stateWithExistingTabRendered(state, action);
    // case 'EXISTING_TAB_URL_REMOVE_TAB':

    //   return stateWithTabRemoved(state, action);
    default:

      return state;
  }
};

// TODO: return object - normalized
const setUpdatedTabUrlsState = (tabs, updatedTab, tabIndex) => {
  return [
    ...tabs.slice(0, tabIndex),
    updatedTab,
    ...tabs.slice(tabIndex + 1, tabs.length)
  ];
};

const stateWithSetTabUrl = (state, action) => {
  const tabUrl = action.payload;
  const previousTabUrl = state.slice(0).find(tab => tab.url === tabUrl);
  if (!previousTabUrl) {
    return stateWithNewUrlAdded(state, { payload: { url: tabUrl } });
  }
  let b = { '1': { url: '2' }, '5': { url: '2' } }
  Object.assign({}, b, { '1': { url: 'updated' } })

  return state;
};

const stateWithNewUrlAdded = (state, action) => {
  const previousState = JSON.parse(JSON.stringify({...state}));;
  const url = action.payload.url;
  const urlString = action.payload.urlString;
  const newTabUrl = { url, urlString };

  return {
    ...previousState,
    [ url ]: {...newTabUrl}
  }
};

const stateWithExistingTabRendered = (state, action) => {
  const tabs = state.slice(0);
  const previousTabIndex = getPreviousTabIndex(action, tabs);
  const previousTab = Object.assign({}, tabs[ previousTabIndex ]);

  const updatedRenderedAttribute = { rendered: action.payload };
  const updatedTab = Object.assign({}, previousTab, updatedRenderedAttribute);

  return setUpdatedTabUrlsState(tabs, updatedTab, previousTabIndex);
};

const stateWithTabRemoved = (state, action) => {
  const tabs = state.slice(0);
  const previousTabIndex = getPreviousTabIndex(action, tabs);
  const previousTab = Object.assign({}, tabs[ previousTabIndex ]);

  const previousTabCount = previousTab.tabCount;
  const updatedTabCount = previousTabCount <= 0 ? 0 : previousTabCount - 1;
  const updatedTabCountAttribute = { tabCount: updatedTabCount };
  const updatedTab = Object.assign({}, previousTab, updatedTabCountAttribute);

  return setUpdatedTabUrlsState(tabs, updatedTab, previousTabIndex);
};

const stateWithExistingTabUrlAndNewTab = (state, action) => {
  const tabs = state.slice(0);
  const previousTabIndex = getPreviousTabIndex(action, tabs);
  const previousTab = Object.assign({}, tabs[ previousTabIndex ]);

  const updatedTabCountAttribute = { tabCount: previousTab.tabCount + 1 };
  const updatedTab = Object.assign({}, previousTab, updatedTabCountAttribute);

  return setUpdatedTabUrlsState(tabs, updatedTab, previousTabIndex);
};

const getPreviousTabIndex = (action, tabs) => {
  const existingTab = action.payload;
  return tabs.findIndex(tab => tab.url === existingTab.url);
};




