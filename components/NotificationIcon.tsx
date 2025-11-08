// components/NotificationIcon.tsx
import { useNotifications } from '@/hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NotificationIconProps {
  color?: string;
  size?: number;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ 
  color = '#000', 
  size = 24 
}) => {
  const { unreadCount } = useNotifications();
  
  // Logique d'affichage du badge
  const showBadge = unreadCount > 0;
  const showNumber = unreadCount > 4; // Chiffre seulement si +4 notifications
  const badgeText = unreadCount > 99 ? '99+' : unreadCount.toString();

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
        
        {showBadge && (
          <View 
            style={[
              styles.badge,
              showNumber ? styles.badgeWithNumber : styles.badgeDot,
            ]}
          >
            {showNumber && (
              <Text style={styles.badgeText}>
                {badgeText}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  badgeWithNumber: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});