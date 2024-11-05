import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import BackButton from '../../../components/buttons/BackButton';
import RegularBG from '../../../components/background/RegularBG';
import {AuthContext} from '../../../context/AuthContext';
import TripPaymentCard from '../../../components/trip/TripPaymentCard';

const AllTripPayments = ({navigation, route}) => {
  const {paymentList, event} = route.params;

  return (
    <RegularBG>
      <View style={{marginTop: 16}}>
        <BackButton
          title={'Trip Payments'}
          onPress={() => navigation.goBack()}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginTop: 20, gap: 16}}>
          {paymentList?.map((data, i) => (
            <TripPaymentCard key={i} paymentDetail={data} eventData={event} />
          ))}
        </View>

        <View style={{height: 110}} />
      </ScrollView>
    </RegularBG>
  );
};

const styles = StyleSheet.create({});

export default AllTripPayments;
