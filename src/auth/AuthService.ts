import jwtDecode, {JwtPayload} from 'jwt-decode';
import {api, clearTokens, hasTokens, setTokens} from '../api/Api';
import AuthError from './AuthError';
import {getAccessToken} from 'react-native-axios-jwt';
import {NativeModules} from 'react-native';

const {JoseModule} = NativeModules;

export const isUserAuthenticated = hasTokens;
export const sendConfirmationCode = async (
  email?: string | null,
  phone?: string | null,
  useCall?: boolean,
): Promise<boolean> => {
  const response = await api.post('/sendConfirmCode', {
    ...(email && {email: email}),
    ...(phone && {phone: phone}),
    use_call: useCall,
  });
  return response.data.ok;
};

export const login = async (
  credential: string,
  password: string,
): Promise<void> => {
  const response = await api.post('/login', {
    credential: credential,
    password: password,
  });

  const data = response.data;
  if (!data.ok) {
    throw new AuthError(data.msg, data.code);
  }

  console.log('access token: ' + data.accessToken);
  await validateJwtAccessToken(data.accessToken);
  await setTokens(data.accessToken, data.refreshToken);
};

export const logout = async () => {
  await clearTokens();
};

export const signUpWithEmail = async (
  email: string,
  code: string,
  password: string,
) => {
  return signUp({
    email: email,
    emailConfirmCode: code,
    password: password,
  });
};

export const signUpWithPhone = async (
  phone: string,
  code: string,
  password: string,
) => {
  return signUp({
    phone: phone,
    phoneConfirmCode: code,
    password: password,
  });
};

const signUp = async (requestBody: any): Promise<string> => {
  const response = await api.post('/register', requestBody);
  if (!response.data.ok) {
    throw new AuthError(response.data.msg, response.data.code);
  }
  const uid = response.data.uid;
  console.log('uid: ' + uid);
  return uid;
};

export const getCurrentUid = async (): Promise<string | undefined> => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const payload = jwtDecode<JwtPayload>(accessToken);
    return payload.sub;
  }
};

const validateJwtAccessToken = async (token: string) => {
  const publicKeyResponse = await api.post('/getPublicKey', {});
  const publicKey = publicKeyResponse.data;
  console.log('public key', publicKey);
  const payload = await JoseModule.verify(token, publicKey);
  console.log('JWT payload: ' + JSON.stringify(payload));
};
