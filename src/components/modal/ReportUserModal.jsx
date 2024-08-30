import React, {useContext, useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Image,
  Linking,
} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';
import LearnMoreButton from '../buttons/LearnMoreButton';
import {AuthContext} from '../../context/AuthContext';

const close = require('../../../assets/Images/close.png');
const arrowGrey = require('../../../assets/Images/arrowGrey.png');
const checkGreen = require('../../../assets/Images/checkGreen.png');

const ReportUserModal = ({visible, onClose}) => {
  const {setShowBlockReportPopUp} = useContext(AuthContext);

  const [reason, setReason] = useState(null);
  const [isReported, setIsReported] = useState(false);

  const handleClose = () => {
    setReason(null);
    setIsReported(false);
    onClose();
  };

  const handleGoBack = () => {
    setReason(null);
    setIsReported(false);
  };

  const issues = [
    {
      id: 1,
      text: 'They are pretending to be someone else.',
      action: () => setReason(1),
    },
    {
      id: 2,
      text: 'It may be under the age of 18.',
      action: () => setReason(2),
    },
    {
      id: 3,
      text: 'Something else.',
      action: () => setReason(3),
    },
  ];

  const reason1 = [
    {
      id: 1,
      text: 'Me',
      action: () => setIsReported(true),
    },
    {
      id: 2,
      text: 'Someone else',
      action: () => setIsReported(true),
    },
  ];

  const reason3 = [
    {
      id: 1,
      text: 'It’s spam',
      action: () => setIsReported(true),
    },
    {
      id: 2,
      text: 'I just don’t like it',
      action: () => setIsReported(true),
    },
    {
      id: 3,
      text: 'Sale of illegal or regulated goods',
      action: () => setIsReported(true),
    },
    {
      id: 4,
      text: 'Nudity or sexual activity',
      action: () => setIsReported(true),
    },
  ];

  const otherActions = [
    {
      id: 1,
      text: 'Block Maria',
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
          {issues.map(issue => (
            <TouchableOpacity
              key={issue.id}
              style={styles.issueContainer}
              onPress={issue.action}>
              <Text style={styles.issueText}>{issue.text}</Text>
              <Image source={arrowGrey} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  } else if (reason == 1) {
    BodyContent = (
      <>
        <View style={styles.hr} />
        <Text style={styles.reasonTitle}>Who are they pretending to be?</Text>
        <View style={styles.issuesContainer}>
          {reason1.map(issue => (
            <TouchableOpacity
              key={issue.id}
              style={styles.issueContainer}
              onPress={issue.action}>
              <Text style={styles.issueText}>{issue.text}</Text>
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

          <LearnMoreButton title={'Learn More'} />
        </View>
      </>
    );
  } else if (reason == 3) {
    BodyContent = (
      <>
        <View style={styles.hr} />
        <Text style={styles.reasonTitle}>
          Why are you reporting this account?
        </Text>
        <View style={styles.issuesContainer}>
          {reason3.map(issue => (
            <TouchableOpacity
              key={issue.id}
              style={styles.issueContainer}
              onPress={issue.action}>
              <Text style={styles.issueText}>{issue.text}</Text>
              <Image source={arrowGrey} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
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
