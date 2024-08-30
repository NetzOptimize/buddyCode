import React, {useContext, useState} from 'react';
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
  const {myUserDetails} = useContext(AuthContext);

  const {buddyDetails} = useSelector(state => state.buddyDetails);

  const {currentTab} = route.params;

  const [activeTab, setActiveTab] = useState(currentTab);

  let currentTabList;

  if (activeTab == 'Followers') {
    currentTabList = buddyDetails?.user?.followers?.map(data => (
      <FollowListItem
        key={data?._id}
        data={data}
        type={activeTab}
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
    ));
  } else if (activeTab == 'Following') {
    currentTabList = buddyDetails?.user?.following?.map(data => (
      <FollowListItem
        key={data?._id}
        data={data}
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
    ));
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
});

export default BuddyFollowerFollowing;
