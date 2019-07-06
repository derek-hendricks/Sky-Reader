import { stateWithNewTextItemAdded } from "./stateWithNewTextItemAdded"
import { stateWithNewTextItemRemoved } from "./stateWithTextItemRemoved"
const initialState = {};

export default (state = initialState, action) => {
    
    switch (action.type) {
        case 'CUSTOM_USER_TEXT':

        return  stateWithNewTextItemAdded(state, action);
        case 'NEW_TEXT_ITEM_WINDOW_UPDATED':
       
        return stateWithNewTextItemRemoved(state, action);
        
        default:

        return state;
    }
}