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

export interface NotificationItem {
  id: string;
  userId: string;
  domain: string;
  topicName: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  successCount: number;
  failureCount: number;
  totalTokens: number;
  createdAt: string;
}

export interface ListNotificationsResponse {
  data: NotificationItem[];
  pagination: {
    total: number;
    perPage: number;
    page: number;
  };
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

  async listNotifications(page: number = 1, perPage: number = 50): Promise<ListNotificationsResponse> {
    const response = await api.get<ListNotificationsResponse>(
      '/notifications',
      {
        params: {
          page,
          perPage,
        },
      }
    );
    return response.data;
  },
};
