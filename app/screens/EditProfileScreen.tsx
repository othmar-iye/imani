// screens/EditProfileScreen.tsx
import { Theme } from '@/constants/theme';
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
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export default function EditProfileScreen() {
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

  const profileSections = [
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
          {(item.type === 'input' || item.type === 'nav') && (
            <View style={styles.selectValue}>
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
          {t('editProfileTitle', 'Modifier le profil')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sections du profil */}
        {profileSections.map((section, sectionIndex) => (
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