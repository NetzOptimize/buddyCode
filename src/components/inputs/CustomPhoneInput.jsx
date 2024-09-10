import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {COLORS, FONTS} from '../../constants/theme/theme';

const CustomPhoneInput = ({
  phoneInputRef,
  value = '',
  onChangeText = () => {},
}) => {
  const [currentValue, setCurrentValue] = useState('');

  useEffect(() => {
    setCurrentValue(value);
  }, [currentValue]);

  return (
    <PhoneInput
      ref={phoneInputRef}
      defaultValue={value}
      value={value}
      defaultCode="US"
      layout="first"
      autoFocus={false}
      onChangeText={onChangeText}
      withDarkTheme
      textInputProps={{
        placeholderTextColor: COLORS.VISION,
      }}
      containerStyle={styles.phoneInputContainer}
      textContainerStyle={styles.phoneTextContainer}
      textInputStyle={styles.phoneTextInput}
      codeTextStyle={styles.phoneTextStyle}
      flagButtonStyle={styles.flagButtonStyle}
      countryPickerButtonStyle={styles.countryPicker}
    />
  );
};

const styles = StyleSheet.create({
  phoneInputContainer: {
    height: 60,
    width: '100%',
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: COLORS.GREY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.LIGHT,
  },
  phoneTextContainer: {
    height: 40,
    borderRadius: 100,
    backgroundColor: COLORS.GREY_LIGHT,
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
  },
  phoneTextInput: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 13,
    color: COLORS.LIGHT,
    height: 40,
  },
  phoneTextStyle: {
    color: COLORS.LIGHT,
    fontSize: 13,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagButtonStyle: {
    color: COLORS.LIGHT,
  },
  countryPicker: {
    color: COLORS.LIGHT,
  },
});

export default CustomPhoneInput;
