import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import RegularBG from '../../../../../components/background/RegularBG';
import BackButton from '../../../../../components/buttons/BackButton';
import {ENDPOINT} from '../../../../../constants/endpoints/endpoints';

import HTMLView from 'react-native-htmlview';
import axios from 'axios';
import {AuthContext} from '../../../../../context/AuthContext';
import {COLORS, FONTS} from '../../../../../constants/theme/theme';
import Spinner from 'react-native-loading-spinner-overlay';

const Terms = ({navigation}) => {
  const {authToken} = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [termsText, setTermsText] = useState('');

  useEffect(() => {
    getPrivacy();
  }, []);

  const getPrivacy = () => {
    const getPrivacyURL = ENDPOINT.TERMS;
    setLoading(true);
    axios
      .get(getPrivacyURL, {
        params: {
          page: 'terms & conditions',
        },
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      })
      .then(res => {
        setTermsText(res.data.data.content.content);
      })
      .catch(err => {
        console.log("error fetching:", err?.response?.data || err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <RegularBG>
      <Spinner visible={loading} color={COLORS.THANOS} />
      <View style={{marginTop: 16, marginBottom: 16}}>
        <BackButton
          title={'Terms & Conditions'}
          onPress={() => navigation.goBack()}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HTMLView value={termsText.replace('\r\n', '')} stylesheet={styles} />

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
  },
  ul: {
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
  h1: {
    color: 'white',
    fontFamily: FONTS.MAIN_BOLD,
    fontSize: 28,
    lineHeight: 28,
  },
});

export default Terms;
