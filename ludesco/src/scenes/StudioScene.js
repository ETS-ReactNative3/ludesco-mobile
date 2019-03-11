import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

import { capitalize } from '../util/date';

const moment = require('moment');

const utcDateToString = momentInUTC => moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

const addEvent = config => AddCalendarEvent.presentNewCalendarEventDialog(config)
  .then(() => {
    // handle success (receives event id) or dismissing the modal (receives false)
  })
  .catch(() => {
    // handle error such as when user rejected permissions
  });


export default class StudioScene extends Component {
  constructor(props) {
    super(props);
    const { beforeDisplay } = this.props;
    beforeDisplay();
  }

  render() {
    const { events } = this.props;

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
        title: e['short-title'],
        startDate: utcDateToString(startDate),
        endDate: utcDateToString(endDate),
      };

      const dateString = `${capitalize(startDate.format('dddd Do MMMM YYYY'))} de ${startDate.format('HH:mm')} à ${endDate.format('HH:mm')}`;

      return (
        <TouchableHighlight
          onPress={() => addEvent(config)}
          style={{ backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#aaa' }}
        >
          <View style={{
            marginTop: 16,
            marginLeft: 16,
            marginRight: 16,
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'row',
          }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, color: 'black' }}>{e['short-title']}</Text>
              <Text>
                {dateString}
              </Text>
            </View>
            <Image style={{ width: 80, height: 80 }} source={{ uri: e.image }} />
          </View>
        </TouchableHighlight>
      );
    });

    return (
      <ScrollView>
        {cards}
      </ScrollView>
    );
  }
}
