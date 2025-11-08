// components/NotificationIcon.tsx
import { useNotifications } from '@/hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface NotificationIconProps {
  color?: string;
  size?: number;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ 
  color = '#000', 
  size = 24 
}) => {
  const { unreadCount, refresh } = useNotifications();
  
  // ✅ FORCER LE RE-REFRESH QUAND L'ÉCRAN EST AFFICHÉ
  useFocusEffect(
    React.useCallback(() => {
      // Recharge les notifications quand on revient sur la Home
      refresh();
    }, [refresh])
  );
  
  const hasUnreadNotifications = unreadCount > 0;
  
  const handlePress = () => {
    router.push('/screens/homeOption/NotificationsScreen');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name="notifications-outline" 
          size={size} 
          color={color} 
        />
        
        {hasUnreadNotifications && (
          <View style={styles.notificationDot} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    position: 'relative',
  },
  iconContainer: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});