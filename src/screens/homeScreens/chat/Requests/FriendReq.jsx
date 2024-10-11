import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import RegularBG from '../../../../components/background/RegularBG';
import BackButton from '../../../../components/buttons/BackButton';
import {AuthContext} from '../../../../context/AuthContext';
import FastImage from 'react-native-fast-image';
import {COLORS, FONTS} from '../../../../constants/theme/theme';
import axios from 'axios';
import {ENDPOINT} from '../../../../constants/endpoints/endpoints';
import FollowRequestModal from '../../../../components/modal/FollowRequestModal';
import Toast from 'react-native-toast-message';
import FollowedButton from '../../../../components/buttons/FollowedButton';
import FollowButton from '../../../../components/buttons/FollowButton';
import RequestedButton from '../../../../components/buttons/RequestedButton';

var noDP = require('../../../../../assets/Images/noDP.png');
var deleteIcon = require('../../../../../assets/Images/delete.png');
var usersOutline = require('../../../../../assets/Images//usersOutline.png');

const HeaderTabs = ({
  onBack,
  activeTab,
  setActiveTab,
  followReq,
  sentFollowReq,
}) => {
  const handleTabChange = tabName => {
    setActiveTab(tabName);
  };

  return (
    <View style={styles.tabContainer}>
      <View style={{width: '11%'}}>
        <BackButton onPress={onBack} />
      </View>

      <View style={styles.tabButtons}>
        <TouchableOpacity
          onPress={() => handleTabChange('Received')}
          style={{position: 'relative'}}>
          {followReq?.length > 0 && <View style={styles.notificationDot} />}
          <Text
            style={
              activeTab == 'Received' ? styles.tabTextActive : styles.tabText
            }>
            Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabChange('Sent')}
          style={{position: 'relative'}}>
          {sentFollowReq?.length > 0 && <View style={styles.notificationDot} />}
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
    setFollowReq,
  } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('Received');
  const [showPop, setShowPop] = useState(false);
  const [requestData, setRequestData] = useState({
    userData: '',
    action: '',
  });

  function handleShowPop(user, action) {
    setShowPop(true);
    setRequestData({
      userData: user,
      action: action,
    });
  }

  function handleClosePop() {
    setShowPop(false);
    setRequestData({
      userData: '',
      action: '',
    });
  }

  function FullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
  }

  useEffect(() => {
    GetFollowRequests();
    GetSentFollowRequests();
  }, []);

  let currentTab;

  const modifyActionTaken = id => {
    setFollowReq(prevState =>
      prevState.map(item =>
        item._id === id ? {...item, action_taken: true} : item,
      ),
    );
  };

  const setHasRequestedTrue = id => {
    setFollowReq(prevState =>
      prevState.map(item =>
        item._id === id ? {...item, hasRequested: true} : item,
      ),
    );
  };

  function requestActionFN(user, action) {
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
      .then(() => {
        Toast.show({
          type: action == 'accepted' ? 'success' : 'info',
          text1: `Request ${action}`,
          text2: `You ${action} ${user.first_name}'s follow request.`,
        });

        if (action == 'accepted') {
          modifyActionTaken(user?._id);
        }
      })
      .catch(err => {
        console.log('failed to take action idhar', err.response.data);
      })
      .finally(() => {
        handleClosePop();
        if (action !== 'accepted') {
          GetFollowRequests();
        }
      });
  }

  function unFollow(user) {
    const data = {
      followee: user._id,
    };

    axios
      .post(ENDPOINT.UNFOLLOW_USER, data, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(() => {
        Toast.show({
          type: 'info',
          text1: `Request withdrawn`,
          text2: `Follow request to ${user.first_name} has been withdrawn.`,
        });

        GetSentFollowRequests();
        handleClosePop();

        setFollowReq(prevState =>
          prevState.map(item =>
            item._id === user._id ? {...item, isFollowing: false} : item,
          ),
        );
      })
      .catch(err => {
        console.log('failed to take action', err.response.data);
      });
  }

  function unFollow2(user) {
    const data = {
      followee: user._id,
    };

    axios
      .post(ENDPOINT.UNFOLLOW_USER, data, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(() => {
        setFollowReq(prevState =>
          prevState.map(item =>
            item._id === user._id ? {...item, isFollowing: false} : item,
          ),
        );
      })
      .catch(err => {
        console.log('failed to take action', err?.response?.data || err);
      });
  }

  async function handleFollow(buddyId) {
    const userData = {
      followee: buddyId,
    };

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
        setFollowReq(prevState =>
          prevState.map(item =>
            item._id === buddyId ? {...item, isFollowing: true} : item,
          ),
        );
      } else if (response.data.data.status == 'pending') {
        setHasRequestedTrue(buddyId);
      }
    } catch (error) {
      console.log('Failed to follow or unfollow:', error?.response?.data);
    }
  }

  function removeReq(buddyId) {
    const data = {
      followee: buddyId,
    };

    axios
      .post(ENDPOINT.UNFOLLOW_USER, data, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        console.log('removed request', res.data);
        setFollowReq(prevState =>
          prevState.map(item =>
            item._id === buddyId ? {...item, hasRequested: false} : item,
          ),
        );
      })
      .catch(err => {
        console.log('failed to take action', err.response.data);
      });
  }

  if (activeTab == 'Received') {
    currentTab = (
      <>
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

            {data?.action_taken ? (
              <View>
                {data?.isFollowing ? (
                  <FollowedButton
                    onPress={() => {
                      unFollow2(data);
                    }}
                  />
                ) : data.hasRequested ? (
                  <RequestedButton onPress={() => removeReq(data?._id)} />
                ) : (
                  <FollowButton
                    onPress={() => {
                      handleFollow(data?._id);
                    }}
                  />
                )}
              </View>
            ) : (
              <View style={{flexDirection: 'row', gap: 4}}>
                <TouchableOpacity
                  style={[styles.Btn, {backgroundColor: COLORS.ERROR}]}
                  onPress={() => handleShowPop(data, 'rejected')}>
                  <Image source={deleteIcon} style={{width: 20, height: 20}} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.Btn}
                  onPress={() => {
                    handleShowPop(data, 'accepted');
                  }}>
                  <Text style={styles.Btntext}>Accept request</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </>
    );
  } else {
    currentTab = (
      <>
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
              style={[styles.Btn, {backgroundColor: COLORS.GREY_LIGHT}]}
              onPress={() => handleShowPop(data)}>
              <Text style={styles.Btntext}>Requested</Text>
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
        followReq={followReq}
        sentFollowReq={sentFollowReq}
      />

      {(activeTab == 'Received' && followReq.length == 0) ||
      (activeTab !== 'Received' && sentFollowReq.length == 0) ? (
        <View style={styles.noReqBox}>
          <Image source={usersOutline} style={{width: 40, height: 40}} />
          {activeTab == 'Received' ? (
            <Text style={styles.noPending}>No Pending Requests</Text>
          ) : (
            <Text style={styles.noPending}>No Sent Requests</Text>
          )}
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{gap: 20, marginTop: 24}}>{currentTab}</View>

          <View style={{height: 110}} />
        </ScrollView>
      )}

      <FollowRequestModal
        visible={showPop}
        onClose={handleClosePop}
        requestData={requestData}
        requestActionFN={requestActionFN}
        unFollow={unFollow}
      />
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
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 16,
    color: '#828282',
  },
  tabTextActive: {
    fontFamily: FONTS.MAIN_BOLD,
    fontSize: 16,
    color: COLORS.LIGHT,
    borderBottomWidth: 4,
    borderColor: COLORS.THANOS,
  },
  noPending: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 16,
    color: COLORS.LIGHT,
  },
  noReqBox: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginBottom: 80,
  },
  notificationDot: {
    width: 6,
    height: 6,
    borderRadius: 1000,
    backgroundColor: COLORS.THANOS,
    position: 'absolute',
    right: -6,
    top: -2,
  },
});

export default FriendReq;
