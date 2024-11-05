import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  Keyboard,
} from 'react-native';

import {AuthContext} from '../../../context/AuthContext';
import {COLORS, FONTS} from '../../../constants/theme/theme';

var noDP = require('../../../../assets/Images/noDP.png');
var dropIcon = require('../../../../assets/Images/dropIcon.png');
var addBuddyCheckSelect = require('../../../../assets/Images/addBuddyCheckSelect.png');

import LottieView from 'lottie-react-native';
import axios from 'axios';
import {ENDPOINT} from '../../../constants/endpoints/endpoints';
import PaymentCardEvent from './PaymentCardEvent';

const SplitPayment = ({selectedEvent, onClose}) => {
  const {myUserDetails, authToken} = useContext(AuthContext);

  const [splitBy, setSplitBy] = useState('Split by');
  const [openSplitDrop, setOpenDrop] = useState(false);
  const [openBuddyDrop, setOpenBuddyDrop] = useState(false);
  const [BuddyAdded, setBuddyAdded] = useState([]);
  const [splitAmounts, setSplitAmounts] = useState({});
  const [yourAmount, setYourAmount] = useState('0');
  const [splitPercentages, setSplitPercentages] = useState({});
  const [yourPercentage, setYourPercentage] = useState('0');

  const [paymentDone, setPaymentDone] = useState(false);

  const [isKeyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    let keyboardShowListener;
    let keyboardHideListener;

    if (Platform.OS === 'ios') {
      keyboardShowListener = Keyboard.addListener(
        'keyboardWillShow',
        _handleKeyboardShow,
      );
      keyboardHideListener = Keyboard.addListener(
        'keyboardWillHide',
        _handleKeyboardHide,
      );
    } else {
      keyboardShowListener = Keyboard.addListener(
        'keyboardDidShow',
        _handleKeyboardShow,
      );
      keyboardHideListener = Keyboard.addListener(
        'keyboardDidHide',
        _handleKeyboardHide,
      );
    }

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  const _handleKeyboardShow = () => {
    setKeyboardOpen(true);
  };

  const _handleKeyboardHide = () => {
    setKeyboardOpen(false);
  };

  useEffect(() => {
    if (isKeyboardOpen) {
      setOpenDrop(false);
      setOpenBuddyDrop(false);
    }
  }, [isKeyboardOpen]);

  useEffect(() => {
    const updatedSplitAmounts = {};
    BuddyAdded.forEach(buddy => {
      updatedSplitAmounts[buddy.username] = Math.round(
        selectedEvent?.remaining_payment / (BuddyAdded.length + 1),
      );
    });

    setSplitAmounts(updatedSplitAmounts);

    let calculatedBuddyAmount = Object.values(updatedSplitAmounts).reduce(
      (acc, curr) => acc + curr,
      0,
    );

    setYourAmount(selectedEvent?.remaining_payment - calculatedBuddyAmount);

    const updatedSplitPercentages = {};
    const totalBuddies = BuddyAdded.length + 1;

    BuddyAdded.forEach(buddy => {
      updatedSplitPercentages[buddy.username] = Math.round(100 / totalBuddies);
    });

    let calculatedBuddyPercentage = Object.values(
      updatedSplitPercentages,
    ).reduce((acc, curr) => acc + curr, 0);

    const yourPercentage = 100 - calculatedBuddyPercentage;
    setYourPercentage(yourPercentage);
    setSplitPercentages(updatedSplitPercentages);
  }, [BuddyAdded, myUserDetails, selectedEvent, splitBy]);

  function splitByAmountHandler() {
    setSplitBy('Amount');
    setOpenDrop(false);
  }

  function splitBypercentHandler() {
    setSplitBy('Percentage');
    setOpenDrop(false);
  }

  function BuddyAddedFN(id) {
    if (!BuddyAdded.includes(id)) {
      setBuddyAdded([...BuddyAdded, id]);
    } else if (BuddyAdded.includes(id)) {
      let removeBuddy = BuddyAdded;
      removeBuddy = removeBuddy.filter(value => {
        return value !== id;
      });
      setBuddyAdded(removeBuddy);
    }
  }

  function handleSplitAmountChange(id, amount) {
    setSplitAmounts(prevSplitAmounts => ({
      ...prevSplitAmounts,
      [id]: amount,
    }));
  }

  function handleSplitPercentageChange(id, percent) {
    setSplitPercentages(prevSplitPercent => ({
      ...prevSplitPercent,
      [id]: percent,
    }));
  }

  function handleGetMoney() {
    let totalAmount = 0;
    let totalPercent = 0;

    // Calculate total amount or percentage
    if (splitBy === 'Amount') {
      totalAmount = Object.values(splitAmounts).reduce(
        (acc, val) => acc + parseFloat(val),
        parseFloat(yourAmount),
      );

      if (totalAmount !== selectedEvent?.remaining_payment) {
        Alert.alert(
          'Calculation incorrect ' +
            totalAmount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            }),
        );
        return;
      }
    } else if (splitBy === 'Percentage') {
      totalPercent = Object.values(splitPercentages).reduce(
        (acc, val) => acc + parseFloat(val),
        parseFloat(yourPercentage),
      );
      if (totalPercent !== 100) {
        Alert.alert('Calculation split ' + totalPercent + '%');
        return;
      }
    }

    // Gather payment details including your own details
    const paymentDetails = [];

    // Add your own details
    const yourDetails = {
      event_id: selectedEvent?._id,
      user_id: myUserDetails.user._id,
      amount: yourAmount,
      status: 'paid',
    };

    const yourPercentDetails = {
      user_id: myUserDetails.user._id,
      event_id: selectedEvent?._id,
      status: 'paid',
      amount: (yourPercentage / 100) * selectedEvent?.remaining_payment,
    };

    if (splitBy == 'Amount') {
      paymentDetails.push(yourDetails);
    } else {
      paymentDetails.push(yourPercentDetails);
    }
    BuddyAdded.forEach(buddy => {
      const userId = buddy._id;
      const username = buddy.username;
      let amount;

      if (splitBy === 'Amount') {
        amount = splitAmounts[buddy.username];
      } else if (splitBy === 'Percentage') {
        amount =
          (splitPercentages[buddy.username] / 100) *
          selectedEvent.remaining_payment;
      }

      paymentDetails.push({
        user_id: userId,
        event_id: selectedEvent?._id,
        status: 'pending',
        amount: amount,
      });
    });

    paymentAlert(paymentDetails);
  }

  const paymentAlert = paymentDetails => {
    Alert.alert(
      `Pay ${
        splitBy === 'Percentage'
          ? (
              (yourPercentage / 100) *
              selectedEvent?.remaining_payment
            ).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })
          : yourAmount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })
      } and request split`,
      `Please confirm your payment and Split Request for ${selectedEvent?.event_name}`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        {text: 'Split & Pay', onPress: () => payAll(paymentDetails)},
      ],
      {cancelable: false},
    );
  };

  const payAll = paymentDetails => {
    const data = paymentDetails;

    axios
      .post(ENDPOINT.ADD_PAYMENT, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        setPaymentDone(true);
      })
      .catch(err => {
        console.log('failed', err.response.data, url);
      });
  };

  return (
    <>
      {!paymentDone ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: '#444444',
              padding: 10,
              borderRadius: 10,
            }}>
            <PaymentCardEvent eventData={selectedEvent} />

            <TouchableOpacity
              style={styles.dropDownBtn}
              onPress={() => setOpenDrop(prev => !prev)}>
              <Text style={styles.eventTitle}>{splitBy}</Text>
              <Image
                source={dropIcon}
                style={{
                  width: 24,
                  height: 24,
                  transform: [{rotate: openSplitDrop ? '180deg' : '0deg'}],
                }}
              />
            </TouchableOpacity>

            {openSplitDrop && (
              <View style={styles.dropDown1}>
                <TouchableOpacity onPress={splitByAmountHandler}>
                  <Text style={[styles.eventTitle, {margin: 10}]}>Amount</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={splitBypercentHandler}>
                  <Text style={[styles.eventTitle, {margin: 10}]}>
                    Percentage
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.dropDownBtn}
              onPress={() => {
                if (splitBy == 'Split by') {
                  Alert.alert('Please select the Split type');
                } else {
                  setOpenBuddyDrop(prev => !prev);
                }
              }}>
              <Text style={styles.eventTitle}>
                {BuddyAdded.length == 0
                  ? 'Select buddy to split'
                  : `${BuddyAdded.length} ${
                      BuddyAdded.length == 1 ? 'Buddy' : 'Buddies'
                    }`}
              </Text>
              <Image
                source={dropIcon}
                style={{
                  width: 24,
                  height: 24,
                  transform: [{rotate: openBuddyDrop ? '180deg' : '0deg'}],
                }}
              />
            </TouchableOpacity>

            {openBuddyDrop && (
              <View style={styles.dropBuddy}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {selectedEvent?.members
                    ?.filter(user => user._id !== myUserDetails?.user._id)
                    .map((user, i) => (
                      <TouchableOpacity
                        style={styles.addBuddyBox}
                        key={i}
                        onPress={() => BuddyAddedFN(user)}>
                        {BuddyAdded.map(buddy => buddy._id).includes(
                          user._id,
                        ) ? (
                          <Image
                            source={addBuddyCheckSelect}
                            style={styles.unSelectBuddy}
                          />
                        ) : (
                          <View style={styles.unSelectBuddy} />
                        )}

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={
                              user.profile_image
                                ? {uri: user.profile_image}
                                : noDP
                            }
                            style={styles.buddyDp}
                          />
                          <Text
                            style={
                              styles.buddyname
                            }>{`${user.first_name} ${user.last_name}`}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            )}

            {splitBy == 'Amount' && (
              <>
                <View style={styles.BuddyAmountContainer}>
                  {BuddyAdded?.map((data, i) => (
                    <View key={i} style={{width: '48%', marginTop: 10}}>
                      <View style={styles.splitBox}>
                        <Image
                          source={
                            data.profile_image
                              ? {uri: data.profile_image}
                              : noDP
                          }
                          style={styles.buddyDp2}
                        />
                        <TextInput
                          style={[styles.splitInput]}
                          placeholder="$"
                          placeholderTextColor={'#f2f2f2'}
                          value={splitAmounts[data.username]?.toString() || ''}
                          onChangeText={amount =>
                            handleSplitAmountChange(data.username, amount)
                          }
                          keyboardType="numeric"
                        />
                      </View>

                      <Text style={[styles.payAllSummary, {marginTop: 4}]}>
                        @{data.username}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.yourAmountBox}>
                  <Text style={styles.youPay}>You Pay: </Text>
                  <TextInput
                    style={styles.youPayMoney}
                    placeholder="$"
                    value={
                      isNaN(yourAmount)
                        ? selectedEvent?.remaining_payment.toString()
                        : yourAmount.toString()
                    }
                    onChangeText={amount => setYourAmount(amount)}
                    keyboardType="numeric"
                  />
                </View>
              </>
            )}

            {splitBy == 'Percentage' && (
              <>
                <View style={styles.BuddyAmountContainer}>
                  {BuddyAdded?.map((data, i) => (
                    <View key={i} style={{width: '48%', marginTop: 10}}>
                      <View style={styles.splitBox}>
                        <Image
                          source={
                            data.profile_image
                              ? {uri: data.profile_image}
                              : noDP
                          }
                          style={styles.buddyDp2}
                        />
                        <TextInput
                          style={styles.splitInput}
                          placeholder="$"
                          placeholderTextColor={'#f2f2f2'}
                          value={
                            splitPercentages[data.username]?.toString() || ''
                          }
                          onChangeText={amount =>
                            handleSplitPercentageChange(data.username, amount)
                          }
                          keyboardType="numeric"
                        />
                      </View>

                      <Text style={styles.payAllSummary}>@{data.username}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.yourAmountBox}>
                  <Text style={styles.youPay}>You Pay: </Text>
                  <TextInput
                    style={styles.youPayMoney}
                    placeholder="$"
                    value={
                      isNaN(yourAmount)
                        ? selectedEvent?.remaining_payment.toString()
                        : yourPercentage.toString()
                    }
                    onChangeText={amount => setYourPercentage(amount)}
                    keyboardType="numeric"
                  />
                  <Text style={styles.youPay}>%</Text>
                </View>
              </>
            )}
          </View>

          <TouchableOpacity
            style={styles.PayButtonReq}
            onPress={handleGetMoney}>
            <Text style={styles.finalBtnText}>
              Request split and pay{' '}
              {splitBy === 'Percentage'
                ? (
                    (yourPercentage / 100) *
                    selectedEvent?.remaining_payment
                  ).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })
                : yourAmount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <LottieView
          source={require('../../../../assets/paymentSuccess.json')}
          autoPlay
          loop={false}
          resizeMode="cover"
          style={{width: '100%', height: '100%'}}
          onAnimationFinish={() => {
            onClose();
          }}
        />
      )}
    </>
  );
};

export default SplitPayment;

const styles = StyleSheet.create({
  dropDownBtn: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  eventTitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: 'white',
  },
  dropDown1: {
    backgroundColor: '#3A3A3A',
    padding: 8,
    borderRadius: 10,
    marginTop: 8,
  },
  dropBuddy: {
    backgroundColor: '#3A3A3A',
    padding: 8,
    borderRadius: 10,
    marginTop: 8,
    maxHeight: 208,
  },
  addBuddyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'white',
    padding: 12,
    marginTop: 8,
  },
  unSelectBuddy: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
  },
  buddyDp: {
    width: 24,
    height: 24,
    borderRadius: 100,
    marginLeft: 10,
    marginRight: 10,
  },
  buddyname: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#F2F2F2',
  },
  BuddyAmountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  splitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buddyDp2: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  splitInput: {
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
    width: '75%',
    borderRadius: 10,
    paddingLeft: 12,
    paddingRight: 12,
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: '#F2F2F2',
  },
  payAllSummary: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: '#f2f2f2',
  },
  yourAmountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    justifyContent: 'flex-end',
  },
  youPay: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#f2f2f2',
  },
  youPayMoney: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: '#A5A6F6',
    borderBottomWidth: 2,
    borderColor: 'white',
  },
  PayButtonReq: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#7879F1',
    height: 44,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  finalBtnText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});
