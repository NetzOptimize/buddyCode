import React, {useContext, useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  BackHandler,
  Image,
  RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import {
  fetchBuddyDetails,
  resetBuddyDetails,
} from '../../../redux/slices/buddyDetailsSlice';

// ** components
import RegularBG from '../../../components/background/RegularBG';
import ProfileImage from '../../../components/profileComponents/ProfileImage';
import BackButton from '../../../components/buttons/BackButton';
import BuddyOptionsBtn from '../../../components/profileComponents/BuddyOptionsBtn';
import FollowedButton from '../../../components/buttons/FollowedButton';
import FollowButton from '../../../components/buttons/FollowButton';
import ProfileTripCard from '../../../components/profileComponents/ProfileTripCard';
import UserPreferences from '../../../components/profileComponents/UserPreferences';
import UserMeta from '../../../components/profileComponents/UserMeta';

// ** custom theme
import {COLORS, FONTS} from '../../../constants/theme/theme';

// ** context
import {AuthContext} from '../../../context/AuthContext';
import BlockUserModal from '../../../components/modal/BlockUserModal';
import ReportUserModal from '../../../components/modal/ReportUserModal';
import {ENDPOINT} from '../../../constants/endpoints/endpoints';
import axios from 'axios';
import RequestedButton from '../../../components/buttons/RequestedButton';
import CommentBottomSheet from '../../../components/profileComponents/CommentBottomSheet';
import {fetchTripComments} from '../../../redux/slices/tripCommentsSlice';
import Toast from 'react-native-toast-message';

var lock = require('../../../../assets/Images/lock.png');
var block = require('../../../../assets/Images/block.png');

const BuddyProfile = ({route, navigation}) => {
  const {
    buddyTrips,
    setBuddyTrips,
    showBlockReportPopUp,
    setShowBlockReportPopUp,
    GetBuddyTrips,
    authToken,
    VerifyToken,
    setBlockUserData,
    sentFollowReq,
    GetSentFollowRequests,
    showComments,
    setShowComments,
  } = useContext(AuthContext);
  const {buddyData} = route.params;

  const dispatch = useDispatch();
  const {buddyDetails, loading} = useSelector(state => state.buddyDetails);
  const {blockedUsers} = useSelector(state => state.blockedUsers);

  const handleViewComments = tripId => {
    dispatch(fetchTripComments(tripId)).then(() => {
      setShowComments(true);
    });
  };

  useEffect(() => {
    if (
      (showBlockReportPopUp.type == 'block' ||
        showBlockReportPopUp.type == 'report') &&
      showBlockReportPopUp.state
    ) {
      setBlockUserData(buddyDetails);
    } else {
      setBlockUserData(null);
    }
  }, [showBlockReportPopUp]);

  const [showProfileImage, setShowProfileImage] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  function getFullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
  }

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [buddyData?.id ? buddyData?.id : buddyData?._id]),
  );

  async function reload() {
    dispatch(fetchBuddyDetails(buddyData?.id ? buddyData?.id : buddyData?._id));
    await GetBuddyTrips(buddyData?.id ? buddyData?.id : buddyData?._id);
    await VerifyToken(authToken);
    setIsRequested(
      sentFollowReq.some(
        user => user._id === (buddyData?.id ? buddyData?.id : buddyData?._id),
      ),
    );
  }

  useEffect(() => {
    if (
      buddyDetails?.user?.status == 'inactive' ||
      buddyDetails?.user?.is_deleted
    ) {
      Toast.show({
        type: 'info',
        text1: 'Account inactive or deleted',
        text2: 'This buddypass account is either inactive or deleted',
      });

      handleBackPress();
    }

    setIsFollowed(buddyDetails?.isFollowing);
  }, [buddyDetails]);

  useEffect(() => {
    const backAction = () => {
      dispatch(resetBuddyDetails());
      setBuddyTrips([]);
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [dispatch, navigation, setBuddyTrips]);

  const handleBackPress = () => {
    dispatch(resetBuddyDetails());
    setBuddyTrips([]);
    navigation.goBack();
  };

  async function handleFollowUnfollow(buddyId) {
    const userData = {
      followee: buddyId,
    };

    setFollowLoading(true);

    try {
      const response = await axios({
        method: 'POST',
        url: ENDPOINT.FOLLOW_USER,
        data: userData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
      });

      const status = response.data.data.status;

      if (status !== 'pending') {
        setIsFollowed(prevValue => !prevValue);
      } else {
        setIsRequested(true);
      }

      GetSentFollowRequests();
      dispatch(fetchBuddyDetails(buddyId));
    } catch (error) {
      console.error('Failed to follow or unfollow', error);
    } finally {
      setFollowLoading(false);
    }
  }

  async function unFollow(buddyId) {
    const data = {
      followee: buddyId,
    };

    try {
      const response = await axios.post(ENDPOINT.UNFOLLOW_USER, data, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      });

      setIsFollowed(prevValue => !prevValue);
      setIsRequested(false);
      GetSentFollowRequests();
    } catch (err) {
      console.log('Failed to take action', err?.response?.data || err);
    }
  }

  async function removeReq(buddyId) {
    const data = {
      followee: buddyId,
    };

    try {
      const response = await axios.post(ENDPOINT.UNFOLLOW_USER, data, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      });

      console.log('removed request', response.data);
      setIsRequested(false);
    } catch (err) {
      console.log('Failed to take action', err?.response?.data || err);
    }
  }

  const checkThisId = buddyData?.id ? buddyData?.id : buddyData?._id;
  let isPrivate = isFollowed ? false : buddyDetails?.user?.is_private;
  let isBlocked = blockedUsers.some(item => item._id === checkThisId);

  return (
    <RegularBG>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => reload()}
            color="#7879F1"
          />
        }>
        <View style={styles.backOpContainer}>
          <BackButton onPress={handleBackPress} />
          {isBlocked ? (
            <BuddyOptionsBtn
              isBlocked={isBlocked}
              buddyDetails={buddyDetails}
            />
          ) : (
            <View style={styles.actionButtonsBox}>
              {isRequested && !isFollowed ? (
                <RequestedButton
                  onPress={() =>
                    removeReq(buddyData?.id ? buddyData?.id : buddyData?._id)
                  }
                />
              ) : isFollowed ? (
                <FollowedButton
                  onPress={() =>
                    unFollow(buddyData?.id ? buddyData?.id : buddyData?._id)
                  }
                  loading={followLoading}
                  disabled={followLoading}
                />
              ) : (
                <FollowButton
                  onPress={() => handleFollowUnfollow(buddyDetails?.user?.id)}
                  loading={followLoading}
                  disabled={followLoading}
                />
              )}
              <BuddyOptionsBtn />
            </View>
          )}
        </View>

        <View style={styles.userDetailsContainer}>
          <ProfileImage
            source={buddyDetails?.user?.profile_image}
            showProfileImage={showProfileImage}
            onPress={() => setShowProfileImage(true)}
            handleClose={() => setShowProfileImage(false)}
          />

          {!loading && (
            <>
              <Text style={styles.name}>
                {getFullName(
                  buddyDetails?.user?.first_name,
                  buddyDetails?.user?.last_name,
                )}
              </Text>
              <Text style={styles.username}>
                @{buddyDetails?.user?.username}
              </Text>
            </>
          )}
        </View>

        <View>
          {loading ? (
            <View style={{marginTop: 24}}>
              <ActivityIndicator color={COLORS.THANOS} size={'large'} />
            </View>
          ) : (
            <>
              {isPrivate || isBlocked ? null : (
                <UserPreferences
                  preferences={buddyDetails?.user?.preferences}
                />
              )}
              <View style={styles.hr} />

              <UserMeta
                userData={buddyDetails}
                tripCount={buddyTrips.length}
                myMeta={false}
                isPrivate={isPrivate || isBlocked}
              />

              {isPrivate || isBlocked ? null : buddyTrips.length == 0 ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: 94,
                  }}>
                  <Image
                    source={require('../../../../assets/Images/suitcase.png')}
                    style={{width: 40, height: 40}}
                  />
                  <Text style={styles.noTripsText}>No Trips Yet</Text>
                </View>
              ) : (
                <View style={styles.homeTripCardContainer}>
                  {buddyTrips.map((trip, i) => (
                    <ProfileTripCard
                      tripData={trip}
                      key={i}
                      viewComments={() => handleViewComments(trip._id)}
                    />
                  ))}
                </View>
              )}

              {(isPrivate || isBlocked) && (
                <View style={{gap: 16, alignItems: 'center', marginTop: 80}}>
                  <Image
                    source={isBlocked ? block : lock}
                    style={{width: 80, height: 80}}
                  />

                  <View style={{gap: 8}}>
                    <Text style={styles.privateTitle1}>
                      {isBlocked
                        ? `You've Blocked this account`
                        : 'This Account is Private'}
                    </Text>
                    <Text style={styles.privateTitle2}>
                      {isBlocked
                        ? `Unblock this account to see their Trips`
                        : 'Follow this account to see their Trips.'}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
        <View style={{height: 104}} />
      </ScrollView>

      <BlockUserModal
        visible={
          showBlockReportPopUp.type == 'block' && showBlockReportPopUp.state
        }
        onClose={() =>
          setShowBlockReportPopUp({
            type: null,
            state: false,
          })
        }
      />

      <ReportUserModal
        visible={
          showBlockReportPopUp.type == 'report' && showBlockReportPopUp.state
        }
        onClose={() =>
          setShowBlockReportPopUp({
            type: null,
            state: false,
          })
        }
        reportThisUser={buddyDetails}
      />

      <CommentBottomSheet
        visible={showComments}
        onClose={() => {
          setShowComments(false);
        }}
      />
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  backOpContainer: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButtonsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
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
  privateTitle1: {
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
    fontSize: 20,
    textAlign: 'center',
  },
  privateTitle2: {
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
    fontSize: 12,
    textAlign: 'center',
  },
  noTripsText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 20,
    color: COLORS.VISION,
    textAlign: 'center',
  },
});

export default BuddyProfile;
