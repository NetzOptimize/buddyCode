import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Modal,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';

import React, {useContext, useEffect, useState} from 'react';
import RegularBG from '../../../../components/background/RegularBG';
import BackButton from '../../../../components/buttons/BackButton';
import ActionButton from '../../../../components/buttons/ActionButton';
import {SCREENS} from '../../../../constants/screens/screen';
import SmallTextInput from '../../../../components/inputs/SmallTextInput';
import {COLORS, FONTS} from '../../../../constants/theme/theme';
import StartDateSelection from '../../../../components/calendar/StartDateSelection';
import EndDateSelection from '../../../../components/calendar/EndDateSelection';
import Toast from 'react-native-toast-message';
import {AuthContext} from '../../../../context/AuthContext';
import axios from 'axios';
import {ENDPOINT} from '../../../../constants/endpoints/endpoints';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image';

var plus = require('../../../../../assets/Images/plus.png');
var close = require('../../../../../assets/Images/close.png');
var cancel = require('../../../../../assets/Images/close.png');
var noDP = require('../../../../../assets/Images/noDP.png');

import {useDebouncedCallback} from 'use-debounce';

function DestinationInput({tripDestinations, setTripDestinations}) {
  const [showPop, setShowPop] = useState(false);
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const removeDestination = index => {
    if (tripDestinations.length == 1) {
      setTripDestinations(['']);
    } else {
      const updatedDestinations = [...tripDestinations];
      updatedDestinations.splice(index, 1);
      setTripDestinations(updatedDestinations);
    }
  };

  const debounced = useDebouncedCallback(location => {
    setIsLoading(true);
    setSuggestedLocations([]);
    fetchLocationData(location);
  }, 500);

  async function fetchLocationData(location) {
    const accessToken =
      'pk.eyJ1IjoiYnVkZHlwYXNzIiwiYSI6ImNsbnRueng5ZTAwb3gybHJ6Mm9sNzBzYnEifQ.-rDxKn6LNhZu4IpCXDHtlA';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      location,
    )}.json?access_token=${accessToken}`;

    try {
      const response = await axios.get(url);
      setSuggestedLocations(response.data.features);
    } catch (error) {
      console.error('Error fetching location data:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  function onClose() {
    setShowPop(false);
    setSuggestedLocations([]);
    setIsLoading(false);
    setSearchText('');
  }

  return (
    <>
      <View style={{gap: 8}}>
        <Text style={styles.label}>Trip Destination</Text>

        {tripDestinations.map((destination, index) => (
          <View
            key={index}
            style={
              destination !== ''
                ? styles.multiDestination
                : styles.singleDestination
            }>
            <TouchableOpacity
              style={styles.tripPeriod2}
              onPress={() => setShowPop(true)}
              disabled={destination !== ''}>
              <Text style={styles.tripPeriodTextPlace}>
                {destination == '' ? 'Trip Destination' : destination}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeDestination(index)}>
              <Image source={close} style={{width: 24, height: 24}} />
            </TouchableOpacity>
          </View>
        ))}

        {tripDestinations[0] !== '' && (
          <View style={{gap: 8}}>
            <TouchableOpacity
              style={styles.addDestination}
              onPress={() => setShowPop(true)}>
              <Image source={plus} style={{width: 24, height: 24}} />
              <Text style={styles.addDestinationTextStyle}>
                Add More Destination
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal visible={showPop} transparent animationType="fade">
        <SafeAreaView style={styles.destinationSafeArea}>
          <View
            style={{
              width: '90%',
            }}>
            <>
              <View style={styles.destinationLocationInputBox}>
                <TextInput
                  style={styles.destinationTextInput}
                  placeholder={'Search Destination'}
                  placeholderTextColor={COLORS.VISION}
                  value={searchText}
                  onChangeText={text => {
                    debounced(text);
                    setSearchText(text);
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setSearchText('');
                  }}>
                  <Image source={close} style={{width: 20, height: 20}} />
                </TouchableOpacity>
              </View>
              {suggestedLocations?.length > 0 && (
                <View style={styles.suggestLocationContainer}>
                  <ScrollView
                    contentContainerStyle={{gap: 24}}
                    style={{padding: 8}}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always">
                    {suggestedLocations?.map((data, i) => {
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => {
                            onClose();
                            if (tripDestinations == '') {
                              setTripDestinations([data?.place_name]);
                            } else {
                              setTripDestinations([
                                ...tripDestinations,
                                data?.place_name,
                              ]);
                            }
                          }}>
                          <Text style={styles.suggestedLocationText}>
                            {data?.place_name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    <View style={{height: 16}} />
                  </ScrollView>
                </View>
              )}

              {loading && (
                <View style={{marginTop: 16}}>
                  <ActivityIndicator size={'large'} color={COLORS.THANOS} />
                </View>
              )}
            </>

            <TouchableOpacity style={styles.locationCloseBtn} onPress={onClose}>
              <Text
                style={{fontFamily: FONTS.MAIN_SEMI, color: COLORS.GREY_DARK}}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
const EditTrip = ({navigation, route}) => {
  const {tripData} = route.params;

  const {
    myUserDetails,
    authToken,
    setMyTrips,
    setMyAllTrips,
    tripMembers,
    setTripMembers,
  } = useContext(AuthContext);

  const [tripName, setTripName] = useState('');
  const [tripDestinations, setTripDestinations] = useState(['']);
  const [tripStartDate, setTripStartDate] = useState('');
  const [tripEndDate, setTripEndDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCalendar2, setShowCalendar2] = useState(false);
  const [charsLeft, setCharsLeft] = useState(20);
  const [fundGoals, setFundGoals] = useState('');
  useEffect(() => {
    setTripName(tripData?.trip?.trip_name);
    setTripDestinations(tripData?.trip?.destination);
    setTripStartDate(tripData?.trip?.trip_starting_time);
    setTripEndDate(tripData?.trip?.trip_ending_time);
    setFundGoals(formatCurrency(tripData?.trip?.fund_goals?.toString()));
  }, []);

  const [loading, setIsLoading] = useState(false);

  const handleTripNameChange = text => {
    const maxLength = 20;
    if (text.length <= maxLength) {
      const remainingChars = maxLength - text.length;
      const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
      setTripName(capitalizedText);
      setCharsLeft(remainingChars);
    }
  };

  function PickStartDate(day) {
    setTripStartDate(day.dateString);
  }

  function PickEndDate(day) {
    setTripEndDate(day.dateString);
  }

  const formatCurrency = value => {
    let formattedValue = value.replace(/[^0-9]/g, '');

    if (formattedValue === '') {
      return '';
    }

    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return `$ ${formattedValue}`;
  };

  const removeFormatting = formattedValue => {
    let unformattedValue = formattedValue.replace(/[$,]/g, '');
    return parseInt(unformattedValue, 10) || 0; // Return 0 if the string is empty
  };

  function handleFundText(value) {
    setFundGoals(formatCurrency(value));
  }

  function handleValidation() {
    const emptyDestinations = tripDestinations.filter(
      destination => destination.trim() === '',
    );

    if (tripName.trim() == '') {
      Toast.show({
        type: 'error',
        text2: 'Please enter Trip Name',
      });
    } else if (emptyDestinations.length > 0) {
      Toast.show({
        type: 'error',
        text2: 'Please enter Trip Destination',
      });
    } else if (tripStartDate == '') {
      Toast.show({
        type: 'error',
        text2: 'Please select Trip Start Date',
      });
    } else if (tripEndDate == '') {
      Toast.show({
        type: 'error',
        text2: 'Please select Trip End Date',
      });
    } else if (fundGoals == '') {
      Toast.show({
        type: 'error',
        text2: 'Please enter Trip Funds',
      });
    } else {
      UpdateTrip();
    }
  }

  function UpdateTrip() {
    setIsLoading(true);

    let formData = new FormData();

    // Append regular form data
    formData.append('trip_name', tripName);
    formData.append('trip_starting_time', tripStartDate);
    formData.append('trip_ending_time', tripEndDate);
    formData.append('owner', myUserDetails?.user?._id);
    formData.append('fund_goals', removeFormatting(fundGoals));

    // Append array data with indices for destinations
    tripDestinations.forEach((data, index) => {
      formData.append(`destination[${index}]`, data);
    });

    if (tripMembers?.length > 0) {
      tripMembers.forEach((data, index) => {
        formData.append(`members[${index}]`, data?._id);
      });
    }

    axios({
      method: 'PUT',
      url: `${ENDPOINT.UPDATE_TRIP}/${tripData?.trip?._id}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + authToken,
      },
    })
      .then(res => {
        console.log('Trip Updated Successfully,');
        navigation.goBack();
      })
      .catch(err => {
        console.log('Failed to update Trip', err?.response?.data || err);
      })
      .finally(() => {
        setIsLoading(false);
        navigation.goBack();
      });
  }

  const renderMember = ({item}) => (
    <TouchableOpacity
      style={styles.memberContainer}
      onPress={() => addBuddyHandler(item)}>
      <View style={styles.cancelBtn}>
        <Image source={cancel} style={{width: 16, height: 16}} />
      </View>
      <FastImage
        source={item.profile_image ? {uri: item.profile_image} : noDP}
        style={styles.dp}
      />
      <Text style={styles.username}>@{item.username}</Text>
    </TouchableOpacity>
  );

  const deleteAlert = () => {
    Alert.alert(
      `Delete ${tripName} ?`,
      `Are you sure you want to delete this trip?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            DELETE_TRIP();
          },
        },
      ],
      {cancelable: false},
    );
  };

  async function DELETE_TRIP() {
    const deleteTripURL = `${ENDPOINT.GET_PENDING_PAYMENTS}/${tripData?.trip?._id}`;

    setIsLoading(true);

    await axios
      .delete(deleteTripURL, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        setIsLoading(false);
        removeTripById(tripData?.trip?._id);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('could not delete trip:', err?.response?.data || err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function removeTripById(tripId) {
    navigation.navigate(SCREENS.TRIPS_LIST);

    setMyTrips(prevState => {
      const updatedTrips = prevState.trips.filter(trip => trip._id !== tripId);

      return {
        ...prevState,
        trips: updatedTrips,
      };
    });

    setMyAllTrips(prevState => {
      const updatedTrips = prevState.trips.filter(trip => trip._id !== tripId);

      return {
        ...prevState,
        trips: updatedTrips,
      };
    });
  }

  function addBuddyHandler(user) {
    const isUserInTrip = tripMembers?.some(member => member._id === user._id);

    if (!isUserInTrip) {
      setTripMembers(prevValue => [...prevValue, user]);
    } else {
      setTripMembers(prevValue =>
        prevValue.filter(member => member._id !== user._id),
      );
    }
  }

  return (
    <RegularBG>
      <Spinner visible={loading} color={COLORS.THANOS} />
      <View style={styles.topHeaderBox}>
        <BackButton title={'Edit Trip'} onPress={() => navigation.goBack()} />
        <TouchableOpacity onPress={deleteAlert}>
          <Text style={styles.deleteText}>Delete Trip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{marginTop: 14}} showsVerticalScrollIndicator={false}>
        <View style={{gap: 24}}>
          <View style={{gap: 8}}>
            <Text style={styles.label}>Trip Name</Text>
            <SmallTextInput
              placeholder={'Trip Name'}
              value={tripName}
              onChangeText={handleTripNameChange}
            />
            <Text style={styles.charsLeft}>{charsLeft} characters left</Text>
          </View>

          <DestinationInput
            tripDestinations={tripDestinations}
            setTripDestinations={setTripDestinations}
          />

          <View style={{gap: 8}}>
            <Text style={styles.label}>Trip Period</Text>
            <TouchableOpacity
              style={styles.tripPeriod}
              onPress={() => setShowCalendar(true)}>
              <Text
                style={
                  tripStartDate == '' && tripEndDate == ''
                    ? styles.tripPeriodTextPlace
                    : styles.tripPeriodText
                }>
                {tripStartDate == '' && tripEndDate == ''
                  ? 'Trip Period'
                  : `${new Date(tripStartDate).toDateString()} - ${new Date(
                      tripEndDate,
                    ).toDateString()}`}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{gap: 8}}>
            <Text style={styles.label}>Buddies</Text>
            <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
              <TouchableOpacity
                style={styles.addBuddiesBtn}
                onPress={() =>
                  navigation.navigate(SCREENS.BUDDY_SEARCH, {
                    isForChat: false,
                    isForTrip: true,
                  })
                }>
                <Image source={plus} style={{height: 32, width: 32}} />
              </TouchableOpacity>

              <FlatList
                data={tripMembers}
                renderItem={renderMember}
                keyExtractor={item => item._id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            </View>
          </View>

          <View style={{gap: 8}}>
            <Text style={styles.label}>Fund Goals</Text>
            <SmallTextInput
              placeholder={'$ Fund Goals'}
              keyboardType="numeric"
              value={fundGoals}
              onChangeText={handleFundText}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionBtn}>
        <ActionButton
          title={'Save & Update'}
          onPress={handleValidation}
          loading={loading}
        />
      </View>

      <StartDateSelection
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
        setShowCalendar2={setShowCalendar2}
        PickStartDate={PickStartDate}
        PickEndDate={PickEndDate}
        tripStartDate={tripStartDate}
      />

      <EndDateSelection
        showCalendar2={showCalendar2}
        setShowCalendar2={setShowCalendar2}
        tripStartDate={tripStartDate}
        tripEndDate={tripEndDate}
        PickEndDate={PickEndDate}
      />
    </RegularBG>
  );
};

export default EditTrip;

const styles = StyleSheet.create({
  actionBtn: {
    marginTop: 14,
    marginBottom: 14,
  },
  label: {
    color: '#f2f2f2',
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 13,
  },
  multiDestination: {
    width: '91%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  singleDestination: {
    // marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addDestination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addDestinationTextStyle: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: 'white',
  },
  charsLeft: {
    color: COLORS.VISION,
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 11,
    textAlign: 'right',
  },
  tripPeriod: {
    width: '100%',
    backgroundColor: COLORS.GREY_LIGHT,
    height: 50,
    borderRadius: 100,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  tripPeriodTextPlace: {
    fontSize: 14,
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.VISION,
  },
  tripPeriodText: {
    fontSize: 14,
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
  },
  topHeaderBox: {
    marginTop: 14,
    marginBottom: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  deleteText: {
    fontSize: 12,
    fontFamily: FONTS.MAIN_SEMI,
    color: COLORS.ERROR,
  },
  addBuddiesBtn: {
    borderWidth: 2,
    borderColor: COLORS.SWEDEN,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
  memberContainer: {
    marginRight: 16,
    flexDirection: 'Column',
    alignItems: 'center',
    gap: 4,
  },
  cancelBtn: {
    borderRadius: 100,
    backgroundColor: COLORS.ERROR,
    top: 16,
    right: -16,
    zIndex: 9999,
  },
  dp: {
    width: 48,
    height: 48,
    borderRadius: 1000,
  },
  username: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
    color: COLORS.LIGHT,
  },
  // **Modal destination
  destinationSafeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestedLocationText: {
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
    fontSize: 14,
  },
  suggestLocationContainer: {
    backgroundColor: '#3A3A3A',
    padding: 8,
    borderRadius: 10,
    marginTop: 8,
    maxHeight: 208,
  },
  destinationTextInput: {
    width: '90%',
    backgroundColor: COLORS.GREY_LIGHT,
    height: 50,
    borderRadius: 100,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 14,
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
  },
  destinationLocationInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GREY_LIGHT,
    height: 50,
    borderRadius: 100,
  },
  locationCloseBtn: {
    width: '50%',
    height: 48,
    backgroundColor: COLORS.LIGHT,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
  },
  tripPeriod2: {
    width: '100%',
    backgroundColor: COLORS.GREY_LIGHT,
    minHeight: 50,
    borderRadius: 100,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 10,
    paddingTop: 10,
  },
});
