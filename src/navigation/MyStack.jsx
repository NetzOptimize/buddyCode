import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

const Stack = createStackNavigator();

// pages
import Login from '../screens/login';
import SignUp from '../screens/signup';

import {SCREENS} from '../constants/screens/screen';

import SplashScreen from '../components/background/SplashScreen';

import TabNavigation from './TabNavigation';
F;
import {COLORS} from '../constants/theme/theme';

export default function MyStack() {
  const {authToken, showSplash} = useContext(AuthContext);

  let NavigationStack = (
    <>
      <Stack.Screen name={SCREENS.LOGIN} component={Login} />
      <Stack.Screen name={SCREENS.REGISTER} component={SignUp} />
    </>
  );

  if (authToken) {
    NavigationStack = (
      <>
        <Stack.Screen name={'TabNavigation'} component={TabNavigation} />
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
