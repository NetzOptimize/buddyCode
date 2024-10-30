import React, {useEffect, useState, useCallback, useContext} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import RegularBG from '../../../components/background/RegularBG';
import BackButton from '../../../components/buttons/BackButton';
import LeaveTripButton from '../../../components/trip/View/LeaveTripButton';
import EditTripButton from '../../../components/trip/View/EditTripButton';
import TripNavigationBtns from '../../../components/trip/View/TripNavigationBtns';
import TripCoverImage from '../../../components/trip/View/TripCoverImage';

import {CommonActions} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import {
  fetchTripData,
  resetTripData,
} from '../../../redux/slices/tripDetailsSlice';
import {COLORS, FONTS} from '../../../constants/theme/theme';
import TripBudgetBar from '../../../components/trip/TripBudgetBar';
import TripBuddies from '../../../components/trip/View/TripBuddies';
import TripCard from '../../../components/trip/View/TripCard';
import CustomCalendar from '../../../components/calendar/CustomCalendar';
import TripBudget from './TripBudget';
import PaymentModal from '../../../components/trip/Payment/PaymentModal';
import {AuthContext} from '../../../context/AuthContext';
import axios from 'axios';
import {ENDPOINT} from '../../../constants/endpoints/endpoints';
import Toast from 'react-native-toast-message';
import {SCREENS} from '../../../constants/screens/screen';
import CreateEvent from '../../../components/trip/Events/CreateEvent';

var chatIcon = require('../../../../assets/Images/chat.png');
var plus = require('../../../../assets/Images/plus.png');

