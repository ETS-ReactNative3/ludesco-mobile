import React, { Component, PropTypes } from 'react';
import { Button } from 'react-native-material-design';
import { Text, View, ScrollView, TouchableHighlight, TextInput, Modal, StyleSheet, Picker } from 'react-native';

export class InputModal extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    modalVisible: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func,
    title : PropTypes.string.isRequired,
    buttons : PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string,
      onPress: PropTypes.func
    })).isRequired
  }
  render() {
    const {modalVisible, title, onModalClose, buttons, modalStyle, transparent} = this.props;
    const ms = modalStyle || styles.modalView;
    const tr = transparent || false;
    let btns = buttons.map((b, i) => {
      return <Button key={i} style={{width: 20}} text={b.text} onPress={b.onPress} />
    });
    return (<Modal animationType={"fade"} transparent={tr} visible={modalVisible} onRequestClose={() => onModalClose()} >
        <ScrollView>
        <View style={styles.modalView}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          {this.props.children}
          <View style={styles.cardActions}>
            {btns}
          </View>
        </View>
        </View>
        </ScrollView>
    </Modal>);
  }
}

const styles = StyleSheet.create({
  modalView : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContent : {
    backgroundColor: 'white',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop : 20
  },
  title : {
    marginTop: 24,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  textInput : {
    borderColor: 'gray',
    borderWidth: 1
  },
  cardActions : {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'flex-end'
  },
  cardButton : {
    width : 100
  },
  cardText : {
    paddingLeft: 16,
    fontStyle: 'italic'
  }
})
