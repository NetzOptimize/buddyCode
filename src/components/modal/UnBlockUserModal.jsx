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
import Toast from 'react-native-toast-message';

var close = require('../../../assets/Images/close.png');

// **redux
import {useDispatch} from 'react-redux';
import {fetchBlockedUsers} from '../../redux/slices/blockedUsersSlice';
import axios from 'axios';
import {ENDPOINT} from '../../constants/endpoints/endpoints';
import {AuthContext} from '../../context/AuthContext';

function RemoveButton({title, onPress}) {
  return (
    <TouchableOpacity style={styles.removeBtn} onPress={onPress}>
      <Text style={styles.btnText1}>{title}</Text>
    </TouchableOpacity>
  );
}

function CancelButton({title, onPress}) {
  return (
    <TouchableOpacity style={styles.cancelBtn} onPress={onPress}>
      <Text style={styles.btnText2}>{title}</Text>
    </TouchableOpacity>
  );
}

const UnBlockUserModal = ({visible, onClose, blockedUserData}) => {
  const {authToken} = useContext(AuthContext);

  const dispatch = useDispatch();

  function getFullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
  }

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
            <Text style={styles.name}>
              Unblock{' '}
              {getFullName(
                blockedUserData?.first_name,
                blockedUserData?.last_name,
              )}
              ?
            </Text>
            <Text style={styles.BodyText}>
              {getFullName(
                blockedUserData?.first_name,
                blockedUserData?.last_name,
              )}{' '}
              will now be able to request to follow and message you. They won’t
              be notified that you unblocked them
            </Text>
          </View>

          <View style={styles.restBody}>
            <RemoveButton title={'Unblock'} onPress={UnBlockUser} />
            <CancelButton title={'Cancel'} onPress={onClose} />
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
    textAlign: 'center',
  },
  BodyText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.VISION,
    lineHeight: 20,
    marginTop: 4,
    textAlign: 'center',
  },
  restBody: {
    padding: 20,
    gap: 10,
  },
  removeBtn: {
    height: 44,
    width: '100%',
    backgroundColor: COLORS.ERROR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
  },
  cancelBtn: {
    height: 44,
    width: '100%',
    backgroundColor: COLORS.LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
  },
  btnText1: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  btnText2: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.GREY_LIGHT,
  },
});

export default UnBlockUserModal;
