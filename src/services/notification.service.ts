import * as SecureStore from 'expo-secure-store';
import api from './api';

export interface SendNotificationData {
  domain: string;
  topicName: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

export interface NotificationResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface RegisterDeviceData {
  deviceToken: string;
}

export interface RegisterDeviceResponse {
  id: string;
  deviceToken: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const notificationService = {
  async send(data: SendNotificationData): Promise<NotificationResponse> {
    
    const response = await api.post<NotificationResponse>(
      '/notifications/send',
      data
    );
    return response.data;
  },

  async registerDevice(deviceToken: string): Promise<RegisterDeviceResponse> {
    const response = await api.post<RegisterDeviceResponse>(
      '/subscriptions/devices',
      { deviceToken }
    );
    
    // Store device ID for future reference
    await SecureStore.setItemAsync('deviceId', response.data.id);
    
    return response.data;
  },
};
