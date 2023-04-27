import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {isUserAuthenticated} from '../auth/AuthService';
import {SignedInStack, SignedOutStack} from './Navigator';

const ProtectedRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  console.log(isLoggedIn);
  useEffect(() => {
    const handleIsLoggedIn = async () => {
      setIsLoggedIn(await isUserAuthenticated());
    };
    handleIsLoggedIn();
  }, [isLoggedIn]);
  return <>{isLoggedIn ? <SignedInStack /> : <SignedOutStack />}</>;
};

export default ProtectedRoute;
