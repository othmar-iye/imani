// screens/FilterResultsScreen.tsx
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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

// Import des données réelles
import { featuredProducts, Product } from '@/src/data/products';

const { width } = Dimensions.get('window');

export default function FilterResultsScreen() {
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();

  const colors = {
    background: colorScheme === 'dark' ? Theme.dark.background : Theme.light.background,
    card: colorScheme === 'dark' ? Theme.dark.card : Theme.light.card,
    text: colorScheme === 'dark' ? Theme.dark.text : Theme.light.text,
    textSecondary: colorScheme === 'dark' ? '#8E8E93' : '#666666',
    border: colorScheme === 'dark' ? Theme.dark.border : Theme.light.border,
    tint: colorScheme === 'dark' ? Theme.dark.tint : Theme.light.tint,
  };

  // Récupérer les paramètres de filtre
  const categories = params.categories ? (params.categories as string).split(',') : [];
  const minPrice = params.minPrice ? parseInt(params.minPrice as string) : 0;
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice as string) : 1000;
  const city = params.city as string || '';
  const condition = params.condition as string || '';
  const sort = params.sort as string || 'popular';

  // Fonction pour filtrer les produits
  const getFilteredProducts = (): Product[] => {
    let filtered = featuredProducts.filter(product => {
      // Filtre par catégorie
      if (categories.length > 0 && !categories.includes(product.category)) {
        return false;
      }

      // Filtre par prix
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      // Filtre par ville (si la propriété existe dans vos données)
      if (city && product.location && !product.location.includes(city)) {
        return false;
      }

      // Filtre par condition
      if (condition && product.condition !== condition) {
        return false;
      }

      return true;
    });

    // Trier les résultats
    switch (sort) {
      case 'newest':
        // Trier par ID (supposant que les IDs plus récents sont plus grands)
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
      default:
        // Trier par vues ou par popularité
        filtered.sort((a, b) => b.views - a.views);
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Fonction pour générer le titre basé sur les filtres
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
        'new': 'Neuf',
        'like-new': 'Comme neuf',
        'good': 'Bon état',
        'fair': 'État correct'
      };
      parts.push(conditionLabels[condition] || condition);
    }

    return parts.length > 0 ? parts.join(' • ') : 'Tous les produits';
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
              Économie: ${(item.originalPrice - item.price).toFixed(2)}
            </Text>
          </View>
        )}

        {/* Localisation */}
        <Text style={[styles.locationText, { color: colors.textSecondary }]}>
          {item.location}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Composant pour l'état vide
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name="filter-outline" 
        size={64} 
        color={colors.textSecondary} 
      />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        Aucun produit trouvé
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
        Aucun produit ne correspond à vos critères de filtrage
      </Text>
      <TouchableOpacity 
        style={[styles.emptyStateButton, { backgroundColor: colors.tint }]}
        onPress={() => router.push('/screens/homeOption/FiltersScreen')}
      >
        <Text style={styles.emptyStateButtonText}>Modifier les filtres</Text>
      </TouchableOpacity>
    </View>
  );

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
            Résultats des filtres
          </Text>
        </View>

        {/* Bouton pour modifier les filtres */}
        <TouchableOpacity 
          style={styles.editFiltersButton}
          onPress={() => router.push('/screens/homeOption/FiltersScreen')}
        >
          <Ionicons name="options-outline" size={20} color={colors.tint} />
          <Text style={[styles.editFiltersText, { color: colors.tint }]}>
            Modifier
          </Text>
        </TouchableOpacity>
      </View>

      {/* En-tête avec les filtres appliqués */}
      <View style={styles.infoSection}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          {getFilterTitle()}
        </Text>
        <Text style={[styles.infoSubtitle, { color: colors.textSecondary }]}>
          {filteredProducts.length > 0 
            ? `Produits correspondant à vos critères`
            : `Aucun produit ne correspond à vos filtres`
          }
        </Text>
      </View>

      {/* Compteur des produits */}
      {filteredProducts.length > 0 && (
        <View style={styles.counterContainer}>
          <Text style={[styles.counterText, { color: colors.textSecondary }]}>
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Grid des produits ou état vide */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        scrollEnabled={true}
        contentContainerStyle={[
          styles.productsGrid,
          filteredProducts.length === 0 && styles.emptyContainer
        ]}
        columnWrapperStyle={filteredProducts.length > 0 ? styles.productsRow : undefined}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        ListEmptyComponent={renderEmptyState}
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
  editFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  editFiltersText: {
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 8,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationText: {
    fontSize: 11,
    fontWeight: '500',
    fontStyle: 'italic',
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
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});