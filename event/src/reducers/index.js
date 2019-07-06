import { combineReducers } from 'redux';

import activeTabUrl from './activeTabUrl';
import tabUrls from './tabUrls';
import textItems from './textItems';
import previousTextItems from './previousTextItems';
import customTexts from './customTexts';

export default combineReducers({
  activeTabUrl,
  tabUrls,
  textItems,
  previousTextItems,
  customTexts
});
