// screens/MyItemsScreen.tsx (version avec React Query)
import CustomButton from '@/components/CustomButton';
import { MyItemsSkeleton } from '@/components/MyItemsSkeleton';
import ProductCardItem from '@/components/ProductCardItem';
import SearchBar from '@/components/SearchBar';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View
} from 'react-native';

// Import React Query
import { useQuery } from '@tanstack/react-query';

const { width, height } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  location: string;
  status: 'active' | 'sold' | 'pending' | 'rejected';
  views: number;
  likes: number;
  createdAt: string;
  isFavorite?: boolean;
  discount?: number;
  images?: string[];
  condition?: string;
  description?: string;
  product_state?: 'pending' | 'active' | 'rejected' | 'sold';
  thumbnail?: string; // ✅ AJOUT DE LA MINIATURE
}

// Fonction pour récupérer les produits de l'utilisateur
const fetchMyProducts = async (userId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  console.log('🔍 Produits trouvés:', data?.length);
  
  // Transformer les données avec gestion robuste des images
  return data.map(product => {
    // Gestion des images
    let imagesArray: string[] = [];
    
    if (typeof product.images === 'string') {
      try {
        imagesArray = JSON.parse(product.images);
      } catch (e) {
        console.error('❌ Erreur parsing JSON images:', e);
        imagesArray = [];
      }
    } else if (Array.isArray(product.images)) {
      imagesArray = product.images;
    }
    
    console.log(`📸 ${product.name}:`, {
      thumbnail: product.thumbnail ? '✅' : '❌',
      images: imagesArray.length,
      hasThumbnail: !!product.thumbnail
    });
    
    // ✅ PRIORITÉ À LA MINIATURE, sinon première image, sinon placeholder
    const displayImage = product.thumbnail || imagesArray[0] || 'https://via.placeholder.com/400?text=Image+Manquante';
    
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.price_discount || product.price,
      image: displayImage, // ✅ UTILISE LA MINIATURE OU PREMIÈRE IMAGE
      category: product.category,
      location: product.location,
      status: product.product_state || 'pending',
      views: product.views || 0,
      likes: product.likes || 0,
      createdAt: product.created_at,
      images: imagesArray,
      condition: product.condition,
      description: product.description,
      product_state: product.product_state,
      thumbnail: product.thumbnail // ✅ CONSERVE LA MINIATURE
    };
  });
};

