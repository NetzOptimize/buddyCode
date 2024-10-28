import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {COLORS, FONTS} from '../../../constants/theme/theme';
import {useSelector} from 'react-redux';

var location = require('../../../../assets/Images/location.png');
var cam = require('../../../../assets/Images/cam.png');
var deleteIcon = require('../../../../assets/Images/delete.png');

import OpenCamModal from '../../modal/OpenCamModal';
import {handleCameraPermission} from '../../../config/mediaPermission';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ENDPOINT} from '../../../constants/endpoints/endpoints';
import {AuthContext} from '../../../context/AuthContext';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const TripCoverImage = ({tripData, source, setSource}) => {
  const {tripInfo, loading, error} = useSelector(state => state.tripDetails);

  const {authToken} = useContext(AuthContext);

  const tripStartingTime = new Date(
    tripInfo
      ? tripInfo?.trip?.trip_starting_time
      : tripData?.trip_starting_time,
  );

  const daysUntilTrip = Math.ceil(
    (tripStartingTime - new Date()) / (1000 * 60 * 60 * 24),
  );

  const StartDate = new Date(
    tripInfo
      ? tripInfo?.trip?.trip_starting_time
      : tripData?.trip_starting_time,
  );

  const formattedStartDate = StartDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const endDate = new Date(
    tripInfo ? tripInfo?.trip?.trip_ending_time : tripData?.trip_ending_time,
  );
  const formattedEndDate = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const [open, setOpen] = useState(false);

  const handleCameraImagePicker = async () => {
    const hasPermission = await handleCameraPermission();
    if (hasPermission) {
      console.log(hasPermission);
      openCameraImagePicker();
    }
  };

  function handleGalleryPicker() {
    const options = {
      quality: 0.3,
    };
    launchImageLibrary(options, response => {
      setOpen(false);

      if (response.didCancel === true) {
        console.log('user canceled');
      } else {
        setSource(response.assets[0].uri);
        updateCoverImg(tripInfo?.trip?._id, response.assets[0].uri);
      }
    });
  }

  function openCameraImagePicker() {
    const options = {};

    launchCamera(options, response => {
      setOpen(false);

      if (response.didCancel === true) {
        console.log('user canceled');
      } else {
        setSource(response.assets[0].uri);
        updateCoverImg(tripInfo?.trip?._id, response.assets[0].uri);
      }
    });
  }

  function updateCoverImg(tripId, imgUri) {
    const addTripCoverURL = `${ENDPOINT.UPDATE_TRIP}/${tripId}`;

    const formData = new FormData();

    if (imgUri) {
      formData.append('trip_image', {
        uri: imgUri,
        type: 'image/jpeg',
        name: 'test.jpg',
      });
    } else {
      formData.append('trip_image', 'null');
    }

    axios({
      method: 'PUT',
      url: addTripCoverURL,
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + authToken,
      },
    })
      .then(res => {
        Toast.show({
          type: 'success',
          text2: 'Cover Image Updated',
        });
      })
      .catch(err => {
        console.log('Failed to add Image', err?.response?.data || err);
      });
  }

  const destination =
    tripInfo?.trip?.destination[0] || tripData?.destination[0];
  const isLong = destination?.length > 25;
  const displayDestination = isLong
    ? destination.slice(0, 25) + '...'
    : destination;

  if (!source) {
    return (
      <View>
        <Text style={styles.coverTitle}>
          {formattedStartDate} - {formattedEndDate}
        </Text>
        <View style={styles.noCover}>
          <Text style={styles.text1}>No Cover Image</Text>

          <View style={styles.daysLocationBox}>
            <View style={styles.bgDaysUntil}>
              <Text style={styles.daysUntilText}>
                {daysUntilTrip < 0
                  ? 'on going trip'
                  : `in ${daysUntilTrip} days`}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Image source={location} style={{width: 12, height: 12}} />
              <Text style={styles.locationText}>{displayDestination}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setOpen(true)}>
              <Image source={cam} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          </View>
        </View>

        <OpenCamModal
          visible={open}
          onClose={() => setOpen(false)}
          onCamPress={handleCameraImagePicker}
          onLibraryPress={handleGalleryPicker}
        />
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.coverTitle}>
        {formattedStartDate} - {formattedEndDate}
      </Text>

      <ImageBackground
        source={{uri: source}}
        style={styles.Cover}
        resizeMode="cover">
        <View style={styles.coverBox}>
          <View style={styles.overLay} />
          <View style={styles.daysLocationBox}>
            <View style={styles.bgDaysUntil}>
              <Text style={styles.daysUntilText}>
                {daysUntilTrip < 0 ? 'on going' : `in ${daysUntilTrip} days`}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Image source={location} style={{width: 12, height: 12}} />
              <Text style={styles.locationText}>{displayDestination}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setOpen(true)}>
              <Image source={cam} style={{width: 20, height: 20}} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                setSource(null);
                updateCoverImg(tripInfo?.trip?._id);
              }}>
              <Image source={deleteIcon} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <OpenCamModal
        visible={open}
        onClose={() => setOpen(false)}
        onCamPress={handleCameraImagePicker}
        onLibraryPress={handleGalleryPicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  noCover: {
    width: '100%',
    height: 200,
    position: 'relative',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.LIGHT,
    marginTop: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 12,
  },
  Cover: {
    width: '100%',
    height: 200,
    position: 'relative',
    borderRadius: 10,
    marginTop: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  coverTitle: {
    color: '#f2f2f2',
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 14,
  },
  coverBox: {
    width: '100%',
    height: 200,
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 12,
  },
  daysUntilText: {
    fontFamily: FONTS.MAIN_SEMI,
    fontSize: 10,
    color: COLORS.LIGHT,
  },
  bgDaysUntil: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 100,
  },
  locationText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 12,
    color: COLORS.LIGHT,
  },
  daysLocationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 1000,
    backgroundColor: 'rgba(242, 242, 242, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    fontFamily: FONTS.MAIN_SEMI,
    color: COLORS.LIGHT,
    fontSize: 12,
    position: 'absolute',
    alignSelf: 'center',
    top: '49%',
  },
  overLay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '150%',
    height: 200,
    left: 0,
  },
});

export default TripCoverImage;
