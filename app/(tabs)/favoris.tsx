import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

// Import React Query
import { useQuery } from '@tanstack/react-query';

// Import des données
import { featuredProducts, Product } from '@/src/data/products';

// Import du composant ProductCard
import ProductCard from '@/components/ProductCard';

// Import i18n
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

// Fonction API simulée pour les favoris
const fetchFavoriteProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filtrer seulement les produits favoris
      const favorites = featuredProducts.filter(product => product.isFavorite);
      resolve(favorites);
    }, 800);
  });
};

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Theme.dark : Theme.light;
  const isDark = colorScheme === 'dark';
  const { t } = useTranslation();

  const colors = {
      background: isDark ? Theme.dark.background : Theme.light.background,
      card: isDark ? Theme.dark.card : Theme.light.card,
      text: isDark ? Theme.dark.text : Theme.light.text,
      textSecondary: isDark ? '#8E8E93' : '#666666',
      border: isDark ? Theme.dark.border : Theme.light.border,
      tint: isDark ? Theme.dark.tint : Theme.light.tint,
      gradientStart: isDark ? '#6366F1' : '#8B5CF6',
      gradientEnd: isDark ? '#EC4899' : '#F59E0B',
    };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Utilisation de React Query comme dans la Home
  const { 
    data: favoriteProducts = [], 
    isLoading: favoritesLoading, 
    error: favoritesError,
    refetch
  } = useQuery({
    queryKey: ['favorite-products'],
    queryFn: fetchFavoriteProducts,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleFavorite = (productId: string) => {
    // Ici tu pourrais implémenter la logique pour retirer des favoris
    // Pour l'instant, on simule en refetchant les données
    refetch();
  };

  // Composant ProductCard avec localisation pour les favoris
  const ProductCardWithLocation = ({ product }: { product: Product }) => (
    <View>
      <ProductCard product={product} />
    </View>
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCardWithLocation product={item} />
  );

  // États de chargement
  if (favoritesLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>
          {t('loading')}
        </Text>
      </View>
    );
  }

  // Gestion d'erreur
  if (favoritesError) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.tint} />
        <Text style={[styles.errorText, { color: theme.text }]}>
          {t('home.errorLoading')}
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.tint }]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>{t('home.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const EmptyFavorites = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, { backgroundColor: theme.card }]}>
        <Ionicons name="heart-outline" size={48} color={theme.tabIconDefault} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        {t('favorites.emptyTitle')}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.tabIconDefault }]}>
        {t('favorites.emptySubtitle')}
      </Text>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.background, opacity: fadeAnim }]}>
      {/* Header inspiré du Chat - Sans tabs */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {t('tabs.favorites')}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {t('favorites.count', { count: favoriteProducts.length })}
            </Text>
          </View>
        </View>
      </View>

      {/* Grid des produits - Même design que SalesScreen */}
      <FlatList
        data={favoriteProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        scrollEnabled={true}
        contentContainerStyle={styles.productsGrid}
        columnWrapperStyle={styles.productsRow}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        ListEmptyComponent={
          favoriteProducts.length === 0 ? <EmptyFavorites /> : null
        }
      />
    </Animated.View>
  );
}

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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
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
});