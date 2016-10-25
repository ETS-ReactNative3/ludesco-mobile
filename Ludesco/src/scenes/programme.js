import React, { Component } from 'react';
import { ListView, ScrollView, Text, AsyncStorage, View, TouchableHighlight, Ripple} from 'react-native';
import { Avatar } from 'react-native-material-design';
import { fetchJSON, fetchEvents, storeEvents, fetchEventsByDay } from '../util/http';
import store from '../state/container';
import { InputModal } from '../components/inputModal';

var moment = require('moment');
require('moment/locale/fr');

export default class ProgrammeScene extends Component {
  constructor(props) {
		super(props);
    store.subscribe((e) => {
      this.fetchEvents(store.getState().categories);
    });
    this.fetchEvents();
	}
  fetchEvents(categories) {
    const { day } = this.props;
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1!==r2})
    this.state = {dataSource : ds, data: []};
    fetchJSON('public/festivals/2490/events')
        .catch((e) => {})
        .then(storeEvents)
        .then(() => {
          if(day>=0) {
            return fetchEventsByDay(day)
          } else {
            return fetchEvents();
          }
        })
        .then((events) => events.filter((e) => {
          if(!categories) return true;
          return categories.some((c) => e.categories.indexOf(c) >= 0);
        }))
        .then((events) => events.sort((a,b) => {
            if(moment(a.start_time).isBefore(moment(b.start_time))) {
              return -1
            } else {
              return 1;
            }
        }))
        .then((events) => {
            this.setState({dataSource: ds.cloneWithRows(events), data : events})
          })
        .catch((r) => {
          console.error(r);
        })
  }
  style(e) {
    let categories = e.categories;
    if(categories.includes('Programme principal')) {
      return {icon: 'accessibility', color: 'blue'};
    } else if(categories.includes('Programme OFF')) {
      return {icon: 'home', color: 'googleGreen'};
    } else {
      return {icon: 'wifi', color: 'googleYellow'};
    }
  }
  infos(e) {
    let startDate = moment(e.event_start_date);
    let endDate = moment(e.event_end_date);
    let startTime = moment(e.start_time).format('HH:mm');
    let endTime = moment(e.end_time).format('HH:mm');
    let day = startDate.format('dddd');
    let dayWithCap = day.charAt(0).toUpperCase() + day.slice(1);
    return {
      startDate,
      endDate,
      day,
      dayWithCap,
      startTime,
      endTime
    }
  }
	render() {
    const {navigator} = this.props;
    var that = this;
    var rows = this.state.data.map((e, index) => {
      var infos = that.infos(e);
      var inscriptionsView = e.hasinscriptions ? <Text style={{fontStyle:'italic',fontSize: 12}}>{e.participants}/{e.ticket_spaces} participants</Text> : <Text style={{fontStyle:'italic',fontSize: 12}}>Sur place</Text>
      let {icon, color} = this.style(e);
      return (<TouchableHighlight key={index} onPress={() => {navigator.push({title:'event', id:e.id})}}>
      <View style={{paddingLeft: 16, paddingRight:16, height: 72, flex: 1, flexDirection:'row'}}>
          <View style={{paddingTop: 16}}>
          <Avatar icon={icon} size={30} backgroundColor={color}/>
          </View>
          <View style={{flex:1, height: 80,paddingLeft: 16, flexDirection:'column', justifyContent:'center'}}>
            <Text numberOfLines={1} style={{fontWeight: 'bold'}}>{e.event_name}</Text>
            <Text style={{fontSize: 13}}>{infos.dayWithCap} : {infos.startTime} à {infos.endTime}</Text>
            {inscriptionsView}
          </View>
      </View>
    </TouchableHighlight>)});
		return (
        <ScrollView style={{marginTop:70}}>
          <View>
            {rows}
          </View>
        </ScrollView>)
		}
}
