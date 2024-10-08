import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RegularBG from '../../../../../../components/background/RegularBG';
import BackButton from '../../../../../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../../../../../constants/theme/theme';
import FastImage from 'react-native-fast-image';
import UnBlockUserModal from '../../../../../../components/modal/UnBlockUserModal';

var noDP = require('../../../../../../../assets/Images/noDP.png');

// **redux
import {useDispatch, useSelector} from 'react-redux';
import {fetchBlockedUsers} from '../../../../../../redux/slices/blockedUsersSlice';

const BlockedList = ({navigation}) => {
  const dispatch = useDispatch();
  const {blockedUsers} = useSelector(state => state.blockedUsers);

  const [unblockUserDetails, setUnblockUserDetails] = useState(null);
  const [showUnblock, setShowUnblock] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchBlockedUsers());
    }, []),
  );

  function FullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
  }

  return (
    <RegularBG>
      <View style={{marginTop: 14}}>
        <BackButton
          onPress={() => navigation.goBack()}
          title={'Blocked Users'}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{gap: 20, marginTop: 24}}>
          {blockedUsers?.map(data => (
            <View key={data.id} style={styles.blockedListItemContainer}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <FastImage
                  source={
                    data?.profile_image ? {uri: data?.profile_image} : noDP
                  }
                  style={{borderRadius: 1000, width: 44, height: 44}}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <Text style={styles.name}>
                  {FullName(data?.first_name, data?.last_name)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.Btn}
                onPress={() => {
                  setShowUnblock(true);
                  setUnblockUserDetails(data);
                }}>
                <Text style={styles.Btntext}>Unblock</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{height: 110}} />
      </ScrollView>

      <UnBlockUserModal
        visible={showUnblock}
        onClose={() => setShowUnblock(false)}
        blockedUserData={unblockUserDetails}
      />
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  name: {
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
    fontSize: 12,
  },
  blockedListItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  Btntext: {
    fontFamily: FONTS.MAIN_SEMI,
    color: COLORS.LIGHT,
    fontSize: 12,
  },
  Btn: {
    padding: 16,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: COLORS.THANOS,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

export default BlockedList;
