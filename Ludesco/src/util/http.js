import { AsyncStorage } from 'react-native';
const moment = require('moment');

//const URL = 'http://46.101.214.30:3000/';
const URL = 'http://10.0.2.2:3000/';

export function fetchJSON(url, opts) {
  return fetch(URL+url, opts)
          .then((resp) => {
              if(resp.status!==200) {
                  console.warn(JSON.stringify(resp));
              }
              return resp;
          }).then((response) => response.json());
}

export function storeEvents(events) {
  return AsyncStorage.setItem('events',JSON.stringify(events))
}

export function fetchEventsByDay(day) {
  return fetchEvents()
          .then((events) =>
              events.filter((e) => moment(e.event_start_date).day() === day));
}

export function fetchEvent(id) {
  return fetchEvents().then((events) => events.find((e) => e.id === id));
}

export function fetchEvents() {
  return AsyncStorage.getItem('events').then((events) => JSON.parse(events));
}

export function storePlaces(places) {
  return AsyncStorage.setItem('places',JSON.stringify(places))
}

export function fetchPlaces(places) {
  return AsyncStorage.getItem('places').then((places) => JSON.parse(places));
}
