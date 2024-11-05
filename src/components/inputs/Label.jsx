import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';

const Label = ({title}) => {
  return <Text style={styles.text}>{title}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.MAIN_SEMI,
    color: COLORS.LIGHT,
    fontSize: 12,
  },
});

export default Label;
