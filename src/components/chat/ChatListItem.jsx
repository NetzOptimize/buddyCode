/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, {useContext} from 'react';

import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {AuthContext} from '../../context/AuthContext';
import FastImage from 'react-native-fast-image';
import {COLORS, FONTS} from '../../constants/theme/theme';

var bpLogo = require('../../../assets/Images/noGroupPic.png');
var noDp = require('../../../assets/Images/noDP.png');

export default function ChatListItem({chatData, ...allProps}) {
  const {myUserDetails} = useContext(AuthContext);

  const getUserName = chatData => {
    if (chatData?.chatType === 'group') {
      const groupName = chatData?.group_name;
      return groupName?.length > 12
        ? groupName?.slice(0, 12) + '...'
        : groupName;
    } else {
      const isCurrentUserSender =
        myUserDetails?.user?._id === chatData?.from_user_id;
      const user = isCurrentUserSender
        ? chatData?.to_user
        : chatData?.from_user;

      if (user.status == 'inactive' || user.is_deleted) {
        return 'Buddypass User';
      }
      return `${user?.first_name} ${user?.last_name}`;
    }
  };

  const renderUserCounts = () => {
    return chatData?.message_count
      .filter(
        myCount =>
          myCount?.userId === myUserDetails?.user?._id && myCount?.count !== 0,
      )
      .map((myCount, k) => (
        <View
          key={k}
          style={{
            borderRadius: 1000,
            backgroundColor: '#7879F1',
          }}>
          <Text style={styles.count}>{myCount?.count}</Text>
        </View>
      ));
  };

  const getProfileImageSource = () => {
    if (chatData?.chatType === 'group') {
      return chatData?.profileImage ? {uri: chatData?.profileImage} : bpLogo;
    } else {
      const isCurrentUserSender =
        myUserDetails?.user?._id === chatData?.from_user_id;
      const profileImage = isCurrentUserSender
        ? chatData?.to_user?.profile_image
        : chatData?.from_user?.profile_image;
      const user = isCurrentUserSender
        ? chatData?.to_user
        : chatData?.from_user;

      if (user.status == 'inactive' || user.is_deleted) {
        return noDp;
      }

      return profileImage ? {uri: profileImage} : noDp;
    }
  };

  const formatTime = () => {
    if (!chatData?.last_message_time) {
      return null;
    }

    const lastMessageDate = new Date(chatData?.last_message_time);
    const currentDate = new Date();

    if (lastMessageDate?.toDateString() === currentDate?.toDateString()) {
      return lastMessageDate?.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      });
    } else {
      const createdAtDate = new Date(chatData?.created_at);
      if (createdAtDate?.toDateString() === currentDate?.toDateString()) {
        return createdAtDate?.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        });
      } else {
        return createdAtDate?.toDateString();
      }
    }
  };

  return (
    <TouchableOpacity style={styles.chatContainer} {...allProps}>
      <FastImage
        source={getProfileImageSource()}
        style={styles.chatDP}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View
        style={{
          width: '50%',
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        <Text style={styles.name}>{getUserName(chatData)}</Text>
        <Text style={styles.message}>
          {chatData?.chatType === 'group'
            ? `${
                chatData?.last_message_sender == undefined
                  ? `@${
                      chatData?.owner.username
                    } created a new Trip "${getUserName(chatData)}"`
                  : '@' + chatData?.last_message_sender + ':'
              } ${
                chatData?.last_message == null
                  ? ''
                  : chatData?.last_message?.length > 35
                  ? chatData?.last_message?.slice(0, 35) + '...'
                  : chatData?.last_message
              }`
            : chatData?.lastMessageDate?.length > 35
            ? chatData?.lastMessageDate?.slice(0, 45) + '...'
            : chatData?.last_message}
        </Text>
      </View>
      <View style={styles.dateCountBox}>
        <Text style={styles.time}>{formatTime()}</Text>
        {renderUserCounts()}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    marginTop: 12,
    marginBottom: 12,
  },
  chatDP: {width: 49, height: 49, borderRadius: 1000},
  name: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.LIGHT,
    lineHeight: 16,
  },
  message: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 10,
    color: COLORS.LIGHT,
    lineHeight: 12,
    marginTop: 4,
  },
  time: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 10,
    color: COLORS.LIGHT,
    lineHeight: 16,
  },
  count: {
    paddingTop: 2,
    paddingBottom: 2,

    fontSize: 10,
    fontFamily: FONTS.MAIN_SEMI,
    color: COLORS.LIGHT,
    paddingLeft: 8,
    paddingRight: 8,
  },
  dateCountBox: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingTop: 2,
    paddingBottom: 2,
    width: '30%',
  },
});
