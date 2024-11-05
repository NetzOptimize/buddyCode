import React, {useContext} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';
import IconActionButton from '../buttons/IconActionButton';

var close = require('../../../assets/Images/close.png');

const OpenCamModal = ({visible, onClose, onCamPress, onLibraryPress}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.body}>
          <View style={styles.titleContainer}>
            <TouchableOpacity onPress={onClose}>
              <Image source={close} style={{width: 24, height: 24}} />
            </TouchableOpacity>
          </View>
          <View style={{paddingLeft: 20, paddingRight: 20}}>
            <Text style={styles.name}>Select an Image</Text>
            <Text style={styles.BodyText}>
              Please click a picture or select one form you Image Library.
            </Text>
          </View>

          <View style={styles.restBody}>
            <IconActionButton title={'Open Camera'} onPress={onCamPress} />
            <IconActionButton
              title={'Image Library'}
              onPress={onLibraryPress}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    width: '96%',
    backgroundColor: COLORS.GREY_LIGHT,
    borderRadius: 20,
  },
  titleContainer: {
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingTop: 20,
  },
  name: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 18,
    color: COLORS.LIGHT,
  },
  BodyText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.VISION,
    lineHeight: 20,
    marginTop: 4,
  },
  restBody: {
    padding: 20,
    gap: 10,
  },
});

export default OpenCamModal;
