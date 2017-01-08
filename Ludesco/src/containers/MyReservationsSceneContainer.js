import { connect } from 'react-redux';
import MyReservationsScene from '../scenes/MyReservationsScene';
import { loadReservations, login, loadEvent } from '../actions/actions';
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
  const { navigator } = ownProps;
  return {
    doConnect(user) {
        return dispatch(login(user)).then(() => dispatch(loadReservations()));
    },
    onReservationPress(reservation) {
      return dispatch(loadEvent(reservation.event_id)).then(() => {
        navigator.push({title:'event', id:reservation.event_id});
      });
    },
    close() {
      navigator.pop();
    }
  }
}

const MyReservationsSceneContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyReservationsScene)

export default MyReservationsSceneContainer
