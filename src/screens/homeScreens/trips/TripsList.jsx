import React, {useContext, useCallback, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import WideBG from '../../../components/background/WideBG';
import {AuthContext} from '../../../context/AuthContext';
import {useFocusEffect} from '@react-navigation/native';

import {COLORS, FONTS} from '../../../constants/theme/theme';
import TripListHeader from '../../../components/trip/TripListHeader';
import TripListCard from '../../../components/trip/TripListCard';
import SearchBar from '../../../components/home/SearchBar';

var searchIcon = require('../../../../assets/Images/search.png');
var close = require('../../../../assets/Images/close.png');
var plus = require('../../../../assets/Images/plus.png');
var bell = require('../../../../assets/Images/bell.png');

import useKeyboardStatus from '../../../config/useKeyboardStatus';
import NavigationService from '../../../config/NavigationService';
import {SCREENS} from '../../../constants/screens/screen';
import Spinner from 'react-native-loading-spinner-overlay';

const TripsList = () => {
  const isKeyboardVisible = useKeyboardStatus();

  const {
    GetTrips,
    myUserDetails,
    myTrips,
    loading,
    GetTripInvites,
    GetSentTripInvites,
    tripInvites,
    setTripMembers,
    tripsLoading,
  } = useContext(AuthContext);

  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [mySearchedTrips, setMySearchedTrips] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await GetTrips(myUserDetails?.user?._id, 'current', 1);
        await GetTripInvites(myUserDetails?.user?._id);
        await GetSentTripInvites(myUserDetails?.user?._id);
        setTripMembers([]);
      };

      fetchData();

      return () => {};
    }, []),
  );

  const handleSearch = query => {
    setSearchText(query);
    const filtered = myTrips?.trips.filter(trip =>
      trip.trip_name.toLowerCase().includes(query.toLowerCase()),
    );
    setMySearchedTrips(filtered);
  };

  const findFirstFutureTrip = trips => {
    const today = new Date();
    for (let trip of trips) {
      const tripEndingTime = new Date(trip.trip_ending_time);
      if (tripEndingTime > today) {
        return trip;
      }
    }
    return null;
  };

  const NextTrip = findFirstFutureTrip(myTrips?.trips);

  function compareStartingTimes(tripA, tripB) {
    const timeA = new Date(tripA.trip_starting_time).getTime();
    const timeB = new Date(tripB.trip_starting_time).getTime();
    return timeA - timeB;
  }

  myTrips?.trips?.sort(compareStartingTimes);

  const MapTheseTrips = searchText === '' ? myTrips?.trips : mySearchedTrips;

  let checkNotifications = tripInvites?.some(
    item => item?.status !== 'approved' && item?.status !== 'declined',
  );

  return (
    <WideBG>
      <Spinner visible={loading} color={COLORS.THANOS} size={'large'} />

      {showSearch && (
        <View style={styles.searchBarContainer}>
          <SearchBar
            autoFocus={true}
            searchValue={searchText}
            onChangeText={text => handleSearch(text)}
            onClear={() => {
              setSearchText('');
              setShowSearch(false);
            }}
          />
        </View>
      )}
      {MapTheseTrips?.length == 0 && !loading ? (
        <View style={styles.noTripsContainer}>
          <View style={{position: 'absolute', top: 16, right: 0}}>
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => {
                NavigationService.navigate('TripsStack', {
                  screen: SCREENS.TRIP_REQUESTS,
                });
              }}>
              {checkNotifications && <View style={styles.notificationDot} />}
              <Image source={bell} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          </View>
          <Image
            source={require('../../../../assets/Images/suitcase.png')}
            style={{width: 40, height: 40}}
          />
          <Text style={styles.noTripsText}>No Trips Yet</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                GetTrips(myUserDetails?.user?._id, 'current', 1);
                GetTripInvites(myUserDetails?.user?._id);
              }}
              color="#7879F1"
            />
          }>
          {NextTrip && (
            <>
              {!showSearch && <TripListHeader Trip={NextTrip} />}
              <View
                style={
                  showSearch
                    ? styles.searchTripCardBox
                    : styles.tripCardContainer
                }>
                <View style={styles.topBtnsContainer}>
                  <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabText}>My Trips</Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                    <TouchableOpacity
                      style={styles.searchBtn}
                      onPress={() =>
                        NavigationService.navigate('TripsStack', {
                          screen: SCREENS.TRIP_REQUESTS,
                        })
                      }>
                      {checkNotifications && (
                        <View style={styles.notificationDot} />
                      )}
                      <Image source={bell} style={{width: 20, height: 20}} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={showSearch ? styles.closeSearch : styles.searchBtn}
                      onPress={() => {
                        setShowSearch(prev => !prev);
                        setSearchText('');
                      }}>
                      <Image
                        source={showSearch ? close : searchIcon}
                        style={{width: 20, height: 20}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{gap: 10, marginTop: 20}}>
                  {MapTheseTrips?.map(data => (
                    <TripListCard
                      key={data?._id}
                      Trip={data}
                      onPress={() =>
                        NavigationService.navigate(SCREENS.VIEW_MY_TRIP, {
                          tripData: data,
                          isMyTrip:
                            data?.owner?._id == myUserDetails?.user?._id,
                        })
                      }
                    />
                  ))}
                </View>
              </View>
            </>
          )}

          <View style={{height: 110}} />
        </ScrollView>
      )}

      {!isKeyboardVisible && (
        <TouchableOpacity
          style={styles.addChatButton}
          onPress={() => {
            NavigationService.navigate(SCREENS.CREATE_TRIP);
          }}>
          <Image source={plus} style={{width: 32, height: 32}} />
        </TouchableOpacity>
      )}
    </WideBG>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    borderBottomWidth: 4,
    paddingBottom: 2,
    borderColor: COLORS.THANOS,
  },
  tabText: {
    fontFamily: FONTS.MAIN_SEMI,
    color: COLORS.LIGHT,
    fontSize: 20,
  },
  topBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 1000,
    backgroundColor: COLORS.GREY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeSearch: {
    width: 36,
    height: 36,
    borderRadius: 1000,
    backgroundColor: COLORS.ERROR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    width: '92%',
    marginTop: 14,
    alignSelf: 'center',
    marginBottom: 7,
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
    right: 16,
  },
  tripCardContainer: {
    width: '92%',
    alignSelf: 'center',
    marginTop: -16,
  },
  searchTripCardBox: {
    width: '92%',
    alignSelf: 'center',
    marginTop: 8,
  },
  notificationDot: {
    width: 5,
    height: 5,
    backgroundColor: COLORS.ERROR,
    borderRadius: 1000,
    position: 'absolute',
    top: 5,
    zIndex: 100,
    right: 10,
  },
  noTripsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '92%',
    alignSelf: 'center',
    position: 'relative',
  },
  noTripsText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 20,
    color: COLORS.VISION,
  },
});

export default TripsList;
