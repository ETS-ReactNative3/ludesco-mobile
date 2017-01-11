import React, { Component } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Modal, TouchableHighlight, TextInput, WebView } from 'react-native';
import { Card, Button } from 'react-native-material-design';
import { LoginModal } from '../components/loginModal';
import styles from '../components/styles';

var HTMLView = require('react-native-htmlview');

export default class EventScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribeModalVisible: false,
      loginModalVisible: false
    };
  }
  doConnect(user) {
    const {doConnect, event} = this.props;
    doConnect(event, user)
      .then(() => this.closeLoginModal());
  }
  subscribe() {
    const {user, event, subscribe} = this.props;
    subscribe({user_id: user.id, event_id: event.id});
  }
  unsubscribe() {
    const {user, event, unsubscribe} = this.props;
    unsubscribe({user_id: user.id, event_id: event.id});
  }
  closeLoginModal() {
    this.setState({loginModalVisible: false});
  }
  askSubscribe() {
    const {isConnected, subscribe, event, user} = this.props;
    if(isConnected) {
      this.subscribe();
    } else {
      this.setState({loginModalVisible: true});
    }
  }
  render() {
    const { event, text, hasReservation, unsubscribe } = this.props;
    const { subscribeModalVisible, loginModalVisible } = this.state;

    return <ScrollView style={styles.scrollView}>
              <LoginModal modalVisible={loginModalVisible} doConnect={(user) => this.doConnect(user)} onRequestClose={() => this.closeLoginModal()} />
              <Event event={event} hasReservation={hasReservation} askSubscribe={() => this.askSubscribe()} askUnsubscribe={() => this.unsubscribe()} />
            </ScrollView>;
  }
}

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0
    }
  }
  onNavigationStateChange(nav) {
    this.setState({height: Number(nav.title)});
  }
  render() {
    const {event, askSubscribe, askUnsubscribe, hasReservation} = this.props;
    const {height} = this.state;
    if(!event) return (<View></View>);
    let cardButtons;
    if(event.hasinscriptions) {
      if(event.free) {
        cardButtons = <TakePart hasReservation={hasReservation} event={event} askSubscribe={askSubscribe} askUnsubscribe={askUnsubscribe} />
      } else {
        cardButtons = <Text style={{marginBottom:12,fontStyle:'italic'}}>{"Il n'est pas possible de s'inscrire à une animation payante. Inscris-toi sur le site internet ou à l'acceuil."}</Text>
      }
    }
    var html = '<!DOCTYPE html><html><style>body {font-size: 14px;}</style><body>' + event.description + '<script>window.location.hash = 1;document.title = document.height;</script></body></html>';
    return (<Card>
      <Text style={styles.eventTitle}>{event.event_name}</Text>
        <Card.Body>
        <WebView
          automaticallyAdjustContentInsets={true}
          style={{height:height}}
          source={{html:html}}
          scrollEnabled={false}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
           />
        </Card.Body>
        {cardButtons}
      </Card>);
  }
}

class TakePart extends Component {
  static propTypes = {
    event : React.PropTypes.object.isRequired,
    hasReservation : React.PropTypes.bool.isRequired,
    askSubscribe : React.PropTypes.func.isRequired,
    askUnsubscribe : React.PropTypes.func.isRequired
  };

  render() {
    const {event, askSubscribe, askUnsubscribe, hasReservation} = this.props;
    let button;
    if(hasReservation) {
      button = <Button style={styles.cardButton} text="SE DESINSCRIRE" onPress={askUnsubscribe} />;
    } else {
      button = <Button style={styles.cardButton} text="S'INSCRIRE" onPress={askSubscribe} />;
    }
    return <Card.Actions position="right">
            <View style={styles.cardActions}>
              <Text style={styles.cardText}>{event.participants} / {event.ticket_spaces}</Text>
              {button}
            </View>
          </Card.Actions>;
  }
}
