import React, { Component } from 'react';
import {
  AppRegistry,
  DrawerLayoutAndroid,
  BackAndroid,
  BackHandler,
  Text,
  Button,
  View,
  StyleSheet
} from 'react-native';
import { Toolbar, Subheader, Avatar, Drawer, Divider, COLOR, TYPO, ThemeProvider } from 'react-native-material-ui';
import { Provider } from 'react-redux';
import AndroidDrawerViewContainer from './src/scenes/AndroidDrawerView.js';
import NotificationModal from './src/notifications/NotificationModal';
import Main from './src/scenes/Main.js';
import store, { RootNavigator } from './src/state/container.js'
import { LocaleConfig } from 'react-native-calendars';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { back } from './src/actions/actions.js';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  weekStart:2,
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
};

LocaleConfig.defaultLocale = 'fr';

class Ludesco extends Component {
  constructor(props) {
    super(props);
    this.state = {drawer: null};
  }
  setDrawer(drawer) {
    this.setState({ drawer});
  }
  openDrawer() {
    this.state.drawer.openDrawer();
  }
  closeDrawer() {
    this.state.drawer.closeDrawer();
  }
  componentDidMount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }
  render() {
    const {navigation, drawer} = this.state;

    return <Provider store={store}>
            <ThemeProvider uiTheme={{}}>
              <DrawerLayoutAndroid
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() =>
                  <AndroidDrawerViewContainer
                    navigator={this.navigator}
                    close={() => this.closeDrawer()} />
                }
                ref={(drawer) => {!this.state.drawer ? this.setDrawer(drawer) : null}}>
                  <NotificationModal onClick={() => store.dispatch({type:'NOTIFICATION_ACKNOWLEDGE'})} />
                  <TestWithState openDrawer={() => this.openDrawer()} />
                </DrawerLayoutAndroid>
              </ThemeProvider>
            </Provider>
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav,
  navTitle : state.navTitle
})

class Test extends Component {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }
  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  }
  render() {
  const toolbar = <Toolbar leftElement="menu"
      centerElement={this.props.navTitle}
      searchable={{
        autoFocus: true,
        placeholder: 'Rechercher',
        onChangeText: (search) => {store.dispatch({type:'SEARCH',search:search})}
      }}
      onLeftElementPress={() => this.props.openDrawer()}
          icon='menu'
          rightIconStyle={{
              margin: 10
          }} />;
    return <RootNavigator navigation={addNavigationHelpers({
      dispatch: this.props.dispatch,
      state: this.props.nav
    })} screenProps={{toolbar: toolbar}} />
  }
}

const TestWithState = connect(mapStateToProps)(Test)

AppRegistry.registerComponent('Ludesco', () => Ludesco);
