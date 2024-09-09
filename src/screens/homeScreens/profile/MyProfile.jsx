import React, {useContext, useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

// **context
import {AuthContext} from '../../../context/AuthContext';

// **components
import RegularBG from '../../../components/background/RegularBG';
import SearchButton from '../../../components/buttons/SearchButton';
import MyOptionsBtn from '../../../components/profileComponents/MyOptionsBtn';

// **theme
import {COLORS, FONTS} from '../../../constants/theme/theme';
import ProfileImage from '../../../components/profileComponents/ProfileImage';
import UserPreferences from '../../../components/profileComponents/UserPreferences';
import UserMeta from '../../../components/profileComponents/UserMeta';

// **3rd party imports
import Spinner from 'react-native-loading-spinner-overlay';
import ProfileTripCard from '../../../components/profileComponents/ProfileTripCard';
// import CommentBottomSheet from '../../../components/profileComponents/CommentBottomSheet';

// **redux
import {useDispatch} from 'react-redux';
import {fetchTripComments} from '../../../redux/slices/tripCommentsSlice';
import CommentBottomSheet from '../../../components/profileComponents/CommentBottomSheet';
import NavigationService from '../../../config/NavigationService';

const MyProfile = () => {
  const {
    myUserDetails,
    logoutLoader,
    myAllTrips,
    loading,
    VerifyToken,
    authToken,
    GetAllTrips,
  } = useContext(AuthContext);

  const dispatch = useDispatch();

  const [page, setPage] = useState(2);
  const [showComments, setShowComments] = useState(false);

  const handleViewComments = tripId => {
    dispatch(fetchTripComments(tripId)).then(() => {
      setShowComments(true);
    });
  };

  function getFullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
  }

  useFocusEffect(
    useCallback(() => {
      VerifyToken(authToken);
    }, [authToken]),
  );

  const [showProfileImage, setShowProfileImage] = useState(false);

  return (
    <>
      <RegularBG>
        <Spinner visible={logoutLoader} color={COLORS.THANOS} size={'large'} />
        <View style={{marginTop: 14}}>
          <SearchButton
            onPress={() =>
              NavigationService.navigate('BuddySearch', {
                isForChat: false,
                isForTrip: false,
              })
            }
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => VerifyToken(authToken)}
              color="#7879F1"
            />
          }>
          <MyOptionsBtn />

          <View style={styles.userDetailsContainer}>
            <ProfileImage
              source={myUserDetails?.user?.profile_image}
              onPress={() => setShowProfileImage(true)}
              showProfileImage={showProfileImage}
              handleClose={() => setShowProfileImage(false)}
            />

            <Text style={styles.name}>
              {getFullName(
                myUserDetails?.user?.first_name,
                myUserDetails?.user?.last_name,
              )}
            </Text>
            <Text style={styles.username}>
              @{myUserDetails?.user?.username}
            </Text>

            <UserPreferences preferences={myUserDetails?.user?.preferences} />
          </View>

          <View style={styles.hr} />

          <UserMeta
            userData={myUserDetails}
            tripCount={myAllTrips?.trips?.length}
            myMeta={true}
          />

          <View style={styles.homeTripCardContainer}>
            {myAllTrips?.trips?.map((trip, i) => {
              return (
                <ProfileTripCard
                  tripData={trip}
                  key={i}
                  viewComments={() => handleViewComments(trip._id)}
                />
              );
            })}
          </View>

          {myAllTrips.hasNextPage && (
            <TouchableOpacity
              style={{alignSelf: 'center', margin: 16}}
              onPress={() => {
                setPage(page + 1);
                GetAllTrips(myUserDetails?.user?._id, page);
              }}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          )}

          <View style={{height: 104}} />
        </ScrollView>
      </RegularBG>
      <CommentBottomSheet
        visible={showComments}
        onClose={() => {
          setShowComments(false);
          VerifyToken(authToken);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  userDetailsContainer: {
    marginTop: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  name: {
    fontFamily: FONTS.MAIN_SEMI,
    color: COLORS.LIGHT,
    fontSize: 14,
    marginTop: 12,
  },
  username: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 10,
    color: COLORS.LIGHT,
    marginTop: 6,
  },
  hr: {
    height: 1,
    backgroundColor: '#969696',
    width: '100%',
    alignSelf: 'center',
    margin: 16,
    borderRadius: 1000,
  },
  homeTripCardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 26,
    gap: 8,
  },
  loadMoreText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.HULK,
  },
});

export default MyProfile;
