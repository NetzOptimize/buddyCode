import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import axios from 'axios';

// ** components
import ImageBG from '../../components/background/ImageBG';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import PasswordTextInput from '../../components/inputs/PasswordTextInput';
import ActionButton from '../../components/buttons/ActionButton';

// ** theme
import {COLORS, FONTS} from '../../constants/theme/theme';
import {SCREENS} from '../../constants/screens/screen';
import {ScrollView} from 'react-native-gesture-handler';

// ** validation
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import ErrorText from '../../components/inputs/ErrorText';
import {ENDPOINT} from '../../constants/endpoints/endpoints';
import {AuthContext} from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const Login = ({navigation}) => {
  const {VerifyToken, loading, setLoading} = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const ref_input2 = React.useRef();

  const Login = user => {
    const url = ENDPOINT.LOGIN;

    const userData = {
      username: user.username,
      password: user.password,
    };

    setLoading(true);

    axios
      .post(url, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
      .then(res => {
        setLoading(false);
        const data = res.data.data;
        if (!data.user.profile_verified) {
          navigation.navigate(SCREENS.OTP_SCREEN, {
            email: res.data.data.user.email,
            type: 'USER_REGISTER',
          });
        } else if (!data.user.is_profile_completed) {
          Toast.show({
            type: 'info',
            text1: 'Incomplete Profile',
            text2: 'Please add your profle details.',
          });

          navigation.navigate(SCREENS.COMPLETE_PROFILE, {
            myToken: res.data.data.token,
          });
        } else if (data.user.is_deleted) {
          showAlert(res.data.data.token);
        } else if (data.user.status === 'inactive') {
          Toast.show({
            type: 'error',
            text1: 'Account Suspended',
            text2: 'Please contact the Buddypass team to resolve.',
          });
        } else if (data.user.is_locked) {
          Toast.show({
            type: 'error',
            text1: 'Account Locked',
            text2: 'Please enter OTP to unlock your account',
          });

          UnlockAccount(res.data.data);
        } else {
          VerifyToken(data.token);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log(
          'failed to login',
          err?.response?.data ? err?.response?.data : err,
        );

        if (err?.response?.data == undefined) {
          Toast.show({
            type: 'error',
            text1: 'Sign-In failed',
            text2: 'Network Error',
          });
        }

        if (err.response.data.status == 400) {
          Toast.show({
            type: 'error',
            text1: 'Sign-In failed',
            text2: err.response.data.message,
          });
        }
      });
  };

  const showAlert = token => {
    Alert.alert(
      'Account under deletion',
      'Your account is currently under deletion process. Logging in now will halt the deletion process. Are you sure you want to proceed?',
      [
        {
          text: 'Delete',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        {
          text: 'Login',
          onPress: () => StopDeletion(token),
        },
      ],
      {cancelable: false},
    );
  };

  function StopDeletion(token) {
    setLoading(true);
    axios
      .put(
        ENDPOINT.STOP_DELETE,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then(res => {
        VerifyToken(token);
      })
      .catch(err => {
        console.log('Failed to stop deletion', err.response.data, token);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function UnlockAccount(data) {
    const userData = {
      email: data?.user?.email,
    };

    axios
      .post(ENDPOINT.UNLOCK_ACCOUNT_EMAIL, userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + data.token,
        },
      })
      .then(res => {
        console.log(res.data);
        navigation.navigate('OtpVerification', {
          email: data?.user?.email,
          type: 'UNLOCK_ACCOUNT',
          token: data.token,
        });
      })
      .catch(err => {
        console.log('failed to unlock account: ', err.response.data);
      });
  }

  return (
    <ImageBG>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        <View>
          <Text style={styles.heading}>Hello Again!</Text>
          <Text style={styles.subHeading}>
            Welcome back you’ve been missed!
          </Text>
        </View>

        <View>
          <View style={{marginTop: 10}}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, value}}) => (
                <CustomTextInput
                  placeholder={'Username'}
                  value={value.trim()}
                  autoCapitalize="none"
                  returnKeyType="next"
                  onChangeText={text => onChange(text.toLowerCase().trim())}
                  onSubmitEditing={() => ref_input2.current.focus()}
                />
              )}
              name="username"
            />
            {errors.username && (
              <ErrorText>{errors.username.message}</ErrorText>
            )}
          </View>

          <View style={{marginTop: 10}}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, value}}) => (
                <PasswordTextInput
                  placeholder={'Password'}
                  ref={ref_input2}
                  value={value.trim()}
                  onChangeText={text => onChange(text.trim())}
                  returnKeyType="done"
                  // onSubmitEditing={handleSubmit(Login)}
                />
              )}
              name="password"
            />
            {errors.password && (
              <ErrorText>{errors.password.message}</ErrorText>
            )}
          </View>

          <View style={styles.forgotLinkContainer}>
            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() =>
                navigation.navigate(SCREENS.FORGOT_USER, {
                  Heading: 'Forget Username?',
                  SubText:
                    'Enter the email address associated with your account.',
                })
              }>
              <Text style={styles.linkTextStyle}>Forgot Username?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() =>
                navigation.navigate(SCREENS.FORGOT_USER, {
                  Heading: 'Forget Password?',
                  SubText:
                    'Enter the email address associated with your account.',
                })
              }>
              <Text style={styles.linkTextStyle}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{marginTop: 40}}>
          <ActionButton
            title={'Sign In'}
            loading={loading}
            onPress={handleSubmit(Login)}
          />
        </View>

        <TouchableOpacity
          style={{alignSelf: 'center', marginTop: 56}}
          onPress={() => navigation.navigate(SCREENS.REGISTER)}>
          <Text style={styles.registerLink}>
            Not a Member?{' '}
            <Text style={styles.registerLinkBold}>Register now</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBG>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: FONTS.ALT_BOLD,
    fontSize: 26,
    color: COLORS.LIGHT,
    alignSelf: 'center',
    marginTop: 80,
  },
  subHeading: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 20,
    color: COLORS.LIGHT,
    width: '80%',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  linkContainer: {
    alignSelf: 'flex-end',
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT,
    marginTop: 20,
  },
  linkTextStyle: {
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
    fontSize: 12,
  },
  registerLink: {
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
    fontSize: 12,
  },
  registerLinkBold: {
    fontFamily: FONTS.MAIN_BOLD,
  },
  forgotLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 16,
  },
});

export default Login;
