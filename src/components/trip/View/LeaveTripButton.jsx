import React from 'react';
import {StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import {COLORS, FONTS} from '../../../constants/theme/theme';

var exit = require('../../../../assets/Images/exit.png');

const LeaveTripButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.btn}>
      <Image source={exit} style={{width: 18, height: 18}} />
      <Text style={styles.btnText}>Leave</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  btnText: {
    fontFamily: FONTS.MAIN_BOLD,
    fontSize: 12,
    color: COLORS.LIGHT,
  },
});

export default LeaveTripButton;
