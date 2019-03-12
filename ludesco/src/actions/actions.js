import {
  fetchJSON,
  fetchEvents,
  storeEvents,
  storeProfile,
  getProfile,
} from '../util/http';

const base64 = require('base-64');

const idFestival = 5175;

function headers(user) {
  const { username, password } = user;
  // eslint-disable-next-line no-shadow, no-undef
  const headers = new Headers();
  const base64encoded = base64.encode(`${username}:${password}`);
  const auth = `Basic ${base64encoded}`;
  headers.append('Authorization', auth);
  headers.append('Content-Type', 'application/json');
  return headers;
}


export function loadCategories() {
  return fetchJSON('public/categories')
    .then(categories => categories.map((c) => {
      const { name, id } = c;
      return { id, name, checked: false };
    }));
}


export function loadEvents() {
  return (dispatch) => {
    dispatch({ type: 'FETCH_EVENTS_REQUEST' });
    return fetchJSON(`public/festivals/${idFestival}/events/nodescription`)
      .catch(() => {})
      .then(storeEvents)
      .then(() => fetchEvents())
      .then(events => dispatch({ type: 'FETCH_EVENTS_SUCCESS', events }));
  };
}

export function loadEvent(id) {
  return (dispatch) => {
    dispatch({ type: 'FETCH_EVENT_REQUEST' });
    return fetchJSON(`public/events/${id}`).then((event) => {
      dispatch({ type: 'FETCH_EVENT_SUCCESS', event });
    });
  };
}

export function loadReservations() {
  return (dispatch, getState) => {
    const { profile } = getState();
    dispatch({ type: 'FETCH_RESERVATIONS_REQUEST' });
    const query = `public/secured/users/${profile.user.id}/reservations/${idFestival}`;
    return fetchJSON(query, { method: 'GET', headers: headers(profile.user) }).then((reservations) => {
      dispatch({ type: 'FETCH_RESERVATIONS_SUCCESS', reservations });
      return reservations;
    }).catch(() => {});
  };
}

export function loadStudioEvents() {
  return dispatch => fetchJSON('public/studio/next-events').then((events) => {
    dispatch({ type: 'FETCH_EVENTS_STUDIO_SUCCESS', studioEvents: events });
  });
}

export function subscribeEvent(subscription) {
  const { event_id, user_id } = subscription;
  const json = JSON.stringify(subscription);
  return (dispatch, getState) => {
    const { user } = getState().profile;
    const query = `public/secured/users/${user_id}/events/${event_id}/subscribe`;
    return fetchJSON(query, {
      method: 'POST',
      body: json,
      headers: headers(user),
    });
  };
}

export function unsubscribeEvent(subscription) {
  const { event_id, user_id } = subscription;
  const json = JSON.stringify(subscription);
  return (dispatch, getState) => {
    const { user } = getState().profile;
    return fetchJSON(`public/secured/users/${user_id}/events/${event_id}/unsubscribe`, {
      method: 'POST',
      body: json,
      headers: headers(user),
    });
  };
}

export function bootstrap() {
  return (dispatch, getState) => {
    loadCategories(dispatch)
      .then(usedCategories => dispatch({ type: 'CATEGORIES_LOADED', categories: usedCategories }))
      .then(() => getProfile()
        .then(profile => dispatch({ type: 'BOOTSTRAP', profile: JSON.parse(profile) })))
      .then(() => {
        const { user } = getState().profile;
        if (user) {
          dispatch(loadReservations());
        }
      });
  };
}

export function logout() {
  return (dispatch, getState) => {
    dispatch({ type: 'LOGOUT' });
    storeProfile(getState().profile);
  };
}

export function login(maybeUser) {
  return (dispatch, getState) => fetchJSON('public/secured/login', {
    method: 'POST',
    headers: headers(maybeUser),
    body: JSON.stringify(maybeUser),
  })
    .then((user) => {
      const u = Object.assign({}, maybeUser, user);
      return dispatch({ type: 'LOGIN_SUCCESS', user: u });
    })
    .then(() => storeProfile(getState().profile))
    .then(() => true)
    .catch(() => {
      // eslint-disable-next-line no-alert, no-undef
      alert('Login ou mot de passe invalide');
      return false;
    });
}
