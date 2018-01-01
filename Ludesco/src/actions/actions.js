import { fetchJSON, fetchEvents, storeEvents, fetchEventsByDay } from '../util/http';
import { NavigationActions } from 'react-navigation';

const base64 = require('base-64');

var idFestival = 3167;

const defaultHeaders = new Headers({'Content-Type':'application/json'});
const uniqueId = require('react-native-unique-id')

export function navigateTo(routeName, params = {}) {
  return (dispatch) => {
    const action = NavigationActions.navigate({
      routeName: routeName,
      params,
      navTitle : routeName
    })
    return dispatch(action);
  }
}

export function loadEvents(day, categories = []) {
  return (dispatch) => {
    dispatch({type: 'FETCH_EVENTS_REQUEST'});
    return fetchJSON(`public/festivals/${idFestival}/events`)
        .catch((e) => {})
        .then(storeEvents)
        .then(() => {
          return fetchEvents();
        })
        .then((events) => dispatch({type: 'FETCH_EVENTS_SUCCESS',events: events}));
  }
}

export function loadEvent(id) {
  return (dispatch) => {
    dispatch({type: 'FETCH_EVENT_REQUEST'});
    return fetchJSON(`public/events/${id}`).then((event) => {
      dispatch({type:'FETCH_EVENT_SUCCESS', event: event});
    });
  }
}

export function loadReservations() {
  return (dispatch, getState) => {
    const {user} = getState();
    dispatch({type: 'FETCH_RESERVATIONS_REQUEST'});
    return fetchJSON(`public/secured/users/${user.id}/reservations/${idFestival}`,{method:'GET',headers:headers(user)}).then((reservations) => {
      dispatch({type:'FETCH_RESERVATIONS_SUCCESS', reservations: reservations});
      return reservations;
    }).catch((e) => {
      console.error(e);
    });
  }
}

export function loadCustomGames() {
  return (dispatch) => {
    return fetchJSON('public/games').then((games) => {
      dispatch({type:'FETCH_CUSTOM_GAMES_SUCCESS', customGames : games});
    });
  }
}

export function loadStudioEvents() {
  return (dispatch) => {
    return fetchJSON('public/studio/events').then((events) => {
      dispatch({type: 'FETCH_EVENTS_STUDIO_SUCCESS', studioEvents : events})
    });
  }
}

export function createCustomGame(game) {
  return (dispatch) => {
    return fetchJSON("public/games", {
      method: 'POST',
      body : JSON.stringify(game),
      headers : defaultHeaders
    }).catch(() => {
      alert('Indisponible avant le début du festival');
    });
  }
}

export function subscribeCustomGame(subscription) {
  const {game_id} = subscription;
  var json = JSON.stringify(subscription);
  return (dispatch) => {
    return fetchJSON(`public/games/${game_id}/subscribe`, {
      method: 'POST',
      body : json,
      headers : defaultHeaders
    });
  }
}

export function subscribeEvent(subscription) {
  const {event_id, user_id} = subscription;
  var json = JSON.stringify(subscription);
  return (dispatch, getState) => {
    const {user} = getState();
    return fetchJSON(`public/secured/users/${user_id}/events/${event_id}/subscribe`, {
      method : 'POST',
      body : json,
      headers : headers(user)
    });
  }
}

export function unsubscribeEvent(subscription) {
  console.warn('unsubscribeEvent')
  const {event_id, user_id} = subscription;
  var json = JSON.stringify(subscription);
  return (dispatch, getState) => {
    const {user} = getState();
    return fetchJSON(`public/secured/users/${user_id}/events/${event_id}/unsubscribe`, {
      method : 'POST',
      body : json,
      headers : headers(user)
    });
  }
}

export function deleteGame(gameDeletion) {
  var json = JSON.stringify(gameDeletion);
  return (dispatch) => {
    return fetchJSON(`public/games/${gameDeletion.id}`, {
      method : 'DELETE',
      body : json,
      headers : defaultHeaders
    })
  }
}

export function login(maybeUser) {
  return (dispatch) => {
    return fetchJSON('public/secured/login', {
      method: 'POST',
      headers: headers(maybeUser),
      body : JSON.stringify(maybeUser)})
    .then((user) => {
        const u = Object.assign({},maybeUser,user);
        return dispatch({type:'LOGIN_SUCCESS',user: u});
    }).catch(() => {
      alert('Login ou mot de passe invalide');
      throw "Wrong credentials";
    });
  }
}

export function loadDevice() {
  return (dispatch) => {
    return uniqueId().then((device) => {
      return dispatch({type:'DEVICE_LOADED',device:device});
    });
  }
}

export function loadCategories() {
  return (dispatch) => {
    return fetchJSON('public/categories').then((categories) => {
        let usedCategories = categories.filter((c) => !c.name.includes('OLD') && !c.name.includes('2016')).map((c) => [c.name, false]);
        return dispatch({type:'CATEGORIES_LOADED',categories:usedCategories});
    });
  }
}

export function toggleNotificationsInfo() {
  return (dispatch, getState) => {
    const {notificationInfo} = getState();
    return dispatch({type:'TOGGLE_NOTIFICATIONS_INFO',value:!notificationInfo})
  }
}

export function toggleNotificationsParties() {
  return (dispatch, getState) => {
    const {notificationParties} = getState();
    return dispatch({type:'TOGGLE_NOTIFICATIONS_PARTIES',value:!notificationParties})
  }
}

export function notificationReceived(notification) {
  return (dispatch, getState) => {
    return dispatch({type:'NOTIFICATION_RECEIVED',notification});
  }
}

export function ackwnoledgeNotification(notification) {
  return (dispatch, getState) => {
    return dispatch({type:'NOTIFICATION_ACKNOWLEDGE'});
  }
}

function headers(user) {
  const {username,password} = user;
  let headers = new Headers();
  let auth = "Basic " + base64.encode(`${username}:${password}`);
  headers.append('Authorization', auth)
  headers.append('Content-Type', 'application/json')
  return headers;
}
