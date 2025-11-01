// components/SearchResultsSkeleton.tsx
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

interface SearchResultsSkeletonProps {
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    tint: string;
  };
  searchQuery: string;
}

export const SearchResultsSkeleton: React.FC<SearchResultsSkeletonProps> = ({ 
  colors, 
  searchQuery 
}) => {
  const isDark = useColorScheme() === 'dark';
  
  // Animation simple
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { 
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

  const AnimatedSkeletonBox = ({ 
    width, 
    height, 
    borderRadius = 6,
    style 
  }: { 
    width: number | string; 
    height: number; 
    borderRadius?: number;
    style?: any;
  }) => (
    <Animated.View 
      style={[
        styles.skeletonBox, 
        { 
          width, 
          height, 
          borderRadius,
          backgroundColor: isDark ? '#2A2A2A' : '#E1E9EE',
        },
        animatedStyle,
        style
      ]}
    />
  );

  const renderProductSkeleton = () => (
    <View style={styles.productCard}>
      <AnimatedSkeletonBox width="100%" height={200} borderRadius={20} />
      <View style={styles.productContent}>
        <AnimatedSkeletonBox width={60} height={12} borderRadius={4} />
        <AnimatedSkeletonBox 
          width="100%" 
          height={16} 
          borderRadius={4} 
          style={{ marginVertical: 8 }} 
        />
        <AnimatedSkeletonBox width={80} height={18} borderRadius={4} />
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
            Résultats de recherche
          </Text>
        </View>
      </View>

      {/* Terme de recherche INSTANTANÉ */}
      <View style={styles.infoSection}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          "{searchQuery}"
        </Text>
        <Text style={[styles.infoSubtitle, { color: colors.textSecondary }]}>
          Recherche en cours...
        </Text>
      </View>

      {/* Compteur INSTANTANÉ */}
      <View style={styles.counterContainer}>
        <Text style={[styles.counterText, { color: colors.textSecondary }]}>
          Chargement des résultats...
        </Text>
      </View>

      {/* Grid des produits SKELETON */}
      <FlatList
        data={[1, 2, 3, 4, 5, 6]} // Plus d'éléments pour simuler les résultats
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
  infoTitle: { 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: 8 
  },
  infoSubtitle: { 
    fontSize: 16,
    lineHeight: 22,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '500',
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