/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';

var close = require('../../../assets/Images/close.png');

import {Calendar} from 'react-native-calendars';
import CalendarHeader from './CalendarHeader';
import ActionButton from '../buttons/ActionButton';

var arrowLeft = require('../../../assets/Images/arrowLeft.png');
var arrowRight = require('../../../assets/Images/arrowRight2.png');

function DateSelection2({tripStartDate, tripEndDate, onPickEndDate}) {
  const renderCustomArrow = direction => {
    const arrowStyle = {
      padding: 10,
      paddingLeft: 12,
      paddingRight: 12,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#F2F2F2',
      justifyContent: 'center',
      alignItems: 'center',
    };

    const arrowIcon = direction === 'left' ? arrowLeft : arrowRight;

    return (
      <View style={arrowStyle}>
        <Image source={arrowIcon} style={{width: 8.5, height: 13.5}} />
      </View>
    );
  };

  const minDate = new Date(tripStartDate);
  minDate.setDate(minDate.getDate() + 1);

  return (
    <Calendar
      firstDay={1}
      initialDate={tripStartDate}
      minDate={minDate.toISOString().split('T')[0]}
      onDayPress={onPickEndDate}
      markedDates={{
        [tripStartDate]: {
          selected: true,
          customStyles: {
            container: {
              backgroundColor: '#27AE60',
              justifyContent: 'center',
              alignItems: 'center',
              width: 30,
              height: 30,
              borderRadius: 10,
            },
          },
        },
        [tripEndDate]: {
          selected: true,
          disableTouchEvent: true,
          customStyles: {
            container: {
              backgroundColor: '#7879F1',
              justifyContent: 'center',
              alignItems: 'center',
              width: 30,
              height: 30,
              borderRadius: 10,
            },
            text: {
              color: 'white',
            },
          },
        },
      }}
      theme={styles.calendarTheme}
      renderArrow={renderCustomArrow}
      renderHeader={date => {
        const month = date.toString('MMMM');
        const year = date.toString('yyyy');
        return <CalendarHeader month={month} year={year} />;
      }}
      markingType={'custom'}
    />
  );
}

export default function EndDateSelection({
  showCalendar2,
  tripStartDate,
  tripEndDate,
  PickEndDate,
  setShowCalendar2,
}) {
  return (
    <Modal animationType="slide" visible={showCalendar2} transparent>
      <SafeAreaView style={styles.CalendarModalBody}>
        <View style={{backgroundColor: '#3A3A3A', padding: 8}}>
          <View style={styles.calendarHeader}>
            <Text style={styles.selectDateTitle}>Trip End Date</Text>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={() => setShowCalendar2(false)}>
              <Image source={close} style={{width: 24, height: 24}} />
            </TouchableOpacity>
          </View>
          <View style={{width: '90%', alignSelf: 'center'}}>
            <DateSelection2
              tripStartDate={tripStartDate}
              tripEndDate={tripEndDate}
              onPickEndDate={PickEndDate}
            />
          </View>

          <View style={{margin: 10, alignItems: 'center'}}>
            <ActionButton
              title={'Set Trip Period'}
              onPress={() => {
                if (tripEndDate !== '') {
                  setShowCalendar2(false);
                }
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  CalendarModalBody: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
  },
  selectDateTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  calendarHeader: {
    position: 'relative',
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  calendarTheme: {
    calendarBackground: '#3A3A3A',
    textDisabledColor: '#828282',
    dayTextColor: '#F2F2F2',
    textSectionTitleColor: '#828282',
    arrowColor: '#F2F2F2',
    monthTextColor: '#F2F2F2',
    textMonthFontFamily: 'Montserrat-SemiBold',
    textMonthFontSize: 16,
    textDayFontFamily: 'Montserrat-Regular',
    textDayHeaderFontFamily: 'Montserrat-Regular',
    textDayFontSize: 14,
    todayTextColor: '#7879F1',
  },
});
