import {Alert, View} from 'react-native';
import React, {FC, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from 'react-native-elements';
import {
  addFcmForegroundHandler,
  initNotifications,
  sendFcmNotification,
} from '../utils/NotifcationsService';
import useLogin from '../hooks/useLogin';
import {formStyle} from './styles/styles';

const HomeScreen = () => {
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
          title="Send FCM Notifications"
          onPress={handleSendFcmMessage}
          buttonStyle={formStyle.buttonColor}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
