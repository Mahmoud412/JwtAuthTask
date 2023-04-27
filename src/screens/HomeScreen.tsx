import {Alert, View} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from 'react-native-elements';
import {logout} from '../auth/AuthService';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/Navigator';
import {useNavigation} from '@react-navigation/native';
import {
  addFcmForegroundHandler,
  initNotifications,
  sendFcmNotification,
} from '../utils/NotifcationsService';

export type HomeScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;
const HomeScreen = () => {
  useEffect(() => {
    initNotifications();
  }, []);

  useEffect(() => {
    return addFcmForegroundHandler();
  }, []);

  const navigation = useNavigation<HomeScreenNavigationProps>();
  const handleLogOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    } finally {
      navigation.navigate('Login');
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
        />
        <Button
          containerStyle={{padding: 10}}
          title="Send FCM Notifications"
          onPress={handleSendFcmMessage}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
