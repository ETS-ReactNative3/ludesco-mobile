import React, { Component } from 'react';
import { Text } from 'react-native';
import { Toolbar, Subheader, Avatar, Drawer, Divider, COLOR, TYPO, ThemeProvider, ThemeContext, getTheme } from 'react-native-material-ui';
import { StackNavigator, AppNavigator, NavigationActions, createStackNavigator, createAppContainer } from 'react-navigation';
import NavigationService from '../navigation/NavigationService.js';
import ProgrammeSceneContainer from '../containers/ProgrammeSceneContainer.js';
import EventSceneContainer from '../containers/EventSceneContainer.js';
import MyReservationsSceneContainer from '../containers/MyReservationsSceneContainer.js';
import StudioSceneContainer from '../containers/StudioSceneContainer.js';
import CreateAccountContainer from '../containers/CreateAccountContainer.js';
import store from '../state/container.js';

function createToolbar(titre) {
  return <Toolbar leftElement="menu"
      centerElement={titre}
      searchable={{
        autoFocus: true,
        placeholder: 'Rechercher',
        onChangeText: (search) => {store.dispatch({type:'SEARCH',search:search})}
      }}
      onLeftElementPress={() => NavigationService.openDrawer()}
          icon='menu'
          rightIconStyle={{
              margin: 10
          }} />;
}

export const RootStack = createStackNavigator({
  Programme : {
    screen: ProgrammeSceneContainer,
    navigationOptions: ({ navigation }) => ({
      header: createToolbar("Programme")
    })
  },
  Agenda : {
    screen: MyReservationsSceneContainer,
    navigationOptions: ({ navigation }) => ({
      header: createToolbar("Agenda")
    })
  },
  Studio : {
    screen: StudioSceneContainer,
    navigationOptions: ({ navigation }) => ({
      header: createToolbar("Le Studio")
    })
  },
  Event : {
    screen: EventSceneContainer,
    navigationOptions: ({ navigation }) => ({
      header: createToolbar("Programme")
    })
  },
  CreateAccount : {
    screen: CreateAccountContainer,
    navigationOptions: ({ navigation }) => ({
      header: createToolbar("Créer un compte")
    })
  }
});

export default RootNavigator = createAppContainer(RootStack);
