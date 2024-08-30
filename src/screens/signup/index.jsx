import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

// ** components
import ImageBG from '../../components/background/ImageBG';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import PasswordTextInput from '../../components/inputs/PasswordTextInput';
import ActionButton from '../../components/buttons/ActionButton';

// ** theme
import {COLORS, FONTS} from '../../constants/theme/theme';
import {SCREENS} from '../../constants/screens/screen';
import {ScrollView} from 'react-native-gesture-handler';
import BackButton from '../../components/buttons/BackButton';

const SignUp = ({navigation}) => {
  const handleBackButtonPress = () => {
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <ImageBG>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{position: 'absolute', top: 14}}>
          <BackButton onPress={() => handleBackButtonPress()} />
        </View>

        <View>
          <Text style={styles.heading}>Register as a traveler!</Text>
          <Text style={styles.subHeading}>
            Create account to start your journey.
          </Text>
        </View>

        <View style={styles.inputsContainer}>
          <CustomTextInput
            placeholder={'Email address *'}
            autoCapitalize="none"
            onChangeText={() => {}}
          />
          <CustomTextInput
            placeholder={'User Name*'}
            autoCapitalize="none"
            onChangeText={() => {}}
          />
          <PasswordTextInput
            placeholder={'Password *'}
            onChangeText={() => {}}
          />
          <PasswordTextInput
            placeholder={'Confirm Password *'}
            onChangeText={() => {}}
          />
          <ActionButton title={'Sign Up'} loading={false} />
        </View>

        <TouchableOpacity
          style={{alignSelf: 'center', marginTop: 32}}
          onPress={() => navigation.navigate(SCREENS.LOGIN)}>
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
