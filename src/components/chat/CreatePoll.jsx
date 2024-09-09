/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  SafeAreaView,
  TextInput,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import React, {useState, useContext} from 'react';
import {AuthContext} from '../../context/AuthContext';

var dropIcon = require('../../../assets/Images/dropIcon.png');

function CreatePoll({
  isPollVisible,
  onChangeQuestion,
  onChangeOptions,
  optionsValue,
  onCancel,
  onSubmit,
}) {
  const {pollType, setPollType} = useContext(AuthContext);

  const [openDropDown, setOpenDown] = useState(false);

  return (
    <Modal transparent visible={isPollVisible}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.body}>
          <View style={styles.container}>
            <Text style={styles.header}>Create a poll</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Question</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Type your question here"
                placeholderTextColor={'#C0C0C0'}
                onChangeText={onChangeQuestion}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Question Type</Text>
              <TouchableOpacity
                onPress={() => {
                  if (openDropDown) {
                    setOpenDown(false);
                    setPollType('Question type');
                  } else {
                    setOpenDown(true);
                  }
                }}
                style={[
                  styles.dropDownStyle,
                  {
                    borderRadius: 10,
                    borderBottomLeftRadius: openDropDown ? 0 : 10,
                    borderBottomRightRadius: openDropDown ? 0 : 10,
                  },
                ]}>
                <Text style={styles.dropDownText}>{pollType}</Text>
                <Image source={dropIcon} style={styles.dropIconStyle} />
              </TouchableOpacity>

              <View
                style={[
                  styles.pickOption,
                  {display: openDropDown ? 'flex' : 'none'},
                ]}>
                <View style={styles.hr} />
                <TouchableOpacity
                  style={[styles.dropDownStyle]}
                  onPress={() => {
                    setOpenDown(false);
                    setPollType('Single choice');
                  }}>
                  <Text style={styles.dropDownText}>Single choice</Text>
                </TouchableOpacity>
                <View style={styles.miniHR} />
                <TouchableOpacity
                  style={[styles.dropDownStyle]}
                  onPress={() => {
                    setOpenDown(false);
                    setPollType('Multiple choice');
                  }}>
                  <Text style={styles.dropDownText}>Multiple choice</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={[
                styles.inputContainer,
                {display: openDropDown ? 'none' : 'flex'},
              ]}>
              <Text style={styles.label}>Enter choices below</Text>
              <View style={styles.inputmultContainer}>
                <TextInput
                  style={styles.input2}
                  multiline={true}
                  onChangeText={onChangeOptions}
                  value={optionsValue}
                  placeholder="Use comma to separate choice"
                  placeholderTextColor={'#C0C0C0'}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.sendBtn} onPress={onSubmit}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '92%',
    backgroundColor: '#4F4F4F',
    height: 520,
    borderRadius: 12,
    padding: 16,
  },
  header: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#F2F2F2',
    marginTop: 10,
  },
  inputContainer: {
    marginTop: 10,
    width: '96%',
    alignSelf: 'center',
  },
  label: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#F2F2F2',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  inputField: {
    backgroundColor: '#333333',
    height: 48,
    width: '100%',
    borderRadius: 10,
    fontFamily: 'Montserrat-Regular',
    padding: 10,
    fontSize: 15,
    color: '#F2F2F2',
  },
  input2: {
    width: '100%',
    borderRadius: 10,
    alignSelf: 'center',
    maxHeight: 110,
    minHeight: 40,
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    padding: 10,
    color: '#F2F2F2',
  },
  inputmultContainer: {
    backgroundColor: '#333333',
    borderRadius: 10,
    height: 100,
  },
  sendBtn: {
    backgroundColor: '#7879F1',
    height: 44,
    width: '96%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 34,
  },
  sendText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    color: '#F2F2F2',
  },
  cancelBtn: {
    backgroundColor: '#F2F2F2',
    height: 44,
    width: '96%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 12,
  },
  cancelText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    color: 'black',
  },
  dropDownStyle: {
    backgroundColor: '#333333',
    height: 48,
    width: '100%',
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropDownText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: '#F2F2F2',
  },

  dropDownStyle2: {
    backgroundColor: '#333333',
    height: 48,
    width: '88%',
    borderRadius: 10,
    justifyContent: 'center',
    padding: 10,
    alignSelf: 'center',
  },
  pickOption: {
    width: '100%',
    alignSelf: 'center',
    height: 135,
    justifyContent: 'center',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: -10,
    borderTopRightRadius: -10,
    backgroundColor: '#333333',
  },
  dropIconStyle: {
    width: 24,
    height: 24,
  },
  miniHR: {
    width: '95%',
    borderColor: '#828282',
    borderTopWidth: 1,
    alignSelf: 'center',
  },
  hr: {
    width: '100%',
    borderColor: 'white',
    borderTopWidth: 1,
    alignSelf: 'center',
  },
});

export default CreatePoll;
