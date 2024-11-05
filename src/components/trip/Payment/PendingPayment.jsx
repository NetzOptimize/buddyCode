import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {AuthContext} from '../../../context/AuthContext';
import {COLORS, FONTS} from '../../../constants/theme/theme';

var noDP = require('../../../../assets/Images/noDP.png');
import LottieView from 'lottie-react-native';
import axios from 'axios';
import {ENDPOINT} from '../../../constants/endpoints/endpoints';

const PendingPayment = ({eventData, paymentData, Reset}) => {
  const {myUserDetails, authToken} = useContext(AuthContext);

  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const myPayment = paymentData?.find(
    payment => payment?.user_id._id === myUserDetails?.user?._id,
  );
  const restPayment = paymentData?.filter(
    detail => detail.user_id._id !== myUserDetails?.user?._id,
  );

  const paymentAlert = () => {
    Alert.alert(
      'Pay ' +
        myPayment?.amount.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }),
      `Please confirm your payment of ${myPayment?.amount.toLocaleString(
        'en-US',
        {
          style: 'currency',
          currency: 'USD',
        },
      )} for ${eventData?.event_name} `,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        {
          text: 'Pay',
          onPress: () => {
            payment(myPayment?._id);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const payment = paymentId => {
    const url = `${ENDPOINT.PENDING_PAYMENT}/${paymentId}`;

    const userData = {
      status: 'paid',
    };

    setLoading(true);

    axios
      .put(url, userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        setPaymentDone(true);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log('failed', err.response.data);
      });
  };

  return (
    <View>
      {!paymentDone ? (
        <>
          <View style={styles.payAllCard}>
            <Text style={styles.payAllSummary}>Summary</Text>
            <View style={styles.eventPaymentSummaryBox}>
              <Text
                style={{
                  fontFamily: FONTS.MAIN_REG,
                  fontSize: 12,
                  color: COLORS.LIGHT,
                }}>
                Split payment - {eventData?.event_name}
              </Text>
              <Text style={styles.paymentEventCost}>
                {myPayment?.amount.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </Text>
            </View>

            <View style={styles.hr} />

            <View style={styles.eventPaymentSummaryBox}>
              <Text style={styles.payAllTotal}>Total Price</Text>
              <Text style={styles.payAllTotal}>
                {eventData?.cost.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </Text>
            </View>
          </View>

          <View style={[styles.payAllCard, {height: 340}]}>
            <ScrollView>
              {restPayment?.map((data, i) => {
                return (
                  <View
                    style={[
                      styles.restpaymentBody,
                      {marginTop: i == 0 ? 0 : 16},
                    ]}
                    key={i}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={
                          data.user_id.profile_image
                            ? {uri: data.user_id.profile_image}
                            : noDP
                        }
                        style={{width: 44, height: 44, borderRadius: 100}}
                      />
                      <View style={{marginLeft: 8}}>
                        <Text style={styles.userNameText}>
                          {data.user_id.first_name} {data.user_id.last_name}
                        </Text>
                        <Text style={styles.userPaymentText}>
                          {data.amount.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.paymentStatusBG,
                        {
                          backgroundColor:
                            data.status == 'paid' ? '#A3D9FF' : '#E6CD4A',
                        },
                      ]}>
                      <Text style={styles.paymentStatusText}>
                        {data.status}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.payAllButton}>
            <TouchableOpacity style={styles.actionBtn} onPress={paymentAlert}>
              {loading ? (
                <ActivityIndicator color={COLORS.LIGHT} />
              ) : (
                <Text style={styles.actionText}>
                  Pay{' '}
                  {myPayment?.amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <LottieView
          source={require('../../../../assets/paymentSuccess.json')}
          autoPlay
          loop={false}
          resizeMode="cover"
          style={{width: '100%', height: '100%'}}
          onAnimationFinish={() => {
            Reset();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  payAllCard: {
    backgroundColor: COLORS.GREY_DARK,
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  payAllSummary: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
    color: COLORS.LIGHT,
  },
  hr: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: COLORS.SWEDEN,
    marginTop: 20,
    marginBottom: 10,
  },
  paymentEventCost: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.LIGHT,
    width: '30%',
    lineHeight: 18,
    textAlign: 'right',
  },
  eventPaymentSummaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  payAllTotal: {
    fontFamily: FONTS.MAIN_BOLD,
    color: COLORS.LIGHT,
    fontSize: 12,
  },
  restpaymentBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userNameText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: '#f2f2f2',
    lineHeight: 20,
  },
  userPaymentText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: '#f2f2f2',
    lineHeight: 20,
  },
  paymentStatusBG: {
    padding: 24,
    paddingTop: 2,
    paddingBottom: 2,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#E6CD4A',
  },
  paymentStatusText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
    color: '#3A3A3A',
    lineHeight: 24,
  },
  payAllButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -90,
    alignSelf: 'center',
  },
  actionBtn: {
    padding: 32,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#7879F1',
    margin: 5,
    borderRadius: 100,
  },
  actionText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: 'white',
  },
});

export default PendingPayment;
