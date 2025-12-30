const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://pushua-api.vercel.app';

export const config = {
  api: {
    baseURL: API_URL,
  },
};

export default config;
