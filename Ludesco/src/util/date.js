var moment = require('moment');

export function fmtDayTime(isoDate) {
  return capitalize(moment(isoDate).format('dddd [à] HH:mm'));
}

export function fmtDateTime(isoDate) {
  return moment(isoDate).format('DD.MM.YYYY HH:mm');
}

export function fmtNow() {
  return moment().format('DD.MM.YYYY HH:mm');
}

export function datetimeToISO(s) {
  return moment(s, 'DD.MM.YYYY HH:mm').toISOString();
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.substring(1);
}
