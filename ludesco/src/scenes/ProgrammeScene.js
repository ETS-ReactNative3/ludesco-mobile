import React, { Component } from 'react';
import {
  Text,
  Image,
  View,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import { Agenda } from 'react-native-calendars';

const ICONES_MAPPING = {
  'Escape Games': require('../img/EscapeRoom.png'),
  Fablab: require('../img/Fablab.png'),
  'Espace Familles': require('../img/Familles.png'),
  'Ouvert aux familles': require('../img/Familles.png'),
  'Jeux en famille': require('../img/Familles.png'),
  Figurines: require('../img/Figurines.png'),
  'Game design &amp; Prototypes': require('../img/GameDesign.png'),
  'GNs &amp; Murder Party': require('../img/GN.png'),
  'Jeux de rôle': require('../img/JdR.png'),
  'Jeux de société': require('../img/JeuxDeSociete.png'),
  'Jeux traditionnels': require('../img/JeuxTraditionnels.png'),
  Nouveautés: require('../img/Nouveautes.png'),
};

export default class ProgrammeScene extends Component {
  constructor(props) {
    super(props);

    const {
      events,
      beforeDisplay,
      day,
      categories,
    } = this.props;

    if (events.length === 0) {
      beforeDisplay(day, categories);
    }
  }

  render() {
    const {
      events,
      navigate,
      hasReservationFor,
    } = this.props;

    return (
      <ProgrammeScrollView
        navigate={navigate}
        events={events}
        hasReservationFor={hasReservationFor}
      />
    );
  }
}


const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});

const EventView = (props) => {
  const inscriptionsView = (event) => {
    if (event.hasinscriptions) {
      if (event.free) {
        const text = `${event.participants}/${event.ticket_spaces} participants - Gratuit`;
        return <Text>{text}</Text>;
      }
      const text = `${event.participants}/${event.ticket_spaces} participants - Surtaxe`;
      return <Text>{text}</Text>;
    }
    return <Text>Sur place</Text>;
  };

  const { item, hasReservationFor, navigate } = props;
  const eventId = item.id;
  const categories = item.categories.filter(c => c !== 'Français');
  const v = ICONES_MAPPING[categories[0]];
  const time = `${item.startTime} - ${item.endTime}`;
  const categoriesString = categories.join(', ');
  return (
    <TouchableHighlight
      style={[styles.item, { height: item.height, backgroundColor: hasReservationFor(item) ? '#ccffcc' : '#ffffff' }]}
      onPress={() => navigate('Event', eventId)}
    >
      <View>
        <View style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          marginBottom: 12,
          width: '100%',
        }}
        >
          <Text style={{ fontSize: 14 }}>{time}</Text>
          <View style={{ flex: 1 }}>
            <Image style={{ width: 48, height: 48, alignSelf: 'flex-end' }} source={v} />
          </View>
        </View>
        <Text style={{ marginBottom: 12, fontSize: 16 }}>{item.event_name}</Text>
        <Text style={{ fontSize: 13, color: '#AAA' }}>{categoriesString}</Text>
        {inscriptionsView(item)}
      </View>
    </TouchableHighlight>
  );
};

const ProgrammeScrollView = (props) => {
  const {
    events,
    navigate,
    hasReservationFor,
  } = props;

  const items = events.reduce((acc, event) => {
    const d = event.startDate.format('YYYY-MM-DD');
    (acc[d] = (acc[d] || [])).push(event);
    return acc;
  }, {});

  if (!items['2018-03-16']) { items['2018-03-16'] = []; }
  if (!items['2018-03-17']) { items['2018-03-17'] = []; }
  if (!items['2018-03-18']) { items['2018-03-18'] = []; }

  return (
    <Agenda
      items={items}
      selected="2019-03-15"
      minDate="2019-03-15"
      maxDate="2019-03-17"
      renderItem={item => (
        <EventView item={item} hasReservationFor={hasReservationFor} navigate={navigate} />)}
      renderEmptyDate={() => <View />}
      renderKnob={() => <View />}
      firstDay={1}
      hideExtraDays
      rowHasChanged={(r1, r2) => r1.id !== r2.id}
      hideKnob
    />
  );
};
