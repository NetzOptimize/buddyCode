import React, {useContext, useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
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
import GradientText from './GradientText';
import ActionButton from '../buttons/ActionButton';

var noDP = require('../../../assets/Images/noDP.png');
var circleSelect = require('../../../assets/Images/circleSelect.png');
var circleUnselect = require('../../../assets/Images/circleUnselect.png');
var cancel = require('../../../assets/Images/close.png');

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

function TripParticipants({
  profilePicture,
  name,
  username,
  tripMembers,
  userData,
  ...allProps
}) {
  const isSelected = tripMembers?.includes(userData);

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      {...allProps}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        }}>
        <Image
          source={profilePicture ? {uri: profilePicture} : noDP}
          style={styles.dp}
        />
        <View style={styles.searchNameUsernameContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.username}>@{username}</Text>
        </View>
      </View>

      <View style={styles.selectbtn}>
        <Image
          source={isSelected ? circleSelect : circleUnselect}
          style={{width: 20, height: 20}}
        />
      </View>
    </TouchableOpacity>
  );
}

const BuddySearch = ({navigation, route}) => {
  const {
    SearchUsers,
    searchResult,
    setSearchResult,
    myUserDetails,
    tripMembers,
    setTripMembers,
  } = useContext(AuthContext);

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

  function addBuddyHandler(user) {
    const isUserInTrip = tripMembers?.some(member => member._id === user._id);

    if (!isUserInTrip) {
      setTripMembers(prevValue => [...prevValue, user]);
    } else {
      setTripMembers(prevValue =>
        prevValue.filter(member => member._id !== user._id),
      );
    }
  }

  function userPressHandler(data) {
    if (isForChat) {
      NavigationService.navigate(SCREENS.ONE_CHAT, {
        chatUserID: data._id,
        name: `${data.first_name} ${data.last_name}`,
        agoraTargetUsername: data.agoraDetails[0].username,
        NewOrOldChat: 'new',
        profileImage: data.profile_image,
        username: data.username,
        is_chat_approved: true,
      });
    } else {
      NavigationService.navigate(SCREENS.BUDDY_PROFILE, {
        buddyData: data,
      });
    }
  }

  const renderMember = ({item}) => (
    <TouchableOpacity
      style={styles.memberContainer}
      onPress={() => addBuddyHandler(item)}>
      <View style={styles.cancelBtn}>
        <Image source={cancel} style={{width: 16, height: 16}} />
      </View>
      <FastImage
        source={item.profile_image ? {uri: item.profile_image} : noDP}
        style={styles.dp}
      />
      <Text style={styles.username}>@{item.username}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
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
              if (isForTrip) {
                return (
                  <TripParticipants
                    key={i}
                    name={`${user.first_name} ${user.last_name}`}
                    username={user.username}
                    profilePicture={user.profile_image}
                    onPress={() => addBuddyHandler(user)}
                    tripMembers={tripMembers}
                    userData={user}
                  />
                );
              }

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

      {tripMembers.length > 0 && (
        <>
          <View style={styles.buddyAddedContainer}>
            <FlatList
              data={tripMembers}
              renderItem={renderMember}
              keyExtractor={item => item._id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>
          <View style={{margin: 20, marginTop: 10, marginBottom: 10}}>
            <ActionButton title={'Done'} onPress={() => navigation.goBack()} />
          </View>
        </>
      )}
    </View>
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
  countText: {
    fontFamily: FONTS.ALT_SEMI,
    color: '#FFFFFF',
    fontSize: 12,
  },
  buddyAddedContainer: {
    height: 90,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: COLORS.GREY_DARK,
    paddingLeft: 16,
    paddingRight: 0,
    borderTopWidth: 0.5,
    borderColor: COLORS.SWEDEN,
  },
  memberContainer: {
    marginRight: 16,
    flexDirection: 'Column',
    alignItems: 'center',
    gap: 4,
  },
  listContainer: {
    // alignItems: 'center',
  },
  cancelBtn: {
    borderRadius: 100,
    backgroundColor: COLORS.ERROR,
    top: 16,
    right: -16,
    zIndex: 9999,
  },
});

export default BuddySearch;
