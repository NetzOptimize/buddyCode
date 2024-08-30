import React from 'react';
import {Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';

var backBtn = require('../../../assets/Images/back.png');

const BackButton = ({title, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={backBtn} style={{width: 32, height: 32}} />
      <Text style={styles.textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -10,
  },
  textStyle: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
});

export default BackButton;
