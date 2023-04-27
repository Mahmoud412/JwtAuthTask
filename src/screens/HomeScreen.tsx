import {View, Text} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from 'react-native-elements';
import {logout} from '../auth/AuthService';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/Navigator';
import {useNavigation} from '@react-navigation/native';

export type HomeScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;
const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProps>();
  const handleLogOut = () => {
    try {
      logout();
    } catch (error) {
      console.log(error);
    } finally {
      navigation.navigate('Login');
    }
  };
  return (
    <SafeAreaView>
      <Text>HomeScreen</Text>
      <Button title="log out" onPress={handleLogOut} />
    </SafeAreaView>
  );
};

export default HomeScreen;
