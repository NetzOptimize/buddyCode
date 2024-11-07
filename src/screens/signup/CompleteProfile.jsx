import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, {useState, useRef} from 'react';
import ImageBG from '../../components/background/ImageBG';
import BackButton from '../../components/buttons/BackButton';

import {FONTS, COLORS} from '../../constants/theme/theme';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import CustomPhoneInput from '../../components/inputs/CustomPhoneInput';

import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {ENDPOINT} from '../../constants/endpoints/endpoints';
import {SCREENS} from '../../constants/screens/screen';

var addBuddyCheckSelect = require('../../../assets/Images/addBuddyCheckSelect.png');
var step1 = require('../../../assets/Images/step1.png');

const CompleteProfile = ({navigation, route}) => {
  const {myToken} = route.params;

  const phoneInput = useRef(null);

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState(0);
  const [gender, setGender] = useState('Gender *');
  const [genderPickerVisible, setGenderPickerVisible] = useState(false);
  const [ethnicity, setEthnicity] = useState('Ethnicity *');
  const [ethnicityVisible, setEthnicityVisible] = useState(false);
  const [dob, setDob] = useState('Date of Birth *');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const genders = [
    {
      id: 1,
      text: 'Woman',
    },
    {
      id: 2,
      text: 'Transgender Woman',
    },
    {
      id: 3,
      text: 'Man',
    },
    {
      id: 4,
      text: 'Transgender Man',
    },
    {
      id: 5,
      text: 'Non-Binary / Trans Non-Binary/ Genderqueer',
    },
    {
      id: 6,
      text: 'Other',
    },
    {
      id: 7,
      text: 'Prefer Not to Say',
    },
  ];

  const ethnicityJson = [
    {
      id: 1,
      text: 'American Indian or Alaska Native',
    },
    {
      id: 2,
      text: 'Black or African American',
    },
    {
      id: 3,
      text: 'Asian American',
    },
    {
      id: 4,
      text: 'Hispanic or Latino American',
    },
    {
      id: 5,
      text: 'Native Hawaiian or Other Pacific Islander',
    },
    {
      id: 6,
      text: 'Two or More Ethnicities',
    },
    {id: 7, text: 'White American'},
    {
      id: 8,
      text: 'Prefer Not to Say',
    },
  ];

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let date_of_birth = month + '/' + day + '/' + year;

    let currentDate = new Date();

    if (date > currentDate) {
      Alert.alert('please select a valid date');
    } else {
      setDob(date_of_birth);
    }

    hideDatePicker();
  };

  function checkValidations(value) {
    if (firstName == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter your first name.',
      });
    } else if (lastName == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter your last name.',
      });
    } else if (gender == 'Gender*') {
      Toast.show({
        type: 'error',
        text1: 'Please enter your gender.',
      });
    } else if (ethnicity == 'Ethnicity*') {
      Toast.show({
        type: 'error',
        text1: 'Please enter your ethnicity.',
      });
    } else if (phone == '' || phone == null || phone == 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your phone number.',
      });
    } else if (phone.length !== 10) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a valid phone number.',
      });
    } else if (dob == 'Date of Birth *') {
      Toast.show({
        type: 'error',
        text1: 'Please enter your Date of Birth.',
      });
    } else {
      CompleteProfileFN();
    }
  }

  function CompleteProfileFN() {
    setLoading(true);
    var user = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      gender: gender,
      ethnicity: ethnicity,
      phone: phone,
      date_of_birth: dob,
    };

    axios
      .post(ENDPOINT.COMPLETE_PROFILE, user, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + myToken,
        },
      })
      .then(res => {
        console.log('complete:');
        setLoading(false);
        navigation.navigate(SCREENS.SELECT_PREFERENCES, {
          myToken: myToken,
        });
      })
      .catch(e => {
        console.log('register error', e.response.data);
        Toast.show({
          type: 'error',
          text1: e.response.data.message,
        });
        setLoading(false);
      });
  }

  return (
    <ImageBG>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginTop: 14, marginBottom: 14}}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>

        <Image
          source={step1}
          style={{height: 20, width: 263, alignSelf: 'center'}}
        />

        <View style={{marginTop: 42}}>
          <Text style={styles.tagline}>Welcome to BuddyPass!</Text>
          <Text style={styles.subTagline}>You only have 2 steps left.</Text>
        </View>

        <View style={{gap: 16, marginTop: 32, marginBottom: 32}}>
          <CustomTextInput
            placeholder={'First Name *'}
            value={firstName}
            onChangeText={text => setFirstName(text)}
          />

          <CustomTextInput
            placeholder={'Middle Name (optional)'}
            value={middleName}
            onChangeText={text => setMiddleName(text)}
          />

          <CustomTextInput
            placeholder={'Last Name *'}
            value={lastName}
            onChangeText={text => setLastName(text)}
          />

          <TouchableOpacity
            style={styles.genderBtn}
            onPress={() => setGenderPickerVisible(true)}>
            <Text style={styles.genderText}>{gender}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.genderBtn}
            onPress={() => setEthnicityVisible(true)}>
            <Text style={styles.genderText}>{ethnicity}</Text>
          </TouchableOpacity>

          <CustomPhoneInput
            phoneInputRef={phoneInput}
            value={phone}
            onChangeText={text => setPhone(text)}
          />

          <TouchableOpacity
            style={styles.genderBtn}
            onPress={() => {
              showDatePicker();
            }}>
            <Text style={styles.genderText}>{dob}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={checkValidations}>
          {loading ? (
            <ActivityIndicator size={32} color={COLORS.THANOS} />
          ) : (
            <Image
              source={require('../../../assets/Images/fArrow.png')}
              style={{width: 30, height: 30}}
            />
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* modals */}

      <DatePicker
        modal
        open={isDatePickerVisible}
        date={new Date()}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        isDarkModeEnabled={true}
      />

      <Modal visible={genderPickerVisible} transparent animationType="slide">
        <SafeAreaView style={styles.genderSafeArea}>
          <View style={styles.pickGenderBox}>
            {genders.map(data => {
              return (
                <TouchableOpacity
                  style={
                    data.id === 1
                      ? styles.pickGenderNoMargin
                      : styles.pickGender
                  }
                  key={data.id}
                  onPress={() => setGender(data.text)}>
                  {gender === data.text ? (
                    <Image
                      source={addBuddyCheckSelect}
                      style={{width: 24, height: 24, marginRight: 10}}
                    />
                  ) : (
                    <View style={styles.emptyBuddySelect} />
                  )}

                  <Text style={styles.GenderText}>{data.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.genderDoneBox}>
            <TouchableOpacity
              style={styles.genderDone}
              onPress={() => setGenderPickerVisible(false)}>
              <Text style={styles.genderDoneText}>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.genderCancel}
              onPress={() => {
                setGender('Gender*');
                setGenderPickerVisible(false);
              }}>
              <Text style={styles.genderCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={ethnicityVisible} transparent animationType="slide">
        <SafeAreaView style={styles.genderSafeArea}>
          <View style={styles.pickGenderBox}>
            {ethnicityJson.map(data => {
              return (
                <TouchableOpacity
                  style={
                    data.id === 1
                      ? styles.pickGenderNoMargin
                      : styles.pickGender
                  }
                  key={data.id}
                  onPress={() => setEthnicity(data.text)}>
                  {ethnicity === data.text ? (
                    <Image
                      source={addBuddyCheckSelect}
                      style={{width: 24, height: 24, marginRight: 10}}
                    />
                  ) : (
                    <View style={styles.emptyBuddySelect} />
                  )}

                  <Text style={styles.GenderText}>{data.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.genderDoneBox}>
            <TouchableOpacity
              style={styles.genderDone}
              onPress={() => setEthnicityVisible(false)}>
              <Text style={styles.genderDoneText}>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.genderCancel}
              onPress={() => {
                setEthnicity('Ethnicity*');
                setEthnicityVisible(false);
              }}>
              <Text style={styles.genderCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </ImageBG>
  );
};

export default CompleteProfile;

const styles = StyleSheet.create({
  tagline: {
    color: COLORS.LIGHT,
    alignSelf: 'center',
    lineHeight: 40,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: FONTS.MAIN_SEMI,
  },
  subTagline: {
    color: COLORS.LIGHT,
    fontWeight: '400',
    alignSelf: 'center',
    lineHeight: 24,
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.MAIN_REG,
  },
  genderBtn: {
    height: 60,
    width: '100%',
    borderRadius: 1000,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: COLORS.GREY_LIGHT,
  },
  genderText: {
    fontSize: 16,
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
  },
  submitBtn: {
    marginBottom: 36,
    width: 82,
    height: 60,
    backgroundColor: COLORS.GREY_LIGHT,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },

  //  **
  container: {
    flex: 1,
  },
  step1Style: {
    width: '90%',
    height: 20,
    alignSelf: 'center',
    marginTop: 24,
  },

  pickBtn: {
    height: 60,
    width: '100%',
    backgroundColor: '#4E4E4E',
    borderRadius: 100,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  pickText: {
    fontSize: 16,
    color: '#F2F2F2',
    fontFamily: 'Montserrat-Regular',
  },
  genderSafeArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickGenderBox: {
    marginBottom: 10,
    width: '95%',
    borderRadius: 10,
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#3A3A3A',
  },
  pickGender: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  pickGenderNoMargin: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyBuddySelect: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    marginRight: 10,
  },
  GenderText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#F2F2F2',
  },
  genderDoneBox: {
    width: '95%',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#3A3A3A',
    padding: 10,
    borderRadius: 10,
  },
  genderDone: {
    width: '100%',
    height: 46,
    backgroundColor: '#7879F1',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderCancel: {
    width: '100%',
    height: 46,
    backgroundColor: 'white',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  genderDoneText: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
    fontSize: 16,
  },
  genderCancelText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#333333',
    fontSize: 16,
  },
});
