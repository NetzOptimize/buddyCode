import React, {useContext} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';

import NavigationService from '../../config/NavigationService';
import {SCREENS} from '../../constants/screens/screen';
import {AuthContext} from '../../context/AuthContext';

const UserMeta = ({
  userData,
  tripCount = '0',
  myMeta = false,
  isPrivate = false,
}) => {
  const {myUserDetails} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{alignItems: 'center', gap: 4}}
        onPress={() => {
          if (myMeta) {
            NavigationService.navigate(SCREENS.MY_FOLLOWER_FOLLOWING, {
              currentTab: 'Followers',
            });
          } else {
            NavigationService.navigate(SCREENS.BUDDY_FOLLOWER_FOLLOWING, {
              currentTab: 'Followers',
            });
          }
        }}
        disabled={isPrivate}>
        <Text style={styles.attributeTag}>Followers</Text>
        <Text style={styles.attributeName}>{userData?.followerCount}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{alignItems: 'center', gap: 4}}
        onPress={() => {
          if (myMeta) {
            NavigationService.navigate(SCREENS.MY_FOLLOWER_FOLLOWING, {
              currentTab: 'Following',
            });
          } else {
            NavigationService.navigate(SCREENS.BUDDY_FOLLOWER_FOLLOWING, {
              currentTab: 'Following',
            });
          }
        }}
        disabled={isPrivate}>
        <Text style={styles.attributeTag}>Following</Text>
        <Text style={styles.attributeName}>{userData?.followingCount}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{alignItems: 'center', gap: 4}}
        disabled={isPrivate}
        onPress={() => {
          NavigationService.navigate(SCREENS.LIKED_TRIPS, {
            trips: userData?.likedTrips,
            comments: userData?.likedComments,
            isMyData: userData?.user?._id == myUserDetails?.user?._id,
          });
        }}>
        <Text style={styles.attributeTag}>Likes</Text>
        <Text style={styles.attributeName}>
          {(userData?.likedTrips || userData?.likedComments) &&
            userData?.likedTrips?.length + userData?.likedComments?.length}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={{alignItems: 'center', gap: 4}} disabled={true}>
        <Text style={styles.attributeTag}>Trips</Text>
        <Text style={styles.attributeName}>{tripCount}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '94%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  attributeTag: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 10,
    color: COLORS.LIGHT,
  },
  attributeName: {
    fontFamily: FONTS.MAIN_BOLD,
    fontSize: 10,
    color: COLORS.LIGHT,
  },
});

export default UserMeta;