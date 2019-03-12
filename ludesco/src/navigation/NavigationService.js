import { NavigationActions } from 'react-navigation';

let navigator;
let drawer;

function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

function setTopLevelDrawer(drawerRef) {
  drawer = drawerRef;
}

function navigate(routeName, params) {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

function openDrawer() {
  drawer.openDrawer();
}

function closeDrawer() {
  drawer.closeDrawer();
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  openDrawer,
  closeDrawer,
  setTopLevelDrawer,
};
