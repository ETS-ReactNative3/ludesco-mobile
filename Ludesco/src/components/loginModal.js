import React, { Component, PropTypes } from 'react';
import { Text, View, TextInput } from 'react-native';
import { InputModal } from './inputModal'
import styles from './styles';

export class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {modalVisible: false};
  }
  doConnect() {

  }
  render() {
    const { loginModalVisible } = this.props;
    const buttons = [{
                      text: "Annuler",
                      onPress: () => this.setState({modalVisible: false})
                    },
                    {
                      text: "Se connecter",
                      onPress: () => this.doConnect()
                    }];
    return (<View>
      <InputModal transparent={true} modalStyle={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center',height:200}} buttons={buttons} modalVisible={loginModalVisible} onModalClose={() => {}} title="Créer une partie">
        <View style={styles.inputBloc}>
          <Text style={styles.label}>
            Utilisateur
          </Text>
          <TextInput
            style={styles.inputText}
            onChangeText={(value) => this.onChangeText('name', value)} />
        </View>
        <View style={styles.inputBloc}>
          <Text style={styles.label}>
            Mot de passe
          </Text>
          <TextInput
            secureTextEntry={true}
            style={styles.inputText}
            onChangeText={(value) => this.onChangeText('type', value)} />
        </View>
      </InputModal>
           </View>);
  }
}
