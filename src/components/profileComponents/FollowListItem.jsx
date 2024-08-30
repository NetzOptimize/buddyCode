import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

// **components
import FollowedButton from '../buttons/FollowedButton';
import {COLORS, FONTS} from '../../constants/theme/theme';
import FastImage from 'react-native-fast-image';
import FollowButton from '../buttons/FollowButton';
import {AuthContext} from '../../context/AuthContext';

import axios from 'axios';
import {ENDPOINT} from '../../constants/endpoints/endpoints';

// **image
var noDP = require('../../../assets/Images/noDP.png');

const FollowListItem = ({data, onViewProfile, isFollowing}) => {
  const {myUserDetails, authToken, VerifyToken} = useContext(AuthContext);

  const [isFollowed, setIsFollowed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFollowed(isFollowing);
  }, [isFollowing]);

  function FullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
  }

  async function handleFollowUnfollow(buddyId) {
    let formData = new FormData();
    formData.append('following', buddyId);

    setLoading(true);

    try {
      const response = await axios({
        method: 'put',
        url: ENDPOINT.UPDATE_PROFILE,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + authToken,
        },
      });

      // dispatch(fetchBuddyDetails(buddyId));
      setIsFollowed(prevValue => !prevValue);
    } catch (error) {
      console.log('Failed to follow or unfollow:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center', gap: 10}}
        onPress={onViewProfile}>
        <FastImage
          source={data?.profile_image ? {uri: data?.profile_image} : noDP}
          style={{borderRadius: 1000, width: 44, height: 44}}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text style={styles.text}>
          {FullName(data?.first_name, data?.last_name)}
        </Text>
      </TouchableOpacity>

      {myUserDetails?.user?._id !== data?._id ? (
        isFollowed ? (
          <FollowedButton
            onPress={() => handleFollowUnfollow(data?._id)}
            loading={loading}
            disabled={loading}
          />
        ) : (
          <FollowButton
            onPress={() => handleFollowUnfollow(data?._id)}
            loading={loading}
            disabled={loading}
          />
        )
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
    fontSize: 12,
  },
});

export default FollowListItem;
