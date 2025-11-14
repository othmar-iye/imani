// app/(tabs)/profile.tsx
import CustomButton from '@/components/CustomButton';
import { MenuItem } from '@/components/profile/MenuItem';
import { MenuSection } from '@/components/profile/MenuSection';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileImagePickerModal } from '@/components/profile/ProfileImagePickerModal';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

// Types pour les données du profil
interface ProfileStats {
  items: number;
  salesStat: number;
  ratings: number;
}

interface ProfileData {
  fullName: string;
  profilePicture: string | null;
  sellerStatus: 'member' | 'pending' | 'verified' | 'rejected';
  location: string;
  stats: ProfileStats;
}

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

// Fonction pour récupérer les données du profil depuis la base de données
const fetchProfileData = async (user: any): Promise<ProfileData> => {
  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  try {
    // Récupérer le profil utilisateur depuis la table user_profiles
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erreur chargement profil:', error);
    }

    // 🆕 COMPTER LES ARTICLES DE L'UTILISATEUR
    const { count: itemsCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', user.id);

    if (countError) {
      console.error('Erreur comptage articles:', countError);
    }

    const userItemsCount = itemsCount || 0;

    // Utiliser les données de user_profiles si disponibles, sinon les métadonnées de l'user
    const profileData: ProfileData = {
      fullName: user?.user_metadata?.full_name || 'Utilisateur',
      profilePicture: userProfile?.profile_picture_thumbnail_url || userProfile?.profile_picture_url || getProfilePicture(user),
      sellerStatus: getSellerStatus(userProfile?.verification_status),
      location: userProfile?.city || 'Lubumbashi, RDC',
      stats: {
        items: userItemsCount, // 🆕 Utiliser le compte réel des articles
        salesStat: userProfile?.sales_count || 0,
        ratings: userProfile?.rating || 0
      }
    };

    return profileData;
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error);
    
    // 🆕 Compter les articles même en cas d'erreur partielle
    let itemsCount = 0;
    try {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', user.id);
      itemsCount = count || 0;
    } catch (countError) {
      console.error('Erreur comptage articles fallback:', countError);
    }

    // Retourner des données par défaut en cas d'erreur
    return {
      fullName: user?.user_metadata?.full_name || 'Utilisateur',
      profilePicture: getProfilePicture(user),
      sellerStatus: 'member',
      location: 'Lubumbashi, RDC',
      stats: {
        items: itemsCount,
        salesStat: 0,
        ratings: 0
      }
    };
  }
};

// Fonction pour mapper le statut de vérification au statut vendeur
const getSellerStatus = (verificationStatus: string | undefined): 'member' | 'pending' | 'verified' | 'rejected' => {
  switch (verificationStatus) {
    case 'verified':
      return 'verified';
    case 'pending_review':
      return 'pending';
    case 'rejected':
      return 'rejected';
    default:
      return 'member'; // 'not_submitted' et autres valeurs retournent 'member'
  }
};

