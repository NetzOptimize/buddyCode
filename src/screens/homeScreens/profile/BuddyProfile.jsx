import React, {useContext, useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  BackHandler,
  Image,
  Touchable,
  TouchableOpacity,
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

var lock = require('../../../../assets/Images/lock.png');

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
  } = useContext(AuthContext);
  const {buddyData} = route.params;

  const dispatch = useDispatch();
  const {buddyDetails, loading} = useSelector(state => state.buddyDetails);

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
      dispatch(
        fetchBuddyDetails(buddyData?.id ? buddyData?.id : buddyData?._id),
      );
      GetBuddyTrips(buddyData?.id ? buddyData?.id : buddyData?._id);
      VerifyToken(authToken);

      setIsRequested(
        sentFollowReq.some(
          user => user._id === (buddyData?.id ? buddyData?.id : buddyData?._id),
        ),
      );
    }, [buddyData?.id]),
  );

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
    console.log(buddyId);

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

      if (response.data.data.status !== 'pending') {
        setIsFollowed(prevValue => !prevValue);
      } else if (response.data.data.status == 'pending') {
        setIsRequested(true);
      }

      dispatch(fetchBuddyDetails(buddyId));
    } catch (error) {
      console.log(
        'Failed to follow or unfollow:',
        error.response.data,
        ENDPOINT.FOLLOW_USER,
        userData,
      );
    } finally {
      setFollowLoading(false);
    }
  }

  let isPrivate = buddyDetails?.user?.is_private;

  return (
    <RegularBG>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.backOpContainer}>
          <BackButton onPress={handleBackPress} />
          <View style={styles.actionButtonsBox}>
            {isRequested ? (
              <RequestedButton />
            ) : isFollowed ? (
              <FollowedButton
                onPress={() =>
                  handleFollowUnfollow(
                    buddyData?.id ? buddyData?.id : buddyData?._id,
                  )
                }
                loading={followLoading}
                disabled={followLoading}
              />
            ) : (
              <FollowButton
                onPress={() =>
                  handleFollowUnfollow(
                    buddyData?.id ? buddyData?.id : buddyData?._id,
                  )
                }
                loading={followLoading}
                disabled={followLoading}
              />
            )}
            <BuddyOptionsBtn />
          </View>
        </View>

        <View style={styles.userDetailsContainer}>
          <ProfileImage
            source={buddyData.profile_image}
            onPress={() => setShowProfileImage(true)}
            showProfileImage={showProfileImage}
            handleClose={() => setShowProfileImage(false)}
          />

          <Text style={styles.name}>
            {getFullName(buddyData?.first_name, buddyData?.last_name)}
          </Text>

          <Text style={styles.username}>@{buddyData?.username}</Text>
        </View>

        <View>
          {loading ? (
            <View style={{marginTop: 24}}>
              <ActivityIndicator color={COLORS.THANOS} size={'large'} />
            </View>
          ) : (
            <>
              {!isPrivate && (
                <UserPreferences
                  preferences={buddyDetails?.user?.preferences}
                />
              )}
              <View style={styles.hr} />

              <UserMeta
                userData={buddyDetails}
                tripCount={buddyTrips.length}
                myMeta={false}
                isPrivate={isPrivate}
              />

              {!isPrivate && (
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

              {isPrivate && (
                <View style={{gap: 16, alignItems: 'center', marginTop: 80}}>
                  <Image source={lock} style={{width: 80, height: 80}} />

                  <View style={{gap: 8}}>
                    <Text style={styles.privateTitle1}>
                      This Account is Private
                    </Text>
                    <Text style={styles.privateTitle2}>
                      Follow this account to see their Trips.
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
  },
  privateTitle2: {
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
    fontSize: 12,
  },
});

export default BuddyProfile;
