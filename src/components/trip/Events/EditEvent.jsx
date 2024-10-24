import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';

import {COLORS, FONTS} from '../../../constants/theme/theme';
import SmallTextInput from '../../inputs/SmallTextInput';
import DatePicker from 'react-native-date-picker';
import EventCalendar from './EventCalendar';
import axios from 'axios';
import {ENDPOINT} from '../../../constants/endpoints/endpoints';
import {AuthContext} from '../../../context/AuthContext';

var close = require('../../../../assets/Images/close.png');
var locationIcon = require('../../../../assets/Images/location.png');
var calendarIcon = require('../../../../assets/Images/trip/calendar.png');
var costIcon = require('../../../../assets/Images/trip/cash.png');
var time = require('../../../../assets/Images/trip/time.png');
var plus = require('../../../../assets/Images/plus.png');

import {useDispatch} from 'react-redux';
import {fetchTripData} from '../../../redux/slices/tripDetailsSlice';
import AddBuddyToEvent from './AddBuddyToEvent';
import ActionButton from '../../buttons/ActionButton';

const EditEvent = ({
  visible,
  onClose,
  minDate,
  maxDate,
  tripId,
  EventBuddies,
  eventData,
  date,
}) => {
  const {authToken} = useContext(AuthContext);

  const dispatch = useDispatch();

  const scrollViewRef = useRef(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('Select Event Date');
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);
  const [startTime, setStartTime] = useState('Start Time*');
  const [endTime, setEndTime] = useState('End Time*');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewCategoryPop, setViewCategoryPop] = useState(false);
  const [newCategoryText, setNewCategoryText] = useState('');
  const [category, setCategory] = useState([]);
  const [CategoryArr, SetCategoryArr] = useState([
    {
      id: 1,
      name: 'Dinner',
    },
    {
      id: 2,
      name: 'Activity',
    },
    {
      id: 3,
      name: 'Workout',
    },
  ]);

  const [addBuddyVisible, setAddBuddyVisible] = useState(false);
  const [BuddyAdded, setBuddyAdded] = useState([]);

  useEffect(() => {
    setName(eventData?.event_name);
    setDescription(
      eventData?.event_description ? eventData?.event_description : '',
    );
    setCost(formatCurrency(eventData?.cost?.toString()));
    setEventDate(date);
    setCategory(eventData?.event_category);
    setLocation(eventData?.event_location);
    setBuddyAdded(eventData?.members);
  }, [eventData, visible]);

  function BuddyAddedFN(user) {
    if (!BuddyAdded.map(buddy => buddy.id).includes(user.id)) {
      setBuddyAdded([...BuddyAdded, user]);
    } else {
      const updatedBuddyList = BuddyAdded.filter(buddy => buddy.id !== user.id);
      setBuddyAdded(updatedBuddyList);
    }
  }

  function handleClose() {
    onClose();

    setName('');
    setDescription('');
    setCost('');
    setLocation('');
    setEventDate('Select Event Date');
    setIsStartTimeOpen(false);
    setIsEndTimeOpen(false);
    setStartTime('Start Time*');
    setEndTime('End Time*');
    setIsCalendarOpen(false);
    setViewCategoryPop(false);
    setNewCategoryText('');
    setCategory([]);
    SetCategoryArr([
      {
        id: 1,
        name: 'Dinner',
      },
      {
        id: 2,
        name: 'Activity',
      },
      {
        id: 3,
        name: 'Workout',
      },
    ]);
    setBuddyAdded([]);
  }

  function handleCategorySelect(name) {
    setCategory([name]);
  }

  function handleAddCategory() {
    const trimmedCategory = newCategoryText.trim();
    if (trimmedCategory !== '') {
      const categoryExists = CategoryArr.some(
        category => category?.name === trimmedCategory,
      );

      if (!categoryExists) {
        SetCategoryArr(oldArr => [
          ...oldArr,
          {
            id: oldArr.length + 1,
            name: trimmedCategory,
          },
        ]);
        setNewCategoryText('');
        setViewCategoryPop(false);

        scrollViewRef.current.scrollToEnd();
      } else {
        Alert.alert('Category already exists.');
      }
    } else {
      Alert.alert('Please Add a new Category.');
    }
  }

  function pickStartTimeHandler(date) {
    setIsStartTimeOpen(false);
    const selectedTime = new Date(date);
    selectedTime.setSeconds(0);
    selectedTime.setMilliseconds(0);
    const endTimeObject = new Date(endTime);
    endTimeObject.setSeconds(0);
    endTimeObject.setMilliseconds(0);

    if (selectedTime >= endTimeObject) {
      Alert.alert('Start time must be before end time');
    } else {
      setStartTime(selectedTime);
    }
  }

  function pickEndTimeHandler(date) {
    setIsEndTimeOpen(false);
    const selectedTime = new Date(date);
    selectedTime.setSeconds(0);
    selectedTime.setMilliseconds(0);
    const startTimeObject = new Date(startTime);
    startTimeObject.setSeconds(0);
    startTimeObject.setMilliseconds(0);

    if (selectedTime <= startTimeObject) {
      Alert.alert('Start time must be before end time');
    } else {
      setEndTime(selectedTime);
    }
  }

  const formatCurrency = value => {
    let formattedValue = value?.replace(/[^0-9]/g, '');

    if (formattedValue === '') {
      return '';
    }

    formattedValue = formattedValue?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return `$ ${formattedValue}`;
  };

  const removeFormatting = formattedValue => {
    let unformattedValue = formattedValue.replace(/[$,]/g, '');
    return parseInt(unformattedValue, 10) || 0; // Return 0 if the string is empty
  };

  function handleFundText(value) {
    setCost(formatCurrency(value));
  }

  function checkValidations() {
    if (name == '') {
      Alert.alert('Please enter event name');
    } else if (eventDate == 'Select Event Date*') {
      Alert.alert('Please enter event Date');
    } else if (startTime == 'Start Time*') {
      Alert.alert('Please enter event start time');
    } else if (endTime == 'End Time*') {
      Alert.alert('Please enter event end time');
    } else if (cost == '') {
      Alert.alert('Please enter event cost');
    } else if (location == '') {
      Alert.alert('Please enter event location');
    } else if (category.length == 0) {
      Alert.alert('Please select event category');
    } else if (BuddyAdded?.length == 0) {
      Alert.alert('Please select event buddies');
    } else {
      UpdateEvent();
    }
  }

  function UpdateEvent() {
    let data = {
      event_name: name,
      event_date: eventDate,
      start_time: startTime,
      end_time: endTime,
      cost: removeFormatting(cost),
      event_location: location,
      event_category: category,
      members: BuddyAdded?.map(data => data._id),
    };

    if (description !== '') {
      data.event_description = description;
    }

    axios
      .put(`${ENDPOINT.UPDATE_EVENT}/${eventData?._id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        console.log('event created', res.data);

        dispatch(fetchTripData(tripId));
      })
      .catch(err => {
        console.log(
          'Failed to add update. An error occurred:',
          err?.response?.data,
        );
      })
      .finally(() => {
        handleClose();
      });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.tripPlanModal}>
        <View style={styles.body}>
          <View style={{position: 'relative', alignItems: 'center'}}>
            <Text style={styles.headerText}>Edit Event</Text>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={handleClose}>
              <Image source={close} style={{width: 24, height: 24}} />
            </TouchableOpacity>
          </View>
          <ScrollView
            ref={scrollViewRef}
            style={{marginTop: 12}}
            showsVerticalScrollIndicator={false}>
            <View style={{gap: 16}}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Event name*"
                placeholderTextColor={COLORS.VISION}
                value={name}
                onChangeText={text => setName(text)}
              />

              <TextInput
                placeholder="Type the note here..."
                placeholderTextColor={COLORS.VISION}
                multiline
                style={styles.descText}
                value={description}
                onChangeText={text => setDescription(text)}
              />

              <TouchableOpacity
                style={styles.calendarBtn}
                onPress={() => setIsCalendarOpen(true)}>
                <Text style={styles.calendarText}>
                  {eventDate == 'Select Event Date'
                    ? eventDate
                    : eventDate
                        .split('-')
                        .slice(1)
                        .concat(eventDate.split('-').slice(0, 1))
                        .join('-')}
                </Text>
                <Image source={calendarIcon} style={{width: 14, height: 16}} />
              </TouchableOpacity>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  style={styles.timeBtn}
                  onPress={() => setIsStartTimeOpen(true)}>
                  <Text style={styles.calendarText}>
                    {' '}
                    {startTime == 'Start Time*'
                      ? 'Start Time*'
                      : new Date(startTime).toLocaleTimeString([], {
                          hourCycle: 'h12',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                  </Text>
                  <Image source={time} style={{width: 14, height: 14}} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.timeBtn}
                  onPress={() => setIsEndTimeOpen(true)}>
                  <Text style={styles.calendarText}>
                    {endTime == 'End Time*'
                      ? 'End Time*'
                      : new Date(endTime).toLocaleTimeString([], {
                          hourCycle: 'h12',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                  </Text>
                  <Image source={time} style={{width: 14, height: 14}} />
                </TouchableOpacity>
              </View>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity style={styles.timeBtn}>
                  <TextInput
                    style={styles.miniInput}
                    value={cost}
                    placeholder="Cost *"
                    placeholderTextColor={COLORS.VISION}
                    onChangeText={handleFundText}
                    keyboardType="numeric"
                  />

                  <Image source={costIcon} style={{width: 14, height: 14}} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.timeBtn}>
                  <TextInput
                    style={styles.miniInput}
                    value={location}
                    placeholder="Location *"
                    placeholderTextColor={COLORS.VISION}
                    onChangeText={text => setLocation(text)}
                  />
                  <Image
                    source={locationIcon}
                    style={{width: 14, height: 14}}
                  />
                </TouchableOpacity>
              </View>

              <View>
                <View
                  style={{
                    width: '100%',
                    minHeight: 62,
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 10,
                    padding: 12,
                    paddingTop: 20,
                    paddingBottom: 20,
                    flexDirection: 'column',
                  }}>
                  {BuddyAdded?.length == 0 ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.textStyle}>Add Buddy</Text>
                      <TouchableOpacity
                        onPress={() => setAddBuddyVisible(true)}>
                        <Image
                          source={plus}
                          style={{width: 32, height: 32, borderRadius: 1000}}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        {BuddyAdded?.map((name, i) => {
                          if (name.status == 'inactive' || name.is_deleted) {
                            return (
                              <Text
                                key={i}
                                style={[styles.textStyle, {margin: 4}]}>
                                Buddypass User
                              </Text>
                            );
                          }

                          return (
                            <Text
                              style={[styles.textStyle, {margin: 4}]}
                              key={i}>
                              {`${name.first_name} ${name.last_name}`}
                            </Text>
                          );
                        })}
                      </View>
                      <TouchableOpacity
                        onPress={() => setAddBuddyVisible(true)}>
                        <Image
                          source={plus}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 1000,
                            transform: [{rotate: '45deg'}],
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              <View>
                <Text
                  style={{
                    fontFamily: FONTS.MAIN_SEMI,
                    fontSize: 16,
                    color: '#C4C4C4',
                  }}>
                  Select Category
                </Text>
                <View style={styles.categoryBox}>
                  {CategoryArr.map((d, k) => {
                    return (
                      <TouchableOpacity
                        style={[
                          styles.category,
                          {
                            backgroundColor: category?.includes(d.name)
                              ? '#27AE60'
                              : '#716B6E',
                          },
                        ]}
                        onPress={() => handleCategorySelect(d.name)}
                        key={k}>
                        <View
                          style={{
                            height: 13,
                            width: 10,
                            borderColor: category?.includes(d.name)
                              ? 'white'
                              : '#FCDDEC',
                            borderRadius: 1000,
                            borderWidth: 3,
                            marginRight: 6,
                          }}
                        />
                        <Text style={styles.eventCategoryText}>{d.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* new category */}
              <TouchableOpacity onPress={() => setViewCategoryPop(true)}>
                <Text
                  style={{
                    color: '#A5A6F6',
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 15,
                  }}>
                  + Add New
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <ActionButton title={'Update Event'} onPress={checkValidations} />
        </View>
      </SafeAreaView>

      <DatePicker
        modal
        androidVariant="nativeAndroid"
        open={isStartTimeOpen}
        date={startTime == 'Start Time*' ? new Date() : new Date(startTime)}
        mode={'time'}
        is24hourSource="device"
        onConfirm={date => pickStartTimeHandler(date)}
        onCancel={event => {
          console.log(event);
          setIsStartTimeOpen(false);
        }}
      />

      <DatePicker
        modal
        androidVariant="nativeAndroid"
        open={isEndTimeOpen}
        date={endTime == 'End Time*' ? new Date() : new Date(endTime)}
        mode={'time'}
        is24hourSource="device"
        onConfirm={date => pickEndTimeHandler(date)}
        onCancel={event => {
          console.log(event);
          setIsEndTimeOpen(false);
        }}
      />

      <Modal transparent visible={viewCategoryPop}>
        <SafeAreaView style={styles.safeAreaStyle}>
          <View
            style={{
              width: '100%',
              backgroundColor: '#3A3A3A',
              padding: 16,
            }}>
            <TextInput
              style={styles.textInput1}
              placeholder="Add a new Category"
              placeholderTextColor={'white'}
              onChangeText={text => {
                const capitalizedText =
                  text.charAt(0).toUpperCase() + text.slice(1);
                setNewCategoryText(capitalizedText);
              }}
            />

            <TouchableOpacity
              style={styles.addCategoryBtn}
              onPress={() => {
                handleAddCategory();
              }}>
              <Text style={styles.categoryText}>Add Category</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelCategory}
              onPress={() => {
                setViewCategoryPop(false);
              }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <EventCalendar
        minDate={minDate}
        maxDate={maxDate}
        eventDate={eventDate}
        setEventDate={setEventDate}
        isCalendarOpen={isCalendarOpen}
        setIsCalendarOpen={setIsCalendarOpen}
      />

      <AddBuddyToEvent
        tripMembers={EventBuddies}
        addBuddyVisible={addBuddyVisible}
        BuddyAddedFN={BuddyAddedFN}
        BuddyAdded={BuddyAdded}
        setAddBuddyVisible={setAddBuddyVisible}
      />
    </Modal>
  );
};

export default EditEvent;

const styles = StyleSheet.create({
  tripPlanModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  body: {
    width: '100%',
    height: '92%',
    backgroundColor: '#4E4E4E',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    position: 'relative',
  },
  headerText: {
    fontFamily: FONTS.MAIN_SEMI,
    alignSelf: 'center',
    color: COLORS.LIGHT,
    fontSize: 14,
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: COLORS.VISION,
    height: 48,
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 14,
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
  },
  descText: {
    width: '100%',
    maxHeight: 112,
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.VISION,
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 14,
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
    justifyContent: 'flex-start',
  },
  calendarBtn: {
    height: 48,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.VISION,
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarText: {
    fontSize: 14,
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.VISION,
  },
  timeBtn: {
    height: 48,
    width: '48%',
    borderWidth: 1,
    borderColor: COLORS.VISION,
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginLeft: -5,
  },
  category: {
    height: 44,
    padding: 12,
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: '#716B6E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    flexDirection: 'row',
  },
  eventCategoryText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: '#F2F2F2',
  },
  safeAreaStyle: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput1: {
    height: 62,
    width: '100%',
    borderWidth: 1,
    borderColor: '#F2F2F2',
    borderRadius: 10,
    alignSelf: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    padding: 10,
    color: '#F2F2F2',
  },
  addCategoryBtn: {
    width: '100%',
    height: 46,
    backgroundColor: '#7879F1',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  categoryText: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
    fontSize: 16,
  },
  cancelCategory: {
    width: '100%',
    height: 46,
    backgroundColor: 'white',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  cancelText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#333333',
    fontSize: 16,
  },
  doneBtn: {
    padding: 12,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: '#7879F1',
    borderRadius: 10,
  },
  doneBtnText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#ffffff',
    fontSize: 12,
  },
  miniInput: {
    width: '95%',
    fontSize: 14,
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
  },
  textStyle: {
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    fontSize: 16,
  },
});
