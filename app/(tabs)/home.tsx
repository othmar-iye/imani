import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View
} from 'react-native';

// Import React Query
import { useQuery } from '@tanstack/react-query';

// Import des données
import { featuredProducts, Product } from '@/src/data/products';

// Import du composant SuggestionItem
import SuggestionItem from '@/components/SuggestionItem';

// Import des categories
import { categories as categoriesData } from '@/src/data/categories';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface SearchSuggestion {
  id: string;
  type: 'recent' | 'trending' | 'category' | 'personal';
  title: string;
  subtitle?: string;
  icon?: string;
}

// Composant ProductCard
const ProductCard = ({ product }: { product: Product }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Theme.dark : Theme.light;

  return (
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
        params: { productId: product.id }
      })}
    >
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: product.image }} 
          style={styles.productImage}
          resizeMode="cover"
        />
        
        {product.discount > 0 && (
          <View style={[styles.discountBadge, { backgroundColor: theme.tint }]}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
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
            name={product.isFavorite ? "heart" : "heart-outline"} 
            size={16} 
            color={product.isFavorite ? theme.tint : '#8E8E93'} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.productContent}>
        <Text style={[styles.productCategory, { color: theme.tabIconDefault }]} numberOfLines={1}>
          {product.category}
        </Text>
        
        <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={[styles.currentPrice, { color: theme.tint }]}>
            ${product.price}
          </Text>
          {product.originalPrice > product.price && (
            <Text style={[styles.originalPrice, { color: theme.tabIconDefault }]}>
              ${product.originalPrice}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Fonction pour générer les suggestions de recherche à partir des produits
const generateSearchSuggestions = (products: Product[]): SearchSuggestion[] => {
  return products.map(product => ({
    id: product.id, // Utilise l'ID du produit
    type: 'recent', // Type fixe pour toutes les suggestions
    title: product.name, // Utilise le nom du produit comme titre
    subtitle: product.category, // Utilise la catégorie du produit comme sous-titre
    icon: 'time-outline' // Icône fixe pour toutes les suggestions
  }));
};

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
      // Transformer les données depuis categories.ts vers le format attendu
      const transformedCategories: Category[] = [
        { id: '0', name: 'Tous', icon: 'apps' },
        ...categoriesData.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon as keyof typeof Ionicons.glyphMap
        }))
      ];
      resolve(transformedCategories);
    }, 500);
  });
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Theme.dark : Theme.light;

  // États simples
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Utilisation de React Query pour les produits
  const { 
    data: products, 
    isLoading: productsLoading, 
    error: productsError 
  } = useQuery({
    queryKey: ['featured-products'],
    queryFn: fetchFeaturedProducts,
  });

  // Utilisation de React Query pour les catégories
  const { 
    data: categories, 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Génération des suggestions de recherche à partir des produits
  const searchSuggestions = products ? generateSearchSuggestions(products) : [];

  // Gestion simple et fiable de la recherche
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  // CORRECTION : Fonction closeSearch améliorée
  const closeSearch = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
    // Fermer le keyboard après un petit délai pour la fluidité
    setTimeout(() => {
      Keyboard.dismiss();
    }, 100);
  };

  // CORRECTION : Fonction handleSearchSubmit améliorée
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      console.log('Recherche lancée:', searchQuery);
      
      // Fermer IMMÉDIATEMENT la modal
      setIsSearchFocused(false);
      
      // Redirection IMMÉDIATE sans attendre la fermeture complète
      setTimeout(() => {
        router.push({
          pathname: '/screens/homeOption/SearchResultsScreen',
          params: { 
            query: searchQuery.trim(),
            searchType: 'text'
          }
        });
      }, 10);
    }
  };

  // CORRECTION : Fonction handleSuggestionPress améliorée
  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    // Fermer IMMÉDIATEMENT la modal sans attendre
    setIsSearchFocused(false);
    
    // Redirection IMMÉDIATE sans délai
    setTimeout(() => {
      router.push({
        pathname: '/screens/ProductDetailScreen',
        params: { productId: suggestion.id }
      });
    }, 10);
  };

  // CORRECTION : Fonction pour le bouton Annuler
  const handleCancelPress = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  // Filtrer les suggestions basées sur la requête de recherche
  const filteredSuggestions = searchQuery 
    ? searchSuggestions.filter(suggestion => 
        suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suggestion.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchSuggestions;

  // Rendu d'un élément de suggestion utilisant le composant SuggestionItem
  const renderSuggestionItem = ({ item }: { item: SearchSuggestion }) => (
    <SuggestionItem
      item={item}
      onPress={handleSuggestionPress}
      theme={theme}
      colorScheme={colorScheme as 'light' | 'dark'}
    />
  );

  // Rendu d'un élément produit
  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  // Rendu d'un élément catégorie
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

  // État de chargement
  if (productsLoading || categoriesLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Chargement...
        </Text>
      </View>
    );
  }

  // État d'erreur
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
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={[styles.scrollView, { backgroundColor: theme.background }]} 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header avec localisation et notifications */}
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <View style={styles.locationContainer}>
            <Text style={[styles.locationText, { color: theme.text }]}>Bienvenue</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton} 
            onPress={() => router.push('/screens/homeOption/NotificationsScreen')}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.text} />
            <View style={[styles.notificationBadge, { backgroundColor: '#EF4444' }]} />
          </TouchableOpacity>
        </View>

        {/* Barre de recherche */}
        <View style={[styles.searchSection, { backgroundColor: theme.background }]}>
          <TouchableOpacity 
            style={[styles.searchContainer, { 
              backgroundColor: colorScheme === 'dark' ? theme.card : '#eee',
              borderColor: Theme.light.borderInput
            }]}
            onPress={handleSearchFocus}
          >
            <Ionicons name="search" size={18} color={Theme.light.border} style={styles.searchIcon} />
            <Text style={[styles.searchPlaceholder, { color: Theme.light.border }]}>
              Rechercher des produits...
            </Text>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => router.push('/screens/homeOption/FiltersScreen')}
            >
              <Ionicons name="options-outline" size={22} color={Theme.light.border} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Contenu principal */}
        <View>
          {/* Bannière promotionnelle */}
          <View style={[styles.promoBanner, { backgroundColor: theme.tint }]}>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Soldes d'Été</Text>
              <Text style={styles.promoSubtitle}>Jusqu'à 50% de réduction</Text>
              <TouchableOpacity 
                style={[styles.promoButton, { backgroundColor: 'white' }]}
                onPress={() => router.push('/screens/homeOption/SalesScreen')}
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

          {/* Section Catégories */}
          <View style={[styles.section, { backgroundColor: theme.background }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Catégories</Text>
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

          {/* Section Produits populaires */}
          <View style={[styles.section, { backgroundColor: theme.background }]}>
            <View style={styles.sectionHeader}>
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

          {/* Espace en bas pour éviter que le contenu soit caché */}
          <View style={{ height: 80, backgroundColor: theme.background }} />
        </View>
      </ScrollView>

      {/* Modal Spotlight - Version améliorée */}
      <Modal
        visible={isSearchFocused}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCancelPress}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={handleCancelPress}>
            <View style={[
              styles.overlay,
              { 
                backgroundColor: colorScheme === 'dark' 
                  ? 'rgba(0,0,0,0.85)' 
                  : 'rgba(0,0,0,0.7)',
              }
            ]} />
          </TouchableWithoutFeedback>
          
          <View style={styles.spotlightContainer}>
            {/* Barre de recherche spotlight */}
            <View style={styles.spotlightHeader}>
              <View style={[
                styles.spotlightSearchContainer,
                { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF' }
              ]}>
                <Ionicons name="search" size={20} color={theme.tint} style={styles.spotlightSearchIcon} />
                
                <TextInput
                  style={[styles.spotlightSearchInput, { color: theme.text }]}
                  placeholder="Rechercher des produits..."
                  placeholderTextColor={theme.tabIconDefault}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                  onSubmitEditing={handleSearchSubmit}
                  returnKeyType="search"
                />
                
                {/* CORRECTION : Utiliser handleCancelPress pour le bouton Annuler */}
                <TouchableOpacity onPress={handleCancelPress} style={styles.cancelButton}>
                  <Text style={[styles.cancelText, { color: theme.tint }]}>
                    Annuler
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Suggestions de recherche */}
            <View style={[
              styles.suggestionsContainer,
              { backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF' }
            ]}>
              <FlatList
                data={filteredSuggestions}
                renderItem={renderSuggestionItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  searchPlaceholder: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    fontWeight: '500',
  },
  filterButton: {
    padding: 6,
  },
  // Styles Spotlight
  modalContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  spotlightContainer: {
    flex: 1,
    paddingTop: 60,
  },
  spotlightHeader: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  spotlightSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  spotlightSearchIcon: {
    marginRight: 12,
  },
  spotlightSearchInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    paddingVertical: 4,
  },
  cancelButton: {
    marginLeft: 12,
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '500',
  },
  suggestionsContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  suggestionsList: {
    paddingVertical: 8,
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
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    height: 200,
  },
  productImage: {
    width: '100%',
    height: '100%',
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 3,
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