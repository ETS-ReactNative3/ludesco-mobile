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
  Modal,
  TextInput,
  Button
} from 'react-native';
import FCM from 'react-native-fcm';
import { StackNavigator } from 'react-navigation';
import watch from 'redux-watch'
import { COLOR, ThemeProvider } from 'react-native-material-ui';
import ProgrammeSceneContainer from '../containers/ProgrammeSceneContainer.js';
import EventSceneContainer from '../containers/EventSceneContainer.js';
import MyReservationsSceneContainer from '../containers/MyReservationsSceneContainer.js';
import StudioSceneContainer from '../containers/StudioSceneContainer.js';
import store from '../state/container';
import Notifier from '../notifications/Notifier.js';
import { addNavigationHelpers } from 'react-navigation';

export default class Main extends Component {
  constructor(props) {
    super(props);
    Notifier.init();
  }
  render() {
    const {toolbar} = this.props;
    const RootNavigator = StackNavigator({
      Studio : {
        screen: StudioSceneContainer,
        navigationOptions : {
          header: this.props.toolbar
        }
      },
      Agenda : {
        screen: MyReservationsSceneContainer,
        navigationOptions : {
          header: this.props.toolbar
      },
      Programme : {
        screen: ProgrammeSceneContainer,
        navigationOptions : {
          header: this.props.toolbar
        }
      }
      },
    });

    return (<View style={{flex:1}}>
      <RootNavigator toolbar={toolbar}></RootNavigator></View>);
  }
}
