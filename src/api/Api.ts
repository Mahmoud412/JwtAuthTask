import axios from 'axios';
import {
  TokenRefreshRequest,
  applyAuthTokenInterceptor,
  clearAuthTokens,
  getAccessToken,
  isLoggedIn,
  setAuthTokens,
} from 'react-native-axios-jwt';

const BASE_URL = 'https://usnc.dev-webdevep.ru/auth-back/api/v2';
const NOTIFICATIONS_BASE_URL = 'https://usnc.dev-webdevep.ru/noty/api';

export const api = axios.create({
  baseURL: BASE_URL,
});

export const notificationsApi = axios.create({
  baseURL: NOTIFICATIONS_BASE_URL,
});

// api.interceptors.request.use(request => {
//   console.log('Request', JSON.stringify(request, null, 2));
//   return request;
// });

// notificationsApi.interceptors.request.use(request => {
//   console.log('Request', JSON.stringify(request, null, 2));
//   return request;
// });

// notificationsApi.interceptors.response.use(response => {
//   console.log('Response', JSON.stringify(response, null, 2));
//   return response;
// });

const requestRefresh: TokenRefreshRequest = async (
  refreshToken: string,
): Promise<string> => {
  const response = await axios.post(`${BASE_URL}/regenerateTokens`, {
    refreshToken: refreshToken,
  });
  return response.data.accessToken;
};

applyAuthTokenInterceptor(api, {requestRefresh});

export const setTokens = async (accessToken: string, refreshToken: string) => {
  await setAuthTokens({
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

export const clearTokens = clearAuthTokens;

export const hasTokens = isLoggedIn;
