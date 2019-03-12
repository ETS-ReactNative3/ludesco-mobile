import { connect } from 'react-redux';
import EventScene from '../scenes/EventScene';
import {
  loadEvent,
  login,
  loadReservations,
  subscribeEvent,
  unsubscribeEvent,
} from '../actions/actions';
import store, { isConnected } from '../state/container';
import { hasReservationsFor } from '../domain/event';

const mapStateToProps = state => ({
  event: state.event,
  isConnected: isConnected(),
  user: state.profile.user,
  hasReservation: hasReservationsFor(state.event, state.profile.reservations),
});

const mapDispatchToProps = dispatch => ({
  doConnect(event, user) {
    return dispatch(login(user))
      .then((result) => {
        if (result) {
          dispatch(loadReservations())
            .then(() => {
              const { profile } = store.getState();
              if (!hasReservationsFor(event, profile.reservations)) {
                return dispatch(subscribeEvent({ user_id: profile.user.id, event_id: event.id }));
              }
              return null;
            })
            .then(() => dispatch(loadReservations()))
            .then(() => dispatch(loadEvent(event.id)))
            .then(() => true)
            .catch(() => false);
        }
      });
  },
  subscribe(subscription) {
    return dispatch(subscribeEvent(subscription))
      .then(() => dispatch(loadReservations()))
      .then(() => dispatch(loadEvent(subscription.event_id)));
  },
  unsubscribe(unsubscription) {
    return dispatch(unsubscribeEvent(unsubscription))
      .then(() => dispatch(loadReservations()))
      .then(() => dispatch(loadEvent(unsubscription.event_id)));
  },
});

const EventSceneContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EventScene);

export default EventSceneContainer;
