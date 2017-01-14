import React, { Component } from 'react';
import {
  AppRegistry,
  DrawerLayoutAndroid,
  BackAndroid,
  Text
} from 'react-native';
import { Toolbar, Subheader, Avatar, Drawer, Divider, COLOR, TYPO } from 'react-native-material-design';
import { Provider } from 'react-redux';
import AndroidDrawerViewContainer from './src/scenes/AndroidDrawerView.js';
import NotificationModal from './src/notifications/NotificationModal';
import Main from './src/scenes/Main.js';
import store from './src/state/container.js'
import LudescoNavigator from './src/navigation/LudescoNavigator.js';

class Ludesco extends Component {
  constructor(props) {
    super(props);
    this.state = {drawer: null, navigation: null};
  }
  setDrawer(drawer) {
    this.setState({drawer});
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
    const toolbar = <Toolbar title="Ludesco" onIconPress={() => this.openDrawer()}
            icon='menu'
            rightIconStyle={{
                margin: 10
            }}
            actions={
              [{
                icon: 'refresh',
                onPress: () => LudescoNavigator.refresh()
              }]
            }  />;
    return <Provider store={store}>
              <DrawerLayoutAndroid
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() =>
                  <AndroidDrawerViewContainer
                    ref={(navigation) => !this.state.navigation ? this.setNavigation(navigation) : null}
                    close={() => this.closeDrawer()} />
                }
                ref={(drawer) => {!this.state.drawer ? this.setDrawer(drawer) : null}}>
                <NotificationModal />
                <Main toolbar={toolbar} />
              </DrawerLayoutAndroid>
            </Provider>;
  }
}

BackAndroid.addEventListener('hardwareBackPress', () => {
  return LudescoNavigator.pop();
});

AppRegistry.registerComponent('Ludesco', () => Ludesco);
