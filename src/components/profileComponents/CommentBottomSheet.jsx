import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';

// **theme
import {COLORS, FONTS} from '../../constants/theme/theme';
import {AuthContext} from '../../context/AuthContext';
import {ENDPOINT} from '../../constants/endpoints/endpoints';

// **3rd party imports
import axios from 'axios';
import {useSelector} from 'react-redux';

// **images
var close = require('../../../assets/Images/close.png');
var sendBtn = require('../../../assets/Images/sendMessage.png');
var noDP = require('../../../assets/Images/noDP.png');
var heart = require('../../../assets/Images/heart.png');
var redHeart = require('../../../assets/Images/redHeart.png');
var deleteIcon = require('../../../assets/Images/delete.png');

import {useDispatch} from 'react-redux';
import {fetchTripComments} from '../../redux/slices/tripCommentsSlice';
import FastImage from 'react-native-fast-image';

function CommentBox({comment, tripId}) {
  const {authToken, myUserDetails} = useContext(AuthContext);
  const dispatch = useDispatch();
  const likedCommentToCheck = comment._id;

  const isLiked = myUserDetails?.likedComments?.some(
    likedTrip => likedTrip.comment_id?._id === likedCommentToCheck,
  );

  const [like, setLike] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(comment.like_count);

  useEffect(() => {
    setLike(isLiked);
  }, [isLiked, myUserDetails]);

  const LikeTripComment = commentID => {
    const likeCommentURL = ENDPOINT.LIKE_COMMENT;

    const formData = new FormData();
    formData.append('comment_id', commentID);

    axios
      .post(likeCommentURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        console.log('comment liked:', res.data.data);
        setLike(prev => !prev);

        // Update like count
        setLikeCount(prev => (like ? prev - 1 : prev + 1));
      })
      .catch(err => {
        console.log('failed to like comment', err.response.data);
      });
  };

  const deleteComment = commentID => {
    const likeCommentURL = `${ENDPOINT.DELETE_COMMENT}/${commentID}`;

    axios
      .delete(likeCommentURL, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        console.log('comment deleted:', res.data.data);
        dispatch(fetchTripComments(tripId));
      })
      .catch(err => {
        console.log('failed to delete comment', err.response.data);
      });
  };

  const userInactive =
    comment.user_id.status == 'inactive' || comment.user_id.is_deleted;

  const myComment = myUserDetails?.user?._id == comment?.user_id._id;

  return (
    <View style={{marginTop: 10}}>
      <View style={styles.commentBox}>
        {userInactive ? (
          <FastImage
            source={noDP}
            style={{width: 30, height: 30, borderRadius: 1000, marginTop: 4}}
          />
        ) : (
          <FastImage
            source={
              comment.user_id.profile_image
                ? {uri: comment.user_id.profile_image}
                : noDP
            }
            style={{width: 30, height: 30, borderRadius: 1000, marginTop: 4}}
          />
        )}
        <View
          style={{
            width: myComment ? '73%' : userInactive ? '89%' : '83%',
          }}>
          <Text style={styles.name}>
            {userInactive
              ? 'Buddypass User'
              : `${comment.user_id.first_name} ${comment.user_id.last_name}`}
          </Text>
          <Text style={styles.comment}>{comment.description}</Text>
        </View>

        {!userInactive && (
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
            }}>
            <TouchableOpacity
              onPress={() => LikeTripComment(comment?._id)}
              style={{alignItems: 'center'}}>
              <FastImage
                source={like ? redHeart : heart}
                style={{width: 18, height: 18}}
              />
              <Text style={styles.likeCount}>{likeCount}</Text>
            </TouchableOpacity>

            {myUserDetails?.user?._id == comment?.user_id._id && (
              <TouchableOpacity
                onPress={() => deleteComment(comment?._id)}
                style={{alignItems: 'center'}}>
                <Image source={deleteIcon} style={{width: 24, height: 24}} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={{borderBottomWidth: 1, borderColor: COLORS.SWEDEN}} />
    </View>
  );
}

const CommentBottomSheet = ({visible, onClose}) => {
  const {myUserDetails, authToken} = useContext(AuthContext);
  const myTripComments = useSelector(state => state.tripComments);
  const scrollViewRef = React.useRef(null);
  const [tripComments, setTripComments] = useState({
    tripId: null,
    comments: [],
  });

  useEffect(() => {
    setTripComments({
      tripId: myTripComments.tripId,
      comments: myTripComments.comments,
    });
  }, [myTripComments]);

  const [myComment, setMyComment] = useState('');

  function handleAddComment() {
    if (myComment.trim() == '') {
      console.log('no comment added');
    } else {
      AddComment();
    }
  }

  function AddComment() {
    const AddCommentURL = ENDPOINT.ADD_COMMENT;

    const formData = new FormData();
    formData.append('trip_id', tripComments.tripId);
    formData.append('user_id', myUserDetails?.user?._id);
    formData.append('description', myComment);

    axios
      .post(AddCommentURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        const commentData = res?.data?.data?.comment;
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd();
        }, 10);
        pushComment(commentData);
      })
      .catch(err => {
        console.log('failed to add comment', err.response.data, formData);
      })
      .finally(() => {
        setMyComment('');
      });
  }

  function pushComment(commentData) {
    setTripComments(prevValue => ({
      tripId: prevValue.tripId,
      comments: [
        ...prevValue.comments,
        {
          __v: 0,
          _id: commentData?._id,
          description: commentData?.description,
          like_count: 0,
          trip_id: tripComments.tripId,
          user_id: {
            _id: myUserDetails?.user?._id,
            email: myUserDetails?.user?.email,
            first_name: myUserDetails?.user?.first_name,
            id: myUserDetails?.user?._id,
            last_name: myUserDetails?.user?.last_name,
            middle_name: '',
            profile_image: myUserDetails?.user?.profile_image,
            username: myUserDetails?.user?.username,
          },
        },
      ],
    }));
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.tripCommentsBox}>
        <View style={styles.tripCommentsInnerBox}>
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={onClose}>
              <Image source={close} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          </View>

          <Text style={styles.commentCount}>
            {tripComments?.comments
              ? `${tripComments?.comments?.length} Comment${
                  tripComments?.comments?.length > 1 ? 's' : ''
                }`
              : `No Comments`}
          </Text>

          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'always'}>
            {tripComments?.comments?.map((comment, i) => {
              return (
                <CommentBox
                  key={i}
                  comment={comment}
                  // GetTripComments={GetTripComments}
                  tripId={tripComments?.tripId}
                />
              );
            })}

            <Text style={styles.theEnd}>- THE END -</Text>
          </ScrollView>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TextInput
              placeholderTextColor="#f2f2f2"
              placeholder="Comment"
              style={styles.commentInput}
              value={myComment}
              onChangeText={text => setMyComment(text)}
            />
            <TouchableOpacity
              style={styles.sendMessageBtn}
              onPress={() => handleAddComment()}>
              <Image source={sendBtn} style={{width: 18, height: 18}} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  tripCommentsBox: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  tripCommentsInnerBox: {
    width: '100%',
    height: '90%',
    borderRadius: 12,
    backgroundColor: COLORS.GREY_DARK,
    padding: 12,
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.LIGHT,
  },
  commentCount: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 10,
    color: COLORS.SWEDEN,
  },

  commentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  name: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.SWEDEN,
    lineHeight: 20,
  },
  comment: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 10,
    color: '#F2F2F2',
    lineHeight: 20,
  },
  likeCount: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 10,
    color: '#BDBDBD',
    marginTop: 2,
  },
  theEnd: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 8,
    color: COLORS.SWEDEN,
    alignSelf: 'center',
    margin: 20,
  },
  sendMessageBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    borderRadius: 800,
    backgroundColor: '#7879F1',
  },
  commentInput: {
    maxHeight: 118,
    backgroundColor: COLORS.SWEDEN,
    borderRadius: 24,
    fontSize: 14,
    fontFamily: FONTS.MAIN_REG,
    width: '86%',
    height: 48,
    color: 'white',
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export default CommentBottomSheet;
