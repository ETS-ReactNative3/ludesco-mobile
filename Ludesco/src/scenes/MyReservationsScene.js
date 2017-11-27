import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableHighlight, TextInput, Modal } from 'react-native';
import { Button } from 'react-native-material-ui';
import store, { isConnected } from '../state/container.js';
import { LoginModal } from '../components/loginModal';

const base64 = require('base-64');

var moment = require('moment');

export default class MyReservationsScene extends Component {
  constructor(props) {
    super(props);
    const {isConnected} = props;
    this.state = {
      loginModalVisible : !isConnected
    }
  }
  doConnect(user) {
    const {doConnect} = this.props;
    doConnect(user).then(() => {
      this.closeLoginModal();
    });
  }
  closeLoginModal() {
    this.setState({loginModalVisible : false});
  }
  render() {
    const {
      reservations,
      onReservationPress,
      close
    } = this.props;
    const { loginModalVisible } = this.state;

    let childrens;
    if(reservations.length>0) {
      childrens = reservations.map((e,i) => <Reservation event={e} key={i} onPress={onReservationPress} />);
    } else {
      childrens = <NoReservation />
    }


    return <ScrollView style={{marginTop: 70}}>
        <LoginModal
          onRequestClose={close}
          doConnect={(user) => this.doConnect(user)}
          modalVisible={loginModalVisible} />
        {childrens}
        </ScrollView>
  }
}

class NoReservation extends Component {
  render() {
    return <Text style={{marginLeft:24}}>{"Vous n'avez pour l'heure effectué aucune réservation"}</Text>
  }
}

class Reservation extends Component {
  render() {
    const {event, onPress} = this.props;
      let startDate = moment(event.event_start_date);
      let endDate = moment(event.event_end_date);
      let startTime = startDate.format('HH:mm');
      let endTime = endDate.format('HH:mm');
      let day = startDate.format('dddd');
      let dayWithCap = day.charAt(0).toUpperCase() + day.slice(1);

      return (<TouchableHighlight onPress={() => onPress(event)}>
          <View style={{flex:1,flexDirection:'column',justifyContent:'center',height:72,marginLeft:16,marginRight:16}}>
            <Text style={{fontWeight:'bold'}}>{event.event_name}</Text>
            <Text>{`${dayWithCap} : ${startTime} - ${endTime}`}</Text>
            <Text>{event.places} place(s)</Text>
          </View>
        </TouchableHighlight>);
  }
}
