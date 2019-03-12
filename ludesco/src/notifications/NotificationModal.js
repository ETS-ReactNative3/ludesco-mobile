import React from 'react';
import {
  View,
  Text,
  Modal,
  Dimensions,
} from 'react-native';
import { Button } from 'react-native-material-ui';
import { connect } from 'react-redux';

const NotificationModal = (props) => {
  const {
    notification,
    modalVisible,
    close,
    onClick,
  } = props;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={close}
    >
      <View
        style={{
          height: 100,
          flex: 1,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <View style={{
          padding: 10,
          height: 100,
          width: Dimensions.get('window').width,
          borderWidth: 1,
          backgroundColor: 'white',
        }}
        >
          <View>
            <Text style={{ fontWeight: 'bold' }}>{notification.title}</Text>
          </View>
          <View>
            <Text>{notification.message}</Text>
          </View>
          <View>
            <Button style={{ width: 20 }} text="OK" onPress={onClick} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const mapStateToProps = state => ({
  notification: state.notification,
  modalVisible: state.notificationModalVisible,
});

const mapDispatchToProps = () => ({});

const NotificationModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationModal);

export default NotificationModalContainer;
