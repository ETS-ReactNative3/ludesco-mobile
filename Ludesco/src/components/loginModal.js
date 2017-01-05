import React, { Component, PropTypes } from 'react';
import { Text, View, TextInput, Modal } from 'react-native';
import styles from './styles';
import { Card, Button } from 'react-native-material-design';

export class LoginModal extends Component {
  constructor(props) {
    super(props);
  }
  onChangeText(name, value) {
    this.setState({[name]:value});
  }
  render() {
    const { modalVisible } = this.props;
    return (<View>
        <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => {}} title="Connexion">
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
          <View style={{width:300,backgroundColor:'green'}}>
            <Text>
              Utilisateur
            </Text>
            <TextInput
              onChangeText={(value) => this.onChangeText('username', value)} />
            <Text>
              Mot de passe
            </Text>
            <TextInput
              secureTextEntry={true}
              onChangeText={(value) => this.onChangeText('password', value)} />
              <View>
                <Button style={{width: 20}} text="Se connecter" onPress={() => this.props.doConnect(this.state)} />
              </View>
          </View>
        </View>
      </Modal>
    </View>);
  }
}
