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

const FollowedButton = ({onPress, disabled, loading}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}>
      <Image source={check} style={{width: 16, height: 16}} />
      {loading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        <Text style={styles.text}>Followed</Text>
      )}
    </TouchableOpacity>
  );
};

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

export default FollowedButton;
