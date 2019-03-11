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
    "Escape Games" : require("../img/EscapeRoom.png"),
    "Fablab" : require("../img/Fablab.png"),
    "Espace Familles" : require("../img/Familles.png"),
    "Ouvert aux familles" : require("../img/Familles.png"),
    "Jeux en famille" : require("../img/Familles.png"),
    "Figurines" : require("../img/Figurines.png"),
    "Game design &amp; Prototypes" : require("../img/GameDesign.png"),
    "GNs &amp; Murder Party" : require("../img/GN.png"),
    "Jeux de rôle" : require("../img/JdR.png"),
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
      onDayClick,
      navigate,
      hasReservationFor
    } = this.props;
		  return <ProgrammeScrollView navigate={navigate} events={events} hasReservationFor={hasReservationFor} />
    }
}

class EventView extends Component {
    render() {
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

      const {item, hasReservationFor, navigate} = this.props;
      let eventId = item.id;
      let categories = item.categories.filter(c => c!='Français');
      const v = ICONES_MAPPING[categories[0]]
      return (<TouchableHighlight style={[styles.item, {height: item.height, backgroundColor: hasReservationFor(item) ? '#ccffcc' : '#ffffff'}]} onPress={item => navigate('Event', eventId)}>
        <View>
          <View style={{flex:1,display:'flex',flexDirection:'row',marginBottom:12,width:"100%"}}>
            <Text style={{fontSize:14}}>{item.startTime} - {item.endTime}</Text>
            <View style={{flex:1}}>
              <Image style={{width:48, height:48, alignSelf:'flex-end'}} source={v} />
            </View>
          </View>
          <Text style={{marginBottom:12,fontSize: 16}}>{item.event_name}</Text>
          <Text style={{fontSize:13,color:'#AAA'}}>{categories.join(", ")}</Text>
          {inscriptionsView(item)}
        </View>
      </TouchableHighlight>)
    }
}

class ProgrammeScrollView extends Component {
  render() {
    const {
      events,
      navigate,
      hasReservationFor
    } = this.props;

    const items = events.reduce((acc, event) => {
      let d = event.startDate.format('YYYY-MM-DD');
      (acc[d] = (acc[d] || [])).push(event);
      return acc;
    },{});
    if(!items['2018-03-16']) { items['2018-03-16']=[]}
    if(!items['2018-03-17']) { items['2018-03-17']=[]}
    if(!items['2018-03-18']) { items['2018-03-18']=[]}

    const categoriesSheet = StyleSheet.create({
      body: {
        color: '#AAAAAA'
      }
    });

    let navv = this.props;

    return <Agenda
              items={items}
              selected={'2019-03-15'}
              minDate={'2019-03-15'}
              maxDate={'2019-03-17'}
              renderItem={(item, firstItemInDay) => <EventView item={item} hasReservationFor={hasReservationFor} navigate={navigate} />}
              renderEmptyDate={() => {return (<View />);}}
              renderKnob={() => {return (<View />);}}
              firstDay={1}
              hideExtraDays={true}
              rowHasChanged={(r1, r2) => { return r1.id!==r2.id;}}
              hideKnob={true}
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
