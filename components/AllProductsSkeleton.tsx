// components/AllProductsSkeleton.tsx
import { Ionicons } from '@expo/vector-icons';
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

interface AllProductsSkeletonProps {
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    tint: string;
  };
}

export const AllProductsSkeleton: React.FC<AllProductsSkeletonProps> = ({ 
  colors
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

  const renderProductSkeleton = () => (
    <View style={styles.productCard}>
      {/* Image produit - Élément principal */}
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
        
        {/* Prix - Élément important */}
        <AnimatedSkeletonBox 
          width={80} 
          height={18} 
          borderRadius={4} 
          variant="strong"
        />
        
        {/* Localisation */}
        <AnimatedSkeletonBox 
          width={100} 
          height={14} 
          borderRadius={4} 
          style={{ marginTop: 8 }} 
          variant="default"
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header INSTANTANÉ */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <Ionicons name="chevron-back" size={24} color={colors.tint} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Tous les produits
          </Text>
        </View>
      </View>

      {/* En-tête INSTANTANÉ */}
      <View style={styles.infoSection}>
        <AnimatedSkeletonBox 
          width={200} 
          height={32} 
          borderRadius={8}
          variant="strong"
          style={{ marginBottom: 8 }}
        />
        <AnimatedSkeletonBox 
          width={280} 
          height={20} 
          borderRadius={6}
          variant="default"
        />
      </View>

      {/* Compteur INSTANTANÉ */}
      <View style={styles.counterContainer}>
        <AnimatedSkeletonBox 
          width={150} 
          height={16} 
          borderRadius={6}
          variant="default"
        />
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
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '700' 
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  flatList: {
    flex: 1,
  },
  productsGrid: { 
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  productsRow: { 
    justifyContent: 'space-between', 
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  productCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
  },
  productContent: {
    padding: 16,
  },
  skeletonBox: {
    borderRadius: 6,
  },
});