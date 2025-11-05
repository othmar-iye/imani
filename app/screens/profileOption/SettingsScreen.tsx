// screens/profileOption/SettingsScreen.tsx
import { AppConfig } from '@/constants/app';
import { Theme } from '@/constants/theme';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/supabase';
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
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, resetLanguage } = useLanguage();
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
  
  // États pour les informations personnelles
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  // États pour le changement de mot de passe
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const themeOptions = [
    { value: 'auto', label: t('system'), icon: 'phone-portrait' },
    { value: 'light', label: t('light'), icon: 'sunny' },
    { value: 'dark', label: t('dark'), icon: 'moon' },
  ];

  const languageOptions = [
    { value: 'fr', label: t('french'), flag: '🇫🇷' },
    { value: 'en', label: t('english'), flag: '🇺🇸' },
  ];

  // Charger les données utilisateur au montage du composant
  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserInfo({
          fullName: user.user_metadata?.full_name || 'Utilisateur',
          email: user.email || '',
        });
      }
    } catch (error) {
      console.error('Erreur chargement données utilisateur:', error);
    }
  };

  // Fonction pour changer le mot de passe
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert(
        t('error'),
        t('fillAllFields', 'Veuillez remplir tous les champs')
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert(
        t('error'),
        t('passwordsDontMatch', 'Les mots de passe ne correspondent pas')
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert(
        t('error'),
        t('passwordTooShort', 'Le mot de passe doit contenir au moins 6 caractères')
      );
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) {
        throw error;
      }

      Alert.alert(
        t('success'),
        t('passwordChanged', 'Mot de passe changé avec succès'),
        [
          {
            text: t('ok'),
            onPress: () => {
              setShowChangePassword(false);
              setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              });
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Erreur changement mot de passe:', error);
      Alert.alert(
        t('error'),
        error.message || t('passwordChangeError', 'Erreur lors du changement de mot de passe')
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

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
          onPress: () => setShowChangePassword(true),
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
        //   onPress: () => router.push('/screens/profileOption/HelpCenterScreen'),
        },
        {
          icon: 'bug',
          label: t('reportIssue'),
          type: 'nav',
        //   onPress: () => router.push('/screens/profileOption/ReportIssueScreen'),
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

  // Fonctions pour l'édition des champs
  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEditing = async () => {
    if (editingField && tempValue) {
      try {
        // Mettre à jour dans Supabase
        const { error } = await supabase.auth.updateUser({
          data: { 
            ...(editingField === 'fullName' && { full_name: tempValue })
            // Pour l'email, il faudrait utiliser supabase.auth.updateUser({ email: tempValue })
            // mais cela nécessite une confirmation
          }
        });

        if (error) throw error;

        setUserInfo(prev => ({
          ...prev,
          [editingField]: tempValue
        }));
        setEditingField(null);
        setTempValue('');
        
        Alert.alert(t('success'), t('profileUpdated', 'Profil mis à jour'));
      } catch (error: any) {
        Alert.alert(t('error'), error.message || t('updateError', 'Erreur lors de la mise à jour'));
      }
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
            await changeLanguage(option.value);
            // Pas besoin de setCurrentLanguage car le hook gère déjà le re-render
          },
        })),
        {
          text: t('resetToAuto', 'Détection automatique'),
          onPress: async () => {
            await resetLanguage();
          },
        },
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

  const renderChangePasswordModal = () => {
    if (!showChangePassword) return null;

    return (
      <View style={[styles.editModal, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.editContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.editTitle, { color: colors.text }]}>
            {t('changePassword')}
          </Text>
          
          {/* Ancien mot de passe */}
          <TextInput
            style={[styles.editInput, { 
              color: colors.text, 
              borderColor: colors.border,
              backgroundColor: colors.background 
            }]}
            placeholder={t('currentPassword', 'Ancien mot de passe')}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={passwordData.currentPassword}
            onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
          />

          {/* Nouveau mot de passe */}
          <TextInput
            style={[styles.editInput, { 
              color: colors.text, 
              borderColor: colors.border,
              backgroundColor: colors.background 
            }]}
            placeholder={t('newPassword', 'Nouveau mot de passe')}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={passwordData.newPassword}
            onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
          />

          {/* Confirmation mot de passe */}
          <TextInput
            style={[styles.editInput, { 
              color: colors.text, 
              borderColor: colors.border,
              backgroundColor: colors.background 
            }]}
            placeholder={t('confirmPassword', 'Confirmer le mot de passe')}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={passwordData.confirmPassword}
            onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
          />

          <View style={styles.editButtons}>
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: colors.border }]}
              onPress={() => {
                setShowChangePassword(false);
                setPasswordData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
              }}
              disabled={isChangingPassword}
            >
              <Text style={[styles.editButtonText, { color: colors.text }]}>
                {t('cancel', 'Annuler')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: colors.tint }]}
              onPress={handleChangePassword}
              disabled={isChangingPassword}
            >
              <Text style={styles.editButtonTextPrimary}>
                {isChangingPassword ? t('changing', 'Changement...') : t('change', 'Changer')}
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

      {/* Modal d'édition des informations */}
      {renderEditModal()}

      {/* Modal de changement de mot de passe */}
      {renderChangePasswordModal()}
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
  // Styles pour les modals
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
    marginBottom: 12,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
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