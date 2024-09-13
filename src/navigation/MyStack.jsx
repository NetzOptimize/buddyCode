import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

const Stack = createStackNavigator();

// pages
import Login from '../screens/login';
import SignUp from '../screens/signup';

import {SCREENS} from '../constants/screens/screen';

import SplashScreen from '../components/background/SplashScreen';
import CreateTrip from '../screens/homeScreens/trips/creation/CreateTrip';

import TabNavigation from './TabNavigation';
import {COLORS} from '../constants/theme/theme';
import EditTrip from '../screens/homeScreens/trips/creation/EditTrip';
import OneChat from '../screens/homeScreens/chat/OneChat';
import GroupChat from '../screens/homeScreens/chat/GroupChat';
import OTPverification from '../screens/signup/OTPverification';
import CompleteProfile from '../screens/signup/CompleteProfile';
import SelectPreferences from '../screens/signup/SelectPreferences';
import FollowPeople from '../screens/signup/FollowPeople';
import ForgotUserDetails from '../screens/login/forgotDetailsScreens/ForgotUserDetails';
import ChangeUserDetails from '../screens/login/forgotDetailsScreens/ChangeUserDetails';
import BuddySearch from '../components/home/BuddySearch';

export default function MyStack() {
  const {authToken, showSplash} = useContext(AuthContext);

  let NavigationStack = (
    <>
      <Stack.Screen name={SCREENS.LOGIN} component={Login} />
      <Stack.Screen name={SCREENS.REGISTER} component={SignUp} />
      <Stack.Screen name={SCREENS.OTP_SCREEN} component={OTPverification} />
      <Stack.Screen
        name={SCREENS.COMPLETE_PROFILE}
        component={CompleteProfile}
      />
      <Stack.Screen
        name={SCREENS.SELECT_PREFERENCES}
        component={SelectPreferences}
      />
      <Stack.Screen
        name={SCREENS.CHANGE_USER_DETAILS}
        component={ChangeUserDetails}
      />
      <Stack.Screen name={SCREENS.FOLLOW_PEOPLE} component={FollowPeople} />
      <Stack.Screen name={SCREENS.FORGOT_USER} component={ForgotUserDetails} />
    </>
  );

  if (authToken) {
    NavigationStack = (
      <>
        <Stack.Screen name={'TabNavigation'} component={TabNavigation} />
        <Stack.Screen name={SCREENS.CREATE_TRIP} component={CreateTrip} />
        <Stack.Screen name={SCREENS.EDIT_TRIP} component={EditTrip} />
        <Stack.Screen name={SCREENS.ONE_CHAT} component={OneChat} />
        <Stack.Screen name={SCREENS.GROUP_CHAT} component={GroupChat} />
        <Stack.Screen name={SCREENS.BUDDY_SEARCH} component={BuddySearch} />
      </>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        cardStyle: {backgroundColor: COLORS.GREY_DARK},
      }}>
      {showSplash ? (
        <Stack.Screen name={'SplashScreen'} component={SplashScreen} />
      ) : (
        NavigationStack
      )}
    </Stack.Navigator>
  );
}
