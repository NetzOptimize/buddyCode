import {Platform, Alert, Linking} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  requestNotifications,
} from 'react-native-permissions';

import messaging from '@react-native-firebase/messaging';

// Function to handle camera permission
export async function handleCameraPermission() {
  try {
    const permissionType =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const cameraPermission = await check(permissionType);

    if (cameraPermission === RESULTS.GRANTED) {
      return true;
    } else {
      console.log('Camera permission not granted, requesting...');
      const cameraRequestResult = await request(permissionType);

      if (cameraRequestResult === RESULTS.GRANTED) {
        return true;
      } else {
        console.log('Camera permission denied after request');
        return false;
      }
    }
  } catch (error) {
    console.error('Error checking or requesting camera permission:', error);
    return false;
  }
}

// Function to check and request photo and video library access permission
export async function handleMediaLibraryPermission() {
  try {
    let permissionType;

    if (Platform.OS === 'ios') {
      // iOS: Check permission for photo library
      permissionType = PERMISSIONS.IOS.PHOTO_LIBRARY;
    } else if (Platform.OS === 'android') {
      // Android: Check permissions for media access
      if (Platform.Version >= 33) {
        // API level 33 and above
        permissionType = [
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        ];
      } else {
        // API level below 33
        permissionType = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }
    }

    if (!permissionType) {
      console.log(
        'Media library permissions are not supported on this platform',
      );
      return false;
    }

    const permissionResults = await Promise.all(
      Array.isArray(permissionType)
        ? permissionType.map(p => check(p))
        : [check(permissionType)],
    );

    const allPermissionsGranted = permissionResults.every(
      result => result === RESULTS.GRANTED,
    );

    if (allPermissionsGranted) {
      console.log('Media library permission granted');
      return true;
    } else {
      const requestResults = await Promise.all(
        Array.isArray(permissionType)
          ? permissionType.map(p => request(p))
          : [request(permissionType)],
      );

      const allRequestsGranted = requestResults.every(
        result => result === RESULTS.GRANTED,
      );

      if (allRequestsGranted) {
        console.log('Media library permission granted after request');
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.error(
      'Error checking or requesting media library permission:',
      error,
    );
    return false;
  }
}

// Function to handle notification permission
export async function handleNotificationPermission() {
  try {
    // Request notification permissions for alert and sound
    const {status} = await requestNotifications(['alert', 'sound']);

    if (status === RESULTS.GRANTED) {
      return true;
    } else if (status === RESULTS.DENIED) {
      console.log('Notification permission denied');
      return false;
    } else {
      console.log(
        'Notification permission blocked or not determined, opening settings...',
      );
      return false;
    }
  } catch (error) {
    console.error(
      'Error checking or requesting notification permission:',
      error,
    );
    return false;
  }
}
