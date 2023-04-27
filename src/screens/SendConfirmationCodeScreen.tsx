import {View, Text, SafeAreaView, Alert, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {Input} from 'react-native-elements';
import {Button, Icon} from '@rneui/themed';
import {sendConfirmationCode} from '../auth/AuthService';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/Navigator';
import * as yup from 'yup';
import {Formik} from 'formik';
import {isEmail, isPhoneNumber} from '../utils/RegexUtils';

export type ConfirmationCodeNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'ConfirmationCode'
>;

const credentialValidationSchema = yup.object().shape({
  credential: yup
    .string()
    .required('Email or phone number is required')
    .test('Invalid email or phone number', (text: any) => {
      return isEmail(text) || isPhoneNumber(text);
    }),
});

const SendConfirmationCodeScreen = () => {
  const navigation = useNavigation<ConfirmationCodeNavigationProps>();
  const [loading, setLoading] = useState(false);

  const handleSendConfirmationCode = async (credential: string) => {
    setLoading(true);
    const isEmailCredential = isEmail(credential) !== null;
    const email = isEmailCredential ? credential : null;
    const phoneNumber = isEmailCredential ? null : credential;

    try {
      const isSucess = await sendConfirmationCode(email, phoneNumber, false);
      if (isSucess) {
        navigation.navigate('Registration', {credential: credential});
      } else {
        Alert.alert('Failed to send confirmation code');
      }
    } catch (error) {
      Alert.alert('Failed to send confirmation code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{credential: ''}}
      onSubmit={values => {
        handleSendConfirmationCode(values.credential);
      }}
      validationSchema={credentialValidationSchema}>
      {({handleChange, handleBlur, handleSubmit, values, errors, isValid}) => (
        <SafeAreaView>
          <View style={{margin: 10}}>
            <Text style={{margin: 10, fontWeight: 'bold', fontSize: 17}}>
              Enter your email or phone number to get a confirmation code
            </Text>
            <Input
              disabled={loading}
              style={{marginLeft: 10}}
              placeholder="Email or phone number"
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
          </View>
          <View style={{alignItems: 'center'}}>
            <Button
              title={
                loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  'Send'
                )
              }
              disabled={!isValid}
              containerStyle={{width: 250, padding: 10}}
              buttonStyle={{backgroundColor: '#915FDB'}}
              icon={
                loading ? (
                  <></>
                ) : (
                  <Icon
                    style={{marginRight: 10}}
                    name="send"
                    type="feather"
                    color="white"
                  />
                )
              }
              onPress={handleSubmit}
            />
          </View>
        </SafeAreaView>
      )}
    </Formik>
  );
};

export default SendConfirmationCodeScreen;
