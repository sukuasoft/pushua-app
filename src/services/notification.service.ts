import api, { MetaPagination } from './api';

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

export interface SendNotificationData {
  domain: string;
  topicName: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
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

export interface ListNotificationsResponse {
  data: NotificationItem[];
  meta: MetaPagination;
}

export const notificationService = {
  async send(data: SendNotificationData): Promise<NotificationItem> {
    const { data: response } = await api.post('/notifications/send', data);
    return response.data;
  },

  async registerDevice(deviceToken: string): Promise<RegisterDeviceResponse> {
    const { data: response } = await api.post('/subscriptions/devices', {
      deviceToken,
    });

    return response.data;
  },

  async listNotifications(
    page: number = 1,
    perPage: number = 50
  ): Promise<ListNotificationsResponse> {
    const { data } = await api.get<ListNotificationsResponse>('/notifications', {
      params: {
        page,
        perPage,
      },
    });
    return data;
  },
};
