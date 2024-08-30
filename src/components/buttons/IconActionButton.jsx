import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
  View,
} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';

const IconActionButton = ({onPress, title, loading}) => {
  return (
    <TouchableOpacity
      style={styles.btnContainer}
      disabled={loading}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator color={COLORS.THANOS} size={'large'} />
      ) : (
        <Text style={styles.btnTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT,
    height: 60,
    borderRadius: 60,
  },
  btnTextStyle: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 16,
    color: '#4F4F4F',
  },
  iconTitleBox: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default IconActionButton;
