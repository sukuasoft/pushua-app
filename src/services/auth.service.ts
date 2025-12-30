import api from './api';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  email: string;
  domain: string;
  apiKey: string;
}

export interface LoginResponse {
  access_token: string;
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

export const authService = {
  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/users/register', data);
    await SecureStore.setItemAsync('token', response.data.access_token);
    return response.data;
  },

  async login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/users/login', data);
    await SecureStore.setItemAsync('token', response.data.access_token);
    return response.data;
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('token');
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync('token');
    return !!token;
  },
};
