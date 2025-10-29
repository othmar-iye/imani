import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
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
import { useQuery } from '@tanstack/react-query';

// Import des données
import { featuredProducts, Product } from '@/src/data/products';

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

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={[
        styles.productCard, 
        { 
          backgroundColor: theme.card,
          shadowColor: colorScheme === 'dark' ? '#000' : '#8E8E93',
        }
      ]}
      activeOpacity={0.9}
      onPress={() => router.push({
        pathname: '/screens/ProductDetailScreen',
        params: { productId: item.id }
      })}
    >
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.productImage}
          resizeMode="cover"
        />
        
        <View style={[
          styles.imageOverlay,
          { 
            backgroundColor: colorScheme === 'dark' 
              ? 'rgba(0,0,0,0.3)' 
              : 'rgba(255,255,255,0.1)'
          }
        ]} />
        
        {item.discount > 0 && (
          <View style={[styles.discountBadge, { backgroundColor: theme.tint }]}>
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={[
            styles.favoriteButton, 
            { 
              backgroundColor: colorScheme === 'dark' 
                ? 'rgba(255,255,255,0.9)' 
                : 'rgba(255,255,255,0.9)',
            }
          ]}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons name="heart" size={16} color={theme.tint} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.productContent}>
        <Text style={[styles.productCategory, { color: theme.tabIconDefault }]} numberOfLines={1}>
          {item.category}
        </Text>
        
        <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.priceRatingContainer}>
          <View style={styles.priceContainer}>
            <Text style={[styles.currentPrice, { color: theme.tint }]}>
              ${item.price}
            </Text>
            {item.originalPrice > item.price && (
              <Text style={[styles.originalPrice, { color: theme.tabIconDefault }]}>
                ${item.originalPrice}
              </Text>
            )}
          </View>
        </View>

        {/* Économie réalisée */}
        <View style={styles.savingsContainer}>
          <Text style={[styles.savingsText, { color: theme.tint }]}>
            Économie: ${(item.originalPrice - item.price).toFixed(2)}
          </Text>
        </View>

        {/* Localisation et vendeur */}
        <View style={styles.productMeta}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color={theme.tabIconDefault} />
            <Text style={[styles.locationText, { color: theme.tabIconDefault }]} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          
        </View>
      </View>
    </TouchableOpacity>
  );

  // États de chargement
  if (favoritesLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Chargement des favoris...
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
          Erreur de chargement des favoris
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.tint }]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
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
        Aucun favori
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.tabIconDefault }]}>
        Les produits que vous ajoutez à vos favoris apparaîtront ici
      </Text>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.background, opacity: fadeAnim }]}>
      {/* Header inspiré du Chat - Sans tabs */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Favoris</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {favoriteProducts.length} produits sauvegardés
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
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
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
  // Grid des produits - Même design que SalesScreen
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
    borderRadius: 20,
    marginBottom: 16,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
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
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
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
    marginBottom: 8,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  locationText: {
    fontSize: 10,
    fontWeight: '500',
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
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
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