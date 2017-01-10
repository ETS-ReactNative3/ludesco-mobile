import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  TouchableHighlight,
  AsyncStorage,
  DrawerLayoutAndroid,
  Navigator,
  Modal,
  TextInput,
  Button
} from 'react-native';
import FCM from 'react-native-fcm';
import ProgrammeSceneContainer from '../containers/ProgrammeSceneContainer.js';
import EventSceneContainer from '../containers/EventSceneContainer.js';
import MyReservationsSceneContainer from '../containers/MyReservationsSceneContainer.js';
import CustomGamesSceneContainer from '../containers/CustomGamesSceneContainer.js';

export default class Main extends Component {
  static propTypes = {
    toolbar : React.PropTypes.element.isRequired,
    //navigator : React.PropTypes.element.isRequired,
    setNavigator : React.PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      notificationModalVisible : false,
      notification : {}
    }

    FCM.requestPermissions(); // for iOS
    this.notificationUnsubscribe = FCM.on('notification', (notif) => {
      this.setState({notification: notif, notificationModalVisible: true});
    });
    FCM.subscribeToTopic('/topics/notification');
    FCM.subscribeToTopic('/topics/games');
  }
  closeNotificationModal() {
    this.setState({notificationModalVisible: false});
  }
  openNotificationModal() {
    this.setState({notificationModalVisible: true});
  }
  render() {
    const {getNavigator, toolbar, setNavigator} = this.props;
    return <Navigator
              initialRoute={{title: 'Programme', index:0}}
              renderScene={(route, navigator) => {
                if(route.title==='event') {
                  return (<EventSceneContainer id={route.id} navigator={navigator} />)
                } else if(route.title=='myreservations') {
                  return (<MyReservationsSceneContainer navigator={navigator} />)
                } else if(route.title=='customGames') {
                  return (<CustomGamesSceneContainer navigator={navigator} />)
                } else {
                  return (<ProgrammeSceneContainer navigator={navigator} />)
                }
              }}
              configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottom}
              ref={(navigator) => {setNavigator(navigator)}}
              navigationBar={toolbar}
            />
  }
}

export class NotificationModal extends Component {
  static propTypes = {
    modalVisible : React.PropTypes.bool.isRequired,
    close : React.PropTypes.func.isRequired
  }
  render() {
    const {title, message, modalVisible, close} = this.props;
    return <Modal animationType={"fade"} transparent={false} visible={modalVisible} onRequestClose={close}>
      <View style={{height:100, flex:1, alignItems:'center', backgroundColor:'white', flexDirection:'row', justifyContent:'center'}}>
        <View>
          <Text>{title}</Text>
        <View>
        </View>
          <Text>{message}</Text>
        </View>
      </View>
    </Modal>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
