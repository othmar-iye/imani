import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

// Import React Query
import { useQuery } from '@tanstack/react-query';

// Import des données
import { featuredProducts, Product } from '@/src/data/products';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// Fonctions API simulées
const fetchFeaturedProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(featuredProducts);
    }, 1000);
  });
};

const fetchCategories = async (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Tous', icon: 'apps' },
        { id: '2', name: 'Vêtements', icon: 'shirt' },
        { id: '3', name: 'Électronique', icon: 'phone-portrait' },
        { id: '4', name: 'Maison', icon: 'home' },
        { id: '5', name: 'Sports', icon: 'basketball' },
        { id: '6', name: 'Beauté', icon: 'sparkles' }
      ]);
    }, 500);
  });
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Theme.dark : Theme.light;

  // Utilisation de React Query
  const { 
    data: products, 
    isLoading: productsLoading, 
    error: productsError 
  } = useQuery({
    queryKey: ['featured-products'],
    queryFn: fetchFeaturedProducts,
  });

  const { 
    data: categories, 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

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
        >
          <Ionicons 
            name={item.isFavorite ? "heart" : "heart-outline"} 
            size={16} 
            color={item.isFavorite ? theme.tint : '#8E8E93'} 
          />
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
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item, index }: { item: Category; index: number }) => (
    <TouchableOpacity style={[
      styles.categoryCard,
      { backgroundColor: index === 0 ? theme.tint : theme.card },
    ]}>
      <View style={[
        styles.categoryIcon,
        { 
          backgroundColor: index === 0 ? theme.card : colorScheme === 'dark' ? '#2A2A2A' : '#F7F7F7',
        }
      ]}>
        <Ionicons 
          name={item.icon} 
          size={20} 
          color={index === 0 ? theme.tint : theme.tint} 
        />
      </View>
      <Text style={[
        styles.categoryName,
        { color: index === 0 ? theme.card : theme.text }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // États de chargement
  if (productsLoading || categoriesLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Chargement...
        </Text>
      </View>
    );
  }

  // Gestion d'erreur
  if (productsError) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.tint} />
        <Text style={[styles.errorText, { color: theme.text }]}>
          Erreur de chargement
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.tint }]}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      style={[styles.scrollView, { backgroundColor: theme.background }]} 
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View style={styles.locationContainer}>
          <Text style={[styles.locationText, { color: theme.text }]}>Bienvenue</Text>
        </View>
        <TouchableOpacity 
            style={styles.notificationButton} 
            onPress={() => router.push('/screens/NotificationsScreen')}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.text} />
          <View style={[styles.notificationBadge, { backgroundColor: '#EF4444' }]} />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      <View style={[styles.searchSection, { backgroundColor: theme.background }]}>
        <View style={[styles.searchContainer, { 
          backgroundColor: colorScheme === 'dark' ? theme.card : '#eee',
          borderColor: Theme.light.borderInput
        }]}>
          <Ionicons name="search" size={18} color={Theme.light.border} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: Theme.light.border }]}
            placeholder="Rechercher des produits..."
            placeholderTextColor={Theme.light.border}
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => router.push('/screens/FiltersScreen')}
          >
            <Ionicons name="options-outline" size={22} color={Theme.light.border} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bannière promotionnelle */}
      <View style={[styles.promoBanner, { 
        backgroundColor: theme.tint,
      }]}>
        <View style={styles.promoContent}>
          <Text style={styles.promoTitle}>Soldes d'Été</Text>
          <Text style={styles.promoSubtitle}>Jusqu'à 50% de réduction</Text>
          <TouchableOpacity 
            style={[styles.promoButton, { backgroundColor: 'white' }]}
            onPress={() => router.push('/screens/SalesScreen')}
          >
            <Text style={[styles.promoButtonText, { color: theme.tint }]}>Découvrir</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.promoImageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=300&h=300&fit=crop' }}
            style={styles.promoImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Catégories */}
      <View style={[styles.section, { backgroundColor: theme.background }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Catégories</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: theme.tint }]}>Tout voir</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Produits populaires */}
      <View style={[styles.section, { backgroundColor: theme.background }]}>
        <View style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Produits populaires</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: theme.tint }]}>Tout voir</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.productsRow}
        />
      </View>

      {/* Espace pour la bottom navigation */}
      <View style={{ height: 80, backgroundColor: theme.background }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 60,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    padding: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    fontWeight: '500',
  },
  filterButton: {
    padding: 6,
  },
  promoBanner: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
    zIndex: 2,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  promoSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
    fontWeight: '500',
  },
  promoButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  promoImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 16,
    zIndex: 1,
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    minWidth: 80,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  productsGrid: {
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  productsRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  productCard: {
    width: (width - 60) / 2,
    borderRadius: 20,
    marginBottom: 20,
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
    marginBottom: 16,
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