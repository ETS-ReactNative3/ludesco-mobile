import React, { Component, PropTypes } from 'react';
import {
  ListView,
  ScrollView,
  Text,
  AsyncStorage,
  View,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import { Avatar } from 'react-native-material-design';

export default class ProgrammeScene extends Component {
  constructor(props) {
		super(props);
    this.props.beforeDisplay(this.props.day,this.props.categories);
  }
	render() {
    const {
      events,
      onEventClick,
      onDayClick
    } = this.props;
		  return (
        <View style={{marginTop:56}}>
            <DaysFilter onDayClick={onDayClick} />
            <ProgrammeScrollView onEventClick={onEventClick} events={events} />
        </View>);
		}
}

class ProgrammeScrollView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      events,
      onEventClick
    } = this.props;

    var rows = events.map((event, index) => {
      return (<Event key={index} onEventClick={onEventClick} event={event} />);
    });
    return (<ScrollView>
        <View>
          {rows}
          </View>
      </ScrollView>);
  }
}

class Event extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {event, onEventClick} = this.props;
    const {icon} = this.style(event);
    const colors = ["googleBlue","googleGreen","googleRed","googleYellow","googleGrey"];
    const letter = event.event_name.substring(0,1);
    const letterCode = event.event_name.charCodeAt(0);
    const color = colors[letterCode%colors.length];
    var inscriptionsView = event.hasinscriptions ? <Text style={{fontStyle:'italic',fontSize: 12}}>{event.participants}/{event.ticket_spaces} participants</Text> : <Text style={{fontStyle:'italic',fontSize: 12}}>Sur place</Text>
    return (<TouchableHighlight onPress={() => {onEventClick(event)}}>
              <View style={{paddingLeft: 16, paddingRight:16, height: 72, flex: 1, flexDirection:'row'}}>
              <View style={{paddingTop: 16}}>
                  <Avatar backgroundColor={color} text={event.event_name.substring(0,1)} />
                  </View>
                  <View style={{flex:1, height: 80,paddingLeft: 16, flexDirection:'column', justifyContent:'center'}}>
                    <Text numberOfLines={1} style={{fontWeight: 'bold'}}>{event.event_name}</Text>
                    <Text style={{fontSize: 13}}>{event.dayWithCap} : {event.startTime} à {event.endTime}</Text>
                    {inscriptionsView}
                  </View>
              </View>
            </TouchableHighlight>);
  }
  style(event) {
    let categories = event.categories;
    if(categories.includes('Programme principal')) {
      return {icon: 'accessibility', color: 'blue'};
    } else if(categories.includes('Programme OFF')) {
      return {icon: 'home', color: 'googleGreen'};
    } else {
      return {icon: 'wifi', color: 'googleYellow'};
    }
  }
}

class DaysFilter extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {onDayClick} = this.props;
    return (<View style={{flex: 1, flexDirection: 'row',height:40}}>
        <DayFilter text="TOUT" onDayClick={onDayClick} day={null} />
        <Separator />
        <DayFilter text="VENDREDI" onDayClick={onDayClick} day={5} />
        <Separator />
        <DayFilter text="SAMEDI" onDayClick={onDayClick} day={6} />
        <Separator />
        <DayFilter text="DIMANCHE" onDayClick={onDayClick} day={0} />
      </View>);
  }
}

class Separator extends Component {
  render() {
    return (<View style={{borderWidth:1, borderColor:'white'}}></View>)
  }
}

class DayFilter extends Component {
  static propTypes = {
      text: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {text, day, onDayClick} = this.props;
    return (<TouchableHighlight onPress={() => onDayClick(day)} style={styles.dayFilter}>
            <View>
              <Text style={styles.dayFilterText}>{text}</Text>
            </View>
          </TouchableHighlight>);
  }
}

const styles = StyleSheet.create({
  dayFilter : {
    flex:1,
    backgroundColor: 'skyblue',
    alignItems:'center',
    justifyContent:'center',
  },
  dayFilterText : {
    color: 'white'
  }
});
