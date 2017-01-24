import { connect } from 'react-redux';
import CustomGamesScene from '../scenes/CustomGamesScene.js';
import { loadEvent, createCustomGame, loadCustomGames, subscribeCustomGame, deleteGame } from '../actions/actions.js';
import { isConnected } from '../state/container.js';
import { datetimeToISO } from '../util/date';

let moment = require('moment');

const mapStateToProps = (state, ownProps) => {
  return {
    games : state.customGames,
    device : state.device
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createGame(game, device) {
        let realGame = Object.assign({},game,{
          device:device,
          start: datetimeToISO(game.start),
          subscriptions: {[device]:game.weare}
        });
        return dispatch(createCustomGame(realGame)).then(() => dispatch(loadCustomGames()));
    },
    subscribe(subscription) {
      return dispatch(subscribeCustomGame(subscription)).then(() => dispatch(loadCustomGames()))
    },
    deleteGame(game) {
      return dispatch(deleteGame(game)).then(() => dispatch(loadCustomGames()));
    }
  };
}

const CustomGamesSceneContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomGamesScene)

export default CustomGamesSceneContainer;
