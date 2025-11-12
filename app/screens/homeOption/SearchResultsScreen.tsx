// screens/SearchResultsScreen.tsx
import { Header } from '@/components/Header';
import { SearchResultsSkeleton } from '@/components/SearchResultsSkeleton';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
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
    <TouchableOpacity 
      style={[
        styles.productCard, 
        { 
          backgroundColor: colors.card,
          shadowColor: colorScheme === 'dark' ? '#000' : '#8E8E93',
        }
      ]}
      activeOpacity={0.9}
      onPress={() => router.push({
        pathname: '/screens/ProductDetailScreen',
        params: { productId: item.id }
      })}
    >
      {/* Image container avec overlay gradient */}
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.productImage}
          resizeMode="cover"
        />
        
        {/* Overlay gradient pour un effet moderne */}
        <View style={[
          styles.imageOverlay,
          { 
            backgroundColor: colorScheme === 'dark' 
              ? 'rgba(0,0,0,0.3)' 
              : 'rgba(255,255,255,0.1)'
          }
        ]} />
        
        {/* Badge de promotion */}
        {item.discount > 0 && (
          <View style={[styles.discountBadge, { backgroundColor: colors.tint }]}>
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>
        )}
        
        {/* Bouton favoris positionné absolument */}
        <TouchableOpacity 
          style={[
            styles.favoriteButton, 
            { 
              backgroundColor: colorScheme === 'dark' 
                ? 'rgba(255,255,255,0.9)' 
                : 'rgba(255,255,255,0.9)',
            }
          ]}
        >
          <Ionicons 
            name={item.isFavorite ? "heart" : "heart-outline"} 
            size={16} 
            color={item.isFavorite ? colors.tint : '#8E8E93'} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Contenu texte */}
      <View style={styles.productContent}>
        {/* Catégorie */}
        <Text style={[styles.productCategory, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.category}
        </Text>
        
        {/* Nom du produit */}
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        
        {/* Prix et rating */}
        <View style={styles.priceRatingContainer}>
          <View style={styles.priceContainer}>
            <Text style={[styles.currentPrice, { color: colors.tint }]}>
              ${item.price}
            </Text>
            {item.originalPrice > item.price && (
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                ${item.originalPrice}
              </Text>
            )}
          </View>
        </View>

        {/* Économie réalisée */}
        {item.discount > 0 && (
          <View style={styles.savingsContainer}>
            <Text style={[styles.savingsText, { color: colors.tint }]}>
              {t('filters.savings')}: ${(item.originalPrice - item.price).toFixed(2)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Composant pour l'état vide
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name="search-outline" 
        size={64} 
        color={colors.textSecondary} 
      />
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
          <Ionicons name="alert-circle-outline" size={48} color={colors.tint} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Erreur lors de la recherche
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.tint }]}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
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
  productCard: { 
    width: (width - 60) / 2,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    height: 200,
  },
  productImage: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 3,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 3,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  productContent: {
    padding: 16,
  },
  productCategory: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 20,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 12,
    fontWeight: '500',
    textDecorationLine: 'line-through',
  },
  savingsContainer: {
    marginBottom: 12,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
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
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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