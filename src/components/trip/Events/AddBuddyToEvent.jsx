/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';

var noDP = require('../../../../assets/Images/noDP.png');
var close = require('../../../../assets/Images/close.png');
var addBuddyCheckSelect = require('../../../../assets/Images/addBuddyCheckSelect.png');

export default function AddBuddyToEvent({
  addBuddyVisible,
  tripMembers,
  BuddyAddedFN,
  BuddyAdded,
  setAddBuddyVisible,
}) {
  return (
    <Modal visible={addBuddyVisible} transparent animationType="slide">
      <SafeAreaView style={styles.addBuddySafe}>
        <View
          style={{
            backgroundColor: '#3A3A3A',
          }}>
          <TouchableOpacity
            style={{alignSelf: 'flex-end', margin: 12}}
            onPress={() => setAddBuddyVisible(false)}>
            <Image source={close} style={{width: 34, height: 34}} />
          </TouchableOpacity>
          <View style={styles.addBuddyView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {tripMembers?.map((user, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.addBuddyBox}
                  onPress={() => {
                    BuddyAddedFN(user);
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={
                        user.profile_image ? {uri: user.profile_image} : noDP
                      }
                      style={styles.buddyDp}
                    />
                    <Text
                      style={
                        styles.buddyname
                      }>{`${user.first_name} ${user.last_name}`}</Text>
                  </View>

                  {BuddyAdded?.map(buddy => buddy._id).includes(user._id) ? (
                    <Image
                      source={addBuddyCheckSelect}
                      style={styles.unSelectBuddy}
                    />
                  ) : (
                    <View style={styles.unSelectBuddy} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <TouchableOpacity
            style={styles.addBuddyBtn}
            onPress={() => {
              if (BuddyAdded?.length > 0) {
                setAddBuddyVisible(false);
              }
            }}>
            <Text style={styles.actionBtnText}>Add Buddies</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buddyname: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#F2F2F2',
  },
  unSelectBuddy: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
  },
  selectBuddy: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 4,
    backgroundColor: '#7879F1',
  },
  addBuddySafe: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBuddyView: {
    marginBottom: 10,
    width: '95%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    minHeight: 46,
    maxHeight: 250,
    flexWrap: 'wrap',
  },
  addBuddyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'white',
    padding: 12,
    borderRadius: 12,
  },
  buddyDp: {
    width: 24,
    height: 24,
    borderRadius: 100,
    marginRight: 10,
  },
  addBuddyBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#7879F1',
    borderRadius: 1000,
    alignSelf: 'center',
    paddingLeft: 32,
    paddingRight: 32,
    margin: 12,
  },
  actionBtnText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});
