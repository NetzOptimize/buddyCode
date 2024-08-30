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
import ActionButton from '../buttons/ActionButton';

var close = require('../../../assets/Images/close.png');

// **redux
import {useDispatch} from 'react-redux';
import {fetchBlockedUsers} from '../../redux/slices/blockedUsersSlice';
import axios from 'axios';
import {ENDPOINT} from '../../constants/endpoints/endpoints';
import {AuthContext} from '../../context/AuthContext';

const UnBlockUserModal = ({visible, onClose, blockedUserData}) => {
  const {authToken} = useContext(AuthContext);

  const dispatch = useDispatch();

  async function UnBlockUser() {
    const userData = {
      user_id: blockedUserData?._id,
    };

    try {
      const response = await axios({
        method: 'put',
        url: ENDPOINT.UNBLOCK_USER,
        data: userData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
      });

      onClose();
      dispatch(fetchBlockedUsers());
      Toast.show({
        type: 'info',
        text1: 'User unblocked!',
        text2: `You've unblocked this user.`,
      });
    } catch (error) {
      console.log('failed to unblock user', error.response.data);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.body}>
          <View style={styles.titleContainer}>
            <TouchableOpacity onPress={onClose}>
              <Image source={close} style={{width: 24, height: 24}} />
            </TouchableOpacity>
          </View>
          <View style={{paddingLeft: 20, paddingRight: 20}}>
            <Text style={styles.name}>Unblock Justin Stanton?</Text>
            <Text style={styles.BodyText}>
              Justin Stanton will now be able to request to follow and message
              you. They won’t be notified that you unblocked them
            </Text>
          </View>

          <View style={styles.restBody}>
            <BlockButton title={'Unblock'} onPress={UnBlockUser} />
            <ActionButton title={'Cancel'} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    width: '96%',
    backgroundColor: COLORS.GREY_LIGHT,
    borderRadius: 20,
  },
  titleContainer: {
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingTop: 20,
  },
  name: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 18,
    color: COLORS.LIGHT,
  },
  BodyText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.VISION,
    lineHeight: 20,
    marginTop: 4,
  },
  restBody: {
    padding: 20,
    gap: 10,
  },
});

export default UnBlockUserModal;
