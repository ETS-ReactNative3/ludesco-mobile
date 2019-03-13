import { connect } from 'react-redux';
import Fuse from 'fuse.js';
import { createSelector } from 'reselect';
import ProgrammeScene from '../scenes/ProgrammeScene';
import { loadEvents, loadEvent } from '../actions/actions';

const moment = require('moment');
require('moment/locale/fr');

const getEvents = createSelector(
  [state => state.events, state => state.profile.categories, state => state.search],
  (events, categories = [], search = '') => {
    function isInCategories(event) {
      const selectedCategories = categories.filter(c => c.checked);
      if (selectedCategories.length === 0) return true;
      return selectedCategories.some(sc => event.categories.indexOf(sc.name.replace('&', '&amp;')) >= 0);
    }

    if (events) {
      const filteredEvents = events
        .filter(isInCategories)
        .map((e) => {
          const startDate = moment(e.event_start_date);
          const endDate = moment(e.event_end_date);
          const startTime = startDate.format('HH:mm');
          const endTime = endDate.format('HH:mm');
          const day = startDate.format('dddd');
          const dayWithCap = day.charAt(0).toUpperCase() + day.slice(1);
          return Object.assign({}, e, {
            startDate,
            endDate,
            day,
            dayWithCap,
            startTime,
            endTime,
          });
        })
        .sort((a, b) => {
          if (moment(a.event_start_date).isBefore(moment(b.event_start_date))) {
            return -1;
          }
          return 1;
        });

      if (search) {
        const result = new Fuse(filteredEvents, {
          shouldSort: false,
          tokenize: true,
          threshold: 0.1,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: ['event_name'],
        }).search(search);

        return result;
      }
      return filteredEvents;
    }
    return [];
  },
);

const mapStateToProps = state => ({
  events: getEvents(state),
  categories: state.profile.categories,
  day: state.day,
  search: state.search,
  reservations: state.profile.reservations,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  beforeDisplay(day, categories) {
    dispatch(loadEvents(day, categories));
  },
  onDayClick(day) {
    dispatch({ type: 'DAY_FILTER', day });
  },
  navigate(routeName, eventId) {
    dispatch(loadEvent(eventId)).then(() => {
      ownProps.navigation.navigate(routeName, { eventId });
    });
  },
});

const mergeProps = (state, dispatch, ownProps) => Object.assign({}, ownProps, state, dispatch, {
  hasReservationFor: (item) => {
    if (!state.reservations) {
      return false;
    }
    return state.reservations.some(r => item.id === r.event_id);
  },
});

const ProgrammeSceneContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(ProgrammeScene);

export default ProgrammeSceneContainer;
