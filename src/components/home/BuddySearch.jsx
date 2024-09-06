import React, {useContext, useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import RegularBG from '../background/RegularBG';
import BackButton from '../buttons/BackButton';
import SearchBar from './SearchBar';

import {useDebouncedCallback} from 'use-debounce';
import {AuthContext} from '../../context/AuthContext';
import FastImage from 'react-native-fast-image';
import {COLORS, FONTS} from '../../constants/theme/theme';
import {SCREENS} from '../../constants/screens/screen';
import NavigationService from '../../config/NavigationService';

var noDP = require('../../../assets/Images/noDP.png');

function UserComponent({profilePicture, name, username, onPress}) {
  return (
    <TouchableOpacity style={styles.buddies} onPress={onPress}>
      <FastImage
        source={profilePicture ? {uri: profilePicture} : noDP}
        style={styles.dp}
      />
      <View style={styles.nameUsernameContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.username}>@{username}</Text>
      </View>
    </TouchableOpacity>
  );
}

const BuddySearch = ({navigation, route}) => {
  const {SearchUsers, searchResult, setSearchResult, myUserDetails} =
    useContext(AuthContext);

  const {isForChat, isForTrip} = route.params;

  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  function getRandomAlphabet() {
    const randomNumber = Math.floor(Math.random() * 26);
    const randomAlphabet = String.fromCharCode(65 + randomNumber);
    return randomAlphabet;
  }

  useEffect(() => {
    debounced(getRandomAlphabet());
  }, []);

  const debounced = useDebouncedCallback(search => {
    setSearchResult({
      docs: [],
      hasNextPage: false,
    });
    setPage(1);
    SearchUsers(search, 1);
  }, 200);

  const generateUserId = user =>
    `${user.first_name}-${user.last_name}-${user.username}`;

  const uniqueUsers = searchResult?.docs?.filter(
    (user, index, self) =>
      index === self.findIndex(u => generateUserId(u) === generateUserId(user)),
  );

  function userPressHandler(data) {
    if (isForChat) {
      console.log('handle chat logic');
    } else {
      NavigationService.navigate(SCREENS.BUDDY_PROFILE, {
        buddyData: data,
        followed: myUserDetails?.user?.following?.some(
          item => item?._id == data?._id,
        ),
      });
    }
  }

  return (
    <RegularBG>
      <View style={{marginTop: 14, marginBottom: 14, gap: 14}}>
        <BackButton
          title={'Buddy Search'}
          onPress={() => navigation.goBack()}
        />

        <SearchBar
          searchValue={searchText}
          onChangeText={text => {
            setSearchText(text);
            debounced(text);
          }}
          onClear={() => setSearchText('')}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{gap: 16}}>
          {uniqueUsers?.map((user, i) => {
            if (user?.is_deleted) {
              return null;
            }

            return (
              <UserComponent
                key={i}
                name={`${user.first_name} ${user.last_name}`}
                username={user.username}
                profilePicture={user.profile_image}
                onPress={() => userPressHandler(user)}
              />
            );
          })}
        </View>

        <View style={{height: 110}} />
      </ScrollView>
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  buddies: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 16,
  },
  dp: {
    width: 48,
    height: 48,
    borderRadius: 1000,
  },
  nameUsernameContainer: {
    gap: 4,
  },
  name: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 16,
    color: COLORS.LIGHT,
  },
  username: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
    color: COLORS.LIGHT,
  },
});

export default BuddySearch;
