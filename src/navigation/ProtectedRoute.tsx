import React, {useEffect, useState} from 'react';
import {isUserAuthenticated} from '../auth/AuthService';
import {SignedInStack, SignedOutStack} from './Navigator';

const ProtectedRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  console.log(isLoggedIn);
  useEffect(() => {
    (async () => setIsLoggedIn(await isUserAuthenticated()))();
  }, [isLoggedIn]);
  return <>{isLoggedIn ? <SignedInStack /> : <SignedOutStack />}</>;
};

export default ProtectedRoute;
