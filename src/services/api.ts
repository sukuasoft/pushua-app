import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { config } from '../constants/config';

export interface MetaPagination {
  page: number;
  perPage: number;
  currentPage: number;
  total: number;
  lastPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const api = axios.create({
  baseURL: config.api.baseURL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    const xAPiKey = await SecureStore.getItemAsync('apiKey');
    if (xAPiKey) {
      config.headers['x-api-key'] = xAPiKey;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('apiKey');
    }
    return Promise.reject(error);
  }
);

export default api;
