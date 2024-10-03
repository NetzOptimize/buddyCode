import {useContext, useEffect} from 'react';
import {AuthContext} from '../context/AuthContext';
import {Alert, Image, View} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

import {SCREENS} from '../constants/screens/screen';
import {StyleSheet} from 'react-native';

// **profile screens
import MyProfile from '../screens/homeScreens/profile/MyProfile';
import ProfileSettings from '../screens/homeScreens/profile/options/settings';
import PrivacySettings from '../screens/homeScreens/profile/options/settings/PrivacySettins/PrivacySettings';
import NotificationSettings from '../screens/homeScreens/profile/options/settings/NotificationSettings';
import BlockedList from '../screens/homeScreens/profile/options/settings/PrivacySettins/BlockedList';
import DeleteStep1 from '../screens/homeScreens/profile/options/settings/DeleteAccount/DeleteStep1';
import DeleteStep2 from '../screens/homeScreens/profile/options/settings/DeleteAccount/DeleteStep2';
import MyFollowerFollowing from '../screens/homeScreens/profile/userMeta/MyFollowerFollowing';
import BuddyFollowerFollowing from '../screens/homeScreens/profile/userMeta/BuddyFollowerFollowing';
import BuddyProfile from '../screens/homeScreens/profile/BuddyProfile';
import FAQsScreen from '../screens/homeScreens/profile/options/settings/FAQsScreen';
import EditProfile from '../screens/homeScreens/profile/options/editProfile';
import UserPreferences from '../screens/homeScreens/profile/options/editProfile/UserPreferences';

// **chat screens
import MyChats from '../screens/homeScreens/chat/MyChats';
import FriendReq from '../screens/homeScreens/chat/Requests/FriendReq';

// **trips screen
import TripsList from '../screens/homeScreens/trips/TripsList';
import ViewMyTrip from '../screens/homeScreens/trips/viewMyTrip';
import TripRequests from '../screens/homeScreens/trips/TripRequests';
import AllTripPayments from '../screens/homeScreens/trips/AllTripPayments';

// **icons
var chat = require('../../assets/Images/bottomTab/chat.png');
var chatSelect = require('../../assets/Images/bottomTab/chatSelect.png');
var trips = require('../../assets/Images/bottomTab/trips.png');
var tripsSelect = require('../../assets/Images/bottomTab/tripsSelect.png');
var profile = require('../../assets/Images/bottomTab/profile.png');
var profileSelect = require('../../assets/Images/bottomTab/profileSelect.png');

// **redux
import {useSelector} from 'react-redux';
import GradientText from '../components/home/GradientText';
import {FONTS} from '../constants/theme/theme';

// **permission services
import {
  handleCameraPermission,
  handleNotificationPermission,
  handleMediaLibraryPermission,
} from '../config/autoMediaPermission';

import messaging from '@react-native-firebase/messaging';
import {ENDPOINT} from '../constants/endpoints/endpoints';
import axios from 'axios';

const MyProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={SCREENS.MY_PROFILE} component={MyProfile} />
      <Stack.Screen
        name={SCREENS.PROFILE_SETTINGS}
        component={ProfileSettings}
      />
      <Stack.Screen
        name={SCREENS.PRIVACY_SETTINGS}
        component={PrivacySettings}
      />
      <Stack.Screen
        name={SCREENS.NOTIFI_SETTTINGS}
        component={NotificationSettings}
      />
      <Stack.Screen name={SCREENS.FAQ} component={FAQsScreen} />
      <Stack.Screen name={SCREENS.BLOCKED_LIST} component={BlockedList} />
      <Stack.Screen name={SCREENS.EDIT_PROFILE} component={EditProfile} />
      <Stack.Screen
        name={SCREENS.USER_PREFERENCES}
        component={UserPreferences}
      />
      <Stack.Screen name={SCREENS.DELETE_STEP1} component={DeleteStep1} />
      <Stack.Screen name={SCREENS.DELETE_STEP2} component={DeleteStep2} />
      <Stack.Screen
        name={SCREENS.MY_FOLLOWER_FOLLOWING}
        component={MyFollowerFollowing}
      />
      <Stack.Screen
        name={SCREENS.BUDDY_FOLLOWER_FOLLOWING}
        component={BuddyFollowerFollowing}
      />
      <Stack.Screen name={SCREENS.BUDDY_PROFILE} component={BuddyProfile} />
    </Stack.Navigator>
  );
};

const MyChatStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={SCREENS.MY_CHATS} component={MyChats} />
      <Stack.Screen name={SCREENS.FRIEND_REQ} component={FriendReq} />
    </Stack.Navigator>
  );
};

const TripsStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={SCREENS.TRIPS_LIST} component={TripsList} />
      <Stack.Screen name={SCREENS.VIEW_MY_TRIP} component={ViewMyTrip} />
      <Stack.Screen name={SCREENS.TRIP_REQUESTS} component={TripRequests} />
      <Stack.Screen
        name={SCREENS.ALL_TRIP_PAYMENTS}
        component={AllTripPayments}
      />
    </Stack.Navigator>
  );
};

export default function TabNavigation() {
  const {myUserDetails, authToken} = useContext(AuthContext);

  const {chatList} = useSelector(state => state.chatList);

  let totalCount = 0;
  chatList?.forEach(item => {
    item?.message_count?.forEach(countItem => {
      if (countItem?.userId === myUserDetails?.user?._id) {
        totalCount += countItem?.count;
      }
    });
  });

  useEffect(() => {
    const getCameraPermission = async () => {
      const hasPermission = await handleCameraPermission();
      getNotificationPermission();
      getLibraryPermission();

      if (hasPermission) {
        console.log('hasAutoPermission');
      }
    };

    const getNotificationPermission = async () => {
      const hasPermission = await handleNotificationPermission();
      if (hasPermission) {
        getDeviceToken();
      }
    };

    const getLibraryPermission = async () => {
      const hasPermission = await handleMediaLibraryPermission();
      if (hasPermission) {
        console.log('hasMediaLibraryPermission');
      }
    };

    setTimeout(() => {
      getCameraPermission();
    }, 2000);
  }, []);

  const getDeviceToken = async () => {
    let token = await messaging().getToken();
    saveDeviceToken(token);
  };

  const saveDeviceToken = async deviceToken => {
    const formData = new FormData();

    formData.append('deviceToken', deviceToken);

    try {
      await axios({
        method: 'put',
        url: ENDPOINT.UPDATE_PROFILE,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + authToken,
        },
        timeout: 10000,
      });
      console.log('device token saved');
    } catch (err) {
      console.log('could not save device token:', err?.response?.data || err);
    }
  };

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log(
            'notification caused the app to open from quit state',
            remoteMessage.notification,
          );
        }
      });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('opened from background state', remoteMessage.notification);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('handled in background', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('new fcm message arrived', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBarStyle],
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="MyProfileStack"
        component={MyProfileStack}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={focused ? profileSelect : profile}
                style={{height: 40, width: 30}}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="MyChatScreens"
        component={MyChatStack}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={{position: 'relative'}}>
                <View style={{position: 'absolute', top: -12, right: -12}}>
                  <GradientText
                    colors={['#FF4EED', '#7879F1', '#7879F1', '#3CFFD0']}
                    style={styles.countText}>
                    {totalCount > 0 ? totalCount : null}
                  </GradientText>
                </View>
                <Image
                  source={focused ? chatSelect : chat}
                  style={{height: 40, width: 44}}
                />
              </View>
            );
          },
        }}
      />

      <Tab.Screen
        name="TripsStack"
        component={TripsStack}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <Image
                source={focused ? tripsSelect : trips}
                style={{height: 40, width: 25}}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
    height: 78,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'black',
  },
  tabBarStyle: {
    backgroundColor: 'black',
    position: 'absolute',
    bottom: -0.5,
    borderTopColor: 'transparent',
    borderBottomWidth: 0,
    height: 80,
  },
  countText: {
    fontFamily: FONTS.ALT_SEMI,
    color: '#FFFFFF',
    fontSize: 14,
  },
});
