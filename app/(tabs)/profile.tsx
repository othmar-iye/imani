// app/(tabs)/profile.tsx
import CustomButton from '@/components/CustomButton';
import { MenuItem } from '@/components/MenuItem';
import { MenuSection } from '@/components/MenuSection';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

// Types pour les données du profil
interface ProfileStats {
  items: number;
  sales: number;
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

    // Utiliser les données de user_profiles si disponibles, sinon les métadonnées de l'user
    const profileData: ProfileData = {
      fullName: user?.user_metadata?.full_name || 'Utilisateur',
      profilePicture: userProfile?.profile_picture_url || getProfilePicture(user),
      sellerStatus: getSellerStatus(userProfile?.verification_status),
      location: userProfile?.city || 'Lubumbashi, RDC',
      stats: {
        items: 12,
        sales: 8,
        ratings: 4.8
      }
    };

    return profileData;
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error);
    
    // Retourner des données par défaut en cas d'erreur
    return {
      fullName: user?.user_metadata?.full_name || 'Utilisateur',
      profilePicture: getProfilePicture(user),
      sellerStatus: 'member',
      location: 'Lubumbashi, RDC',
      stats: {
        items: 12,
        sales: 8,
        ratings: 4.8
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
      return 'member';
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

  // Vérification de sécurité
  if (!user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? Theme.dark.background : Theme.light.background }]}>
        <Text style={{ color: isDark ? Theme.dark.text : Theme.light.text }}>{t('loading', 'Chargement...')}</Text>
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
        return t('verifiedSeller', 'Vendeur vérifié');
      case 'rejected':
        return t('verificationRejected', 'Profil rejeté');
      default:
        return t('member', 'Membre');
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
        return 'person-outline';
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
        return colors.textSecondary;
    }
  };

  const setProfile = () => {
    router.push('/screens/ProfileSettingsScreen')
  };

  const handleLogout = () => {
    Alert.alert(
      t('logoutTitle', 'Déconnexion'),
      t('logoutMessage', 'Êtes-vous sûr de vouloir vous déconnecter ?'),
      [
        {
          text: t('cancel', 'Annuler'),
          style: 'cancel',
        },
        {
          text: t('logout', 'Log out'),
          style: 'destructive',
          onPress: () => { signOut(); router.replace('/(auth)/welcome'); },
        },
      ]
    );
  };

  // Stats conditionnelles selon le statut de vérification
  const stats = profileData?.sellerStatus === 'verified' ? [
    { label: t('items', 'Articles'), value: profileData.stats.items.toString() },
    { label: t('sales', 'Ventes'), value: profileData.stats.sales.toString() },
    { label: t('ratings', 'Évaluations'), value: profileData.stats.ratings.toString() },
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

  // Skeleton Loader intégré
  const ProfileSkeleton = () => {
    const skeletonColor = isDark ? '#2A2A2A' : '#E1E9EE';
    
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
          {/* Header Skeleton */}
          <View style={[styles.header, { backgroundColor: colors.card }]}>
            <View style={[
              styles.skeletonCircle, 
              { 
                width: 100, 
                height: 100, 
                backgroundColor: skeletonColor,
                marginBottom: 16,
              }
            ]} />
            
            <View style={[
              styles.skeletonBox, 
              { 
                width: 150, 
                height: 24, 
                backgroundColor: skeletonColor,
                marginBottom: 8,
              }
            ]} />
            
            <View style={[
              styles.skeletonBox, 
              { 
                width: 100, 
                height: 16, 
                backgroundColor: skeletonColor,
                marginBottom: 4,
              }
            ]} />
            
            <View style={[
              styles.skeletonBox, 
              { 
                width: 120, 
                height: 14, 
                backgroundColor: skeletonColor,
                marginBottom: 16,
              }
            ]} />
            
            <View style={[
              styles.skeletonBox, 
              { 
                width: 120, 
                height: 44, 
                backgroundColor: skeletonColor,
                borderRadius: 12,
              }
            ]} />
          </View>

          {/* Stats Skeleton - Toujours visible dans le skeleton */}
          <View style={[styles.statsSection, { backgroundColor: colors.card }]}>
            {[1, 2, 3].map((_, index) => (
              <View key={index} style={styles.statItem}>
                <View style={[
                  styles.skeletonBox, 
                  { 
                    width: 40, 
                    height: 20, 
                    backgroundColor: skeletonColor,
                    marginBottom: 4,
                  }
                ]} />
                <View style={[
                  styles.skeletonBox, 
                  { 
                    width: 60, 
                    height: 12, 
                    backgroundColor: skeletonColor,
                  }
                ]} />
                {index < 2 && (
                  <View style={[styles.statSeparator, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))}
          </View>

          {/* Menu Items Skeleton */}
          <View style={[styles.menuSection, { backgroundColor: colors.background }]}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
              <View
                key={item}
                style={[
                  styles.menuItem,
                  { 
                    backgroundColor: colors.card,
                    marginBottom: index === 8 ? 0 : 8,
                  }
                ]}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[
                    styles.skeletonBox, 
                    { 
                      width: 22, 
                      height: 22, 
                      backgroundColor: skeletonColor,
                      borderRadius: 4,
                    }
                  ]} />
                  <View style={[
                    styles.skeletonBox, 
                    { 
                      width: 150, 
                      height: 16, 
                      backgroundColor: skeletonColor,
                    }
                  ]} />
                </View>
                
                <View style={styles.menuItemRight}>
                  {index < 3 && (
                    <View style={[
                      styles.skeletonBox, 
                      { 
                        width: 20, 
                        height: 20, 
                        backgroundColor: skeletonColor,
                        borderRadius: 10,
                      }
                    ]} />
                  )}
                  <View style={[
                    styles.skeletonBox, 
                    { 
                      width: 16, 
                      height: 16, 
                      backgroundColor: skeletonColor,
                    }
                  ]} />
                </View>
              </View>
            ))}
          </View>

          {/* Version Skeleton */}
          <View style={[
            styles.skeletonBox, 
            { 
              width: 80, 
              height: 14, 
              backgroundColor: skeletonColor,
              alignSelf: 'center',
              marginTop: 10,
            }
          ]} />
        </ScrollView>
      </View>
    );
  };

  // Gestion des états de chargement et d'erreur
  if (isLoading) {
    return <ProfileSkeleton />;
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
    return <ProfileSkeleton />;
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
        {/* Header avec avatar et infos */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: (profileImageUrl && !imageError) ? 'transparent' : colors.tint }]}>
              {(profileImageUrl && !imageError) ? (
                <Image 
                  source={{ uri: profileImageUrl }} 
                  style={styles.avatarImage}
                  resizeMode="cover"
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
                />
              ) : (
                <Text style={styles.avatarText}>{userInitials}</Text>
              )}
            </View>
            
            {/* Indicateur de synchronisation */}
            {isRefetching && (
              <View style={[styles.syncIndicator, { backgroundColor: colors.tint }]}>
                <Ionicons name="sync" size={12} color="#FFFFFF" />
              </View>
            )}
          </View>
          
          <Text style={[styles.userName, { color: colors.text }]}>
            {profileData.fullName}
          </Text>
          
          <View style={styles.userInfo}>
            <Ionicons 
              name={getStatusIcon() as any} 
              size={14} 
              color={getStatusColor()} 
            />
            <Text style={[styles.userStatus, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
          
          <Text style={[styles.userLocation, { color: colors.textSecondary }]}>
            {profileData.location}
          </Text>

          <CustomButton
            title={t('editProfile', 'Modifier profil')}
            onPress={setProfile}
            variant="primary"
            size="large"
          />
        </View>

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
                label={t('myItems', 'Mes articles')}
                count={profileData?.stats.items.toString() || '12'}
                onPress={() => router.push('/screens/profileOption/MyItemsScreen')}
                colors={colors}
              />
              <MenuItem
                icon="chatbubble-outline"
                label={t('myConversations', 'Mes discussions')}
                count="3"
                onPress={() => router.push('/screens/profileOption/ConversationsScreen')}
                colors={colors}
              />
            </>
          )}
          
          {/* Items pour tous les utilisateurs */}
          <MenuItem
            icon="wallet-outline"
            label={t('myWallet', 'Mon portefeuille')}
            onPress={() => router.push('/screens/profileOption/WalletScreen')}
            colors={colors}
          />
          <MenuItem
            icon="cart-outline"
            label={t('myOrders', 'Mes commandes')}
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
            label={t('termsOfService', 'Conditions d\'utilisation')}
            onPress={() => router.push('/screens/profileOption/TermsOfServiceScreen')}
            colors={colors}
          />
          <MenuItem
            icon="lock-closed-outline"
            label={t('privacyPolicy', 'Politique de confidentialité')}
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
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    paddingTop: 60,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  syncIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  userLocation: {
    fontSize: 14,
    marginBottom: 16,
  },
  statsSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 20,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
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
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8,
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
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
    marginTop: 10,
  },
  // Styles pour le skeleton
  skeletonBox: {
    borderRadius: 6,
  },
  skeletonCircle: {
    borderRadius: 50,
  },
});