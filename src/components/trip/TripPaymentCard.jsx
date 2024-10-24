import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {COLORS, FONTS} from '../../constants/theme/theme';

var noDP = require('../../../assets/Images/noDP.png');

const TripPaymentCard = ({
  paymentDetail,
  disabled = false,
  eventData = null,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const eventDate = new Date(paymentDetail?.transaction_time);
  const parts = eventDate?.toDateString().split(' ');
  const formattedDate =
    parts[0] + ', ' + parts[1] + ' ' + parts[2] + ', ' + parts[3];

  const userInfo = paymentDetail?.user
    ? paymentDetail?.user
    : paymentDetail?.user_id;

  const userEvent = paymentDetail?.event ? paymentDetail?.event : eventData;

  if (showDetails) {
    return (
      <TouchableOpacity
        style={{marginTop: 16}}
        onPress={() => setShowDetails(false)}>
        <View
          style={{
            width: '100%',
            backgroundColor: '#4E4E4E',
            padding: 10,
            borderRadius: 10,
            position: 'relative',
          }}>
          <View style={styles.nameTimeContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {userInfo?.is_deleted || userInfo?.status == 'inactive' ? (
                <FastImage
                  source={noDP}
                  style={{width: 44, height: 44, borderRadius: 100}}
                />
              ) : (
                <FastImage
                  source={
                    userInfo?.profile_image
                      ? {uri: userInfo?.profile_image}
                      : noDP
                  }
                  style={{width: 44, height: 44, borderRadius: 100}}
                />
              )}
              <View style={{marginLeft: 10}}>
                <Text style={[styles.regularTextstyle, {fontSize: 14}]}>
                  {userInfo?.is_deleted || userInfo?.status == 'inactive'
                    ? 'Buddypass User'
                    : `${userInfo?.first_name} ${userInfo?.last_name}`}
                </Text>
                <Text style={styles.username}>
                  {userInfo?.is_deleted || userInfo?.status == 'inactive'
                    ? null
                    : `@${userInfo?.username}`}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.detailedStatus,
                {
                  backgroundColor:
                    paymentDetail?.status == 'paid' ? '#A3D9FF' : '#E6CD4A',
                },
              ]}>
              <Text style={styles.regularTextBold}>
                {paymentDetail?.status}
              </Text>
            </View>
            <Text style={[styles.regularTextstyle, {alignSelf: 'flex-end'}]}>
              {paymentDetail?.transaction_time && formattedDate}
            </Text>
          </View>

          <View style={styles.hr} />

          <View style={{marginTop: 10}}>
            <Text style={styles.username}>Summary</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.regularTextstyle}>Tr. Id</Text>
              <Text style={styles.regularTextstyle}>{paymentDetail?._id}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.regularTextstyle}>
                Payment - {userEvent?.event_name}
              </Text>
              <Text style={styles.regularTextstyle}>
                {paymentDetail?.amount?.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </Text>
            </View>

            <View style={styles.hr} />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.username}>Total price</Text>
              <Text style={styles.username}>
                {userEvent?.cost?.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.recentActivity}
      onPress={() => {
        setShowDetails(true);
      }}
      disabled={disabled}>
      {userInfo?.is_deleted || userInfo?.status == 'inactive' ? (
        <FastImage
          source={noDP}
          style={{width: 44, height: 44, borderRadius: 100}}
        />
      ) : (
        <FastImage
          source={
            userInfo?.profile_image ? {uri: userInfo?.profile_image} : noDP
          }
          style={{width: 44, height: 44, borderRadius: 100}}
        />
      )}

      <View style={{width: '84%'}}>
        <Text style={styles.regularTextstyle}>
          {userInfo?.is_deleted || userInfo?.status == 'inactive'
            ? 'Buddypass User'
            : `${userInfo?.first_name} ${userInfo?.last_name}`}
        </Text>
        <Text
          style={[
            styles.regularTextstyle,
            {
              fontFamily: FONTS.MAIN_SEMI,
            },
          ]}>
          {userEvent?.event_name}
        </Text>
        <View style={styles.timeAmountBox}>
          <Text style={styles.regularTextstyle}>08:20 am</Text>
          <Text style={styles.amountText}>
            +{' '}
            {paymentDetail?.amount?.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.paymentStatus,
          {
            backgroundColor:
              paymentDetail?.status == 'paid' ? '#A3D9FF' : '#E6CD4A',
          },
        ]}>
        <Text style={styles.regularTextBold}>{paymentDetail?.status}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  regularTextstyle: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: '#f2f2f2',
    lineHeight: 20,
  },
  timeAmountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: '#f2f2f2',
    lineHeight: 20,
  },
  regularTextBold: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
    color: COLORS.GREY_LIGHT,
    lineHeight: 24,
  },
  paymentStatus: {
    padding: 24,
    paddingTop: 2,
    paddingBottom: 2,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentActivity: {
    width: '100%',
    height: 88,
    backgroundColor: COLORS.GREY_LIGHT,
    borderRadius: 10,
    padding: 10,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hr: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#828282',
    marginTop: 20,
    marginBottom: 10,
  },
  username: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
    color: '#f2f2f2',
    lineHeight: 20,
  },
  detailedStatus: {
    padding: 24,
    paddingTop: 2,
    paddingBottom: 2,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    top: -10,
    right: -10,
  },
});

export default TripPaymentCard;
