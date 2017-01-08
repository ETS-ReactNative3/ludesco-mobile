import React, { Component } from 'react';
import { Text,
         View,
         ScrollView,
         TouchableHighlight,
         Modal,
         TextInput,
         StyleSheet,
         Picker,
         ScollView } from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-material-design';
import { fetchJSON } from '../util/http';
import { InputModal } from '../components/inputModal';
import { fmtDateTime, fmtDayTime, fmtNow } from '../util/date';
import DatePicker from 'react-native-datepicker';
import { Avatar } from 'react-native-material-design';

class Game extends Component {
  render() {
    const {nb_players, name, players, start, duration, location} = this.props.game;
    const stillNeeded = nb_players - players;
    let textStillNeeded;
    let avatar;
    if(stillNeeded>0) {
      avatar = {icon: 'accessibility', color:'googleGreen'};
      textStillNeeded = <Text>{stillNeeded} joueurs recherchés</Text>
    } else {
      avatar = {icon: 'error', color:'googleRed'};
      textStillNeeded = <Text>COMPLET</Text>
    }
    return <View style={{paddingLeft: 16, paddingRight:16, marginBottom:12, flex: 1, flexDirection:'row'}}>
                      <View style={{paddingTop: 16}}>
                      <Avatar icon={avatar.icon} size={30} backgroundColor={avatar.color}/>
                      </View>
                      <View style={{flex:1, paddingLeft: 16, flexDirection:'column', justifyContent:'center'}}>
                        <Text numberOfLines={1} style={{fontWeight: 'bold'}}>{name}</Text>
                        <Text style={{fontSize: 13}}>Début : {fmtDayTime(start)}</Text>
                        <Text style={{fontSize: 13}}>Durée : {duration} minutes</Text>
                        <Text style={{fontStyle:'italic'}}>Lieu : {location}</Text>
                        <Text style={{fontWeight:'bold'}} >{textStillNeeded}</Text>
                      </View>
                  </View>;
  }
}

export default class CustomGamesScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {
        nbplayers : "3",
        duration : "30-60",
        start : fmtNow(),
        weare : 1
      },
      subscription : {

      },
      createGameModalVisible : false,
      subscribeModalVisible : false,
    };
  }
  openCreateCustomGameModal() {
    this.setState({createGameModalVisible:true});
  }
  closeCreateCustomGameModal() {
    this.setState({createGameModalVisible:false});
  }
  openSubscribeModal(game) {
    const {device} = this.props;
    const weare = game.subscriptions[device] || 1;
    this.setState({
      selectedGame : game,
      subscription: {weare : weare},
      subscribeModalVisible:true
    });
  }
  closeSubscribeModal() {
    this.setState({
      selectedGame: {},
      subscribeModalVisible:false
    });
  }
  onSubscriptionChanged(subscription) {
    this.setState({subscription:subscription});
  }
  onChangeText(field, value) {
    let game = this.state.game;
    game[field] = value;
    this.setState({game : game})
  }
  render() {
    const {games, createGame, subscribe, device, deleteGame} = this.props;
    const {createGameModalVisible, subscribeModalVisible, game, subscription, selectedGame} = this.state;

    const childrens = games.map((e,i) => {
      return <TouchableHighlight style={{marginRight:16, marginLeft:16}} key={i} onPress={() => this.openSubscribeModal(e)}>
                <View>
                  <Game game={e} />
                </View>
              </TouchableHighlight>
    });

    return <View style={{flex:1}}>
            <CreateCustomGameModal
              onChangeText={(field,value) => this.onChangeText(field,value)}
              game={game}
              device={device}
              visible={createGameModalVisible}
              onClose={() => this.closeCreateCustomGameModal()}
              createGame={createGame} />
            <SubscribeModal
              onChange={(subscription) => this.onSubscriptionChanged(subscription)}
              game={selectedGame}
              device={device}
              subscription={subscription}
              subscribe={subscribe}
              game={game}
              deleteGame={deleteGame}
              selectedGame={selectedGame}
              visible={subscribeModalVisible}
              onClose={() => this.closeSubscribeModal()} />
            <ScrollView style={{marginTop:70}}>
              {childrens}
            </ScrollView>
            <ActionButton buttonColor="rgba(231,76,60,1)" onPress={() => this.openCreateCustomGameModal()}>
          </ActionButton>
          </View>
  }
}

