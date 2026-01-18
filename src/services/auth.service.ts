import api from './api';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  email: string;
  domain: string;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  domain: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  otp: string;
  newPassword: string;
}

export const authService = {
  async register(data: RegisterData): Promise<LoginResponse> {
    const { data: response } = await api.post('/users/register', data);
    await SecureStore.setItemAsync('token', response.data.accessToken);
    await SecureStore.setItemAsync('apiKey', response.data.user.apiKey);
    return response.data;
  },

  async login(data: LoginData): Promise<LoginResponse> {
    const { data: response } = await api.post('/users/login', data);
    await SecureStore.setItemAsync('token', response.data.accessToken);
    await SecureStore.setItemAsync('apiKey', response.data.user.apiKey);

    return response.data;
  },

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const { data: response } = await api.post('/users/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const { data: response } = await api.post('/users/reset-password', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('apiKey');
  },

  async getMe(): Promise<User> {
    const { data: response } = await api.get('/users/me');
    await SecureStore.setItemAsync('apiKey', response.data.apiKey);
    return response.data;
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync('token');
    return !!token;
  },
};
