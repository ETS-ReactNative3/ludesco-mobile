import React, { Component, PropTypes } from 'react';
import {
  ListView,
  ScrollView,
  Text,
  Image,
  AsyncStorage,
  View,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import { Avatar } from 'react-native-material-ui';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import HTMLView from 'react-native-htmlview';

const ICONES_MAPPING = {
    "Escape Room" : require("../img/EscapeRoom.png"),
    "Fablab" : require("../img/Fablab.png"),
    "Familles" : require("../img/Familles.png"),
    "Figurines" : require("../img/Figurines.png"),
    "GameDesign" : require("../img/GameDesign.png"),
    "GN" : require("../img/GN.png"),
    "JdR" : require("../img/JdR.png"),
    "Jeux de société" : require("../img/JeuxDeSociete.png"),
    "Jeux traditionnels" : require("../img/JeuxTraditionnels.png"),
    "Nouveautés" : require("../img/Nouveautes.png")
}

export default class ProgrammeScene extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: ({screenProps }) => {
      return screenProps.toolbar
    }
  });

  constructor(props) {
		super(props);
    if(this.props.events.length==0) {
      this.props.beforeDisplay(this.props.day,this.props.categories);
    }
  }
	render() {
    const {
      events,
      onEventClick,
      onDayClick,
      navigateTo,
      hasReservationFor
    } = this.props;
		  return <ProgrammeScrollView onEventClick={onEventClick} navigateTo={navigateTo} events={events} hasReservationFor={hasReservationFor} />
    }
}

class ProgrammeScrollView extends Component {
  render() {
    const {
      events,
      onEventClick,
      navigateTo,
      hasReservationFor
    } = this.props;

    const items = events.reduce((acc, event) => {
      let d = event.startDate.format('YYYY-MM-DD');
      (acc[d] = (acc[d] || [])).push(event);
      return acc;
    },{});
    if(!items['2017-03-10']) { items['2017-03-10']=[]}
    if(!items['2017-03-11']) { items['2017-03-11']=[]}
    if(!items['2017-03-12']) { items['2017-03-12']=[]}

    const inscriptionsView = (event) => {
          if(event.hasinscriptions) {
            if(event.free) {
              return <Text>{event.participants}/{event.ticket_spaces} participants - Gratuit</Text>
            } else {
              return <Text>{event.participants}/{event.ticket_spaces} participants - Surtaxe</Text>
            }
          } else {
            return <Text>Sur place</Text>
          }
    }

    const categoriesSheet = StyleSheet.create({
      body: {
        color: '#AAAAAA'
      }
    });

    const eventView = (item, firstItemInDay) => {
      let eventId = item.id;
      const v = Object.values(ICONES_MAPPING)[Math.floor(Math.random() * 10) + 1]
      return (
      <TouchableHighlight style={[styles.item, {height: item.height, backgroundColor: hasReservationFor(item) ? '#ccffcc' : '#ffffff'}]} onPress={item => navigateTo('Event', eventId)}>
        <View>
          <View style={{flex:1,display:'flex',flexDirection:'row',marginBottom:12,width:"100%"}}>
            <Text style={{fontSize:14}}>{item.startTime} - {item.endTime}</Text>
            <View style={{flex:1}}>
              <Image style={{width:48, height:48, alignSelf:'flex-end'}} source={v} />
            </View>
          </View>
          <Text style={{marginBottom:12,fontSize: 16}}>{item.event_name}</Text>
          <Text style={{fontSize:13,color:'#AAA'}}>{item.categories.join(", ").replace(/&amp;/g, '&')}</Text>
          {inscriptionsView(item)}
        </View>
      </TouchableHighlight>)}

    let navv = this.props;

    return <Agenda
              items={items}
              loadItemsForMonth={(month) => {console.log('trigger items loading')}}
              onDayPress={(day)=>{}}
              onDayChange={(day)=>{}}
              selected={'2017-03-10'}
              minDate={'2017-03-10'}
              maxDate={'2017-03-12'}
              pastScrollRange={50}
              futureScrollRange={300}
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
