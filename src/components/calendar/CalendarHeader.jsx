/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import {View, Text} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';

export default function CalendarHeader({month, year}) {
  return (
    <View style={{alignItems: 'center'}}>
      <Text
        style={{
          fontSize: 16,
          fontFamily: FONTS.MAIN_SEMI,
          color: COLORS.LIGHT,
        }}>
        {month}
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: FONTS.MAIN_REG,
          color: COLORS.THANOS,
        }}>
        {year}
      </Text>
    </View>
  );
}
