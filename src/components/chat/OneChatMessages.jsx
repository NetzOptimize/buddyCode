/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React from 'react';

import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import FastImage from 'react-native-fast-image';

export default function OneChatMessages({message, viewImage}) {
  return (
    <View
      style={
        message.direction === 'right'
          ? styles.sentMessagesBubble
          : styles.receivedMessagesBubble
      }>
      {message.isText === 'True' ? (
        <View
          style={message.direction === 'right' ? styles.sent : styles.received}>
          <Text
            style={
              message.direction === 'right'
                ? styles.sentMessagesText
                : styles.receivedMessagesText
            }>
            {message.content}
          </Text>
        </View>
      ) : (
        <TouchableOpacity onPress={viewImage}>
          <FastImage
            source={{uri: message.content, priority: FastImage.priority.high}}
            style={
              message.direction === 'right'
                ? styles.sentImageMessage
                : styles.receivedImageMessage
            }
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // chat box
  sentMessagesBubble: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  receivedMessagesBubble: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  sentMessagesText: {
    fontSize: 14,
    color: '#f2f2f2',
    lineHeight: 22,
    fontFamily: 'Montserrat-Regular',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 15,
    paddingRight: 15,
  },
  sent: {
    backgroundColor: '#7879F1',
    borderRadius: 20,
  },
  receivedMessagesText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 22,
    fontFamily: 'Montserrat-Regular',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 15,
    paddingRight: 15,
  },
  received: {backgroundColor: '#f2f2f2', borderRadius: 20},
  sentImageMessage: {
    width: 240,
    height: 240,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: '#7879F1',
  },
  receivedImageMessage: {
    width: 240,
    height: 240,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: '#f2f2f2',
  },
});
