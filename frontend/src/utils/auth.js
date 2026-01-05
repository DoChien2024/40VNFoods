
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USERNAME_KEY = 'username';

// Get tokens from localStorage
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const getUsername = () => localStorage.getItem(USERNAME_KEY);

// Save tokens to localStorage
export const setTokens = (accessToken, refreshToken, username) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (username) localStorage.setItem(USERNAME_KEY, username);
};

// Clear all tokens
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem('token'); // Clear old token if exists
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!getAccessToken();
};

// Refresh access token
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/refresh`, {
      refresh_token: refreshToken
    });

    if (response.data.success) {
      const newAccessToken = response.data.access_token;
      localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
      return newAccessToken;
    }
    throw new Error('Failed to refresh token');
  } catch (error) {
    clearTokens();
    throw error;
  }
};

// Create axios instance with auto-refresh
export const createAuthAxios = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL
  });

  // Request interceptor to add token
  instance.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor 
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Export a default instance
export const authAxios = createAuthAxios();

// Auth API functions
export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    username,
    password
  });
  
  if (response.data.success) {
    setTokens(
      response.data.access_token,
      response.data.refresh_token,
      response.data.username
    );
  }
  
  return response.data;
};

export const register = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/register`, {
    username,
    password
  });
  
  return response.data;
};

export const logout = () => {
  clearTokens();
  window.location.href = '/';
};

export const verifyToken = async () => {
  try {
    const response = await authAxios.get('/verify');
    return response.data.success;
  } catch (error) {
    return false;
  }
};

// Save prediction history
export const saveHistory = async (foodName, confidence, extra = {}) => {
  if (!isAuthenticated()) {
    return { success: false, reason: 'not_logged_in' };
  }

  try {
    const response = await authAxios.post('/history', {
      food_name: foodName,
      confidence: confidence,
      extra: {
        ...extra,
        timestamp: new Date().toISOString(),
        language: extra.language || 'VN'
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.warn('Failed to save history:', error.message);
    return { success: false, reason: 'api_error', error };
  }
};
