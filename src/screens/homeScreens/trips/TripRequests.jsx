import React, {useContext, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import axios from 'axios';
import Toast from 'react-native-toast-message';
import RegularBG from '../../../components/background/RegularBG';
import BackButton from '../../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../../constants/theme/theme';
import {AuthContext} from '../../../context/AuthContext';
import FastImage from 'react-native-fast-image';
import Spinner from 'react-native-loading-spinner-overlay';
import {ENDPOINT} from '../../../constants/endpoints/endpoints';

var placeholderImg = require('../../../../assets/Images/placeholderIMG.png');

const InviteCards = ({data, onRejectInvite, onAcceptInvite}) => {
  return (
    <View>
      <View style={{alignItems: 'center'}}>
        <FastImage
          source={
            data.trip_id.trip_image
              ? {uri: data.trip_id.trip_image}
              : placeholderImg
          }
          style={{width: 100, height: 100, borderRadius: 1000}}
        />
        <Text style={styles.reqtext}>
          {data.trip_owner.first_name} {data.trip_owner.last_name} Invited you
          to Join{' '}
          <Text
            style={{
              fontFamily: FONTS.MAIN_BOLD,
            }}>
            {data.trip_id.trip_name}.
          </Text>
        </Text>

        <View style={{flexDirection: 'row', marginTop: 6}}>
          <TouchableOpacity style={styles.rejectBtn} onPress={onRejectInvite}>
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn} onPress={onAcceptInvite}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const TripRequests = ({navigation}) => {
  const {tripInvites, authToken, myUserDetails, GetTripInvites} =
    useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const RequestAction = (action, reqID) => {
    const RequestActionURL = `${ENDPOINT.TRIP_INVITE_ACTION}/${reqID}`;
    let formData = new FormData();
    formData.append('status', action);
    setIsLoading(true);
    axios({
      method: 'PUT',
      url: RequestActionURL,
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + authToken,
      },
      timeout: 1000,
    })
      .then(res => {
        GetTripInvites(myUserDetails?.user?._id);

        Toast.show({
          type: action == 'approved' ? 'success' : 'error',
          text1:
            action == 'approved'
              ? 'Invitation accepted'
              : 'Invitation declined',
          text2:
            action == 'approved'
              ? `You accepted this trip invitation.`
              : 'You declined this trip invitation',
        });
      })
      .catch(err => {
        console.log('request action error:', err.response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <RegularBG>
      <Spinner visible={isLoading} color={COLORS.THANOS} />

      <View style={{marginTop: 16}}>
        <BackButton
          title={'Trip Requests'}
          onPress={() => navigation.goBack()}
        />
      </View>

      <ScrollView style={{marginTop: 16}} showsVerticalScrollIndicator={false}>
        <View>
          {tripInvites?.map(data => (
            <InviteCards
              key={data._id}
              data={data}
              onRejectInvite={() => RequestAction('declined', data._id)}
              onAcceptInvite={() => RequestAction('approved', data._id)}
            />
          ))}
        </View>
      </ScrollView>
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A3A3A',
  },
  reqtext: {
    fontFamily: 'Montserrat-Regular',
    color: '#F2F2F2',
    fontSize: 16,
    marginTop: 12,
  },
  rejectBtn: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: COLORS.ERROR,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
  },
  rejectText: {
    color: COLORS.LIGHT,
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
  },
  acceptText: {
    color: '#4F4F4F',
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
  },
  acceptBtn: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: COLORS.LIGHT,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
  },
});

export default TripRequests;
