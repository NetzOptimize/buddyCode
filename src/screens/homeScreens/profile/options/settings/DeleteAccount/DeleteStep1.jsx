import React, {useContext, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text} from 'react-native';
import RegularBG from '../../../../../../components/background/RegularBG';
import BackButton from '../../../../../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../../../../../constants/theme/theme';
import {AuthContext} from '../../../../../../context/AuthContext';
import ActionButton from '../../../../../../components/buttons/ActionButton';
import LearnMoreButton from '../../../../../../components/buttons/LearnMoreButton';
import {SCREENS} from '../../../../../../constants/screens/screen';
var arrow = require('../../../../../../../assets/Images/arrowGrey.png');
var deleteIcon = require('../../../../../../../assets/Images/delete.png');

const DeleteStep1 = ({navigation}) => {
  const {myUserDetails} = useContext(AuthContext);

  const [showConfirm, setShowConfirm] = useState(false);

  function getDate30DaysFromToday() {
    let today = new Date();
    today.setDate(today.getDate() + 30);

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const monthName = months[today.getMonth()];
    const day = today.getDate();
    const year = today.getFullYear();

    return `${monthName} ${day}, ${year}`;
  }

  return (
    <RegularBG>
      <View style={{marginTop: 14, marginBottom: 24}}>
        <BackButton
          onPress={() => {
            navigation.goBack();
            setShowConfirm(false);
          }}
          title={'Delete My Account'}
        />
      </View>

      {!showConfirm ? (
        <TouchableOpacity
          style={styles.settingsContainer}
          onPress={() => setShowConfirm(true)}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Image source={deleteIcon} style={{width: 24, height: 24}} />
            <Text style={styles.settingsText}>Delete my account</Text>
          </View>

          <Image source={arrow} style={{width: 24, height: 24}} />
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.deleteTextContainer}>
            <Text style={styles.deleteText1}>
              Delete your Buddypass account?
            </Text>
            <Text style={styles.deleteText2}>
              You are requesting to delete @{myUserDetails?.user?.username}. You
              can stop the deletion process by logging back in before{' '}
              {getDate30DaysFromToday()}.
            </Text>
          </View>

          <View style={styles.btnsContainer}>
            <LearnMoreButton
              title={'Confirm Deletion'}
              onPress={() => {
                navigation.navigate(SCREENS.DELETE_STEP2);
                setShowConfirm(false);
              }}
            />
            <ActionButton
              title={'Cancel Deletion'}
              onPress={() => {
                navigation.goBack();
                setShowConfirm(false);
              }}
            />
          </View>
        </>
      )}
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  settingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  logoutText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.ERROR,
  },
  deleteTextContainer: {
    gap: 16,
  },
  deleteText1: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 16,
    color: COLORS.LIGHT,
  },
  deleteText2: {
    fontFamily: FONTS.MAIN_BOLD,
    fontSize: 12,
    color: COLORS.LIGHT,
    lineHeight: 18,
  },
  btnsContainer: {
    gap: 16,
    width: '100%',
    position: 'absolute',
    bottom: 110,
  },
});

export default DeleteStep1;
