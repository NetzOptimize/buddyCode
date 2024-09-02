/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import {View, Image} from 'react-native';

var arrowLeft = require('../../../assets/Images/arrowLeft.png');
var arrowRight = require('../../../assets/Images/arrowRight2.png');

import {Calendar} from 'react-native-calendars';
import CalendarHeader from './CalendarHeader';
import {useContext} from 'react';
import {AuthContext} from '../../context/AuthContext';
import {COLORS, FONTS} from '../../constants/theme/theme';

function CustomCalendar({
  minDate,
  maxDate,
  props,
  eventDates,
  setShowAllEvents,
}) {
  const {selectedDate, setSelectedDate} = useContext(AuthContext);

  const renderCustomArrow = direction => {
    const arrowStyle = {
      padding: 10,
      paddingLeft: 12,
      paddingRight: 12,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: COLORS.LIGHT,
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

  let MarkedEventDates = [];

  if (eventDates === undefined) {
    console.log('no event dates');
  } else {
    MarkedEventDates = eventDates.map(item => ({
      id: item._id,
      event_category: item.event_category[0],
      event_date: new Date(item.event_date).toISOString().split('T')[0],
    }));
  }

  let formattedEvents = {};

  MarkedEventDates.forEach(value => {
    let color;
    switch (value.event_category) {
      case 'Workout':
        color = '#27AE60';
        break;
      case 'Activity':
        color = '#FCDDEC';
        break;
      case 'Dinner':
        color = '#A5A6F6';
        break;
      default:
        color = 'white';
    }

    if (!formattedEvents[value?.event_date]) {
      formattedEvents[value?.event_date] = {
        dots: [{color}],
        selected: selectedDate === value?.event_date ? true : false,
      };
    } else {
      if (formattedEvents[value?.event_date]?.dots.length < 3) {
        formattedEvents[value?.event_date]?.dots.push({color});
      }
    }
  });

  return (
    <Calendar
      markedDates={formattedEvents}
      current={new Date(minDate)?.toISOString()?.slice(0, 10)}
      renderHeader={date => {
        const month = date.toString('MMMM');
        const year = date.toString('yyyy');
        return <CalendarHeader month={month} year={year} />;
      }}
      renderArrow={renderCustomArrow}
      onDayPress={day => {
        setSelectedDate(day.dateString);
        setShowAllEvents(false);
      }}
      minDate={new Date(minDate)?.toISOString().slice(0, 10)}
      maxDate={new Date(maxDate)?.toISOString().slice(0, 10)}
      markingType="multi-dot"
      theme={{
        calendarBackground: '#3A3A3A',
        textDisabledColor: '#828282',
        dayTextColor: '#F2F2F2',
        textSectionTitleColor: '#828282',
        arrowColor: '#F2F2F2',
        monthTextColor: '#F2F2F2',
        textMonthFontFamily: FONTS.MAIN_SEMI,
        textMonthFontSize: 16,
        textDayFontFamily: FONTS.MAIN_REG,
        textDayHeaderFontFamily: FONTS.MAIN_REG,
        textDayFontSize: 14,
        selectedDayBackgroundColor: '#7879F1',
        width: 30,
        height: 30,
        borderRadius: 10,
        todayTextColor: '#7879F1',
      }}
      {...props}
    />
  );
}

export default CustomCalendar;
