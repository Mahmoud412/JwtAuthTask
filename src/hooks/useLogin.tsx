import {useAppDispatch} from '../redux/store';
import {onLogOut, loginSuccess} from '../redux/features/AuthSlice';
import {login, logout} from '../auth/AuthService';

const useLogin = () => {
  const dispatch = useAppDispatch();

  const dispatchLogin = async (
    credential: string,
    password: string,
  ): Promise<void> => {
    await login(credential, password);
    dispatch(loginSuccess());
  };

  const dispatchLogout = async () => {
    await logout();
    dispatch(onLogOut());
  };

  return {
    dispatchLogin,
    dispatchLogout,
  };
};

export default useLogin;
