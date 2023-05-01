import {Alert, TextInput, View} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from 'react-native-elements';
import {
  addFcmForegroundHandler,
  initNotifications,
  sendFcmNotification,
} from '../utils/NotifcationsService';
import useLogin from '../hooks/useLogin';
import {formStyle} from './styles/styles';
import {getCurrentUid} from '../auth/AuthService';

const HomeScreen = () => {
  const [currentUid, setCurrentUid] = useState<string>();
  useEffect(() => {
    (async () => {
      setCurrentUid((await getCurrentUid()) || '');
    })();
  }, []);

  const {dispatchLogout} = useLogin();
  useEffect(() => {
    initNotifications();
    return addFcmForegroundHandler();
  }, []);

  const handleLogOut = async () => {
    try {
      await dispatchLogout();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendFcmMessage = async () => {
    try {
      await sendFcmNotification();
    } catch (error) {
      console.log(error);
      Alert.alert('Error sending FCM message', JSON.stringify(error));
    }
  };

  return (
    <SafeAreaView>
      <View style={{padding: 10}}>
        <Button
          containerStyle={{padding: 10}}
          title="Log Out"
          onPress={handleLogOut}
          buttonStyle={formStyle.buttonColor}
        />
        <Button
          containerStyle={{padding: 10}}
          title="Send FCM Notification"
          onPress={handleSendFcmMessage}
          buttonStyle={formStyle.buttonColor}
        />
        <TextInput
          style={{padding: 10, borderRadius: 10}}
          value={'UID: ' + currentUid}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
