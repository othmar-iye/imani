// screens/CategoryScreen.tsx
import { Header } from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { CategorySkeleton } from '@/components/category/CategorySkeleton';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
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

// FONCTION AVEC PAGINATION POUR L'INFINITE SCROLL
const fetchProductsByCategoryPaginated = async ({ 
  pageParam = 0,
  categoryName = 'Tous'
}: { 
  pageParam?: number;
  categoryName?: string;
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
      // Si c'est "Tous", retourner tous les produits
      let allProducts;
      if (categoryName === 'Tous' || categoryName === 'all' || categoryName === 'All') {
        allProducts = featuredProducts;
      } else {
        // Filtrer par catégorie
        allProducts = featuredProducts.filter(product => 
          product.category === categoryName || 
          product.subCategory === categoryName
        );
      }
      
      const startIndex = offset;
      const endIndex = startIndex + limit;
      const paginatedResults = allProducts.slice(startIndex, endIndex);
      
      const hasMore = endIndex < allProducts.length;
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

// Fonction pour déterminer le nom d'affichage de la catégorie
const getDisplayCategoryName = (categoryName: string, t: any) => {
  return categoryName === 'Tous' || categoryName === 'all' || categoryName === 'All' 
    ? t('category.allProducts') 
    : categoryName;
};

export default function CategoryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  
  // Récupérer le nom de la catégorie depuis les paramètres
  const categoryName = params.categoryName as string || 'Tous';
  const categoryId = params.categoryId as string || 'all';

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
  };

  // ✅ UTILISATION DE REACT QUERY INFINITE POUR LES PRODUITS DE CATÉGORIE
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: categoryLoading,
    error: categoryError,
    refetch
  } = useInfiniteQuery({
    queryKey: ['category-products-infinite', categoryName],
    queryFn: ({ pageParam = 0 }) => fetchProductsByCategoryPaginated({ 
      pageParam,
      categoryName
    }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  // Extraire tous les produits des pages
  const allCategoryProducts = React.useMemo(() => {
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
      variant="category"
      showLocation={true}
      showSavings={false}
      showStatus={false}
      showStats={false}
    />
  );

  // État de chargement - AVEC SKELETON
  if (categoryLoading && allCategoryProducts.length === 0) {
    return <CategorySkeleton colors={{
      background: colors.background,
      card: colors.card,
      text: colors.text,
      textSecondary: colors.textSecondary,
      border: colors.border,
      tint: colors.tint
    }} />;
  }

  // État d'erreur
  if (categoryError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          colors={colors}
          title={getDisplayCategoryName(categoryName, t)}
          showBackButton={true}
          customPaddingTop={60}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.tint} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {t('category.errorLoading')}
          </Text>
        </View>
      </View>
    );
  }

  const displayCategoryName = getDisplayCategoryName(categoryName, t);

  // Composant pour l'état vide
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {t('category.noProducts')}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header avec back button */}
      <Header
        colors={colors}
        title={displayCategoryName}
        showBackButton={true}
        customPaddingTop={60}
      />

      {/* En-tête avec description */}
      <View style={styles.infoSection}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          {t('category.exploreCategory', { category: displayCategoryName })}
        </Text>
        <Text style={[styles.infoSubtitle, { color: colors.textSecondary }]}>
          {t('category.description', { 
            category: displayCategoryName, 
            count: allCategoryProducts.length 
          })}
        </Text>
      </View>

      {/* Compteur des produits */}
      <View style={styles.counterContainer}>
        <Text style={[styles.counterText, { color: colors.textSecondary }]}>
          {allCategoryProducts.length === 1 
            ? t('category.productCount', { count: allCategoryProducts.length })
            : t('category.productCount_plural', { count: allCategoryProducts.length })
          }
        </Text>
      </View>

      {/* Grid des produits AVEC INFINITE SCROLL */}
      <FlatList
        data={allCategoryProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        scrollEnabled={true}
        contentContainerStyle={[
          styles.productsGrid,
          allCategoryProducts.length === 0 && styles.emptyProductsGrid
        ]}
        columnWrapperStyle={styles.productsRow}
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
  emptyProductsGrid: {
    flexGrow: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
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