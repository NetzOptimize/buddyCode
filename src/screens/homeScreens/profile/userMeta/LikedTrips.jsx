import React, {useContext, useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import RegularBG from '../../../../components/background/RegularBG';
import BackButton from '../../../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../../../constants/theme/theme';
import FastImage from 'react-native-fast-image';

var placeholderImg = require('../../../../../assets/Images/placeholderIMG.png');

var placeholderImg = require('../../../../../assets/Images/placeholderIMG.png');
var heart = require('../../../../../assets/Images/heart.png');
var redHeart = require('../../../../../assets/Images/redHeart.png');
var comment = require('../../../../../assets/Images/comment.png');
var noDP = require('../../../../../assets/Images/noDP.png');
var bpUser = require('../../../../../assets/Images/noDP.png');
var location = require('../../../../../assets/Images/location.png');

import LottieView from 'lottie-react-native';
import {AuthContext} from '../../../../context/AuthContext';
import axios from 'axios';
import {ENDPOINT} from '../../../../constants/endpoints/endpoints';
import CommentBottomSheet from '../../../../components/profileComponents/CommentBottomSheet';
import {fetchTripComments} from '../../../../redux/slices/tripCommentsSlice';
import {useDispatch} from 'react-redux';

const HeaderTabs = ({onBack, activeTab, setActiveTab}) => {
  const handleTabChange = tabName => {
    setActiveTab(tabName);
  };

  return (
    <View style={styles.tabContainer}>
      <View style={{width: '11%'}}>
        <BackButton onPress={onBack} />
      </View>

      <View style={styles.tabButtons}>
        <TouchableOpacity onPress={() => handleTabChange('trips')}>
          <Text
            style={
              activeTab == 'trips' ? styles.tabTextActive : styles.tabText
            }>
            Trips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('comments')}>
          <Text
            style={
              activeTab == 'comments' ? styles.tabTextActive : styles.tabText
            }>
            Comments
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const LikedTripCard = ({tripData, isMyData}) => {
  const {myUserDetails, authToken, VerifyToken} = useContext(AuthContext);

  const dispatch = useDispatch();

  const [tripState, setTripState] = useState(tripData);
  const [showComments, setShowComments] = useState(false);

  const handleViewComments = tripId => {
    dispatch(fetchTripComments(tripId)).then(() => {
      setShowComments(true);
    });
  };

  const [like, setLike] = useState(true);
  const [showAni, setShowAni] = useState(false);

  useEffect(() => {
    setTripState(tripData);
    setLike(true);
  }, [tripData, myUserDetails]);

  let tripMembers = [];

  tripData?.members?.forEach(element => {
    tripMembers?.push(element);
  });

  const formatTripName = name => {
    return name?.charAt(0)?.toUpperCase() + name?.slice(1)?.toLowerCase();
  };

  function LikeTrip() {
    setLike(prev => !prev);

    if (!like) {
      setShowAni(true);
    }

    const updatedTripData = {
      ...tripState,
      likes_count: !like
        ? tripState?.likes_count + 1
        : tripState?.likes_count - 1,
    };

    setTripState(updatedTripData);

    LikeUnlikeFN();
  }

  function LikeUnlikeFN() {
    const AddCommentURL = ENDPOINT.LIKE_TRIP;

    const formData = new FormData();
    formData.append('trip_id', tripState?._id);
    formData.append('user_id', myUserDetails?.user?._id);
    formData.append('username', myUserDetails?.user?.username);

    axios
      .post(AddCommentURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + authToken,
        },
        timeout: 10000,
      })
      .then(() => {})
      .catch(err => {
        console.log('failed to perform action', err.response.data);
      });
  }

  const destination = tripState?.destination[0];
  const isLong = destination?.length > 20;
  const displayDestination = isLong
    ? destination.slice(0, 20) + '...'
    : destination;

  return (
    <View style={styles.CardContainer}>
      <TouchableOpacity>
        <FastImage
          source={placeholderImg}
          style={styles.coverImgStyle}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>

      <View style={{padding: 8}}>
        {isMyData && (
          <View style={styles.actionBtnContainer}>
            <TouchableOpacity style={styles.iconBox} onPress={LikeTrip}>
              {showAni ? (
                <View style={{position: 'absolute', right: -4.2}}>
                  <LottieView
                    source={require('../../../../../assets/like.json')}
                    style={{height: 44, width: 44}}
                    autoPlay
                    loop={false}
                    resizeMode="cover"
                    onAnimationFinish={() => setShowAni(false)}
                  />
                </View>
              ) : (
                <Image
                  source={like ? redHeart : heart}
                  style={{height: 20, width: 20}}
                />
              )}

              <Text style={styles.num}>{tripState?.likes_count}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBox}
              onPress={() => handleViewComments(tripData?._id)}>
              <Image source={comment} style={{height: 20, width: 20}} />
              <Text style={styles.num}>{tripState?.comments_count}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{gap: 4, marginTop: 8}}>
          <Text style={styles.tripTitle}>
            {formatTripName(tripState?.trip_name)}
          </Text>

          <View style={styles.dpContainer}>
            {tripMembers?.map((data, i) => {
              if (data.status == 'inactive' || data.is_deleted) {
                return (
                  <FastImage
                    key={i}
                    source={noDP}
                    style={styles.membersDp}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                );
              }

              return (
                <FastImage
                  key={i}
                  source={data.profile_image ? {uri: data.profile_image} : noDP}
                  style={styles.membersDp}
                  resizeMode={FastImage.resizeMode.cover}
                />
              );
            })}
          </View>

          <View style={styles.locationContainer}>
            <Image source={location} style={{width: 12, height: 12}} />
            <Text style={styles.tripLocation}>{displayDestination}</Text>
          </View>
        </View>
      </View>

      <CommentBottomSheet
        visible={showComments}
        onClose={() => {
          setShowComments(false);
          VerifyToken(authToken);
        }}
      />
    </View>
  );
};

