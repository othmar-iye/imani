// components/FilterResultsSkeleton.tsx
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

interface FilterResultsSkeletonProps {
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    tint: string;
  };
}

export const FilterResultsSkeleton: React.FC<FilterResultsSkeletonProps> = ({ colors }) => {
  const isDark = useColorScheme() === 'dark';
  
  // Animation
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

  // Composant skeleton réutilisable
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

  const renderProductSkeleton = () => (
    <View style={styles.productCard}>
      {/* Image produit */}
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
        
        {/* Économie */}
        <AnimatedSkeletonBox 
          width={100} 
          height={14} 
          borderRadius={4} 
          style={{ marginTop: 4 }} 
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
            Résultats des filtres
          </Text>
        </View>
        
        {/* Bouton Modifier */}
        <View style={styles.editFiltersButton}>
          <Ionicons name="options-outline" size={20} color={colors.tint} />
          <Text style={[styles.editFiltersText, { color: colors.tint }]}>
            Modifier
          </Text>
        </View>
      </View>

      {/* En-tête INSTANTANÉ */}
      <View style={styles.infoSection}>
        <AnimatedSkeletonBox 
          width="70%" 
          height={28} 
          borderRadius={6}
          style={{ marginBottom: 8 }}
          variant="strong"
        />
        <AnimatedSkeletonBox 
          width="90%" 
          height={16} 
          borderRadius={4}
          variant="default"
        />
      </View>

      {/* Compteur INSTANTANÉ */}
      <View style={styles.counterContainer}>
        <AnimatedSkeletonBox 
          width={120} 
          height={14} 
          borderRadius={4}
          variant="default"
        />
      </View>

      {/* Grid des produits SKELETON */}
      <FlatList
        data={[1, 2, 3, 4, 5, 6]}
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
    fontWeight: '700',
    marginLeft: 12,
  },
  editFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  editFiltersText: {
    fontSize: 14,
    fontWeight: '600',
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