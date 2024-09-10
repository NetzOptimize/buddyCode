import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useRef, useState} from 'react';
import ImageBG from '../../components/background/ImageBG';
import BackButton from '../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../constants/theme/theme';
import Toast from 'react-native-toast-message';
import {ENDPOINT} from '../../constants/endpoints/endpoints';
import {AuthContext} from '../../context/AuthContext';

import axios from 'axios';
import {SCREENS} from '../../constants/screens/screen';

const OTPverification = ({navigation, route}) => {
  const {setLoading, loading, VerifyToken} = useContext(AuthContext);

  const {email, type, token} = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      if (type == 'UNLOCK_ACCOUNT') {
        UnlockAccount(otpString, email);
      } else {
        OTPVerify(email, otpString);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter a 6-digit OTP.',
      });
    }
  };

  async function OTPVerify(email, otp) {
    try {
      setLoading(true);

      var user = {
        email: email,
        otp: otp,
      };

      const response = await axios.post(ENDPOINT.VERIFY_OTP, user, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (type == 'USER_REGISTER') {
        navigation.navigate(SCREENS.COMPLETE_PROFILE, {
          myToken: response.data.data.token,
        });
      } else if (type == 'FORGET_PASSWORD') {
        navigation.navigate(SCREENS.CHANGE_USER_DETAILS, {
          email: email,
          type: type,
        });
      } else {
        Alert.alert(
          `Your username is @${response.data.data.user.username}`,
          'would you like to reset your username?',
          [
            {
              text: 'Yes',
              onPress: () => {
                navigation.navigate(SCREENS.CHANGE_USER_DETAILS, {
                  email: email,
                  type: type,
                });
              },
            },

            {
              text: 'No',
              onPress: () => {
                handleGoBack();
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {
      console.log(error?.response?.data, error);
      Toast.show({
        type: 'error',
        text1: 'Verification failed!',
        // text2: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  }

  const resendOTP = async emailId => {
    const ResendOTP = ENDPOINT.RESEND_OTP;

    try {
      const user = JSON.stringify({
        email: emailId,
        type: type,
      });

      const response = await axios.put(ResendOTP, user, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let userInfo = response.data;
      Toast.show({
        type: 'success',
        text1: 'OTP sent.',
        text2: 'Code sent to registered email id.',
      });
    } catch (error) {
      let errInfo = error?.response?.data;
      console.log('Resend OTP 1 Message:', errInfo, error);
    }
  };

  function UnlockAccount(otp, email) {
    const userData = {
      otp: otp,
      email: email,
    };

    setLoading(true);

    axios
      .post(ENDPOINT.UNLOCK_ACCOUNT, userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        VerifyToken(token);
      })
      .catch(err => {
        console.log('failed to unlock account', err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <ImageBG>
      <View style={{marginTop: 14, marginBottom: 14}}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      <View>
        <Text style={styles.tagline}>Verification</Text>
        <Text style={styles.subTagline}>
          Enter the verification code we just sent you on your email address.
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={value => handleOtpChange(value, index)}
            ref={ref => (inputRefs.current[index] = ref)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.resendCode}
        onPress={() => resendOTP(email)}>
        <Text style={styles.resendText}>Resend Code?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        {loading ? (
          <ActivityIndicator size={32} color={COLORS.THANOS} />
        ) : (
          <Text style={styles.submitText}>Verify</Text>
        )}
      </TouchableOpacity>
    </ImageBG>
  );
};

export default OTPverification;

const styles = StyleSheet.create({
  tagline: {
    color: COLORS.LIGHT,
    alignSelf: 'center',
    lineHeight: 40,
    textAlign: 'center',
    fontSize: 26,
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT,
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.LIGHT,
    fontFamily: FONTS.MAIN_REG,
  },
  resendCode: {
    alignSelf: 'flex-end',
    marginTop: 24,
    borderColor: COLORS.LIGHT,
    borderBottomWidth: 1,
  },
  resendText: {
    fontSize: 12,
    color: COLORS.LIGHT,
    fontFamily: FONTS.MAIN_REG,
  },
  submitBtn: {
    marginTop: 36,
    width: 138,
    height: 60,
    backgroundColor: COLORS.LIGHT,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  submitText: {
    fontSize: 18,
    color: COLORS.GREY_DARK,
    fontFamily: FONTS.MAIN_SEMI,
  },
});
