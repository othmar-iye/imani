import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NotificationHeaderProps {
  colors: {
    border: string;
    tint: string;
    text: string;
  };
  t: any;
  unreadCount: number;
  markAllAsRead: () => void;
  selectionMode: boolean;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  colors,
  t,
  unreadCount,
  markAllAsRead,
  selectionMode
}) => (
  <View style={[
    styles.header, 
    { 
      borderBottomColor: colors.border,
      paddingTop: selectionMode ? 15 : 60
    }
  ]}>
    <View style={styles.headerLeft}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color={colors.tint} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        {t('notifications.title')}
      </Text>
    </View>
    
    {unreadCount > 0 && !selectionMode && (
      <TouchableOpacity onPress={markAllAsRead}>
        <Text style={[styles.clearAll, { color: colors.tint }]}>
          {t('notifications.lireTout') || 'Lire tout'}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '700' 
  },
  clearAll: { 
    fontSize: 16, 
    fontWeight: '500' 
  },
});