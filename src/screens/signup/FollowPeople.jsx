import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {ENDPOINT} from '../../constants/endpoints/endpoints';

import axios from 'axios';
import ImageBG from '../../components/background/ImageBG';
import BackButton from '../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../constants/theme/theme';
import FastImage from 'react-native-fast-image';
import {AuthContext} from '../../context/AuthContext';

var step1 = require('../../../assets/Images/step2.png');
var noDP = require('../../../assets/Images/noDP.png');

function UserCard({user, authToken, followingArr, setFollowingArr}) {
  function getFullName() {
    return `${user.first_name} ${user.last_name}`;
  }

  async function handleFollow(buddyId) {
    const userData = {
      followee: buddyId,
    };

    try {
      const response = await axios({
        method: 'POST',
        url: ENDPOINT.FOLLOW_USER,
        data: userData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
      });

      console.log(response.data.data.status);
    } catch (error) {
      console.log('Failed to follow or unfollow:', error.response.data);
    }
  }

  async function handleUnfollow(buddyId) {
    const userData = {
      followee: buddyId,
    };

    try {
      const response = await axios({
        method: 'POST',
        url: ENDPOINT.UNFOLLOW_USER,
        data: userData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
      });

      console.log('unfollow', response.data);
    } catch (error) {
      console.log(
        'Failed to follow or unfollow:',
        error.response.data,
        ENDPOINT.UNFOLLOW_USER,
      );
    }
  }

  const followHandle = id => {
    if (!followingArr.includes(id)) {
      setFollowingArr([...followingArr, id]);
      handleFollow(id);
    } else if (followingArr.includes(id)) {
      let removeBuddy = followingArr;
      removeBuddy = removeBuddy.filter(value => {
        return value !== id;
      });
      handleUnfollow(id);
      setFollowingArr(removeBuddy);
    }
  };

  return (
    <TouchableOpacity
      style={followingArr.includes(user._id) ? styles.activeCard : styles.card}
      onPress={() => {
        followHandle(user._id);
      }}>
      <FastImage
        source={user.profile_image ? {uri: user.profile_image} : noDP}
        style={{width: 40, height: 40, borderRadius: 1000}}
      />
      <Text style={styles.name}>{getFullName()}</Text>
      <Text
        style={followingArr.includes(user._id) ? styles.activeBtn : styles.btn}>
        {followingArr.includes(user._id) ? 'Following' : 'Follow'}
      </Text>
    </TouchableOpacity>
  );
}

const FollowPeople = ({navigation, route}) => {
  const {VerifyToken} = useContext(AuthContext);

  const {myToken} = route.params;

  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [followingArr, setFollowingArr] = useState([]);

  function getRandomAlphabet() {
    const randomNumber = Math.floor(Math.random() * 26);
    const randomAlphabet = String.fromCharCode(65 + randomNumber);
    return randomAlphabet;
  }

  useEffect(() => {
    SearchUsers(getRandomAlphabet(), myToken);
  }, []);

  const SearchUsers = (search, myToken) => {
    setIsLoading(true);

    axios
      .get(ENDPOINT.SEARCH_USERS, {
        params: {
          search: search,
          page: 1,
        },
        headers: {
          Authorization: 'Bearer ' + myToken,
        },
      })
      .then(res => {
        setIsLoading(false);
        setSearchResult(res.data.data.docs.slice(0, 6));
      })
      .catch(err => {
        setIsLoading(false);
        console.log('search error:', err.response.data.status);
      });
  };

  const registrationComplete = isSkipped => {
    console.log(isSkipped, followingArr.length);

    if (!isSkipped && followingArr.length === 0) {
      Alert.alert(
        'Follow Users',
        'Please follow at least one user before proceeding or press Skip button.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    } else {
      VerifyToken(myToken);
    }
  };

  return (
    <ImageBG>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <TouchableOpacity onPress={() => registrationComplete(true)}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={step1}
          style={{height: 20, width: 263, alignSelf: 'center'}}
        />

        <View style={{marginTop: 42, marginBottom: 42}}>
          <Text style={styles.tagline}>Last Step!</Text>
          <Text style={styles.subTagline}>
            Follow travelers with similar interests!
          </Text>
        </View>

        <View style={styles.container}>
          {searchResult?.map((data, i) => {
            return (
              <UserCard
                key={i}
                user={data}
                authToken={myToken}
                followingArr={followingArr}
                setFollowingArr={setFollowingArr}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={registrationComplete}>
          <Image
            source={require('../../../assets/Images/fArrow.png')}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
      </ScrollView>
    </ImageBG>
  );
};

export default FollowPeople;

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
  name: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
    color: COLORS.LIGHT,
  },
  btn: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 10,
    color: COLORS.LIGHT,
  },
  activeBtn: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 12,
    color: COLORS.HULK,
  },
  card: {
    backgroundColor: COLORS.GREY_LIGHT,
    height: 120,
    borderRadius: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '47%',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 36,
  },
  activeCard: {
    backgroundColor: COLORS.GREY_LIGHT,
    height: 120,
    borderRadius: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '47%',
    borderWidth: 1,
    borderColor: COLORS.HULK,
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
});
