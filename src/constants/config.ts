const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const config = {
  api: {
    baseURL: API_URL,
  },
};

export default config;
