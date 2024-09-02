import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import NavigationService from './src/config/NavigationService';

import {AuthProvider} from './src/context/AuthContext';

// ** navigation stack
import MyStack from './src/navigation/MyStack';

// ** other providers
import {MenuProvider} from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';

// ** redux
import {Provider} from 'react-redux';
import store from './src/redux/store';

import messaging from '@react-native-firebase/messaging';

const App = () => {
  useEffect(() => {
    const getDeviceToken = async () => {
      let token = await messaging().getToken();

      console.log(token);
    };

    getDeviceToken();
  }, []);

  return (
    <NavigationContainer
      ref={ref => NavigationService.setTopLevelNavigator(ref)}>
      <Provider store={store}>
        <AuthProvider>
          <MenuProvider>
            <MyStack />
            <Toast />
          </MenuProvider>
        </AuthProvider>
      </Provider>
    </NavigationContainer>
  );
};

export default App;