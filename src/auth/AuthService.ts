import jwtDecode, {JwtPayload} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api, clearTokens, hasTokens, setTokens} from '../api/Api';
import AuthError from './AuthError';
import {getAccessToken} from 'react-native-axios-jwt';

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
  await AsyncStorage.setItem('current_uid', uid);
  return uid;
};

export const getCurrentUid = async (): Promise<string | undefined> => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const payload = jwtDecode<JwtPayload>(accessToken);
    return payload.sub;
  }
};

// const validateJwtAccessToken = async (token: string) => {
//   const alg = 'RS256';
//   const jwk = await getJwk();
//   if (jwk === null) {
//     throw new AuthError('Could not download public key');
//   }
//   try {
//     const publicKey = await jose.importJWK(jwk, alg);
//     const {payload, protectedHeader} = await jose.jwtVerify(token, publicKey);
//     console.log('Decoded token payload:' + payload);
//     console.log('Decoded token protectedHeader:' + protectedHeader);
//   } catch (error) {
//     console.log(error);
//     throw new AuthError('Invalid access token');
//   }
// };
