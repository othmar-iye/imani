// app/screens/homeOption/AllProductsScreen.tsx
import { AllProductsSkeleton } from '@/components/AllProductsSkeleton';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
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
        
        {/* Badge de promotion si applicable */}
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

        {/* Localisation */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
          <Text style={[styles.locationText, { color: colors.textSecondary }]}>
            {item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={colors.tint} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {t('allProducts.title')}
            </Text>
          </View>
        </View>
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
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={colors.tint} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('allProducts.title')}
          </Text>
        </View>
      </View>

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
  backButton: {
    padding: 4,
    marginRight: 12,
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
  emptyProductsGrid: {
    flexGrow: 1,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '500',
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