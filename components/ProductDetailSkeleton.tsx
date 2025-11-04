// components/ProductDetailSkeleton.tsx - VERSION CORRIGÉE POUR ANDROID
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Platform,
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
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={Platform.OS === 'ios' ? ['top'] : ['top', 'left', 'right']}
    >
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
        contentContainerStyle={styles.scrollContent}
      >
        {/* En-tête produit */}
        <View style={[
          styles.productHeader, 
          { 
            backgroundColor: colors.card,
          }
        ]}>
          <View style={styles.titleSection}>
            <AnimatedSkeletonBox 
              width={width * 0.7} 
              height={24} 
              borderRadius={4} 
              variant="strong"
            />
            <AnimatedSkeletonBox 
              width={width * 0.4} 
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
          <AnimatedSkeletonBox width={120} height={18} borderRadius={4} variant="strong" />
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
              <AnimatedSkeletonBox width={16} height={16} borderRadius={8} variant="default" />
              <AnimatedSkeletonBox width={120} height={14} borderRadius={4} variant="default" />
            </View>
          ))}
        </View>

        {/* Vendeur */}
        <View style={[styles.sellerCard, { backgroundColor: colors.card }]}>
          <AnimatedSkeletonBox width={180} height={18} borderRadius={4} variant="strong" />
          <View style={styles.sellerInfo}>
            <AnimatedSkeletonBox width={50} height={50} borderRadius={25} variant="strong" />
            <View style={styles.sellerDetails}>
              <AnimatedSkeletonBox width={120} height={16} borderRadius={4} variant="default" />
              <AnimatedSkeletonBox width={80} height={14} borderRadius={4} style={{ marginTop: 4 }} variant="default" />
            </View>
          </View>
          <View style={[styles.sellerMetrics, { borderTopColor: colors.border }]}>
            <View style={styles.metric}>
              <AnimatedSkeletonBox width={40} height={16} borderRadius={4} variant="default" />
              <AnimatedSkeletonBox width={60} height={12} borderRadius={4} style={{ marginTop: 4 }} variant="default" />
            </View>
            <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
            <View style={styles.metric}>
              <AnimatedSkeletonBox width={40} height={16} borderRadius={4} variant="default" />
              <AnimatedSkeletonBox width={60} height={12} borderRadius={4} style={{ marginTop: 4 }} variant="default" />
            </View>
          </View>
        </View>

        {/* Espace pour les boutons */}
        <View style={{ height: Platform.OS === 'android' ? 120 : 100 }} />
      </ScrollView>

      {/* Boutons d'action EN SKELETON */}
      <View style={[styles.actionBar, { backgroundColor: colors.background }]}>
        <AnimatedSkeletonBox 
          width={'48%'} 
          height={50} 
          borderRadius={12}
          variant="default"
        />
        <AnimatedSkeletonBox 
          width={'48%'} 
          height={50} 
          borderRadius={12}
          variant="strong"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
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
    backgroundColor: 'rgba(0,0,0,0.02)',
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
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8,
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
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8,
  },
  sellerCard: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
    marginTop: 15,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerMetrics: {
    flexDirection: 'row',
    paddingTop: 15,
    borderTopWidth: 1,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
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
    paddingBottom: Platform.OS === 'android' ? 30 : 20,
    marginBottom: Platform.OS === 'android' ? 10 : 0,
  },
  skeletonBox: {
    borderRadius: 6,
  },
});