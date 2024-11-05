import React from 'react';
import {StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import {COLORS, FONTS} from '../../../constants/theme/theme';

var editTrip = require('../../../../assets/Images/editTrip.png');

const EditTripButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.btn}>
      <Image source={editTrip} style={{width: 18, height: 18}} />
      <Text style={styles.btnText}>Edit</Text>
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

export default EditTripButton;
