import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { StackNavigator, AppNavigator, NavigationActions } from 'react-navigation';

import ProgrammeSceneContainer from '../containers/ProgrammeSceneContainer.js';
import EventSceneContainer from '../containers/EventSceneContainer.js';
import MyReservationsSceneContainer from '../containers/MyReservationsSceneContainer.js';
import StudioSceneContainer from '../containers/StudioSceneContainer.js';

export const RootNavigator = StackNavigator({
  Programme : {
    screen: ProgrammeSceneContainer
  },
  Agenda : {
    screen: MyReservationsSceneContainer
  },
  Studio : {
    screen: StudioSceneContainer
  },
  Event : {
    screen : EventSceneContainer
  }
});


const initialState = {
  nav : RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams('Programme')),
  navTitle : 'Programme',
  reservations: [],
  event : {},
  customGames : [],
  studioEvents : [],
  user: {},
  categories : [],
  notificationInfo : true,
  notificationParties : false,
  notificationModalVisible : false,
  notification : {},
  search : ""
}

function toolbarTitle(routeName) {
  if(routeName==='Event') {
    return 'Programme';
  } else {
    return routeName;
  }
}

function dataReducer(state, action) {
  switch(action.type) {
    case NavigationActions.NAVIGATE:
      let routes = state.nav.routes;
      let newIndex = routes.findIndex((r) => r.routeName === action.routeName);
      if(newIndex!==-1) {
          let newRoutes = routes.slice(0,newIndex+1);
          return Object.assign({},state,{search:'', navTitle: toolbarTitle(action.routeName)},{nav:RootNavigator.router.getStateForAction(action,{index:newIndex, routes: newRoutes})});
      } else {
        return Object.assign({},state,{search:'', navTitle: toolbarTitle(action.routeName)},{nav:RootNavigator.router.getStateForAction(action,state.nav)});
      }
    case NavigationActions.BACK:
      let nextState = RootNavigator.router.getStateForAction(action,state.nav);
      let routeName = nextState.routes[nextState.index].routeName;
      return Object.assign({},state,{search:''},{nav:nextState,navTitle:toolbarTitle(routeName)});
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
      return Object.assign({},state,{reservations:action.reservations, loading: false});
    case 'FETCH_CUSTOM_GAMES_SUCCESS':
      return Object.assign({},state,{customGames:action.customGames , loading: false});
    case 'FETCH_EVENTS_STUDIO_SUCCESS':
      return Object.assign({},state,{studioEvents: action.studioEvents, loading: false})
    case 'LOGIN_SUCCESS':
      return Object.assign({},state,{user:action.user});
    case 'CATEGORIES_LOADED' :
      return Object.assign({}, state, {categories: action.categories});
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
