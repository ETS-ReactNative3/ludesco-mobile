import React, { Component } from 'react';
import {
  AppRegistry,
  DrawerLayoutAndroid,
  BackAndroid,
  BackHandler,
  Text,
  Button,
  View,
  StyleSheet,
  StatusBar
} from 'react-native';
import { Toolbar, Subheader, Avatar, Drawer, Divider, COLOR, TYPO, ThemeProvider, ThemeContext, getTheme } from 'react-native-material-ui';
import { Provider } from 'react-redux';
import AndroidDrawerViewContainer from './src/scenes/AndroidDrawerView.js';
import store from './src/state/container.js'
import { LocaleConfig } from 'react-native-calendars';
import { connect } from 'react-redux';
import { back, bootstrap } from './src/actions/actions.js';
import { getProfile, loadCategories, loadDevice } from './src/util/http.js';
import Spinner from 'react-native-loading-spinner-overlay';
import NavigationService from './src/navigation/NavigationService.js';
import RootNavigator from './src/navigation/Navigator.js';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  weekStart:2,
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
};

LocaleConfig.defaultLocale = 'fr';

store.dispatch(bootstrap());

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {drawer: null, loading : false};
    store.subscribe(() => {
      let loading = store.getState().loading;
      this.setState({loading});
    });
  }
  setDrawer(drawer) {
    this.setState({drawer});
  }
  closeDrawer() {
    NavigationService.closeDrawer();
  }
  onBackPress = () => {
    this.closeDrawer();
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }
  render() {
    return <Provider store={store}>
              <ThemeContext.Provider value={getTheme({})}>
                <View style={{flex: 1, marginTop: StatusBar.currentHeight}}>

                  <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}} />
                  <DrawerLayoutAndroid
                    drawerPosition={DrawerLayoutAndroid.positions.Left}
                    renderNavigationView={() =>
                      <AndroidDrawerViewContainer
                        navigation={this.state.navigation}
                        close={() => this.closeDrawer()} />
                    }
                    ref={drawer => NavigationService.setTopLevelDrawer(drawer)}>
                      <RootNavigator ref={navigation => NavigationService.setTopLevelNavigator(navigation)} />
                    </DrawerLayoutAndroid>
                  </View>
                </ThemeContext.Provider>
           </Provider>
  }
}
