import React, { Component } from 'react';
import {
  AppRegistry,
  DrawerLayoutAndroid,
  BackAndroid,
  Text
} from 'react-native';
import { Toolbar, Subheader, Avatar, Drawer, Divider, COLOR, TYPO } from 'react-native-material-design';
import { Provider } from 'react-redux';
import AndroidDrawerView from './src/scenes/AndroidDrawerView.js';
import Main from './src/scenes/Main.js';
import store from './src/state/container.js'

var navigator;

function getNavigator() {
  return navigator;
}

class Ludesco extends Component {
  constructor(props) {
    super(props);
    this.state = {drawer: null, navigator: null, navgation: null};
  }
  setDrawer(drawer) {
    this.setState({drawer});
  }
  setNavigator(navi) {
    navigator = navi;
  }
  setNavigation(navigation) {
    this.setState({navigation});
  }
  openDrawer() {
    this.state.drawer.openDrawer();
  }
  closeDrawer() {
    this.state.drawer.closeDrawer();
  }
  render() {
    const {navigation, drawer} = this.state;
    const toolbar = <Toolbar navigator={navigator} title="Ludesco" onIconPress={() => this.openDrawer()}
            icon='menu'
            rightIconStyle={{
                margin: 10
            }}  />;
    return <Provider store={store}>
              <DrawerLayoutAndroid
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() =>
                  <AndroidDrawerView ref={(navigation) => !this.state.navigation ? this.setNavigation(navigation) : null}
                    close={() => this.closeDrawer()}
                    navigator={navigator} />}
                ref={(drawer) => {!this.state.drawer ? this.setDrawer(drawer) : null}}>
                <Main
                  toolbar={toolbar}
                  getNavigator={getNavigator}
                  setNavigator={(navi) => {!navigator ? this.setNavigator(navi) : null}}/>
              </DrawerLayoutAndroid>
            </Provider>;
  }
}

BackAndroid.addEventListener('hardwareBackPress', () => {
  navigator.pop();
  if(navigator.getCurrentRoutes().length===1) {
    return false;
  }
  return true;
});

AppRegistry.registerComponent('Ludesco', () => Ludesco);
