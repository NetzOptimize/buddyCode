import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState, useContext, useEffect, useRef} from 'react';

import WideBG from '../../../components/background/WideBG';
import OneChatHeader from '../../../components/chat/OneChatHeader';

import {
  ChatClient,
  ChatOptions,
  ChatMessageChatType,
  ChatMessage,
  ChatConversationType,
  ChatMessageType,
} from 'react-native-agora-chat';
import {COLORS} from '../../../constants/theme/theme';

var sendMessage = require('../../../../assets/Images/sendMessage.png');
var plus = require('../../../../assets/Images/plus.png');

// ** Agora Key
import {AGORA_APP_KEY} from '@env';
import {AuthContext} from '../../../context/AuthContext';
import OneChatMessages from '../../../components/chat/OneChatMessages';
import {ENDPOINT} from '../../../constants/endpoints/endpoints';
import axios from 'axios';
import OpenCamModal from '../../../components/modal/OpenCamModal';
import {handleCameraPermission} from '../../../config/mediaPermission';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import SendViewImage from '../../../components/chat/SendViewImage';
import Spinner from 'react-native-loading-spinner-overlay';

const OneChat = ({navigation, route}) => {
  const {
    agoraTargetUsername,
    name,
    chatID,
    chatUserID,
    profileImage,
    username,
    is_chat_approved,
  } = route.params;

  const {myUserDetails, UpdateChatRemoveBubble, AddOneChat, authToken} =
    useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [myMessages, setMyMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [sendMsgType, setSendMsgType] = useState(ChatMessageType.TXT);
  const [openCamPropmt, setOpenCamPrompt] = useState(false);
  const [agoraImgUrl, setAgoraImgUrl] = useState('');
  const [imageSource, setImageSource] = useState(null);
  const [sendImageOpen, setSendImageOpen] = useState(false);
  const [viewImage, setViewImage] = useState(false);

  const scrollViewRef = useRef(null);
  const messageInputRef = useRef(null);

  // --- send message button --- //
  let SendMessageButton;

  if (messageContent.trim().length > 0) {
    SendMessageButton = (
      <TouchableOpacity
        style={styles.sendMessageBtn}
        onPress={() => sendMessageFN(messageContent.trim())}
        disabled={messageContent.trim().length < 1}>
        <Image source={sendMessage} style={{width: 24, height: 24}} />
      </TouchableOpacity>
    );
  } else {
    SendMessageButton = (
      <TouchableOpacity
        style={styles.sendImageBtn}
        onPress={() => setOpenCamPrompt(true)}>
        <Image source={plus} style={{width: 32, height: 32}} />
      </TouchableOpacity>
    );
  }

  function sendMessageFN() {
    const messageType =
      sendMsgType === 'txt' ? ChatMessageType.TXT : ChatMessageType.IMAGE;
    const chatType = ChatMessageChatType.PeerChat;
    let msg;

    if (this.isInitialized === false || this.isInitialized === undefined) {
      console.log('Perform initialization first.');
      return;
    }

    if (messageType === ChatMessageType.TXT) {
      msg = ChatMessage.createTextMessage(targetId, messageContent, chatType);
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

      setAgoraImgUrl(null);
      setImageSource(null);
      setSendMsgType(ChatMessageType.TXT);
    }

    const callback = new (class {
      onProgress(locaMsgId, progress) {
        console.log(`send message process: ${locaMsgId}, ${progress}`);
        setLoading(true);
      }
      onError(locaMsgId, error) {
        console.log(
          `send message fail: ${locaMsgId}, ${JSON.stringify(error)}`,
        );
      }
      onSuccess(message) {
        console.log('message sent', message);

        setLoading(false);

        setMyMessages([
          ...myMessages,
          {
            content: message.body.hasOwnProperty('content')
              ? message.body.content
              : message.body.remotePath,
            direction: 'right',
            isText: message.body.hasOwnProperty('content') ? 'True' : 'False',
          },
        ]);

        setMessageContent('');

        if (message.body.hasOwnProperty('content')) {
          AddOneChat(
            myUserDetails.user._id,
            chatUserID,
            messageContent,
            agoraTargetUsername,
            1,
          );
          SendNotification(
            `${myUserDetails.user.first_name} ${myUserDetails.user.last_name}`,
            messageContent,
            chatUserID,
          );
        } else {
          AddOneChat(
            myUserDetails.user._id,
            chatUserID,
            '🖼 image',
            agoraTargetUsername,
            1,
          );
          SendNotification(
            `${myUserDetails.user.first_name} ${myUserDetails.user.last_name}`,
            '🖼 image',
            chatUserID,
          );
        }

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
  }

  const SendNotification = (title, body, receiversID) => {
    const SendNotificationURL = ENDPOINT.SEND_NOTIFICAION;

    var user = {
      title: `${title}`,
      body: body,
      receivers: [receiversID],
      notification_type: 'chat',
      navigate_to: 'ChatScreens',
    };

    axios
      .post(SendNotificationURL, user, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        console.log('Notification sent');
      })
      .catch(err => {
        console.log('error sending notification:', err.response.data);
      });
  };

  const chatClient = ChatClient.getInstance();
  const chatManager = chatClient.chatManager;

  const appKey = AGORA_APP_KEY;
  const targetId = agoraTargetUsername;

  useEffect(() => {
    const setMessageListener = () => {
      let msgListener = {
        onMessagesReceived(messages) {
          console.log('one to one chat listener', messages);
          const newMessages = messages.map(message => ({
            content: message.body.hasOwnProperty('content')
              ? message.body.content
              : message.body.remotePath,
            direction:
              message.from === myUserDetails?.user?.agoraDetails[0]?.username
                ? 'right'
                : 'left',
            isText: message.body.hasOwnProperty('content') ? 'True' : 'False',
            from: message.from,
          }));

          setMyMessages(oldMessages => [...oldMessages, ...newMessages]);

          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd();
          }, 10);
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
            'init fail: ' +
              (error instanceof Object ? JSON.stringify(error) : error),
          );
        });
    };
    init();

    return () => {
      chatClient.removeAllConnectionListener();
    };
  }, [chatClient, chatManager, appKey]);

  function prevMessages() {
    setLoading(true);

    const convId = agoraTargetUsername;
    const convType = ChatConversationType.PeerChat;
    const pageSize = 30;
    const startMsgId = username;

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
          };
        });

        console.log(
          `successfully loaded previous ${pMessages.length} messages`,
        );
        UpdateChatRemoveBubble(chatID, myUserDetails.user._id, chatUserID);

        setMyMessages(pMessages);
        setLoading(false);

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd();
        }, 10);
      })
      .catch(reason => {
        console.log('Failed to load previous messages', reason);
        setLoading(false);
      });
  }

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

  return (
    <WideBG>
      <Spinner visible={loading} color={COLORS.THANOS} />
      <OneChatHeader
        goBack={() => navigation.goBack()}
        name={name}
        username={username}
        profileImage={profileImage}
      />
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <View style={styles.messagesContainer}>
          {myMessages.map((message, i) => (
            <OneChatMessages
              key={i}
              message={message}
              viewImage={() => {
                setViewImage(true);
                setImageSource(message.content);
              }}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.messageBoxContainer}>
        <TextInput
          placeholder="Message"
          multiline={true}
          ref={messageInputRef}
          placeholderTextColor="#f2f2f2"
          style={styles.messageBox}
          value={messageContent}
          onChangeText={text => setMessageContent(text)}
        />
        {SendMessageButton}
      </View>

      <OpenCamModal
        visible={openCamPropmt}
        onCamPress={handleCameraImagePicker}
        onLibraryPress={handleGalleryPicker}
        onClose={() => setOpenCamPrompt(false)}
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
          sendMessageFN();
          setSendImageOpen(false);
          setViewImage(false);
        }}
      />
    </WideBG>
  );
};

export default OneChat;

const styles = StyleSheet.create({
  messageBoxContainer: {
    width: '112%',
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
  },
  sendMessageBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  sendImageBtn: {
    backgroundColor: COLORS.THANOS,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
  },
  messagesContainer: {
    width: '92%',
    alignSelf: 'center',
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});
