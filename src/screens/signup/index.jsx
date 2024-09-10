import React, {useContext} from 'react';
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
import {AuthContext} from '../../context/AuthContext';
import Toast from 'react-native-toast-message';
import {ENDPOINT} from '../../constants/endpoints/endpoints';

// ** validation schema for signup form
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one digit')
    .matches(
      /[@$!%*?&#]/,
      'Password must contain at least one special character',
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const SignUp = ({navigation}) => {
  const {setLoading, loading} = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const Register = async data => {
    let formData = new FormData();

    formData.append('username', data.username.trim());
    formData.append('email', data.email.trim());
    formData.append('password', data.password.trim());

    setLoading(true);

    try {
      await axios({
        method: 'post',
        url: ENDPOINT.SIGN_UP,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigation.navigate(SCREENS.OTP_SCREEN, {
        email: data.email,
        type: 'USER_REGISTER',
      });
      Toast.show({
        type: 'success',
        text1: 'Sign-up sucess',
        text2: 'Code sent to registered email id.',
      });
    } catch (err) {
      console.log('signup user error:', err.response.data);
      Toast.show({
        type: 'error',
        text1: 'Registration error',
        text2: err.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBG>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.heading}>Register as a traveler!</Text>
          <Text style={styles.subHeading}>
            Create account to start your journey
          </Text>
        </View>

        <View style={styles.inputsContainer}>
          <View style={{marginTop: 10}}>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <CustomTextInput
                  placeholder={'Email address *'}
                  value={value}
                  autoCapitalize="none"
                  onChangeText={onChange}
                />
              )}
              name="email"
            />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </View>

          <View style={{marginTop: 10}}>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <CustomTextInput
                  placeholder={'User Name *'}
                  value={value}
                  autoCapitalize="none"
                  onChangeText={onChange}
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
              render={({field: {onChange, value}}) => (
                <PasswordTextInput
                  placeholder={'Password *'}
                  value={value}
                  onChangeText={onChange}
                />
              )}
              name="password"
            />
            {errors.password && (
              <ErrorText>{errors.password.message}</ErrorText>
            )}
          </View>

          <View style={{marginTop: 10}}>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <PasswordTextInput
                  placeholder={'Confirm Password *'}
                  value={value}
                  onChangeText={onChange}
                  returnKeyType="done"
                />
              )}
              name="confirmPassword"
            />
            {errors.confirmPassword && (
              <ErrorText>{errors.confirmPassword.message}</ErrorText>
            )}
          </View>
        </View>

        <View style={{marginTop: 40}}>
          <ActionButton
            title={'Sign Up'}
            loading={loading}
            onPress={handleSubmit(Register)}
          />
        </View>

        <TouchableOpacity
          style={{alignSelf: 'center', marginTop: 56, marginBottom: 56}}
          onPress={() => navigation.navigate(SCREENS.LOGIN)}>
          <Text style={styles.registerLink}>
            Already a Member?{' '}
            <Text style={styles.registerLinkBold}>Sign in now</Text>
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
  inputsContainer: {
    gap: 16,
  },
  registerLink: {
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
    fontSize: 12,
  },
  registerLinkBold: {
    fontFamily: FONTS.MAIN_BOLD,
  },
});

export default SignUp;
