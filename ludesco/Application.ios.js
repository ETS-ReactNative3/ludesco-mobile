import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import { ThemeContext, getTheme } from 'react-native-material-ui';
import { Provider } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { Font } from 'expo';
import Drawer from 'react-native-drawer';
import AndroidDrawerViewContainer from './src/scenes/AndroidDrawerView';
import NavigationService from './src/navigation/NavigationService';
import RootNavigator from './src/navigation/Navigator';
import store from './src/state/container';

export default class Ludesco extends Component {
  state = {
    loading: false,
    drawerOpen: false,
    fontLoaded: false,
  }

  constructor(props) {
    super(props);
    store.subscribe(() => {
      const { loading } = store.getState();
      this.setState({ loading });
    });
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('./assets/fonts/Roboto-Bold.ttf'),
    });
    this.setState({ fontLoaded: true });
  }

  openDrawer() {
    this.setState({ drawerOpen: true });
  }

  closeDrawer() {
    this.setState({ drawerOpen: false });
  }

  render() {
    const { drawerOpen, loading, fontLoaded } = this.state;

    if (!fontLoaded) {
      return <View />;
    }

    // ref={ref => {this._drawer = ref}}>

    return (
      <Provider store={store}>
        <ThemeContext.Provider value={getTheme({})}>
          <Drawer
            openDrawerOffset={0.2}
            open={drawerOpen}
            onClose={() => this.closeDrawer()}
            content={<AndroidDrawerViewContainer close={() => this.closeDrawer()} />}
          >
            <View style={{ flex: 1, marginTop: 40 }}>
              <Spinner visible={loading} textStyle={{ color: '#FFF' }} />
              <RootNavigator
                ref={navigationRef => NavigationService.setTopLevelNavigator(navigationRef)}
              />
            </View>
          </Drawer>
        </ThemeContext.Provider>
      </Provider>
    );
  }
}
