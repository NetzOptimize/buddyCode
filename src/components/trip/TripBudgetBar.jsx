import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import SimpleGradientProgressbarView from 'react-native-simple-gradient-progressbar-view';
import GradientText from '../home/GradientText';
import {COLORS, FONTS} from '../../constants/theme/theme';

const TripBudgetBar = ({tripInfo}) => {
  let CurrentProgress =
    tripInfo?.trip_payments_amount / tripInfo?.trip?.fund_goals;

  return (
    <View style={{marginTop: 16}}>
      <View style={styles.progressbarContainer}>
        <View style={styles.fundStatusContainer}>
          <Text style={styles.fundReachedStatus}>
            {(CurrentProgress * 100).toFixed(2)}%
          </Text>
          <Text style={styles.fundReached}>
            {tripInfo?.trip_payments_amount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
            <Text style={{color: 'rgba(242, 242, 242, 0.5)'}}>
              /
              {tripInfo?.trip?.fund_goals.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </Text>
          </Text>
        </View>
        <View style={{borderRadius: 100, backgroundColor: '#D9D9D9'}}>
          <SimpleGradientProgressbarView
            style={styles.barStyle}
            fromColor="#7879F1"
            toColor={CurrentProgress >= 0.9 ? '#EB5757' : '#3DFFD0'}
            progress={CurrentProgress > 1 ? 1 : CurrentProgress}
            cornerRadius={5}
          />
        </View>
        <GradientText
          colors={['#7879F1', '#7879F1', '#3CFFD0', '#3CFFD0', '#FF4EED']}
          style={styles.fundsToGo}>
          {(
            tripInfo?.trip?.fund_goals - tripInfo?.trip_payments_amount
          ).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}{' '}
          to Go
        </GradientText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressbarContainer: {
    backgroundColor: COLORS.GREY_LIGHT,
    padding: 12,
    borderRadius: 10,
    minHeight: 85,
    justifyContent: 'space-between',
  },
  fundStatusContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fundReachedStatus: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
    color: COLORS.LIGHT,
  },
  fundReached: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.LIGHT,
  },
  fundsToGo: {
    fontFamily: FONTS.MAIN_BOLD,
    fontSize: 12,
    color: '#3CFFD0',
    alignSelf: 'flex-end',
  },
  infoBudget: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 16,
    color: COLORS.LIGHT,
    marginBottom: 10,
  },
  barStyle: {
    width: '100%',
    height: 12,
    borderColor: '#000000',
    borderRadius: 100,
  },
});

export default TripBudgetBar;
