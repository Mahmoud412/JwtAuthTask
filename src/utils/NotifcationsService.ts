import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import {privateApi} from '../api/Api';

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

  if (enabled) {
    saveFcmToken();
  }
};

export function addFcmForegroundHandler(): () => void {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    handleForegroundMessage(remoteMessage);
  });

  return unsubscribe;
}

const saveFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('Current FCM token: ', fcmToken);
  try {
    fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('New FCM token: ' + fcmToken);
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  } catch (error) {
    console.log('Error fetching FCM token: ', error);
  }
};

const handleForegroundMessage = async (fcmMessage: any) => {
  const channelId = await notifee.createChannel({
    id: 'com.jwtauthtask.notifications.channels.default',
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
  const token = await AsyncStorage.getItem('fcmToken');
  await privateApi.post('/sendShortMessage', {
    recipient: token,
    backend: '1087375425180',
    subject: 'FCM Message Subject',
    message: 'FCM messsage body',
    params: {
      send_notification: true,
    },
  });
};
