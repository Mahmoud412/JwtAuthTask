import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import {notificationsApi} from '../api/Api';
import {getCurrentUid} from '../auth/AuthService';

export const initNotifications = async () => {
  await notifee.requestPermission();
  var enabled = false;
  if (Platform.OS == 'android') {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    enabled = result == 'granted';
  } else if (Platform.OS == 'ios') {
    const authStatus = await messaging().requestPermission();
    enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  }
  console.log('Notifications permission granted? ', enabled);
  saveAndRegisterFcmToken(null);
  messaging().onTokenRefresh((token: string) => {
    saveAndRegisterFcmToken(token);
  });
};

export function addFcmForegroundHandler(): () => void {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    handleForegroundMessage(remoteMessage);
  });

  return unsubscribe;
}

const saveAndRegisterFcmToken = async (fcmToken: string | null) => {
  try {
    if (fcmToken === null) {
      fcmToken = await messaging().getToken();
    }
    const uid = await getCurrentUid();
    if (uid && fcmToken) {
      console.log('Registering UID with FCM token: ' + uid + ' => ' + fcmToken);
      console.log('uid: ' + uid);
      await AsyncStorage.setItem('fcmToken', fcmToken);
      await registerFcmToken(uid, fcmToken);
    }
  } catch (error) {
    console.log('Error registering FCM token: ', error);
  }
};

const handleForegroundMessage = async (fcmMessage: any) => {
  const channelId = await notifee.createChannel({
    id: 'com.stebla.notifications.channels.default',
    name: 'Default Channel',
  });

  await notifee.displayNotification({
    title: fcmMessage.notification.title,
    body: fcmMessage.notification.body,
    android: {
      channelId,
    },
  });
};

export const sendFcmNotification = async () => {
  const uid = await getCurrentUid();
  await notificationsApi.post('/private/sendShortMessage', {
    backend: 'firebase',
    message: 'FCM Message sent @ ' + Date.now(),
    subject: 'Message Title',
    params: {
      send_notification: true,
    },
    recipient: uid,
  });
};

export const registerFcmToken = async (uid: string, token: string) => {
  await notificationsApi.post('/v1/firebaseToken', {
    uid: uid,
    token: token,
  });
};
