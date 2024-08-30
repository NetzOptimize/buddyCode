import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
import {COLORS, FONTS} from '../../../constants/theme/theme';

var noDP = require('../../../../assets/Images/noDP.png');
var close = require('../../../../assets/Images/close.png');
var view = require('../../../../assets/Images/input/viewPassword.png');
var adminStar = require('../../../../assets/Images/admin.png');

const TripBuddies = ({tripData}) => {
  const [showTripBuddies, setShowTripBuddies] = useState(false);

  let TripMembers = [];

  TripMembers.push(tripData?.owner);
  TripMembers.push(...tripData?.members);

  return (
    <View style={{marginBottom: 20, flexDirection: 'row'}}>
      {TripMembers?.slice(0, 5).map((members, k) => (
        <View key={k}>
          <Image
            source={
              members?.profile_image ? {uri: members?.profile_image} : noDP
            }
            style={[styles.tripMembers, {marginLeft: k == 0 ? 0 : -5}]}
          />
          {k == 0 && <Image source={adminStar} style={styles.star} />}
        </View>
      ))}

      {TripMembers?.length > 5 && (
        <TouchableOpacity
          style={styles.addBuddiesBtn}
          onPress={() => {
            setShowTripBuddies(true);
          }}>
          <Text style={styles.count}>+{TripMembers?.length - 5}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.addBuddiesBtn}
        onPress={() => {
          setShowTripBuddies(true);
        }}>
        <Image source={view} style={{width: 20, height: 20}} />
      </TouchableOpacity>

      <Modal visible={showTripBuddies} transparent animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalInnerBody}>
            <View style={styles.modalheader}>
              <Text style={styles.modalTitle}>Buddies</Text>
              <TouchableOpacity
                style={{position: 'absolute', right: 0}}
                onPress={() => setShowTripBuddies(false)}>
                <Image source={close} style={{width: 24, height: 24}} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{width: '100%'}}
              showsVerticalScrollIndicator={false}>
              <View style={styles.allBuddies}>
                {TripMembers?.map((member, i) => (
                  <View style={styles.modalBuddyBox} key={i}>
                    <View style={{position: 'relative'}}>
                      <Image
                        source={
                          member?.profile_image
                            ? {uri: member?.profile_image}
                            : noDP
                        }
                        style={styles.DPstyle}
                      />
                      {i == 0 && (
                        <Image source={adminStar} style={styles.star} />
                      )}
                    </View>
                    <View style={{padding: 8}}>
                      <Text style={styles.modalName}>
                        {member?.first_name} {member?.last_name}
                      </Text>
                      <Text style={styles.modalUsername}>
                        @{member?.username}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  star: {
    width: 10,
    height: 10,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  tripMembers: {
    width: 44,
    height: 44,
    borderRadius: 1000,
  },
  addBuddiesBtn: {
    width: 44,
    height: 44,
    borderWidth: 2.5,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.LIGHT,
    backgroundColor: COLORS.GREY_LIGHT,
    marginLeft: 10,
  },
  DPstyle: {
    width: 44,
    height: 44,
    borderRadius: 1000,
  },
  tripMembers: {
    width: 44,
    height: 44,
    borderRadius: 1000,
    marginLeft: -5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalInnerBody: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    backgroundColor: 'rgba(58, 58, 58, 1)',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  modalheader: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  modalName: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.LIGHT,
  },
  modalUsername: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 10,
    color: COLORS.LIGHT,
  },
  modalBuddyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  allBuddies: {
    flexDirection: 'row',
    alignSelf: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
  star: {
    width: 10,
    height: 10,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

export default TripBuddies;
