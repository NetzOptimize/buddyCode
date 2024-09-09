/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React from 'react';

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';

// import ChatHeader from './ChatHeader';

import FastImage from 'react-native-fast-image';
import ActionButton from '../buttons/ActionButton';
import OneChatHeader from './OneChatHeader';

var close = require('../../../assets/Images/close.png');

export default function SendViewImage({
  isVisible,
  onClose,
  imageURL,
  onSend,
  ViewImage,
}) {
  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <SafeAreaView style={styles.sendIMGToUserBox}>
        <View
          style={{
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{position: 'absolute', right: 10, top: 10}}
            onPress={onClose}>
            <Image source={close} style={{width: 32, height: 32}} />
          </TouchableOpacity>
          <FastImage
            source={{uri: imageURL, priority: FastImage.priority.high}}
            style={styles.imageStyle}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        {!ViewImage && (
          <View style={styles.btnContainer}>
            <ActionButton title={'Send Image'} onPress={onSend} />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sendIMGToUserBox: {
    flex: 1,
    backgroundColor: '#3A3A3A',
    height: '100%',
  },
  header: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#F2F2F2',
    height: 56,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
  },
  imageStyle: {
    width: '90%',
    height: '70%',
    alignSelf: 'center',
    marginTop: '25%',
  },
  btnContainer: {
    position: 'absolute',
    bottom: 22,
    width: '90%',
    alignSelf: 'center',
  },
});
