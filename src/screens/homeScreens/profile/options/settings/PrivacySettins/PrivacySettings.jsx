import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import RegularBG from '../../../../../../components/background/RegularBG';
import BackButton from '../../../../../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../../../../../constants/theme/theme';
import {SCREENS} from '../../../../../../constants/screens/screen';
import PrivacyModal from '../../../../../../components/modal/PrivacyModal';

var arrow = require('../../../../../../../assets/Images/arrowGrey.png');

const PrivacySettings = ({navigation}) => {
  const [showModal, setShowModal] = useState(false);

  const [isPrivate, setIsPrivate] = useState(false);

  const toggleSwitch = () => setIsPrivate(previousState => !previousState);

  return (
    <RegularBG>
      <View style={{marginTop: 14, marginBottom: 24}}>
        <BackButton
          onPress={() => navigation.goBack()}
          title={'Privacy Settings'}
        />
      </View>

      <View style={styles.switchContainer}>
        <View style={styles.titleSwitch}>
          <Text style={styles.titleText}>Private account</Text>
          <Switch
            trackColor={{false: '#767577', true: COLORS.THANOS}}
            thumbColor={isPrivate ? COLORS.LIGHT : COLORS.VISION}
            onValueChange={() => setShowModal(true)}
            value={isPrivate}
          />
        </View>
        <Text style={styles.bodyText}>
          With a private account, only followers will be able to see your trips.
          Your current followers won’t be affected.
        </Text>
      </View>

      <View style={styles.hr} />

      <TouchableOpacity
        style={styles.titleSwitch}
        onPress={() => navigation.navigate(SCREENS.BLOCKED_LIST)}>
        <Text style={styles.titleText}>Blocked users</Text>
        <Image source={arrow} style={{width: 24, height: 24}} />
      </TouchableOpacity>

      <View style={styles.hr} />

      <PrivacyModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        isPrivate={isPrivate}
        setIsPrivate={setIsPrivate}
      />
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    gap: 10,
  },
  titleSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  bodyText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.VISION,
  },
  hr: {
    height: 1,
    backgroundColor: COLORS.SWEDEN,
    width: '100%',
    alignSelf: 'center',
    margin: 20,
    borderRadius: 1000,
  },
});

export default PrivacySettings;
