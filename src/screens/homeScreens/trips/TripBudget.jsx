import React, {useContext, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import TripBudgetBar from '../../../components/trip/TripBudgetBar';
import {COLORS, FONTS} from '../../../constants/theme/theme';

import axios from 'axios';
import {AuthContext} from '../../../context/AuthContext';
import {ENDPOINT} from '../../../constants/endpoints/endpoints';
import NavigationService from '../../../config/NavigationService';
import {SCREENS} from '../../../constants/screens/screen';
import TripPaymentCard from '../../../components/trip/TripPaymentCard';

const TripBudget = ({tripInfo}) => {
  const {authToken} = useContext(AuthContext);

  const [paymentDetails, setPaymentDetails] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getPaymentDetails();

      return () => {};
    }, []),
  );

  function getPaymentDetails() {
    const url = `${ENDPOINT.GET_EVENT_PAYMENTS}/${tripInfo?.trip?._id}?page=1&limit=100`;
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        setPaymentDetails(res.data.data.payments.docs.reverse());
      })
      .catch(e => {
        console.log('Get Single Trip error', e.response.data);
      });
  }

  return (
    <>
      <TripBudgetBar tripInfo={tripInfo} />
      <View style={styles.titleBtnBox}>
        <Text style={styles.recentText}>Recent Activity</Text>
        <TouchableOpacity
          style={styles.ViewBtn}
          onPress={() =>
            NavigationService.navigate(SCREENS.ALL_TRIP_PAYMENTS, {
              paymentDetails: paymentDetails,
            })
          }>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginTop: 20, gap: 16}}>
        {paymentDetails?.slice(0, 3).map((data, i) => (
          <TripPaymentCard key={i} paymentDetail={data} />
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
