import { stateWithNewTextItemAdded } from "./stateWithNewTextItemAdded"
import {stateWithNewTextItemRemoved} from "./stateWithTextItemRemoved"


const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'NEW_TEXT_ITEM_WINDOW_UPDATED':

      return stateWithNewTextItemAdded(state, action);
    case 'REMOVE_TEXT_ITEM':

      return stateWithNewTextItemRemoved(state, action);
    default:

      return state;
  }
};




