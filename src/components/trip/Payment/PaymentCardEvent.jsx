import React, {useContext} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {AuthContext} from '../../../context/AuthContext';
import {COLORS, FONTS} from '../../../constants/theme/theme';

function PaymentCardEvent({isSelected, onPress, eventData}) {
  const {myUserDetails} = useContext(AuthContext);
  const userId = myUserDetails?.user?._id;

  const eventPayments = eventData?.event_payment_data || [];
  const matchedPayment = eventPayments.find(
    payment => payment?.user_id._id === userId,
  );
  const isPaymentPending = matchedPayment?.status === 'pending';

  const totalPendingAmount = eventPayments.reduce((total, payment) => {
    return payment.status === 'pending' ? total + payment.amount : total;
  }, 0);

  const startTime = new Date(eventData?.start_time).toLocaleTimeString([], {
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
  });

  const endTime = new Date(eventData?.end_time).toLocaleTimeString([], {
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
  });

  const displayLocation =
    eventData?.event_location.length > 22
      ? eventData?.event_location.slice(0, 22) + '...'
      : eventData?.event_location;

  const displayName =
    eventData?.event_name?.length > 16
      ? eventData?.event_name?.slice(0, 16) + '...'
      : eventData?.event_name;

  return (
    <TouchableOpacity
      style={isSelected ? styles.selectedEventCardBody : styles.eventCardBody}
      onPress={onPress}>
      {isPaymentPending && (
        <View style={styles.paymentStatusBG}>
          <Text style={styles.paymentStatusText}>Pending</Text>
        </View>
      )}

      <View style={styles.dotTime}>
        <View style={styles.timeDot} />
        <Text style={styles.eventTime}>
          {startTime} - {endTime}
        </Text>
      </View>

      <Text style={styles.eventTitle}>{displayName}</Text>

      <View style={styles.rowSpaceBetween}>
        <Text style={styles.eventLocation}>📍 {displayLocation}</Text>
        <View style={styles.alignEnd}>
          {matchedPayment?.amount && isPaymentPending && (
            <Text style={[styles.amountText, {color: COLORS.ERROR}]}>
              You owe:{' '}
              {matchedPayment?.amount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </Text>
          )}
          <Text
            style={[
              styles.amountText,
              {fontSize: matchedPayment?.amount ? 10 : 12},
            ]}>
            {eventData?.remaining_payment?.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventCardBody: {
    width: '100%',
    height: 105,
    backgroundColor: COLORS.GREY_DARK,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 12,
  },
  selectedEventCardBody: {
    width: '100%',
    height: 105,
    backgroundColor: COLORS.GREY_DARK,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.VISION,
  },
  paymentStatusBG: {
    paddingVertical: 2,
    paddingHorizontal: 24,
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
    color: COLORS.GREY_DARK,
    lineHeight: 24,
  },
  dotTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeDot: {
    borderRadius: 100,
    borderWidth: 3,
    width: 10,
    height: 10,
    borderColor: '#27AE60',
    marginRight: 10,
  },
  eventTime: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.LIGHT,
  },
  eventTitle: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  eventLocation: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  amountText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
    color: '#f2f2f2',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
});

export default PaymentCardEvent;
