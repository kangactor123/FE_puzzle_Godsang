import qs from 'qs';
import axios, { AxiosRequestConfig } from 'axios';
import { getAccessToken, logout, setAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const initialConfig: AxiosRequestConfig = Object.freeze({
  baseURL: API_BASE_URL,
  timeout: 0,
  paramsSerializer: {
    serialize: paramsSerializer,
  },
});

export const api = createApiInstance(getAccessToken({ bearer: true }));

api.interceptors.response.use(
  (result) => result,
  async (error) => {
    if (error === undefined) throw error;
    if (error.response?.status === 401 && !error.request?.responseURL?.endsWith('/api/user/login')) {
      try {
        const token = await useRefresh();
        const retryConfig = {
          ...error.config,
          headers: { ...error.config.headers, Authorization: `Bearer ${token}` },
        };
        return api(retryConfig);
      } catch (error) {
        logout();
        return;
      }
    } else if (error.response?.status === 401 && error.response?.status === 400) {
      logout();
      return;
    } else if (error) {
      const e = { ...error.response?.data, status: error.response?.status };
      throw e;
    }

    throw error;
  },
);

function createApiInstance(bearerJwt = '', options: AxiosRequestConfig = {}) {
  const api = axios.create({
    ...initialConfig,
    ...options,
  });
  api.defaults.headers.common['Authorization'] = bearerJwt;
  return api;
}

async function useRefresh(): Promise<string> {
  const refreshApi = createApiInstance();
  try {
    const { data } = await refreshApi({
      url: '/user/refresh-token',
      method: 'post',
    });
    return data.accessToken;
  } catch (error) {
    logout();
    throw error;
  }
}

function paramsSerializer(params: unknown): string {
  return qs.stringify(params);
}

function setApiJwt(token: string): void {
  const bearerToken = `Bearer ${token}`;
  setAccessToken(token);
  api.defaults.headers.common.Authorization = bearerToken;
}

export { API_BASE_URL, setApiJwt };
export default api;
