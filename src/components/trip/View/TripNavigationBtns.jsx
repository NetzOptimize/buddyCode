import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {COLORS, FONTS} from '../../../constants/theme/theme';

const TripNavigationBtns = ({currentTab, setCurrentTab}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={currentTab == 0 ? styles.activeBtn : styles.Btn}
        onPress={() => setCurrentTab(0)}>
        <Text style={currentTab == 0 ? styles.activeBtnText : styles.BtnText}>
          Trip Info
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={currentTab == 1 ? styles.activeBtn : styles.Btn}
        onPress={() => setCurrentTab(1)}>
        <Text style={currentTab == 1 ? styles.activeBtnText : styles.BtnText}>
          Budget
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={currentTab == 2 ? styles.activeBtn : styles.Btn}
        onPress={() => setCurrentTab(2)}>
        <Text style={currentTab == 2 ? styles.activeBtnText : styles.BtnText}>
          Itinerary
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    marginTop: 16,
    borderColor: COLORS.LIGHT,
    borderRadius: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeBtn: {
    backgroundColor: COLORS.LIGHT,
    borderRadius: 1000,
    padding: 26,
    paddingTop: 16,
    paddingBottom: 16,
  },
  activeBtnText: {
    fontFamily: FONTS.MAIN_BOLD,
    color: COLORS.GREY_LIGHT,
  },
  Btn: {
    borderRadius: 1000,
    padding: 26,
    paddingTop: 16,
    paddingBottom: 16,
  },
  BtnText: {
    fontFamily: FONTS.MAIN_BOLD,
    color: COLORS.LIGHT,
    fontSize: 12,
  },
});

export default TripNavigationBtns;
