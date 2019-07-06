import React from 'react';

import rootReducer from './reducers';


import { wrapStore } from 'react-chrome-redux';



import { createStore } from 'redux'

const store = createStore(rootReducer);



chrome.tabs.onUpdated.addListener((tabid, info = {}, tab = {}) => {
//   if (!tab.url || typeof tab.url !== "string") {
//     return;
//   }
//   const previousTabUrls = (store.getState() || {}).tabUrls || {};

//  const previousTab = previousTabUrls[tabid];
//  if (previousTab) {
//    const previousUrlString = (previousTab || {}).urlString;
//    if (previousUrlString === tab.url) {
//      return;
//    }
//  }
  // return dispatchOnUpdated(tab, tabid, store);
  return store.dispatch({
    type: 'NEW_TAB_URL',
      payload: { 
        url: tabid, 
        urlString: tab.url
      }
  });

  
  // if ((info || {}).status !== 'complete') {
  //   return;
  // }
  
  const dispatchOnUpdated = (dispatchTab, dispatchTabId, dispatchStore) => {
    return (dispatchTab || {}).url && dispatchTabId && dispatchStore.dispatch({
      type: 'NEW_TAB_URL',
        payload: { 
          url: dispatchTabId, 
          urlString: dispatchTab.url,
          extensionId: chrome.runtime.id
        }
    });
  };

  if (store) {
    if (store.getState()) {
      if (typeof store.getState() === 'object') {
        if (tab && (tab || {}).url && (tab || {}).id) {
    
          if (((store.getState() || {}).tabUrls || {})[tab.id] && !!((((store.getState() || {}).tabUrls || {})[tab.id] || {}).urlString) !== true) {

            return;
          } else {
            return dispatchOnUpdated(tab, tabid, store);
          }
        } else {
          return dispatchOnUpdated(tab, tabid, store);
        }
      } else {
        return dispatchOnUpdated(tab, tabid, store);
      }
    } else {
      return dispatchOnUpdated(tab, tabid, store);
    }
  } else {
    return dispatchOnUpdated(tab, tabid, store);
  }

});


chrome.tabs.onActivated.addListener((activeInfo = {}, info, tab) => {
  // const updatedTabId = activeInfo.tabId;
  // if (store && store.dispatch) {
  //   if (updatedTabId) {
  //     const previousTabId = (store.getState() || {}).activeTabUrl;
  //     if (previousTabId && previousTabId == updatedTabId) {
  //       return;
  //     }  
  // }   }
    
      return store.dispatch({ 
        type: 'SET_TAB', 
        payload: activeInfo.tabId 
      });
 

 
  return;
  // TODO: remove or update un-reached 
const dispatchOnActivated = (dispatchActiveInfo, dispatchStore) => {
  if ((dispatchActiveInfo || {}).tabId) {

  }
  return dispatchStore.dispatch({ 
      type: 'SET_TAB', 
      payload: dispatchActiveInfo.tabId 
    });

}
  if (store) {

    if (store.getState()) {
      if (typeof store.getState() === 'object') {
       
        if (store.getState().activeTabUrl) {
          if ((store.getState() || {}).activeTabUrl && (store.getState() || {}).activeTabUrl == activeInfo.tabId) { 
            return;
          } else {
            return dispatchOnActivated(activeInfo, store);

          }

     
        } else {
          return dispatchOnActivated(activeInfo, store);


        }
      } 
    } 
  } 

});


wrapStore(store, {
  portName: 'lightningReaderExtension'
});
