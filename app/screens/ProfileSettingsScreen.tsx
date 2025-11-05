// screens/ProfileSettingsScreen.tsx
import CustomButton from '@/components/CustomButton';
import { EditFieldModal } from '@/components/EditFieldModal';
import { ImageUploader } from '@/components/ImageUploader';
import { ProfileFormItem } from '@/components/ProfileFormItem';
import { ProfileFormSection } from '@/components/ProfileFormSection';
import { ProfilePictureSection } from '@/components/ProfilePictureSection';
import { ProfileSettingsSkeleton } from '@/components/ProfileSettingsSkeleton';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { compressImage, uploadImageToStorage } from '@/src/services/ImageService';
import { formatDate, formatPhoneNumber, isValidDate, isValidPhoneNumber } from '@/src/utils/ValidationUtils';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

// Types pour les données du profil
interface UserProfile {
  id: string;
  phone_number: string;
  birth_date: string | null;
  address: string;
  city: string;
  identity_type: 'voter_card' | 'passport' | 'driving_license' | null;
  identity_number: string;
  identity_document_url: string | null;
  profile_picture_url: string | null;
  verification_status: string;
  updated_at: string;
}

interface ProfileFormData {
  phoneNumber: string;
  address: string;
  city: string;
  birthDate: string;
  identityType: 'voter_card' | 'passport' | 'driving_license' | null;
  identityNumber: string;
  identityDocument: string | null;
  profilePicture: string | null;
}

