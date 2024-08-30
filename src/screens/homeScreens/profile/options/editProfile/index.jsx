import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import RegularBG from '../../../../../components/background/RegularBG';
import BackButton from '../../../../../components/buttons/BackButton';
import {AuthContext} from '../../../../../context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import SmallTextInput from '../../../../../components/inputs/SmallTextInput';
import Label from '../../../../../components/inputs/Label';
import {COLORS, FONTS} from '../../../../../constants/theme/theme';
import ActionButton from '../../../../../components/buttons/ActionButton';
import CustomPhoneInput from '../../../../../components/inputs/CustomPhoneInput';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ErrorText from '../../../../../components/inputs/ErrorText';
import Toast from 'react-native-toast-message';
import {ENDPOINT} from '../../../../../constants/endpoints/endpoints';

var noDP = require('../../../../../../assets/Images/noDP.png');
var editPic = require('../../../../../../assets/Images/editPic.png');

import axios from 'axios';
import OpenCamModal from '../../../../../components/modal/OpenCamModal';
import {
  handleCameraPermission,
  handleMediaLibraryPermission,
} from '../../../../../config/mediaPermission';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  username: yup.string().required('Username is required'),
  phone: yup.string().nullable(),
  bio: yup.string().nullable(),
});

const EditDP = ({source, setSource}) => {
  const [open, setIsOpen] = useState(false);

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
      setIsOpen(false);

      if (response.didCancel === true) {
        console.log('user canceled');
      } else {
        setSource(response.assets[0].uri);
      }
    });
  }

  function openCameraImagePicker() {
    const options = {};

    launchCamera(options, response => {
      setIsOpen(false);

      if (response.didCancel === true) {
        console.log('user canceled');
      } else {
        setSource(response.assets[0].uri);
      }
    });
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={{position: 'relative', alignSelf: 'center'}}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['#3CFFD0', '#FE4EED']}
          style={styles.LinearGradientStyle}>
          <View style={styles.ppCover}>
            <FastImage
              source={source ? {uri: source} : noDP}
              style={styles.dpStyle}
              resizeMode="cover"
            />
          </View>
        </LinearGradient>

        <View style={styles.editIcon}>
          <Image
            source={editPic}
            style={{width: 24, height: 24, borderRadius: 100}}
          />
        </View>
      </TouchableOpacity>

      <OpenCamModal
        visible={open}
        onClose={() => setIsOpen(false)}
        onCamPress={handleCameraImagePicker}
        onLibraryPress={handleGalleryPicker}
      />
    </>
  );
};

