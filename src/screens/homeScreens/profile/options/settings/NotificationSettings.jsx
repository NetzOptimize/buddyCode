import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Switch, Text, ActivityIndicator} from 'react-native';
import RegularBG from '../../../../../components/background/RegularBG';
import BackButton from '../../../../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../../../../constants/theme/theme';
import {ENDPOINT} from '../../../../../constants/endpoints/endpoints';
import axios from 'axios';
import {AuthContext} from '../../../../../context/AuthContext';

const NotificationSettings = ({navigation}) => {
  const {authToken} = useContext(AuthContext);

  const [isAllowed, setIsAllowed] = useState({
    interactions: true,
    suggested_trips: true,
    new_trips_from_buddies: true,
    direct_messages: true,
    campaigns_and_events: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getNotificationsAllowed();
  }, []);

  const getNotificationsAllowed = async () => {
    setLoading(true);

    try {
      const reponse = await axios.get(ENDPOINT.NOTIFI_ALLOWED, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      });
      const notifiData = reponse.data.data.notificationSetting;

      setIsAllowed({
        interactions: notifiData.interactions,
        suggested_trips: notifiData.suggested_trips,
        new_trips_from_buddies: notifiData.new_trips_from_buddies,
        direct_messages: notifiData.direct_messages,
        campaigns_and_events: notifiData.campaigns_and_events,
      });
    } catch (error) {
      console.log('failed to get notifications allowed data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSwitch = async (key, value) => {
    const data = {
      ...isAllowed,
      [key]: value,
    };

    try {
      const response = await axios.post(ENDPOINT.NOTIFI_ALLOWED, data, {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      });

      console.log('switched sucessfully:', response.data);

      setIsAllowed(data);
    } catch (error) {
      console.log('failed to switch', error?.response?.data || error);
    }
  };

  const Options = [
    {
      id: 'interactions',
      title: 'Interactions',
      body: 'Get notified of likes, comments, favorites, mentions and friend requests.',
      action: () => toggleSwitch('interactions', !isAllowed.interactions),
    },
    {
      id: 'suggested_trips',
      title: 'Suggested trips',
      body: 'Get trips recommendations based on your interests.',
      action: () => toggleSwitch('suggested_trips', !isAllowed.suggested_trips),
    },
    {
      id: 'new_trips_from_buddies',
      title: 'New trips from Buddies you follow',
      body: 'Get notified when the buddies you follow and frequently interact with trips something new.',
      action: () =>
        toggleSwitch(
          'new_trips_from_buddies',
          !isAllowed.new_trips_from_buddies,
        ),
    },
    {
      id: 'direct_messages',
      title: 'Direct messages',
      body: 'Get notified when people send you direct messages',
      action: () => toggleSwitch('direct_messages', !isAllowed.direct_messages),
    },
    {
      id: 'campaigns_and_events',
      title: 'Campaigns and events',
      body: 'Get notified of new campaigns and events on BuddyPass',
      action: () =>
        toggleSwitch('campaigns_and_events', !isAllowed.campaigns_and_events),
    },
  ];

  return (
    <RegularBG>
      <View style={{marginTop: 14, marginBottom: 24}}>
        <BackButton
          onPress={() => navigation.goBack()}
          title={'Notification Settings'}
        />
      </View>

      <View style={{gap: 10}}>
        {loading ? (
          <ActivityIndicator size={'large'} color={COLORS.THANOS} />
        ) : (
          Options.map(data => (
            <View style={{gap: 16}} key={data.id}>
              <View style={styles.switchContainer}>
                <View style={styles.titleSwitch}>
                  <Text style={styles.titleText}>{data.title}</Text>
                  <Switch
                    trackColor={{false: '#767577', true: COLORS.THANOS}}
                    thumbColor={isAllowed ? COLORS.LIGHT : COLORS.VISION}
                    onValueChange={data.action}
                    value={isAllowed[data.id]}
                  />
                </View>
                <Text style={styles.bodyText}>{data.body}</Text>
              </View>

              <View style={styles.hr} />
            </View>
          ))
        )}
      </View>
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    gap: 10,
  },
  titleSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  bodyText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.VISION,
  },
  hr: {
    height: 1,
    backgroundColor: COLORS.SWEDEN,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 1000,
  },
});

export default NotificationSettings;
