import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';

const initialState = {
  event : {},
  profile : {
    categories: [],
    reservations: []
  },
  customGames : [],
  studioEvents : [],
  user: {},
  notificationInfo : true,
  notificationParties : false,
  notificationModalVisible : false,
  notification : {},
  search : ""
}

function dataReducer(state, action) {
  switch(action.type) {
    case 'BOOTSTRAP':
      if(action.profile) {
        state.profile = action.profile;
        if(!state.profile.reservations) {
          state.profile.reservations = [];
        }
      }
      return state;
    case 'FETCH_EVENTS_REQUEST':
      return Object.assign({},state,{events:[], loading: true});
    case 'FETCH_EVENTS_SUCCESS':
      return Object.assign({},state,{events:action.events, loading: false});
    case 'FETCH_EVENT_SUCCESS':
      return Object.assign({},state,{event:action.event, loading: false});
    case 'FETCH_EVENT_REQUEST':
      return Object.assign({},state, {loading: true});
    case 'FETCH_RESERVATIONS_REQUEST':
      return Object.assign({},state, {loading: true});
    case 'FETCH_RESERVATIONS_SUCCESS':
      return {...state, loading: false, profile: {...state.profile, reservations: action.reservations}};
    case 'FETCH_CUSTOM_GAMES_SUCCESS':
      return Object.assign({},state,{customGames:action.customGames , loading: false});
    case 'FETCH_EVENTS_STUDIO_SUCCESS':
      return Object.assign({},state,{studioEvents: action.studioEvents, loading: false})
    case 'LOGIN_SUCCESS':
      return {...state, loading: false, profile: {...state.profile, user: action.user}};
    case 'LOGOUT':
      return {...state, loading: false, profile: {...state.profile, user: null, reservations: [] }};
    case 'CATEGORIES_LOADED' :
      return {...state, loading: false, profile: {...state.profile, categories: action.categories}};
    case 'DAY_FILTER' :
      return Object.assign({},state,{day:action.day});
    case 'DEVICE_LOADED' :
      return Object.assign({},state,{device:action.device});
    case 'TOGGLE_NOTIFICATIONS_PARTIES' :
      return Object.assign({},state,{notificationParties:action.value});
    case 'TOGGLE_NOTIFICATIONS_INFO' :
      return Object.assign({},state,{notificationInfo:action.value});
    case 'NOTIFICATION_RECEIVED' :
      return Object.assign({}, state,{notificationModalVisible: true, notification:action.notification});
    case 'NOTIFICATION_ACKNOWLEDGE':
      return Object.assign({}, state,{notificationModalVisible: false});
    case 'SEARCH':
      return Object.assign({}, state,{search: action.search});
    default:
      if(!state) {
        return Object.assign({},initialState);
      } else {
        return Object.assign({},state);
      }
  }
}

let store = createStore(dataReducer, applyMiddleware(thunkMiddleware));

export default store;

export function isConnected() {
  const state = store.getState();
  if(state.profile.user) {
    return true;
  } else {
    return false;
  }
}