const EditProfile = ({navigation}) => {
  const {myUserDetails, authToken, loading, setLoading} =
    useContext(AuthContext);
  const phoneInput = React.useRef(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [currentDP, setCurrentDP] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);

  useEffect(() => {
    setCurrentDP(myUserDetails?.user?.profile_image);
    setEmail(myUserDetails?.user?.email);
    setValue('firstName', myUserDetails?.user?.first_name);
    setValue('lastName', myUserDetails?.user?.last_name);
    setValue('username', myUserDetails?.user?.username);
    setPhone(myUserDetails?.user?.phone);
  }, [myUserDetails, setValue]);

  const checkPhone = data => {
    if (phone == null || phone == '') {
      Toast.show({
        type: 'error',
        text1: 'Phone number is required',
        text2: 'Please enter your phone number',
      });
    } else {
      updateProfile(data);
    }
  };

  const updateProfile = async data => {
    const formData = new FormData();

    formData.append('username', data.username.trim());
    formData.append('first_name', data.firstName.trim());
    formData.append('last_name', data.lastName.trim());
    formData.append('phone', phone.trim());

    if (currentDP) {
      formData.append('profile_image', {
        uri: currentDP,
        type: 'image/jpeg',
        name: 'profile_image.jpg', // Better to use dynamic names
      });
    }

    setLoading(true);

    try {
      await axios({
        method: 'put',
        url: ENDPOINT.UPDATE_PROFILE,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + authToken,
        },
      });
      console.log('profile update success');
      navigation.goBack();
    } catch (err) {
      console.log('update user error:', err);
      Toast.show({
        type: 'error',
        text2: err.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegularBG>
      <View style={{marginTop: 14, marginBottom: 24}}>
        <BackButton
          onPress={() => navigation.goBack()}
          title={'Edit Profile'}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}>
        <View style={{marginBottom: 24}}>
          <EditDP source={currentDP} setSource={setCurrentDP} />
        </View>

        <View style={{gap: 24}}>
          <View style={styles.twoInputsBox}>
            <View style={{gap: 6, width: '48%'}}>
              <Label title={'First Name'} />
              <Controller
                control={control}
                name="firstName"
                render={({field: {onChange, onBlur, value}}) => (
                  <SmallTextInput
                    placeholder={'First Name'}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.firstName && (
                <ErrorText>{errors.firstName.message}</ErrorText>
              )}
            </View>

            <View style={{gap: 6, width: '48%'}}>
              <Label title={'Last Name'} />
              <Controller
                control={control}
                name="lastName"
                render={({field: {onChange, onBlur, value}}) => (
                  <SmallTextInput
                    placeholder={'Last Name'}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.lastName && (
                <ErrorText>{errors.lastName.message}</ErrorText>
              )}
            </View>
          </View>

          <View style={{gap: 6}}>
            <Label title={'User Name'} />
            <Controller
              control={control}
              name="username"
              render={({field: {onChange, onBlur, value}}) => (
                <SmallTextInput
                  placeholder={'Username'}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.username && (
              <ErrorText>{errors.username.message}</ErrorText>
            )}
          </View>

          <View style={{gap: 6}}>
            <Label title={'Email'} />
            <View style={styles.emailBox}>
              <Text style={styles.emailText}>{email}</Text>
            </View>
          </View>

          <View style={{gap: 6}}>
            <Label title={'Phone'} />

            {phone !== null && (
              <CustomPhoneInput
                phoneInputRef={phoneInput}
                value={phone}
                onChangeText={text => setPhone(text)}
              />
            )}
          </View>

          <View style={{gap: 6}}>
            <Label title={'Bio'} />
            <Controller
              control={control}
              name="bio"
              render={({field: {onChange, onBlur, value}}) => (
                <View style={styles.bioBox}>
                  <TextInput
                    style={styles.bioInput}
                    multiline={true}
                    placeholder="Add a Short Bio"
                    placeholderTextColor={COLORS.VISION}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />
          </View>
        </View>

        <View style={{marginTop: 32}}>
          <ActionButton
            onPress={handleSubmit(checkPhone)}
            title={'Save & Update'}
            loading={loading}
          />
        </View>

        <View style={{height: 110}} />
      </ScrollView>
    </RegularBG>
  );
};

const styles = StyleSheet.create({
  dpStyle: {
    width: 93,
    height: 93,
    borderRadius: 100,
  },
  LinearGradientStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: 105,
    height: 105,
  },
  ppCover: {
    width: 100,
    height: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.GREY_DARK,
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    borderRadius: 100,
  },
  twoInputsBox: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  bioInput: {
    width: '100%',
    color: COLORS.LIGHT,
    fontSize: 13,
    fontFamily: FONTS.MAIN_REG,
    padding: 10,
    minHeight: 40,
    maxHeight: 97,
  },
  bioBox: {
    width: '100%',
    backgroundColor: COLORS.GREY_LIGHT,
    height: 97,
    borderRadius: 10,
  },
  emailBox: {
    height: 50,
    width: '100%',
    borderRadius: 100,
    backgroundColor: COLORS.GREY_LIGHT,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center',
  },
  emailText: {
    fontFamily: FONTS.MAIN_REG,
    fontSize: 14,
    color: COLORS.LIGHT,
  },
});

export default EditProfile;
