import React, {useContext, useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ** components
import RegularBG from '../../../../components/background/RegularBG';
import BackButton from '../../../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../../../constants/theme/theme';
import FollowListItem from '../../../../components/profileComponents/FollowListItem';

// ** context
import {AuthContext} from '../../../../context/AuthContext';
import NavigationService from '../../../../config/NavigationService';
import {SCREENS} from '../../../../constants/screens/screen';

import {useSelector} from 'react-redux';
import {fetchBuddyDetails} from '../../../redux/slices/buddyDetailsSlice';

import {ENDPOINT} from '../../../../constants/endpoints/endpoints';
import axios from 'axios';

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
        <TouchableOpacity onPress={() => handleTabChange('Followers')}>
          <Text
            style={
              activeTab == 'Followers' ? styles.tabTextActive : styles.tabText
            }>
            Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('Following')}>
          <Text
            style={
              activeTab == 'Following' ? styles.tabTextActive : styles.tabText
            }>
            Following
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BuddyFollowerFollowing = ({navigation, route}) => {
  const {myUserDetails, authToken} = useContext(AuthContext);

  const {buddyDetails} = useSelector(state => state.buddyDetails);

  const {currentTab} = route.params;

  const [activeTab, setActiveTab] = useState(currentTab);
  const [followers, setFollowers] = useState({
    docs: [],
    hasNextPage: null,
  });
  const [following, setFollowing] = useState({
    docs: [],
    hasNextPage: null,
  });

  const [followingPage, setFollowingPage] = useState(1);
  const [followerPage, setFollowerPage] = useState(1);

  function hitAPI() {
    getFollowers(followerPage);
    getFollowing(followingPage);
  }

  useEffect(() => {
    getFollowers(followerPage);
    getFollowing(followingPage);
  }, [followingPage, followerPage]);

  function getFollowers(page) {
    const url = `${ENDPOINT.GET_FOLLOWERS}/${buddyDetails?.user?._id}?page=${page}`;

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        let result = res.data.data.docs;

        setFollowers(prev => ({
          docs: [
            ...new Map(
              [...prev?.docs, ...result].map(item => [item._id, item]),
            ).values(),
          ],
          hasNextPage: res.data.data.hasNextPage,
        }));
      })
      .catch(err => {
        console.log('failed to get followers', err.response.data);
      });
  }

  function getFollowing(page) {
    const url = `${ENDPOINT.GET_FOLLOWING}/${buddyDetails?.user?._id}?page=${page}`;

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        let result = res.data.data.docs;

        setFollowing(prev => ({
          docs: [
            ...new Map(
              [...prev?.docs, ...result].map(item => [item._id, item]),
            ).values(),
          ],
          hasNextPage: res.data.data.hasNextPage,
        }));
      })
      .catch(err => {
        console.log('failed to get followers', err.response.data);
      });
  }

  let currentTabList;

  if (activeTab == 'Followers') {
    currentTabList = (
      <>
        {followers?.docs?.map(data => (
          <FollowListItem
            key={data?._id}
            data={data}
            type={activeTab}
            hitAPI={hitAPI}
            isFollowing={myUserDetails?.user?.following?.some(
              item => item?._id == data?._id,
            )}
            onViewProfile={() => {
              if (myUserDetails?.user?._id !== data?._id) {
                NavigationService.navigate(SCREENS.BUDDY_PROFILE, {
                  buddyData: data,
                  followed: false,
                });
              }
            }}
          />
        ))}

        {followers?.hasNextPage && (
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => setFollowerPage(prev => prev + 1)}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}
      </>
    );
  } else if (activeTab == 'Following') {
    currentTabList = (
      <>
        {following?.docs?.map(data => (
          <FollowListItem
            key={data?._id}
            data={data}
            hitAPI={hitAPI}
            isFollowing={myUserDetails?.user?.following?.some(
              item => item?._id == data?._id,
            )}
            onViewProfile={() => {
              if (myUserDetails?.user?._id !== data?._id) {
                NavigationService.navigate(SCREENS.BUDDY_PROFILE, {
                  buddyData: data,
                  followed: false,
                });
              }
            }}
          />
        ))}

        {following?.hasNextPage && (
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => setFollowingPage(prev => prev + 1)}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}
      </>
    );
  }

  return (
    <RegularBG>
      <HeaderTabs
        onBack={() => navigation.goBack()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginTop: 20, gap: 20}}>{currentTabList}</View>

        <View style={{height: 110}} />
      </ScrollView>
    </RegularBG>
  );
};

const styles = StyleSheet.create({
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
  },
  loadMoreText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.HULK,
  },
});

export default BuddyFollowerFollowing;
