import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ErrorStateProps {
  colors: {
    background: string;
    border: string;
    tint: string;
    text: string;
    textSecondary: string;
    error: string;
  };
  t: any;
  error: string;
  onRefresh: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  colors,
  t,
  error,
  onRefresh
}) => (
  <View style={[styles.container, { backgroundColor: colors.background }]}>
    <View style={[styles.header, { borderBottomColor: colors.border, paddingTop: 60 }]}>
      <View style={styles.headerLeft}>
        <Ionicons name="chevron-back" size={24} color={colors.tint} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('notifications.title')}
        </Text>
      </View>
    </View>

    <View style={styles.errorState}>
      <Ionicons name="warning" size={64} color={colors.error} />
      <Text style={[styles.errorStateText, { color: colors.text }]}>
        {t('notifications.syncStates.error') || 'Erreur'}
      </Text>
      <Text style={[styles.errorStateSubtext, { color: colors.textSecondary }]}>
        {error}
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
  </View>
);

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
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
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '700',
    marginLeft: 12,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  errorStateSubtext: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
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