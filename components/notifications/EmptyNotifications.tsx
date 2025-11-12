import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EmptyNotificationsProps {
  colors: {
    textSecondary: string;
    tint: string;
  };
  t: any;
  onRefresh: () => void;
}

export const EmptyNotifications: React.FC<EmptyNotificationsProps> = ({
  colors,
  t,
  onRefresh
}) => (
  <View style={styles.emptyState}>
    <Ionicons name="notifications-off" size={64} color={colors.textSecondary} />
    <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
      {t('notifications.emptyTitle') || 'Aucune notification'}
    </Text>
    <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
      {t('notifications.emptySubtitle') || 'Vous n\'avez aucune notification pour le moment'}
    </Text>
    <TouchableOpacity 
      style={[styles.retryButton, { backgroundColor: colors.tint }]}
      onPress={onRefresh}
    >
      <Text style={styles.retryButtonText}>
        {t('retry') || 'Réessayer'}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});