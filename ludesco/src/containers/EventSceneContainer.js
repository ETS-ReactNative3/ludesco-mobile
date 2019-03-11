import { connect } from 'react-redux';
import EventScene from '../scenes/EventScene.js';
import { loadEvent, login, loadReservations, subscribeEvent, unsubscribeEvent  } from '../actions/actions.js';
import store, { isConnected } from '../state/container.js';
import { hasReservationsFor } from '../domain/event';

const mapStateToProps = (state, ownProps) => {
  return {
    event : state.event,
    isConnected : isConnected(),
    user : state.profile.user,
    hasReservation : hasReservationsFor(state.event, state.profile.reservations)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doConnect(event, user) {
      return dispatch(login(user))
        .then((result) => {
            if(result) {
            dispatch(loadReservations())
            .then(() => {
              const {profile} = store.getState();
              if(!hasReservationsFor(event, profile.reservations)) {
                return dispatch(subscribeEvent({user_id: profile.user.id, event_id: event.id}));
              }
            })
            .then(() => dispatch(loadReservations()))
            .then(() => dispatch(loadEvent(event.id)))
            .then(() => true)
            .catch(() => false)
          }
        });
    },
    subscribe : function(subscription) {
      return dispatch(subscribeEvent(subscription))
        .then((reservations) => dispatch(loadReservations()))
        .then(() => dispatch(loadEvent(subscription.event_id)));
    },
    unsubscribe : function(unsubscription) {
      return dispatch(unsubscribeEvent(unsubscription))
        .then((reservations) => dispatch(loadReservations()))
        .then(() => dispatch(loadEvent(unsubscription.event_id)));
    }
  }
}

const EventSceneContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventScene)

export default EventSceneContainer;
