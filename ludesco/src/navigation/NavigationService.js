import { NavigationActions } from 'react-navigation';

let _navigator;
let _drawer;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function setTopLevelDrawer(drawerRef) {
  _drawer = drawerRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function openDrawer() {
  _drawer.openDrawer();
}

function closeDrawer() {
  _drawer.closeDrawer();
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  openDrawer,
  closeDrawer,
  setTopLevelDrawer
};
