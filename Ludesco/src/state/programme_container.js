import { connect } from 'react-redux'
import ProgrammeSceneContainer from '../scenes/ProgrammeScene'

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}

const ProgrammeSceneContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgrammeScene)

function fetchEvents() {
  return function(dispatch) {
    fetchJSON('public/festivals/2490/events')
        .catch((e) => {})
        .then(storeEvents)
        .then(() => {
          if(day>=0) {
            return fetchEventsByDay(day)
          } else {
            return fetchEvents();
          }
        })
  }
}

export default ProgrammeSceneContainer
