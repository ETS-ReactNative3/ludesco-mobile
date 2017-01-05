import { fetchJSON, fetchEvents, storeEvents, fetchEventsByDay } from '../util/http';

const base64 = require('base-64');

var idFestival = 3167;

const defaultHeaders = new Headers({'Content-Type':'application/json'});
const uniqueId = require('react-native-unique-id')

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

export function createCustomGame(game) {
  return (dispatch) => {
    return fetchJSON("public/games", {
      method: 'POST',
      body : JSON.stringify(game),
      headers : defaultHeaders
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
    })
    .catch(() => {
      alert('Utilisateur/Mot de passe invalide');
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

function headers(user) {
  const {username,password} = user;
  let headers = new Headers();
  let auth = "Basic " + base64.encode(`${username}:${password}`);
  headers.append('Authorization', auth)
  headers.append('Content-Type', 'application/json')
  return headers;
}
