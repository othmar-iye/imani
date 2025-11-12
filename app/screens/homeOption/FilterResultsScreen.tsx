// screens/FilterResultsScreen.tsx
import { Header } from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { FilterResultsSkeleton } from '@/components/filter/FilterResultsSkeleton';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const { width } = Dimensions.get('window');

// FONCTION AVEC PAGINATION POUR L'INFINITE SCROLL
const fetchFilteredProductsPaginated = async ({ 
  pageParam = 0,
  categories = [],
  minPrice = 0,
  maxPrice = 1000,
  city = '',
  condition = '',
  sort = 'popular'
}: { 
  pageParam?: number;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  condition?: string;
  sort?: string;
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
      // Fonction pour mapper les noms de catégories
      const mapCategoryToProductCategory = (receivedCategory: string): string => {
        const categoryMap: { [key: string]: string } = {
          'Électronique': 'Électronique',
          'Habillement': 'Habillement',
          'Maison & Déco': 'Maison & Déco',
          'Sports & Loisirs': 'Sports & Loisirs',
          'Livres & Médias': 'Livres & Médias',
          'Autres': 'Autres',
          'Electronics': 'Électronique',
          'Clothing': 'Habillement',
          'Home & Decor': 'Maison & Déco',
          'Sports & Leisure': 'Sports & Loisirs',
          'Books & Media': 'Livres & Médias',
          'Others': 'Autres',
        };
        return categoryMap[receivedCategory] || receivedCategory;
      };

      // Fonction pour mapper les conditions
      const mapConditionToProductCondition = (receivedCondition: string): string => {
        const conditionMap: { [key: string]: string } = {
          'new': 'Neuf',
          'like-new': 'Comme neuf', 
          'good': 'Très bon état',
          'fair': 'Excellent état'
        };
        return conditionMap[receivedCondition] || receivedCondition;
      };

      // Filtrer tous les produits selon les critères
      let allFiltered = featuredProducts.filter(product => {
        // Filtre par catégorie
        if (categories.length > 0) {
          const mappedCategories = categories.map(mapCategoryToProductCategory);
          if (!mappedCategories.includes(product.category)) {
            return false;
          }
        }

        // Filtre par prix
        if (product.price < minPrice || product.price > maxPrice) {
          return false;
        }

        // Filtre par ville
        if (city && product.location && !product.location.includes(city)) {
          return false;
        }

        // Filtre par condition
        if (condition) {
          const mappedCondition = mapConditionToProductCondition(condition);
          if (product.condition !== mappedCondition) {
            return false;
          }
        }

        return true;
      });

      // Trier les résultats
      switch (sort) {
        case 'newest':
          allFiltered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'price-low':
          allFiltered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          allFiltered.sort((a, b) => b.price - a.price);
          break;
        case 'popular':
        default:
          allFiltered.sort((a, b) => b.views - a.views);
          break;
      }

      // Pagination
      const startIndex = offset;
      const endIndex = startIndex + limit;
      const paginatedResults = allFiltered.slice(startIndex, endIndex);
      
      const hasMore = endIndex < allFiltered.length;
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

export default function FilterResultsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  
  // État de chargement initial
  const [isLoading, setIsLoading] = useState(true);

  const colors = {
    background: colorScheme === 'dark' ? Theme.dark.background : Theme.light.background,
    card: colorScheme === 'dark' ? Theme.dark.card : Theme.light.card,
    text: colorScheme === 'dark' ? Theme.dark.text : Theme.light.text,
    textSecondary: colorScheme === 'dark' ? '#8E8E93' : '#666666',
    border: colorScheme === 'dark' ? Theme.dark.border : Theme.light.border,
    tint: colorScheme === 'dark' ? Theme.dark.tint : Theme.light.tint,
  };

  // Récupérer les paramètres de filtre
  const categories = params.categoryNames ? (params.categoryNames as string).split(',') : [];
  const minPrice = params.minPrice ? parseInt(params.minPrice as string) : 0;
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice as string) : 1000;
  const city = params.city as string || '';
  const condition = params.condition as string || '';
  const sort = params.sort as string || 'popular';

  // Simuler le chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // ✅ UTILISATION DE REACT QUERY INFINITE POUR LES RÉSULTATS FILTRÉS
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: queryLoading,
    error: queryError,
    refetch
  } = useInfiniteQuery({
    queryKey: ['filtered-products-infinite', categories, minPrice, maxPrice, city, condition, sort],
    queryFn: ({ pageParam = 0 }) => fetchFilteredProductsPaginated({ 
      pageParam,
      categories,
      minPrice,
      maxPrice,
      city,
      condition,
      sort
    }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !isLoading, // Ne s'exécute que après le chargement initial
  });

  // Extraire tous les résultats des pages
  const allFilteredProducts = React.useMemo(() => {
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

  // Afficher le skeleton pendant le chargement initial
  if (isLoading) {
    return <FilterResultsSkeleton colors={colors} />;
  }

  // Gestion d'erreur
  if (queryError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          colors={colors}
          title={t('filters.results', 'Résultats des filtres')}
          showBackButton={true}
          customPaddingTop={60}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.tint} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Erreur lors du chargement des résultats
          </Text>
        </View>
      </View>
    );
  }

  // CORRECTION : Fonction pour générer le titre basé sur les filtres
  const getFilterTitle = (): string => {
    const parts = [];
    
    if (categories.length > 0) {
      parts.push(categories.join(', '));
    }
    
    if (minPrice > 0 || maxPrice < 1000) {
      parts.push(`$${minPrice}-$${maxPrice}`);
    }
    
    if (city) {
      parts.push(city);
    }
    
    if (condition) {
      const conditionLabels: { [key: string]: string } = {
        'new': t('filters.condition.new'),
        'like-new': t('filters.condition.likeNew'),
        'good': t('filters.condition.good'),
        'fair': t('filters.condition.fair')
      };
      parts.push(conditionLabels[condition] || condition);
    }

    return parts.length > 0 ? parts.join(' • ') : t('filters.allProducts', 'Tous les produits');
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      variant="search"
      showLocation={false}
      showSavings={false}
      showStatus={false}
      showStats={false}
    />
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
        {t('filters.noProductsFound', 'Aucun produit trouvé')}
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
        {t('filters.noProductsMatch', 'Aucun produit ne correspond à vos critères de filtrage')}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header avec back button */}
      <Header
        colors={colors}
        title={t('filters.results', 'Résultats des filtres')}
        showBackButton={true}
        rightAction={{
          label: t('filters.modify', 'Modifier'),
          onPress: () => router.push('/screens/homeOption/FiltersScreen')
        }}
        customPaddingTop={60}
      />

      {/* En-tête avec les filtres appliqués */}
      <View style={styles.infoSection}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          {getFilterTitle()}
        </Text>
        <Text style={[styles.infoSubtitle, { color: colors.textSecondary }]}>
          {allFilteredProducts.length > 0 
            ? t('filters.productsMatch', 'Produits correspondant à vos critères')
            : t('filters.noProductsMatchFilters', 'Aucun produit ne correspond à vos filtres')
          }
        </Text>
      </View>

      {/* Compteur des produits */}
      {allFilteredProducts.length > 0 && (
        <View style={styles.counterContainer}>
          <Text style={[styles.counterText, { color: colors.textSecondary }]}>
            {allFilteredProducts.length} {t('filters.productsFound', 'produit(s) trouvé(s)')}
          </Text>
        </View>
      )}

      {/* Grid des produits ou état vide AVEC INFINITE SCROLL */}
      <FlatList
        data={allFilteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        scrollEnabled={true}
        contentContainerStyle={[
          styles.productsGrid,
          allFilteredProducts.length === 0 && styles.emptyContainer
        ]}
        columnWrapperStyle={allFilteredProducts.length > 0 ? styles.productsRow : undefined}
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
    fontSize: 24, 
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
  // Styles pour l'état vide
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
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
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