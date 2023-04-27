import {View, Text, Alert, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {Button, Icon, Input} from 'react-native-elements';
import * as yup from 'yup';
import {Formik} from 'formik';
import {isEmail, isPhoneNumber} from '../utils/RegexUtils';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/Navigator';
import {signUpWithEmail, signUpWithPhone} from '../auth/AuthService';
import AuthError from '../auth/AuthError';

export type RegistrationScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'Registration'
>;

type RegistrationScreenRouteProp = RouteProp<
  RootStackParamList,
  'Registration'
>;

const credentialValidationSchema = yup.object().shape({
  credential: yup
    .string()
    .required('Email or phone number is required')
    .test('Invalid email or phone number', (text: any) => {
      return isEmail(text) || isPhoneNumber(text);
    }),
  code: yup.string().required('Confirmation code is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const RegistrationScreen = () => {
  const navigation = useNavigation<RegistrationScreenNavigationProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    params: {credential},
  } = useRoute<RegistrationScreenRouteProp>();
  console.log(credential);
  const handleSignUp = async (
    credential: string,
    code: string,
    password: string,
  ) => {
    const isEmailCredential: boolean = isEmail(credential) !== null;
    console.log(isEmailCredential);
    try {
      setLoading(true);
      isEmail(credential) !== null
        ? await signUpWithEmail(credential, code, password)
        : await signUpWithPhone(credential, code, password);
      navigation.navigate('Login');
    } catch (error) {
      console.log('Registeration error: ', error);
      if (error instanceof AuthError) {
        Alert.alert(error.message);
      } else {
        Alert.alert('Failed to create new account');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Formik
      initialValues={{credential: '', password: '', code: ''}}
      onSubmit={values => {
        handleSignUp(values.credential, values.code, values.password);
      }}
      validationSchema={credentialValidationSchema}>
      {({handleChange, handleBlur, handleSubmit, values, errors, isValid}) => (
        <View style={{margin: 10}}>
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
              placeholder="Confirmation Code"
              onChangeText={handleChange('code')}
              onBlur={handleBlur('code')}
              value={values.code}
              leftIcon={
                <Icon
                  name="domain-verification"
                  type="materialIcons"
                  size={24}
                  color="#D4BBFF"
                />
              }
            />
            {errors.code && <Text style={{color: 'red'}}>{errors.code}</Text>}
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
                  'Sign Up'
                )
              }
              disabled={!isValid || loading}
              containerStyle={{width: 250, marginVertical: 20}}
              buttonStyle={{backgroundColor: '#915FDB'}}
              onPress={handleSubmit}
            />
          </View>
        </View>
      )}
    </Formik>
  );
};

export default RegistrationScreen;
