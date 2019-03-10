import React, { Component, PropTypes} from 'react';
import { WebView } from 'react-native';

export default class CreateAccountScene extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: ({screenProps }) => {
      return screenProps.toolbar
    }
  });
  render() {
    return (
      <WebView
        source={{uri: 'https://www.ludesco.ch/wp-login.php?action=register'}}
      />);
  }
}
