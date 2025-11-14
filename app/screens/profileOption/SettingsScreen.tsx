// screens/profileOption/SettingsScreen.tsx
import { AppConfig } from '@/constants/app';
import { Theme } from '@/constants/theme';
import { useLanguage } from '@/hooks/useLanguage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
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

  // États pour les paramètres
  const [themeMode, setThemeMode] = useState<'auto' | 'light' | 'dark'>('auto');
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const themeOptions = [
    { value: 'auto', label: t('system'), icon: 'phone-portrait' },
    { value: 'light', label: t('light'), icon: 'sunny' },
    { value: 'dark', label: t('dark'), icon: 'moon' },
  ];

  const languageOptions = [
    { value: 'fr', label: t('french'), flag: '🇫🇷' },
    { value: 'en', label: t('english'), flag: '🇺🇸' },
  ];

  const settingsSections = [
    {
      title: t('appearance'),
      items: [
        {
          icon: 'contrast',
          label: t('theme'),
          type: 'select',
          value: themeMode,
          options: themeOptions,
          onPress: () => showThemeSelector(),
        },
      ],
    },
    {
      title: t('languageRegion'),
      items: [
        {
          icon: 'language',
          label: t('language'),
          type: 'select',
          value: currentLanguage,
          options: languageOptions,
          onPress: () => showLanguageSelector(),
        },
      ],
    },
    {
      title: t('notificationsName'),
      items: [
        {
          icon: 'notifications',
          label: t('pushNotifications'),
          type: 'toggle',
          value: notifications,
          onToggle: setNotifications,
        },
      ],
    },
    {
      title: t('privacy'),
      items: [
        {
          icon: 'trash',
          label: t('deleteHistory'),
          type: 'nav',
          onPress: () => showDeleteConfirmation(),
        },
        {
          icon: 'download',
          label: t('downloadData'),
          type: 'nav',
          onPress: () => handleDownloadData(),
        },
      ],
    },
    {
      title: t('support'),
      items: [
        {
          icon: 'help-circle',
          label: t('helpCenter'),
          type: 'nav',
          // onPress: () => router.push('/screens/profileOption/HelpCenterScreen'),
        },
        {
          icon: 'bug',
          label: t('reportIssue'),
          type: 'nav',
          // onPress: () => router.push('/screens/profileOption/ReportIssueScreen'),
        },
        {
          icon: 'star',
          label: t('rateApp'),
          type: 'nav',
          onPress: () => handleRateApp(),
        },
      ],
    },
  ];

  const showThemeSelector = () => {
    Alert.alert(
      t('chooseTheme'),
      t('selectTheme'),
      [
        ...themeOptions.map(option => ({
          text: option.label,
          onPress: () => setThemeMode(option.value as any),
        })),
        { text: t('cancel'), style: 'cancel' }
      ]
    );
  };

  const showLanguageSelector = () => {
    Alert.alert(
      t('chooseLanguage'),
      t('selectLanguage'),
      [
        ...languageOptions.map(option => ({
          text: `${option.flag} ${option.label}`,
          onPress: async () => {
            await changeLanguage(option.value);
          },
        })),
        { text: t('cancel'), style: 'cancel' }
      ]
    );
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      t('deleteHistoryTitle'),
      t('deleteHistoryMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), style: 'destructive', onPress: () => handleDeleteHistory() },
      ]
    );
  };

  const handleDeleteHistory = () => {
    // Ici on pourrait vider le cache React Query, AsyncStorage, etc.
    Alert.alert(
      t('success'),
      t('historyDeleted', 'Historique supprimé avec succès')
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      t('downloadData'),
      t('downloadDataMessage', 'Cette fonctionnalité sera disponible prochainement'),
      [{ text: t('ok') }]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      t('rateApp'),
      t('rateAppMessage', 'Merci de noter notre application sur le store'),
      [{ text: t('ok') }]
    );
  };

  const renderSettingItem = (item: any, index: number, isLast: boolean) => {
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.settingItem,
          { 
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            borderBottomWidth: isLast ? 0 : 1,
          }
        ]}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.settingLeft}>
          <Ionicons 
            name={item.icon as any} 
            size={20} 
            color={colors.tint} 
          />
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            {item.label}
          </Text>
        </View>

        <View style={styles.settingRight}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor="#FFFFFF"
            />
          )}
          
          {(item.type === 'select' || item.type === 'nav') && (
            <View style={styles.selectValue}>
              {item.type === 'select' && (
                <Text style={[styles.selectText, { color: colors.textSecondary }]}>
                  {item.options.find((opt: any) => opt.value === item.value)?.label}
                </Text>
              )}
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
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
          {t('settings')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sections de paramètres */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            
            <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
              {section.items.map((item, itemIndex) => 
                renderSettingItem(item, itemIndex, itemIndex === section.items.length - 1)
              )}
            </View>
          </View>
        ))}

        {/* Version */}
        <View style={styles.versionSection}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            {AppConfig.name} {t('version')} 1.0.0
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
    paddingBottom: 20,
    marginTop: 25,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 56,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  versionSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
    paddingBottom: 50,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '500',
  },
});