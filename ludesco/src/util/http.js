import { AsyncStorage } from 'react-native';
const moment = require('moment');

const URL = 'https://api.ludesco.ch/';
//const URL = 'http://10.0.2.2:3000/';

export function fetchJSON(url, opts) {
  return fetch(URL+url, opts)
          .then((response) => {
            if(response.status!=200)
              throw "Wrong credentials";
            return response;
          })
          .then((response) => response.json());
}

export function storeEvents(events) {
  return AsyncStorage.setItem('events',JSON.stringify(events))
}

export function storeProfile(profile) {
  AsyncStorage.setItem('profile', JSON.stringify(profile));
}

export function getProfile() {
    return AsyncStorage.getItem('profile');
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
