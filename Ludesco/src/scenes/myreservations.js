import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableHighlight, TextInput, Modal } from 'react-native';
import { Button } from 'react-native-material-design';
import { fetchJSON } from '../util/http';
import store, { isConnected } from '../state/container.js';

const base64 = require('base-64');

export default class MyReservationsScene extends Component {
  constructor(props) {
    super(props)
    this.state = {reservations: []};

    if(isConnected()) {
      this.fetchReservations();
    } else {
      let auth = "Basic " + base64.encode("arnaud:MarXheroes4");
      let headers = new Headers();
      headers.append('Authorization', auth)
      headers.append('Content-Type', 'application/json')
      this.headers = headers;
      let body = {username : "arnaud", password : "MarXheroes4"};
      fetchJSON('public/secured/login', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers})
        .then(o => this.fetchReservations(o.id))
        .then(reservations => this.setState({reservations}));
    }
  }
  fetchReservations(userId) {
    return fetchJSON(`public/secured/users/${userId}/reservations`,{method:'GET',headers:this.headers});
  }
  onLongPress() {
    alert('Long Press');
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  login() {
    store.dispatch({type:'LOGIN',loginId:this.state.text});
    if(isConnected()) {
      this.fetchReservations(store.getState().loginId);
    }
  }
  render() {
    return <ScrollView style={{marginTop: 70}}>
        <Modal animationType={"fade"} transparent={true} visible={false} onRequestClose={() => this.setState({modalVisible: false})}>
          <View style={{height:100, flex:1, alignItems:'center', flexDirection:'row', justifyContent:'center'}}>
            <View style={{backgroundColor: 'white',paddingLeft:24, paddingRight:24,paddingTop: 22}}>
              <Text style={{marginTop:24,marginBottom:20, fontWeight: 'bold'}}>Connexion</Text>
              <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text} />
              <View style={{marginTop:24, paddingTop:8, height:52}}>
                <View>
                  <Button style={{width:20}} text="S'INSCRIRE" onPress={() => {this.login()}} />
                  <Button style={{width:20}} text="S'INSCRIRE" onPress={() => {this.setState({modalVisible: false})}} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
          {this.state.reservations.slice(0,20).map((e,i) => {
            return <TouchableHighlight key={i} onPress={() => alert(i)} onLongPress={() => this.onLongPress()}>
                <View style={{flex:1,flexDirection:'column',justifyContent:'center',height:72,marginLeft:16,marginRight:16}}>
                  <Text style={{fontWeight:'bold'}}>{e.event_name}</Text>
                  <Text>{e.booking_spaces} place(s)</Text>
                </View>
              </TouchableHighlight>
          })}
        </ScrollView>
  }
}
