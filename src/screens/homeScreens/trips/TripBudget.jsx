import React, {useContext, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import TripBudgetBar from '../../../components/trip/TripBudgetBar';
import {COLORS, FONTS} from '../../../constants/theme/theme';

import {AuthContext} from '../../../context/AuthContext';
import NavigationService from '../../../config/NavigationService';
import {SCREENS} from '../../../constants/screens/screen';
import TripPaymentCard from '../../../components/trip/TripPaymentCard';

const TripBudget = ({tripInfo}) => {
  const {paymentList, getPaymentList, getPendingPayments} =
    useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      getPaymentList(tripInfo?.trip?._id);
      getPendingPayments(tripInfo?.trip?._id);

      return () => {};
    }, []),
  );

  return (
    <>
      <TripBudgetBar tripInfo={tripInfo} />
      <View style={styles.titleBtnBox}>
        <Text style={styles.recentText}>Recent Activity</Text>
        <TouchableOpacity
          style={styles.ViewBtn}
          onPress={() =>
            NavigationService.navigate(SCREENS.ALL_TRIP_PAYMENTS, {
              paymentList: paymentList,
            })
          }>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginTop: 20, gap: 16}}>
        {paymentList?.slice(0, 3).map((data, i) => (
          <TripPaymentCard key={i} paymentDetail={data} disabled={true} />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  titleBtnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  recentText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  ViewBtn: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: COLORS.THANOS,
    borderRadius: 1000,
  },
  viewAll: {
    fontFamily: FONTS.MAIN_BOLD,
    fontSize: 10,
    color: COLORS.LIGHT,
  },
});

export default TripBudget;
