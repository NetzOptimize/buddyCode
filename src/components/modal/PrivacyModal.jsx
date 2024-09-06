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
import BlockButton from '../buttons/BlockButton';
import Toast, {ErrorToast} from 'react-native-toast-message';
import {AuthContext} from '../../context/AuthContext';
import {ENDPOINT} from '../../constants/endpoints/endpoints';
import axios from 'axios';
import LearnMoreButton from '../buttons/LearnMoreButton';

var close = require('../../../assets/Images/close.png');

const PrivacyModal = ({visible, onClose, setIsPrivate, isPrivate}) => {
  const {authToken} = useContext(AuthContext);

  function getFullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
  }

  const privateTerms = [
    {
      id: 1,
      image: require('../../../assets/Images/eyeOutline.png'),
      text: 'Only your followers can see your trips.',
    },
    {
      id: 2,
      image: require('../../../assets/Images/chatOutline.png'),
      text: 'This won’t affect who can see your followers, who you are following, the number of your likes and trips.',
    },
  ];

  const publicTerms = [
    {
      id: 1,
      image: require('../../../assets/Images/eyeOutline.png'),
      text: 'Anyone can see your trips.',
    },
    {
      id: 2,
      image: require('../../../assets/Images/chatOutline.png'),
      text: 'This won’t affect who can see your followers, who you are following, the number of your likes and trips.',
    },
  ];

  async function TogglePrivacy() {
    try {
      const response = await axios({
        method: 'put',
        url: ENDPOINT.TOGGLE_PRIVACY,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
      });

      console.log('is Private');

      setIsPrivate(!isPrivate);
      onClose();
    } catch (error) {
      console.log('could not switch privacy', error);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.body}>
          <View style={styles.titleContainer}>
            <Text style={styles.name}>
              Switch to {isPrivate ? 'public' : 'private'} account?
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Image source={close} style={{width: 24, height: 24}} />
            </TouchableOpacity>
          </View>
          <View style={styles.restBody}>
            {isPrivate
              ? publicTerms?.map(data => (
                  <View key={data.id} style={styles.blockTermsContainer}>
                    <Image
                      source={data.image}
                      style={{width: 20, height: 20}}
                    />
                    <Text style={styles.blockTermsText}>{data.text}</Text>
                  </View>
                ))
              : privateTerms?.map(data => (
                  <View key={data.id} style={styles.blockTermsContainer}>
                    <Image
                      source={data.image}
                      style={{width: 20, height: 20}}
                    />
                    <Text style={styles.blockTermsText}>{data.text}</Text>
                  </View>
                ))}

            <LearnMoreButton
              title={isPrivate ? 'Switch to public' : 'Switch to private'}
              onPress={TogglePrivacy}
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
    justifyContent: 'flex-end',
  },
  body: {
    height: 300,
    backgroundColor: COLORS.GREY_LIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: COLORS.SWEDEN,
  },
  name: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  restBody: {
    padding: 20,
    gap: 20,
  },
  blockTermsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  blockTermsText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.VISION,
  },
});

export default PrivacyModal;
