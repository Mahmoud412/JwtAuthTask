import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Icon, Input} from 'react-native-elements';
import * as yup from 'yup';
import {Formik} from 'formik';
import {isEmail, isPhoneNumber} from '../utils/RegexUtils';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/Navigator';
import {login} from '../auth/AuthService';
import AuthError from '../auth/AuthError';
import {useIsFocused} from '@react-navigation/native';

export type LoginScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const credentialValidationSchema = yup.object().shape({
  credential: yup
    .string()
    .required('Email or phone number is required')
    .test('Invalid email or phone number', (text: any) => {
      return isEmail(text) || isPhoneNumber(text);
    }),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const handleSignIn = async (credential: string, password: string) => {
    const isEmailCredential: boolean = isEmail(credential) !== null;
    console.log(isEmailCredential);
    try {
      setLoading(true);
      await login(credential, password);
      navigation.navigate('Home');
    } catch (error) {
      console.log('login error: ', error);
      if (error instanceof AuthError) {
        Alert.alert(error.message);
      } else {
        Alert.alert('Failed to login into your account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{credential: '', password: ''}}
      onSubmit={values => {
        handleSignIn(values.credential, values.password);
      }}
      validationSchema={credentialValidationSchema}>
      {({handleChange, handleBlur, handleSubmit, values, errors, isValid}) => (
        <SafeAreaView style={{margin: 10}}>
          <View>
            <Input
              disabled={loading}
              placeholder="Enter email or phome number"
              onChangeText={handleChange('credential')}
              onBlur={handleBlur('credential')}
              value={values.credential}
              autoCapitalize="none"
              leftIcon={
                <Icon name="email" type="fontisto" size={24} color="#D4BBFF" />
              }
            />
            {errors.credential && (
              <Text style={{color: 'red'}}>{errors.credential}</Text>
            )}

            <Input
              disabled={loading}
              placeholder="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              leftIcon={<Icon name="lock" size={24} color="#D4BBFF" />}
              secureTextEntry
            />
            {errors.password && (
              <Text style={{color: 'red'}}>{errors.password}</Text>
            )}
          </View>
          <View style={{alignItems: 'center'}}>
            <Button
              title={
                loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  'Sign In'
                )
              }
              disabled={!isValid || loading}
              containerStyle={{width: 250, marginVertical: 20}}
              buttonStyle={{backgroundColor: '#915FDB'}}
              onPress={handleSubmit}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text>create new account</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ConfirmationCode')}>
              <Text style={{color: 'blue'}}> Sign Up?</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </Formik>
  );
};

export default LoginScreen;
