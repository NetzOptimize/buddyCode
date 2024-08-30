import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Switch, Text} from 'react-native';
import RegularBG from '../../../../../components/background/RegularBG';
import BackButton from '../../../../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../../../../constants/theme/theme';

import {handleNotificationPermission} from '../../../../../config/autoMediaPermission';

const NotificationSettings = ({navigation}) => {
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    getNotificationPermission();
  }, []);

  const getNotificationPermission = async () => {
    const hasPermission = await handleNotificationPermission();
    setIsPrivate(hasPermission);
  };

  const toggleSwitch = () => setIsPrivate(previousState => !previousState);

  const Options = [
    {
      id: 1,
      title: 'Interactions',
      body: 'Get notified of likes, comments, favorites, mentions and friend requests.',
      action: () => toggleSwitch(),
    },
    {
      id: 2,
      title: 'Suggested trips',
      body: 'Get trips recommendations based on your interests.',
      action: () => toggleSwitch(),
    },
    {
      id: 3,
      title: 'New trips from Buddies you follow',
      body: 'Get notified when the buddies you follow and frequently interact with trips something new.',
      action: () => toggleSwitch(),
    },
    {
      id: 4,
      title: 'Direct messages',
      body: 'Get notified when people send you direct messages',
      action: () => toggleSwitch(),
    },
    {
      id: 5,
      title: 'Campaigns and events',
      body: 'Get notified of new campaigns and events on BuddyPass',
      action: () => toggleSwitch(),
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
        {Options.map(data => (
          <View style={{gap: 16}} key={data.id}>
            <View style={styles.switchContainer}>
              <View style={styles.titleSwitch}>
                <Text style={styles.titleText}>{data.title}</Text>
                <Switch
                  trackColor={{false: '#767577', true: COLORS.THANOS}}
                  thumbColor={isPrivate ? COLORS.LIGHT : COLORS.VISION}
                  onValueChange={data.action}
                  value={isPrivate}
                />
              </View>
              <Text style={styles.bodyText}>{data.body}</Text>
            </View>

            <View style={styles.hr} />
          </View>
        ))}
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
