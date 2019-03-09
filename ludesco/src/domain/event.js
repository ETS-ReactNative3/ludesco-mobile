export function hasReservationsFor(event, reservations) {
  return reservations.some((r) => r.event_id == event.id);
}
