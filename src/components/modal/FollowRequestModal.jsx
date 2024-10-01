import React from 'react';
import {Modal, SafeAreaView, StyleSheet, View, Text} from 'react-native';
import ActionButton from '../buttons/ActionButton';
import {COLORS, FONTS} from '../../constants/theme/theme';
import RequestedButton from '../buttons/RequestedButton';
import LearnMoreButton from '../buttons/LearnMoreButton';
import BlockButton from '../buttons/BlockButton';

const FollowRequestModal = ({
  visible,
  onClose,
  requestData,
  requestActionFN,
  unFollow,
}) => {
  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {requestData?.action ? (
          <View style={styles.body}>
            <Text style={styles.title}>
              {`${requestData?.userData.first_name} requested to follow you`}
            </Text>

            <View style={{gap: 16}}>
              {requestData?.action == 'accepted' ? (
                <LearnMoreButton
                  title={'Accept Request'}
                  onPress={() =>
                    requestActionFN(requestData?.userData, requestData?.action)
                  }
                />
              ) : (
                <BlockButton
                  title={'Delete Request'}
                  onPress={() =>
                    requestActionFN(requestData?.userData, requestData?.action)
                  }
                />
              )}
              <ActionButton onPress={onClose} title={'Cancel'} />
            </View>
          </View>
        ) : (
          <View style={styles.body}>
            <View style={{gap: 4}}>
              <Text style={styles.title}>{`Withdraw request?`}</Text>
              <Text style={styles.title2}>
                {`Withdraw follow request sent to ${requestData?.userData.first_name}?`}
              </Text>
            </View>

            <View style={{gap: 16}}>
              <BlockButton
                title={'Withdraw Request'}
                onPress={() => unFollow(requestData?.userData)}
              />
              <ActionButton onPress={onClose} title={'Cancel'} />
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    backgroundColor: COLORS.GREY_LIGHT,
    gap: 16,
  },
  title: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 18,
    color: COLORS.LIGHT,
  },
  title2: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
});

export default FollowRequestModal;
