import React from 'react';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';
import {TouchableOpacity} from 'react-native-gesture-handler';

var searchIcon = require('../../../assets/Images/search.png');
var close = require('../../../assets/Images/close.png');

const SearchBar = ({searchValue, onChangeText, onClear, autoFocus = false}) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.main}>
        <Image source={searchIcon} style={{width: 20, height: 20}} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor={COLORS.LIGHT}
          value={searchValue}
          autoFocus={autoFocus}
          onChangeText={onChangeText}
        />
      </View>

      <TouchableOpacity onPress={onClear}>
        <Image source={close} style={{width: 20, height: 20}} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
    height: 40,
    borderRadius: 100,
    backgroundColor: COLORS.GREY_LIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    gap: 8,
    justifyContent: 'space-between',
  },
  input: {
    width: '95%',
    fontFamily: FONTS.MAIN_REG,
    color: COLORS.LIGHT,
  },
  main: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SearchBar;
