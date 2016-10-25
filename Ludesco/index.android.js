/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  TouchableHighlight,
  AsyncStorage,
  DrawerLayoutAndroid,
  Navigator,
  BackAndroid,
  Modal,
  TextInput,
  Button
} from 'react-native';
import { Toolbar, Subheader, } from 'react-native-material-design';
import { Avatar, Drawer, Divider, COLOR, TYPO } from 'react-native-material-design';
import Navigation from './src/scenes/navigation.js';
import ProgrammeScene from './src/scenes/programme.js';
import EventScene from './src/scenes/event.js';
import MyReservationsScene from './src/scenes/myreservations.js';
import CustomGamesScene from './src/scenes/customGames.js';
import FCM from 'react-native-fcm';

var navigator;

BackAndroid.addEventListener('hardwareBackPress', () => {
  navigator.pop();
  if(navigator.getCurrentRoutes().length===1) {
    return false;
  }
  return true;
});

class Ludesco extends Component {
  componentDidMount() {
    FCM.requestPermissions(); // for iOS
    this.notificationUnsubscribe = FCM.on('notification', (notif) => {
      this.setState({notification: notif, modalVisible: true})
    });
    FCM.subscribeToTopic('/topics/notification');
  }
  constructor(props) {
    super(props);
    this.state = {drawer: null, navigator: null, modalVisible: false, notification: {}};
  }
  onIconPressA() {
    //const { drawer } = this.state;
    this.state.drawer.openDrawer();
  }
  setDrawer(drawer) {
      this.setState({drawer});
  }
  setNavigator(navi) {
    navigator = navi;
  }
  setNavigation(navigation) {
    this.navigation = navigation;
  }
  render() {
    const {title, message} = this.state.notification;
    return (

        <DrawerLayoutAndroid
                              drawerPosition={DrawerLayoutAndroid.positions.Left}
                              renderNavigationView={() => <Navigation ref={(navigation) => this.state.navigation ? this.setNavigation(navigation) : null} navigator={navigator} drawer={this.state.drawer} />}
                              ref={(drawer) => {!this.state.drawer ? this.setDrawer(drawer) : null}}>
          <Modal animationType={"fade"} transparent={false} visible={this.state.modalVisible} onRequestClose={() => this.setState({modalVisible: false})}>
            <View style={{height:100, flex:1, alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
              <View>
                <Text>{title}</Text>
              <View>
              </View>
                <Text>{message}</Text>
              </View>
            </View>
          </Modal>
          <Navigator
            initialRoute={{title: 'Programme', index:0}}
            renderScene={(route, navigator) => {
              if(route.title==='event') {
                return (<EventScene id={route.id} navigator={navigator} />)
              } else if(route.title=='myreservations') {
                return (<MyReservationsScene navigator={navigator} />)
              } else if(route.title=='customGames') {
                return (<CustomGamesScene navigator={navigator} />)
              } else {
                return (<ProgrammeScene navigator={navigator} day={route.day} categories={route.categories} navigation={this.navigation} />)
              }
            }}
            configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottom}
            ref={(navigator) => { !this.state.navigator ? this.setNavigator(navigator) : null }}
            navigationBar={<Toolbar navigator={this.state.navigator} title="Ludesco" onIconPress={() => this.onIconPressA()}
                    actions={[{
                        icon: 'warning',
                        badge: { value: 1, animate: true }
                    }]}
                    icon='menu'
                    rightIconStyle={{
                        margin: 10
                    }}  />}
            />
      </DrawerLayoutAndroid>
    );
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

AppRegistry.registerComponent('Ludesco', () => Ludesco);
