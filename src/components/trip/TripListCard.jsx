import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';

import {FONTS, COLORS} from '../../constants/theme/theme';
import FastImage from 'react-native-fast-image';

var cover = require('../../../assets/Images/cover.png');
var location = require('../../../assets/Images/location.png');
var noDP = require('../../../assets/Images/noDP.png');

const TripListCard = ({Trip, onPress}) => {
  const coverImage = Trip?.trip_image;

  const tripName =
    Trip?.trip_name.length > 12
      ? `${Trip?.trip_name.slice(0, 12)} ...`
      : Trip?.trip_name;

  const tripDestination =
    Trip?.destination[0]?.length > 22
      ? `${Trip?.destination[0].slice(0, 22)} ...`
      : Trip?.destination[0];

  let TripMembers = [];

  TripMembers.push(...Trip?.members);
  TripMembers.push(Trip?.owner);

  const timeLeft = Trip?.trip_starting_time
    ? Math.ceil(
        (new Date(Trip?.trip_starting_time) - new Date()) /
          (1000 * 60 * 60 * 24),
      ) <= 0
      ? 'On Going Trip'
      : `in ${Math.ceil(
          (new Date(Trip?.trip_starting_time) - new Date()) /
            (1000 * 60 * 60 * 24),
        )} days`
    : 'Unknown';

  const formatTripName = name => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <TouchableOpacity style={styles.tripCard} onPress={onPress}>
      <FastImage
        source={coverImage ? {uri: coverImage} : cover}
        style={styles.imageContainer}
      />
      <View style={styles.tripDetailsContainer}>
        <View style={styles.bgTitleRound}>
          <Text style={styles.timeLeft}>{timeLeft}</Text>
        </View>
        <Text style={styles.tripName}>{formatTripName(tripName)}</Text>

        <View style={styles.dpContainer}>
          {TripMembers?.map((member, i) => (
            <FastImage
              key={i}
              source={
                member?.profile_image ? {uri: member?.profile_image} : noDP
              }
              style={styles.membersDp}
            />
          ))}
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
          <Image source={location} style={{width: 12, height: 12}} />
          <Text style={styles.location}>{tripDestination}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tripCard: {
    backgroundColor: COLORS.GREY_LIGHT,
    height: 120,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 120,
    width: '46%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  bgTitleRound: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  timeLeft: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 10,
    color: '#f2f2f2',
  },
  tripDetailsContainer: {
    width: '54%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 14,
    paddingRight: 14,
    justifyContent: 'space-between',
  },
  tripName: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 16,
    lineHeight: 20,
    color: '#F2F2F2',
  },
  membersDp: {
    width: 14,
    height: 14,
    borderRadius: 1000,
    marginLeft: -3,
  },
  dpContainer: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    marginLeft: 3,
  },
  location: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 10,
    color: 'white',
  },
});

export default TripListCard;
