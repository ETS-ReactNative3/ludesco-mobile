import React from 'react';
import { Toolbar } from 'react-native-material-ui';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import NavigationService from './NavigationService';
import ProgrammeSceneContainer from '../containers/ProgrammeSceneContainer';
import EventSceneContainer from '../containers/EventSceneContainer';
import MyReservationsSceneContainer from '../containers/MyReservationsSceneContainer';
import StudioSceneContainer from '../containers/StudioSceneContainer';
import CreateAccountContainer from '../containers/CreateAccountContainer';
import store from '../state/container';

function createToolbar(titre) {
  return (
    <Toolbar
      leftElement="menu"
      centerElement={titre}
      searchable={{
        autoFocus: true,
        placeholder: 'Rechercher',
        onChangeText: (search) => { store.dispatch({ type: 'SEARCH', search }); },
      }}
      onLeftElementPress={() => NavigationService.openDrawer()}
      icon="menu"
      rightIconStyle={{ margin: 10 }}
    />
  );
}

export const RootStack = createStackNavigator({
  Programme: {
    screen: ProgrammeSceneContainer,
    navigationOptions: () => ({
      header: createToolbar('Programme'),
    }),
  },
  Agenda: {
    screen: MyReservationsSceneContainer,
    navigationOptions: () => ({
      header: createToolbar('Agenda'),
    }),
  },
  Studio: {
    screen: StudioSceneContainer,
    navigationOptions: () => ({
      header: createToolbar('Le Studio'),
    }),
  },
  Event: {
    screen: EventSceneContainer,
    navigationOptions: () => ({
      header: createToolbar('Programme'),
    }),
  },
  CreateAccount: {
    screen: CreateAccountContainer,
    navigationOptions: () => ({
      header: createToolbar('Créer un compte'),
    }),
  },
});

const RootNavigator = createAppContainer(RootStack);

export default RootNavigator;
