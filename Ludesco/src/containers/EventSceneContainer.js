import { connect } from 'react-redux';
import EventScene from '../scenes/EventScene.js';
import { loadEvent } from '../actions/actions.js';
import { isConnected } from '../state/container.js';

const mapStateToProps = (state, ownProps) => {
  return {
    event : state.event,
    modalVisible: false,
    logged: state.logged,
    loginModalVisible: false,
    text : ''
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  let displayDialog = (dispatch, getState) => {
    const {logged} = getState();
    if(!logged) {
      dispatch({type:"DISPLAY_LOGIN_MODAL",loginModalVisible: true});
    } else {
      dispatch({type:"DISPLAY_MODAL",modalVisible: true});
    }
  }
  return {
    askSubscribe : function() {
        dispatch(displayDialog());
    }
  }
}

const EventSceneContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventScene)

export default EventSceneContainer;
