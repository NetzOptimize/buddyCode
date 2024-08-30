import React, {useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import RegularBG from '../../../../components/background/RegularBG';
import BackButton from '../../../../components/buttons/BackButton';
import {AuthContext} from '../../../../context/AuthContext';
import FastImage from 'react-native-fast-image';
import {COLORS, FONTS} from '../../../../constants/theme/theme';

var noDP = require('../../../../../assets/Images/noDP.png');

const FriendReq = ({navigation}) => {
  const {myUserDetails} = useContext(AuthContext);

  const FriendReq = myUserDetails?.user?.following;
  function FullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
  }

  return (
    <RegularBG>
      <View style={{marginTop: 14}}>
        <BackButton
          onPress={() => navigation.goBack()}
          title={'Friends requests'}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{gap: 20, marginTop: 24}}>
          {FriendReq?.map(data => (
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

              <TouchableOpacity style={styles.Btn} onPress={() => {}}>
                <Text style={styles.Btntext}>Accept request</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{height: 110}} />
      </ScrollView>
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
    fontSize: 10,
  },
  Btn: {
    padding: 10,
    backgroundColor: COLORS.THANOS,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

export default FriendReq;
