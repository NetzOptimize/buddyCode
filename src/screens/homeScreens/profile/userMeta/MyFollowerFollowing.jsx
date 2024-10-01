import React, {useContext, useState, useEffect, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Button,
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
        <TouchableOpacity onPress={() => handleTabChange('Friends')}>
          <Text
            style={
              activeTab == 'Friends' ? styles.tabTextActive : styles.tabText
            }>
            Friends
          </Text>
        </TouchableOpacity>
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

const MyFollowerFollowing = ({navigation, route}) => {
  const {authToken} = useContext(AuthContext);

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

  function getFollowersFollowings() {
    setFollowers({
      docs: [],
      hasNextPage: null,
    });

    setFollowing({
      docs: [],
      hasNextPage: null,
    });

    getFollowers(followerPage);
    getFollowing(followingPage);
  }

  useFocusEffect(
    useCallback(() => {
      getFollowers(followerPage);
      getFollowing(followingPage);
    }, [followingPage, followerPage]),
  );

  function getFollowers() {
    const url = ENDPOINT.GET_FOLLOWERS;

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
    const url = `${ENDPOINT.GET_FOLLOWING}?page=${page}`;

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        let result = res.data.data.docs;

        console.log(res.data);

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
        {followers?.docs?.map((data, i) => (
          <FollowListItem
            key={i}
            data={data}
            type={activeTab}
            getFollowersFollowings={getFollowersFollowings}
            isFollowing={following?.docs?.some(item => item?._id == data?._id)}
            onViewProfile={() => {
              setFollowers({
                docs: [],
                hasNextPage: null,
              });
              NavigationService.navigate(SCREENS.BUDDY_PROFILE, {
                buddyData: data,
              });
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
        {following?.docs?.map((data, i) => (
          <FollowListItem
            key={i}
            data={data}
            type={activeTab}
            getFollowersFollowings={getFollowersFollowings}
            isFollowing={following?.docs?.some(item => item?._id == data?._id)}
            onViewProfile={() => {
              setFollowing({
                docs: [],
                hasNextPage: null,
              });
              NavigationService.navigate(SCREENS.BUDDY_PROFILE, {
                buddyData: data,
              });
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

export default MyFollowerFollowing;
