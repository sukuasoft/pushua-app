import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import { notificationService, NotificationItem } from '../services/notification.service';
import * as SecureStore from 'expo-secure-store';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notification, setNotification] = useState<Notifications.Notification>();
  const [notificationHistory, setNotificationHistory] = useState<NotificationItem[]>([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [notificationPage, setNotificationPage] = useState(1);
  const [notificationTotal, setNotificationTotal] = useState(0);
  const notificationListener = useRef<Notifications.Subscription>(null);
  const responseListener = useRef<Notifications.Subscription>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        // Register device with API when token is obtained
        registerDeviceWithAPI(token);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response:', response);
    });

    return () => {
      // API changed: subscriptions now expose remove()
      notificationListener.current?.remove?.();
      responseListener.current?.remove?.();
    };
  }, []);

  // Function to manually re-register device (useful after login)
  const registerDevice = async () => {
    if (expoPushToken) {
      await registerDeviceWithAPI(expoPushToken);
    }
  };

  const fetchNotifications = async (page: number = 1) => {
    setNotificationLoading(true);
    setNotificationError(null);
    try {
      const response = await notificationService.listNotifications(page, 50);
      setNotificationHistory(response.data);
      setNotificationPage(page);
      setNotificationTotal(response.pagination.total);
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
      setNotificationError(error.response?.data?.message || 'Falha ao carregar notificações');
    } finally {
      setNotificationLoading(false);
    }
  };

  return {
    expoPushToken,
    notification,
    registerDevice,
    fetchNotifications,
    notificationHistory,
    notificationLoading,
    notificationError,
    notificationPage,
    notificationTotal,
  };
}

async function registerDeviceWithAPI(token: string) {
  try {
    // Only register if user is authenticated
    const authToken = await SecureStore.getItemAsync('token');
    if (authToken) {
      console.log('Registering device with API...');
      const response = await notificationService.registerDevice(token);
      console.log('Device registered successfully:', response.id);
    }
  } catch (error) {
    console.error('Failed to register device with API:', error);
    // Don't throw error, just log it - app should continue working
  }
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#24FE9C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.warn('Must use physical device for Push Notifications');
  }

  return token;
}
