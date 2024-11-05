import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import React, {useState, useContext, useEffect, useRef} from 'react';

import WideBG from '../../../components/background/WideBG';

import {
  ChatClient,
  ChatOptions,
  ChatMessageChatType,
  ChatMessage,
  ChatConversationType,
  ChatMessageType,
} from 'react-native-agora-chat';
import {COLORS} from '../../../constants/theme/theme';

// ** Agora Key
import {AGORA_APP_KEY} from '@env';
import {AuthContext} from '../../../context/AuthContext';
import {ENDPOINT} from '../../../constants/endpoints/endpoints';
import axios from 'axios';
import OpenCamModal from '../../../components/modal/OpenCamModal';
import {handleCameraPermission} from '../../../config/mediaPermission';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import SendViewImage from '../../../components/chat/SendViewImage';
import Spinner from 'react-native-loading-spinner-overlay';
import GroupChatHeader from '../../../components/chat/GroupChatHeader';
import CreatePoll from '../../../components/chat/CreatePoll';
import Toast from 'react-native-toast-message';
import * as Progress from 'react-native-progress';
import { SCREENS } from '../../../constants/screens/screen';

var img = require('../../../../assets/Images/img.png');
var poll = require('../../../../assets/Images/poll.png');
var close = require('../../../../assets/Images/close.png');
var sendMessage = require('../../../../assets/Images/sendMessage.png');
var plus = require('../../../../assets/Images/plus.png');
var selectTick = require('../../../../assets/Images/circleSelect.png');
var noDP = require('../../../../assets/Images/noDP.png');


