import React, {useContext, useEffect} from 'react';
import {StyleSheet, View, Image, Text, Alert} from 'react-native';

// **3rd party imports
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import {COLORS, FONTS} from '../../../constants/theme/theme';
var optionsBtn = require('../../../../assets/Images/moreButton.png');

const TripCardOptions = () => {
  const options = [
    {
      id: 1,
      title: 'View Payments',
      image: require('../../../../assets/Images/settings/clipboard.png'),
      action: () => {},
    },
    {
      id: 2,
      title: 'Edit Event',
      image: require('../../../../assets/Images/edit.png'),
      action: () => {},
    },
    {
      id: 3,
      title: 'Delete Event',
      image: require('../../../../assets/Images/deleteEvent.png'),
      action: () => console.log('pressed'),
    },
  ];

  return (
    <Menu style={{alignSelf: 'flex-end'}}>
      <MenuTrigger>
        <Image source={optionsBtn} style={{width: 28, height: 28}} />
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
                  color: data?.id == 3 ? COLORS.ERROR : COLORS.LIGHT,
                },
              ]}>
              {data?.title}
            </Text>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  popTitle: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  menuOptionWrapper: {
    backgroundColor: COLORS.GREY_LIGHT,
    padding: 8,
    borderRadius: 10,
  },
  menuOptionContainer: {
    borderRadius: 10,
    backgroundColor: '#4E4E4E',
    width: 200,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 4,
  },
});

export default TripCardOptions;
