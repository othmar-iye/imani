// screens/SalesScreen.tsx
import { Header } from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { SalesSkeleton } from '@/components/sales/SalesSkeleton';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';

// Import React Query
import { useInfiniteQuery } from '@tanstack/react-query';

// Import des données réelles
import { featuredProducts, Product } from '@/src/data/products';

// Import i18n
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

// FONCTION AVEC PAGINATION POUR L'INFINITE SCROLL
const fetchDiscountedProductsPaginated = async ({ 
  pageParam = 0 
}: { 
  pageParam?: number;
}): Promise<{
  products: Product[];
  nextPage: number | null;
  hasMore: boolean;
}> => {
  const PAGE_SIZE = 6; // Chargement initial
  const LOAD_MORE_SIZE = 4; // Chargement suivant
  
  const limit = pageParam === 0 ? PAGE_SIZE : LOAD_MORE_SIZE;
  const offset = pageParam === 0 ? 0 : PAGE_SIZE + (pageParam - 1) * LOAD_MORE_SIZE;

  return new Promise((resolve) => {
    setTimeout(() => {
      // Filtrer seulement les produits avec réduction
      const allDiscounted = featuredProducts.filter(product => product.discount > 0);
      
      const startIndex = offset;
      const endIndex = startIndex + limit;
      const paginatedResults = allDiscounted.slice(startIndex, endIndex);
      
      const hasMore = endIndex < allDiscounted.length;
      const nextPage = hasMore ? pageParam + 1 : null;

      resolve({
        products: paginatedResults,
        nextPage,
        hasMore
      });
    }, 800);
  });
};

// Composant Skeleton pour le chargement Infinite Scroll
const LoadingSkeleton = ({ colors }: { colors: any }) => {
  return (
    <View style={styles.loadingSkeletonContainer}>
      {[1, 2].map((item) => (
        <View key={item} style={[styles.skeletonProductCard, { backgroundColor: colors.card }]}>
          <View style={[styles.skeletonImage, { backgroundColor: colors.border }]} />
          <View style={styles.skeletonContent}>
            <View style={[styles.skeletonText, { backgroundColor: colors.border }]} />
            <View style={[styles.skeletonTitle, { backgroundColor: colors.border }]} />
            <View style={[styles.skeletonPrice, { backgroundColor: colors.border }]} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default function SalesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useTranslation();

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
  };

  // ✅ UTILISATION DE REACT QUERY INFINITE POUR LES PRODUITS EN PROMOTION
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: salesLoading,
    error: salesError,
    refetch
  } = useInfiniteQuery({
    queryKey: ['discounted-products-infinite'],
    queryFn: fetchDiscountedProductsPaginated,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  // Extraire tous les produits des pages
  const allDiscountedProducts = React.useMemo(() => {
    return data?.pages.flatMap(page => page.products) || [];
  }, [data]);

  // ✅ GESTION DE L'INFINITE SCROLL
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ✅ FOOTER AVEC INDICATEUR DE CHARGEMENT
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    
    return <LoadingSkeleton colors={colors} />;
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      variant="search"
      showLocation={false}
      showSavings={true} // ✅ AFFICHAGE DES ÉCONOMIES ACTIVÉ
      showStatus={false}
      showStats={false}
    />
  );

  // État de chargement - AVEC SKELETON
  if (salesLoading && allDiscountedProducts.length === 0) {
    return <SalesSkeleton colors={{
      background: colors.background,
      card: colors.card,
      text: colors.text,
      textSecondary: colors.textSecondary,
      border: colors.border,
      tint: colors.tint
    }} />;
  }

  // État d'erreur
  if (salesError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          colors={colors}
          title={t('sales.title')}
          showBackButton={true}
          customPaddingTop={60}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.tint} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Erreur de chargement des promotions
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header avec back button */}
      <Header
        colors={colors}
        title={t('sales.title')}
        showBackButton={true}
        customPaddingTop={60}
      />

      {/* En-tête avec description */}
      <View style={styles.infoSection}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          {t('sales.discountTitle')}
        </Text>
        <Text style={[styles.infoSubtitle, { color: colors.textSecondary }]}>
          {t('sales.description')}
        </Text>
      </View>

      {/* Compteur des produits */}
      <View style={styles.counterContainer}>
        <Text style={[styles.counterText, { color: colors.textSecondary }]}>
          {t('sales.productCount', { count: allDiscountedProducts.length })}
        </Text>
      </View>

      {/* Grid des produits AVEC INFINITE SCROLL */}
      <FlatList
        data={allDiscountedProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        scrollEnabled={true}
        contentContainerStyle={styles.productsGrid}
        columnWrapperStyle={styles.productsRow}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    textAlign: 'center',
  },
  // NOUVEAUX STYLES POUR L'INFINITE SCROLL
  loadingSkeletonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  skeletonProductCard: {
    width: (width - 60) / 2,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  skeletonImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
  },
  skeletonContent: {
    padding: 16,
  },
  skeletonText: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
    width: '60%',
  },
  skeletonTitle: {
    height: 16,
    borderRadius: 8,
    marginBottom: 12,
    width: '90%',
  },
  skeletonPrice: {
    height: 14,
    borderRadius: 7,
    width: '40%',
  },
});