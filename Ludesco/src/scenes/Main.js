import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  TouchableHighlight,
  AsyncStorage,
  DrawerLayoutAndroid,
  Navigator,
  Modal,
  TextInput,
  Button
} from 'react-native';
import FCM from 'react-native-fcm';
import watch from 'redux-watch'
import ProgrammeSceneContainer from '../containers/ProgrammeSceneContainer.js';
import EventSceneContainer from '../containers/EventSceneContainer.js';
import MyReservationsSceneContainer from '../containers/MyReservationsSceneContainer.js';
import CustomGamesSceneContainer from '../containers/CustomGamesSceneContainer.js';
import store from '../state/container';
import LudescoNavigator from '../navigation/LudescoNavigator.js';
import Notifier from '../notifications/Notifier.js';

export default class Main extends Component {
  static propTypes = {
    toolbar : React.PropTypes.element.isRequired
  }
  constructor(props) {
    super(props);
    Notifier.init();
  }
  render() {
    const {toolbar} = this.props;
    return <Navigator
              initialRoute={{title: 'programme', index:0}}
              renderScene={(route) => {
                if(route.title==='event') {
                  return (<EventSceneContainer id={route.id} />)
                } else if(route.title=='myreservations') {
                  return (<MyReservationsSceneContainer />)
                } else if(route.title=='customGames') {
                  return (<CustomGamesSceneContainer />)
                } else {
                  return (<ProgrammeSceneContainer />)
                }
              }}
              ref={(navigator) => LudescoNavigator.setNavigator(navigator)}
              configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottom}
              navigationBar={toolbar}
            />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
