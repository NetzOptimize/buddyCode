import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

// lottie
import LottieView from 'lottie-react-native';
import {COLORS} from '../../constants/theme/theme';

const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.GREY_DARK,
      }}>
      <LottieView
        source={require('../../../assets/splashScreen2.json')}
        autoPlay
        loop={false}
        resizeMode="cover"
        style={{width: '100%', height: '100%'}}
        onAnimationFinish={() => {
          console.log('finish');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default SplashScreen;
