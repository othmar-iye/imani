// components/FavoritesSkeleton.tsx
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
        data={[1, 2, 3, 4]} // Données factices pour le skeleton
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
  },
  productContent: {
    padding: 16,
  },
  skeletonBox: {
    borderRadius: 6,
  },
});