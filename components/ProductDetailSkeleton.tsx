// components/ProductDetailSkeleton.tsx - VERSION HAUT CONTRASTE
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface ProductDetailSkeletonProps {
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    tint: string;
  };
}

export const ProductDetailSkeleton: React.FC<ProductDetailSkeletonProps> = ({ colors }) => {
  const isDark = useColorScheme() === 'dark';
  
  // Animation avec un peu plus d'amplitude pour mieux voir
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Header INSTANTANÉ */}
      <View style={[styles.header, { backgroundColor: 'transparent' }]}>
        <View style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
          <Ionicons name="chevron-back" size={20} color="#FFF" />
        </View>
        
        <View style={styles.headerRight}>
          <View style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
            <Ionicons name="share-outline" size={18} color="#FFF" />
          </View>
          <View style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
            <Ionicons name="heart-outline" size={18} color="#FFF" />
          </View>
        </View>
      </View>

      {/* Carousel SKELETON - Éléments grands avec forte visibilité */}
      <View style={styles.carouselContainer}>
        <AnimatedSkeletonBox 
          width={width} 
          height={height * 0.5} 
          borderRadius={0} 
          variant="strong"
        />
        <View style={styles.indicatorsContainer}>
          <View style={styles.indicators}>
            {[1, 2, 3].map((_, index) => (
              <AnimatedSkeletonBox 
                key={index} 
                width={24} 
                height={3} 
                borderRadius={2} 
                variant="strong"
              />
            ))}
          </View>
          <View style={[styles.galleryButton, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
            <Ionicons name="grid" size={16} color="#FFF" />
            <Text style={styles.galleryButtonText}>Galerie</Text>
          </View>
        </View>
      </View>

      {/* Barre de miniatures SKELETON */}
      <View style={styles.thumbnailsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.thumbnailsContent}>
            {[1, 2, 3, 4].map((_, index) => (
              <AnimatedSkeletonBox 
                key={index}
                width={70} 
                height={70} 
                borderRadius={8}
                style={{ marginRight: 10 }}
                variant="strong"
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Contenu avec mix d'éléments instantanés et skeleton */}
      <ScrollView 
        style={[styles.content, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête produit */}
        <View style={[
          styles.productHeader, 
          { 
            backgroundColor: colors.card,
          }
        ]}>
          <View style={styles.titleSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Détails du produit
            </Text>
            <AnimatedSkeletonBox 
              width={width * 0.6} 
              height={14} 
              borderRadius={4} 
              style={{ marginTop: 8 }} 
              variant="default"
            />
          </View>
          
          <View style={styles.priceSection}>
            <AnimatedSkeletonBox width={100} height={26} borderRadius={4} variant="strong" />
            <AnimatedSkeletonBox width={60} height={14} borderRadius={4} style={{ marginTop: 4 }} variant="default" />
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Description
          </Text>
          <AnimatedSkeletonBox width={width - 40} height={16} borderRadius={4} style={{ marginTop: 12 }} variant="default" />
          <AnimatedSkeletonBox width={(width - 40) * 0.9} height={16} borderRadius={4} style={{ marginTop: 8 }} variant="default" />
          <AnimatedSkeletonBox width={(width - 40) * 0.7} height={16} borderRadius={4} style={{ marginTop: 8 }} variant="default" />
        </View>

        {/* Tags d'information */}
        <View style={styles.tagsContainer}>
          {[1, 2, 3, 4].map((_, index) => (
            <View 
              key={index} 
              style={[styles.tag, { backgroundColor: colors.card }]}
            >
              <Ionicons name="information-circle-outline" size={16} color={colors.tint} />
              <AnimatedSkeletonBox width={120} height={14} borderRadius={4} variant="default" />
            </View>
          ))}
        </View>

        {/* Vendeur */}
        <View style={[styles.sellerCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Informations vendeur
          </Text>
          <View style={styles.sellerInfo}>
            <AnimatedSkeletonBox width={50} height={50} borderRadius={25} variant="strong" />
            <View style={styles.sellerDetails}>
              <AnimatedSkeletonBox width={120} height={16} borderRadius={4} variant="default" />
              <AnimatedSkeletonBox width={80} height={14} borderRadius={4} style={{ marginTop: 4 }} variant="default" />
            </View>
          </View>
          <View style={styles.sellerMetrics}>
            <View style={styles.metric}>
              <AnimatedSkeletonBox width={40} height={16} borderRadius={4} variant="default" />
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Taux de réponse
              </Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
            <View style={styles.metric}>
              <AnimatedSkeletonBox width={40} height={16} borderRadius={4} variant="default" />
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Temps de réponse
              </Text>
            </View>
          </View>
        </View>

        {/* Espace pour les boutons */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Boutons d'action INSTANTANÉS */}
      <View style={[styles.actionBar, { backgroundColor: colors.background }]}>
        <View style={[styles.buttonSkeleton, { backgroundColor: colors.card }]}>
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Discuter avec le vendeur
          </Text>
        </View>
        <View style={[styles.buttonSkeleton, { backgroundColor: colors.tint }]}>
          <Text style={[styles.buttonText, { color: '#FFF' }]}>
            Acheter
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    height: height * 0.5,
    position: 'relative',
  },
  indicatorsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 15,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  galleryButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  thumbnailsContainer: {
    paddingVertical: 15,
  },
  thumbnailsContent: {
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  productHeader: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
    marginRight: 10,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  tagsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 10,
  },
  sellerCard: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerMetrics: {
    flexDirection: 'row',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  metricDivider: {
    width: 1,
    height: '60%',
    alignSelf: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  buttonSkeleton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  skeletonBox: {
    borderRadius: 6,
  },
});