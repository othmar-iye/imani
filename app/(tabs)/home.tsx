import { HomeSkeleton } from '@/components/HomeSkeleton';
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

// Import des données - CHANGE MANUELLEMENT POUR TESTER :
// import { featuredProducts, Product } from '@/src/data/products'; // ✅ BASE PLEINE
import { featuredProducts, Product } from '@/src/data/productEmpty'; // ❌ BASE VIDE

// Import du composant SuggestionItem
import SuggestionItem from '@/components/SuggestionItem';

// Import du composant CategorySection
import CategorySection from '@/components/CategorySection';

// Import du composant CustomButton
import CustomButton from '@/components/CustomButton';

// Import des categories
import { categories as categoriesData } from '@/src/data/categories';

// Import i18n
import { NotificationIcon } from '@/components/NotificationIcon';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories: string[];
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
  const { t } = useTranslation();

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

// Fonction pour générer des suggestions
const generateSearchSuggestions = (products: Product[], limit: number = 10): SearchSuggestion[] => {
  if (!products || products.length === 0) return [];
  
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  const randomProducts = shuffled.slice(0, limit);
  
  return randomProducts.map(product => ({
    id: product.id,
    type: 'trending',
    title: product.name,
    subtitle: product.category,
    icon: 'trending-up-outline'
  }));
};

// Fonctions API simulées
const fetchFeaturedProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(featuredProducts); // Retourne selon l'import choisi
    }, 1000);
  });
};

const fetchCategories = async (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allCategory: Category = {
        id: 'all',
        name: 'Tous',
        icon: 'apps-outline',
        subCategories: []
      };
      resolve([allCategory, ...categoriesData]);
    }, 500);
  });
};

