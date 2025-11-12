// components/HomeSkeleton.tsx - VERSION ADAPTATIVE
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface HomeSkeletonProps {
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    tint: string;
  };
  isEmptyDatabase?: boolean; // NOUVEAU PROP POUR ADAPTER LE SKELETON
}

export const HomeSkeleton: React.FC<HomeSkeletonProps> = ({ colors, isEmptyDatabase = false }) => {
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
    variant = 'default'
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
        default: '#D1D9E0',
        strong: '#B8C4CE'
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
            backgroundColor: isDark 
              ? skeletonColors.dark[variant]
              : skeletonColors.light[variant],
          },
          animatedStyle
        ]}
      />
    );
  };

  // RENDU SKELETON ADAPTATIF
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header INSTANTANÉ - TOUJOURS VISIBLE */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.locationContainer}>
            <Text style={[styles.locationText, { color: colors.text }]}>
              Bienvenue
            </Text>
          </View>
          <View style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={[styles.notificationBadge, { backgroundColor: '#EF4444' }]} />
          </View>
        </View>

        {/* CONTENU ADAPTATIF SELON LE MODE */}
        {isEmptyDatabase ? (
          // ✅ SKELETON MODE BASE VIDE
          <View style={styles.emptyDatabaseContainer}>
            
            {/* Illustration vide skeleton */}
            <View style={styles.emptyIllustration}>
              <AnimatedSkeletonCircle size={120} variant="strong" />
            </View>

            {/* Titre skeleton */}
            <AnimatedSkeletonBox 
              width={280} 
              height={34} 
              borderRadius={8} 
              style={{ marginBottom: 16 }}
              variant="strong"
            />
            
            {/* Sous-titre skeleton */}
            <AnimatedSkeletonBox 
              width={320} 
              height={44} 
              borderRadius={6} 
              style={{ marginBottom: 40 }}
              variant="default"
            />

            {/* Boutons skeleton */}
            <View style={styles.ctaContainer}>
              <AnimatedSkeletonBox 
                width="100%" 
                height={56} 
                borderRadius={16} 
                variant="strong"
              />
              <AnimatedSkeletonBox 
                width="100%" 
                height={52} 
                borderRadius={16} 
                variant="default"
              />
            </View>
          </View>
        ) : (
          // ✅ SKELETON MODE NORMAL
          <>
            {/* Barre de recherche INSTANTANÉE */}
            <View style={[styles.searchSection, { backgroundColor: colors.background }]}>
              <View style={[styles.searchContainer, { 
                backgroundColor: isDark ? colors.card : '#eee',
                borderColor: colors.border
              }]}>
                <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
                <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
                  Rechercher des produits...
                </Text>
                <View style={styles.filterButton}>
                  <Ionicons name="options-outline" size={22} color={colors.textSecondary} />
                </View>
              </View>
            </View>

            {/* Bannière SKELETON */}
            <View style={styles.promoBanner}>
              <AnimatedSkeletonBox width="100%" height={150} borderRadius={20} variant="strong" />
            </View>

            {/* Section Catégories */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Catégories
                </Text>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.categoriesList}
              >
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <View key={item} style={styles.categoryCard}>
                    <AnimatedSkeletonCircle size={48} variant="strong" />
                    <AnimatedSkeletonBox 
                      width={60} 
                      height={12} 
                      borderRadius={4} 
                      style={{ marginTop: 8 }} 
                      variant="default"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Section Produits */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Produits populaires
                </Text>
                <Text style={[styles.seeAllText, { color: colors.tint }]}>
                  Tout voir
                </Text>
              </View>
              
              <View style={styles.productsGrid}>
                {[1, 2, 3, 4].map((item) => (
                  <View key={item} style={styles.productCard}>
                    <AnimatedSkeletonBox width="100%" height={200} borderRadius={20} variant="strong" />
                    <View style={styles.productContent}>
                      <AnimatedSkeletonBox width={60} height={12} borderRadius={4} variant="default" />
                      <AnimatedSkeletonBox 
                        width="100%" 
                        height={16} 
                        borderRadius={4} 
                        style={{ marginVertical: 8 }} 
                        variant="default"
                      />
                      <AnimatedSkeletonBox width={80} height={18} borderRadius={4} variant="strong" />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Espace en bas */}
            <View style={{ height: 80, backgroundColor: colors.background }} />
          </>
        )}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 60,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    padding: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    fontWeight: '500',
  },
  filterButton: {
    padding: 6,
  },
  promoBanner: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  section: {
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    minWidth: 80,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 60) / 2,
    marginBottom: 20,
  },
  productContent: {
    padding: 16,
  },
  skeletonBox: {
    borderRadius: 6,
  },
  skeletonCircle: {
    borderRadius: 60,
    alignSelf: 'center',
  },
  // NOUVEAUX STYLES POUR MODE VIDE
  emptyDatabaseContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: 'center',
  },
  emptyIllustration: {
    marginBottom: 40,
    opacity: 0.7,
  },
  ctaContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
});