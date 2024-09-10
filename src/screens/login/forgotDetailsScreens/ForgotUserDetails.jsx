/* eslint-disable prettier/prettier */

import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import axios from 'axios';
import Toast from 'react-native-toast-message';
import ImageBG from '../../../components/background/ImageBG';
import BackButton from '../../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../../constants/theme/theme';
import CustomTextInput from '../../../components/inputs/CustomTextInput';
import ActionButton from '../../../components/buttons/ActionButton';

// ** validation imports
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import ErrorText from '../../../components/inputs/ErrorText';
import {ENDPOINT} from '../../../constants/endpoints/endpoints';
import {SCREENS} from '../../../constants/screens/screen';

// ** validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
});

export default function ForgotUserDetails({navigation, route}) {
  const {Heading, SubText} = route.params;

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = data => {
    if (Heading === 'Forget Username?') {
      forgetUsername(data.email);
    } else {
      forgetPassword(data.email);
    }
  };

  const forgetUsername = emailID => {
    setLoading(true);

    var user = JSON.stringify({
      email: emailID,
    });

    axios
      .put(ENDPOINT.FORGOT_USERNAME, user, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        navigation.navigate(SCREENS.OTP_SCREEN, {
          email: emailID,
          type: 'FORGET_USERNAME',
        });
        setLoading(false);
      })
      .catch(error => {
        console.log(`Verification failed ${error}`);
        setLoading(false);
      });
  };

  const forgetPassword = emailID => {
    setLoading(true);

    var user = JSON.stringify({
      email: emailID,
    });

    axios
      .put(ENDPOINT.FORGOT_PASSWORD, user, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        navigation.navigate(SCREENS.OTP_SCREEN, {
          email: emailID,
          type: 'FORGET_PASSWORD',
        });
        setLoading(false);
      })
      .catch(error => {
        console.log(`Verification failed`, error.response.data);
        Toast.show({
          type: 'error',
          text1: 'Verification error',
          text2: error.response.data.message ?? error.response.data.message,
        });

        setLoading(false);
      });
  };

  return (
    <ImageBG>
      <View style={{marginTop: 14, marginBottom: 14}}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      <View style={{alignItems: 'center'}}>
        <Text style={styles.tagline}>{Heading}</Text>
        <Text style={styles.subTagline}>{SubText}</Text>
      </View>

      <View style={{marginTop: 56, marginBottom: 28}}>
        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <CustomTextInput
              value={value}
              placeholder={'Email address'}
              onChangeText={onChange}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
          name="email"
        />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
      </View>

      <ActionButton
        title={'Verify'}
        loading={loading}
        onPress={handleSubmit(onSubmit)}
      />
    </ImageBG>
  );
}

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
