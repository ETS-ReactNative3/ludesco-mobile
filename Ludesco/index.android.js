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
import { Toolbar, Subheader, Avatar, Drawer, Divider, COLOR, TYPO } from 'react-native-material-design';
import { Provider } from 'react-redux';
import Navigation from './src/scenes/Navigation.js';
import ProgrammeSceneContainer from './src/containers/ProgrammeSceneContainer.js';
import EventSceneContainer from './src/containers/EventSceneContainer.js';
import MyReservationsSceneContainer from './src/containers/MyReservationsSceneContainer.js';
import CustomGamesSceneContainer from './src/containers/CustomGamesSceneContainer.js';
import FCM from 'react-native-fcm';
import store from './src/state/container.js'

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
    FCM.subscribeToTopic('/topics/games');
  }
  constructor(props) {
    super(props);
    this.state = {drawer: null, navigator: null, modalVisible: false, notification: {}};
  }
  onIconPressA() {
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
    return (<Provider store={store}>
              <DrawerLayoutAndroid
                                    drawerPosition={DrawerLayoutAndroid.positions.Left}
                                    renderNavigationView={() => <Navigation ref={(navigation) => this.state.navigation ? this.setNavigation(navigation) : null} navigator={navigator} drawer={this.state.drawer} />}
                                    ref={(drawer) => {!this.state.drawer ? this.setDrawer(drawer) : null}}>
                <Modal animationType={"fade"} transparent={true} visible={this.state.modalVisible} onRequestClose={() => this.setState({modalVisible: false})}>
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
                      return (<EventSceneContainer id={route.id} navigator={navigator} />)
                    } else if(route.title=='myreservations') {
                      return (<MyReservationsSceneContainer navigator={navigator} />)
                    } else if(route.title=='customGames') {
                      return (<CustomGamesSceneContainer navigator={navigator} />)
                    } else {
                      return (<ProgrammeSceneContainer navigator={navigator} />)
                    }
                  }}
                  configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottom}
                  ref={(navigator) => { !this.state.navigator ? this.setNavigator(navigator) : null }}
                  navigationBar={<Toolbar navigator={this.state.navigator} title="Ludesco" onIconPress={() => this.onIconPressA()}
                          icon='menu'
                          rightIconStyle={{
                              margin: 10
                          }}  />}
                  />
            </DrawerLayoutAndroid>
            </Provider>
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
