import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import BackButton from '../../../components/buttons/BackButton';
import RegularBG from '../../../components/background/RegularBG';
import {AuthContext} from '../../../context/AuthContext';
import TripPaymentCard from '../../../components/trip/TripPaymentCard';

const AllTripPayments = ({navigation, route}) => {
  const {paymentDetails} = route.params;

  return (
    <RegularBG>
      <View style={{marginTop: 16}}>
        <BackButton
          title={'Trip Payments'}
          onPress={() => navigation.goBack()}
        />
      </View>

      <View style={{marginTop: 20, gap: 16}}>
        {paymentDetails?.map((data, i) => (
          <TripPaymentCard key={i} paymentDetail={data} />
        ))}
      </View>
    </RegularBG>
  );
};

const styles = StyleSheet.create({});

export default AllTripPayments;
