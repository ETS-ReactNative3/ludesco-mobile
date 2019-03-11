import React, { Component } from 'react';
import {
  DrawerLayoutAndroid,
  BackHandler,
  View,
  StatusBar,
} from 'react-native';
import { ThemeContext, getTheme } from 'react-native-material-ui';
import { Provider } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import AndroidDrawerViewContainer from './src/scenes/AndroidDrawerView';
import store from './src/state/container';
import NavigationService from './src/navigation/NavigationService';
import RootNavigator from './src/navigation/Navigator';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    store.subscribe(() => {
      const { loading } = store.getState();
      this.setState({ loading });
    });
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    NavigationService.closeDrawer();
  }

  render() {
    const { loading, navigation } = this.state;

    return (
      <Provider store={store}>
        <ThemeContext.Provider value={getTheme({})}>
          <View style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
            <Spinner visible={loading} textStyle={{ color: '#FFF' }} />
            <DrawerLayoutAndroid
              drawerPosition={DrawerLayoutAndroid.positions.Left}
              renderNavigationView={() => (
                <AndroidDrawerViewContainer
                  navigation={navigation}
                  close={() => NavigationService.closeDrawer()}
                />
              )}
              ref={drawer => NavigationService.setTopLevelDrawer(drawer)}
            >
              <RootNavigator
                ref={navigationRef => NavigationService.setTopLevelNavigator(navigationRef)}
              />
            </DrawerLayoutAndroid>
          </View>
        </ThemeContext.Provider>
      </Provider>
    );
  }
}
