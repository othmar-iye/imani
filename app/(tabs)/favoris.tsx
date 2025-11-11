import { FavoritesSkeleton } from '@/components/FavoritesSkeleton';
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
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';

// Import des données - CHANGE MANUELLEMENT POUR TESTER :
import { featuredProducts, Product } from '@/src/data/products'; // ✅ BASE PLEINE
// import { featuredProducts, Product } from '@/src/data/productEmpty'; // ❌ BASE VIDE

// Import du composant ProductCard
import ProductCard from '@/components/ProductCard';

// Import i18n
import CustomButton from '@/components/CustomButton';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/supabase';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

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

    // Mapper le statut de vérification au statut vendeur
    return getSellerStatus(userProfile?.verification_status);
  } catch (error) {
    console.error('Erreur lors du chargement du statut vendeur:', error);
    return 'member';
  }
};

// Fonction pour mapper le statut de vérification
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

// FONCTION AVEC PAGINATION POUR L'INFINITE SCROLL
const fetchFavoriteProductsPaginated = async ({ pageParam = 0 }): Promise<{
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
      // Filtrer seulement les produits favoris
      const allFavorites = featuredProducts.filter(product => product.isFavorite);
      
      const startIndex = offset;
      const endIndex = startIndex + limit;
      const paginatedFavorites = allFavorites.slice(startIndex, endIndex);
      
      const hasMore = endIndex < allFavorites.length;
      const nextPage = hasMore ? pageParam + 1 : null;

      resolve({
        products: paginatedFavorites,
        nextPage,
        hasMore
      });
    }, 800);
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

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Theme.dark : Theme.light;
  const isDark = colorScheme === 'dark';
  const { t } = useTranslation();
  const { user } = useAuth();

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

  // ✅ UTILISATION DE REACT QUERY INFINITE POUR LES FAVORIS
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: favoritesLoading,
    error: favoritesError,
    refetch
  } = useInfiniteQuery({
    queryKey: ['favorite-products-infinite'],
    queryFn: fetchFavoriteProductsPaginated,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Extraire tous les favoris des pages
  const allFavoriteProducts = React.useMemo(() => {
    return data?.pages.flatMap(page => page.products) || [];
  }, [data]);

  // ✅ CONDITIONS PRINCIPALES
  const isEmptyDatabase = !favoritesLoading && featuredProducts.length === 0;
  const hasNoFavorites = !favoritesLoading && allFavoriteProducts.length === 0 && featuredProducts.length > 0;

  // ✅ GESTION DE L'INFINITE SCROLL
  const handleLoadMore = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ✅ FOOTER AVEC INDICATEUR DE CHARGEMENT
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    
    return <LoadingSkeleton />;
  };

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

  // Fonction pour déterminer si on affiche le bouton et lequel
  const getEmptyDatabaseButton = () => {
    // Si le statut est encore en chargement, on n'affiche rien
    if (statusLoading) return null;
    
    // ✅ Seul le statut "verified" affiche le bouton
    if (sellerStatus === 'verified') {
      return (
        <CustomButton
          title={t('favorites.emptyDatabase.sellFirstItem')}
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

  // États de chargement - AVEC SKELETON ADAPTATIF
  if (favoritesLoading && allFavoriteProducts.length === 0) {
    return <FavoritesSkeleton colors={{
      background: theme.background,
      card: theme.card,
      text: theme.text,
      textSecondary: colors.textSecondary,
      border: theme.border,
      tint: theme.tint
    }} isEmptyDatabase={isEmptyDatabase} />;
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

  // Composant Empty State unifié
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      {isEmptyDatabase ? (
        // ✅ MODE BASE VIDE - Pas de produits du tout dans l'app
        <View style={styles.emptyDatabaseContent}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.card }]}>
            <Ionicons name="storefront-outline" size={48} color={theme.tabIconDefault} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            {t('favorites.emptyDatabase.title')}
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.tabIconDefault }]}>
            {t('favorites.emptyDatabase.subtitle')}
          </Text>
          
          {/* CTA selon statut utilisateur - NOUVELLE LOGIQUE */}
          <View style={styles.ctaContainer}>
            {getEmptyDatabaseButton()}
          </View>
        </View>
      ) : (
        // ✅ MODE NORMAL - Base avec produits mais pas de favoris
        <View style={styles.noFavoritesContent}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.card }]}>
            <Ionicons name="heart-outline" size={48} color={theme.tabIconDefault} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            {t('favorites.emptyTitle')}
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.tabIconDefault }]}>
            {t('favorites.emptySubtitle')}
          </Text>
          
          {/* CTA pour découvrir des produits */}
          <TouchableOpacity 
            style={[styles.secondaryButton, { 
              borderColor: theme.tint,
              backgroundColor: theme.card 
            }]}
            onPress={() => router.push('/(tabs)/home')}
          >
            <Ionicons name="compass-outline" size={20} color={theme.tint} />
            <Text style={[styles.secondaryButtonText, { color: theme.tint }]}>
              {t('favorites.exploreProducts')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
              {isEmptyDatabase ? 
                t('favorites.emptyDatabase.title') : 
                t('favorites.count', { count: allFavoriteProducts.length })
              }
            </Text>
          </View>
        </View>
      </View>

      {/* CONTENU ADAPTATIF - Condition base vide ou pas de favoris */}
      {isEmptyDatabase || hasNoFavorites ? (
        <EmptyState />
      ) : (
        // ✅ MODE NORMAL - Avec des favoris + INFINITE SCROLL
        <FlatList
          data={allFavoriteProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          numColumns={2}
          scrollEnabled={true}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.productsRow}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      )}
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
  // Empty States
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyDatabaseContent: {
    alignItems: 'center',
  },
  noFavoritesContent: {
    alignItems: 'center',
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
    marginBottom: 32,
  },
  ctaContainer: {
    width: '100%',
    gap: 16,
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
    width: '100%',
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
  // NOUVEAUX STYLES POUR L'INFINITE SCROLL
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