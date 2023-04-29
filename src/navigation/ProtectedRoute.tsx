import React, {useEffect} from 'react';
import {SignedInStack, SignedOutStack} from './Navigator';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {init} from '../redux/features/AuthSlice';
import {hasTokens} from '../api/Api';

const ProtectedRoute = () => {
  const disptach = useAppDispatch();
  useEffect(() => {
    (async () => disptach(init(await hasTokens())))();
  }, []);

  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);
  return <>{isLoggedIn ? <SignedInStack /> : <SignedOutStack />}</>;
};

export default ProtectedRoute;
