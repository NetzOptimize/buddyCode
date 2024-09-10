import React, {useContext, useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {COLORS, FONTS} from '../../../constants/theme/theme';
import {AuthContext} from '../../../context/AuthContext';
import PaymentCardEvent from './PaymentCardEvent';
import PendingPayment from './PendingPayment';
import Payall from './Payall';
import SplitPayment from './SplitPayment';

var close = require('../../../../assets/Images/close.png');
var backBtn = require('../../../../assets/Images/back.png');

const PaymentModal = ({visible, onClose, tripId}) => {
  const {myUserDetails, getPaymentList, getPendingPayments, eventData} =
    useContext(AuthContext);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [paymentOpen, setPaymentOpen] = useState({
    isPayAllOpen: false,
    isSplitOpen: false,
    isPendingPaymentOpen: false,
  });

  function Reset() {
    getPaymentList(tripId);
    getPendingPayments(tripId);
    onClose();
    setSelectedEvent(null);
    setPaymentOpen({
      isPayAllOpen: false,
      isSplitOpen: false,
      isPendingPaymentOpen: false,
    });
  }

  const getHeaderTitle = () => {
    if (paymentOpen.isPayAllOpen || paymentOpen.isPendingPaymentOpen) {
      return 'Make Payment';
    } else if (paymentOpen.isSplitOpen) {
      return 'Select Buddies';
    } else {
      return 'Add Payment';
    }
  };

  let defaultHeader = (
    <View style={styles.header}>
      <Text style={styles.headerText}>{getHeaderTitle()}</Text>
      <TouchableOpacity
        style={{position: 'absolute', right: 0}}
        onPress={() => {
          if (
            paymentOpen.isPayAllOpen ||
            paymentOpen.isPendingPaymentOpen ||
            paymentOpen.isSplitOpen
          ) {
            setPaymentOpen({
              isPayAllOpen: false,
              isSplitOpen: false,
              isPendingPaymentOpen: false,
            });
          } else {
            Reset();
          }
        }}>
        <Image
          source={
            paymentOpen.isPayAllOpen ||
            paymentOpen.isPendingPaymentOpen ||
            paymentOpen.isSplitOpen
              ? backBtn
              : close
          }
          style={{width: 24, height: 24}}
        />
      </TouchableOpacity>
    </View>
  );

  function currentEventHandler(myEvent) {
    if (myEvent?._id == selectedEvent?._id) {
      setSelectedEvent(null);
    } else {
      setSelectedEvent(myEvent);
    }
  }

  const isPaymentPending = selectedEvent?.event_payment_data.some(
    payment =>
      payment?.user_id._id === myUserDetails?.user?._id &&
      payment.status == 'pending',
  );

  const isUserInMembers = eventData?.flatMap(event => {
    if (event.event_payment_data.length === 0) {
      return event.members.some(
        member => member._id === myUserDetails?.user?._id,
      );
    } else {
      return false;
    }
  });

  const getSelectedBody = () => {
    if (paymentOpen.isPayAllOpen) {
      return (
        <Payall
          eventData={selectedEvent}
          paymentData={selectedEvent?.event_payment_data}
          Reset={Reset}
        />
      );
    } else if (paymentOpen.isPendingPaymentOpen) {
      return (
        <PendingPayment
          eventData={selectedEvent}
          paymentData={selectedEvent?.event_payment_data}
          Reset={Reset}
        />
      );
    } else if (paymentOpen.isSplitOpen) {
      return <SplitPayment selectedEvent={selectedEvent} onClose={Reset} />;
    } else {
      return (
        <ScrollView>
          {eventData?.map((event, i) => {
            const isMemberHere = isUserInMembers[i];
            return (
              (isMemberHere || event.show_to_user) && (
                <PaymentCardEvent
                  key={i}
                  eventData={event}
                  onPress={() => currentEventHandler(event)}
                  isSelected={selectedEvent?._id === event._id}
                />
              )
            );
          })}
        </ScrollView>
      );
    }
  };

  const getActionButtons = () => {
    if (paymentOpen.isPayAllOpen) {
      return null;
    } else if (paymentOpen.isPendingPaymentOpen) {
      return null;
    } else if (paymentOpen.isSplitOpen) {
      return null;
    } else {
      return (
        selectedEvent &&
        (isPaymentPending ? (
          <View style={styles.actionBtnContainer}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                setPaymentOpen({
                  isPendingPaymentOpen: true,
                  isPayAllOpen: false,
                  isSplitOpen: false,
                })
              }>
              <Text style={styles.actionText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionBtnContainer}>
            {selectedEvent.members.length > 1 && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() =>
                  setPaymentOpen({
                    isSplitOpen: true,
                    isPendingPaymentOpen: false,
                    isPayAllOpen: false,
                  })
                }>
                <Text style={styles.actionText}>Split</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                setPaymentOpen({
                  isPayAllOpen: true,
                  isPendingPaymentOpen: false,
                  isSplitOpen: false,
                })
              }>
              <Text style={styles.actionText}>Pay All</Text>
            </TouchableOpacity>
          </View>
        ))
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.budgetModal}>
        <View style={styles.body}>
          {defaultHeader}

          <View style={{marginTop: 8}}>{getSelectedBody()}</View>

          {getActionButtons()}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  budgetModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  body: {
    width: '100%',
    height: '92%',
    backgroundColor: COLORS.GREY_LIGHT,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    position: 'relative',
  },
  header: {position: 'relative', alignItems: 'center'},
  headerText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.LIGHT,
    alignSelf: 'center',
  },
  actionBtnContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    gap: 16,
  },
  actionBtn: {
    padding: 32,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#7879F1',
    borderRadius: 100,
  },
  actionText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: 'white',
  },
});

export default PaymentModal;
