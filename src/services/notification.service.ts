import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://localhost:3000'; // Change this to your API URL

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

export const notificationService = {
  async send(data: SendNotificationData): Promise<NotificationResponse> {
    const apiKey = await SecureStore.getItemAsync('apiKey');
    
    const response = await axios.post<NotificationResponse>(
      `${API_URL}/notifications/send`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey || '',
        },
      }
    );
    return response.data;
  },
};
