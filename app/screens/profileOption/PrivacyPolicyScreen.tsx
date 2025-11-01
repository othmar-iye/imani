// screens/PrivacyPolicyScreen.tsx
import { AppConfig } from '@/constants/app';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

export default function PrivacyPolicyScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={colors.tint} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('privacyTitle')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.content, { backgroundColor: colors.card }]}>
          <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
            {t('lastUpdated')}
          </Text>

          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('privacyIntro', { appName: AppConfig.name })}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            1. {t('infoCollectionTitle')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('infoCollectionText', { appName: AppConfig.name })}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            2. {t('infoUsageTitle')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('infoUsageText1')}
            {"\n"}• {t('infoUsageItem1')}
            {"\n"}• {t('infoUsageItem2')}
            {"\n"}• {t('infoUsageItem3')}
            {"\n"}• {t('infoUsageItem4')}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            3. {t('infoSharingTitle')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('infoSharingText')}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            4. {t('dataProtectionTitle')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('dataProtectionText')}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            5. {t('yourRightsTitle')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('yourRightsText')}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            6. {t('cookiesTitle')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('cookiesText')}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            7. {t('dataRetentionTitle')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('dataRetentionText')}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            8. {t('policyChangesTitle')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('policyChangesText')}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            9. {t('contactPrivacyTitle')}
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            {t('contactPrivacyText1')}
            {"\n\n"}{t('email')} : privacy@imani.com
            {"\n"}{t('website')} : www.imani.com
          </Text>

          <Text style={[styles.footer, { color: colors.textSecondary }]}>
            {t('privacyFooter', { appName: AppConfig.name })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    margin: 20,
    padding: 24,
    borderRadius: 12,
  },
  lastUpdated: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
    lineHeight: 24,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'justify',
  },
  footer: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 30,
    textAlign: 'center',
    lineHeight: 20,
  },
});