const GroupChat = ({navigation}) => {
  const {
    localGroupDetails,
    PollsVisible,
    setPollsVisible,
    pollType,
    setPollType,
    authToken,
    UpdateGroupChatRemoveBubble,
    myUserDetails,
    UpdateGroupChat,
  } = useContext(AuthContext);

  const scrollViewRef = useRef(null);

  const allMembersPic = {};

  for (let i = 0; i < localGroupDetails.chatData.members.length; i++) {
    const obj = localGroupDetails.chatData.members[i];
    allMembersPic[obj.username] = obj.profile_image;
  }

  allMembersPic[localGroupDetails.chatData.owner.username] =
    localGroupDetails.chatData.owner.profile_image;

  const [PollQuestion, setPollQuestion] = useState('');
  const [inputValue, setInputValue] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [myMessages, setMyMessages] = useState([]);
  const [sendMsgType, setSendMsgType] = useState(ChatMessageType.TXT);
  const [messageContent, setMessageContent] = useState('');
  const [openCamPropmt, setOpenCamPrompt] = useState(false);
  const [agoraImgUrl, setAgoraImgUrl] = useState('');
  const [imageSource, setImageSource] = useState(null);
  const [sendImageOpen, setSendImageOpen] = useState(false);
  const [viewImage, setViewImage] = useState(false);
  const [isAddMediaVisible, setIsAddMediaVisible] = useState(false);
  const [polls, setPolls] = useState([]);

  const [isKeyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    let keyboardShowListener;
    let keyboardHideListener;

    if (Platform.OS === 'ios') {
      keyboardShowListener = Keyboard.addListener(
        'keyboardWillShow',
        _handleKeyboardShow,
      );
      keyboardHideListener = Keyboard.addListener(
        'keyboardWillHide',
        _handleKeyboardHide,
      );
    } else {
      keyboardShowListener = Keyboard.addListener(
        'keyboardDidShow',
        _handleKeyboardShow,
      );
      keyboardHideListener = Keyboard.addListener(
        'keyboardDidHide',
        _handleKeyboardHide,
      );
    }

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  const _handleKeyboardShow = () => {
    setKeyboardOpen(true);
  };

  const _handleKeyboardHide = () => {
    setKeyboardOpen(false);
  };

  const handleCameraImagePicker = async () => {
    const hasPermission = await handleCameraPermission();
    if (hasPermission) {
      console.log(hasPermission);
      openCameraImagePicker();
    }
  };

  function handleGalleryPicker() {
    const options = {
      quality: 0.3,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel === true) {
        console.log('user canceled');
      } else {
        setOpenCamPrompt(false);
        setSendImageOpen(true);
        setSendMsgType(ChatMessageType.IMAGE);

        setImageSource(response.assets[0].uri);
        setAgoraImgUrl(
          response.assets[0].uri.slice(7, response.assets[0].uri.length),
        );
      }
    });
  }

  function openCameraImagePicker() {
    const options = {};

    launchCamera(options, response => {
      if (response.didCancel === true) {
        console.log('user canceled');
      } else {
        setOpenCamPrompt(false);
        setSendImageOpen(true);
        setSendMsgType(ChatMessageType.IMAGE);

        setImageSource(response.assets[0].uri);
        setAgoraImgUrl(
          response.assets[0].uri.slice(7, response.assets[0].uri.length),
        );
      }
    });
  }

  // --- send message button --- //
  let SendMessageButton;

  if (messageContent.trim().length > 0) {
    SendMessageButton = (
      <TouchableOpacity
        style={styles.sendMessageBtn}
        onPress={() => {
          sendmsg(messageContent.trim(), 'text');
        }}
        disabled={messageContent.trim().length < 1}>
        <Image source={sendMessage} style={{width: 24, height: 24}} />
      </TouchableOpacity>
    );
  } else {
    SendMessageButton = (
      <TouchableOpacity
        style={styles.sendMessageBtn}
        onPress={() => setIsAddMediaVisible(true)}>
        <Image source={plus} style={{width: 32, height: 32}} />
      </TouchableOpacity>
    );
  }

  function CancelPoll() {
    setPollsVisible(false);
    setPollQuestion(false);
    setPollType('Question type');
    setInputValue('');
  }

  const handleInputChange = () => {
    const items = inputValue.trim().split(',');
    const filteredItems = items
      .map(item => item.trim())
      .filter(item => item !== '');

    const duplicates = filteredItems.filter(
      (item, index) => filteredItems.indexOf(item) !== index,
    );
    if (duplicates.length > 0) {
      Toast.show({
        type: 'error',
        text2: `Duplicate options: ${duplicates.join(', ')}`,
      });
    } else {
      if ([...new Set(filteredItems)].length < 2) {
        Toast.show({
          type: 'error',
          text2: 'Please add Two or more choices',
        });
      } else {
        Toast.show({
          type: 'success',
          text2: 'Poll Created',
        });
        CreateNewPollFN(
          localGroupDetails.chatData._id,
          PollQuestion,
          pollType,
          [...new Set(filteredItems)],
        );
      }
    }
  };

  const CreateNewPollFN = (chatID, question, type, options) => {
    setLoading(true);

    var user = {
      chat_id: chatID,
      question: question,
      question_type:
        type === 'Single choice' ? 'single_choice' : 'multiple_choice',
      options: options,
    };

    axios
      .post(ENDPOINT.CREATE_POLL, user, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        console.log('Poll Created successfully', res.data.data.poll);
        setLoading(false);
        setPollsVisible(false);
        sendmsg(res.data.data.poll._id, 'poll');
        CancelPoll();
      })
      .catch(err => {
        setPollsVisible(false);
        setLoading(false);
        console.log('failed to create poll:', err.response.data, user);
      });
  };

  const AddVote = (pollID, type, pickedOption) => {
    console.log('Picked Option:', pickedOption);

    const AddVoteURL = `${ENDPOINT.ADD_VOTE}`;

    var user = {
      poll_id: pollID,
      user_id: myUserDetails.user._id,
      question_type: type,
      vote_on: [pickedOption],
    };

    axios
      .post(AddVoteURL, user, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        console.log('vote added:', res.data.data);
        // GetPolls();
      })
      .catch(err => {
        console.log('failed to add vote:', err.response.data);
      });
  };

  const GetPolls = () => {
    const getPollsURL = `${ENDPOINT.GET_POLLS}/${localGroupDetails?.chatData?._id}`;

    axios
      .get(getPollsURL, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        setPolls(res.data.data.pollData);
      })
      .catch(err => {
        if (err.response.data.message == 'No Poll Found') {
          setPolls([]);
        }
      });
  };

  useEffect(() => {
    GetPolls();

    const intervalId = setInterval(GetPolls, 1500);

    return () => clearInterval(intervalId);
  }, []);

  // --- agora chat --- //
  const chatClient = ChatClient.getInstance();
  const chatManager = chatClient.chatManager;

  const appKey = '41695554#960499';
  const targetId = String(localGroupDetails?.chatData?.conversationId);

  useEffect(() => {
    const setMessageListener = () => {
      UpdateGroupChatRemoveBubble(localGroupDetails.chatData._id);
      let msgListener = {
        onMessagesReceived(messages) {
          console.log('group chat listener', messages);
          for (let index = 0; index < messages.length; index++) {
            if (messages[0].conversationId === targetId) {
              setMyMessages(oldArray => [
                ...oldArray,
                {
                  content: messages[index].body.hasOwnProperty('content')
                    ? messages[index].body.content
                    : messages[index].body.remotePath,
                  direction:
                    messages[index].from === myUserDetails.user.username
                      ? 'right'
                      : 'left',
                  isText: messages[index].body.hasOwnProperty('content')
                    ? 'True'
                    : 'False',
                  from: messages[index].from,
                },
              ]);
            }

            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd();
            }, 10);
          }
        },
      };
      chatManager.removeAllMessageListener();
      chatManager.addMessageListener(msgListener);
    };

    const init = () => {
      let o = new ChatOptions({
        autoLogin: false,
        appKey: appKey,
      });
      chatClient.removeAllConnectionListener();
      chatClient
        .init(o)
        .then(() => {
          console.log('init success');
          setMessageListener();
          prevMessages();
          this.isInitialized = true;
          let listener = {
            onTokenWillExpire() {
              console.log('token expire.');
            },
            onTokenDidExpire() {
              console.log('token did expire');
            },
            onConnected() {
              console.log('onConnected');
            },
            onDisconnected(errorCode) {
              console.log('onDisconnected:' + errorCode);
            },
          };
          chatClient.addConnectionListener(listener);
        })
        .catch(error => {
          console.log(
            'init fail: ',
            error + (error instanceof Object ? JSON.stringify(error) : error),
          );
          setLoading(false);
        });
    };
    init();

    return () => {
      chatClient.removeAllConnectionListener();
    };
  }, [chatClient, chatManager, appKey]);

  const sendmsg = (message, type) => {
    const messageType =
      type === 'text' || type === 'poll'
        ? ChatMessageType.TXT
        : ChatMessageType.IMAGE;

    const chatType = ChatMessageChatType.GroupChat;
    let msg;

    if (this.isInitialized === false || this.isInitialized === undefined) {
      console.log('Perform initialization first.');
      return;
    }

    if (messageType === ChatMessageType.TXT) {
      msg = ChatMessage.createTextMessage(targetId, message, chatType);
    } else if (messageType === ChatMessageType.IMAGE) {
      const filePath = agoraImgUrl;
      const width = 100;
      const height = 100;
      const displayName =
        'rn_image_picker_lib_temp_d5057e73-f4b0-43f9-b606-b6747e66d008.jpg';
      msg = ChatMessage.createImageMessage(targetId, filePath, chatType, {
        displayName,
        width,
        height,
      });
    }

    const callback = new (class {
      onProgress(locaMsgId, progress) {
        console.log(`send message process: ${locaMsgId}, ${progress}`);
        setLoading(true);
      }
      onError(locaMsgId, error) {
        console.log(
          `send message fail 1: ${locaMsgId}, ${JSON.stringify(error)}`,
        );
      }
      onSuccess(message) {
        console.log('sendMessage: ', message);
        setMessageContent('');
        setLoading(false);
        setAgoraImgUrl(null);
        setImageSource(null);

        setMyMessages([
          ...myMessages,
          {
            content: message.body.hasOwnProperty('content')
              ? message.body.content
              : message.body.remotePath,
            direction: 'right',
            isText: message.body.hasOwnProperty('content') ? 'True' : 'False',
            from: myUserDetails.user.agoraDetails[0].username,
          },
        ]);

        UpdateGroupChatFN(messageContent, type);

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd();
          console.log('send success');
        }, 10);
      }
    })();
    console.log('start send message ...');
    chatClient.chatManager
      .sendMessage(msg, callback)
      .then(() => {
        console.log('send message: ' + msg.localMsgId);
      })
      .catch(reason => {
        console.log('send fail: ' + JSON.stringify(reason));
        setLoading(false);
      });
  };

  function UpdateGroupChatFN(content, type) {
    let messageCount = [];

    // Loop over member
    localGroupDetails.chatData.members.forEach(function (value) {
      if (value._id !== myUserDetails.user._id) {
        messageCount.push({
          user_id: value._id,
          count: 1,
        });
      }
    });

    if (localGroupDetails.chatData.owner._id !== myUserDetails.user._id) {
      messageCount.push({
        user_id: localGroupDetails.chatData.owner._id,
        count: 1,
      });
    }

    console.log(content, type);

    if (type == 'text') {
      UpdateGroupChat(
        localGroupDetails.chatData._id,
        myUserDetails.user._id,
        content,
        messageCount,
      );
      SendNotification(
        `${localGroupDetails.chatData.group_name}`,
        `${myUserDetails.user.first_name} ${myUserDetails.user.last_name}: ${content}`,
      );
    } else if (type == 'poll') {
      UpdateGroupChat(
        localGroupDetails.chatData._id,
        myUserDetails.user._id,
        '🗳️ Poll',
        messageCount,
      );
      SendNotification(
        `${localGroupDetails.chatData.group_name}`,
        `${myUserDetails.user.first_name} ${myUserDetails.user.last_name}: 🗳️ Poll`,
      );
    } else {
      UpdateGroupChat(
        localGroupDetails.chatData._id,
        myUserDetails.user._id,
        '🖼 Image',
        messageCount,
      );
      SendNotification(
        `${localGroupDetails.chatData.group_name}`,
        `${myUserDetails.user.first_name} ${myUserDetails.user.last_name}: 🖼 Image`,
      );
    }
  }

  const allMembers = [
    ...localGroupDetails.chatData.members.map(d => d._id),
    localGroupDetails.chatData.owner._id,
  ];

  const SendNotification = (title, body) => {
    const SendNotificationURL = ENDPOINT.SEND_NOTIFICAION;

    var user = {
      title: `${title}`,
      body: body,
      receivers: allMembers,
      notification_type: 'group_chat',
      navigate_to: localGroupDetails.chatData._id,
    };

    axios
      .post(SendNotificationURL, user, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        console.log('Notification sent:', res.data.data);
      })
      .catch(err => {
        console.log('error sending notification:', err.response.data);
      });
  };

  function prevMessages() {
    setLoading(true);

    const convId = targetId;
    const convType = ChatConversationType.GroupChat;
    const pageSize = 30;
    const startMsgId = myUserDetails.user.agoraDetails[0].username;
    ChatClient.getInstance()
      .chatManager.fetchHistoryMessages(convId, convType, pageSize, startMsgId)
      .then(messages => {
        let pMessages = [];

        pMessages = messages.list.map(d => {
          return {
            content: d.body.hasOwnProperty('displayName')
              ? d.body.remotePath
              : d.body.content,
            direction: d.direction === 'send' ? 'right' : 'left',
            isText: d.body.hasOwnProperty('displayName') ? 'False' : 'True',
            from: d.from,
          };
        });

        console.log(
          `successfully loaded previous ${pMessages.length} messages`,
        );
        setMyMessages(pMessages);
        setLoading(false);

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd();
        }, 10);
      })
      .catch(reason => {
        Toast.show({
          type: 'error',
          text1: 'Server Error',
          text2: 'Failed to fetch previous chat'
        })
        console.log('Failed to load previous messages', reason);
        setLoading(false);
      });
  }

  const handleScroll = event => {
    const {contentOffset} = event.nativeEvent;
    if (contentOffset.y === 0) {
      setLoadingMessages(true);
      console.log('Loading messages');
      loadMoreChatHistory();
    }
  };

  const [count, setCount] = useState(50);

  function loadMoreChatHistory() {
    setCount(count + 30);
    console.log(count);
    const convId = targetId;
    const convType = ChatConversationType.GroupChat;
    const pageSize = count;
    const startMsgId = myUserDetails.user.agoraDetails[0].username;
    ChatClient.getInstance()
      .chatManager.fetchHistoryMessages(convId, convType, pageSize, startMsgId)
      .then(messages => {
        let pMessages = [];
        pMessages = messages.list.map(d => {
          return {
            content: d.body.hasOwnProperty('displayName')
              ? d.body.remotePath
              : d.body.content,
            direction: d.direction === 'send' ? 'right' : 'left',
            isText: d.body.hasOwnProperty('displayName') ? 'False' : 'True',
            from: d.from,
          };
        });
        setMyMessages(pMessages);
        setLoadingMessages(false);
      })
      .catch(reason => {
        console.log('load conversions fail 1.', reason);
        setLoadingMessages(false);
      });
  }

  function handleOpenTrip() {
    const tripId = {_id: localGroupDetails?.tripId};
    const myTrip =
      localGroupDetails?.chatData?.owner?._id == myUserDetails?.user?._id;

    navigation.navigate('TripsStack', {
      screen: SCREENS.VIEW_MY_TRIP,
      params: {
        tripData: tripId,
        isMyTrip: myTrip,
      },
    });
  }


  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
        <Spinner visible={loading} color={COLORS.THANOS} />

        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <GroupChatHeader
            goBack={() => navigation.goBack()}
            name={localGroupDetails?.chatData?.group_name}
            profileImage={localGroupDetails?.chatData?.profileImage}
            memberCount={localGroupDetails.chatData.members.length + 1}
            onViewTrip={handleOpenTrip}
          />
          <ScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: COLORS.GREY_DARK}}>
            <View style={styles.messagesContainer}>
              {myMessages.map((message, i) => {
                return (
                  <View
                    key={i}
                    style={
                      message.direction === 'right'
                        ? styles.sentMessagesBubble
                        : styles.receivedMessagesBubble
                    }>
                    {message.direction === 'left' && (
                      <Image
                        source={
                          allMembersPic[message.from]
                            ? {uri: allMembersPic[message.from]}
                            : noDP
                        }
                        style={styles.senderDP}
                      />
                    )}

                    <View>
                      {message.direction === 'left' && (
                        <Text style={styles.username}>@{message.from}</Text>
                      )}
                      {message.isText === 'True' ? (
                        polls.find(poll => poll._id === message.content) ? (
                          polls.map(poll => {
                            if (poll._id === message.content) {
                              const totalCalculatedVotes = poll.votes.reduce(
                                (total, votesForOption) =>
                                  total + votesForOption,
                                0,
                              );

                              return (
                                <View
                                  key={poll._id}
                                  style={styles.pollContainer}>
                                  <Text style={styles.pollQuestion}>
                                    {poll.question}
                                  </Text>

                                  <View style={styles.pollTypeBox}>
                                    <View style={styles.TickContainer}>
                                      <Image
                                        style={styles.tickPollImg}
                                        source={selectTick}
                                      />
                                      {poll.question_type ==
                                        'multiple_choice' && (
                                        <Image
                                          style={styles.tickPollImg}
                                          source={selectTick}
                                        />
                                      )}
                                    </View>
                                    <Text style={styles.pollTypeText}>
                                      {poll.question_type == 'multiple_choice'
                                        ? 'Select one or more'
                                        : 'Select one'}
                                    </Text>
                                  </View>

                                  {poll.options.map((op, k) => {
                                    const isLastOption =
                                      k === poll.options.length - 1;
                                    const votersForOption = poll.voters[k];
                                    const totalVotesForOption = poll.votes[k];

                                    const percentage = (
                                      (totalVotesForOption /
                                        totalCalculatedVotes) *
                                      100
                                    ).toFixed(0);

                                    const formattedPercentage = isNaN(
                                      percentage,
                                    )
                                      ? 0
                                      : percentage;

                                    const decimal = Math.min(
                                      1,
                                      (
                                        totalVotesForOption /
                                        totalCalculatedVotes
                                      ).toFixed(2),
                                    );
                                    const formattedDecimal = isNaN(decimal)
                                      ? 0
                                      : decimal;

                                    return (
                                      <View
                                        key={k}
                                        style={{
                                          width: '90%',
                                          alignSelf: 'center',
                                        }}>
                                        <TouchableOpacity
                                          style={styles.optionStyle}
                                          onPress={() => {
                                            AddVote(
                                              poll._id,
                                              poll.question_type,
                                              k,
                                            );
                                          }}>
                                          <Text style={styles.optionText}>
                                            {op}
                                          </Text>
                                        </TouchableOpacity>

                                        <Progress.Bar
                                          animated
                                          animationType="spring"
                                          progress={formattedDecimal}
                                          width={null}
                                          style={{
                                            marginTop: 10,
                                            display:
                                              formattedDecimal === 0
                                                ? 'none'
                                                : 'flex',
                                            borderRadius: 100,
                                          }}
                                          color={
                                            formattedDecimal === 0
                                              ? '#4F4F4F'
                                              : '#7879F1'
                                          }
                                          height={12}
                                        />

                                        <Text
                                          style={[
                                            styles.votePercent,
                                            {
                                              marginTop:
                                                formattedPercentage == 0
                                                  ? 0
                                                  : 5,
                                            },
                                          ]}>
                                          {formattedPercentage == 0
                                            ? null
                                            : `${formattedPercentage}%`}
                                        </Text>

                                        <View style={styles.voterNamesBox}>
                                          {votersForOption.map(
                                            (voter, index) => (
                                              <Text
                                                key={index}
                                                style={styles.voteBy}>
                                                @{voter}
                                              </Text>
                                            ),
                                          )}
                                        </View>

                                        {!isLastOption && (
                                          <View style={styles.lineBreak} />
                                        )}
                                      </View>
                                    );
                                  })}
                                </View>
                              );
                            }

                            return null;
                          })
                        ) : (
                          <View
                            style={
                              message.direction === 'right'
                                ? styles.sentMessageBox
                                : styles.receivedMessageBox
                            }>
                            <Text
                              style={
                                message.direction === 'right'
                                  ? styles.sentMessagesText
                                  : styles.receivedMessagesText
                              }>
                              {message.content}
                            </Text>
                          </View>
                        )
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            setViewImage(true);
                            setImageSource(message.content);
                          }}>
                          <Image
                            source={{uri: message.content}}
                            style={
                              message.direction === 'right'
                                ? styles.sentImageMessage
                                : styles.receivedImageMessage
                            }
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {isAddMediaVisible && (
            <View style={styles.attacthment}>
              <View
                style={{
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => setOpenCamPrompt(true)}>
                  <Image source={img} style={{width: 24, height: 24}} />
                  <Text style={styles.attacthmentText}>Image</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => setPollsVisible(true)}>
                  <Image
                    source={poll}
                    style={{width: 24, height: 24, marginLeft: 32}}
                  />
                  <Text style={styles.attacthmentText}>Poll</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => setIsAddMediaVisible(false)}>
                <Image source={close} style={{width: 24, height: 24}} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.messageBoxContainer}>
            <TextInput
              placeholder="Message"
              multiline={true}
              placeholderTextColor="#f2f2f2"
              style={styles.messageBox}
              value={messageContent}
              onChangeText={text => setMessageContent(text)}
            />
            {SendMessageButton}
          </View>
        </KeyboardAvoidingView>

        <OpenCamModal
          visible={openCamPropmt}
          onCamPress={handleCameraImagePicker}
          onClose={() => setOpenCamPrompt(false)}
          onLibraryPress={() => {
            setOpenCamPrompt(false);
            setTimeout(() => {
              handleGalleryPicker();
            }, 500);
          }}
        />

        <SendViewImage
          isVisible={sendImageOpen || viewImage}
          onClose={() => {
            setSendImageOpen(false);
            setViewImage(false);
          }}
          imageURL={imageSource}
          ViewImage={viewImage}
          onSend={() => {
            sendmsg('image', 'image');
            setSendImageOpen(false);
            setViewImage(false);
          }}
        />

        <CreatePoll
          isPollVisible={PollsVisible}
          onChangeQuestion={text => setPollQuestion(text)}
          onChangeOptions={text => setInputValue(text)}
          optionsValue={inputValue}
          onCancel={() => CancelPoll()}
          onSubmit={() => {
            if (PollQuestion == '') {
              Toast.show({
                type: 'error',
                text2: 'Please enter your Question',
              });
            } else if (pollType == 'Question type') {
              Toast.show({
                type: 'error',
                text2: 'Please select Poll Type',
              });
            } else {
              handleInputChange();
            }
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  messagesContainer: {
    width: '92%',
    alignSelf: 'center',
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#3A3A3A',
  },
  messageBoxContainer: {
    width: '104%',
    alignSelf: 'center',
    backgroundColor: 'black',
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageBox: {
    maxHeight: 118,
    backgroundColor: '#828282',
    borderRadius: 24,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    padding: 16,
    width: '88%',
    color: 'white',
    minHeight: 56,
    paddingTop: 18,
  },
  sendMessageBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  senderDP: {
    width: 44,
    height: 44,
    marginRight: 8,
    borderRadius: 1000,
  },
  username: {
    color: '#F2994A',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 24,
  },
  sentMessagesBubble: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  receivedMessagesBubble: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    flexDirection: 'row',
  },
  sentMessagesText: {
    fontSize: 14,
    color: '#f2f2f2',
    lineHeight: 22,
    fontFamily: 'Montserrat-Regular',
  },

  sentMessageBox: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#7879F1',
    borderRadius: 20,
  },

  receivedMessagesText: {
    fontSize: 14,
    color: 'black',
    lineHeight: 22,
    fontFamily: 'Montserrat-Regular',
  },

  receivedMessageBox: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
  },

  receivedImageMessage: {
    width: 240,
    height: 240,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: '#f2f2f2',
  },
  sentImageMessage: {
    width: 240,
    height: 240,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: '#7879F1',
  },
  attacthment: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'black',
    padding: 12,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'space-between',
  },
  attacthmentText: {
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    fontSize: 14,
    marginLeft: 4,
    lineHeight: 28,
  },
  pollContainer: {
    minWidth: '88%',
    backgroundColor: '#4F4F4F',
    padding: 8,
    borderRadius: 10,
  },
  pollQuestion: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    marginBottom: 10,
  },
  pollTypeBox: {
    flexDirection: 'row',
  },
  TickContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tickPollImg: {
    width: 15,
    height: 15,
    marginLeft: 2,
  },
  pollTypeText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 10,
    color: '#D9D9D9',
    marginLeft: 5,
  },
  optionStyle: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'white',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  optionText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#F2F2F2',
    width: '90%',
  },
  votePercent: {
    fontSize: 13,
    color: '#ffffff',
    fontFamily: 'Montserrat-SemiBold',
  },
  voterNamesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  voteBy: {
    fontSize: 11,
    color: '#7879F1',
    fontFamily: 'Montserrat-Regular',
  },
  lineBreak: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SWEDEN,
    width: '105%',
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  sent: {
    backgroundColor: '#7879F1',
    borderRadius: 20,
  },
  received: {backgroundColor: '#f2f2f2', borderRadius: 20},
});

export default GroupChat;
