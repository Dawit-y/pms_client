import axios from 'axios';

import store from '../store';
import { setAuthData, clearAuthData } from '../store/auth/authSlice';

const NODE_ENV = import.meta.env.VITE_NODE_ENV;
const API_URL =
  NODE_ENV === 'development' ? '/api/v1' : import.meta.env.VITE_API_URL;

const axiosApi = axios.create({ baseURL: API_URL, withCredentials: true });

let logoutInProgress = false;

const redirectToLogin = () => {
  window.location.href = '/login';
};

const logout = () => {
  logoutInProgress = true;
  store.dispatch(clearAuthData());
  if (window.location.pathname !== '/login') {
    window.location.replace('/login'); // more immediate and doesn't add to history
  }
};

export const setLogoutInProgress = (value) => {
  logoutInProgress = value;
};

let refreshTokenPromise = null;

// Function to refresh access token
export const refreshAccessToken = async () => {
  if (logoutInProgress) {
    return Promise.reject(new Error('Logout in progress'));
  }

  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      const response = await post(`/refresh/`, null, {
        withCredentials: true,
      });

      store.dispatch(
        setAuthData({
          accessToken: response.access,
          userData: response.user,
          permissions: response.permissions,
        })
      );
      return response;
    } catch (error) {
      logout();
      throw error;
    } finally {
      refreshTokenPromise = null;
    }
  })();

  return refreshTokenPromise;
};

// Attach Authorization Header in Requests
axiosApi.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state?.auth?.accessToken;

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const requestUrl = originalRequest.url || '';

    if (logoutInProgress) {
      return Promise.reject(error);
    }

    // Prevent infinite loop by NOT retrying refresh request
    const isRefreshRequest = requestUrl.includes('refresh');
    if (isRefreshRequest) {
      // Only clear auth and redirect if the refresh request failed
      if (error.response?.status === 401) {
        store.dispatch(clearAuthData());
        if (window.location.pathname !== '/login') redirectToLogin();
      }
      return Promise.reject(error);
    }

    // Retry logic for other 401s (not refresh and not already retried)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken();
        const state = store.getState();
        originalRequest.headers['Authorization'] =
          `Bearer ${state.auth.accessToken}`;

        return axiosApi(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export async function get(url, config = {}) {
  return axiosApi
    .get(url, { ...config, withCredentials: true })
    .then((response) => response?.data);
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config, withCredentials: true })
    .then((response) => response?.data);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config, withCredentials: true })
    .then((response) => response?.data);
}

export async function patch(url, data, config = {}) {
  return axiosApi
    .patch(url, { ...data }, { ...config, withCredentials: true })
    .then((response) => response?.data);
}

export async function del(url, config = {}) {
  return axiosApi
    .delete(url, { ...config, withCredentials: true })
    .then((response) => response?.data);
}
