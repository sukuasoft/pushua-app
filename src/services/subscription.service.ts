import api, { MetaPagination } from './api';

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

export interface ListSubscriptionsResponse {
  data: Subscription[];
  meta: MetaPagination;
}

export const subscriptionService = {
  async create(data: CreateSubscriptionData): Promise<Subscription> {
    const { data: response } = await api.post('/subscriptions', data);
    return response.data;
  },

  async getAll(page: number = 1, perPage: number = 20): Promise<ListSubscriptionsResponse> {
    const { data } = await api.get<ListSubscriptionsResponse>('/subscriptions', {
      params: { page, perPage },
    });
    return data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/subscriptions/${id}`);
    return data;
  },
};
