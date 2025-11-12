// app/screens/homeOption/AllProductsScreen.tsx
import { AllProductsSkeleton } from '@/components/AllProducts/AllProductsSkeleton';
import { Header } from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
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

// Fonction API simulée pour tous les produits avec pagination
const fetchAllProducts = async ({ pageParam = 0 }): Promise<{
  products: Product[];
  nextPage: number | null;
  hasMore: boolean;
}> => {
  const PAGE_SIZE = 10;
  const offset = pageParam * PAGE_SIZE;

  return new Promise((resolve) => {
    setTimeout(() => {
      const paginatedProducts = featuredProducts.slice(offset, offset + PAGE_SIZE);
      const hasMore = offset + PAGE_SIZE < featuredProducts.length;
      const nextPage = hasMore ? pageParam + 1 : null;

      resolve({
        products: paginatedProducts,
        nextPage,
        hasMore
      });
    }, 800);
  });
};

export default function AllProductsScreen() {
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

  // Utilisation de React Query Infinite pour tous les produits
  const { 
    data, 
    isLoading: productsLoading, 
    error: productsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['all-products'],
    queryFn: fetchAllProducts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  // Extraire tous les produits des pages
  const allProducts = React.useMemo(() => {
    return data?.pages.flatMap(page => page.products) || [];
  }, [data]);

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      variant="search"
      showLocation={true}
      showSavings={false}
      showStatus={false}
      showStats={false}
    />
  );

  // Fonction pour charger plus de produits
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Footer avec indicateur de chargement
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <Ionicons name="ellipsis-horizontal" size={24} color={colors.tint} />
        <Text style={[styles.loadingFooterText, { color: colors.textSecondary }]}>
          {t('allProducts.loadingMore')}
        </Text>
      </View>
    );
  };

  // État de chargement - AVEC SKELETON
  if (productsLoading && allProducts.length === 0) {
    return <AllProductsSkeleton colors={{
      background: colors.background,
      card: colors.card,
      text: colors.text,
      textSecondary: colors.textSecondary,
      border: colors.border,
      tint: colors.tint
    }} />;
  }

  // État d'erreur
  if (productsError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          colors={colors}
          title={t('allProducts.title')}
          showBackButton={true}
          customPaddingTop={60}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.tint} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {t('allProducts.errorLoading')}
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
        title={t('allProducts.title')}
        showBackButton={true}
        customPaddingTop={60}
      />

      {/* En-tête avec description */}
      <View style={styles.infoSection}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          {t('allProducts.exploreAll')}
        </Text>
        <Text style={[styles.infoSubtitle, { color: colors.textSecondary }]}>
          {t('allProducts.description')}
        </Text>
      </View>

      {/* Compteur des produits */}
      <View style={styles.counterContainer}>
        <Text style={[styles.counterText, { color: colors.textSecondary }]}>
          {allProducts.length === 1 
            ? t('allProducts.productCount', { count: allProducts.length })
            : t('allProducts.productCount_plural', { count: allProducts.length })
          }
        </Text>
      </View>

      {/* Grid des produits avec infinite scroll */}
      <FlatList
        data={allProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        scrollEnabled={true}
        contentContainerStyle={[
          styles.productsGrid,
          allProducts.length === 0 && styles.emptyProductsGrid
        ]}
        columnWrapperStyle={styles.productsRow}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('allProducts.noProducts')}
            </Text>
          </View>
        }
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
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingFooterText: {
    fontSize: 14,
    fontWeight: '500',
  },
});