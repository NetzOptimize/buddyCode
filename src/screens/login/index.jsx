import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
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
          console.log('not verified');
        } else if (!data.user.is_profile_completed) {
          console.log('incomplete');
        } else if (data.user.is_deleted) {
          console.log('account deleted');
        } else if (data.user.status === 'inactive') {
          console.log('inactive');
        } else if (data.user.is_locked) {
          console.log('locked');
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

        if (err.response.data.status == 400) {
          Toast.show({
            type: 'error',
            text1: 'Sign-In failed',
            text2: err.response.data.message,
          });
        }
      });
  };

  return (
    <ImageBG>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            <TouchableOpacity style={styles.linkContainer}>
              <Text style={styles.linkTextStyle}>Forgot Username?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkContainer}>
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
