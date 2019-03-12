import React from 'react';
import { Button } from 'react-native-material-ui';
import {
  Text,
  View,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 20,
  },
  title: {
    marginTop: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
  },
  cardActions: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
  },
  cardButton: {
    width: 100,
  },
  cardText: {
    paddingLeft: 16,
    fontStyle: 'italic',
  },
});


const InputModal = (props) => {
  const {
    modalVisible,
    title,
    onModalClose,
    buttons,
    transparent,
    children,
  } = props;

  const tr = transparent || false;
  let inc = 0;
  const btns = buttons.map((b) => {
    inc += 1;
    return <Button key={inc} style={{ width: 20 }} text={b.text} onPress={b.onPress} />;
  });

  return (
    <Modal animationType="fade" transparent={tr} visible={modalVisible} onRequestClose={() => onModalClose()}>
      <ScrollView>
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>{title}</Text>
            {children}
            <View style={styles.cardActions}>
              {btns}
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default InputModal;
