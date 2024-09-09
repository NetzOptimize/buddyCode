import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import RegularBG from '../../../../../components/background/RegularBG';
import BackButton from '../../../../../components/buttons/BackButton';

import axios from 'axios';
import {AuthContext} from '../../../../../context/AuthContext';
import {ENDPOINT} from '../../../../../constants/endpoints/endpoints';
import ActionButton from '../../../../../components/buttons/ActionButton';
import {SCREENS} from '../../../../../constants/screens/screen';

function PreferenceCard({
  data,
  mySelectedPreferences,
  handlePreferenceSelection,
}) {
  const isActive = mySelectedPreferences?.includes(data._id);

  return (
    <TouchableOpacity
      style={isActive ? styles.preferBtnActive : styles.preferBtn}
      onPress={() => handlePreferenceSelection(data._id, !isActive)}>
      <Text style={isActive ? styles.preferTextActive : styles.preferText}>
        {data?.name}
      </Text>
    </TouchableOpacity>
  );
}

export default function UserPreferences({navigation}) {
  const {authToken, myUserDetails} = useContext(AuthContext);

  const [mySelectedPreferences, setMySelectedPreferences] = useState();

  useEffect(() => {
    GetPreferences();

    setMySelectedPreferences(
      myUserDetails?.user.preferences.map(preference => preference._id),
    );
  }, []);

  function handlePreferenceSelection(preferenceId, isActive) {
    if (isActive) {
      setMySelectedPreferences(prevState => [...prevState, preferenceId]);
    } else {
      setMySelectedPreferences(prevState =>
        prevState.filter(id => id !== preferenceId),
      );
    }
  }

  const [allPreferences, setAllPreferences] = useState(null);

  const GetPreferences = () => {
    axios
      .get(ENDPOINT.GET_PREFERENCES, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        let userInfo = res.data;
        setAllPreferences(userInfo.data.preferences);
        console.log('preferences success');
      })
      .catch(error => {
        console.log(`Preferences error ${error}`);
      });
  };

  const UpdatePreferences = () => {
    let formData = new FormData();

    formData.append('preferences', mySelectedPreferences);

    axios({
      method: 'put',
      url: ENDPOINT.UPDATE_PROFILE,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + authToken,
      },
    })
      .then(res => {
        console.log('preference update success');
        navigation.navigate(SCREENS.EDIT_PROFILE);
      })
      .catch(err => {
        console.log('update user error:', err.response.data);
      });
  };

  return (
    <RegularBG>
      <View style={{marginTop: 14}}>
        <BackButton title={'Select Travel Preferences'} />
      </View>

      <ScrollView
        style={{
          marginTop: 14,
        }}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
          }}>
          {allPreferences?.map((data, i) => (
            <PreferenceCard
              key={i}
              data={data}
              mySelectedPreferences={mySelectedPreferences}
              handlePreferenceSelection={handlePreferenceSelection}
            />
          ))}
        </View>
        <View style={{marginTop: 16, marginBottom: 16}}>
          <ActionButton title={'Save & Update'} onPress={UpdatePreferences} />
        </View>
      </ScrollView>
    </RegularBG>
  );
}

const styles = StyleSheet.create({
  preferBtnActive: {
    padding: 12,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 1000,
  },
  preferText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#f2f2f2',
  },
  preferBtn: {
    padding: 12,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#4E4E4E',
    borderRadius: 1000,
  },
  preferBtnActive: {
    padding: 12,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 1000,
  },
  preferTextActive: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#4F4F4F',
  },
});
