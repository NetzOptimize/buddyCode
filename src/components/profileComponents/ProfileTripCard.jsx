import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';
import {ENDPOINT} from '../../constants/endpoints/endpoints';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext';
import FastImage from 'react-native-fast-image';

// **images
var placeholderImg = require('../../../assets/Images/placeholderIMG.png');
var heart = require('../../../assets/Images/heart.png');
var redHeart = require('../../../assets/Images/redHeart.png');
var comment = require('../../../assets/Images/comment.png');
var noDP = require('../../../assets/Images/noDP.png');
var location = require('../../../assets/Images/location.png');

import LottieView from 'lottie-react-native';

const ProfileTripCard = ({tripData, viewComments}) => {
  const {authToken, myUserDetails} = useContext(AuthContext);

  const [tripState, setTripState] = useState(tripData);
  const [like, setLike] = useState(false);

  const [showAni, setShowAni] = useState(false);

  const likedTripIdToCheck = tripData?._id;
  const isLiked = myUserDetails?.likedTrips?.some(
    likedTrip => likedTrip?.trip_id?._id === likedTripIdToCheck,
  );

  useEffect(() => {
    setTripState(tripData);
    setLike(isLiked);
  }, [tripData, isLiked, myUserDetails]);

  const formatTripName = name => {
    return name?.charAt(0)?.toUpperCase() + name?.slice(1)?.toLowerCase();
  };

  let tripMembers = [tripData.owner];

  tripData?.members?.forEach(element => {
    tripMembers?.push(element);
  });

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

  return (
    <View style={styles.CardContainer}>
      <TouchableOpacity>
        <FastImage
          source={
            tripState?.trip_image
              ? {uri: tripState?.trip_image}
              : placeholderImg
          }
          style={styles.coverImgStyle}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>

      <View style={{padding: 8}}>
        <View style={styles.actionBtnContainer}>
          <TouchableOpacity style={styles.iconBox} onPress={LikeTrip}>
            {showAni ? (
              <View style={{position: 'absolute', right: -4.2}}>
                <LottieView
                  source={require('../../../assets/like.json')}
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

          <TouchableOpacity style={styles.iconBox} onPress={viewComments}>
            <Image source={comment} style={{height: 20, width: 20}} />
            <Text style={styles.num}>{tripState?.comments_count}</Text>
          </TouchableOpacity>
        </View>

        <View style={{gap: 4, marginTop: 8}}>
          <Text style={styles.tripTitle}>
            {formatTripName(tripState?.trip_name)}
          </Text>

          <View style={styles.dpContainer}>
            {tripMembers?.map((data, i) => {
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
            <Text style={styles.tripLocation}>{tripState?.destination[0]}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  tripTitle: {
    fontSize: 14,
    color: COLORS.LIGHT,
    fontFamily: FONTS.MAIN_SEMI,
    lineHeight: 20,
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
});

export default ProfileTripCard;
