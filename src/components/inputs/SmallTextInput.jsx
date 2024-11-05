import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';

const SmallTextInput = ({placeholder, onChangeText, ...allProps}) => {
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
    height: 50,
    borderRadius: 100,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 14,
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
  },
});

export default SmallTextInput;
