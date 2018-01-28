import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableHighlight, TextInput, Modal, StyleSheet } from 'react-native';
import { Button } from 'react-native-material-ui';
import store, { isConnected } from '../state/container.js';
import { LoginModal } from '../components/loginModal';
import { Agenda } from 'react-native-calendars';

const base64 = require('base-64');

var moment = require('moment');

export default class MyReservationsScene extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: ({screenProps }) => {
      return screenProps.toolbar
    }
  });

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
      navigateTo
    } = this.props;
    const { loginModalVisible } = this.state;

    let childrens;
    if(reservations.length>0) {
      childrens = reservations.map((e,i) => <Reservation event={e} key={i} onPress={onReservationPress} />);
    } else {
      childrens = <NoReservation />
    }

    const items = reservations.reduce((acc, reservation) => {
      let d = moment(reservation.event_start_date).format('YYYY-MM-DD');
      (acc[d] = (acc[d] || [])).push(reservation);
      return acc;
    },{});
    if(!items['2018-03-16']) { items['2018-03-16']=[]}
    if(!items['2018-03-17']) { items['2018-03-17']=[]}
    if(!items['2018-03-18']) { items['2018-03-18']=[]}

    const eventView = (item, firstItemInDay) => {
      let eventId = item.event_id;
      let startDate = moment(item.event_start_date);
      let endDate = moment(item.event_end_date);
      let startTime = startDate.format('HH:mm');
      let endTime = endDate.format('HH:mm');

      return (
        <TouchableHighlight style={[styles.item, {height: item.height, backgroundColor: '#ffffff'}]} onPress={item => navigateTo('Event', eventId)}>
          <View>
            <View style={{flex:1,display:'flex',flexDirection:'row',marginBottom:12,width:"100%"}}>
              <Text style={{fontSize:14}}>{startTime} - {endTime}</Text>
            </View>
            <Text style={{marginBottom:12,fontSize: 16}}>{item.event_name}</Text>
            </View>
        </TouchableHighlight>
      )
    }

    return <View style={{flex:1}}>
      <LoginModal
        onRequestClose={() => {
          this.closeLoginModal();
          navigateTo('Programme');
        }}
        doConnect={(user) => this.doConnect(user)}
        modalVisible={loginModalVisible} />
        <Agenda
                items={items}
                loadItemsForMonth={(month) => {}}
                onDayPress={(day)=>{}}
                onDayChange={(day)=>{}}
                selected={'2018-03-16'}
                minDate={'2018-03-16'}
                maxDate={'2018-03-18'}
                pastScrollRange={50}
                futureScrollRange={200}
                renderItem={eventView}
                renderEmptyDate={() => {return (<View />);}}
                renderKnob={() => {return (<View />);}}
                firstDay={1}
                hideExtraDays={true}
                rowHasChanged={(r1, r2) => true}
                hideKnob={true}
                theme={{}}
                style={{}}
      />
    </View>
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

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});
