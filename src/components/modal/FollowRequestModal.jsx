import React from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';

function ActionButton({title, onPress}) {
  return (
    <TouchableOpacity style={styles.acceptBtn} onPress={onPress}>
      <Text style={styles.btnText1}>{title}</Text>
    </TouchableOpacity>
  );
}

function RemoveButton({title, onPress}) {
  return (
    <TouchableOpacity style={styles.removeBtn} onPress={onPress}>
      <Text style={styles.btnText1}>{title}</Text>
    </TouchableOpacity>
  );
}

function CancelButton({title, onPress}) {
  return (
    <TouchableOpacity style={styles.cancelBtn} onPress={onPress}>
      <Text style={styles.btnText2}>{title}</Text>
    </TouchableOpacity>
  );
}

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
                <ActionButton
                  title={'Accept Request'}
                  onPress={() =>
                    requestActionFN(requestData?.userData, requestData?.action)
                  }
                />
              ) : (
                <RemoveButton
                  title={'Delete Request'}
                  onPress={() =>
                    requestActionFN(requestData?.userData, requestData?.action)
                  }
                />
              )}
              <CancelButton onPress={onClose} title={'Cancel'} />
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
              <RemoveButton
                title={'Withdraw Request'}
                onPress={() => unFollow(requestData?.userData)}
              />
              <CancelButton onPress={onClose} title={'Cancel'} />
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
    height: 200,
    justifyContent: 'space-evenly',
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
  acceptBtn: {
    height: 44,
    width: '100%',
    backgroundColor: COLORS.THANOS,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
  },
  removeBtn: {
    height: 44,
    width: '100%',
    backgroundColor: COLORS.ERROR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
  },
  cancelBtn: {
    height: 44,
    width: '100%',
    backgroundColor: COLORS.LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
  },
  btnText1: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  btnText2: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.GREY_LIGHT,
  },
});

export default FollowRequestModal;
