import { fetchJSON, fetchEvents, storeEvents, fetchEventsByDay, storeProfile, getProfile } from '../util/http';
import { NavigationActions } from 'react-navigation';

const base64 = require('base-64');

var idFestival = 5175;

const defaultHeaders = new Headers({'Content-Type':'application/json'});
const uniqueId = require('react-native-unique-id')


export function loadEvents(day, categories = []) {
  return (dispatch) => {
    dispatch({type: 'FETCH_EVENTS_REQUEST'});
    return fetchJSON(`public/festivals/${idFestival}/events/nodescription`)
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
    const {profile} = getState();
    dispatch({type: 'FETCH_RESERVATIONS_REQUEST'});
    const query = `public/secured/users/${profile.user.id}/reservations/${idFestival}`;
    return fetchJSON(query,{method:'GET',headers:headers(profile.user)}).then((reservations) => {
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
    return fetchJSON('public/studio/next-events').then((events) => {
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
    const user = getState().profile.user;
    const query = `public/secured/users/${user_id}/events/${event_id}/subscribe`;
    console.warn(query);
    return fetchJSON(query, {
      method : 'POST',
      body : json,
      headers : headers(user)
    });
  }
}

export function unsubscribeEvent(subscription) {
  const {event_id, user_id} = subscription;
  var json = JSON.stringify(subscription);
  return (dispatch, getState) => {
    const {user} = getState().profile;
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

export function bootstrap() {
  return (dispatch, getState) => {
    loadCategories(dispatch).then((usedCategories) => {
      return dispatch({type:'CATEGORIES_LOADED',categories:usedCategories});
    })
    .then(() => {
      return getProfile().then((profile) => {
          return dispatch({type: 'BOOTSTRAP', profile: JSON.parse(profile)})
      });
    })
    .then(() => {
      const user = getState().profile.user;
      if(user) {
        return dispatch(loadReservations());
      }
    })
  };
}

export function logout() {
  return (dispatch, getState) => {
    dispatch({type: 'LOGOUT'});
    storeProfile(getState().profile);
  };
}

export function login(maybeUser) {
  return (dispatch, getState) => {
    return fetchJSON('public/secured/login', {
      method: 'POST',
      headers: headers(maybeUser),
      body : JSON.stringify(maybeUser)})
    .then((user) => {
        const u = Object.assign({},maybeUser,user);
        return dispatch({type:'LOGIN_SUCCESS',user: u});
    })
    .then(() => storeProfile(getState().profile))
    .then(() => true)
    .catch(() => {
      alert('Login ou mot de passe invalide');
      return false;
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
    return fetchJSON('public/categories').then((categories) => {
        return categories.map(c => {
          const {name, id} = c;
          return {id : id, name : name, checked: false};
        });
  });
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
