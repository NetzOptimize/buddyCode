import React, {useContext, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import RegularBG from '../../../components/background/RegularBG';
import SearchBar from '../../../components/home/SearchBar';
import {COLORS, FONTS} from '../../../constants/theme/theme';

var arrow = require('../../../../assets/Images/arrowGrey.png');
var plus = require('../../../../assets/Images/plus.png');

// **redux
import {useDispatch, useSelector} from 'react-redux';
import {fetchChatList} from '../../../redux/slices/chatListSlice';
import {AuthContext} from '../../../context/AuthContext';
import ChatListItem from '../../../components/chat/ChatListItem';
import NavigationService from '../../../config/NavigationService';
import {SCREENS} from '../../../constants/screens/screen';
import {ChatPushManager} from 'react-native-agora-chat';
import {ENDPOINT} from '../../../constants/endpoints/endpoints';
import axios from 'axios';

const MyChats = () => {
  const {
    myUserDetails,
    GetFollowRequests,
    followReq,
    sentFollowReq,
    GetSentFollowRequests,
    setLocalGroupDetails,
    authToken,
  } = useContext(AuthContext);

  const dispatch = useDispatch();
  const {chatList} = useSelector(state => state.chatList);

  const [searchText, setSearchText] = useState('');
  const [showPendingChats, setShowPendingChats] = useState(false);
  const [loading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchChatList(myUserDetails?.user?._id));
      setShowPendingChats(false);
      GetFollowRequests();
      GetSentFollowRequests();
    }, [myUserDetails?.user?._id]),
  );

  const handleRefresh = () => {
    setIsLoading(true);
    dispatch(fetchChatList(myUserDetails?.user?._id)).then(() => {
      setIsLoading(false);
    });
  };

  function searchChats(searchText, chats) {
    searchText = searchText.toLowerCase().trim();

    if (!searchText) {
      return chats;
    }

    return chats.filter(chat => {
      const lowerSearchText = searchText.toLowerCase();

      if (chat.chatType === 'one-to-one') {
        if (myUserDetails?.user?._id === chat?.from_user_id) {
          const firstName = chat?.to_user?.first_name.toLowerCase();
          const lastName = chat?.to_user?.last_name.toLowerCase();
          if (
            firstName?.includes(lowerSearchText) ||
            lastName?.includes(lowerSearchText)
          ) {
            return true;
          }
        } else {
          const firstName = chat?.from_user?.first_name.toLowerCase();
          const lastName = chat?.from_user?.last_name.toLowerCase();
          if (
            firstName?.includes(lowerSearchText) ||
            lastName?.includes(lowerSearchText)
          ) {
            return true;
          }
        }
      } else if (chat?.chatType === 'group') {
        const groupName = chat?.group_name?.toLowerCase();
        if (groupName?.includes(lowerSearchText)) {
          return true;
        }
      }

      return false;
    });
  }

  const unapprovedChats = chatList?.filter(
    item =>
      item.is_chat_approved === false &&
      item.from_user_id !== myUserDetails?.user._id,
  );

  const approvedChat = chatList?.filter(
    item =>
      item.chatType === 'group' ||
      item.from_user_id === myUserDetails?.user._id ||
      item.is_chat_approved === true,
  );

  const approvalPending = unapprovedChats?.length;

  function showPendingChatsFN() {
    setShowPendingChats(prevValue => !prevValue);
  }

  const filteredChats = searchChats(
    searchText,
    showPendingChats ? unapprovedChats : approvedChat,
  );

  const ReqOptions = [
    {
      id: 1,
      name: 'Friends requests',
      image: require('../../../../assets/Images/friendReq.png'),
      length: followReq.length + sentFollowReq.length,
      action: () => {
        NavigationService.navigate(SCREENS.FRIEND_REQ);
      },
    },
    {
      id: 2,
      name: 'Likes and favorites',
      image: require('../../../../assets/Images/likes.png'),
      length: 0,
      action: () => {
        console.log('one');
      },
    },
    {
      id: 3,
      name: 'Comments and mentions',
      image: require('../../../../assets/Images/chatMentions.png'),
      length: 0,
      action: () => {
        console.log('two');
      },
    },
    {
      id: 4,
      name: showPendingChats ? 'Show All Chat' : 'Chat requests',
      image: showPendingChats
        ? require('../../../../assets/Images/approvedChat.png')
        : require('../../../../assets/Images/pendingChat.png'),
      length: showPendingChats ? approvedChat?.length : approvalPending,
      action: () => {
        showPendingChatsFN();
      },
    },
  ];

  function handleOpenChat(chatData) {
    if (chatData.chatType === 'group') {
      handleOpenGroupChat(chatData._id);
    } else {
      if (myUserDetails?.user?._id === chatData?.from_user_id) {
        NavigationService.navigate(SCREENS.ONE_CHAT, {
          agoraTargetUsername: chatData.to_user.agoraDetails[0].username,
          name: `${chatData.to_user.first_name} ${chatData.to_user.last_name}`,
          chatID: chatData._id,
          chatUserID: chatData.to_user_id,
          profileImage: chatData.to_user.profile_image,
          username: chatData.to_user.username,
          is_chat_approved: true,
          buddydata: chatData.to_user,
        });
      } else {
        NavigationService.navigate(SCREENS.ONE_CHAT, {
          agoraTargetUsername: chatData.from_user.agoraDetails[0].username,
          name: `${chatData.to_user.first_name} ${chatData.to_user.last_name}`,
          chatID: chatData._id,
          chatUserID: chatData.from_user_id,
          profileImage: chatData.from_user.profile_image,
          username: chatData.from_user.username,
          is_chat_approved: chatData.is_chat_approved,
          buddydata: chatData.from_user,
        });
      }
    }
  }

  function handleOpenGroupChat(chatId) {
    const url = `${ENDPOINT.GET_CHAT}/${myUserDetails?.user?._id}`;

    axios
      .get(url, {
        params: {
          chatId: chatId,
        },
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        console.log('get chat data success');
        setLocalGroupDetails({
          chatData: res.data.data.chat,
          tripId: res.data.data.trip_id._id,
        });
        NavigationService.navigate(SCREENS.GROUP_CHAT);
      })
      .catch(err => {
        console.log('Failed to get chat', err.response.data);
      });
  }

  return (
    <RegularBG>
      <View style={{marginTop: 14}}>
        <SearchBar
          searchValue={searchText}
          onChangeText={text => setSearchText(text)}
          onClear={() => setSearchText('')}
        />
      </View>

      <ScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            color="#7879F1"
          />
        }>
        <View style={{gap: 16, marginTop: 10}}>
          {ReqOptions.slice(
            showPendingChats ? 3 : 0,
            showPendingChats ? 4 : 4,
          ).map(data => (
            <TouchableOpacity
              key={data.id}
              style={styles.reqOpContainer}
              onPress={data.action}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 24}}>
                <Image source={data.image} style={{width: 50, height: 50}} />
                <Text style={styles.opText}>{data.name}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {data.length > 0 && (
                  <View
                    style={{
                      borderRadius: 1000,
                      backgroundColor: showPendingChats
                        ? COLORS.ERROR
                        : COLORS.THANOS,
                    }}>
                    <Text style={styles.count}>{data.length}</Text>
                  </View>
                )}
                <Image source={arrow} style={{width: 24, height: 24}} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.hr} />

        {(showPendingChats
          ? searchText === ''
            ? unapprovedChats
            : filteredChats
          : searchText === ''
          ? approvedChat
          : filteredChats
        )?.map((chatData, i) => (
          <ChatListItem
            key={i}
            chatData={chatData}
            onPress={() => handleOpenChat(chatData)}
          />
        ))}

        <View style={{height: 104}} />
      </ScrollView>

      <TouchableOpacity
        style={styles.addChatButton}
        onPress={() =>
          NavigationService.navigate(SCREENS.BUDDY_SEARCH, {
            isForChat: true,
            isForTrip: false,
          })
        }>
        <Image source={plus} style={{width: 32, height: 32}} />
      </TouchableOpacity>
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  reqOpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  opText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  hr: {
    height: 1,
    backgroundColor: COLORS.SWEDEN,
    width: '150%',
    alignSelf: 'center',
    margin: 16,
    borderRadius: 1000,
  },
  count: {
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: 10,
    fontFamily: FONTS.MAIN_SEMI,
    color: COLORS.LIGHT,
    paddingLeft: 8,
    paddingRight: 8,
  },
  addChatButton: {
    width: 44,
    height: 44,
    backgroundColor: '#7879F1',
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'absolute',
    bottom: 116,
    right: 0,
  },
});

export default MyChats;
