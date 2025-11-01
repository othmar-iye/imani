// app/(tabs)/_layout.tsx
import { HapticTab } from '@/components/haptic-tab';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';

// Hook simulé - À remplacer par votre logique backend
function useUnreadMessagesCount() {
  // Simulation données backend
  const [unreadCount, setUnreadCount] = React.useState(3);
  
  // En production, utiliser :
  // const { data } = useQuery('unread-messages', fetchUnreadCount);
  // const unreadCount = data?.count || 0;
  
  React.useEffect(() => {
    // Simulation mise à jour en temps réel
    const interval = setInterval(() => {
      setUnreadCount(prev => Math.max(0, prev + (Math.random() > 0.7 ? 1 : 0)));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  return unreadCount;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const unreadCount = useUnreadMessagesCount();

  const currentTheme = colorScheme === 'dark' ? Theme.dark : Theme.light;

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: currentTheme.tint,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarButton: HapticTab,
        lazy: false,
        tabBarStyle: {
          backgroundColor: currentTheme.background,
          borderTopColor: currentTheme.card,
          borderTopWidth: 1,
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
          tabBarBadge: unreadCount > 0 ? (unreadCount > 99 ? '99+' : unreadCount) : undefined,
          tabBarBadgeStyle: {
            backgroundColor: currentTheme.tint,
            color: currentTheme.background,
            fontSize: 10,
            fontWeight: 'bold',
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            lineHeight: 16,
          },
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