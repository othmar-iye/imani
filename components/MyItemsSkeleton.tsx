// components/MyItemsSkeleton.tsx
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

interface MyItemsSkeletonProps {
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    tint: string;
  };
}

export const MyItemsSkeleton: React.FC<MyItemsSkeletonProps> = ({ colors }) => {
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

  // Composant de boîte skeleton réutilisable
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

  // Skeleton pour la barre de recherche
  const renderSearchSkeleton = () => (
    <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
      <AnimatedSkeletonBox width="100%" height={50} borderRadius={12} variant="strong" />
    </View>
  );

  // Skeleton pour une carte produit
  const renderProductSkeleton = () => (
    <View style={styles.productCard}>
      {/* Image produit */}
      <AnimatedSkeletonBox 
        width="100%" 
        height={180} 
        borderRadius={16} 
        variant="strong"
      />
      
      <View style={styles.productContent}>
        {/* Statut */}
        <View style={styles.statusRow}>
          <AnimatedSkeletonBox width={60} height={20} borderRadius={10} variant="default" />
          <AnimatedSkeletonBox width={40} height={16} borderRadius={8} variant="default" />
        </View>
        
        {/* Titre produit */}
        <AnimatedSkeletonBox 
          width="100%" 
          height={16} 
          borderRadius={4} 
          style={{ marginVertical: 6 }} 
          variant="default"
        />
        
        {/* Prix */}
        <AnimatedSkeletonBox 
          width={80} 
          height={18} 
          borderRadius={4} 
          variant="strong"
        />
        
        {/* Localisation et vues */}
        <View style={styles.detailsRow}>
          <AnimatedSkeletonBox width={80} height={14} borderRadius={4} variant="default" />
          <AnimatedSkeletonBox width={60} height={14} borderRadius={4} variant="default" />
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header INSTANTANÉ */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Ionicons name="chevron-back" size={24} color={colors.tint} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Mes articles
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.scrollContent}>
        {/* Barre de recherche SKELETON */}
        {renderSearchSkeleton()}

        {/* Grid des produits SKELETON */}
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          renderItem={renderProductSkeleton}
          keyExtractor={item => item.toString()}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.productsRow}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
    paddingBottom: 20,
    marginTop: 25,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
  },
  productsGrid: { 
    paddingHorizontal: 10,
    marginTop: 20,
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
    padding: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  skeletonBox: {
    borderRadius: 6,
  },
});