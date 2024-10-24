import {StyleSheet, Text, View, Image, Modal, SafeAreaView} from 'react-native';
import React, {useContext, useState} from 'react';
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
import NavigationService from '../../config/NavigationService';
import {SCREENS} from '../../constants/screens/screen';
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';
import {ENDPOINT} from '../../constants/endpoints/endpoints';
import ActionButton from '../buttons/ActionButton';
import BlockButton from '../buttons/BlockButton';

// **images
var optionsBtn = require('../../../assets/Images/moreButton.png');

var noDP = require('../../../assets/Images/noDP.png');
var bpUser = require('../../../assets/Images/noDP.png');

const OneChatHeader = ({
  goBack,
  name,
  targetUsername,
  chatID,
  username = null,
  profileImage,
  buddydata,
  setIsDeleted,
  showDeleteChat = true,
  user_inactive,
}) => {
  const {myUserDetails, authToken} = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const options = [
    {
      id: 1,
      title: 'View Profile',
      image: require('../../../assets/Images/profile.png'),
      action: () => {
        NavigationService.navigate(SCREENS.BUDDY_PROFILE, {
          buddyData: buddydata,
        });
      },
    },
    ...(showDeleteChat
      ? [
          {
            id: 2,
            title: 'Delete Chat',
            image: require('../../../assets/Images/delete.png'),
            action: () => {
              setOpen(true);
            },
          },
        ]
      : []),
  ];

  async function deleteChat1() {
    const deleteChatFromAgoraURL =
      'https://a41.chat.agora.io/41695554/960499/users/' +
      myUserDetails?.user?.agoraDetails[0]?.username +
      '/user_channel';

    setLoading(true);

    try {
      const response = await axios.delete(deleteChatFromAgoraURL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${myUserDetails?.appToken}`,
        },
        data: JSON.stringify({
          channel: targetUsername,
          type: 'chat',
          delete_roam: 1,
        }),
      });
      return response.data, deleteChat2(chatID);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  function deleteChat2(chatId) {
    axios
      .delete(`${ENDPOINT.DELETE_CHAT}/${chatId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        console.log('delete chat succes:', res.data);
        setIsDeleted(true);
      })
      .catch(err => {
        console.log('failed to delete chat', err?.response?.data || err);
      })
      .finally(() => {
        setLoading(false);
        setOpen(false);
      });
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <BackButton onPress={goBack} />
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
          {user_inactive ? (
            <FastImage source={bpUser} style={styles.dpStyle} />
          ) : (
            <FastImage
              source={profileImage ? {uri: profileImage} : noDP}
              style={styles.dpStyle}
            />
          )}

          <View>
            <Text style={styles.name}>
              {user_inactive ? 'Buddypass User' : name}
            </Text>
            {username && !user_inactive && (
              <Text style={styles.username}>@{username}</Text>
            )}
          </View>
        </View>
      </View>
      {!user_inactive && (
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
      )}

      <Modal transparent visible={open}>
        <SafeAreaView style={styles.bodyContainer}>
          <View style={styles.body}>
            <View style={styles.chatTitlesBox}>
              <Text style={styles.text1}>Delete Chat?</Text>
              <Text style={styles.text2}>
                Are you sure you want to delete this chat? This action is not
                reversible.
              </Text>
            </View>
            <View style={{gap: 16}}>
              <BlockButton
                title={'Delete Chat'}
                onPress={deleteChat1}
                loading={loading}
              />
              <ActionButton title={'Cancel'} onPress={() => setOpen(false)} />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default OneChatHeader;

const styles = StyleSheet.create({
  dpStyle: {
    width: 48,
    height: 48,
    borderRadius: 1000,
  },
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
  menuIcon: {
    width: 32,
    height: 32,
    transform: [{rotate: '90deg'}],
  },
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
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  body: {
    width: '90%',
    borderRadius: 10,
    backgroundColor: COLORS.GREY_LIGHT,
    padding: 10,
  },
  text1: {
    color: COLORS.LIGHT,
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 20,
  },
  text2: {
    color: COLORS.LIGHT,
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
  },
  chatTitlesBox: {
    gap: 16,
    marginBottom: 32,
  },
});
