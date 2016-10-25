  import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableHighlight, Modal, TextInput, StyleSheet, Picker, ScollView } from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-material-design';
import { fetchJSON } from '../util/http';
import { InputModal } from '../components/inputModal';
import DatePicker from 'react-native-datepicker';

class Game extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {nb_players, name} = this.props.game;
    return <View>
      <Text style={{fontWeight:'bold'}}>{name}</Text>
      <Text>Joueurs : 2/{nb_players} | Durée : 4 heures</Text>
      <Text style={{fontStyle:'italic'}}>Dans un coin</Text>
    </View>
  }
}

export default class CustomGamesScene extends Component {
  constructor(props) {
    super(props);
    this.state = {games: [], subscribeModalVisible: false, game: {}}
    fetchJSON('public/games').then((games) => {
      this.setState({games});
    });
  }
  openSubscribeModal() {
    this.setState({subscribeModalVisible:true});
  }
  closeSubscribeModal() {
    this.setState({subscribeModalVisible:false});
  }
  onChangeText(field, value) {
    let game = this.state.game;
    game[field] = value;
    this.setState({game : game})
  }
  createGame(game) {
    fetchJSON("public/games", {
      method: 'POST',
      body : JSON.stringify(game)
    }).catch((rej) => {
      console.warn(rej);
    });
  }
  render() {
    const {subscribeModalVisible, game} = this.state;
    let buttons = [{
                      text: "CREER",
                      onPress: () => this.createGame(game)},
                   {
                      text: "ANNULER",
                      onPress: () => this.closeSubscribeModal()
                    }];
    return <View style={{flex:1}}>
            <InputModal buttons={buttons} modalVisible={subscribeModalVisible} onModalClose={() => this.closeSubscribeModal()} title="Créer une partie">
              <View style={styles.inputBloc}>
                <Text style={styles.label}>
                  Nom du jeu
                </Text>
                <TextInput
                  style={styles.inputText}
                  onChangeText={(value) => this.onChangeText('name', value)} />
              </View>
              <View style={styles.inputBloc}>
                <Text style={styles.label}>
                  Type de jeu
                </Text>
                <TextInput
                  style={styles.inputText}
                  onChangeText={(value) => this.onChangeText('type', value)} />
              </View>
                <View style={styles.inputBloc}>
                  <Text style={styles.label}>
                    Nombre de joueurs
                  </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={(value) => this.onChangeText('nbplayers', value)} />
                </View>
                <View style={styles.inputBloc}>
                  <Text style={styles.label}>
                    Durée (heures)
                  </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={(value) => this.onChangeText('duration', value)} />
                </View>
            </InputModal>
            <ScrollView style={{marginTop:70}}>
              {this.state.games.map((e,i) => {
                return <TouchableHighlight style={{marginRight:16, marginLeft:16}} key={i} onPress={() => this.openSubscribeModal()}>
                          <View>
                            <Game game={e} />
                          </View>
                        </TouchableHighlight>
              })}
            </ScrollView>
            <ActionButton buttonColor="rgba(231,76,60,1)" onPress={() => this.openSubscribeModal()}>
          </ActionButton>
          </View>
  }
}

const styles = StyleSheet.create({
  inputBloc : {
    height: 90
  },
  inputText : {
    fontSize: 13
  },
  label : {
    fontSize: 12
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
