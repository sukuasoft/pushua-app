import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { SubscriptionsScreen } from '../screens/SubscriptionsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {...styles.tabBar, height: styles.tabBar.height + insets.bottom },
        tabBarActiveTintColor: Colors.black,
        tabBarActiveBackgroundColor: Colors.primary,
        tabBarItemStyle: styles.tabBarItem,
        tabBarInactiveTintColor: Colors.darkGray,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons 
              name="home" 
              size={28} 
              color={color}
              style={focused && styles.iconFocused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Subscriptions"
        component={SubscriptionsScreen}
        options={{
          tabBarLabel: 'Subscrições',
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons 
              name="list-alt" 
              size={28} 
              color={color}
              style={focused && styles.iconFocused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notificações',
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons 
              name="notifications" 
              size={28} 
              color={color}
              style={focused && styles.iconFocused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons 
              name="account-circle" 
              size={28} 
              color={color}
              style={focused && styles.iconFocused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    borderTopColor: Colors.black,
    height: 60,
  },
  tabBarItem: {
    height: 60,
  },
  tabLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '900',
  },
  iconFocused: {
    transform: [{ scale: 1.2 }],
  },
});
