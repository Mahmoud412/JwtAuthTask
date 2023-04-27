import React from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SendConfirmationCodeScreen from '../screens/SendConfirmationCodeScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import {isUserAuthenticated} from '../auth/AuthService';

export type RootStackParamList = {
  ConfirmationCode: undefined;
  Registration: {credential: string};
  Login: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const SignedInStack = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
export const SignedOutStack = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="ConfirmationCode"
        component={SendConfirmationCodeScreen}
      />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

// const Navigator = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   useEffect(() => {
//     const handleIsLoggedIn = async () => {
//       setIsLoggedIn(await isUserAuthenticated());
//     };
//     handleIsLoggedIn();
//   }, []);
//   const screenOptions = {
//     headerLeft: () => null,
//   };
//   return (
//     <NavigationContainer>
//       {isLoggedIn ? (
//         <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
//           <Stack.Screen
//             name="Home"
//             component={HomeScreen}
//             options={{headerShown: false}}
//           />

//           {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
//         </Stack.Navigator>
//       ) : (
//         <Stack.Navigator initialRouteName="Login">
//           <Stack.Screen
//             name="Login"
//             component={LoginScreen}
//             options={{navigationBarHidden: false}}
//           />
//           <Stack.Screen
//             name="ConfirmationCode"
//             component={SendConfirmationCodeScreen}
//           />
//           <Stack.Screen name="Registration" component={RegistrationScreen} />
//           <Stack.Screen
//             name="Home"
//             component={HomeScreen}
//             options={{headerShown: false}}
//           />
//         </Stack.Navigator>
//       )}
//     </NavigationContainer>
//   );
// };

// export default Navigator;
