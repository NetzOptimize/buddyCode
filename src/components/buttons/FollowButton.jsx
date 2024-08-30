import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';

// **theme
import {COLORS, FONTS} from '../../constants/theme/theme';

// **Image
var check = require('../../../assets/Images/check.png');

const FollowButton = ({onPress, disabled, loading}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}>
      {loading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        <Text style={styles.text}>Follow</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: COLORS.THANOS,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontFamily: FONTS.MAIN_SEMI,
    color: COLORS.LIGHT,
    fontSize: 12,
  },
});

export default FollowButton;
