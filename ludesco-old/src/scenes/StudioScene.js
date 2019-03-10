import React, { Component, PropTypes } from 'react';
import {
  ListView,
  Linking,
  ScrollView,
  Text,
  AsyncStorage,
  Button,
  View,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  Image
} from 'react-native';
import { ListItem, Card } from 'react-native-material-ui';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import {capitalize} from '../util/date.js';
var moment = require('moment');

const utcDateToString = (momentInUTC) => {
  return moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
};

const addEvent = (config) => AddCalendarEvent.presentNewCalendarEventDialog(config)
  .then(eventId => {
    //handle success (receives event id) or dismissing the modal (receives false)
    if (eventId) {
      console.warn(eventId);
    } else {
      console.warn('dismissed');
    }
  })
  .catch((error: string) => {
    // handle error such as when user rejected permissions
    console.warn(error);
  });


export default class StudioScene extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: ({screenProps}) => {
      return screenProps.toolbar
    }
  });

  constructor(props) {
    super(props)
    this.props.beforeDisplay()
  }

  render() {
    const events = this.props.events;

    const cards = events.map((e) => {
      const startDate = moment(e.start_date);
      const startTime = moment(e.start_time);
      startDate.hour(startTime.hour());
      startDate.minute(startTime.minute());

      const endDate = moment(e.end_date);
      const endTime = moment(e.end_time);
      endDate.hour(endTime.hour());
      endDate.minute(endTime.minute());

      const config = {
        title: e["short-title"],
        startDate : utcDateToString(startDate),
        endDate : utcDateToString(endDate)
      }

      return (
        <TouchableHighlight onPress={() => addEvent(config)} style={{backgroundColor: "white", borderBottomWidth: 1, borderBottomColor:'#aaa'}}>
          <View style={{marginTop:16, marginLeft:16, marginRight:16, marginBottom: 16, display:'flex', flexDirection:'row'}}>
            <View style={{flex:1}}>
              <Text style={{fontSize:16, color:'black'}}>{e["short-title"]}</Text>
              <Text>{capitalize(startDate.format("dddd Do MMMM YYYY"))} de {startDate.format('HH:mm')} à {endDate.format('HH:mm')}</Text>
            </View>
              <Image style={{width:80, height:80}} source={{uri:e.image}} />
          </View>
        </TouchableHighlight>);
    });

    return (<ScrollView>
        {cards}
      </ScrollView>)
  }
}
