import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import FastImage from 'react-native-fast-image';

// **3rd party imports
import LinearGradient from 'react-native-linear-gradient';

// **images
var noDP = require('../../../assets/Images/noDP.png');
var close = require('../../../assets/Images/close.png');

export default function ProfileImage({
  source,
  handleClose,
  onPress,
  showProfileImage,
}) {
  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['#3CFFD0', '#FE4EED']}
          style={styles.LinearGradientStyle}>
          <View style={styles.ppCover}>
            <FastImage
              source={source ? {uri: source} : noDP}
              style={styles.dpStyle}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <Modal transparent visible={showProfileImage}>
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity
            style={{alignSelf: 'flex-end', marginRight: 40}}
            onPress={handleClose}>
            <Image source={close} style={{width: 30, height: 30}} />
          </TouchableOpacity>
          <FastImage
            source={source ? {uri: source} : noDP}
            style={{height: 200, width: 200, borderRadius: 1000}}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dpStyle: {width: 93, height: 93, borderRadius: 100},
  LinearGradientStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: 105,
    height: 105,
  },
  ppCover: {
    width: 100,
    height: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
