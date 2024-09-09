import {StyleSheet, Text, View, Image} from 'react-native';
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

var noDP = require('../../../assets/Images/noDP.png');

const OneChatHeader = ({goBack, name, username = null, profileImage}) => {
  const options = [
    {
      id: 1,
      title: 'View Profile',
      image: require('../../../assets/Images/profile.png'),
      action: () => {},
    },
    {
      id: 2,
      title: 'Delete Chat',
      image: require('../../../assets/Images/delete.png'),
      action: () => {},
    },
  ];

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <BackButton onPress={goBack} />
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
          <FastImage
            source={profileImage ? {uri: profileImage} : noDP}
            style={styles.dpStyle}
          />
          <View>
            <Text style={styles.name}>{name}</Text>
            {username && <Text style={styles.username}>@{username}</Text>}
          </View>
        </View>
      </View>
      <Menu style={{alignSelf: 'flex-end'}}>
        <MenuTrigger>
          <View style={{alignSelf: 'flex-end'}}>
            <Image source={optionsBtn} style={styles.menuIcon} />
          </View>
        </MenuTrigger>

        <MenuOptions
          customStyles={{
            optionsWrapper: styles.menuOptionWrapper,
            optionsContainer: styles.menuOptionContainer,
          }}>
          {options.map(data => (
            <MenuOption
              onSelect={data?.action}
              style={styles.menuOption}
              key={data?.id}>
              <Image source={data?.image} style={{width: 20, height: 20}} />
              <Text
                style={[
                  styles.popTitle,
                  {
                    color: COLORS.LIGHT,
                  },
                ]}>
                {data?.title}
              </Text>
            </MenuOption>
          ))}
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default OneChatHeader;

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