export default function ProfileSettingsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
  };

  // États pour les documents
  const [identityDocument, setIdentityDocument] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // État local pour gérer les modifications du formulaire
  const [localProfileData, setLocalProfileData] = useState<ProfileFormData>({
    phoneNumber: '',
    address: '',
    city: 'Lubumbashi',
    birthDate: '',
    identityType: null,
    identityNumber: '',
    identityDocument: null,
    profilePicture: null,
  });

  // États pour l'édition des champs
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  // Animation pour le spinner
  const spinValue = new Animated.Value(0);

  // Liste complète des villes de la RDC
  const citiesRDC = [
    'Lubumbashi', 'Kinshasa', 'Goma', 'Bukavu', 'Kolwezi', 'Likasi', 'Mbuji-Mayi',
    'Kananga', 'Kisangani', 'Matadi', 'Boma', 'Bandundu', 'Kikwit', 'Tshikapa',
    'Beni', 'Butembo', 'Bukavu', 'Uvira', 'Baraka', 'Kalemie', 'Kamina', 'Mbandaka',
    'Gemena', 'Isiro', 'Bunia', 'Gbadolite', 'Kindu', 'Mwene-Ditu', 'Kabinda',
    'Lusambo', 'Kenge', 'Boende', 'Bondo', 'Lisala', 'Aketi', 'Bafwasende', 'Basoko'
  ];

  // Fonction pour charger le profil utilisateur
  const fetchUserProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;

    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur chargement profil:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      return null;
    }
  };

  // React Query pour charger les données du profil
  const { 
    data: userProfile, 
    isLoading: isProfileLoading,
    error: profileError 
  } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: fetchUserProfile,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Initialiser les états avec les données du profil
  useEffect(() => {
    if (userProfile) {
      setProfilePicture(userProfile.profile_picture_url);
      setIdentityDocument(userProfile.identity_document_url);
      
      // Initialiser les données locales avec les données du profil
      setLocalProfileData({
        phoneNumber: userProfile.phone_number || '',
        address: userProfile.address || '',
        city: userProfile.city || 'Lubumbashi',
        birthDate: userProfile.birth_date 
          ? (() => {
              const date = new Date(userProfile.birth_date);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            })()
          : '',
        identityType: userProfile.identity_type || null,
        identityNumber: userProfile.identity_number || '',
        identityDocument: userProfile.identity_document_url,
        profilePicture: userProfile.profile_picture_url,
      });
    }
  }, [userProfile]);

  // Fonction pour sauvegarder le profil
  const saveProfileData = async (formData: ProfileFormData): Promise<boolean> => {
    console.log('🟡 Début sauvegarde profil...');
    
    if (!user) {
      console.log('🔴 Utilisateur non connecté');
      throw new Error(t('userNotConnected'));
    }

    try {
      let profilePictureUrl = formData.profilePicture;
      let identityDocumentUrl = formData.identityDocument;

      // Upload des images si nécessaire
      if (formData.profilePicture && !formData.profilePicture.includes('supabase.co')) {
        console.log('🟡 Upload photo profil...');
        profilePictureUrl = await uploadImageToStorage(formData.profilePicture, `profiles/${user.id}`);
        console.log('✅ Photo profil uploadée:', profilePictureUrl);
      }

      if (formData.identityDocument && !formData.identityDocument.includes('supabase.co')) {
        console.log('🟡 Upload document identité...');
        identityDocumentUrl = await uploadImageToStorage(formData.identityDocument, `identities/${user.id}`);
        console.log('✅ Document identité uploadé:', identityDocumentUrl);
      }

      // CORRECTION : Formatage correct de la date pour PostgreSQL
      let birthDateFormatted = null;
      if (formData.birthDate) {
        console.log('🟡 Date avant formatage:', formData.birthDate);
        
        // Validation de la date
        if (!isValidDate(formData.birthDate)) {
          throw new Error('Date de naissance invalide');
        }

        // Format DD/MM/YYYY -> YYYY-MM-DD (format PostgreSQL)
        const [day, month, year] = formData.birthDate.split('/');
        
        // Formater en YYYY-MM-DD pour PostgreSQL
        birthDateFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        console.log('✅ Date après formatage PostgreSQL:', birthDateFormatted);
      }

      const verificationStatus = (formData.identityType && formData.identityNumber && identityDocumentUrl) 
        ? 'pending_review' 
        : 'not_submitted';

      const profileData = {
        id: user.id,
        phone_number: formData.phoneNumber,
        birth_date: birthDateFormatted,
        address: formData.address,
        city: formData.city,
        identity_type: formData.identityType,
        identity_number: formData.identityNumber,
        identity_document_url: identityDocumentUrl,
        profile_picture_url: profilePictureUrl,
        verification_status: verificationStatus,
        updated_at: new Date().toISOString(),
      };

      console.log('🟡 Données à sauvegarder:', profileData);

      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.log('🔴 Erreur vérification profil:', checkError);
        throw checkError;
      }

      let result;
      
      if (existingProfile) {
        console.log('🟡 Mise à jour profil existant');
        result = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('id', user.id);
      } else {
        console.log('🟡 Création nouveau profil');
        result = await supabase
          .from('user_profiles')
          .insert([profileData]);
      }

      if (result.error) {
        console.log('🔴 Erreur Supabase:', result.error);
        throw result.error;
      }

      console.log('✅ Profil sauvegardé avec succès');
      return true;
      
    } catch (error) {
      console.log('🔴 Erreur lors de la sauvegarde:', error);
      
      // Gestion sécurisée du type unknown
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erreur inconnue lors de la sauvegarde');
      }
    }
  };

  // Mutation React Query pour sauvegarder
  const saveMutation = useMutation({
    mutationFn: saveProfileData,
    onSuccess: () => {
      // Attendre un peu avant de naviguer pour laisser le cache se mettre à jour
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }, 100);
      
      Alert.alert(
        t('success'),
        t('profileUpdated'),
        [{ 
          text: t('okText'), 
          onPress: () => setTimeout(() => router.back(), 200)
        }]
      );
    },
    onError: (error: any) => {
      console.log('🔴 Erreur détaillée:', error);
      
      let errorMessage = t('saveError');
      
      // Messages d'erreur spécifiques
      if (error.message?.includes('non connecté') || error.message?.includes('not connected')) {
        errorMessage = t('userNotConnected');
      } else if (error.message?.includes('storage') || error.message?.includes('upload')) {
        errorMessage = t('uploadError');
      } else if (error.message?.includes('duplicate')) {
        errorMessage = t('duplicateData');
      } else if (error.message?.includes('date') || error.message?.includes('Date')) {
        errorMessage = t('invalidDateMessage');
      }
      
      Alert.alert(
        t('error'),
        errorMessage,
        [{ text: t('okText') }]
      );
    },
  });

  const isLoading = saveMutation.isPending;

  // Animation du spinner
  useEffect(() => {
    if (isLoading) {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();
      
      return () => spinAnimation.stop();
    }
  }, [isLoading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Gestion de l'édition des champs
  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEditing = () => {
    if (editingField && tempValue) {
      // Validation
      if (editingField === 'phoneNumber') {
        if (!isValidPhoneNumber(tempValue)) {
          Alert.alert(
            t('invalidPhone'),
            t('invalidPhoneMessage'),
            [{ text: t('okText') }]
          );
          return;
        }
      }

      if (editingField === 'birthDate') {
        if (tempValue.length < 8) {
          Alert.alert(
            t('invalidDate'),
            t('invalidDateMessage'),
            [{ text: t('okText') }]
          );
          return;
        }
      }

      // Mettre à jour les données locales avec la nouvelle valeur
      setLocalProfileData(prev => ({
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

  const handleTextChange = (text: string) => {
    if (editingField === 'birthDate') {
      setTempValue(formatDate(text));
    } else if (editingField === 'phoneNumber') {
      setTempValue(formatPhoneNumber(text));
    } else {
      setTempValue(text);
    }
  };

  // Fonctions pour les images
  const takePhoto = async (type: 'profile' | 'identity') => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          t('permissionRequired'),
          t('cameraPermissionMessage')
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        quality: 0.7,
        allowsEditing: true,
        aspect: type === 'profile' ? [1, 1] : [4, 3],
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const compressedUri = await compressImage(result.assets[0].uri, 0.6);
        
        switch (type) {
          case 'profile':
            setProfilePicture(compressedUri);
            setLocalProfileData(prev => ({ ...prev, profilePicture: compressedUri }));
            break;
          case 'identity':
            setIdentityDocument(compressedUri);
            setLocalProfileData(prev => ({ ...prev, identityDocument: compressedUri }));
            break;
        }
      }
    } catch (error) {
      console.error('Erreur caméra:', error);
      Alert.alert(
        t('error'),
        t('cameraError')
      );
    }
  };

  const chooseFromGallery = async (type: 'profile' | 'identity') => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          t('permissionRequired'),
          t('galleryPermissionMessage')
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsMultipleSelection: false,
        quality: 0.7,
        allowsEditing: true,
        aspect: type === 'profile' ? [1, 1] : [4, 3],
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const compressedUri = await compressImage(result.assets[0].uri, 0.6);
        
        switch (type) {
          case 'profile':
            setProfilePicture(compressedUri);
            setLocalProfileData(prev => ({ ...prev, profilePicture: compressedUri }));
            break;
          case 'identity':
            setIdentityDocument(compressedUri);
            setLocalProfileData(prev => ({ ...prev, identityDocument: compressedUri }));
            break;
        }
      }
    } catch (error) {
      console.error('Erreur sélection photo:', error);
      Alert.alert(
        t('error'),
        t('galleryError')
      );
    }
  };

  const openImagePicker = (type: 'profile' | 'identity') => {
    Alert.alert(
      t('addPhoto'),
      t('chooseSource'),
      [
        {
          text: t('takePhoto'),
          onPress: () => takePhoto(type),
        },
        {
          text: t('chooseFromGallery'),
          onPress: () => chooseFromGallery(type),
        },
        {
          text: t('cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  // Handlers pour la suppression d'images
  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setLocalProfileData(prev => ({ ...prev, profilePicture: null }));
  };

  const handleRemoveIdentityDocument = () => {
    setIdentityDocument(null);
    setLocalProfileData(prev => ({ ...prev, identityDocument: null }));
  };

  // Sections du profil
  const profileSections = [
    {
      title: t('personalInfo'),
      items: [
        {
          icon: 'call',
          label: t('phoneNumber'),
          type: 'input',
          value: localProfileData.phoneNumber,
          placeholder: t('phonePlaceholder'),
          onPress: () => startEditing('phoneNumber', localProfileData.phoneNumber),
        },
        {
          icon: 'calendar',
          label: t('birthDate'),
          type: 'input',
          value: localProfileData.birthDate,
          placeholder: t('datePlaceholder'),
          onPress: () => startEditing('birthDate', localProfileData.birthDate),
        },
      ],
    },
    {
      title: t('locationInfo'),
      items: [
        {
          icon: 'location',
          label: t('address'),
          type: 'input',
          value: localProfileData.address,
          placeholder: t('enterAddress'),
          onPress: () => startEditing('address', localProfileData.address),
        },
        {
          icon: 'business',
          label: t('city'),
          type: 'select',
          value: localProfileData.city,
          options: citiesRDC.map(city => ({ value: city, label: city })),
          onPress: () => showCitySelector(),
        },
      ],
    },
    {
      title: t('identityVerification'),
      items: [
        {
          icon: 'card',
          label: t('identityType'),
          type: 'select',
          value: localProfileData.identityType,
          options: [
            { value: 'voter_card' as const, label: t('voterCard') },
            { value: 'passport' as const, label: t('passport') },
            { value: 'driving_license' as const, label: t('drivingLicense') },
          ],
          onPress: () => showIdentityTypeSelector(),
        },
        {
          icon: 'document-text',
          label: t('identityNumber'),
          type: 'input',
          value: localProfileData.identityNumber,
          placeholder: t('enterIdentityNumber'),
          onPress: () => startEditing('identityNumber', localProfileData.identityNumber),
        },
        {
          icon: 'camera',
          label: t('uploadIdentityDocument'),
          type: 'upload',
          value: localProfileData.identityDocument,
          onPress: () => openImagePicker('identity'),
          style: { marginTop: 15 }
        },
      ],
    },
  ];

  const showCitySelector = () => {
    Alert.alert(
      t('selectCity'),
      '',
      citiesRDC.map(city => ({
        text: city,
        onPress: () => {
          setLocalProfileData(prev => ({ ...prev, city }));
        },
      })),
      { cancelable: true }
    );
  };

  const showIdentityTypeSelector = () => {
    const identityTypes = [
      { value: 'voter_card' as const, label: t('voterCard') },
      { value: 'passport' as const, label: t('passport') },
      { value: 'driving_license' as const, label: t('drivingLicense') },
    ];

    Alert.alert(
      t('selectIdentityType'),
      '',
      identityTypes.map(type => ({
        text: type.label,
        onPress: () => {
          setLocalProfileData(prev => ({ 
            ...prev, 
            identityType: type.value 
          }));
        },
      })),
      { cancelable: true }
    );
  };

  // Validation et sauvegarde
  const handleSave = async () => {
    // Vérification basique de connexion
    if (!user) {
      Alert.alert(t('error'), t('userNotConnected'));
      return;
    }

    // Vérifier si au moins une information a été modifiée
    const hasChanges = 
      localProfileData.phoneNumber !== (userProfile?.phone_number || '') ||
      localProfileData.address !== (userProfile?.address || '') ||
      localProfileData.city !== (userProfile?.city || 'Lubumbashi') ||
      localProfileData.birthDate !== (userProfile?.birth_date 
        ? (() => {
            const date = new Date(userProfile.birth_date);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
          })()
        : '') ||
      localProfileData.identityType !== (userProfile?.identity_type || null) ||
      localProfileData.identityNumber !== (userProfile?.identity_number || '') ||
      localProfileData.identityDocument !== (userProfile?.identity_document_url || null) ||
      localProfileData.profilePicture !== (userProfile?.profile_picture_url || null);

    if (!hasChanges) {
      Alert.alert(
        t('noChanges'),
        t('noChangesMessage'),
        [{ text: t('okText') }]
      );
      return;
    }

    // Champs réellement obligatoires
    const requiredFields = {
      [t('phoneNumber')]: localProfileData.phoneNumber,
      [t('profilePicture')]: localProfileData.profilePicture,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      Alert.alert(
        t('incompleteProfile'),
        t('missingRequiredFields', { fields: missingFields.join(', ') }),
        [{ text: t('okText') }]
      );
      return;
    }

    // Validation du téléphone
    if (!isValidPhoneNumber(localProfileData.phoneNumber)) {
      Alert.alert(t('invalidPhone'), t('invalidPhoneMessage'));
      return;
    }

    // Validation de la date
    if (localProfileData.birthDate && !isValidDate(localProfileData.birthDate)) {
      Alert.alert(
        t('invalidDate'),
        t('invalidDateMessage'),
        [{ text: t('okText') }]
      );
      return;
    }

    // Si identité commencée, valider tous les champs d'identité
    if (localProfileData.identityType || localProfileData.identityNumber || localProfileData.identityDocument) {
      const identityFields = {
        [t('identityType')]: localProfileData.identityType,
        [t('identityNumber')]: localProfileData.identityNumber,
        [t('identityDocument')]: localProfileData.identityDocument,
      };

      const missingIdentityFields = Object.entries(identityFields)
        .filter(([_, value]) => !value)
        .map(([field]) => field);

      if (missingIdentityFields.length > 0) {
        Alert.alert(
          t('incompleteIdentity'),
          t('completeAllIdentityFields'),
          [{ text: t('okText') }]
        );
        return;
      }
    }

    try {
      await saveMutation.mutateAsync(localProfileData);
    } catch (error) {
      // L'erreur est déjà gérée dans onError - juste logger pour le débogage
      console.log('Erreur lors de la mutation:', error);
    }
  };

  const renderProfileItem = (item: any, index: number, isLast: boolean) => {
    if (item.type === 'upload') {
      return (
        <View key={index} style={[styles.uploadItem, item.style && item.style]}>
          <ImageUploader
            value={item.value}
            onPress={item.onPress}
            isProfilePicture={false}
            colors={colors}
            t={t}
            onRemove={handleRemoveIdentityDocument}
          />
        </View>
      );
    }

    return (
      <ProfileFormItem
        key={index}
        item={item}
        isLast={isLast}
        colors={colors}
        onPress={item.onPress}
      />
    );
  };

  // Afficher le skeleton pendant le chargement
  if (isProfileLoading) {
    return <ProfileSettingsSkeleton colors={{
      background: colors.background,
      card: colors.card,
      text: colors.text,
      textSecondary: colors.textSecondary,
      border: colors.border,
      tint: colors.tint
    }} />;
  }

  if (profileError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.tint} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('editProfileTitle')}
          </Text>
          <View style={styles.saveButtonContainer} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.tint} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {t('errorLoadingProfile')}
          </Text>
          <CustomButton
            title={t('retry')}
            onPress={() => queryClient.invalidateQueries({ queryKey: ['user-profile'] })}
            variant="primary"
            size="medium"
          />
        </View>
      </View>
    );
  }

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
          {t('editProfileTitle')}
        </Text>
        <CustomButton
          title={isLoading ? t('saving') : t('save')}
          onPress={handleSave}
          variant="primary"
          size="small"
          loading={isLoading}
          disabled={isLoading}
          style={styles.saveButton}
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section Photo de profil avec le nouveau composant */}
        <ProfilePictureSection
          profilePicture={localProfileData.profilePicture}
          onImagePicker={() => openImagePicker('profile')}
          onRemovePicture={handleRemoveProfilePicture}
          colors={colors}
          t={t}
        />

        {/* Sections du profil */}
        {profileSections.map((section, sectionIndex) => (
          <ProfileFormSection
            key={sectionIndex}
            section={section}
            colors={colors}
            renderProfileItem={renderProfileItem}
          />
        ))}

        {/* Information importante */}
        <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
          <Ionicons name="information-circle" size={20} color={colors.tint} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {t('verificationInfo', { appName: 'IMANI' })}
          </Text>
        </View>
      </ScrollView>

      {/* Modal d'édition */}
      <EditFieldModal
        editingField={editingField}
        tempValue={tempValue}
        colors={colors}
        onTextChange={handleTextChange}
        onSave={saveEditing}
        onCancel={cancelEditing}
      />
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
    justifyContent: 'space-between',
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
  },
  saveButtonContainer: {
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  saveButton: {
    minWidth: 100,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    marginTop: 25,
  },
  uploadItem: {
    marginBottom: 16,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
});