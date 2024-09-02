import {createContext, useEffect, useState} from 'react';
import {ENDPOINT} from '../constants/endpoints/endpoints';

export const AuthContext = createContext();

// ** 3rd party libraries
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ChatClient, ChatOptions} from 'react-native-agora-chat';

// ** Agora Key
import {AGORA_APP_KEY} from '@env';

// ** redux
import {useDispatch} from 'react-redux';
import {fetchChatList} from '../redux/slices/chatListSlice';

export const AuthProvider = ({children}) => {
  const dispatch = useDispatch();

  const [showSplash, setShowSplash] = useState(true);
  // ** user details
  const [authToken, setAuthToken] = useState(null);
  const [myUserDetails, setMyUserDetails] = useState(null);
  const [logoutLoader, setLogoutLoader] = useState(false);
  const [myTrips, setMyTrips] = useState({trips: [], hasNextPage: false});
  const [myAllTrips, setMyAllTrips] = useState({trips: [], hasNextPage: false});
  const [buddyTrips, setBuddyTrips] = useState([]);
  const [blockUserData, setBlockUserData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tripInvites, setTripInvites] = useState(null);

  const [showBlockReportPopUp, setShowBlockReportPopUp] = useState({
    type: null,
    state: false,
  });

  // ** common loader
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authToken) {
      VerifyToken(authToken);
    }

    isLoggedIn();
  }, [authToken]);

  function VerifyToken(token) {
    const url = ENDPOINT.USER_DETAILS;

    setLoading(true);

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        timeout: 10000,
      })
      .then(res => {
        let myUserInfo = res.data;
        setMyUserDetails(myUserInfo.data);
        agoraLogin(myUserInfo.data);
        GetAllTrips(myUserInfo.data.user._id);

        // **saving token
        AsyncStorage.setItem('authToken', token).then(() => {
          setAuthToken(token);
          setShowSplash(false);
        });
      })
      .catch(err => {
        console.log(
          'failed to get my user details',
          err?.response?.data ? err?.response?.data : err,
        );
        setShowSplash(false);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const isLoggedIn = async () => {
    try {
      let loginToken = await AsyncStorage.getItem('authToken');
      if (loginToken) {
        VerifyToken(loginToken);
      } else {
        setTimeout(() => {
          setShowSplash(false);
        }, 1000);
      }
    } catch (e) {
      console.log(`is logged in error ${e}`);
    }
  };

  const Logout2 = async () => {
    await AsyncStorage.removeItem('authToken').then(() => {
      setAuthToken(null);
      setMyUserDetails(null);
      setLoading(false);
      setLogoutLoader(false);
      setMyAllTrips({trips: [], hasNextPage: false});
    });
  };

  async function GetAllTrips(myId, pageNumber) {
    const GetTripsURL = `${ENDPOINT.GET_TRIPS}/${myId}?limit=10&page=${
      pageNumber ? pageNumber : '1'
    }`;

    try {
      const res = await axios.get(GetTripsURL, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
        timeout: 10000,
      });

      const newTrips = res.data.data.trips.docs;

      setMyAllTrips(prevState => {
        let updatedTrips;
        if (prevState.trips.length === 0) {
          updatedTrips = newTrips;
        } else {
          // Update existing trips or append new trips
          updatedTrips = prevState.trips.map(existingTrip => {
            const newTripIndex = newTrips.findIndex(
              trip => trip._id === existingTrip._id,
            );
            return newTripIndex !== -1 ? newTrips[newTripIndex] : existingTrip;
          });

          // Append new trips that are not already in the existing trips array
          const newTripsToAdd = newTrips.filter(newTrip =>
            updatedTrips.every(
              existingTrip => existingTrip._id !== newTrip._id,
            ),
          );
          updatedTrips = updatedTrips.concat(newTripsToAdd);
        }

        return {
          ...prevState,
          trips: updatedTrips,
          hasNextPage: res.data.data.trips.hasNextPage,
        };
      });
    } catch (error) {
      console.log('Error fetching trips:', error);
    }
  }

  async function GetTrips(myId, type, pageNumber) {
    const GetTripsURL = `${ENDPOINT.GET_TRIPS}/${myId}?type=${type}&limit=20&page=${pageNumber}`;

    try {
      const res = await axios.get(GetTripsURL, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      });

      const newTrips = res.data.data.trips.docs;

      setMyTrips(prevState => {
        let updatedTrips;
        if (prevState.trips.length === 0) {
          updatedTrips = newTrips;
        } else {
          updatedTrips = prevState.trips.map(existingTrip => {
            const newTripIndex = newTrips.findIndex(
              trip => trip._id === existingTrip._id,
            );
            return newTripIndex !== -1 ? newTrips[newTripIndex] : existingTrip;
          });

          const newTripsToAdd = newTrips.filter(newTrip =>
            updatedTrips.every(
              existingTrip => existingTrip._id !== newTrip._id,
            ),
          );
          updatedTrips = updatedTrips.concat(newTripsToAdd);
        }

        return {
          ...prevState,
          trips: updatedTrips,
          hasNextPage: res.data.data.trips.hasNextPage,
        };
      });
    } catch (error) {
      console.log('get trips error:', error.response.data);
    }
  }

  const GetBuddyTrips = async buddyId => {
    const url = `${ENDPOINT.GET_BUDDY_TRIPS}/${buddyId}`;
    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
        timeout: 10000,
      });

      setBuddyTrips(response.data.data.trips.docs);
    } catch (error) {
      console.log('failed to get buddyDetails', error);
      setLoading(false);
    }
  };

  const GetTripInvites = myId => {
    const URL = `${ENDPOINT.GET_TRIP_INVITES}/${myId}`;

    axios
      .get(URL, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
        timeout: 10000,
      })
      .then(res => {
        setTripInvites(res.data.data.trip_Request);
      })
      .catch(error => {
        setTripInvites(null);
      });
  };

  // ** agora function
  const chatClient = ChatClient.getInstance();
  const chatManager = chatClient.chatManager;

  const setMessageListener = () => {
    dispatch(fetchChatList(myUserDetails?.user?._id));

    let msgListener = {
      onMessagesReceived() {
        dispatch(fetchChatList(myUserDetails?.user?._id));
      },
    };
    chatManager.removeAllMessageListener();
    chatManager.addMessageListener(msgListener);
  };

  useEffect(() => {
    const init = () => {
      let o = new ChatOptions({
        autoLogin: false,
        appKey: AGORA_APP_KEY,
      });
      chatClient.removeAllConnectionListener();
      chatClient
        .init(o)
        .then(() => {
          this.isInitialized = true;
          let listener = {
            onTokenWillExpire() {
              console.log('token expire.');
            },
            onTokenDidExpire() {
              console.log('token did expire');
            },
            onConnected() {
              setMessageListener();
            },
            onDisconnected(errorCode) {},
          };
          chatClient.addConnectionListener(listener);
        })
        .catch(error => {
          console.log(
            'init fail: ' +
              (error instanceof Object ? JSON.stringify(error) : error),
          );
        });
    };
    init();
  }, [chatClient, chatManager, AGORA_APP_KEY, myUserDetails]);

  const agoraLogin = userDetails => {
    if (this.isInitialized === false || this.isInitialized === undefined) {
      console.log('Perform initialization first.');
      return;
    }
    chatClient
      .loginWithAgoraToken(
        userDetails?.user.agoraDetails[0].username,
        userDetails?.chatToken,
      )
      .then(res => {
        console.log('login operation success.');
      })
      .catch(reason => {
        console.log(JSON.stringify(reason));
        if (JSON.stringify(reason.code) == 200) {
          setMessageListener();
        }
      });
  };

  const Logout1 = () => {
    if (this.isInitialized === false || this.isInitialized === undefined) {
      console.log('Perform initialization first.');
      return;
    }
    setLogoutLoader(true);
    console.log('start logout ...');
    chatClient
      .logout()
      .then(() => {
        console.log('logout success.');
        Logout2();
      })
      .catch(reason => {
        console.log('logout fail:' + JSON.stringify(reason));
        setLogoutLoader(false);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        showSplash,
        authToken,
        setAuthToken,
        myUserDetails,
        setMyUserDetails,
        VerifyToken,
        GetAllTrips,
        loading,
        setLoading,
        Logout1,
        logoutLoader,
        myAllTrips,
        buddyTrips,
        setBuddyTrips,
        GetBuddyTrips,
        showBlockReportPopUp,
        setShowBlockReportPopUp,
        myTrips,
        GetTrips,
        blockUserData,
        setBlockUserData,
        selectedDate,
        setSelectedDate,
        tripInvites,
        GetTripInvites,
      }}>
      {children}
    </AuthContext.Provider>
  );
};