import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import RegularBG from '../../../../../components/background/RegularBG';
import BackButton from '../../../../../components/buttons/BackButton';
import {COLORS, FONTS} from '../../../../../constants/theme/theme';

const FAQsScreen = ({navigation}) => {
  const FAQs = [
    {
      id: 1,
      title: 'Who are you? What is Buddypass?',
      body: 'Buddypass is travel tech app, and a centralized hub for planning, organizing, and managing group trips. Overall to simplify the group peer travel planning experience and become the go to hub for peer travel planning.',
    },
    {
      id: 2,
      title: 'Sounds good. What’s the catch? Is it free?',
      body: 'No catch! Buddypass is free to use. This is a passion-built app from our team who have shared the same grievances – we want to make this as easy to use as possible.',
    },
    {
      id: 3,
      title: 'How many “Buddies” can I add?',
      body: 'Currently, you can add up to 20 members to your squad. If you need more, please reach out to our support team to assist you.',
    },
    {
      id: 4,
      title: 'I’m having trouble finding/adding someone?',
      body: 'Make sure that person has an active Buddypass account with correct information. If you still cannot locate said person – please reach out to us for support.',
    },
    {
      id: 5,
      title: 'How to I contact you for support?',
      body: 'Easy – contact us either through the website at our contact  page, or in app through our contact form. We’re standing by to assist.',
    },
  ];

  return (
    <RegularBG>
      <View style={{marginTop: 14, marginBottom: 24}}>
        <BackButton onPress={() => navigation.goBack()} title={'FAQs'} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{gap: 10}}>
          {FAQs.map(data => (
            <View style={{gap: 16}} key={data.id}>
              <View>
                <Text style={styles.titleText}>{data.title}</Text>
                <Text style={styles.bodyText}>{data.body}</Text>
              </View>

              <View style={styles.hr} />
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={{
            alignSelf: 'center',
          }}
          onPress={() => {
            Linking.openURL('https://www.buddypasstrips.com/faq');
          }}>
          <Text style={styles.link}>
            To read more about the Frequently Asked Questions, please click on
            this link
          </Text>
        </TouchableOpacity>

        <View style={{height: 110}} />
      </ScrollView>
    </RegularBG>
  );
};

const styles = StyleSheet.create({
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
  link: {
    fontSize: 16,
    color: '#54B4D3',
    fontFamily: FONTS.MAIN_SEMI,
    lineHeight: 30,
    textDecorationLine: 'underline',
    marginTop: 24,
    textAlign: 'center',
  },
});

export default FAQsScreen;
