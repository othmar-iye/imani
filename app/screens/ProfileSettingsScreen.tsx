// screens/ProfileSettingsScreen.tsx
import CustomButton from '@/components/CustomButton';
import { EditFieldModal } from '@/components/EditFieldModal';
import { ProfileFormItem } from '@/components/ProfileFormItem';
import { ProfileFormSection } from '@/components/ProfileFormSection';
import { ProfileSettingsSkeleton } from '@/components/ProfileSettingsSkeleton';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
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
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    let profilePictureUrl = formData.profilePicture;
    let identityDocumentUrl = formData.identityDocument;

    // Upload des images si nécessaire
    if (formData.profilePicture && !formData.profilePicture.includes('supabase.co')) {
      profilePictureUrl = await uploadImageToStorage(formData.profilePicture, `profiles/${user.id}`);
    }

    if (formData.identityDocument && !formData.identityDocument.includes('supabase.co')) {
      identityDocumentUrl = await uploadImageToStorage(formData.identityDocument, `identities/${user.id}`);
    }

    // Formatage de la date
    let birthDateFormatted = null;
    if (formData.birthDate) {
      const [day, month, year] = formData.birthDate.split('/');
      birthDateFormatted = `${year}-${month}-${day}`;
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

    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    let result;
    
    if (existingProfile) {
      result = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', user.id);
    } else {
      result = await supabase
        .from('user_profiles')
        .insert([profileData]);
    }

    if (result.error) {
      throw new Error(result.error.message);
    }

    return true;
  };

  // Mutation React Query pour sauvegarder
  const saveMutation = useMutation({
    mutationFn: saveProfileData,
    onSuccess: () => {
      // Invalider et refetch les queries concernées
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      Alert.alert(
        t('success'),
        t('profileUpdated'),
        [{ text: t('okText'), onPress: () => router.back() }]
      );
    },
    onError: (error) => {
      Alert.alert(
        t('error'),
        t('saveError'),
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

  // Fonctions utilitaires
  const compressImage = async (imageUri: string, quality: number = 0.7): Promise<string> => {
    try {
      return imageUri;
    } catch (error) {
      console.log('Compression échouée, utilisation image originale');
      return imageUri;
    }
  };

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

  const uploadImageToStorage = async (imageUri: string, path: string): Promise<string | null> => {
    try {
      if (imageUri.includes('supabase.co')) {
        return imageUri;
      }
      
      const filename = imageUri.split('/').pop();
      const fileExtension = filename?.split('.').pop()?.toLowerCase() || 'jpg';
      const uniqueFileName = `${path}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;

      const response = await fetch(imageUri);
      const blob = await response.blob();

      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        return null;
      }

      const SUPABASE_URL = 'https://dxlbyqkrcfkwrtyidpsn.supabase.co';
      
      const uploadResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/user-documents/${uniqueFileName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/octet-stream',
        },
        body: blob,
      });

      if (!uploadResponse.ok) {
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('user-documents')
        .getPublicUrl(uniqueFileName);

      return publicUrl;

    } catch (error) {
      console.error('❌ Erreur upload image:', error);
      return null;
    }
  };

  // Fonctions de formatage et validation
  const formatDate = (input: string): string => {
    const numbers = input.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const formatPhoneNumber = (input: string): string => {
    if (input.startsWith('+243')) {
      const numbers = input.replace(/\D/g, '');
      const formatted = `+${numbers.slice(0, 4)} ${numbers.slice(4, 6)} ${numbers.slice(6, 9)} ${numbers.slice(9, 12)}`;
      return formatted.trim();
    }
    else if (input.startsWith('243')) {
      const numbers = input.replace(/\D/g, '');
      const formatted = `+${numbers.slice(0, 3)} ${numbers.slice(3, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8, 11)}`;
      return formatted.trim();
    }
    else {
      const numbers = input.replace(/\D/g, '');
      if (numbers.length > 9) {
        const formatted = `+243 ${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 8)}`;
        return formatted.trim();
      } else {
        const formatted = `+243 ${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5)}`;
        return formatted.trim();
      }
    }
  };

  const isValidPhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('243') && cleaned.length === 12;
  };

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
    // Validation de la photo de profil
    if (!localProfileData.profilePicture) {
        Alert.alert(
        t('photoRequired'),
        t('photoRequiredMessage'),
        [{ text: t('okText') }]
        );
        return;
    }

    // Validation du numéro de téléphone
    if (!isValidPhoneNumber(localProfileData.phoneNumber)) {
      Alert.alert(
        t('invalidPhone'),
        t('invalidPhoneMessage'),
        [{ text: t('okText') }]
      );
      return;
    }

    // Vérification des champs obligatoires
    const requiredFields = {
      [t('profilePicture')]: localProfileData.profilePicture,
      [t('phoneNumber')]: localProfileData.phoneNumber,
      [t('identityType')]: localProfileData.identityType,
      [t('identityNumber')]: localProfileData.identityNumber,
      [t('uploadIdentityDocument')]: localProfileData.identityDocument,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      Alert.alert(
        t('incompleteProfile'),
        t('missingFields', { fields: missingFields.join(', ') }),
        [{ text: t('okText') }]
      );
      return;
    }

    saveMutation.mutate(localProfileData);
  };

  // Composant OptimizedImage
  const OptimizedImage = ({ source, style, isProfile = false }: any) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [imageSource, setImageSource] = useState(source);

    const refreshUrl = async () => {
      if (source && source.includes('supabase.co')) {
        const newUrl = await getSignedUrl(source);
        if (newUrl && newUrl !== source) {
          setImageSource(newUrl);
          setHasError(false);
          setIsLoading(true);
        }
      }
    };

    useEffect(() => {
      setImageSource(source);
      setIsLoading(true);
      setHasError(false);
    }, [source]);

    if (hasError) {
      return (
        <View style={[style, styles.imageErrorContainer]}>
          <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
          <Text style={[styles.imageErrorText, { color: colors.textSecondary }]}>
            {t('imageNotLoaded')}
          </Text>
          <CustomButton
            title={t('retry')}
            onPress={refreshUrl}
            variant="primary"
            size="small"
          />
        </View>
      );
    }

    return (
      <View style={style}>
        {isLoading && (
          <View style={[styles.imagePlaceholder, style]}>
            <Ionicons name="image" size={20} color={colors.textSecondary} />
          </View>
        )}
        <Image 
          source={{ uri: imageSource }} 
          style={[
            style, 
            { 
              position: 'absolute',
              opacity: isLoading ? 0 : 1 
            }
          ]}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => {
            console.log('✅ Image chargée:', imageSource);
            setIsLoading(false);
          }}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            console.log('❌ Erreur chargement image:', imageSource);
            setHasError(true);
            setIsLoading(false);
          }}
        />
      </View>
    );
  };

  const renderUploadItem = (item: any, isProfilePicture: boolean = false) => {
    const hasImage = item.value !== null;
    const isUrlImage = hasImage && item.value?.startsWith('http');
    
    return (
      <TouchableOpacity
        style={[
          styles.uploadContainer, 
          { borderColor: colors.border },
          isProfilePicture && styles.profilePictureContainer
        ]}
        onPress={item.onPress}
      >
        {hasImage ? (
          <View style={[
            styles.imagePreviewContainer,
            isProfilePicture && styles.profileImageContainer
          ]}>
            <OptimizedImage 
              source={item.value}
              style={[
                styles.previewImage,
                isProfilePicture && styles.profileImage
              ]}
              isProfile={isProfilePicture}
            />
            <TouchableOpacity 
              style={[styles.removeButton, { backgroundColor: colors.tint }]}
              onPress={(e) => {
                e.stopPropagation();
                if (isProfilePicture) {
                  setProfilePicture(null);
                  setLocalProfileData(prev => ({ ...prev, profilePicture: null }));
                } else {
                  setIdentityDocument(null);
                  setLocalProfileData(prev => ({ ...prev, identityDocument: null }));
                }
              }}
            >
              <Ionicons name="close" size={16} color="#FFF" />
            </TouchableOpacity>
            <View style={[styles.checkBadge, { backgroundColor: '#34C759' }]}>
              <Ionicons name="checkmark" size={12} color="#FFF" />
            </View>
            
          </View>
        ) : (
          <View style={isProfilePicture ? styles.profileUploadPlaceholder : styles.uploadPlaceholder}>
            <Ionicons 
              name="camera" 
              size={isProfilePicture ? 32 : 24} 
              color={colors.textSecondary} 
            />
            <Text style={[
              styles.uploadText, 
              { color: colors.textSecondary },
              isProfilePicture && styles.profileUploadText
            ]}>
              {isProfilePicture ? t('uploadProfilePicture') : item.label}
            </Text>
            {!isProfilePicture && (
              <Text style={[styles.uploadSubtext, { color: colors.textSecondary }]}>
                {t('tapToUpload')}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderProfileItem = (item: any, index: number, isLast: boolean) => {
    if (item.type === 'upload') {
      return (
        <View key={index} style={[styles.uploadItem, item.style && item.style]}>
            {renderUploadItem(item, false)}
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
    return <ProfileSettingsSkeleton colors={colors} />;
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
        {/* Section Photo de profil seule en premier */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('profilePicture')}
          </Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            {renderUploadItem({
              value: localProfileData.profilePicture,
              onPress: () => openImagePicker('profile'),
            }, true)}
          </View>
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
            {t('verificationInfo')}
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
    padding: 16,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    minHeight: 60,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  profileItemText: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileValue: {
    fontSize: 14,
  },
  profilePlaceholder: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  profileItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectText: {
    fontSize: 14,
    fontWeight: '500',
  },
  uploadItem: {
    marginBottom: 16,
  },
  uploadContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    padding: 0,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileUploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  profileUploadText: {
    fontSize: 12,
    marginTop: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  profileImage: {
    borderRadius: 60,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  imageErrorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  imageErrorText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  // Styles pour le modal d'édition
  editModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  editButton: {
    flex: 1,
  },
  // Styles Skeleton
  skeletonBox: {
    borderRadius: 6,
  },
  skeletonCircle: {
    borderRadius: 60,
    alignSelf: 'center',
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  skeletonItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  skeletonTextContainer: {
    flex: 1,
  },
});