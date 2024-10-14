import React, {useContext, useEffect, useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';
import LearnMoreButton from '../buttons/LearnMoreButton';
import {AuthContext} from '../../context/AuthContext';
import {ENDPOINT} from '../../constants/endpoints/endpoints';
import axios from 'axios';
import ActionButton from '../buttons/ActionButton';

const close = require('../../../assets/Images/close.png');
const arrowGrey = require('../../../assets/Images/arrowGrey.png');
const checkGreen = require('../../../assets/Images/checkGreen.png');

const ReportUserModal = ({visible, onClose, reportThisUser}) => {
  const {setShowBlockReportPopUp, authToken, myUserDetails} =
    useContext(AuthContext);

  const [reason, setReason] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [reportingLoading, setReportingLoading] = useState({
    loading: false,
    reason: null,
  });

  const [fetchedReasons, setFetchedReasons] = useState(null);
  const [selectReason, setSelectReason] = useState(null);

  const handleClose = () => {
    setReason(null);
    setIsReported(false);
    onClose();
  };

  const handleGoBack = () => {
    setReason(false);
    setIsReported(false);
    setSelectReason(null);
  };

  const issues = [
    {
      id: 2,
      text: 'It may be under the age of 18.',
      action: () => setReason(2),
    },
  ];

  const otherActions = [
    {
      id: 1,
      text: `Block ${reportThisUser?.user?.first_name} ${reportThisUser?.user?.last_name}`,
      action: () => {
        handleClose();
        setShowBlockReportPopUp({
          type: 'block',
          state: true,
        });
      },
    },
    {
      id: 2,
      text: 'Learn more about BuddyPass’s community Guidelines',
      action: () => {
        Linking.openURL('https://google.com');
        handleClose();
      },
    },
  ];

  let BodyContent;

  useEffect(() => {
    function GetReasons() {
      axios
        .get(ENDPOINT.REPORT_REASONS, {
          headers: {
            Authorization: 'Bearer ' + authToken,
          },
        })
        .then(res => {
          setFetchedReasons(res.data.data.reasons);
        })
        .catch(err => {
          console.log('failed to get reasons');
        });
    }

    GetReasons();
  }, []);

  function ReportFunction(reason) {
    setReportingLoading({
      loading: true,
      reason: reason,
    });

    setIsReported(true);

    const url = ENDPOINT.REPORT_USER;

    const data = {
      user_id: myUserDetails?.user?._id,
      reported_user_id: reportThisUser.user._id,
      reporting_reason_id: selectReason?._id,
      selected_option: reason,
    };

    axios
      .post(url, data, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        console.log('reported this user', res.data);
        setReportingLoading({
          loading: false,
          reason: '',
        });
      })
      .catch(err => {
        console.log('failed to report user', err, data, url);
      });
  }

  if (!reason && !isReported) {
    BodyContent = (
      <>
        <Text style={styles.text2}>
          Your report is anonymous, except if you’re reporting an intellectual
          property infringement. If someone is in danger, call the local
          emergency services - don’t wait.
        </Text>
        <View style={styles.hr} />
        <View style={styles.issuesContainer}>
          {fetchedReasons?.map((issue, i) => (
            <TouchableOpacity
              key={i}
              style={styles.issueContainer}
              onPress={() => {
                setSelectReason(issue.sub_reasons[0]);
                setReason(true);
              }}>
              <Text style={styles.issueText}>{issue?.reason_title}</Text>
              <Image source={arrowGrey} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}

          {issues?.map(issue => (
            <TouchableOpacity
              key={issue.id}
              style={styles.issueContainer}
              onPress={issue.action}>
              <Text style={styles.issueText}>{issue?.text}</Text>
              <Image source={arrowGrey} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  } else if (selectReason) {
    BodyContent = (
      <>
        <View style={styles.hr} />
        <Text style={styles.reasonTitle}>{selectReason?.reason_title}</Text>
        <View style={styles.issuesContainer}>
          {selectReason?.reason_options?.map((reason, i) => (
            <TouchableOpacity
              key={i}
              style={styles.issueContainer}
              onPress={() => ReportFunction(reason)}>
              <Text style={styles.issueText}>
                {reportingLoading.reason == reason ? (
                  <ActivityIndicator color={COLORS.THANOS} />
                ) : (
                  reason
                )}
              </Text>
              <Image source={arrowGrey} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  } else if (reason == 2) {
    BodyContent = (
      <>
        <View style={styles.hr} />
        <Text style={styles.reasonTitle}>
          About reporting a child under the age of 18
        </Text>
        <View style={styles.issuesContainer}>
          <Text style={styles.issueText}>
            BuddyPass requires everyone to be at least 18 years old before they
            can create an account. If you’d like to report an account belonging
            to someone under 18, visit our Help Center.
          </Text>

          <LearnMoreButton
            title={'Learn More'}
            onPress={() =>
              Linking.openURL('https://buddypasstrips.com/about-us/')
            }
          />
        </View>
      </>
    );
  }

  if (isReported) {
    BodyContent = (
      <>
        <View style={styles.hr} />
        <Text style={styles.reasonTitle}>Other steps you can take</Text>
        <View style={styles.issuesContainer}>
          {otherActions.map(issue => (
            <TouchableOpacity
              key={issue.id}
              style={styles.issueContainer}
              onPress={issue.action}>
              <Text
                style={
                  issue.id == 1 ? styles.issueTextBlock : styles.issueText
                }>
                {issue.text}
              </Text>
              <Image source={arrowGrey} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.body}>
          <View style={styles.titleContainer}>
            {reason ? (
              <TouchableOpacity
                style={styles.rowContainer}
                onPress={isReported ? handleClose : handleGoBack}>
                <Image
                  source={!isReported ? arrowGrey : checkGreen}
                  style={
                    !isReported ? styles.rotatedImage : {width: 20, height: 20}
                  }
                />
                <Text style={styles.text1}>
                  {!isReported ? 'Report' : 'Thank you for letting us know.'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.text1}>
                {'What do you want to report about this account?'}
              </Text>
            )}
            <TouchableOpacity onPress={handleClose}>
              <Image source={close} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          {BodyContent}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  body: {
    backgroundColor: COLORS.GREY_LIGHT,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text1: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  text2: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.VISION,
    marginTop: 10,
  },
  hr: {
    height: 1,
    backgroundColor: '#969696',
    width: '120%',
    alignSelf: 'center',
    margin: 16,
    borderRadius: 1000,
  },
  issueText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.VISION,
  },
  issueTextBlock: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.ERROR,
  },
  issueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  issuesContainer: {
    gap: 16,
  },
  rotatedImage: {
    width: 28,
    height: 28,
    transform: [{rotate: '180deg'}],
    marginLeft: -10,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  reasonTitle: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    marginBottom: 10,
    color: COLORS.LIGHT,
  },
});

export default ReportUserModal;
