import React, { Component } from 'react';
import {
  AppRegistry,
  DrawerLayoutAndroid,
  BackAndroid,
  Text,
  View,
  StyleSheet
} from 'react-native';
import { Toolbar, Subheader, Avatar, Drawer, Divider, COLOR, TYPO, ThemeProvider } from 'react-native-material-ui';
import { Provider } from 'react-redux';
import AndroidDrawerViewContainer from './src/scenes/AndroidDrawerView.js';
import NotificationModal from './src/notifications/NotificationModal';
import Main from './src/scenes/Main.js';
import store from './src/state/container.js'
import LudescoNavigator from './src/navigation/LudescoNavigator.js';
import { Agenda, LocaleConfig } from 'react-native-calendars';

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
    this.state = {drawer: null, navigation: null};
  }
  setDrawer(drawer) {
    this.setState({ drawer});
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
    const toolbar = <Toolbar leftElement="menu"
        centerElement="Ludesco"
        searchable={{
          autoFocus: true,
          placeholder: 'Rechercher',
        }}
        onLeftElementPress={() => this.openDrawer()}
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
            <ThemeProvider uiTheme={{}}>
              <DrawerLayoutAndroid
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() =>
                  <AndroidDrawerViewContainer
                    ref={(navigation) => !this.state.navigation ? this.setNavigation(navigation) : null}
                    close={() => this.closeDrawer()} />
                }
                ref={(drawer) => {!this.state.drawer ? this.setDrawer(drawer) : null}}>
                  <NotificationModal onClick={() => store.dispatch({type:'NOTIFICATION_ACKNOWLEDGE'})} />
                  <Main toolbar={toolbar} />
                </DrawerLayoutAndroid>
              </ThemeProvider>
            </Provider>
      /*return <Provider store={store}>
      <Agenda
  // the list of items that have to be displayed in agenda. If you want to render item as empty date
  // the value of date key kas to be an empty array []. If there exists no value for date key it is
  // considered that the date in question is not yet loaded
  items={
    {'2018-03-16': [{text: 'item 1 - any js object'},{text: 'item 1 - any js object'},{text: 'item 1 - any js object'},{text: 'item 1 - any js object'},{text: 'item 1 - any js object'}],
     '2018-03-17': [{text: 'item 2 - any js object'}],
     '2018-03-18': [{text: 'item 2 - any js object'}],
     '2012-05-25': [{text: 'item 3 - any js object'},{text: 'any js object'}],
    }}
  // callback that gets called when items for a certain month should be loaded (month became visible)
  loadItemsForMonth={(month) => {console.log('trigger items loading')}}
  // callback that gets called on day press
  onDayPress={(day)=>{console.log('day pressed')}}
  // callback that gets called when day changes while scrolling agenda list
  onDayChange={(day)=>{console.log('day changed')}}
  // initially selected day
  selected={'2018-03-16'}
  // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
  minDate={'2018-03-16'}
  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
  maxDate={'2018-03-18'}
  // Max amount of months allowed to scroll to the past. Default = 50
  pastScrollRange={50}
  // Max amount of months allowed to scroll to the future. Default = 50
  futureScrollRange={50}
  // specify how each item should be rendered in agenda
  renderItem={(item, firstItemInDay) => {return (<View style={[styles.item, {height: item.height}]}><Text>TT{item.text}</Text></View>);}}
    // specify how each date should be rendered. day can be undefined if the item is not first in that day.
  //renderDay={(day, item) => {return (<View />);}}
  // specify how empty date content with no items should be rendered
  renderEmptyDate={() => {return (<View />);}}
  // specify how agenda knob should look like
  renderKnob={() => {return (<View />);}}
  firstDay={1}
  hideExtraDays={true}
  // specify your item comparison function for increased performance
  rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
  // Hide knob button. Default = false
  hideKnob={false}
  // agenda theme
  theme={{
  }}
  // agenda container style
  style={{}}
/>
</Provider>*/
  }
}

class Programme extends Component {

}

BackAndroid.addEventListener('hardwareBackPress', () => {
  return LudescoNavigator.pop();
});

AppRegistry.registerComponent('Ludesco', () => Ludesco);

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});
