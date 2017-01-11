import React, {Component} from 'react';
import {View, Text, Modal, Dimensions} from 'react-native';
import { connect } from 'react-redux';
import {ackwnoledgeNotification} from '../actions/actions.js';

class NotificationModal extends Component {
  static propTypes = {
    modalVisible : React.PropTypes.bool.isRequired,
    close : React.PropTypes.func.isRequired
  }
  render() {
    const {notification, modalVisible, close} = this.props;
    return <Modal animationType={"fade"} transparent={true} visible={modalVisible} onRequestClose={close}>
      <View style={{height:100,flex:1, alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
        <View style={{padding:10,height:100,width:Dimensions.get('window').width,borderWidth: 1,backgroundColor:'white'}}>
          <View>
            <Text style={{fontWeight: 'bold'}}>{notification.title}</Text>
          </View>
          <View>
            <Text>{notification.message}</Text>
          </View>
        </View>
      </View>
    </Modal>
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    notification: state.notification,
    modalVisible: state.notificationModalVisible
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    close() {
      dispatch(ackwnoledgeNotification());
    }
  }
}

const NotificationModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationModal)

export default NotificationModalContainer
