import React from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import RegularBG from '../background/RegularBG';
import {FONTS} from '../../constants/theme/theme';

var img = require('../../../assets/Images/net-off.png');

const NoConnection = () => {
  return (
    <RegularBG>
      <View style={styles.container}>
        <Image source={img} style={{height: 128, width: 178}} />
        <Text style={styles.noText}>No Internet connection</Text>
      </View>
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  noText: {
    fontFamily: FONTS.MAIN_REG,
    color: 'white',
    fontSize: 18,
  },
});

export default NoConnection;
