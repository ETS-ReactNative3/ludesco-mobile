import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Card } from 'react-native-material-ui';
import HTML from 'react-native-render-html';
import styles from './styles';
import TakePart from './TakePart';

const Event = (props) => {
  const {
    event,
    askSubscribe,
    askUnsubscribe,
    hasReservation,
  } = props;

  if (!event) return (<View />);
  let cardButtons;
  if (event.hasinscriptions) {
    if (event.free) {
      cardButtons = (
        <TakePart
          hasReservation={hasReservation}
          event={event}
          askSubscribe={askSubscribe}
          askUnsubscribe={askUnsubscribe}
        />
      );
    } else {
      cardButtons = <Text style={{ marginBottom: 12, fontStyle: 'italic' }}>Il n&apos;est pas possible de s&apos;inscrire à une animation payante via l&apos;application mobile. Inscris-toi sur le site internet ou à l&apos;information.</Text>;
    }
  }

  let htmlEvent;
  if (event.description) {
    htmlEvent = event.description;
    htmlEvent = htmlEvent.replace(/\r\n\r\n/g, '</p><p>').replace(/\n\n/g, '</p><p>');
    htmlEvent = htmlEvent.replace(/\r\n/g, '<br />').replace(/\n/g, '<br />');
    htmlEvent = htmlEvent.replace('<p></p>');
  } else {
    htmlEvent = '';
  }

  const eventName = event.event_name;
  return (
    <Card>
      <View style={{ padding: 12 }}>
        <Text style={styles.eventTitle}>{eventName}</Text>
        <HTML html={htmlEvent} imagesMaxWidth={Dimensions.get('window').width} />
        {cardButtons}
      </View>
    </Card>
  );
};

export default Event;
