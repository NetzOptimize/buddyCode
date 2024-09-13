import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import RegularBG from '../../../../components/background/RegularBG';
import BackButton from '../../../../components/buttons/BackButton';
import {AuthContext} from '../../../../context/AuthContext';
import FastImage from 'react-native-fast-image';
import {COLORS, FONTS} from '../../../../constants/theme/theme';
import axios from 'axios';
import {ENDPOINT} from '../../../../constants/endpoints/endpoints';

var noDP = require('../../../../../assets/Images/noDP.png');
var deleteIcon = require('../../../../../assets/Images/delete.png');
var usersOutline = require('../../../../../assets/Images//usersOutline.png');

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
        <TouchableOpacity onPress={() => handleTabChange('Received')}>
          <Text
            style={
              activeTab == 'Received' ? styles.tabTextActive : styles.tabText
            }>
            Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('Sent')}>
          <Text
            style={activeTab == 'Sent' ? styles.tabTextActive : styles.tabText}>
            Sent
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FriendReq = ({navigation}) => {
  const {
    followReq,
    GetFollowRequests,
    sentFollowReq,
    GetSentFollowRequests,
    authToken,
  } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('Received');

  function FullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
  }

  useEffect(() => {
    GetFollowRequests();
    GetSentFollowRequests();
  }, []);

  let currentTab;

  function RequestAction(user, action) {
    const data = {
      follower: user._id,
      status: action,
    };

    axios
      .post(ENDPOINT.FOLLOW_REQ_ACTION, data, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        console.log('action taken', res.data);
        GetFollowRequests();
      })
      .catch(err => {
        console.log('failed to take action', err.response.data);
      });
  }

  if (activeTab == 'Received') {
    currentTab = (
      <>
        {followReq.length == 0 && (
          <View style={styles.noReqBox}>
            <Image source={usersOutline} style={{width: 60, height: 60}} />
            <Text style={styles.noPending}>No Pending Requests</Text>
          </View>
        )}

        {followReq?.map(data => (
          <View key={data?._id} style={styles.blockedListItemContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <FastImage
                source={data?.profile_image ? {uri: data?.profile_image} : noDP}
                style={{borderRadius: 1000, width: 44, height: 44}}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text style={styles.name}>
                {FullName(data?.first_name, data?.last_name)}
              </Text>
            </View>

            <View style={{flexDirection: 'row', gap: 4}}>
              <TouchableOpacity
                style={[styles.Btn, {backgroundColor: COLORS.ERROR}]}
                onPress={() => RequestAction(data, 'rejected')}>
                <Image source={deleteIcon} style={{width: 20, height: 20}} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Btn}
                onPress={() => RequestAction(data, 'accepted')}>
                <Text style={styles.Btntext}>Accept request</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </>
    );
  } else {
    currentTab = (
      <>
        {sentFollowReq.length == 0 && (
          <View style={styles.noReqBox}>
            <Image source={usersOutline} style={{width: 60, height: 60}} />
            <Text style={styles.noPending}>No Sent Requests</Text>
          </View>
        )}
        {sentFollowReq?.map(data => (
          <View key={data?._id} style={styles.blockedListItemContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <FastImage
                source={data?.profile_image ? {uri: data?.profile_image} : noDP}
                style={{borderRadius: 1000, width: 44, height: 44}}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text style={styles.name}>
                {FullName(data?.first_name, data?.last_name)}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.Btn, {backgroundColor: COLORS.ERROR}]}
              onPress={() => RequestAction(data, 'rejected')}>
              <Text style={styles.Btntext}>Withdraw request</Text>
            </TouchableOpacity>
          </View>
        ))}
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
        <View style={{gap: 20, marginTop: 24}}>{currentTab}</View>

        <View style={{height: 110}} />
      </ScrollView>
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  name: {
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
    fontSize: 12,
  },
  blockedListItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  Btntext: {
    fontFamily: FONTS.MAIN_SEMI,
    color: COLORS.LIGHT,
    fontSize: 10,
  },
  Btn: {
    padding: 10,
    backgroundColor: COLORS.THANOS,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  },
  noPending: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 16,
    color: COLORS.LIGHT,
  },
  noReqBox: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: '15%',
  },
});

export default FriendReq;
