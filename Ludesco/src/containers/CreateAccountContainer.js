import { connect } from 'react-redux';
import CreateAccountScene from '../scenes/CreateAccountScene.js';
import store, { isConnected } from '../state/container.js';
import { navigateTo } from '../actions/actions.js';

const mapStateToProps = (state, ownProps) => {
  return {};
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    navigateTo(routeName) {
      dispatch(navigateTo(routeName));
    }
  }
}

const CreateAccountSceneContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccountScene)

export default CreateAccountSceneContainer
