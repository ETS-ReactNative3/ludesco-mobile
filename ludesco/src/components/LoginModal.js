import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { Button } from 'react-native-material-ui';

export default class LoginModal extends Component {
  onChangeText(name, value) {
    this.setState({ [name]: value });
  }

  render() {
    const {
      modalVisible,
      doConnect,
      onRequestClose,
      onCreateAccount,
    } = this.props;

    return (
      <View>
        <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={onRequestClose} title="Connexion">
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 8,
          }}
          >
            <View style={{ backgroundColor: 'white', width: 250 }}>
              <View style={{ padding: 8 }}>
                <Text>Utilisateur</Text>
                <TextInput
                  onChangeText={value => this.onChangeText('username', value)}
                  style={Platform.select({ ios: { height: 40, borderColor: 'gray', borderWidth: 1 } })}
                />
                <Text>Mot de passe</Text>
                <TextInput
                  autoCorrect={false}
                  style={Platform.select({ ios: { height: 40, borderColor: 'gray', borderWidth: 1 } })}
                  secureTextEntry
                  onChangeText={value => this.onChangeText('password', value)}
                />
                <Text>
                  Pour obtenir un identifiant, va créer un compte sur
                  <Text style={{ color: 'blue' }} onPress={() => onCreateAccount()}>le site de Ludesco</Text>
                </Text>
                <View>
                  <Button
                    style={{ width: 20 }}
                    text="Se connecter"
                    onPress={() => {
                      if (this.state) {
                        doConnect(this.state);
                      }
                    }
                } />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