export default function MyItemsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
    success: isDark ? '#34C759' : '#30D158',
    warning: isDark ? '#FFD60A' : '#FFD60A',
    error: isDark ? '#FF453A' : '#FF3B30',
    borderInput: isDark ? Theme.light.borderInput : Theme.light.borderInput,
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Animations
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // Utilisation de React Query pour les produits
  const { 
    data: myProducts = [], 
    isLoading: productsLoading, 
    error: productsError,
    refetch
  } = useQuery({
    queryKey: ['my-products', user?.id],
    queryFn: () => fetchMyProducts(user?.id || ''),
    enabled: !!user?.id,
  });

  const filteredProducts = myProducts.filter(product => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.location.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Configuration des statuts avec la nouvelle structure
  const getStatusConfig = (status: string) => {
    const configs = {
      active: { 
        color: colors.success, 
        icon: 'checkmark-circle-outline', 
        label: t('myItems.status.active', 'Actif') 
      },
      sold: { 
        color: colors.tint, 
        icon: 'cash-outline', 
        label: t('myItems.status.sold', 'Vendu') 
      },
      pending: { 
        color: colors.warning, 
        icon: 'time-outline', 
        label: t('myItems.status.pending', 'En attente') 
      },
      rejected: { 
        color: colors.error, 
        icon: 'close-circle-outline', 
        label: t('myItems.status.rejected', 'Rejeté') 
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  // État de chargement - AVEC SKELETON
  if (productsLoading) {
    return <MyItemsSkeleton colors={colors} />;
  }

  // État d'erreur
  if (productsError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.replace('/(tabs)/profile')}
          >
            <Ionicons name="chevron-back" size={24} color={colors.tint} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('myItems.title', 'Mes articles')}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.tint} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {t('Erreur de chargement des articles')}
          </Text>
          <CustomButton
            title={t('Réessayer')}
            onPress={() => refetch()}
            variant="primary"
            size="medium"
            style={styles.retryButton}
          />
        </View>
      </View>
    );
  }

  // Le reste du code reste identique pour les fonctions de gestion...
  const handleViewProduct = (productId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    closeModal();
    setTimeout(() => {
      Alert.alert('Voir', `Voir le produit ${productId}`);
    }, 200);
  };

  const handleEditProduct = (productId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    closeModal();
    setTimeout(() => {
      Alert.alert('Modifier', `Modifier le produit ${productId}`);
    }, 200);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    closeModal();
    setTimeout(() => {
      Alert.alert(
        t('myItems.deleteTitle', 'Supprimer l\'article'),
        t('myItems.deleteMessage', `Êtes-vous sûr de vouloir supprimer "${productName}" ?`),
        [
          { 
            text: t('cancel', 'Annuler'), 
            style: 'cancel',
            onPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          },
          { 
            text: t('delete', 'Supprimer'), 
            style: 'destructive', 
            onPress: async () => {
              try {
                const { error } = await supabase
                  .from('products')
                  .delete()
                  .eq('id', productId);

                if (error) throw error;

                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert(t('Succès'), t('Article supprimé avec succès'));
                refetch(); // Recharger la liste avec React Query
              } catch (error) {
                Alert.alert(t('Erreur'), t('Impossible de supprimer l\'article'));
              }
            }
          },
        ]
      );
    }, 200);
  };

  const handleLongPress = (product: Product) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedProduct(product);
    
    scaleAnim.setValue(0.9);
    opacityAnim.setValue(0);
    slideAnim.setValue(30);
    overlayOpacity.setValue(0);
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 250,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 250,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
    
    setIsModalVisible(true);
  };

  const closeModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
        damping: 20,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 30,
        useNativeDriver: true,
        damping: 20,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsModalVisible(false);
      setSelectedProduct(null);
    });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCardItem 
      product={item}
      onLongPress={() => handleLongPress(item)}
      colors={colors}
      getStatusConfig={getStatusConfig}
    />
  );

  const renderActionModal = () => (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={closeModal}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlayTouchable} />
        </TouchableWithoutFeedback>
        
        <Animated.View 
          style={[
            styles.modalContent,
            {
              opacity: opacityAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ]
            }
          ]}
        >
          {selectedProduct && (
            <>
              <View style={[
                styles.enlargedCard,
                { 
                  backgroundColor: colors.card,
                }
              ]}>
                <TouchableOpacity 
                  style={[
                    styles.closeButton,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }
                  ]}
                  onPress={closeModal}
                >
                  <Ionicons name="close" size={20} color={colors.text} />
                </TouchableOpacity>
                
                {/* ✅ AFFICHE LA MINIATURE DANS LA MODAL */}
                <Image 
                  source={{ uri: selectedProduct.thumbnail || selectedProduct.image }} 
                  style={styles.enlargedImage}
                  resizeMode="cover"
                />
                <View style={styles.enlargedContent}>
                  <Text style={[styles.enlargedName, { color: colors.text }]}>
                    {selectedProduct.name}
                  </Text>
                  <Text style={[styles.enlargedPrice, { color: colors.tint }]}>
                    ${selectedProduct.price}
                  </Text>
                  
                  <View style={styles.enlargedDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        {selectedProduct.location}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="eye-outline" size={16} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        {selectedProduct.views} {t('vues')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="heart-outline" size={16} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        {selectedProduct.likes} {t('likes')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={[
                styles.actionsContainerModal,
                { backgroundColor: colors.card }
              ]}>
                <TouchableOpacity 
                  style={styles.actionButtonModal}
                  onPress={() => handleViewProduct(selectedProduct.id)}
                >
                  <Ionicons name="eye-outline" size={24} color={colors.tint} />
                  <Text style={[styles.actionText, { color: colors.text }]}>
                    {t('myItems.actions.view', 'Voir')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButtonModal}
                  onPress={() => handleEditProduct(selectedProduct.id)}
                >
                  <Ionicons name="create-outline" size={24} color={colors.tint} />
                  <Text style={[styles.actionText, { color: colors.text }]}>
                    {t('myItems.actions.edit', 'Modifier')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButtonModal}
                  onPress={() => handleDeleteProduct(selectedProduct.id, selectedProduct.name)}
                >
                  <Ionicons name="trash-outline" size={24} color={colors.error} />
                  <Text style={[styles.actionText, { color: colors.error }]}>
                    {t('myItems.actions.delete', 'Supprimer')}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  const EmptyProducts = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={48} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {t('myItems.empty.title', 'Aucun article')}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {t('myItems.empty.subtitle', 'Les articles que vous publiez apparaîtront ici')}
      </Text>
      <CustomButton
        title={t('myItems.empty.addButton', 'Ajouter un article')}
        onPress={() => router.push('/(tabs)/sell')}
        variant="primary"
        size="medium"
        style={styles.addButton}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
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
          {t('myItems.title', 'Mes articles')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Barre de recherche */}
        <View style={styles.searchWrapper}>
          <SearchBar
            placeholder={t('myItems.searchPlaceholder', 'Rechercher un article...')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            showFilterButton={false}
            colors={colors}
          />
        </View>

        {/* Liste des articles */}
        {filteredProducts.length > 0 ? (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
            columnWrapperStyle={styles.productsRow}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyProducts />
        )}
      </ScrollView>

      {renderActionModal()}
    </View>
  );
}

// Les styles restent identiques...
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    marginTop: 25,
  },
  searchWrapper: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  productsGrid: { 
    paddingHorizontal: 10,
    marginTop: 20,
  },
  productsRow: { 
    justifyContent: 'space-between', 
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalOverlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    zIndex: 1,
  },
  enlargedCard: {
    width: '100%',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 25,
    overflow: 'hidden',
    marginBottom: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  enlargedImage: {
    width: '100%',
    height: 250,
  },
  enlargedContent: {
    padding: 20,
  },
  enlargedName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  enlargedPrice: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  enlargedDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainerModal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
  },
  actionButtonModal: {
    alignItems: 'center',
    padding: 12,
    minWidth: 80,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addButton: {
    marginTop: 16,
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
  retryButton: {
    marginTop: 16,
  },
});