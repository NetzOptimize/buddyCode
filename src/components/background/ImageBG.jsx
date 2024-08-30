import React from 'react';
import {StyleSheet, View, ImageBackground, SafeAreaView} from 'react-native';

var BGImage = require('../../../assets/Images/background.png');

const ImageBG = ({children}) => {
  return (
    <ImageBackground source={BGImage} style={{flex: 1}}>
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.contentArea}>{children}</View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  contentArea: {
    width: '90%',
    alignSelf: 'center',
    flex: 1,
    position: 'relative',
  },
});

export default ImageBG;
