import { createStore } from 'redux';

function loginReducer(state = {}, action) {
  switch(action.type) {
    case 'LOGIN' :
      return {loginId : action.loginId};
    case 'CATEGORIES' :
      return {categories: action.categories}
    default :
      return state;
  }
}

let store = createStore(loginReducer);

export default store;

export function isConnected() {
  const state = store.getState();
  if(state.loginId) {
    return true;
  } else {
    return false;
  }
}
