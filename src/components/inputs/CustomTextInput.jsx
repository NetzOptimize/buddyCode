import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';

const CustomTextInput = ({placeholder, onChangeText, ...allProps}) => {
  return (
    <TextInput
      style={styles.inputStyles}
      placeholder={placeholder}
      onChangeText={onChangeText}
      placeholderTextColor={COLORS.VISION}
      {...allProps}
    />
  );
};

const styles = StyleSheet.create({
  inputStyles: {
    width: '100%',
    backgroundColor: COLORS.GREY_LIGHT,
    height: 60,
    borderRadius: 100,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 16,
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
  },
});

export default CustomTextInput;
