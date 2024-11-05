import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import BackButton from '../buttons/BackButton';
import {COLORS, FONTS} from '../../constants/theme/theme';

// **3rd party imports
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

// **images
var optionsBtn = require('../../../assets/Images/moreButton.png');

var noDP = require('../../../assets/Images/noGroupPic.png');

const GroupChatHeader = ({
  goBack,
  name,
  memberCount,
  profileImage,
  onViewTrip,
}) => {

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <BackButton onPress={goBack} />
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', gap: 16}}
          onPress={onViewTrip}>
          <FastImage
            source={profileImage ? {uri: profileImage} : noDP}
            style={styles.dpStyle}
          />
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.username}>
              {memberCount} {memberCount > 1 ? 'Buddies' : 'Buddy'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GroupChatHeader;

const styles = StyleSheet.create({
  dpStyle: {width: 48, height: 48, borderRadius: 1000},
  name: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  username: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
    color: COLORS.VISION,
  },
  menuIcon: {width: 32, height: 32, transform: [{rotate: '90deg'}]},
  container: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomColor: COLORS.LIGHT,
    backgroundColor: COLORS.GREY_DARK
  },
  popTitle: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  menuOptionWrapper: {
    backgroundColor: COLORS.GREY_LIGHT,
    padding: 16,
    borderRadius: 10,
  },
  menuOptionContainer: {
    borderRadius: 10,
    backgroundColor: '#4E4E4E',
    width: 160,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 4,
    marginTop: 10,
    marginBottom: 10,
  },
});
