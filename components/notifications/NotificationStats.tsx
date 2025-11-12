import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface NotificationStatsProps {
  notifications: any[];
  unreadCount: number;
  colors: {
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    tint: string;
  };
  t: any;
}

export const NotificationStats: React.FC<NotificationStatsProps> = ({
  notifications,
  unreadCount,
  colors,
  t
}) => (
  <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
    <View style={styles.statItem}>
      <Text style={[styles.statNumber, { color: colors.text }]}>
        {notifications.length}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {t('notifications.total') || 'Total'}
      </Text>
    </View>
    <View style={[styles.statSeparator, { backgroundColor: colors.border }]} />
    <View style={styles.statItem}>
      <Text style={[styles.statNumber, { color: colors.tint }]}>
        {unreadCount}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {t('notifications.unread') || 'Non lues'}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statSeparator: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});