// Fonction pour obtenir la photo de profil depuis les métadonnées de l'user
const getProfilePicture = (user: any): string | null => {
  const possiblePhotoKeys = [
    'avatar_url',
    'picture', 
    'avatar',
    'photo_url',
    'profile_picture',
    'image'
  ];
  
  for (const key of possiblePhotoKeys) {
    if (user?.user_metadata?.[key]) {
      return user.user_metadata[key];
    }
  }
  
  return null;
};

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

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [imageError, setImageError] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // 🚀 SOLUTION REACT QUERY AVEC ACTUALISATION AUTOMATIQUE
  const { 
    data: profileData, 
    isLoading, 
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfileData(user),
    enabled: !!user,
    
    // ⚡ OPTIMISATIONS DES PERFORMANCES
    staleTime: 2 * 60 * 1000, // 2 minutes avant de considérer les données comme périmées
    gcTime: 10 * 60 * 1000, // 10 minutes de cache
    
    // 🔄 STRATÉGIE DE ACTUALISATION AUTOMATIQUE
    refetchInterval: 30000, // Toutes les 30 secondes
    refetchOnWindowFocus: true, // Recharge quand l'écran redevient actif
    refetchOnReconnect: true, // Recharge quand la connexion revient
    refetchIntervalInBackground: false, // Évite de drainer la batterie
  });

  // Fonction pour le pull-to-refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Mettre à jour l'URL de l'image de profil avec une URL signée si nécessaire
  React.useEffect(() => {
    const updateProfileImageUrl = async () => {
      if (profileData?.profilePicture) {
        if (profileData.profilePicture.includes('supabase.co')) {
          const signedUrl = await getSignedUrl(profileData.profilePicture);
          setProfileImageUrl(signedUrl);
        } else {
          setProfileImageUrl(profileData.profilePicture);
        }
      } else {
        setProfileImageUrl(null);
      }
    };

    updateProfileImageUrl();
  }, [profileData?.profilePicture]);

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
      console.log('📤 Upload photo:', imageUri);
      
      // Mise à jour IMMÉDIATE de l'image localement
      setProfileImageUrl(imageUri);
      setImageError(false);
      
      // Feedback utilisateur immédiat
      Alert.alert(
        t('success', 'Succès'),
        t('photoUpdated', 'Photo de profil mise à jour avec succès!'),
        [{ text: t('ok', 'OK') }]
      );
      
      // Rechargement en arrière-plan
      refetch();
      
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      Alert.alert(
        t('error', 'Erreur'),
        t('uploadError', 'Erreur lors du téléchargement de la photo.')
      );
    }
  };

  // Vérification de sécurité
  if (!user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? Theme.dark.background : Theme.light.background }]}>
        <Text style={{ color: isDark ? Theme.dark.text : Theme.light.text }}>{t('loading')}</Text>
      </View>
    );
  }

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
  };

  // Fonction pour générer les initiales
  const getInitials = (name: string): string => {
    if (!name) return 'U';
    
    const names = name.trim().split(' ').filter(n => n.length > 0);
    
    if (names.length === 0) return 'U';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const userInitials = getInitials(profileData?.fullName || '');

  const getStatusText = () => {
    switch(profileData?.sellerStatus) {
      case 'pending':
        return t('verificationPending', 'Profil en cours de vérification');
      case 'verified':
        return t('verifiedSeller');
      case 'rejected':
        return t('verificationRejected', 'Profil rejeté');
      default:
        return t('member'); // 'member' pour 'not_submitted' et autres statuts
    }
  };

  const getStatusIcon = () => {
    switch(profileData?.sellerStatus) {
      case 'pending':
        return 'time-outline';
      case 'verified':
        return 'checkmark-circle-outline';
      case 'rejected':
        return 'close-circle-outline';
      default:
        return 'person-outline'; // 'member' pour 'not_submitted' et autres statuts
    }
  };

  const getStatusColor = () => {
    switch(profileData?.sellerStatus) {
      case 'pending':
        return '#FF9500';
      case 'verified':
        return '#34C759';
      case 'rejected':
        return '#FF3B30';
      default:
        return colors.textSecondary; // 'member' pour 'not_submitted' et autres statuts
    }
  };

  // Rediriger vers l'écran de paramètres du profil
  const setProfile = () => {
    router.push('/screens/BecomeSellerScreen')
  };

  // Rediriger vers l'écran de vérification ou de demande de vendeur
  const handleBecomeSeller = () => {
    router.push('/screens/BecomeSellerScreen')   
  };

  const handleLogout = () => {
    Alert.alert(
      t('logoutTitle'),
      t('logoutMessage'),
      [
        {
          text: t('cancel', 'Annuler'),
          style: 'cancel',
        },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: () => { signOut(); router.replace('/(auth)/welcome'); },
        },
      ]
    );
  };

  // Stats conditionnelles selon le statut de vérification
  const stats = profileData?.sellerStatus === 'verified' ? [
    { label: t('items'), value: profileData.stats.items.toString() },
    { label: t('salesStat'), value: profileData.stats.salesStat.toString() },
    { label: t('ratings'), value: profileData.stats.ratings.toString() },
  ] : [];

  // Message d'information conditionnel - pour les statuts "pending" et "rejected"
  const getStatusMessage = () => {
    if (profileData?.sellerStatus === 'pending') {
      return (
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Ionicons name="time-outline" size={24} color="#FF9500" />
          <View style={styles.infoTextContainer}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              {t('verificationInProgress', 'Vérification en cours')}
            </Text>
            <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
              {t('verificationTimeMessage', 'Votre demande de vérification est en cours de traitement. Cela peut prendre 24 à 48 heures. Vous serez notifié dès que votre profil sera vérifié.')}
            </Text>
          </View>
        </View>
      );
    }

    if (profileData?.sellerStatus === 'rejected') {
      return (
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Ionicons name="close-circle-outline" size={24} color="#FF3B30" />
          <View style={styles.infoTextContainer}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              {t('verificationRejected', 'Profil rejeté')}
            </Text>
            <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
              {t('verificationRejectedMessage', 'Votre demande de vérification a été rejetée. Veuillez vérifier vos documents et soumettre à nouveau votre profil.')}
            </Text>
            <CustomButton
              title={t('resubmitProfile', 'Soumettre à nouveau')}
              onPress={setProfile}
              variant="primary"
              size="small"
              style={styles.resubmitButton}
            />
          </View>
        </View>
      );
    }
    return null;
  };

  // Gestion des états de chargement et d'erreur
  if (isLoading) {
    return <ProfileSkeleton colors={colors} refreshing={refreshing} onRefresh={onRefresh} />;
  }

  if (error) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.tint} />
        <Text style={[styles.errorText, { color: colors.text }]}>
          {t('errorLoadingProfile', 'Erreur lors du chargement du profil')}
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: colors.tint }]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>{t('retry', 'Réessayer')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Afficher le skeleton pendant le chargement
  if (!profileData) {
    return <ProfileSkeleton colors={colors} refreshing={refreshing} onRefresh={onRefresh} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.tint}
            colors={[colors.tint]}
          />
        }
      >
        {/* Header avec composant ProfileHeader */}
        <ProfileHeader
          profileImageUrl={profileImageUrl}
          imageError={imageError}
          userInitials={userInitials}
          fullName={profileData.fullName}
          email={user?.email || 'email@example.com'}
          statusText={getStatusText()}
          statusIcon={getStatusIcon()}
          statusColor={getStatusColor()}
          location={profileData.location}
          isRefetching={isRefetching}
          onEditProfile={setProfile}
          onBecomeSeller={handleBecomeSeller}
          onEditPhoto={handleEditPhoto}
          colors={colors}
          editButtonText={t('editProfile')}
          becomeSellerText={t('becomeSeller', 'Devenir vendeur')}
          sellerStatus={profileData?.sellerStatus}
        />

        {/* Message d'information - pour les statuts "pending" et "rejected" */}
        {getStatusMessage()}

        {/* Statistiques - SEULEMENT pour les utilisateurs vérifiés */}
        {profileData.sellerStatus === 'verified' && stats.length > 0 && (
          <View style={[styles.statsSection, { backgroundColor: colors.card }]}>
            {stats.map((stat, index) => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.tint }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                {index < stats.length - 1 && (
                  <View style={[styles.statSeparator, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Menu options avec composants modulaires */}
        <MenuSection backgroundColor={colors.background}>
          {/* Items pour utilisateurs vérifiés */}
          {profileData?.sellerStatus === 'verified' && (
            <>
              <MenuItem
                icon="cube-outline"
                label={t('myItemsName')}
                // 🆕 MODIFICATION: Afficher le count seulement si > 0
                count={profileData?.stats.items > 0 ? profileData.stats.items.toString() : undefined}
                onPress={() => router.push('/screens/profileOption/MyItemsScreen')}
                colors={colors}
              />
              <MenuItem
                icon="chatbubble-outline"
                label={t('myConversations')}
                count="3"
                onPress={() => router.push('/screens/profileOption/ConversationsScreen')}
                colors={colors}
              />
            </>
          )}
          
          {/* Items pour tous les utilisateurs */}
          <MenuItem
            icon="wallet-outline"
            label={t('myWallet')}
            onPress={() => router.push('/screens/profileOption/WalletScreen')}
            colors={colors}
          />
          <MenuItem
            icon="cart-outline"
            label={t('myOrders')}
            onPress={() => router.push('/screens/profileOption/MyOrdersScreen')}
            colors={colors}
          />
          <MenuItem
            icon="settings-outline"
            label={t('settings', 'Paramètres')}
            onPress={() => router.push('/screens/profileOption/SettingsScreen')}
            colors={colors}
          />
          <MenuItem
            icon="document-text-outline"
            label={t('termsOfService')}
            onPress={() => router.push('/screens/profileOption/TermsOfServiceScreen')}
            colors={colors}
          />
          <MenuItem
            icon="lock-closed-outline"
            label={t('privacyPolicy')}
            onPress={() => router.push('/screens/profileOption/PrivacyPolicyScreen')}
            colors={colors}
          />
          <MenuItem
            icon="information-circle-outline"
            label={t('about', 'À propos')}
            onPress={() => router.push('/screens/profileOption/AboutScreen')}
            colors={colors}
          />
          <MenuItem
            icon="log-out-outline"
            label={t('logoutMenu')}
            onPress={handleLogout}
            isDestructive={true}
            colors={colors}
          />
        </MenuSection>

        {/* Version de l'app */}
        <Text style={[styles.version, { color: colors.textSecondary }]}>
          {t('version', 'Version')} 1.0.0
        </Text>
      </ScrollView>

      {/* Modal de sélection de photo */}
      <ProfileImagePickerModal
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onTakePhoto={takeProfilePhoto}
        onChooseFromGallery={chooseProfilePhotoFromGallery}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
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
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  statsSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statSeparator: {
    position: 'absolute',
    right: 0,
    top: '25%',
    width: 1,
    height: '50%',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  resubmitButton: {
    alignSelf: 'flex-start',
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
    marginTop: 10,
  },
});