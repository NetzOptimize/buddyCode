import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  RefreshControl,
} from 'react-native';
import RegularBG from '../../../components/background/RegularBG';
import BackButton from '../../../components/buttons/BackButton';
import LeaveTripButton from '../../../components/trip/View/LeaveTripButton';
import EditTripButton from '../../../components/trip/View/EditTripButton';
import TripNavigationBtns from '../../../components/trip/View/TripNavigationBtns';
import TripCoverImage from '../../../components/trip/View/TripCoverImage';

import {useDispatch, useSelector} from 'react-redux';
import {
  fetchTripData,
  resetTripData,
} from '../../../redux/slices/tripDetailsSlice';
import {COLORS, FONTS} from '../../../constants/theme/theme';
import TripBudgetBar from '../../../components/trip/TripBudgetBar';
import TripBuddies from '../../../components/trip/View/TripBuddies';
import MyOptionsBtn from '../../../components/profileComponents/MyOptionsBtn';
import TripCardOptions from '../../../components/trip/View/TripCardOptions';
import TripCard from '../../../components/trip/View/TripCard';
import CustomCalendar from '../../../components/calendar/CustomCalendar';
import TripBudget from './TripBudget';

var chatIcon = require('../../../../assets/Images/chat.png');

const ViewMyTrip = ({route, navigation}) => {
  const {tripData, isMyTrip} = route.params;

  const dispatch = useDispatch();

  const {tripInfo, loading, error} = useSelector(state => state.tripDetails);
  const [showAllEvents, setShowAllEvents] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [tripCover, setTripCover] = useState(null);

  useEffect(() => {
    if (tripData?._id) {
      dispatch(fetchTripData(tripData?._id));
    }

    return () => {
      dispatch(resetTripData());
    };
  }, [dispatch, tripData]);

  const formatTripName = name => {
    const TripName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    return TripName.length > 19 ? TripName.slice(0, 19) + '...' : TripName;
  };

  useEffect(() => {
    setTripCover(tripData?.trip_image);
  }, [tripData]);

  let myEventDates;

  if (tripInfo?.events?.length !== 0) {
    myEventDates = tripInfo?.events?.map(d => {
      return d;
    });
  }

  return (
    <RegularBG>
      <View style={styles.headerContainer}>
        <BackButton
          title={formatTripName(tripData.trip_name)}
          onPress={() => navigation.goBack()}
        />
        {isMyTrip ? <EditTripButton /> : <LeaveTripButton />}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchTripData(tripData?._id))}
            color="#7879F1"
          />
        }>
        <TripNavigationBtns
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />

        {currentTab == 0 && (
          <View style={{marginTop: 16}}>
            <TripCoverImage
              tripData={tripData}
              source={tripCover}
              setSource={setTripCover}
            />

            {tripInfo && (
              <>
                <View style={{marginTop: 30}}>
                  <Text style={styles.label}>Buddies</Text>
                  <TripBuddies tripData={tripData} />
                </View>

                <TouchableOpacity
                  style={styles.chatBtn}
                  onPress={() => console.log(tripData.chatId)}>
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
            <CustomCalendar
              minDate={tripInfo?.trip?.trip_starting_time}
              maxDate={tripInfo?.trip?.trip_ending_time}
              eventDates={myEventDates}
              setShowAllEvents={setShowAllEvents}
            />

            {tripInfo?.events?.map(data => (
              <TripCard key={data?._id} eventData={data} tripInfo={tripInfo} />
            ))}
          </View>
        )}

        <View style={{height: 110}} />
      </ScrollView>
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
});

export default ViewMyTrip;
