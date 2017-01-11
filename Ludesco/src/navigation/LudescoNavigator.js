export default class LudescoNavigator {
  static navigator;
  static setNavigator(navigator) {
    this.navigator = navigator;
  }
  static navigateTo(route) {
    const currentRoutes = this.navigator.getCurrentRoutes();
    const currentRoute = currentRoutes[currentRoutes.length-1];
    const existingRoute = currentRoutes.find((c) => c.title==route.title);
    if(existingRoute) {
      this.navigator.popToRoute(existingRoute);
    } else {
      this.navigator.push(route);
    }
  }
  static pop() {
    this.navigator.pop();
    if(this.navigator.getCurrentRoutes().length==1) {
      return false;
    }
    return true;
  }
}