const LikedComments = ({data, isMyData}) => {
  const {authToken} = useContext(AuthContext);

  const [like, setLike] = useState(true);

  const [likeCount, setLikeCount] = useState(data?.comment_id?.like_count);

  const LikeTripComment = commentID => {
    const likeCommentURL = ENDPOINT.LIKE_COMMENT;

    const formData = new FormData();
    formData.append('comment_id', commentID);

    axios
      .post(likeCommentURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        console.log(res.data.data);

        setLike(prev => !prev);

        setLikeCount(prev => (like ? prev - 1 : prev + 1));
      })
      .catch(err => {
        console.log('failed to like comment', err.response.data);
      });
  };

  let imgURL = data?.comment_id?.user_id?.profile_image;

  if (!data.comment_id) {
    return null;
  }

  function fullName(data) {
    if (data.status == 'inactive' || data.is_deleted) {
      return 'Buddypass User';
    }
    return `${data.first_name} ${data.last_name}`;
  }

  const user = data?.comment_id?.user_id;

  return (
    <View>
      <View style={{gap: 8}}>
        <Text style={styles.tripName}>
          {data.comment_id?.trip_id?.trip_name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {user.status == 'inactive' || user.is_deleted ? (
            <Image
              source={bpUser}
              style={{width: 30, height: 30, borderRadius: 100}}
            />
          ) : (
            <Image
              source={imgURL ? {uri: imgURL} : noDP}
              style={{width: 30, height: 30, borderRadius: 100}}
            />
          )}

          <View
            style={{
              width: isMyData ? '75%' : '87%',
            }}>
            <Text style={styles.nameText}>
              {fullName(data?.comment_id?.user_id)}
            </Text>
            <Text style={styles.commentText}>
              {data.comment_id?.description}
            </Text>
          </View>

          {isMyData && (
            <TouchableOpacity
              style={{alignItems: 'center', gap: 6}}
              onPress={() => LikeTripComment(data?.comment_id?._id)}>
              <Image
                source={like ? redHeart : heart}
                style={{width: 20, height: 20}}
              />
              <Text style={styles.likeCount}>{likeCount}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View
        style={{
          borderBottomWidth: 1,
          borderColor: COLORS.SWEDEN,
          marginTop: 16,
          marginBottom: 16,
        }}
      />
    </View>
  );
};

const LikedTrips = ({navigation, route}) => {
  const {myUserDetails} = useContext(AuthContext);
  const {trips, comments, isMyData} = route.params;

  const [activeTab, setActiveTab] = useState('trips');

  let BodyContent;

  if (activeTab == 'trips') {
    BodyContent = (
      <View style={styles.homeTripCardContainer}>
        {trips?.map(trip => (
          <LikedTripCard
            key={trip?._id}
            tripData={trip?.trip_id}
            isMyData={isMyData}
          />
        ))}
      </View>
    );
  } else if (activeTab == 'comments') {
    BodyContent = (
      <View>
        {comments?.map(data => {
          return (
            <LikedComments key={data?._id} data={data} isMyData={isMyData} />
          );
        })}
      </View>
    );
  }

  return (
    <RegularBG>
      <HeaderTabs
        onBack={() => navigation.goBack()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <ScrollView
        style={{
          marginTop: 14,
        }}
        showsVerticalScrollIndicator={false}>
        {BodyContent}
        <View style={{height: 104}} />
      </ScrollView>
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  homeTripCardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  CardContainer: {
    width: '48%',
    minHeight: 280,
    backgroundColor: COLORS.GREY_LIGHT,
    borderRadius: 10,
    elevation: 5,
    shadowColor: COLORS.GREY_DARK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 100,
    marginTop: 4,
    marginBottom: 4,
  },
  coverImgStyle: {
    height: 160,
    width: '100%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  num: {
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
    fontSize: 10,
  },
  actionBtnContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    gap: 8,
  },
  membersDp: {
    width: 20,
    height: 20,
    borderRadius: 1000,
    marginLeft: -3,
  },
  dpContainer: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    marginLeft: 3,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripLocation: {
    fontSize: 10,
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
  },
  tripTitle: {
    fontSize: 14,
    color: COLORS.LIGHT,
    fontFamily: FONTS.MAIN_SEMI,
    lineHeight: 20,
  },
  tabContainer: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '89%',
  },
  tabText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 16,
    color: COLORS.VISION,
  },
  tabTextActive: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 16,
    color: COLORS.LIGHT,
    borderBottomWidth: 4,
    borderColor: COLORS.THANOS,
  },
  tripName: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  commentText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.LIGHT,

    lineHeight: 20,
  },
  likeCount: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 10,
    color: COLORS.LIGHT,
  },
  nameText: {
    fontFamily: FONTS.MAIN_BOLD,
    fontSize: 10,
    color: COLORS.LIGHT,
  },
});

export default LikedTrips;