const ViewMyTrip = ({route, navigation}) => {
  const {tripData, isMyTrip} = route.params;

  const {
    isPaymentPending,
    selectedDate,
    setSelectedDate,
    authToken,
    setMyTrips,
    myUserDetails,
    setLocalGroupDetails,
    currentTab,
    setCurrentTab,
  } = useContext(AuthContext);

  const dispatch = useDispatch();

  const {tripInfo, loading, error} = useSelector(state => state.tripDetails);
  const [showAllEvents, setShowAllEvents] = useState(true);
  const [tripCover, setTripCover] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [createEvent, setCreateEvent] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (tripData?._id) {
        dispatch(fetchTripData(tripData?._id));
      }

      return () => {
        dispatch(resetTripData());
      };
    }, []),
  );

  const formatTripName = name => {
    const TripName =
      name?.charAt(0).toUpperCase() + name?.slice(1).toLowerCase();

    return TripName?.length > 16 ? TripName?.slice(0, 16) + '...' : TripName;
  };

  useEffect(() => {
    setTripCover(tripInfo?.trip?.trip_image);
  }, [tripInfo]);

  let myEventDates;

  if (tripInfo?.events?.length !== 0) {
    myEventDates = tripInfo?.events?.map(d => {
      return d;
    });
  }

  const leaveAlert = () => {
    Alert.alert(
      `Leave ${formatTripName(tripData.trip_name)} ?`,
      `Are you sure you want to leave this trip?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        {
          text: 'Leave',
          onPress: () => {
            LEAVE_TRIP();
          },
        },
      ],
      {cancelable: false},
    );
  };

  function LEAVE_TRIP() {
    axios({
      method: 'DELETE',
      url: `${ENDPOINT.LEAVE_TRIP}/${tripInfo?.trip?._id}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + authToken,
      },
    })
      .then(res => {
        removeTripById(tripInfo?.trip?._id);

        Toast.show({
          type: 'info',
          text1: 'Trip Left',
          text2: `You left the trip "${tripData?.trip_name}".`,
        });
      })
      .catch(err => {
        console.log('could not leave trip', err?.response?.data, err);

        Toast.show({
          type: 'error',
          text2: 'Could Not Remove Buddy',
        });
      });
  }

  function removeTripById(tripId) {
    setMyTrips(prevState => {
      const updatedTrips = prevState.trips.filter(trip => trip._id !== tripId);

      return {
        ...prevState,
        trips: updatedTrips,
      };
    });
    navigation.goBack();
  }

  const [completedEvents, setCompletedEvents] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    // Filter completed, today, and upcoming events
    const completed = [];
    const today = [];
    const upcoming = [];
    const currentDate = new Date();

    tripInfo?.events?.forEach(event => {
      const eventDate = new Date(event.event_date);
      const endTime = new Date(event.end_time);

      const currentDateWithoutTime = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const eventDateWithoutTime = eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      // Check if event date and time are passed
      const isEventDatePassed =
        currentDateWithoutTime > eventDateWithoutTime ||
        (currentDate.toDateString() === eventDate.toDateString() &&
          currentDate.getHours() > endTime.getHours()) ||
        (currentDate.toDateString() === eventDate.toDateString() &&
          currentDate.getHours() === endTime.getHours() &&
          currentDate.getMinutes() > endTime.getMinutes());

      const isEventToday =
        currentDate.toDateString() === eventDate.toDateString();

      if (isEventDatePassed) {
        completed.push(event);
      } else if (isEventToday) {
        today.push(event);
      } else {
        upcoming.push(event);
      }
    });

    // Sort today and upcoming events
    today.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    upcoming.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

    setCompletedEvents(completed);
    setTodayEvents(today);
    setUpcomingEvents(upcoming);
  }, [tripInfo?.events]);

  const filterTodayEvents = todayEvents?.filter(event => {
    const eventDate = event.event_date.split('T')[0];
    return eventDate === selectedDate;
  });

  const filterCompletedEvents = completedEvents?.filter(event => {
    const eventDate = event.event_date.split('T')[0];
    return eventDate === selectedDate;
  });

  const filterUpcomingEvents = upcomingEvents?.filter(event => {
    const eventDate = event.event_date.split('T')[0];
    return eventDate === selectedDate;
  });

  let EventBuddies = [tripInfo?.trip?.owner];

  tripInfo?.trip?.members?.forEach(element => {
    EventBuddies.push(element);
  });

  function handleOpenGroupChat(tripinfo) {
    const url = `${ENDPOINT.GET_CHAT}/${myUserDetails?.user?._id}`;

    axios
      .get(url, {
        params: {
          chatId: tripinfo?.trip?.chatId,
        },
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        console.log('get chat data success');
        setLocalGroupDetails({
          chatData: res.data.data.chat,
          tripId: res.data.data.trip_id._id,
        });
        navigation.navigate(SCREENS.GROUP_CHAT);
      })
      .catch(err => {
        console.log('Failed to get chat', err?.response?.data || err);
      });
  }

  return (
    <RegularBG>
      <View style={styles.headerContainer}>
        <BackButton
          title={formatTripName(
            tripInfo ? tripInfo?.trip.trip_name : tripData.trip_name,
          )}
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: SCREENS.TRIPS_LIST}],
              }),
            );
          }}
        />
        {isMyTrip ? (
          <EditTripButton
            onPress={() =>
              navigation.navigate(SCREENS.EDIT_TRIP, {
                tripData: tripInfo,
              })
            }
          />
        ) : (
          <LeaveTripButton onPress={leaveAlert} />
        )}
      </View>
      <TripNavigationBtns
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      {!loading && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => dispatch(fetchTripData(tripData?._id))}
              color="#7879F1"
            />
          }>
          {currentTab == 0 && (
            <View style={{marginTop: 16}}>
              <TripCoverImage
                tripData={tripInfo}
                source={tripCover}
                setSource={setTripCover}
                tripInfo={tripInfo}
              />

              {tripInfo && (
                <>
                  <View style={{marginTop: 30}}>
                    <Text style={styles.label}>Buddies</Text>
                    <TripBuddies tripData={tripInfo?.trip} />
                  </View>

                  <TouchableOpacity
                    style={styles.chatBtn}
                    onPress={() => handleOpenGroupChat(tripInfo)}>
                    <Image source={chatIcon} style={{width: 20, height: 20}} />
                    <Text style={styles.chatBtnText}>Group Chat</Text>
                  </TouchableOpacity>

                  <Text style={styles.infoBudget}>Budget</Text>
                  <TripBudgetBar tripInfo={tripInfo} />
                </>
              )}
            </View>
          )}

          {currentTab == 1 && (
            <View style={{marginTop: 16}}>
              {tripInfo && (
                <>
                  <TripBudget tripInfo={tripInfo} />
                </>
              )}
            </View>
          )}

          {currentTab == 2 && (
            <View style={{marginTop: 16}}>
              {tripInfo && (
                <>
                  <CustomCalendar
                    minDate={tripInfo?.trip?.trip_starting_time}
                    maxDate={tripInfo?.trip?.trip_ending_time}
                    eventDates={myEventDates}
                    setShowAllEvents={setShowAllEvents}
                  />

                  {tripInfo?.events?.length !== 0 && (
                    <TouchableOpacity
                      style={styles.viewAllEventsBtn}
                      onPress={() => {
                        setShowAllEvents(true);
                        setSelectedDate(null);
                      }}>
                      <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                  )}

                  {(showAllEvents
                    ? todayEvents.length > 0
                    : filterTodayEvents.length > 0) && (
                    <View style={styles.dividerContainer}>
                      <View style={styles.hr} />
                      <Text style={styles.eventLabel}>On going Events</Text>
                      <View style={styles.hr} />
                    </View>
                  )}

                  <View style={{gap: 16, marginTop: 16}}>
                    {todayEvents.length > 0 &&
                      (showAllEvents ? todayEvents : filterTodayEvents).map(
                        data => (
                          <TripCard
                            key={data?._id}
                            eventData={data}
                            tripInfo={tripInfo}
                          />
                        ),
                      )}
                  </View>

                  {(showAllEvents
                    ? upcomingEvents.length > 0
                    : filterUpcomingEvents.length > 0) && (
                    <View style={styles.dividerContainer}>
                      <View style={[styles.hr, {width: '25%'}]} />
                      <Text style={styles.eventLabel}>Up Coming Events</Text>
                      <View style={[styles.hr, {width: '25%'}]} />
                    </View>
                  )}

                  <View style={{gap: 16, marginTop: 16}}>
                    {upcomingEvents.length > 0 &&
                      (showAllEvents
                        ? upcomingEvents
                        : filterUpcomingEvents
                      ).map(data => (
                        <TripCard
                          key={data?._id}
                          eventData={data}
                          tripInfo={tripInfo}
                        />
                      ))}
                  </View>

                  {(showAllEvents
                    ? completedEvents.length > 0
                    : filterCompletedEvents.length > 0) && (
                    <View style={styles.dividerContainer}>
                      <View style={[styles.hr, {width: '30%'}]} />
                      <Text style={styles.eventLabel}>Past Events</Text>
                      <View style={[styles.hr, {width: '30%'}]} />
                    </View>
                  )}

                  <View style={{gap: 16, marginTop: 16}}>
                    {completedEvents.length > 0 &&
                      (showAllEvents
                        ? completedEvents
                        : filterCompletedEvents
                      ).map(data => (
                        <TripCard
                          key={data?._id}
                          eventData={data}
                          tripInfo={tripInfo}
                          isComplete={true}
                          EventBuddies={EventBuddies}
                        />
                      ))}
                  </View>
                </>
              )}
            </View>
          )}

          <View style={{height: 110}} />
        </ScrollView>
      )}

      {currentTab == 1 && (
        <View style={styles.paymentBtnsContainer}>
          <TouchableOpacity style={styles.viewPaymentButton}>
            <Text style={styles.viewPaymentText}>View My Payments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addPaymentButton}
            onPress={() => setShowPaymentModal(true)}>
            {isPaymentPending && <View style={styles.redDot} />}
            <Text style={styles.addPaymentText}>Add Payment</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentTab == 2 && (
        <TouchableOpacity
          style={styles.addChatButton}
          onPress={() => setCreateEvent(true)}>
          <Image source={plus} style={{width: 32, height: 32}} />
        </TouchableOpacity>
      )}

      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        tripId={tripInfo?.trip?._id}
      />

      <CreateEvent
        visible={createEvent}
        onClose={() => setCreateEvent(false)}
        minDate={tripInfo?.trip?.trip_starting_time}
        maxDate={tripInfo?.trip?.trip_ending_time}
        tripId={tripInfo?.trip?._id}
        EventBuddies={EventBuddies}
      />
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatBtn: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.LIGHT,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 20,
  },
  chatBtnText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.GREY_DARK,
  },
  label: {
    marginBottom: 10,
    color: COLORS.LIGHT,
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 16,
  },
  infoBudget: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 16,
    color: COLORS.LIGHT,
    marginTop: 16,
  },
  addChatButton: {
    width: 44,
    height: 44,
    backgroundColor: '#7879F1',
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'absolute',
    bottom: 116,
    right: 0,
  },
  paymentBtnsContainer: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 16,
  },
  addPaymentButton: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 100,
    alignSelf: 'center',
    position: 'relative',
  },
  viewPaymentButton: {
    backgroundColor: '#646464',
    padding: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 100,
    alignSelf: 'center',
    position: 'relative',
  },
  addPaymentText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.GREY_LIGHT,
  },
  viewPaymentText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  redDot: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.ERROR,
    borderRadius: 100,
    position: 'absolute',
    right: 16,
    top: 8,
  },
  viewAllText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: 'white',
  },
  viewAllEventsBtn: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.THANOS,
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 1000,
  },

  hr: {
    width: '30%',
    backgroundColor: COLORS.SWEDEN,
    height: 0.5,
    marginTop: 2,
    borderRadius: 1000,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  eventLabel: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.SWEDEN,
  },
});

export default ViewMyTrip;
