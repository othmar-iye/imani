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
        {/* Header Skeleton */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          {/* Avatar - Élément principal */}
          <AnimatedSkeletonCircle size={100} variant="strong" />
          
          {/* Nom */}
          <AnimatedSkeletonBox 
            width={150} 
            height={24} 
            borderRadius={6}
            style={{ marginBottom: 8 }}
            variant="strong"
          />
          
          {/* Email */}
          <AnimatedSkeletonBox 
            width={100} 
            height={16} 
            borderRadius={4}
            style={{ marginBottom: 4 }}
            variant="default"
          />
          
          {/* Localisation */}
          <AnimatedSkeletonBox 
            width={120} 
            height={14} 
            borderRadius={4}
            style={{ marginBottom: 16 }}
            variant="default"
          />
          
          {/* Bouton modifier */}
          <AnimatedSkeletonBox 
            width={120} 
            height={44} 
            borderRadius={12}
            variant="strong"
          />
        </View>

        {/* Stats Skeleton */}
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
                {/* Badge (pour les premières items) */}
                {index < 3 && (
                  <AnimatedSkeletonCircle 
                    size={20} 
                    variant="strong"
                  />
                )}
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

        {/* Version Skeleton */}
        <AnimatedSkeletonBox 
          width={80} 
          height={14} 
          borderRadius={4}
          style={{ 
            alignSelf: 'center',
            marginTop: 10,
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
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    paddingTop: 60,
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
  statSeparator: {
    position: 'absolute',
    right: 0,
    top: '25%',
    width: 1,
    height: '50%',
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