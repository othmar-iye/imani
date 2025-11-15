// components/ProfileSkeleton.tsx - VERSION AMÉLIORÉE
import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

interface ProfileSkeletonProps {
  colors: {
    background: string;
    card: string;
    border: string;
    text: string;
    textSecondary: string;
    tint: string;
  };
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({
  colors,
  refreshing = false,
  onRefresh,
}) => {
  const isDark = useColorScheme() === 'dark';
  
  // Animation renforcée
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { 
        duration: 1000, 
        easing: Easing.ease 
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // VERSION FORT CONTRASTE pour le mode clair
  const AnimatedSkeletonBox = ({ 
    width, 
    height, 
    borderRadius = 6,
    style,
    variant = 'default' // 'default' | 'strong'
  }: { 
    width: number | string; 
    height: number; 
    borderRadius?: number;
    style?: any;
    variant?: 'default' | 'strong';
  }) => {
    const skeletonColors = {
      dark: {
        default: '#2A2A2A',
        strong: '#333333'
      },
      light: {
        default: '#D1D9E0',   // BEAUCOUP plus foncé - bien visible
        strong: '#B8C4CE'     // Encore plus contrasté
      }
    };

    return (
      <Animated.View 
        style={[
          styles.skeletonBox, 
          { 
            width, 
            height, 
            borderRadius,
            backgroundColor: isDark 
              ? skeletonColors.dark[variant]
              : skeletonColors.light[variant],
          },
          animatedStyle,
          style
        ]}
      />
    );
  };

  const AnimatedSkeletonCircle = ({ 
    size,
    variant = 'default'
  }: { 
    size: number;
    variant?: 'default' | 'strong';
  }) => {
    const skeletonColors = {
      dark: {
        default: '#2A2A2A',
        strong: '#333333'
      },
      light: {
        default: '#D1D9E0',
        strong: '#B8C4CE'
      }
    };

    return (
      <Animated.View 
        style={[
          styles.skeletonCircle, 
          { 
            width: size, 
            height: size,
            borderRadius: size / 2,
            backgroundColor: isDark 
              ? skeletonColors.dark[variant]
              : skeletonColors.light[variant],
          },
          animatedStyle
        ]}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.border}
            />
          ) : undefined
        }
      >
        {/* Header Skeleton - AVEC NOUVEAU DESIGN */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          {/* Section principale avec avatar à gauche et infos à droite */}
          <View style={styles.profileMainSection}>
            {/* Avatar à gauche */}
            <View style={styles.avatarSection}>
              <AnimatedSkeletonCircle size={110} variant="strong" />
            </View>

            {/* Infos utilisateur à droite */}
            <View style={styles.userInfoSection}>
              {/* Nom */}
              <AnimatedSkeletonBox 
                width={150} 
                height={20} 
                borderRadius={4}
                style={{ marginBottom: 4 }}
                variant="strong"
              />
              
              {/* Email */}
              <AnimatedSkeletonBox 
                width={120} 
                height={14} 
                borderRadius={4}
                style={{ marginBottom: 12 }}
                variant="default"
              />
              
              {/* Statut et localisation */}
              <View style={styles.statusLocationSection}>
                {/* Statut */}
                <AnimatedSkeletonBox 
                  width={100} 
                  height={13} 
                  borderRadius={4}
                  style={{ marginBottom: 4 }}
                  variant="default"
                />
                
                {/* Localisation */}
                <AnimatedSkeletonBox 
                  width={80} 
                  height={13} 
                  borderRadius={4}
                  variant="default"
                />
              </View>
            </View>
          </View>

          {/* Section des boutons en bas */}
          <View style={styles.buttonsSection}>
            {/* Bouton Modifier profil */}
            <AnimatedSkeletonBox 
              width="48%" 
              height={44} 
              borderRadius={12}
              variant="strong"
            />
            
            {/* Bouton Devenir vendeur */}
            <AnimatedSkeletonBox 
              width="48%" 
              height={44} 
              borderRadius={12}
              variant="strong"
            />
          </View>
        </View>

        {/* Message d'information conditionnel */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <View style={styles.infoContent}>
            <AnimatedSkeletonCircle size={24} variant="default" />
            <View style={styles.infoTextContainer}>
              <AnimatedSkeletonBox 
                width={120} 
                height={16} 
                borderRadius={4}
                style={{ marginBottom: 8 }}
                variant="strong"
              />
              <AnimatedSkeletonBox 
                width="100%" 
                height={36} 
                borderRadius={4}
                variant="default"
              />
            </View>
          </View>
        </View>

        {/* Stats Section - SEULEMENT pour vendeurs vérifiés */}
        <View style={[styles.statsSection, { backgroundColor: colors.card }]}>
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles.statItem}>
              {/* Chiffre stat */}
              <AnimatedSkeletonBox 
                width={40} 
                height={20} 
                borderRadius={4}
                style={{ marginBottom: 4 }}
                variant="strong"
              />
              {/* Label stat */}
              <AnimatedSkeletonBox 
                width={60} 
                height={12} 
                borderRadius={4}
                variant="default"
              />
              {index < 2 && (
                <View style={[styles.statSeparator, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* Menu Items Skeleton */}
        <View style={[styles.menuSection, { backgroundColor: colors.background }]}>
          {/* Items pour vendeurs vérifiés */}
          <View style={styles.menuGroup}>
            {[1, 2].map((item) => (
              <View
                key={`verified-${item}`}
                style={[
                  styles.menuItem,
                  { 
                    backgroundColor: colors.card,
                    marginBottom: 8,
                  }
                ]}
              >
                <View style={styles.menuItemLeft}>
                  {/* Icône */}
                  <AnimatedSkeletonBox 
                    width={22} 
                    height={22} 
                    borderRadius={4}
                    variant="default"
                  />
                  {/* Texte menu */}
                  <AnimatedSkeletonBox 
                    width={150} 
                    height={16} 
                    borderRadius={4}
                    variant="default"
                  />
                </View>
                
                <View style={styles.menuItemRight}>
                  {/* Badge count */}
                  <AnimatedSkeletonCircle size={20} variant="strong" />
                  {/* Flèche */}
                  <AnimatedSkeletonBox 
                    width={16} 
                    height={16} 
                    borderRadius={2}
                    variant="default"
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Items pour tous les utilisateurs */}
          <View style={styles.menuGroup}>
            {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
              <View
                key={`all-${item}`}
                style={[
                  styles.menuItem,
                  { 
                    backgroundColor: colors.card,
                    marginBottom: index === 6 ? 0 : 8,
                  }
                ]}
              >
                <View style={styles.menuItemLeft}>
                  {/* Icône */}
                  <AnimatedSkeletonBox 
                    width={22} 
                    height={22} 
                    borderRadius={4}
                    variant="default"
                  />
                  {/* Texte menu */}
                  <AnimatedSkeletonBox 
                    width={150} 
                    height={16} 
                    borderRadius={4}
                    variant="default"
                  />
                </View>
                
                <View style={styles.menuItemRight}>
                  {/* Flèche */}
                  <AnimatedSkeletonBox 
                    width={16} 
                    height={16} 
                    borderRadius={2}
                    variant="default"
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Version Skeleton */}
        <AnimatedSkeletonBox 
          width={80} 
          height={14} 
          borderRadius={4}
          style={{ 
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 20,
          }}
          variant="default"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  // Header styles pour correspondre au nouveau design
  header: {
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  profileMainSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatarSection: {
    position: 'relative',
    marginRight: 16,
  },
  userInfoSection: {
    flex: 1,
    justifyContent: 'center',
  },
  statusLocationSection: {
    gap: 4,
  },
  buttonsSection: {
    flexDirection: 'row',
    gap: 12,
  },
  // Info card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  // Stats section
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
  statSeparator: {
    position: 'absolute',
    right: 0,
    top: '25%',
    width: 1,
    height: '50%',
  },
  // Menu section
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuGroup: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
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
  skeletonBox: {
    borderRadius: 6,
  },
  skeletonCircle: {
    borderRadius: 50,
  },
});