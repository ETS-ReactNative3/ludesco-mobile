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
        cardButtons = <Text style={{marginBottom:12,fontStyle:'italic'}}>{"Il n'est pas possible de s'inscrire à une animation payante via l'application mobile. Inscris-toi sur le site internet ou à l'acceuil."}</Text>
      }
    }

    var htmlEvent
    if(event.description) {
      htmlEvent = event.description;
      htmlEvent = htmlEvent.replace(/\r\n\r\n/g, "</p><p>").replace(/\n\n/g, "</p><p>");
      htmlEvent = htmlEvent.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");
      htmlEvent = htmlEvent.replace("<p></p>");
    } else {
      htmlEvent = "";
    }

    //http://flexwork.io/blog/webview-height-html-content-react-native/
    var html = `<div>${htmlEvent}</div>
              <style>
                body, html, #height-calculator {
                    margin: 0;
                    padding: 0;
                    font-size: 14px;
                }
                #height-calculator {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                }
                br {
                   display: block;
                   margin: 2px 0;
                   line-height:22px;
                   content: ""
                }
                p {

                }
              </style>
                    <script>
                      window.location.hash = 1;
                       var calculator = document.createElement("div");
                       calculator.id = "height-calculator";
                       while (document.body.firstChild) {
                          calculator.appendChild(document.body.firstChild);
                       }
                       document.body.appendChild(calculator);
                       var imgs = document.getElementsByTagName("img");
                       for(var i = 0;i<imgs.length;i++) {
                         if(imgs[i].width>calculator.clientWidth) {
                           var ratio = calculator.clientWidth/imgs[i].width;
                           imgs[i].style.width = calculator.clientWidth+"px";
                           imgs[i].style.height = (imgs[i].height*ratio)+"px";
                         }
                       }
                       document.title = calculator.clientHeight;
                  </script>`;
    return (<Card>
      <Text style={styles.eventTitle}>{event.event_name}</Text>
        <Card.Body>
        <WebView
          automaticallyAdjustContentInsets={true}
          style={{height:height}}
          source={{html:html}}
          scrollEnabled={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
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
      button = <Button style={styles.cardButton} text="SE DESINSCRIRE" />;
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
