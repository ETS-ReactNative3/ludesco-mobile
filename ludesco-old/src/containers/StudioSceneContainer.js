import { connect } from 'react-redux';
import { loadStudioEvents } from '../actions/actions';
import StudioScene from '../scenes/StudioScene.js';


const mapStateToProps = (state, ownProps) => {
  return {
    events : state.studioEvents
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    beforeDisplay() {
      dispatch(loadStudioEvents())
    }
  }
}

const StudioSceneContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StudioScene)

export default StudioSceneContainer
