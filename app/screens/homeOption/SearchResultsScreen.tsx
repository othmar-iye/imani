// screens/SearchResultsScreen.tsx
import { Header } from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { SearchResultsSkeleton } from '@/components/search/SearchResultsSkeleton';
import { Theme } from '@/constants/theme';
import { useLocalSearchParams } from 'expo-router';
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

// Fonction API simulée pour la recherche avec pagination
const fetchSearchResultsPaginated = async ({ 
  query, 
  pageParam = 0 
}: { 
  query: string; 
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
      // Filtrer les produits basés sur la recherche
      const allResults = featuredProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      
      const startIndex = offset;
      const endIndex = startIndex + limit;
      const paginatedResults = allResults.slice(startIndex, endIndex);
      
      const hasMore = endIndex < allResults.length;
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

export default function SearchResultsScreen() {
  const colorScheme = useColorScheme();
  const { query } = useLocalSearchParams();
  const searchQuery = typeof query === 'string' ? query : '';
  const { t } = useTranslation();

  const colors = {
    background: colorScheme === 'dark' ? Theme.dark.background : Theme.light.background,
    card: colorScheme === 'dark' ? Theme.dark.card : Theme.light.card,
    text: colorScheme === 'dark' ? Theme.dark.text : Theme.light.text,
    textSecondary: colorScheme === 'dark' ? '#8E8E93' : '#666666',
    border: colorScheme === 'dark' ? Theme.dark.border : Theme.light.border,
    tint: colorScheme === 'dark' ? Theme.dark.tint : Theme.light.tint,
  };

  // Utilisation de React Query Infinite pour les résultats de recherche
  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: searchLoading,
    error: searchError,
    refetch
  } = useInfiniteQuery({
    queryKey: ['search-results-infinite', searchQuery],
    queryFn: ({ pageParam = 0 }) => fetchSearchResultsPaginated({ 
      query: searchQuery, 
      pageParam 
    }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!searchQuery, // Ne s'exécute que si searchQuery n'est pas vide
  });

  // Extraire tous les résultats des pages
  const allSearchResults = React.useMemo(() => {
    return data?.pages.flatMap(page => page.products) || [];
  }, [data]);

  // Gestion de l'infinite scroll
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Footer avec indicateur de chargement
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    
    return <LoadingSkeleton colors={colors} />;
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      variant="search"
      showLocation={false}
      showSavings={true}
      showStatus={false}
      showStats={false}
    />
  );

  // Composant pour l'état vide
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        {t('filters.noProductsFound')}
      </Text>
    </View>
  );

  // État de chargement - AVEC SKELETON
  if (searchLoading && allSearchResults.length === 0) {
    return <SearchResultsSkeleton
      colors={{
        background: colors.background,
        card: colors.card,
        text: colors.text,
        textSecondary: colors.textSecondary,
        border: colors.border,
        tint: colors.tint
      }} 
      searchQuery={searchQuery}
    />;
  }

  // État d'erreur
  if (searchError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          colors={colors}
          title={t('searchResults.results')}
          showBackButton={true}
          customPaddingTop={60}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Erreur lors de la recherche
          </Text>
          <Text style={[styles.retryButton, { backgroundColor: colors.tint }]}>
            Réessayer
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
        title={t('searchResults.results')}
        showBackButton={true}
        customPaddingTop={60}
      />

      {/* En-tête avec terme de recherche */}
      <View style={styles.infoSection}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          "{searchQuery}"
        </Text>
        <Text style={[styles.infoSubtitle, { color: colors.textSecondary }]}>
          {allSearchResults.length > 0 
            ? t('searchResults.searchMatch')
            : t('searchResults.noResultsForText')
          }
        </Text>
      </View>

      {/* Compteur des produits */}
      {allSearchResults.length > 0 && (
        <View style={styles.counterContainer}>
          <Text style={[styles.counterText, { color: colors.textSecondary }]}>
            {allSearchResults.length} {t('filters.productsFound')}
          </Text>
        </View>
      )}

      {/* Grid des produits ou état vide avec INFINITE SCROLL */}
      <FlatList
        data={allSearchResults}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        scrollEnabled={true}
        contentContainerStyle={[
          styles.productsGrid,
          allSearchResults.length === 0 && styles.emptyContainer
        ]}
        columnWrapperStyle={allSearchResults.length > 0 ? styles.productsRow : undefined}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

// Styles avec ajout des nouveaux styles pour l'infinite scroll
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
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsRow: { 
    justifyContent: 'space-between', 
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
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
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
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