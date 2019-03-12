import { AsyncStorage } from 'react-native';

const URL = 'https://api.ludesco.ch/';
// const URL = 'http://10.0.2.2:3000/';

export function fetchJSON(url, opts) {
  // eslint-disable-next-line no-undef
  return fetch(URL + url, opts)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Wrong credentials');
      }
      return response;
    })
    .then(response => response.json());
}

export function storeEvents(events) {
  return AsyncStorage.setItem('events', JSON.stringify(events));
}

export function storeProfile(profile) {
  AsyncStorage.setItem('profile', JSON.stringify(profile));
}

export function getProfile() {
  return AsyncStorage.getItem('profile');
}

export function fetchEvents() {
  return AsyncStorage.getItem('events').then(events => JSON.parse(events));
}

export function fetchEvent(id) {
  return fetchEvents().then(events => events.find(e => e.id === id));
}
