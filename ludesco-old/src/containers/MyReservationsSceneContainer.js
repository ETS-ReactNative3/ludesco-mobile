import { connect } from 'react-redux';
import MyReservationsScene from '../scenes/MyReservationsScene';
import { loadReservations, login, loadEvent, navigateTo } from '../actions/actions';
import { isConnected } from '../state/container.js';

var moment = require('moment');

const mapStateToProps = (state, ownProps) => {
  let sortReservation = (a,b) => moment(a.event_start_date).utc()-moment(b.event_start_date).utc();
  const orderedReservations = state.reservations.sort(sortReservation);
  return {
    reservations: orderedReservations,
    isConnected : isConnected(),
    user : state.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doConnect(user) {
        return dispatch(login(user)).then(() => dispatch(loadReservations()));
    },
    onReservationPress(reservation) {
      return dispatch(loadEvent(reservation.event_id)).then(() => {
        LudescoNavigator.navigateTo({title:'event', id:reservation.event_id});
      });
    },
    navigateTo(routeName, eventId) {
      dispatch(navigateTo(routeName, {eventId}))
    }
  }
}

const MyReservationsSceneContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyReservationsScene)

export default MyReservationsSceneContainer
