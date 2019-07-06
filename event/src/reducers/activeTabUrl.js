const initialState = '';

export default (state = initialState, action) => {
  if (action.type === 'SET_TAB') {

      return action.payload;

  }
  return state;
};

