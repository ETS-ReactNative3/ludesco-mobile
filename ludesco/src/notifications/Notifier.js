import FCM, { FCMEvent } from 'react-native-fcm';
import watch from 'redux-watch';
import store from '../state/container';

export default class Notifier {
  static TOPIC_NOTIFICATION = '/topics/notification';

  static TOPIC_GAMES = '/topics/games';

  static init() {
    // By default everyone is subscribed to the default notification topic
    FCM.subscribeToTopic(this.TOPIC_NOTIFICATION);

    const handleSubscription = topic => (v) => {
      if (v) {
        FCM.subscribeToTopic(topic);
      } else {
        FCM.unsubscribeFromTopic(topic);
      }
    };

    FCM.requestPermissions(); // for iOS
    this.notificationUnsubscribe = FCM.on(FCMEvent.Notification, (notification) => {
      if (notification.title) {
        // store.dispatch(notificationReceived(notification));
      }
    });

    const wNotInfo = watch(store.getState, 'notificationInfo');
    const wNotParties = watch(store.getState, 'notificationParties');

    store.subscribe(wNotInfo(handleSubscription(this.TOPIC_NOTIFICATION)));
    store.subscribe(wNotParties(handleSubscription(this.TOPIC_GAMES)));
  }
}
