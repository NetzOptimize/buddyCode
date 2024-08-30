import React, {useContext} from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';

// **3rd party imports
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

// **images
var optionsBtn = require('../../../assets/Images/moreButton.png');

// **theme
import {COLORS, FONTS} from '../../constants/theme/theme';

import {AuthContext} from '../../context/AuthContext';
import NavigationService from '../../config/NavigationService';
import {SCREENS} from '../../constants/screens/screen';

const MyOptionsBtn = () => {
  const {Logout1} = useContext(AuthContext);

  const options = [
    {
      id: 1,
      title: 'Edit Profile',
      image: require('../../../assets/Images/edit.png'),
      action: () => NavigationService.navigate(SCREENS.EDIT_PROFILE),
    },
    {
      id: 2,
      title: 'Settings',
      image: require('../../../assets/Images/settings.png'),
      action: () => NavigationService.navigate(SCREENS.PROFILE_SETTINGS),
    },
    {
      id: 3,
      title: 'Contact Us',
      image: require('../../../assets/Images/messageIcon.png'),
      action: () => console.log('pressed'),
    },
    {
      id: 4,
      title: 'Logout',
      image: require('../../../assets/Images/logout.png'),
      action: () => Logout1(),
    },
  ];

  return (
    <Menu style={{alignSelf: 'flex-end'}}>
      <MenuTrigger>
        <View style={{alignSelf: 'flex-end'}}>
          <Image source={optionsBtn} style={{width: 32, height: 32}} />
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
                {color: data?.id == 4 ? COLORS.ERROR : COLORS.LIGHT},
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
    padding: 16,
    borderRadius: 10,
  },
  menuOptionContainer: {
    borderRadius: 10,
    backgroundColor: '#4E4E4E',
    width: 180,
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

export default MyOptionsBtn;
