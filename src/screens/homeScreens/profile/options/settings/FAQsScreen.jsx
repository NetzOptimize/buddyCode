import React, {useContext, useEffect, useState} from 'react';
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

import HTMLView from 'react-native-htmlview';
import axios from 'axios';
import {AuthContext} from '../../../../../context/AuthContext';
import {COLORS, FONTS} from '../../../../../constants/theme/theme';
import Spinner from 'react-native-loading-spinner-overlay';
import {ENDPOINT} from '../../../../../constants/endpoints/endpoints';

const FAQsScreen = ({navigation, route}) => {
  const {authToken} = useContext(AuthContext);
  const {type} = route.params;

  const [loading, setLoading] = useState(false);
  const [faqsText, setFAQs] = useState('');


  useEffect(() => {
    if (type == 'faq') {
      getPrivacy('faq');
    }else{
      getPrivacy('privacy & policy');
    }
  }, []);

  const getPrivacy = type => {
    const getPrivacyURL = ENDPOINT.TERMS;
    setLoading(true);
    axios
      .get(getPrivacyURL, {
        params: {
          page: type,
        },
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        setFAQs(res.data.data.content.content);
      })
      .catch(err => {
        console.log('error fetching:', err?.response?.data || err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  console.log(faqsText)

  return (
    <RegularBG>
      <Spinner visible={loading} color={COLORS.THANOS} />
      <View style={{marginTop: 16, marginBottom: 16}}>
        <BackButton
          title={type == 'faq' ? "FAQs" : 'Privacy Policy'}
          onPress={() => navigation.goBack()}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HTMLView value={faqsText.replace('\r\n', '')} stylesheet={styles} />

        <View style={{height: 110}} />
      </ScrollView>
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  p: {
    color: 'white',
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    lineHeight: 22,
    marginTop: -20,
  },
  ul: {
    color: 'white',
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    lineHeight: 28,
    marginTop: -60,
  },
  ol: {
    color: 'white',
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    lineHeight: 28,
    marginTop: -60,
  },
  li: {
    color: 'white',
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    lineHeight: 28,
  },
  h3: {
    color: 'white',
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 20,
    lineHeight: 28,
    marginTop: -60,
  },
  h4: {
    color: 'white',
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 18,
    lineHeight: 28,
    marginTop: -60,
  },
  h1: {
    color: 'white',
    fontFamily: FONTS.MAIN_BOLD,
    fontSize: 28,
    lineHeight: 28,
  },
});

export default FAQsScreen;
