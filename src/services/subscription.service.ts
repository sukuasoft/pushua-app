import api from './api';

export interface Subscription {
  id: string;
  userId: string;
  topicName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionData {
  topicName: string;
}

export const subscriptionService = {
  async create(data: CreateSubscriptionData): Promise<Subscription> {
    const response = await api.post<Subscription>('/subscriptions', data);
    return response.data;
  },

  async getAll(): Promise<Subscription[]> {
    const response = await api.get<Subscription[]>('/subscriptions');
    return response.data;
  },

  async getByTopic(topicName: string): Promise<Subscription[]> {
    const response = await api.get<Subscription[]>(`/subscriptions?topicName=${topicName}`);
    return response.data;
  },


  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/subscriptions/${id}`);
    return response.data;
  },
};
