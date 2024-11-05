import React, {useContext} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';
import BlockButton from '../buttons/BlockButton';
import Toast from 'react-native-toast-message';
import {AuthContext} from '../../context/AuthContext';
import {ENDPOINT} from '../../constants/endpoints/endpoints';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {fetchBlockedUsers} from '../../redux/slices/blockedUsersSlice';

var close = require('../../../assets/Images/close.png');

const BlockUserModal = ({visible, onClose}) => {
  const {blockUserData, authToken} = useContext(AuthContext);

  const dispatch = useDispatch();

  function getFullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
  }

  const blockTerms = [
    {
      id: 1,
      image: require('../../../assets/Images/ban.png'),
      text: 'They won’t be able to message you or find your profile or content on BuddyPass.',
    },
    {
      id: 2,
      image: require('../../../assets/Images/noBell.png'),
      text: 'They won’t be notified that you blocked them.',
    },
    {
      id: 3,
      image: require('../../../assets/Images/nut.png'),
      text: 'You can unblock them anytime in Settings.',
    },
  ];

  const BlockUser = async () => {
    const userData = {
      user_id: blockUserData?.user?._id,
    };

    try {
      const response = await axios({
        method: 'put',
        url: ENDPOINT.BLOCK_USER,
        data: userData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
      });

      onClose();
      dispatch(fetchBlockedUsers());

      Toast.show({
        type: 'error',
        text1: 'User blocked!',
        text2: `You've blocked this user.`,
      });
    } catch (error) {
      console.log('failed to block user', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.body}>
          <View style={styles.titleContainer}>
            <Text style={styles.name}>
              Block{' '}
              {getFullName(
                blockUserData?.user?.first_name,
                blockUserData?.user?.last_name,
              )}
              ?
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Image source={close} style={{width: 24, height: 24}} />
            </TouchableOpacity>
          </View>
          <View style={styles.restBody}>
            {blockTerms?.map(data => (
              <View key={data.id} style={styles.blockTermsContainer}>
                <Image source={data.image} style={{width: 20, height: 20}} />
                <Text style={styles.blockTermsText}>{data.text}</Text>
              </View>
            ))}

            <BlockButton title={'Block'} onPress={BlockUser} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  body: {
    height: 300,
    backgroundColor: COLORS.GREY_LIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: COLORS.SWEDEN,
  },
  name: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  restBody: {
    padding: 20,
    gap: 20,
  },
  blockTermsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  blockTermsText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.VISION,
  },
});

export default BlockUserModal;
