import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import TripCardOptions from './TripCardOptions';
import {COLORS, FONTS} from '../../../constants/theme/theme';

var noDP = require('../../../../assets/Images/noDP.png');

const TripCard = ({tripInfo, eventData}) => {
  let TimeTitle = (
    <Text style={styles.timeTitle}>
      {`${new Date(eventData.start_time).toLocaleTimeString([], {
        hourCycle: 'h12',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })} - ${new Date(eventData.end_time).toLocaleTimeString([], {
        hourCycle: 'h12',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}, `}
      <Text style={{fontFamily: FONTS.MAIN_BOLD}}>
        {new Date(eventData?.event_date)?.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
      </Text>
    </Text>
  );

  return (
    <View style={styles.eventCardBody}>
      <View style={styles.eventTimeOpBox}>
        <View style={styles.timeBox}>
          <View style={styles.timeDot} />
          {TimeTitle}
        </View>
        <TripCardOptions />
      </View>
      <Text style={styles.eventTitle}>{eventData.event_name}</Text>

      <View style={styles.eventTimeOpBox}>
        <Text style={styles.eventLocation}>📍 {eventData?.event_location}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {eventData.members.slice(0, 5).map((data, i) => (
            <Image
              key={i}
              source={data.profile_image ? {uri: data.profile_image} : noDP}
              style={styles.imgStyle}
            />
          ))}

          {eventData.members.length > 5 && (
            <View style={styles.eventMembersBox}>
              <Text style={styles.extraText}>
                +{eventData.members.length - 5}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventCardBody: {
    width: '100%',
    height: 105,
    backgroundColor: COLORS.GREY_LIGHT,
    borderRadius: 10,
    padding: 6,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  eventTimeOpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeDot: {
    borderRadius: 100,
    borderWidth: 3,
    width: 10,
    height: 10,
    borderColor: '#27AE60',
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeTitle: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
    color: COLORS.LIGHT,
  },
  eventTitle: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 16,
    color: 'white',
  },
  eventLocation: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: 'white',
  },
  imgStyle: {
    width: 20,
    height: 20,
    borderRadius: 100,
    marginLeft: -5,
  },
  extraText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 10,
    color: '#f2f2f2',
  },
});

export default TripCard;
