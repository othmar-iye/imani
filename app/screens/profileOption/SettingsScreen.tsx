import { AppConfig } from '@/constants/app';
import { Theme } from '@/constants/theme';
import { changeAppLanguage } from '@/src/libs/i18n';
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
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
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
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  
  // États pour les informations personnelles
  const [userInfo, setUserInfo] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

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
      title: t('personalInfo', 'Informations personnelles'),
      items: [
        {
          icon: 'person',
          label: t('fullName', 'Nom complet'),
          type: 'input',
          value: userInfo.fullName,
          onPress: () => startEditing('fullName', userInfo.fullName),
        },
        {
          icon: 'mail',
          label: t('email', 'Email'),
          type: 'input',
          value: userInfo.email,
          onPress: () => startEditing('email', userInfo.email),
        },
      ],
    },
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
      title: t('notifications'),
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
      title: t('security'),
      items: [
        {
          icon: 'lock-closed',
          label: t('changePassword'),
          type: 'nav',
          onPress: () => console.log('Changer mot de passe'),
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
          onPress: () => console.log('Télécharger données'),
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
          onPress: () => console.log('Centre aide'),
        },
        {
          icon: 'bug',
          label: t('reportIssue'),
          type: 'nav',
          onPress: () => console.log('Signaler problème'),
        },
        {
          icon: 'star',
          label: t('rateApp'),
          type: 'nav',
          onPress: () => console.log('Évaluer app'),
        },
      ],
    },
  ];

  // Fonctions pour l'édition des champs
  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEditing = () => {
    if (editingField && tempValue) {
      setUserInfo(prev => ({
        ...prev,
        [editingField]: tempValue
      }));
      setEditingField(null);
      setTempValue('');
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue('');
  };

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
            await changeAppLanguage(option.value); 
            setCurrentLanguage(option.value);
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
        { text: t('delete'), style: 'destructive', onPress: () => console.log('Historique supprimé') },
      ]
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
          
          {(item.type === 'select' || item.type === 'input' || item.type === 'nav') && (
            <View style={styles.selectValue}>
              {item.type === 'select' && (
                <Text style={[styles.selectText, { color: colors.textSecondary }]}>
                  {item.options.find((opt: any) => opt.value === item.value)?.label}
                </Text>
              )}
              {item.type === 'input' && (
                <Text style={[styles.selectText, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.value}
                </Text>
              )}
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEditModal = () => {
    if (!editingField) return null;

    const getEditTitle = () => {
      switch (editingField) {
        case 'fullName': return t('editFullName', 'Modifier le nom complet');
        case 'email': return t('editEmail', 'Modifier l\'email');
        default: return '';
      }
    };

    const getPlaceholder = () => {
      switch (editingField) {
        case 'fullName': return t('enterFullName', 'Entrez votre nom complet');
        case 'email': return t('enterEmail', 'Entrez votre email');
        default: return '';
      }
    };

    const getKeyboardType = () => {
      switch (editingField) {
        case 'email': return 'email-address';
        default: return 'default';
      }
    };

    return (
      <View style={[styles.editModal, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.editContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.editTitle, { color: colors.text }]}>
            {getEditTitle()}
          </Text>
          
          <TextInput
            style={[styles.editInput, { 
              color: colors.text, 
              borderColor: colors.border,
              backgroundColor: colors.background 
            }]}
            value={tempValue}
            onChangeText={setTempValue}
            placeholder={getPlaceholder()}
            placeholderTextColor={colors.textSecondary}
            keyboardType={getKeyboardType()}
            autoFocus
          />

          <View style={styles.editButtons}>
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: colors.border }]}
              onPress={cancelEditing}
            >
              <Text style={[styles.editButtonText, { color: colors.text }]}>
                {t('cancel', 'Annuler')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: colors.tint }]}
              onPress={saveEditing}
            >
              <Text style={styles.editButtonTextPrimary}>
                {t('save', 'Enregistrer')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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

      {/* Modal d'édition */}
      {renderEditModal()}
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
  },
  versionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  // Styles pour le modal d'édition
  editModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  editContainer: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  editButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editButtonTextPrimary: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});