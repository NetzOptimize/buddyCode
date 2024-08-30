import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme/theme';

var searchIcon = require('../../../assets/Images/search.png');

const SearchButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.searchContainer} onPress={onPress}>
      <Image source={searchIcon} style={{width: 20, height: 20}} />
      <Text style={styles.text}>Search</Text>
    </TouchableOpacity>
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
  },
  text: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
});

export default SearchButton;
