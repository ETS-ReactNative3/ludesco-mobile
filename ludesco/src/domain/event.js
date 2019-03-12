// eslint-disable-next-line import/prefer-default-export
export function hasReservationsFor(event, reservations) {
  return reservations.some(r => r.event_id === event.id);
}