// SIMULATION : Statut utilisateur
const userStatus = {
  isVerified: false, // Change à true pour tester les deux cas
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Theme.dark : Theme.light;
  const { t } = useTranslation();

  // États simples
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Utilisation de React Query pour les produits
  const { 
    data: products = [], 
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

  // ✅ CONDITION PRINCIPALE : Base de données vide ou non
  const isEmptyDatabase = !productsLoading && products.length === 0;

  // Génération des suggestions (vide si base vide)
  const searchSuggestions = React.useMemo(() => {
    if (isEmptyDatabase) return [];
    return generateSearchSuggestions(products, 10);
  }, [products, isEmptyDatabase]);

  // Gestion de la recherche
  const handleSearchFocus = () => setIsSearchFocused(true);

  const closeSearch = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
    setTimeout(() => Keyboard.dismiss(), 100);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
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

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    setIsSearchFocused(false);
    setTimeout(() => {
      router.push({
        pathname: '/screens/ProductDetailScreen',
        params: { productId: suggestion.id }
      });
    }, 10);
  };

  const handleCancelPress = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  // Filtrer les suggestions
  const filteredSuggestions = searchQuery 
    ? searchSuggestions.filter(suggestion => 
        suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suggestion.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchSuggestions;

  // Rendu des suggestions
  const renderSuggestionItem = ({ item }: { item: SearchSuggestion }) => (
    <SuggestionItem
      item={item}
      onPress={handleSuggestionPress}
      theme={theme}
      colorScheme={colorScheme as 'light' | 'dark'}
    />
  );

  // Rendu des produits
  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  // État de chargement - AVEC SKELETON ADAPTATIF
  if (productsLoading || categoriesLoading) {
    return <HomeSkeleton 
      colors={{
        background: theme.background,
        card: theme.card,
        text: theme.text,
        textSecondary: theme.tabIconDefault,
        border: theme.border,
        tint: theme.tint
      }} 
      isEmptyDatabase={isEmptyDatabase}
    />;
  }

  // État d'erreur
  if (productsError) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.tint} />
        <Text style={[styles.errorText, { color: theme.text }]}>
          {t('home.errorLoading')}
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.tint }]}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryButtonText}>{t('home.retry')}</Text>
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
        {/* Header avec localisation et notifications - TOUJOURS VISIBLE */}
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <View style={styles.locationContainer}>
            <Text style={[styles.locationText, { color: theme.text }]}>
              {t('home.welcome')} 
            </Text>
          </View>
          <NotificationIcon color={theme.text} size={24} />
        </View>

        {/* CONTENU ADAPTATIF - Condition base vide */}
        {isEmptyDatabase ? (
          // ✅ MODE BASE VIDE - Écran d'accueil spécial
          <View style={styles.emptyDatabaseContainer}>
            
            {/* Illustration vide */}
            <View style={styles.emptyIllustration}>
              <Ionicons name="storefront-outline" size={120} color={theme.tabIconDefault} />
            </View>

            {/* Message principal */}
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {t('home.emptyDatabase.title')}
            </Text>
            
            <Text style={[styles.emptySubtitle, { color: theme.tabIconDefault }]}>
              {t('home.emptyDatabase.subtitle')}
            </Text>

            {/* CTA selon statut utilisateur */}
            <View style={styles.ctaContainer}>
              {userStatus.isVerified ? (
                // ✅ Utilisateur vérifié - Peut vendre directement
                <CustomButton
                  title={t('home.emptyDatabase.sellFirstItem')}
                  onPress={() => router.push('/(tabs)/sell')}
                  variant="primary"
                  size="large"
                  backgroundColor={theme.tint}
                />
              ) : (
                // ❌ Utilisateur non vérifié - Doit devenir vendeur
                <CustomButton
                  title={t('home.emptyDatabase.becomeSeller')}
                  onPress={() => router.push('/screens/ProfileSettingsScreen')}
                  variant="primary"
                  size="large"
                  backgroundColor={theme.tint}
                />
              )}
            </View>
          </View>
        ) : (
          // ✅ MODE NORMAL - Base avec produits
          <View>
            {/* Barre de recherche - SEULEMENT EN MODE NORMAL */}
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
                  {t('home.searchPlaceholder')}
                </Text>
                <TouchableOpacity 
                  style={styles.filterButton}
                  onPress={() => router.push('/screens/homeOption/FiltersScreen')}
                >
                  <Ionicons name="options-outline" size={22} color={Theme.light.border} />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>

            {/* Bannière promotionnelle */}
            <View style={[styles.promoBanner, { backgroundColor: theme.tint }]}>
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>{t('home.summerSales')}</Text>
                <Text style={styles.promoSubtitle}>{t('home.upToDiscount')}</Text>
                <TouchableOpacity 
                  style={[styles.promoButton, { backgroundColor: 'white' }]}
                  onPress={() => router.push('/screens/homeOption/SalesScreen')}
                >
                  <Text style={[styles.promoButtonText, { color: theme.tint }]}>
                    {t('home.discover')}
                  </Text>
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
            <CategorySection categories={categories || []} />

            {/* Section Produits populaires */}
            <View style={[styles.section, { backgroundColor: theme.background }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t('home.popularProducts')}
                </Text>
                <TouchableOpacity>
                  <Text style={[styles.seeAllText, { color: theme.tint }]}>
                    {t('home.seeAll')}
                  </Text>
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

            {/* Espace en bas */}
            <View style={{ height: 80, backgroundColor: theme.background }} />
          </View>
        )}
      </ScrollView>

      {/* Modal Spotlight - SEULEMENT EN MODE NORMAL */}
      {!isEmptyDatabase && (
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
              <View style={styles.spotlightHeader}>
                <View style={[
                  styles.spotlightSearchContainer,
                  { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF' }
                ]}>
                  <Ionicons name="search" size={20} color={theme.tint} style={styles.spotlightSearchIcon} />
                  
                  <TextInput
                    style={[styles.spotlightSearchInput, { color: theme.text }]}
                    placeholder={t('home.searchPlaceholder')}
                    placeholderTextColor={theme.tabIconDefault}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                    onSubmitEditing={handleSearchSubmit}
                    returnKeyType="search"
                  />
                  
                  <TouchableOpacity onPress={handleCancelPress} style={styles.cancelButton}>
                    <Text style={[styles.cancelText, { color: theme.tint }]}>
                      {t('home.cancel')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[
                styles.suggestionsContainer,
                { backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF' }
              ]}>
                {filteredSuggestions.length > 0 ? (
                  <FlatList
                    data={filteredSuggestions}
                    renderItem={renderSuggestionItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.suggestionsList}
                    keyboardShouldPersistTaps="handled"
                  />
                ) : (
                  <View style={styles.noResultsContainer}>
                    <Ionicons name="search-outline" size={48} color={theme.tabIconDefault} />
                    <Text style={[styles.noResultsText, { color: theme.tabIconDefault }]}>
                      {t('home.noResults')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // NOUVEAUX STYLES POUR MODE VIDE
  emptyDatabaseContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: 'center',
  },
  emptyIllustration: {
    marginBottom: 40,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  ctaContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    gap: 12,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },

  // Styles existants...
  scrollView: {
    flex: 1,
    backgroundColor: Theme.light.background,
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
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    textAlign: 'center',
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