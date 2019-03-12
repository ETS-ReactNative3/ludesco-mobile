import { connect } from 'react-redux';
import MyReservationsScene from '../scenes/MyReservationsScene';
import { loadReservations, login, loadEvent } from '../actions/actions';
import { isConnected } from '../state/container';

const moment = require('moment');

const mapStateToProps = (state) => {
  const eventDateUtc = event => moment(event.event_start_date).utc();
  const sortReservation = (a, b) => eventDateUtc(a) - eventDateUtc(b);

  const orderedReservations = state.profile.reservations.sort(sortReservation);

  return {
    reservations: orderedReservations,
    isConnected: isConnected(),
    user: state.profile.user,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  doConnect(user) {
    return dispatch(login(user))
      .then((r) => {
        if (r) {
          dispatch(loadReservations());
        }
        return r;
      });
  },
  onReservationPress(reservation) {
    return dispatch(loadEvent(reservation.event_id)).then(() => {
      this.ownProps.navigation.navigate({ title: 'Event', id: reservation.event_id });
    });
  },
  navigate(routeName, eventId) {
    dispatch(loadEvent(eventId)).then(() => {
      ownProps.navigation.navigate(routeName, { eventId });
    });
  },
});

const MyReservationsSceneContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyReservationsScene);

export default MyReservationsSceneContainer;
