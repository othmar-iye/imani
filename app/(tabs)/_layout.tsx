// app/(tabs)/_layout.tsx
import { HapticTab } from '@/components/haptic-tab';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  // Choisir le thème dynamiquement
  const currentTheme = colorScheme === 'dark' ? Theme.dark : Theme.light;

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: currentTheme.tint,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarButton: HapticTab,
        lazy: false, // ← Garde tous les onglets en mémoire
        tabBarStyle: {
          backgroundColor: currentTheme.background,
          borderTopColor: currentTheme.card,
        },
      }}>
      
      <Tabs.Screen
        name="home"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favoris"
        options={{
          title: t('tabs.favorites'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: t('tabs.sell'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: t('tabs.chat'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'chatbubble' : 'chatbubble-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}