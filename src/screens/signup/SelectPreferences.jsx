import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ENDPOINT} from '../../constants/endpoints/endpoints';

import axios from 'axios';
import ImageBG from '../../components/background/ImageBG';
import BackButton from '../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../constants/theme/theme';
import Toast from 'react-native-toast-message';
import {SCREENS} from '../../constants/screens/screen';

var step1 = require('../../../assets/Images/step2.png');

const SelectPreferences = ({navigation, route}) => {
  const {myToken} = route.params;

  const [loading, setLoading] = useState(false);
  const [preferences, setAllPreferences] = useState([]);
  const [preferencesArr, setPreferencesArr] = useState([]);

  function myPreferences(id) {
    if (!preferencesArr.includes(id)) {
      setPreferencesArr([...preferencesArr, id]);
    } else if (preferencesArr.includes(id)) {
      let users = preferencesArr;
      users = users.filter(value => {
        return value !== id;
      });
      setPreferencesArr(users);
    }
  }

  const getPreferences = () => {
    axios
      .get(ENDPOINT.GET_PREFERENCES, {
        headers: {
          Authorization: 'Bearer ' + myToken,
        },
      })
      .then(res => {
        let userInfo = res.data.data;
        setAllPreferences(userInfo.preferences);
      })
      .catch(error => {
        console.log(`Preferences error ${error}`);
      });
  };

  useEffect(() => {
    getPreferences();
  }, []);

  function handleSubmit() {
    if (preferencesArr.length == 0) {
      Toast.show({
        type: 'info',
        text2: 'Please pick your preferences or click on Skip',
      });
    } else {
      UpdatePreferencesComplete();
    }
  }

  const UpdatePreferencesComplete = async () => {
    let formData = new FormData();
    formData.append('preferences', preferencesArr);

    setLoading(false);

    try {
      const response = await axios({
        method: 'put',
        url: ENDPOINT.UPDATE_PROFILE,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + myToken,
        },
      });

      if (response.status === 200) {
        navigation.navigate(SCREENS.FOLLOW_PEOPLE, {
          myToken: myToken,
        });
      } else {
        console.log('Update user error:', response.data);
        Toast.show({
          type: 'error',
          text2: response.data.message,
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBG>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(SCREENS.FOLLOW_PEOPLE, {
                myToken: myToken,
              });
            }}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={step1}
          style={{height: 20, width: 263, alignSelf: 'center'}}
        />

        <View style={{marginTop: 42, marginBottom: 42}}>
          <Text style={styles.tagline}>Almost there!</Text>
          <Text style={styles.subTagline}>Choose your preference.</Text>
        </View>

        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 16}}>
          {preferences.map((data, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.touchablePreference,
                  {
                    backgroundColor: preferencesArr.includes(data._id)
                      ? '#F2F2F2'
                      : '#595959',
                  },
                ]}
                onPress={() => {
                  myPreferences(data._id);
                }}>
                <Text
                  style={{
                    fontFamily: preferencesArr.includes(data._id)
                      ? 'Montserrat-SemiBold'
                      : 'Montserrat-Regular',
                    fontSize: 16,
                    color: preferencesArr.includes(data._id)
                      ? '#4F4F4F'
                      : '#F2F2F2',
                  }}>
                  {data.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
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
    </ImageBG>
  );
};

export default SelectPreferences;

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
  touchablePreference: {
    padding: 10,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 100,
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
  header: {
    marginTop: 14,
    marginBottom: 34,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  skip: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
});
