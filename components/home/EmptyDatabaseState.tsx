import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyDatabaseStateProps {
  theme: any;
  getEmptyDatabaseButton: () => React.JSX.Element | null;
}

export const EmptyDatabaseState: React.FC<EmptyDatabaseStateProps> = ({
  theme,
  getEmptyDatabaseButton,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.emptyDatabaseContainer}>
      <View style={styles.emptyIllustration}>
        <Ionicons name="storefront-outline" size={120} color={theme.tabIconDefault} />
      </View>

      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        {t('home.emptyDatabase.title')}
      </Text>
      
      <Text style={[styles.emptySubtitle, { color: theme.tabIconDefault }]}>
        {t('home.emptyDatabase.subtitle')}
      </Text>

      <View style={styles.ctaContainer}>
        {getEmptyDatabaseButton()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyDatabaseContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: 'center',
  },
  emptyIllustration: {
    marginBottom: 40,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  ctaContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
});