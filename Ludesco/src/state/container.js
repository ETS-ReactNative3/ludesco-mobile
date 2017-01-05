import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';

const initialState = {
  modalVisible: false,
  loginModalVisible: false,
  reservations: [],
  event : {},
  customGames : [],
  user: {}
}

function dataReducer(state, action) {
  switch(action.type) {
    case 'FETCH_EVENTS_REQUEST':
      return Object.assign({},state,{events:[]});
    case 'FETCH_EVENTS_SUCCESS':
      return Object.assign({},state,{events:action.events});
    case 'FETCH_EVENT_SUCCESS':
      return Object.assign({},state,{event:action.event});
    case 'FETCH_EVENT_REQUEST':
      return Object.assign({},state);
    case 'FETCH_RESERVATIONS_REQUEST':
      return Object.assign({},state);
    case 'FETCH_RESERVATIONS_SUCCESS':
      return Object.assign({},state,{reservations:action.reservations});
    case 'FETCH_CUSTOM_GAMES_SUCCESS':
      return Object.assign({},state,{customGames:action.customGames});
    case 'LOGIN_SUCCESS':
      return Object.assign({},state,{user:action.user});
    case 'CATEGORIES' :
      return {categories: action.categories};
    case 'DAY_FILTER' :
      return Object.assign({},state,{day:action.day});
    case 'DEVICE_LOADED' :
      return Object.assign({},state,{device:action.device});
    case 'DISPLAY_MODAL' :
      return Object.assign({},state,{modalVisible:action.modalVisible});
    default:
      return Object.assign({},initialState);
  }
}
let store = createStore(dataReducer, applyMiddleware(thunkMiddleware));

export default store;

export function isConnected() {
  const state = store.getState();
  if(state.user.id) {
    return true;
  } else {
    return false;
  }
}
