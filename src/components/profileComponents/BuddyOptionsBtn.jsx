import React, {useContext, useState} from 'react';
import {StyleSheet, View, Image, Text, Alert} from 'react-native';

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
import UnBlockUserModal from '../modal/UnBlockUserModal';

const BuddyOptionsBtn = ({isBlocked, buddyDetails}) => {
  const {setShowBlockReportPopUp} = useContext(AuthContext);

  const [unblockUserDetails, setUnblockUserDetails] = useState(null);
  const [showUnblock, setShowUnblock] = useState(false);

  const options = [
    {
      id: 1,
      title: isBlocked ? 'Unblock' : 'Block',
      image: isBlocked
        ? require('../../../assets/Images/unblock.png')
        : require('../../../assets/Images/blocked.png'),
      action: () => {
        if (isBlocked) {
          setShowUnblock(true);
          setUnblockUserDetails(buddyDetails.user);
        } else {
          setShowBlockReportPopUp({
            type: 'block',
            state: true,
          });
        }
      },
    },
    {
      id: 2,
      title: 'Report',
      image: require('../../../assets/Images/report.png'),
      action: () =>
        setShowBlockReportPopUp({
          type: 'report',
          state: true,
        }),
    },
    // {
    //   id: 3,
    //   title: 'See shared activities',
    //   image: require('../../../assets/Images/usersOutline.png'),
    //   action: () => console.log('pressed'),
    // },
    // {
    //   id: 4,
    //   title: 'Share this profile',
    //   image: require('../../../assets/Images/share.png'),
    //   action: () => console.log('pressed'),
    // },
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
                {
                  color:
                    (data?.id == 1 && !isBlocked) || data?.id == 2
                      ? COLORS.ERROR
                      : COLORS.LIGHT,
                },
              ]}>
              {data?.title}
            </Text>
          </MenuOption>
        ))}
      </MenuOptions>
      <UnBlockUserModal
        visible={showUnblock}
        onClose={() => setShowUnblock(false)}
        blockedUserData={unblockUserDetails}
      />
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
    width: 240,
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

export default BuddyOptionsBtn;
