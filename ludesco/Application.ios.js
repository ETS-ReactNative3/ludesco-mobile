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
import { Toolbar, Subheader, Avatar, Divider, COLOR, TYPO, ThemeProvider } from 'react-native-material-ui';
import { Provider } from 'react-redux';
import AndroidDrawerViewContainer from './src/scenes/AndroidDrawerView.js';
import NotificationModal from './src/notifications/NotificationModal';
import store, { RootNavigator, addListener } from './src/state/container.js'
import { LocaleConfig } from 'react-native-calendars';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { back } from './src/actions/actions.js';
import Spinner from 'react-native-loading-spinner-overlay';
import Drawer from 'react-native-drawer';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  weekStart:2,
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
};

LocaleConfig.defaultLocale = 'fr';

export default class Ludesco extends Component {
  constructor(props) {
    super(props);
    this.state = {drawer: null, loading : false, drawerOpen : false};
    store.subscribe(() => {
      let loading = store.getState().loading;
      this.setState({loading});
    });
  }
  openDrawer() {
    this.setState({drawerOpen:true});
  }
  closeDrawer() {
    this.setState({drawerOpen:false});
  }
  render() {
    return <Provider store={store}>
            <ThemeProvider uiTheme={{}}>
            <Drawer
              openDrawerOffset={0.2}
              open={this.state.drawerOpen}
              onClose={() => this.closeDrawer()}
              content={<AndroidDrawerViewContainer close={() => this.closeDrawer()} />}
              ref={(ref) => this._drawer = ref}>
              <View style={{flex:1}}>
              <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}} />
                  <NotificationModal onClick={() => store.dispatch({type:'NOTIFICATION_ACKNOWLEDGE'})} />
                  <TestWithState openDrawer={() => this.openDrawer()} />
              </View>
              </Drawer>
              </ThemeProvider>
            </Provider>
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav,
  navTitle : state.navTitle
})

class Test extends Component {
  /*onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  }*/
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
      state: this.props.nav,
      addListener
    })} screenProps={{toolbar: toolbar}} />
  }
}

const TestWithState = connect(mapStateToProps)(Test)

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
