import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';

export default function ErrorText({children}) {
  return <Text style={styles.error}>{children}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: COLORS.ERROR,
    fontSize: 12,
    fontFamily: FONTS.ALT_REG,
    margin: 8,
  },
});
