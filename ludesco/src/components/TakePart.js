import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-material-ui';
import styles from './styles';

const TakePart = (props) => {
  const { event, askSubscribe, hasReservation } = props;
  let button;
  if (hasReservation) {
    button = <Text>Vous êtes inscrit-e</Text>;
  } else {
    button = <Button style={styles.cardButton} text="S'INSCRIRE" onPress={askSubscribe} />;
  }

  const participants = `${event.participants} / ${event.ticket_spaces}`;
  return (
    <View style={styles.cardActions}>
      <Text style={styles.cardText}>
        {participants}
      </Text>
      {button}
    </View>
  );
};

export default TakePart;
