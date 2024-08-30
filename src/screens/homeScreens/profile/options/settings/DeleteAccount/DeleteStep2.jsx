import React, {useContext, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text} from 'react-native';
import RegularBG from '../../../../../../components/background/RegularBG';
import BackButton from '../../../../../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../../../../../constants/theme/theme';
import {AuthContext} from '../../../../../../context/AuthContext';
import ActionButton from '../../../../../../components/buttons/ActionButton';
import LearnMoreButton from '../../../../../../components/buttons/LearnMoreButton';
import CustomTextInput from '../../../../../../components/inputs/CustomTextInput';
import PasswordTextInput from '../../../../../../components/inputs/PasswordTextInput';
import Toast from 'react-native-toast-message';
import {ENDPOINT} from '../../../../../../constants/endpoints/endpoints';
import axios from 'axios';

const json = [
  {
    id: 0,
    text: 'I get too many emails and notifications',
  },
  {
    id: 1,
    text: 'I had my fun, the trip is over',
  },
  {
    id: 2,
    text: 'I had a negative experience with Buddypass',
  },
  {
    id: 3,
    text: 'Other',
  },
];

const DeleteStep2 = ({navigation}) => {
  const {myUserDetails, Logout1} = useContext(AuthContext);

  const [selectedId, setSelectedId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const DeleteMyAccount = () => {
    const deleteAccountUrl = ENDPOINT.DELETE_ACCOUNT;

    axios
      .delete(deleteAccountUrl, {
        data: {username: username, password: password},
        headers: {Authorization: 'Bearer ' + authToken},
      })
      .then(res => {
        console.log(res.data);
        Logout1();
        Toast.show({
          type: 'info',
          text1: 'Account Deleted',
          text2: 'Login in under 30 days to recover your account.',
        });
      })
      .catch(error => {
        console.log(`Deletion failed `, error);
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Please try after sometime.',
        });
      });
  };

  return (
    <RegularBG>
      <View style={{marginTop: 14, marginBottom: 24}}>
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
          title={'Delete My Account'}
        />
      </View>

      {!showDelete ? (
        <>
          <View style={{gap: 24}}>
            {json.map((data, i) => (
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center', gap: 16}}
                key={i}
                onPress={() => setSelectedId(i)}>
                <View
                  style={selectedId == i ? styles.selected : styles.select}
                />
                <Text style={styles.deleteBtnText}>{data.text}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.btnsContainer}>
            <ActionButton
              title={'Proceed'}
              onPress={() => setShowDelete(true)}
            />
          </View>
        </>
      ) : (
        <View>
          <Text style={styles.deleteBtnText}>
            Please confirm your user name and password prior to account
            deletion.
          </Text>

          <View style={{gap: 16, marginTop: 32}}>
            <CustomTextInput
              placeholder={'Username'}
              value={username}
              onChangeText={text => setUsername(text.trim().toLowerCase())}
            />
            <PasswordTextInput
              placeholder={'Password'}
              value={password}
              onChangeText={text => setPassword(text.trim())}
            />
          </View>

          <View style={{marginTop: 32}}>
            <LearnMoreButton
              title={'Confirm Delete'}
              onPress={() => {
                if (username !== myUserDetails?.user.username) {
                  console.log('error');
                  Toast.show({
                    type: 'error',
                    text2: 'Incorrect Username',
                  });
                  navigation.goBack();
                } else {
                  DeleteMyAccount(username, password);
                }
              }}
            />
          </View>
        </View>
      )}
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  select: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.LIGHT,
    borderRadius: 1000,
  },
  selected: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.THANOS,
    borderRadius: 1000,
  },
  deleteBtnText: {
    fontFamily: FONTS.MAIN_BOLD,
    fontSize: 12,
    color: COLORS.LIGHT,
    alignSelf: 'center',
  },
  btnsContainer: {
    gap: 16,
    width: '100%',
    position: 'absolute',
    bottom: 110,
  },
});

export default DeleteStep2;
