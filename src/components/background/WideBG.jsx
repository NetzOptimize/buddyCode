import React from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {COLORS} from '../../constants/theme/theme';

const WideBG = ({children}) => {
  return (
    <View style={{flex: 1, backgroundColor: COLORS.GREY_DARK}}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.contentArea}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentArea: {
    width: '100%',
    alignSelf: 'center',
    flex: 1,
  },
});

export default WideBG;
