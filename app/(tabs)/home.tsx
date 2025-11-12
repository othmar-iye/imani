import CustomButton from '@/components/CustomButton';
import CategorySection from '@/components/home/CategorySection';
import { EmptyDatabaseState } from '@/components/home/EmptyDatabaseState';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeSkeleton } from '@/components/home/HomeSkeleton';
import { LoadingSkeleton } from '@/components/home/LoadingSkeleton';
import { ProductsGridSection } from '@/components/home/ProductsGridSection';
import { PromoBanner } from '@/components/home/PromoBanner';
import { SearchBar } from '@/components/home/SearchBar';
import { SearchSpotlightModal } from '@/components/home/SearchSpotlightModal';
import SuggestionItem from '@/components/home/SuggestionItem';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Dimensions,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

// Import React Query
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

// Import des données
import { categories as categoriesData } from '@/src/data/categories';
import { featuredProducts, Product } from '@/src/data/products';

// Import i18n
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

// Fonction pour récupérer le statut vendeur
const fetchSellerStatus = async (user: any): Promise<SellerStatus> => {
  if (!user) return 'member';

  try {
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('verification_status')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erreur chargement statut vendeur:', error);
    }

    return getSellerStatus(userProfile?.verification_status);
  } catch (error) {
    console.error('Erreur lors du chargement du statut vendeur:', error);
    return 'member';
  }
};

const getSellerStatus = (verificationStatus: string | undefined): SellerStatus => {
  switch (verificationStatus) {
    case 'verified': return 'verified';
    case 'pending_review': return 'pending';
    case 'rejected': return 'rejected';
    default: return 'member';
  }
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

// Fonction API paginée
const fetchPaginatedProducts = async ({ pageParam = 0 }): Promise<{
  products: Product[];
  nextPage: number | null;
  hasMore: boolean;
}> => {
  const PAGE_SIZE = 6;
  const LOAD_MORE_SIZE = 4;
  
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
    }, 800);
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

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Theme.dark : Theme.light;
  const { t } = useTranslation();
  const { user } = useAuth();

  // États
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // React Query
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

  const { 
    data: categories, 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { 
    data: sellerStatus, 
    isLoading: statusLoading 
  } = useQuery({
    queryKey: ['seller-status', user?.id],
    queryFn: () => fetchSellerStatus(user),
    enabled: !!user,
  });

  // Mémo
  const allProducts = React.useMemo(() => {
    return data?.pages.flatMap(page => page.products) || [];
  }, [data]);

  const isEmptyDatabase = !productsLoading && allProducts.length === 0 && !hasNextPage;

  const searchSuggestions = React.useMemo(() => {
    if (isEmptyDatabase) return [];
    return generateSearchSuggestions(allProducts, 10);
  }, [allProducts, isEmptyDatabase]);

  // Handlers
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  // Filtrage des suggestions
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

  // Footer avec indicateur de chargement
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <LoadingSkeleton />;
  };

  // Fonction pour déterminer si on affiche le bouton
  const getEmptyDatabaseButton = () => {
    if (statusLoading) return null;
    
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
    
    return null;
  };

  // États de chargement et d'erreur
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
        {/* Header */}
        <HomeHeader theme={theme} />

        {/* CONTENU ADAPTATIF */}
        {isEmptyDatabase ? (
          // MODE BASE VIDE
          <EmptyDatabaseState 
            theme={theme}
            getEmptyDatabaseButton={getEmptyDatabaseButton}
          />
        ) : (
          // MODE NORMAL
          <View>
            {/* Barre de recherche */}
            <SearchBar onPress={handleSearchFocus} theme={theme} />

            {/* Bannière promotionnelle */}
            <PromoBanner theme={theme} />

            {/* Section Catégories */}
            <CategorySection categories={categories || []} />

            {/* Section Produits populaires */}
            <ProductsGridSection
              products={allProducts}
              theme={theme}
              renderFooter={renderFooter}
              handleLoadMore={handleLoadMore}
            />

            {/* Espace en bas */}
            <View style={{ height: 80, backgroundColor: theme.background }} />
          </View>
        )}
      </ScrollView>

      {/* Modal Spotlight - SEULEMENT EN MODE NORMAL */}
      {!isEmptyDatabase && (
        <SearchSpotlightModal
          visible={isSearchFocused}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredSuggestions={filteredSuggestions}
          theme={theme}
          colorScheme={colorScheme as 'light' | 'dark'}
          handleCancelPress={handleCancelPress}
          handleSearchSubmit={handleSearchSubmit}
          handleSuggestionPress={handleSuggestionPress}
          renderSuggestionItem={renderSuggestionItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Theme.light.background,
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