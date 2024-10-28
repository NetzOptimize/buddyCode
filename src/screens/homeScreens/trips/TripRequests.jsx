import React, {useCallback, useContext, useState} from 'react';

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
import {useFocusEffect} from '@react-navigation/native';

var placeholderImg = require('../../../../assets/Images/placeholderIMG.png');
var noDP = require('../../../../assets/Images/noDP.png');

import {CommonActions} from '@react-navigation/native';
import {SCREENS} from '../../../constants/screens/screen';

const InviteCards = ({data, onRejectInvite, onAcceptInvite}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 9,
          width: '40%',
        }}>
        <FastImage
          source={
            data.trip_id.trip_image
              ? {uri: data.trip_id.trip_image}
              : placeholderImg
          }
          style={{width: 50, height: 50, borderRadius: 1000}}
        />
        <Text style={styles.reqtext}>
          <Text
            style={{
              fontFamily: FONTS.MAIN_BOLD,
            }}>
            {data.trip_owner.first_name} {data.trip_owner.last_name}
          </Text>{' '}
          Invites you to their trip{' '}
          <Text
            style={{
              fontFamily: FONTS.MAIN_BOLD,
            }}>
            {data.trip_id.trip_name}.
          </Text>
        </Text>
      </View>

      <View style={{flexDirection: 'row', gap: 3}}>
        <TouchableOpacity style={styles.acceptBtn} onPress={onAcceptInvite}>
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectBtn} onPress={onRejectInvite}>
          <Text style={styles.rejectText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SentCards = ({data}) => {
  if (data.status == 'approved') {
    return (
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 9,
        }}>
        <FastImage
          source={
            data.user_id.profile_image
              ? {uri: data.user_id.profile_image}
              : noDP
          }
          style={{width: 50, height: 50, borderRadius: 1000}}
        />
        <Text style={[styles.reqtext, {width: '80%'}]}>
          <Text
            style={{
              fontFamily: FONTS.MAIN_BOLD,
            }}>
            {data.user_id.first_name} {data.user_id.last_name}
          </Text>{' '}
          accepted your{' '}
          <Text
            style={{
              fontFamily: FONTS.MAIN_BOLD,
            }}>
            {data.trip_id.trip_name}
          </Text>{' '}
          trip invite
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 9,
      }}>
      <FastImage
        source={
          data.user_id.profile_image ? {uri: data.user_id.profile_image} : noDP
        }
        style={{width: 50, height: 50, borderRadius: 1000}}
      />
      <Text style={[styles.reqtext, {width: '80%'}]}>
        Your{' '}
        <Text
          style={{
            fontFamily: FONTS.MAIN_BOLD,
          }}>
          {data.trip_id.trip_name}
        </Text>{' '}
        trip invite to{' '}
        <Text
          style={{
            fontFamily: FONTS.MAIN_BOLD,
          }}>
          {data.user_id.first_name} {data.user_id.last_name}
        </Text>{' '}
        is sent!
      </Text>
    </View>
  );
};

const TripRequests = ({navigation}) => {
  const {
    tripInvites,
    sentInvites,
    authToken,
    myUserDetails,
    GetTripInvites,
    GetSentTripInvites,
  } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await GetTripInvites(myUserDetails?.user?._id);
        await GetSentTripInvites(myUserDetails?.user?._id);
      };

      fetchData();

      return () => {};
    }, []),
  );

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
        console.log('request action error:', err?.response?.data || err);
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
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: SCREENS.TRIPS_LIST}],
              }),
            );
          }}
        />
      </View>

      {(sentInvites?.length == 0 && tripInvites?.length == 0) ||
      (!sentInvites && !tripInvites) ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 70,
          }}>
          <Text style={styles.noTripsText}>No Trip Requests yet</Text>
        </View>
      ) : (
        <ScrollView
          style={{marginTop: 16}}
          showsVerticalScrollIndicator={false}>
          <View style={{gap: 16}}>
            {tripInvites?.map(data => {
              if (data.status == 'approved' || data.status == 'declined') {
                return null;
              } else if (
                data.trip_owner.status == 'inactive' ||
                data.trip_owner.is_deleted
              ) {
                return null;
              }
              return (
                <InviteCards
                  key={data._id}
                  data={data}
                  onRejectInvite={() => RequestAction('declined', data._id)}
                  onAcceptInvite={() => RequestAction('approved', data._id)}
                />
              );
            })}

            {sentInvites?.map(data => {
              if (
                data.trip_owner.status == 'inactive' ||
                data.trip_owner.is_deleted
              ) {
                return null;
              }
              return <SentCards key={data._id} data={data} />;
            })}
          </View>

          <View style={{height: 110}} />
        </ScrollView>
      )}
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
    fontSize: 12,
  },
  rejectBtn: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: COLORS.LIGHT,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectText: {
    color: COLORS.GREY_DARK,
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 10,
  },
  acceptText: {
    color: COLORS.LIGHT,
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 10,
  },
  acceptBtn: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: COLORS.THANOS,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTripsText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 20,
    color: COLORS.VISION,
  },
});

export default TripRequests;
