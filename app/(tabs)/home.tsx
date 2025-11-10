import { HomeSkeleton } from '@/components/HomeSkeleton';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

// Import des données - CHANGE MANUELLEMENT POUR TESTER :
import { featuredProducts, Product } from '@/src/data/products'; // ✅ BASE PLEINE
// import { featuredProducts, Product } from '@/src/data/productEmpty'; // ❌ BASE VIDE

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
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/supabase';
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

type SellerStatus = 'member' | 'pending' | 'verified' | 'rejected';

// Fonction pour récupérer le statut vendeur depuis la base de données
const fetchSellerStatus = async (user: any): Promise<SellerStatus> => {
  if (!user) {
    return 'member';
  }

  try {
    // Récupérer le profil utilisateur depuis la table user_profiles
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('verification_status')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erreur chargement statut vendeur:', error);
    }

    // Mapper le statut de vérification au statut vendeur (identique à ProfileScreen)
    return getSellerStatus(userProfile?.verification_status);
  } catch (error) {
    console.error('Erreur lors du chargement du statut vendeur:', error);
    return 'member';
  }
};

// Fonction pour mapper le statut de vérification (identique à ProfileScreen)
const getSellerStatus = (verificationStatus: string | undefined): SellerStatus => {
  switch (verificationStatus) {
    case 'verified':
      return 'verified';
    case 'pending_review':
      return 'pending';
    case 'rejected':
      return 'rejected';
    default:
      return 'member';
  }
};

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

// Fonction API paginée pour l'Infinite Scroll
const fetchPaginatedProducts = async ({ pageParam = 0 }): Promise<{
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
      const startIndex = offset;
      const endIndex = startIndex + limit;
      const paginatedProducts = featuredProducts.slice(startIndex, endIndex);
      
      const hasMore = endIndex < featuredProducts.length;
      const nextPage = hasMore ? pageParam + 1 : null;

      resolve({
        products: paginatedProducts,
        nextPage,
        hasMore
      });
    }, 800); // Simulation délai réseau
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

// Composant Skeleton pour le chargement Infinite Scroll
const LoadingSkeleton = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Theme.dark : Theme.light;

  return (
    <View style={styles.loadingSkeletonContainer}>
      {[1, 2].map((item) => (
        <View key={item} style={[styles.skeletonProductCard, { backgroundColor: theme.card }]}>
          <View style={[styles.skeletonImage, { backgroundColor: theme.border }]} />
          <View style={styles.skeletonContent}>
            <View style={[styles.skeletonText, { backgroundColor: theme.border }]} />
            <View style={[styles.skeletonTitle, { backgroundColor: theme.border }]} />
            <View style={[styles.skeletonPrice, { backgroundColor: theme.border }]} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Theme.dark : Theme.light;
  const { t } = useTranslation();
  const { user } = useAuth();

  // États simples
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Utilisation de React Query Infinite pour les produits
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: productsLoading,
    error: productsError,
  } = useInfiniteQuery({
    queryKey: ['featured-products-infinite'],
    queryFn: fetchPaginatedProducts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  // Utilisation de React Query pour les catégories
  const { 
    data: categories, 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // ✅ RÉCUPÉRATION DU STATUT VENDEUR DEPUIS LA BASE DE DONNÉES
  const { 
    data: sellerStatus, 
    isLoading: statusLoading 
  } = useQuery({
    queryKey: ['seller-status', user?.id],
    queryFn: () => fetchSellerStatus(user),
    enabled: !!user,
  });

  // Extraire tous les produits des pages
  const allProducts = React.useMemo(() => {
    return data?.pages.flatMap(page => page.products) || [];
  }, [data]);

  // ✅ CONDITION PRINCIPALE : Base de données vide ou non
  const isEmptyDatabase = !productsLoading && allProducts.length === 0 && !hasNextPage;

  // Génération des suggestions (vide si base vide)
  const searchSuggestions = React.useMemo(() => {
    if (isEmptyDatabase) return [];
    return generateSearchSuggestions(allProducts, 10);
  }, [allProducts, isEmptyDatabase]);

  // Gestion de l'Infinite Scroll
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  // Footer avec indicateur de chargement
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    
    return <LoadingSkeleton />;
  };

  // Fonction pour déterminer si on affiche le bouton et lequel
  const getEmptyDatabaseButton = () => {
    // Si le statut est encore en chargement, on n'affiche rien
    if (statusLoading) return null;
    
    // ✅ Seul le statut "verified" affiche le bouton
    if (sellerStatus === 'verified') {
      return (
        <CustomButton
          title={t('home.emptyDatabase.sellFirstItem')}
          onPress={() => router.push('/(tabs)/sell')}
          variant="primary"
          size="large"
          backgroundColor={theme.tint}
        />
      );
    }
    
    // ❌ Tous les autres statuts : pas de bouton
    return null;
  };

  // État de chargement initial - AVEC SKELETON ADAPTATIF
  if (productsLoading && allProducts.length === 0) {
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

            {/* CTA selon statut utilisateur - LOGIQUE DYNAMIQUE */}
            <View style={styles.ctaContainer}>
              {getEmptyDatabaseButton()}
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
                data={allProducts}
                renderItem={renderProductItem}
                keyExtractor={item => item.id}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.productsGrid}
                columnWrapperStyle={styles.productsRow}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
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
  // Styles pour le skeleton de chargement Infinite Scroll
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