/* eslint-disable prettier/prettier */

import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import ImageBG from '../../../components/background/ImageBG';
import BackButton from '../../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../../constants/theme/theme';
import CustomTextInput from '../../../components/inputs/CustomTextInput';
import ActionButton from '../../../components/buttons/ActionButton';
import PasswordTextInput from '../../../components/inputs/PasswordTextInput';

// ** validation imports
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import ErrorText from '../../../components/inputs/ErrorText';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {SCREENS} from '../../../constants/screens/screen';
import {ENDPOINT} from '../../../constants/endpoints/endpoints';

// ** validation schema
const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Confirm Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/\d/, 'Must contain at least one digit')
    .matches(/[@$!%*?&#]/, 'Must contain at least one special character'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const ChangeUserDetails = ({navigation, route}) => {
  const {email, type} = route.params;

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = data => {
    setLoading(true);

    var user = {
      email: email,
      password: data.password,
    };

    axios
      .post(ENDPOINT.CHANGE_PASSWORD, user, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Password Changed',
          text2: 'Password reset successfully.',
        });
        navigation.navigate(SCREENS.LOGIN);
      })
      .catch(error => {
        console.log(`reset password failed ${error}`);
        setLoading(false);
      });
  };

  const [username, setUsername] = useState('');

  function ChangeUsername() {
    console.log('new username:', username);
    if (username == '') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your username',
      });
    } else {
      setLoading(true);

      var user = JSON.stringify({
        email: email,
        username: username,
      });

      axios
        .put(ENDPOINT.CHANGE_USERNAME, user, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(() => {
          setLoading(false);

          Toast.show({
            type: 'success',
            text1: 'Username Changed',
            text2: 'Username reset successfully.',
          });
          navigation.navigate(SCREENS.LOGIN);
        })
        .catch(error => {
          console.log(`username password failed`, error.response.data.message);
          Toast.show({
            type: 'error',
            text1: 'Request failed',
            text2: error.response.data.message,
          });
          setLoading(false);
        });
    }
  }

  return (
    <ImageBG>
      <View style={{marginTop: 14, marginBottom: 14}}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      {type == 'FORGET_USERNAME' ? (
        <>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.tagline}>Reset your username?</Text>
            <Text style={styles.subTagline}>Create a unique username.</Text>
          </View>

          <View style={{marginTop: 56, marginBottom: 28, gap: 16}}>
            <CustomTextInput
              value={username}
              placeholder={'Username'}
              onChangeText={text => setUsername(text.toLowerCase().trim())}
            />
          </View>
        </>
      ) : (
        <>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.tagline}>Reset Password?</Text>
            <Text style={styles.subTagline}>Set a new password.</Text>
          </View>

          <View style={{marginTop: 56, marginBottom: 28, gap: 16}}>
            <Controller
              control={control}
              name="password"
              render={({field: {onChange, value}}) => (
                <PasswordTextInput
                  value={value}
                  placeholder="New Password"
                  onChangeText={onChange}
                />
              )}
            />
            {errors.password && (
              <ErrorText>{errors.password.message}</ErrorText>
            )}

            <Controller
              control={control}
              name="confirmPassword"
              render={({field: {onChange, value}}) => (
                <PasswordTextInput
                  value={value}
                  placeholder="Confirm Password"
                  onChangeText={onChange}
                />
              )}
            />
            {errors.confirmPassword && (
              <ErrorText>{errors.confirmPassword.message}</ErrorText>
            )}
          </View>
        </>
      )}

      <ActionButton
        title={'Submit'}
        loading={loading}
        onPress={
          type == 'FORGET_USERNAME' ? ChangeUsername : handleSubmit(onSubmit)
        }
      />
    </ImageBG>
  );
};

export default ChangeUserDetails;

const styles = StyleSheet.create({
  tagline: {
    color: COLORS.LIGHT,
    alignSelf: 'center',
    lineHeight: 40,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: FONTS.MAIN_SEMI,
  },
  subTagline: {
    color: COLORS.LIGHT,
    fontWeight: '400',
    alignSelf: 'center',
    lineHeight: 24,
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.MAIN_REG,
  },
});
