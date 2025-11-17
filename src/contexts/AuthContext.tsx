import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '../services/auth.service';
import * as SecureStore from 'expo-secure-store';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, domain: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedUser = await authService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
        // Store API key separately for easier access
        await SecureStore.setItemAsync('apiKey', storedUser.apiKey);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      await SecureStore.setItemAsync('apiKey', response.user.apiKey);
    } catch (error) {
      throw error;
    }
  }

  async function signUp(email: string, password: string, domain: string) {
    try {
      const response = await authService.register({ email, password, domain });
      setUser(response.user);
      await SecureStore.setItemAsync('apiKey', response.user.apiKey);
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    await authService.logout();
    await SecureStore.deleteItemAsync('apiKey');
    setUser(null);
  }

  async function refreshUser() {
    try {
      const updatedUser = await authService.getMe();
      setUser(updatedUser);
      await SecureStore.setItemAsync('apiKey', updatedUser.apiKey);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
