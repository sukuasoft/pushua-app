import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet, ImageBackground } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppNavigator } from './navigation/AppNavigator';
import { AuthNavigator } from './navigation/AuthNavigator';
import { Colors } from './constants/theme';
import { useNotifications } from './hooks/useNotifications';

function AppContent() {
  const { user, loading } = useAuth();
  const { expoPushToken, registerDevice } = useNotifications();

  // Register device when user logs in and token is available
  useEffect(() => {
    if (user && expoPushToken) {
      console.log('User authenticated, registering device...');
      registerDevice();
    }
  }, [user, expoPushToken]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ImageBackground style={styles.icon} source={require('../assets/pushua-white.png')} />

        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <AuthProvider>
          <AppContent />
          <StatusBar style="light" />
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 160,
    height: 30,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    gap: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
});
