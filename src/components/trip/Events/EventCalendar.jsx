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

import {Calendar} from 'react-native-calendars';

import CalendarHeader from '../../calendar/CalendarHeader';

var close = require('../../../../assets/Images/close.png');

const EventCalendar = ({
  minDate,
  maxDate,
  eventDate,
  setEventDate,
  isCalendarOpen,
  setIsCalendarOpen,
}) => {
  let formattedMaxDate = new Date(maxDate);
  formattedMaxDate.setDate(formattedMaxDate.getDate() - 1);

  return (
    <Modal transparent visible={isCalendarOpen}>
      <SafeAreaView style={styles.calendarModal}>
        <View style={{backgroundColor: '#3A3A3A', padding: 8}}>
          <View style={styles.calendarHeader}>
            <Text style={styles.selectDateTitle}>Event Start Date</Text>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={() => setIsCalendarOpen(false)}>
              <Image source={close} style={{width: 24, height: 24}} />
            </TouchableOpacity>
          </View>

          <Calendar
            current={new Date(minDate)?.toISOString().slice(0, 10)}
            minDate={minDate}
            maxDate={formattedMaxDate}
            markedDates={{
              [eventDate]: {
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
            }}
            onDayPress={date => {
              setEventDate(date.dateString);
            }}
            renderHeader={date => {
              const month = date.toString('MMMM');
              const year = date.toString('yyyy');
              return <CalendarHeader month={month} year={year} />;
            }}
            theme={styles.calendarTheme}
            markingType={'custom'}
          />

          <TouchableOpacity
            style={styles.dateDoneBtn}
            onPress={() => {
              if (eventDate != 'Select Event Date*') {
                setIsCalendarOpen(false);
              }
            }}>
            <Text style={styles.actionBtnText}>Select Date</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default EventCalendar;

const styles = StyleSheet.create({
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
    todayTextColor: '#F2F2F2',
    selectedDayBackgroundColor: '#7879F1',
    todayBackgroundColor: '#858585',
  },
  calendarModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
  },
  dateDoneBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    height: 56,
    backgroundColor: '#7879F1',
    borderRadius: 1000,
    alignSelf: 'center',
    marginTop: 20,
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
  actionBtnText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});
