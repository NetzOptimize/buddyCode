import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {COLORS, FONTS} from '../../../constants/theme/theme';

var location = require('../../../../assets/Images/location.png');
var cam = require('../../../../assets/Images/cam.png');
var deleteIcon = require('../../../../assets/Images/delete.png');

const TripCoverImage = ({tripData, source, setSource}) => {
  const tripStartingTime = new Date(tripData?.trip_starting_time);
  const daysUntilTrip = Math.ceil(
    (tripStartingTime - new Date()) / (1000 * 60 * 60 * 24),
  );

  const StartDate = new Date(tripData?.trip_starting_time);
  const formattedStartDate = StartDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const endDate = new Date(tripData?.trip_ending_time);
  const formattedEndDate = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (!source) {
    return (
      <View>
        <Text style={styles.coverTitle}>
          {formattedStartDate} - {formattedEndDate}
        </Text>
        <View style={styles.noCover}>
          <Text style={styles.text1}>No Cover Image</Text>

          <View style={styles.daysLocationBox}>
            <View style={styles.bgDaysUntil}>
              <Text style={styles.daysUntilText}>in {daysUntilTrip} days</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Image source={location} style={{width: 12, height: 12}} />
              <Text style={styles.locationText}>
                {tripData?.destination[0]}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <TouchableOpacity style={styles.actionBtn}>
              <Image source={cam} style={{width: 20, height: 20}} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Image source={deleteIcon} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.coverTitle}>
        {formattedStartDate} - {formattedEndDate}
      </Text>

      <ImageBackground
        source={{uri: source}}
        style={styles.Cover}
        resizeMode="cover">
        <View style={styles.coverBox}>
          <View style={styles.overLay} />
          <View style={styles.daysLocationBox}>
            <View style={styles.bgDaysUntil}>
              <Text style={styles.daysUntilText}>in {daysUntilTrip} days</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Image source={location} style={{width: 12, height: 12}} />
              <Text style={styles.locationText}>
                {tripData?.destination[0]}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <TouchableOpacity style={styles.actionBtn}>
              <Image source={cam} style={{width: 20, height: 20}} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Image source={deleteIcon} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  noCover: {
    width: '100%',
    height: 200,
    position: 'relative',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.LIGHT,
    marginTop: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 12,
  },
  Cover: {
    width: '100%',
    height: 200,
    position: 'relative',
    borderRadius: 10,
    marginTop: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  coverTitle: {
    color: '#f2f2f2',
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
  },
  coverBox: {
    width: '100%',
    height: 200,
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 12,
  },
  daysUntilText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 10,
    color: COLORS.LIGHT,
  },
  bgDaysUntil: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 100,
  },
  locationText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.LIGHT,
  },
  daysLocationBox: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 1000,
    backgroundColor: 'rgba(242, 242, 242, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    fontFamily: FONTS.MAIN_SEMI,
    color: COLORS.LIGHT,
    fontSize: 12,
    position: 'absolute',
    alignSelf: 'center',
    top: '49%',
  },
  overLay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '150%',
    height: 200,
    left: 0,
  },
});

export default TripCoverImage;
