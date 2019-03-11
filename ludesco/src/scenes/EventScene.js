import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { LoginModal } from '../components/loginModal';
import Event from '../components/Event';
import styles from '../components/styles';

export default class EventScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModalVisible: false,
    };
  }

  doConnect(user) {
    const { doConnect, event } = this.props;
    doConnect(event, user)
      .then((r) => {
        if (r) {
          setTimeout(() => {
            this.closeLoginModal();
          }, 500);
        }
      });
  }

  subscribe() {
    const { user, event, subscribe } = this.props;
    subscribe({ user_id: user.id, event_id: event.id });
  }

  unsubscribe() {
    const { user, event, unsubscribe } = this.props;
    unsubscribe({ user_id: user.id, event_id: event.id });
  }

  closeLoginModal() {
    this.setState({ loginModalVisible: false });
  }

  askSubscribe() {
    const { isConnected } = this.props;
    if (isConnected) {
      this.subscribe();
    } else {
      this.setState({ loginModalVisible: true });
    }
  }

  render() {
    const { event, hasReservation, navigation } = this.props;
    const { loginModalVisible } = this.state;

    return (
      <ScrollView style={styles.scrollView}>
        <LoginModal
          modalVisible={loginModalVisible}
          doConnect={user => this.doConnect(user)}
          onCreateAccount={() => { navigation('CreateAccount'); this.closeLoginModal(); }}
          onRequestClose={() => this.closeLoginModal()}
        />
        <Event
          event={event}
          hasReservation={hasReservation}
          askSubscribe={() => this.askSubscribe()}
          askUnsubscribe={() => this.unsubscribe()}
        />
      </ScrollView>
    );
  }
}
