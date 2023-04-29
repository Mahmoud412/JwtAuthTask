import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from './Navigator';

export type LoginScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export type RegistrationScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'Registration'
>;

export type ConfirmationCodeNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'ConfirmationCode'
>;