class SubscribeModal extends Component {
  render() {
    const {
      onClose,
      visible,
      selectedGame,
      subscription,
      device,
      onChange,
      remove,
      subscribe,
      deleteGame} = this.props;

      let buttons= [];
      if(selectedGame && device==selectedGame.device) {
        title = "Finalement nous sommes";
        buttons = [{
                          text: "MODIFIER",
                          onPress: () => subscribe({game_id:selectedGame.id,device:device,weare:subscription.weare}).then(onClose)
                       },
                       {
                          text: "SUPPRIMER",
                          onPress: () => deleteGame(selectedGame).then(onClose)
        }];
      } else {
        title = "Ca m'intéresse";
        buttons = [{
                          text: "S'INSCRIRE",
                          onPress: () => subscribe({game_id:selectedGame.id,device:device,weare:subscription.weare}).then(onClose)
                       },
                       {
                          text: "ANNULER",
                          onPress: () => onClose()
                        }];
      }
    return <InputModal
            buttons={buttons}
            modalVisible={visible}
            onModalClose={onClose}
            title={title}>
              <WeArePicker
                style={styles.inputText}
                weare={subscription.weare}
                onWeAreChanged={(value) => onChange({game_id: selectedGame.id,weare:value})} />
          </InputModal>;
  }
}

class CreateCustomGameModal extends Component {
  render() {
    const {onChangeText, onClose, createGame, visible, game, device} = this.props;

    let buttons = [{
                      text: "CREER",
                      onPress: () => createGame(game, device).then(onClose)
                   },
                   {
                      text: "ANNULER",
                      onPress: () => onClose()
                    }];

    return <InputModal
        buttons={buttons}
        modalVisible={visible}
        onModalClose={onClose}
        title="Créer une partie">
      <View style={styles.inputBloc}>
        <Text style={styles.label}>
          Nom du jeu
        </Text>
        <TextInput
          autoFocus={true}
          style={styles.inputText}
          onChangeText={(value) => onChangeText('name', value)} />
      </View>
      <View style={styles.inputBloc}>
        <Text style={styles.label}>
          Quand
        </Text>
        <GameWhenPicker
          when={game.start}
          onGameWhenChanged={(value) => onChangeText('start', value)} />
      </View>
        <View style={styles.inputBloc}>
          <Text style={styles.label}>
            Nombre de joueurs
          </Text>
          <NbPlayersPicker
            style={styles.inputText}
            nbPlayers={game.nbplayers}
            onNbPlayersChanged={(value) => onChangeText('nbplayers', value)} />
        </View>

        <View style={styles.inputBloc}>
          <Text style={styles.label}>
            Durée (heures)
          </Text>
          <GameDurationPicker
            style={styles.inputText}
            duration={game.duration}
            onPlayerDurationChanged={(value) => onChangeText('duration', value)} />
        </View>

        <View style={styles.inputBloc}>
          <Text style={styles.label}>
            Où
          </Text>
          <TextInput
            style={styles.inputText}
            onChangeText={(value) => onChangeText('location', value)} />
        </View>

        <View style={styles.inputBloc}>
          <Text style={styles.label}>
            Je suis / Nous sommes
          </Text>
          <WeArePicker
            style={styles.inputText}
            weare={game.weare}
            onWeAreChanged={(value) => onChangeText('weare', value)} />
        </View>
    </InputModal>
  }
}

class WeArePicker extends Component {
  render() {
    const {onWeAreChanged, weare} = this.props;
    return <Picker
      selectedValue={weare}
      onValueChange={(weare) => onWeAreChanged(weare)}>
        <Picker.Item label="1" value="1" />
        <Picker.Item label="2" value="2" />
        <Picker.Item label="3" value="3" />
        <Picker.Item label="4" value="4" />
        <Picker.Item label="5" value="5" />
      </Picker>
  }
}

class NbPlayersPicker extends Component {
  render() {
    const {onNbPlayersChanged, nbPlayers} = this.props;
    return <Picker
      selectedValue={nbPlayers}
      onValueChange={(nbPlayers) => onNbPlayersChanged(nbPlayers)}>
        <Picker.Item label="2 joueurs" value="2" />
        <Picker.Item label="3 joueurs" value="3" />
        <Picker.Item label="4 joueurs" value="4" />
        <Picker.Item label="5 joueurs" value="5" />
        <Picker.Item label="6 joueurs" value="6" />
        <Picker.Item label="10 joueurs" value="10" />
        <Picker.Item label="20 joueurs" value="20" />
      </Picker>
  }
}

class GameDurationPicker extends Component {
  render() {
    const {onPlayerDurationChanged, duration} = this.props;
    return <Picker
      selectedValue={duration}
      onValueChange={(duration) => onPlayerDurationChanged(duration)}>
        <Picker.Item label="0-30 minutes" value="0-30" />
        <Picker.Item label="30-60 minutes" value="30-60" />
        <Picker.Item label="60-120 minutes" value="60-120" />
        <Picker.Item label="120-240 minutes" value="120-240" />
        <Picker.Item label="+240 minutes" value="+240" />
      </Picker>
  }
}

class GameWhenPicker extends Component {
  render() {
    const {onGameWhenChanged, when} = this.props;
    return <DatePicker
      format="DD.MM.YYYY HH:mm"
      showIcon={false}
      date={when}
      onDateChange={(date) => onGameWhenChanged(date)}
      customStyles={{
          dateText: styles.inputText
      }}
      mode="datetime" />;
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
