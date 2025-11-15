// screens/ProfileSettingsScreen.tsx
import CustomButton from '@/components/CustomButton';
import { EditFieldModal } from '@/components/EditFieldModal';
import { ImageUploader } from '@/components/ImageUploader';
import { ProfileFormItem } from '@/components/ProfileFormItem';
import { ProfileFormSection } from '@/components/becomeseller/BecomeSellerFormSection';
import { ProfileSettingsSkeleton } from '@/components/becomeseller/BecomeSellerSkeleton';
import { ProfileImagePickerModal } from '@/components/profile/ProfileImagePickerModal';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import {
    compressImage,
    uploadImageToStorage
} from '@/src/services/ImageService';
import { NotificationService } from '@/src/services/notificationService';
import { formatDate, formatPhoneNumber, isValidDate, isValidPhoneNumber } from '@/src/utils/ValidationUtils';
import { compressImage as compressImageUtil, createThumbnail, uploadProfileImageToSupabase } from '@/src/utils/imageUtils';
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
    Image,
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
  profile_picture_thumbnail_url: string | null;
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

  // États pour l'avatar
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // État local pour gérer les modifications du formulaire
  const [localProfileData, setLocalProfileData] = useState<ProfileFormData>({
    phoneNumber: '',
    address: '',
    city: 'Lubumbashi',
    birthDate: '',
    identityType: null,
    identityNumber: '',
    identityDocument: null,
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
        setIdentityDocument(userProfile.identity_document_url);
        setProfileImageUrl(userProfile.profile_picture_thumbnail_url || userProfile.profile_picture_url);
        
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
        });
    }
  }, [userProfile]);

  // Fonction pour obtenir une URL signée pour les images Supabase
  const getSignedUrl = async (url: string): Promise<string | null> => {
    try {
      if (!url.includes('supabase.co')) return url;
      
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const bucket = 'user-documents';
      
      const publicIndex = pathParts.indexOf('public');
      if (publicIndex === -1) return url;
      
      const filePath = pathParts.slice(publicIndex + 2).join('/');
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600);

      if (error) {
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
        return publicUrlData.publicUrl;
      }

      return data?.signedUrl || url;
    } catch (error) {
      console.error('❌ Erreur getSignedUrl:', error);
      return url;
    }
  };

  // Mettre à jour l'URL de l'image de profil avec une URL signée si nécessaire
  React.useEffect(() => {
    const updateProfileImageUrl = async () => {
      const imageToDisplay = userProfile?.profile_picture_thumbnail_url || userProfile?.profile_picture_url;
      
      if (imageToDisplay) {
        if (imageToDisplay.includes('supabase.co')) {
          const signedUrl = await getSignedUrl(imageToDisplay);
          setProfileImageUrl(signedUrl);
        } else {
          setProfileImageUrl(imageToDisplay);
        }
      } else {
        setProfileImageUrl(null);
      }
    };

    updateProfileImageUrl();
  }, [userProfile?.profile_picture_thumbnail_url, userProfile?.profile_picture_url]);

  // Fonctions pour la gestion des photos de profil
  const handleEditPhoto = () => {
    setShowImagePicker(true);
  };

  const takeProfilePhoto = async () => {
    try {
      console.log('📸 Ouverture caméra...');
      
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          t('permissionRequired', 'Permission requise'),
          t('cameraPermissionMessage', 'Nous avons besoin de votre permission pour utiliser la caméra.')
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('📸 Résultat caméra:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('✅ Photo prise:', result.assets[0].uri);
        await uploadProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('❌ Erreur caméra:', error);
      Alert.alert(
        t('error', 'Erreur'),
        t('cameraError', 'Impossible d\'accéder à la caméra.')
      );
    }
  };

  const chooseProfilePhotoFromGallery = async () => {
    try {
      console.log('🖼️ Ouverture galerie...');
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          t('permissionRequired', 'Permission requise'), 
          t('galleryPermissionMessage', 'Nous avons besoin de votre permission pour accéder à vos photos.')
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('🖼️ Résultat galerie:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('✅ Photo sélectionnée:', result.assets[0].uri);
        await uploadProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('❌ Erreur galerie:', error);
      Alert.alert(
        t('error', 'Erreur'), 
        t('galleryError', 'Impossible d\'accéder à la galerie photos.')
      );
    }
  };

  const uploadProfilePhoto = async (imageUri: string) => {
    try {
      console.log('📤 Début upload photo profil:', imageUri);
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      setIsUploading(true);
      setShowImagePicker(false);

      // Mise à jour IMMÉDIATE de l'image localement pour un feedback visuel
      setProfileImageUrl(imageUri);
      setImageError(false);

      // 🎯 MÊME PROCÉDURE QUE ProfileScreen :
      // ÉTAPE 1: Préparer les images (compression + thumbnail)
      console.log('🔄 Compression image principale...');
      const compressedImageUri = await compressImageUtil(imageUri, 0.8, 800, 800);
      
      console.log('🔄 Création thumbnail...');
      const thumbnailUri = await createThumbnail(imageUri, 0.6, 200, 200);

      // ÉTAPE 2: Upload vers Supabase Storage
      const timestamp = Date.now();
      const mainFileName = `profile-pictures/${user.id}/main-${timestamp}.jpg`;
      const thumbnailFileName = `profile-pictures/${user.id}/thumbnail-${timestamp}.jpg`;

      console.log('📤 Upload image principale...');
      const mainImageUrl = await uploadProfileImageToSupabase(compressedImageUri, mainFileName);
      
      console.log('📤 Upload thumbnail...');
      const thumbnailUrl = await uploadProfileImageToSupabase(thumbnailUri, thumbnailFileName);

      // ÉTAPE 3: Mettre à jour la table user_profiles
      console.log('💾 Mise à jour base de données...');
      
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          profile_picture_url: mainImageUrl,
          profile_picture_thumbnail_url: thumbnailUrl, // 🎯 THUMBNAIL ICI
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (updateError) {
        console.error('❌ Erreur mise à jour profil:', updateError);
        throw updateError;
      }

      console.log('✅ Photo de profil mise à jour avec succès!');
      
      // Mettre à jour l'URL affichée avec la nouvelle image
      setProfileImageUrl(thumbnailUrl || mainImageUrl);
      
      // Forcer le rechargement des données
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      Alert.alert(
        t('success', 'Succès'),
        t('photoUpdated', 'Photo de profil mise à jour avec succès!'),
        [{ text: t('ok', 'OK') }]
      );
      
    } catch (error: any) {
      console.error('❌ Erreur upload complète:', error);
      
      let errorMessage = t('uploadError', 'Erreur lors du téléchargement de la photo.');
      
      if (error.message?.includes('storage')) {
        errorMessage = 'Erreur de stockage. Vérifiez les permissions du bucket.';
      } else if (error.message?.includes('fetch')) {
        errorMessage = 'Impossible de lire le fichier image.';
      }
      
      Alert.alert(
        t('error', 'Erreur'),
        errorMessage
      );
      
      // Recharger les données originales en cas d'erreur
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
        if (!user) return;

        Alert.alert(
        t('deletePhotoTitle', 'Supprimer la photo'),
        t('deletePhotoMessage', 'Êtes-vous sûr de vouloir supprimer votre photo de profil ?'),
        [
            {
            text: t('cancel', 'Annuler'),
            style: 'cancel',
            },
            {
            text: t('delete', 'Supprimer'),
            style: 'destructive',
            onPress: async () => {
                // Mettre à jour l'état local immédiatement
                setProfileImageUrl(null);
                
                // Mettre à jour la base de données
                const { error } = await supabase
                .from('user_profiles')
                .upsert({
                    id: user.id,
                    profile_picture_url: null,
                    profile_picture_thumbnail_url: null,
                    updated_at: new Date().toISOString(),
                });

                if (error) {
                console.error('❌ Erreur suppression photo:', error);
                Alert.alert(t('error', 'Erreur'), t('deletePhotoError', 'Erreur lors de la suppression.'));
                // Recharger les données en cas d'erreur
                await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
                } else {
                console.log('✅ Photo supprimée avec succès');
                await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
                }
            },
            },
        ]
        );
    } catch (error) {
        console.error('❌ Erreur suppression photo:', error);
        Alert.alert(t('error', 'Erreur'), t('deletePhotoError', 'Erreur lors de la suppression.'));
    }
  };

  // Fonction pour générer les initiales
  const getInitials = (name: string): string => {
    if (!name) return 'U';
    
    const names = name.trim().split(' ').filter(n => n.length > 0);
    
    if (names.length === 0) return 'U';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const userInitials = getInitials(user?.user_metadata?.full_name || '');

  // Fonction pour sauvegarder le profil
  const saveProfileData = async (formData: ProfileFormData): Promise<boolean> => {
    console.log('🟡 Début sauvegarde profil...');
    
    if (!user) {
      console.log('🔴 Utilisateur non connecté');
      throw new Error(t('userNotConnected'));
    }

    // VÉRIFICATION OBLIGATOIRE DE LA PHOTO DE PROFIL
    if (!userProfile?.profile_picture_url && !profileImageUrl) {
      throw new Error('PHOTO_PROFILE_REQUIRED');
    }

    try {
      let identityDocumentUrl = formData.identityDocument;

      // Upload document identité
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
    onSuccess: async () => {
        // 🆕 NOTIFICATION ICI
        if (user) {
            try {
                await NotificationService.sellerSubmission(user.id);
                console.log('✅ Notification de soumission vendeur créée');
            } catch (notificationError) {
                console.log('⚠️ Notification non créée, mais profil sauvegardé:', notificationError);
            }
        }
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
      if (error.message === 'PHOTO_PROFILE_REQUIRED') {
        errorMessage = t('photoProfileRequired', 'Photo de profil requise pour devenir vendeur');
      } else if (error.message?.includes('non connecté') || error.message?.includes('not connected')) {
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
  const takePhoto = async (type: 'identity') => {
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
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const compressedUri = await compressImage(result.assets[0].uri, 0.6);
        
        setIdentityDocument(compressedUri);
        setLocalProfileData(prev => ({ ...prev, identityDocument: compressedUri }));
      }
    } catch (error) {
      console.error('Erreur caméra:', error);
      Alert.alert(
        t('error'),
        t('cameraError')
      );
    }
  };

  const chooseFromGallery = async (type: 'identity') => {
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
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const compressedUri = await compressImage(result.assets[0].uri, 0.6);
        
        setIdentityDocument(compressedUri);
        setLocalProfileData(prev => ({ ...prev, identityDocument: compressedUri }));
      }
    } catch (error) {
      console.error('Erreur sélection photo:', error);
      Alert.alert(
        t('error'),
        t('galleryError')
      );
    }
  };

  const openImagePicker = (type: 'identity') => {
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

    // VÉRIFICATION OBLIGATOIRE DE LA PHOTO DE PROFIL
    if (!userProfile?.profile_picture_url && !profileImageUrl) {
      Alert.alert(
        t('photoRequired'),
        t('photoProfileRequired', 'Photo de profil requise pour devenir vendeur'),
        [{ text: t('okText') }]
      );
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
        localProfileData.identityDocument !== (userProfile?.identity_document_url || null);

    if (!hasChanges) {
      Alert.alert(
        t('noChanges'),
        t('noChangesMessage'),
        [{ text: t('okText') }]
      );
      return;
    }

    // Champs obligatoires
    const requiredFields = {
      [t('phoneNumber')]: localProfileData.phoneNumber,
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
        {/* Section Avatar Simplifiée */}
        <View style={[styles.avatarSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.avatarTitle, { color: colors.text }]}>
            {t('profilePhoto', 'Photo de profil')}
          </Text>
          <Text style={[styles.avatarSubtitle, { color: colors.textSecondary }]}>
            {t('photoRequiredForSeller', 'Obligatoire pour devenir vendeur')}
          </Text>
          
          <View style={styles.avatarContainer}>
            <TouchableOpacity 
              style={styles.avatarTouchable}
              onPress={handleEditPhoto}
              activeOpacity={0.7}
              disabled={isUploading}
            >
              <View style={[styles.avatar, { backgroundColor: (profileImageUrl && !imageError) ? 'transparent' : colors.tint }]}>
                {(profileImageUrl && !imageError && !isUploading) ? (
                  <Image 
                    source={{ uri: profileImageUrl }} 
                    style={styles.avatarImage}
                    resizeMode="cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  !isUploading && (
                    <Text style={styles.avatarText}>{userInitials}</Text>
                  )
                )}
                
                {isUploading && (
                  <View style={[styles.uploadOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <Ionicons name="cloud-upload" size={24} color="#FFFFFF" />
                  </View>
                )}
              </View>
              
              {!isUploading && (
                <View style={[styles.editIconContainer, { backgroundColor: colors.tint }]}>
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {!profileImageUrl && (
            <Text style={[styles.avatarWarning, { color: '#FF9500' }]}>
              {t('photoRequiredWarning', 'Photo de profil requise')}
            </Text>
          )}
        </View>

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

      {/* Modal de sélection de photo */}
      <ProfileImagePickerModal
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onTakePhoto={takeProfilePhoto}
        onChooseFromGallery={chooseProfilePhotoFromGallery}
        onDeletePhoto={handleDeletePhoto}
        hasCurrentPhoto={!!profileImageUrl}
        isUploading={isUploading}
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
  // Styles pour la section avatar
  avatarSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  avatarTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  avatarSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarTouchable: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  avatarWarning: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
});