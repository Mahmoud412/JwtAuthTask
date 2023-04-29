import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Button, Icon, Input} from 'react-native-elements';
import * as yup from 'yup';
import {Formik} from 'formik';
import {isEmail, isPhoneNumber} from '../utils/RegexUtils';
import {useNavigation} from '@react-navigation/native';
import AuthError from '../auth/AuthError';
import useLogin from '../hooks/useLogin';
import {ValidationStyles, formStyle} from './styles/styles';
import {LoginScreenNavigationProps} from '../navigation/NavigationTypes';

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
  const {dispatchLogin} = useLogin();
  const navigation = useNavigation<LoginScreenNavigationProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const handleSignIn = async (credential: string, password: string) => {
    const isEmailCredential: boolean = isEmail(credential) !== null;
    console.log(isEmailCredential);
    try {
      setLoading(true);
      await dispatchLogin(credential, password);
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
        <SafeAreaView style={formStyle.container}>
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
              <Text style={ValidationStyles.error}>{errors.credential}</Text>
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
              <Text style={ValidationStyles.error}>{errors.password}</Text>
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
              buttonStyle={formStyle.buttonColor}
              onPress={handleSubmit}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text>Create new account</Text>
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
