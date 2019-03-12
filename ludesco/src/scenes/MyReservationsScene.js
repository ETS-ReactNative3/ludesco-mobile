import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import LoginModal from '../components/LoginModal';

const moment = require('moment');

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


export default class MyReservationsScene extends Component {
  constructor(props) {
    super(props);
    const { isConnected } = props;
    this.state = {
      loginModalVisible: !isConnected,
    };
  }

  doConnect(user) {
    const { doConnect } = this.props;
    doConnect(user).then((r) => {
      if (r) {
        setTimeout(() => {
          this.closeLoginModal();
        }, 500);
      }
      return r;
    });
  }

  closeLoginModal() {
    this.setState({ loginModalVisible: false });
  }

  render() {
    const {
      reservations,
      navigate,
    } = this.props;

    const { loginModalVisible } = this.state;

    const items = reservations.reduce((acc, reservation) => {
      const d = moment(reservation.event_start_date).format('YYYY-MM-DD');
      (acc[d] = (acc[d] || [])).push(reservation);
      return acc;
    }, {});
    if (!items['2019-03-15']) { items['2019-03-15'] = []; }
    if (!items['2019-03-16']) { items['2019-03-16'] = []; }
    if (!items['2019-03-17']) { items['2019-03-17'] = []; }

    const eventView = (item) => {
      const eventId = item.event_id;
      const startDate = moment(item.event_start_date);
      const endDate = moment(item.event_end_date);
      const startTime = startDate.format('HH:mm');
      const endTime = endDate.format('HH:mm');
      const time = `${startTime} - ${endTime}`;

      return (
        <TouchableHighlight
          style={[styles.item, { height: item.height, backgroundColor: '#ffffff' }]}
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
            </View>
            <Text style={{ marginBottom: 12, fontSize: 16 }}>{item.event_name}</Text>
          </View>
        </TouchableHighlight>
      );
    };

    return (
      <View style={{ flex: 1 }}>
        <LoginModal
          onRequestClose={() => {
            this.closeLoginModal();
            navigate('Programme');
          }}
          onCreateAccount={() => {
            this.closeLoginModal();
            navigate('CreateAccount');
          }}
          doConnect={user => this.doConnect(user)}
          modalVisible={loginModalVisible}
        />
        <Agenda
          items={items}
          loadItemsForMonth={() => {}}
          onDayPress={() => {}}
          onDayChange={() => {}}
          selected="2019-03-15"
          minDate="2019-03-15"
          maxDate="2019-03-17"
          pastScrollRange={50}
          futureScrollRange={200}
          renderItem={eventView}
          renderEmptyDate={() => (<View />)}
          renderKnob={() => (<View />)}
          firstDay={1}
          hideExtraDays
          rowHasChanged={() => true}
          hideKnob
          theme={{}}
          style={{}}
        />
      </View>
    );
  }
}
