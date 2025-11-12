import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SyncBannerProps {
  onSync: () => void;
  onIgnore: () => void;
  colors: {
    warning: string;
  };
  t: any;
}

export const SyncBanner: React.FC<SyncBannerProps> = ({
  onSync,
  onIgnore,
  colors,
  t
}) => (
  <View style={[styles.syncBanner, { backgroundColor: colors.warning }]}>
    <Ionicons name="sync" size={16} color="#FFF" />
    <Text style={styles.syncBannerText}>
      {t('notifications.syncBanner.title')}
    </Text>
    <View style={styles.syncButtons}>
      <TouchableOpacity onPress={onSync} style={styles.syncButton}>
        <Text style={styles.syncButtonText}>
          {t('notifications.syncBanner.syncButton')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onIgnore} style={styles.ignoreButton}>
        <Text style={styles.ignoreButtonText}>
          {t('notifications.syncBanner.ignoreButton')}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
  },
  syncBannerText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  syncButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    marginLeft: 8,
  },
  ignoreButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    marginLeft: 8,
  },
  syncButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ignoreButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
});