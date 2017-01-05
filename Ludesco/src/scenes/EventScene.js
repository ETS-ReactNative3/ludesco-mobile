import React, { Component } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Modal, TouchableHighlight, TextInput } from 'react-native';
import { fetchJSON } from '../util/http';
import { isConnected } from '../state/container';
import Checkbox from '../components/checkbox'
import { Card, Button } from 'react-native-material-design';
import { LoginModal } from '../components/loginModal';
import styles from '../components/styles';
var HTMLView = require('react-native-htmlview');

export default class EventScene extends Component {
  render() {
    const { event, loginModalVisible, modalVisible, text } = this.props;
    if(!event) return (<View></View>);
    let cardButtons;
    if(event.hasinscriptions) {
      cardButtons = <TakePart event={event} askSubscribe={this.props.askSubscribe} />
    }
    return (<ScrollView style={styles.scrollView}>
      <LoginModal modalVisible={loginModalVisible} />
      <Modal animationType={"fade"} transparent={true} visible={modalVisible} onRequestClose={() => {alert("Modal has been closed.")}} >
        <View style={{height:100, flex:1, alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
          <View style={{backgroundColor: 'white',paddingLeft:24, paddingRight:24,paddingTop: 22}}>
            <Text style={{marginTop:24,marginBottom:20, fontWeight: 'bold'}}>Inscription à une partie</Text>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => this.setState({text})}
              value={text} />
            <View style={{marginTop:24, paddingTop:8, height:52}}>
              <View style={styles.cardActions}>
                <Button style={{width:20}} text="S'INSCRIRE" onPress={() => {this.subscribe()}} />
                <Button style={{width:20}} text="ANNULER" onPress={() => {this.setModalVisible(false)}} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Card>
        <Text style={styles.eventTitle}>{event.event_name}</Text>
          <Card.Body>
              <HTMLView value={event.description} />
          </Card.Body>
          {cardButtons}
        </Card>
      </ScrollView>)
  }
}

class TakePart extends Component {
  render() {
    const {event} = this.props;
    return <Card.Actions position="right">
            <View style={styles.cardActions}>
              <Text style={styles.cardText}>{event.participants} / {event.ticket_spaces}</Text>
              <Button style={styles.cardButton} text="S'INSCRIRE" onPress={() => this.props.askSubscribe()} />
            </View>
          </Card.Actions>;
  }
}

class AddInscriptionModal extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return ( <View style={{marginTop: 22}}>
              <Modal animationType={"slide"} transparent={false} visible={this.state.modalVisible} onRequestClose={() => {alert("Modal has been closed.")}} >
              <View style={{marginTop: 22}}>
                <View>
                  <Text>Hello World!</Text>
                  <TouchableHighlight onPress={() => { this.setModalVisible(!this.state.modalVisible) }}>
                    <Text>Hide Modal</Text>
                  </TouchableHighlight>
                </View>
              </View>
              </Modal>
              <TouchableHighlight onPress={() => { this.setModalVisible(true) }}>
              <Text>Show Modal</Text>
              </TouchableHighlight>
              </View> );
}
}
