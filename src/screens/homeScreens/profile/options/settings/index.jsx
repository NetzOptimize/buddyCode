import React, {useContext} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RegularBG from '../../../../../components/background/RegularBG';
import BackButton from '../../../../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../../../../constants/theme/theme';
import {AuthContext} from '../../../../../context/AuthContext';
import {SCREENS} from '../../../../../constants/screens/screen';

var arrow = require('../../../../../../assets/Images/arrowGrey.png');

const ProfileSettings = ({navigation}) => {
  const {Logout1} = useContext(AuthContext);

  const SettingsMenu = [
    {
      id: 0,
      name: 'Privacy Settings',
      image: require('../../../../../../assets/Images/settings/lock.png'),
      actions: () => {
        navigation.navigate(SCREENS.PRIVACY_SETTINGS);
      },
    },
    {
      id: 1,
      name: 'FAQ',
      image: require('../../../../../../assets/Images/settings/faq.png'),
      actions: () => {
        navigation.navigate(SCREENS.FAQ);
      },
    },
    {
      id: 2,
      name: 'Notification Settings',
      image: require('../../../../../../assets/Images/settings/bell.png'),
      actions: () => {
        navigation.navigate(SCREENS.NOTIFI_SETTTINGS);
      },
    },
    {
      id: 3,
      name: 'My Account ',
      image: require('../../../../../../assets/Images/settings/user.png'),
      actions: () => {
        navigation.navigate(SCREENS.DELETE_STEP1);
      },
    },
    {
      id: 4,
      name: 'Terms of Conditions',
      image: require('../../../../../../assets/Images/settings/clipboard.png'),
      actions: () => {},
    },
    {
      id: 5,
      name: 'Logout',
      image: require('../../../../../../assets/Images/logout.png'),
      actions: () => {
        Logout1();
      },
    },
  ];

  return (
    <RegularBG>
      <View style={{marginTop: 14, marginBottom: 24}}>
        <BackButton onPress={() => navigation.goBack()} title={'Settings'} />
      </View>

      <View style={{gap: 30}}>
        {SettingsMenu.map(data => (
          <TouchableOpacity
            key={data.id}
            style={styles.settingsContainer}
            onPress={data.actions}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Image source={data.image} style={{width: 24, height: 24}} />
              <Text
                style={data.id == 5 ? styles.logoutText : styles.settingsText}>
                {data.name}
              </Text>
            </View>

            <Image source={arrow} style={{width: 24, height: 24}} />
          </TouchableOpacity>
        ))}
      </View>
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  settingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  logoutText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.ERROR,
  },
});

export default ProfileSettings;
