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
  const [myPreferences, setMyPreferences] = useState(null);

  const [logoutLoader, setLogoutLoader] = useState(false);
  const [myTrips, setMyTrips] = useState({trips: [], hasNextPage: false});
  const [myAllTrips, setMyAllTrips] = useState({trips: [], hasNextPage: false});
  const [buddyTrips, setBuddyTrips] = useState([]);
  const [blockUserData, setBlockUserData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tripInvites, setTripInvites] = useState(null);
  const [sentInvites, setSentInvites] = useState(null);
  const [eventData, setEventData] = useState([]);
  const [isPaymentPending, setIsPaymentPending] = useState(null);
  const [paymentList, setPaymentList] = useState([]);
  const [followReq, setFollowReq] = useState([]);
  const [sentFollowReq, setSentFollowReq] = useState([]);
  const [localGroupDetails, setLocalGroupDetails] = useState(null);
  const [tripMembers, setTripMembers] = useState([]);

  const [showBlockReportPopUp, setShowBlockReportPopUp] = useState({
    type: null,
    state: false,
  });

  const [searchResult, setSearchResult] = useState({
    docs: [],
    hasNextPage: false,
  });

  // ** common loader
  const [loading, setLoading] = useState(false);

  // ** Poll Choice  //
  const [ChatIDForPolls, setChatIDForPolls] = useState(null);
  const [pollType, setPollType] = useState('Question type');
  const [PollsVisible, setPollsVisible] = useState(false);

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
      console.log('Error fetching trips:', error?.response?.data || error);
    }
  }

  async function GetTrips(myId, type, pageNumber) {
    const GetTripsURL = `${ENDPOINT.GET_TRIPS}/${myId}?type=${type}&limit=20&page=${pageNumber}`;

    setLoading(true);

    try {
      const res = await axios.get(GetTripsURL, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      });

      setLoading(false);

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
      setLoading(false);
      console.log('get trips error:', error?.response?.data);
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

  const GetSentTripInvites = myId => {
    const URL = `${ENDPOINT.SENT_TRIP_INVITES}/${myId}`;

    axios
      .get(URL, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
        timeout: 10000,
      })
      .then(res => {
        setSentInvites(res.data.data.trip_Request);
      })
      .catch(error => {
        setSentInvites(null);
      });
  };

  function getPaymentList(tripId) {
    const url = `${ENDPOINT.GET_EVENT_PAYMENTS}/${tripId}?page=1&limit=100`;
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        setPaymentList(res.data.data.payments.docs.reverse());
      })
      .catch(e => {
        console.log('Get Single Trip error', e.response.data);
      });
  }

  const getPendingPayments = tripId => {
    const url = `${ENDPOINT.GET_PENDING_PAYMENTS}/${tripId}/events`;

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        const eventData = res.data.data.events;
        setIsPaymentPending(
          eventData.some(event =>
            event.event_payment_data.some(
              payment =>
                payment?.status == 'pending' &&
                payment?.user_id?._id === myUserDetails?.user?._id,
            ),
          ),
        );

        setEventData(
          res.data.data.events.filter(event => {
            return event.members.some(
              member => member._id === myUserDetails?.user?._id,
            );
          }),
        );
      })
      .catch(e => {
        console.log(
          'Get Single Trip error',
          e?.response?.data ? e?.response?.data : e,
        );
      });
  };

  const SearchUsers = (search, page) => {
    const searchUserURL = ENDPOINT.SEARCH_USERS;
    let searchText = search?.trim();

    axios
      .get(searchUserURL, {
        params: {
          search: searchText,
          page: page,
        },
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        let mySearchResult = res.data.data.docs;

        mySearchResult.sort((a, b) => {
          const nameA = a.first_name || '';
          const nameB = b.first_name || '';

          return nameA.localeCompare(nameB);
        });

        mySearchResult = mySearchResult.filter(
          user => user.first_name && user.last_name,
        );

        setSearchResult(prevSearchResult => ({
          docs: [...prevSearchResult?.docs, ...mySearchResult],
          hasNextPage: res.data.data.hasNextPage,
        }));
      })
      .catch(error => {
        console.log('search error:', error.response.data);
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

  const UpdateChatRemoveBubble = (chatID, fromUserID, toUserID) => {
    const updateChatURL = `${ENDPOINT.REMOVE_BUBBLE}/${chatID}`;

    let formData = new FormData();

    formData.append('from_user_id', fromUserID);
    formData.append('to_user_id', toUserID);
    formData.append('message_count[][userId]', myUserDetails?.user._id);
    formData.append('message_count[][count]', 'null');

    axios({
      method: 'PATCH',
      url: updateChatURL,
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + authToken,
      },
    })
      .then(res => {
        console.log('update remove chat bubble success');
      })
      .catch(error => {
        console.log('Failed to remove chat bubble:', error);
      });
  };
  const UpdateGroupChatRemoveBubble = chatID => {
    const updateChatURL = `${ENDPOINT.REMOVE_BUBBLE}/${chatID}`;

    let formData = new FormData();

    formData.append('from_user_id', myUserDetails?.user._id);
    formData.append('message_count[][userId]', myUserDetails?.user._id);
    formData.append('message_count[][count]', 'null');

    const TIMEOUT_DURATION = 15000;

    axios({
      method: 'PATCH',
      url: updateChatURL,
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + authToken,
      },
      timeout: TIMEOUT_DURATION,
    })
      .then(res => {
        console.log('update remove group chat bubble success');
      })
      .catch(error => {
        console.log('Failed to remove chat bubble:', error);
      });
  };

  const AddOneChat = (
    fromUserID,
    toUserID,
    lastMessage,
    conversationId,
    count,
  ) => {
    const AddChatURL = ENDPOINT.ADD_ONE_CHAT;

    let formData = new FormData();

    formData.append('to_user_id', toUserID);
    formData.append('chatType', 'one-to-one');
    formData.append('last_message', lastMessage);
    formData.append('conversationId', conversationId);
    formData.append('owner', fromUserID);
    formData.append('message_count[][userId]', toUserID);
    formData.append('message_count[][count]', count);

    axios({
      method: 'POST',
      url: AddChatURL,
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + authToken,
      },
    })
      .then(res => {
        console.log('Added One to One Chat');
      })
      .catch(error => {
        console.log(
          'Failed to add One to One Chat',
          error.response.data.message,
        );
        if (error.response.data.message === 'Chat already exists!') {
          UpdateChat(
            error.response.data.data._id,
            fromUserID,
            toUserID,
            lastMessage,
          );
        }
      });
  };

  const UpdateChat = (chatID, fromUserID, toUserID, lastMessage) => {
    const updateChatURL = `${ENDPOINT.UPDATE_CHAT}/${chatID}`;

    let formData = new FormData();

    formData.append('from_user_id', fromUserID);
    formData.append('to_user_id', toUserID);
    formData.append('last_message', lastMessage);
    formData.append('message_count[][userId]', toUserID);
    formData.append('message_count[][count]', 1);

    axios({
      method: 'PATCH',
      url: updateChatURL,
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + authToken,
      },
    })
      .then(res => {
        console.log('update chat success');
      })
      .catch(error => {
        console.log('Failed to update the chat:', error);
      });
  };

  const UpdateGroupChat = (chatID, fromUserID, lastMessage, messageCount) => {
    const updateChatURL = `${ENDPOINT.UPDATE_CHAT}/${chatID}`;

    let formData = new FormData();

    formData.append('from_user_id', fromUserID);
    formData.append('last_message_sender', myUserDetails?.user.username);
    formData.append('last_message', lastMessage);

    messageCount.forEach(function (value, index) {
      console.log('helloasdasd', value.user_id);
      formData.append(`message_count[${index}][userId]`, value.user_id);
      formData.append(`message_count[${index}][count]`, 1);
    });

    axios({
      method: 'PATCH',
      url: updateChatURL,
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + authToken,
      },
    })
      .then(res => {
        console.log('send message group chat  success');
      })
      .catch(error => {
        console.log('Failed to update the chat:', error);
      });
  };

  function GetFollowRequests() {
    axios
      .get(ENDPOINT.GET_PENDING_FOLLOW_REQ, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        setFollowReq(res.data.data.docs);
      })
      .catch(err => {
        console.log('failed to get follow requests');
      });
  }

  function GetSentFollowRequests() {
    axios
      .get(ENDPOINT.GET_SENT_FOLLOW_REQ, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        setSentFollowReq(res.data.data.docs);
      })
      .catch(err => {
        console.log('failed to get follow requests');
      });
  }

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
        sentInvites,
        GetTripInvites,
        GetSentTripInvites,
        isPaymentPending,
        setIsPaymentPending,
        eventData,
        setEventData,
        getPaymentList,
        getPendingPayments,
        paymentList,
        setPaymentList,
        searchResult,
        setSearchResult,
        SearchUsers,
        myPreferences,
        setMyPreferences,
        setMyTrips,
        UpdateChatRemoveBubble,
        AddOneChat,
        followReq,
        GetFollowRequests,
        sentFollowReq,
        GetSentFollowRequests,
        localGroupDetails,
        setLocalGroupDetails,
        pollType,
        setPollType,
        ChatIDForPolls,
        setChatIDForPolls,
        PollsVisible,
        setPollsVisible,
        UpdateGroupChatRemoveBubble,
        UpdateGroupChat,
        tripMembers,
        setTripMembers,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
