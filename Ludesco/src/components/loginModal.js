import React, { Component, PropTypes } from 'react';
import { Text, View, TextInput, Modal } from 'react-native';
import styles from './styles';
import { Card, Button } from 'react-native-material-design';

export class LoginModal extends Component {
  static propTypes = {
    doConnect: React.PropTypes.func.isRequired,
    onRequestClose: React.PropTypes.func.isRequired,
    modalVisible: React.PropTypes.bool.isRequired,
  }
  constructor(props) {
    super(props);
  }
  onChangeText(name, value) {
    this.setState({[name]:value});
  }
  render() {
    const { modalVisible, doConnect, onRequestClose } = this.props;
    return (<View>
        <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={onRequestClose} title="Connexion">
        <View style={{flex:1,alignItems:'center',justifyContent:'center',margin:8}}>
          <View style={{backgroundColor:'white', width:250}}>
            <View style={{padding:8}}>
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
                <Button style={{width: 20}} text="Se connecter" onPress={() => {
                  if(this.state) {
                    doConnect(this.state)}
                  }
                } />
                </View>
              </View>
          </View>
        </View>
      </Modal>
    </View>);
  }
}
