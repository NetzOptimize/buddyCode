import React from 'react';
import {ImageBackground, StyleSheet, View, Text, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

var cover = require('../../../assets/Images/cover.png');
var location = require('../../../assets/Images/location.png');
var noDP = require('../../../assets/Images/noDP.png');

import {FONTS, COLORS} from '../../constants/theme/theme';
import FastImage from 'react-native-fast-image';

const TripListHeader = ({Trip}) => {
  const coverImage = Trip?.trip_image;

  const tripName =
    Trip?.trip_name?.length > 25
      ? `${Trip?.trip_name?.slice(0, 25)} ...`
      : Trip?.trip_name;

  const tripStartingTime = new Date(Trip?.trip_starting_time);
  const daysUntilTrip = Math.ceil(
    (tripStartingTime - new Date()) / (1000 * 60 * 60 * 24),
  );

  let TripMembers = [];

  TripMembers.push(...Trip?.members);
  TripMembers.push(Trip?.owner);

  return (
    <ImageBackground
      source={coverImage ? {uri: coverImage} : cover}
      style={styles.headerImageBG}>
      <View style={styles.headerOverLay} />

      <View style={styles.firstTripDataContainer}>
        <View style={styles.bgTitleRound}>
          <Text style={styles.headerTimeLeft}>
            {daysUntilTrip <= 0 ? 'On Going Trip' : `in ${daysUntilTrip} days`}
          </Text>
        </View>

        <Text style={styles.headerTitle}>{tripName}</Text>

        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
          <Image source={location} style={{width: 12, height: 12}} />
          <Text style={styles.location}>{Trip?.destination[0]}</Text>
        </View>

        <View style={styles.dpContainer}>
          {TripMembers?.map((member, i) => {
            if (member.status == 'inactive' || member.is_delted) {
              return (
                <FastImage key={i} source={noDP} style={styles.membersDp} />
              );
            }

            return (
              <FastImage
                key={i}
                source={
                  member?.profile_image ? {uri: member?.profile_image} : noDP
                }
                style={styles.membersDp}
              />
            );
          })}
        </View>
      </View>

      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={[
          'rgba(58, 58, 58, 0.0)',
          'rgba(58, 58, 58, 0.5)',
          'rgb(58, 58, 58)',
          'rgb(58, 58, 58)',
        ]}
        style={styles.gradientStyle}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  gradientStyle: {
    width: '100%',
    height: 80,
    position: 'absolute',
    bottom: 0,
  },
  headerImageBG: {
    height: 300,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  headerOverLay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignSelf: 'center',
  },
  bgTitleRound: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 100,
  },
  headerTimeLeft: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
    color: '#f2f2f2',
  },
  firstTripDataContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 26,
    color: 'white',
    marginTop: 8,
  },
  location: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 10,
    color: 'white',
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
});

export default TripListHeader;
