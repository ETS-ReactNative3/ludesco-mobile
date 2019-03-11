import React from 'react';
import { LocaleConfig } from 'react-native-calendars';

// eslint-disable-next-line import/no-unresolved
import Application from './Application';
import { bootstrap } from './src/actions/actions';
import store from './src/state/container';

LocaleConfig.locales.fr = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  weekStart: 2,
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
};

LocaleConfig.defaultLocale = 'fr';

store.dispatch(bootstrap());

const App = () => <Application />;

export default App;
