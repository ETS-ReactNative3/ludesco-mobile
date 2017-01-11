import { connect } from 'react-redux';
import ProgrammeScene from '../scenes/ProgrammeScene';
import { loadEvents, loadEvent } from '../actions/actions';
import LudescoNavigator  from '../navigation/LudescoNavigator';

var moment = require('moment');
require('moment/locale/fr');

const getEvents = (events, categories = [], day) => {
  function isInCategories(event) {
    const selectedCategories = categories.filter(([name,checked]) => checked);
    if(selectedCategories.length===0) return true;
    return selectedCategories.some(([name,checked]) => event.categories.indexOf(name) >= 0);
  }

  function isDuringDay(event) {
    if(!day && day!==0) return true;
    return moment(event.event_start_date).day()===day;
  }
  if(events) {
    return events
      .filter(isInCategories)
      .filter(isDuringDay)
      .map(e => {
          let startDate = moment(e.event_start_date);
          let endDate = moment(e.event_end_date);
          let startTime = startDate.format('HH:mm');
          let endTime = endDate.format('HH:mm');
          let day = startDate.format('dddd');
          let dayWithCap = day.charAt(0).toUpperCase() + day.slice(1);
          return Object.assign({},e,{
            startDate,
            endDate,
            day,
            dayWithCap,
            startTime,
            endTime
          });
        })
        .sort((a,b) => {
            if(moment(a.event_start_date).isBefore(moment(b.event_start_date))) {
              return -1
            } else {
              return 1;
            }
        });
  } else {
    return [];
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    events: getEvents(state.events,state.categories,state.day),
    categories : state.categories,
    day : state.day
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    beforeDisplay : function(day, categories) {
      dispatch(loadEvents(day, categories));
    },
    onEventClick : function(event) {
      dispatch(loadEvent(event.id));
      LudescoNavigator.navigateTo({title:'event', id:event.id});
    },
    onDayClick : function(day) {
      dispatch({type:'DAY_FILTER',day: day})
    }
  }
}

const ProgrammeSceneContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgrammeScene)

export default ProgrammeSceneContainer
