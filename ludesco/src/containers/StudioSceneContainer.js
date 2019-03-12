import { connect } from 'react-redux';
import { loadStudioEvents } from '../actions/actions';
import StudioScene from '../scenes/StudioScene';


const mapStateToProps = state => ({
  events: state.studioEvents,
});

const mapDispatchToProps = dispatch => ({
  beforeDisplay() {
    dispatch(loadStudioEvents());
  },
});

const StudioSceneContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StudioScene);

export default StudioSceneContainer;
