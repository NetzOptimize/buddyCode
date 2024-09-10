import {StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';

// **theme
import {COLORS, FONTS} from '../../constants/theme/theme';

// **Image
var check = require('../../../assets/Images/check.png');

const RequestedButton = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={check} style={{width: 16, height: 16}} />
      <Text style={styles.text}>Requested</Text>
    </TouchableOpacity>
  );
};

export default RequestedButton;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingTop: 6,
    paddingBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.THANOS,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontFamily: FONTS.MAIN_SEMI,
    color: COLORS.THANOS,
    fontSize: 12,
  },
});
