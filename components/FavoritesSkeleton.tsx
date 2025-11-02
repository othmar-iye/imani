// components/FavoritesSkeleton.tsx - VERSION AMÉLIORÉE
import React, { useEffect } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface FavoritesSkeletonProps {
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    tint: string;
  };
}

export const FavoritesSkeleton: React.FC<FavoritesSkeletonProps> = ({ colors }) => {
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

  const renderProductSkeleton = () => (
    <View style={styles.productCard}>
      {/* Image produit - Élément principal avec forte visibilité */}
      <AnimatedSkeletonBox 
        width="100%" 
        height={200} 
        borderRadius={20} 
        variant="strong"
      />
      
      <View style={styles.productContent}>
        {/* Catégorie */}
        <AnimatedSkeletonBox 
          width={60} 
          height={12} 
          borderRadius={4} 
          variant="default"
        />
        
        {/* Titre produit */}
        <AnimatedSkeletonBox 
          width="100%" 
          height={16} 
          borderRadius={4} 
          style={{ marginVertical: 8 }} 
          variant="default"
        />
        
        {/* Prix */}
        <AnimatedSkeletonBox 
          width={80} 
          height={18} 
          borderRadius={4} 
          variant="strong"
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header INSTANTANÉ */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Favoris
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Chargement des produits...
            </Text>
          </View>
        </View>
      </View>

      {/* Grid des produits SKELETON */}
      <FlatList
        data={[1, 2, 3, 4, 5, 6]} // Plus d'éléments pour mieux voir
        renderItem={renderProductSkeleton}
        keyExtractor={item => item.toString()}
        numColumns={2}
        scrollEnabled={true}
        contentContainerStyle={styles.productsGrid}
        columnWrapperStyle={styles.productsRow}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header inspiré du Chat
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  flatList: {
    flex: 1,
  },
  // Grid des produits
  productsGrid: { 
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginTop: 20,
  },
  productsRow: { 
    justifyContent: 'space-between', 
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  productCard: {
    width: (width - 60) / 2,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  productContent: {
    padding: 16,
    paddingTop: 12,
  },
  skeletonBox: {
    borderRadius: 6,
  },
});