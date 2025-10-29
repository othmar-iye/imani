import CustomButton from '@/components/CustomButton';
import { Theme } from '@/constants/theme';
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
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  location: string;
  status: 'active' | 'sold' | 'draft';
  views: number;
  likes: number;
  createdAt: string;
  isFavorite?: boolean;
  discount?: number;
}

export default function MyItemsScreen() {
  const { t } = useTranslation();
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

  // Données simulées des articles
  const myProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max 256GB',
      price: 1200,
      originalPrice: 1400,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      category: 'Électronique',
      location: 'Lubumbashi',
      status: 'active',
      views: 245,
      likes: 34,
      createdAt: '2024-01-15',
      discount: 15
    },
    {
      id: '2',
      name: 'Canon EOS R6 Mark II',
      price: 850,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
      category: 'Photographie',
      location: 'Kinshasa',
      status: 'sold',
      views: 189,
      likes: 22,
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'Nike Air Jordan 1 Retro',
      price: 180,
      originalPrice: 220,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      category: 'Mode',
      location: 'Lubumbashi',
      status: 'active',
      views: 156,
      likes: 45,
      createdAt: '2024-01-08',
      discount: 20
    },
    {
      id: '4',
      name: 'MacBook Pro 14" M3',
      price: 2200,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      category: 'Électronique',
      location: 'Goma',
      status: 'draft',
      views: 0,
      likes: 0,
      createdAt: '2024-01-05'
    },
    {
      id: '6',
      name: 'Sac à dos The North Face',
      price: 120,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      category: 'Mode',
      location: 'Kinshasa',
      status: 'sold',
      views: 167,
      likes: 29,
      createdAt: '2023-12-28'
    }
  ];

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

  const getStatusConfig = (status: string) => {
    const configs = {
      active: { color: colors.success, icon: 'checkmark-circle-outline', label: t('myItems:status.active', 'Actif') },
      sold: { color: colors.tint, icon: 'cash-outline', label: t('myItems:status.sold', 'Vendu') },
      draft: { color: colors.warning, icon: 'document-outline', label: t('myItems:status.draft', 'Brouillon') },
    };
    return configs[status as keyof typeof configs] || configs.active;
  };

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
        t('myItems:deleteTitle', 'Supprimer l\'article'),
        t('myItems:deleteMessage', `Êtes-vous sûr de vouloir supprimer "${productName}" ?`),
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
            onPress: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Succès', 'Article supprimé avec succès');
            }
          },
        ]
      );
    }, 200);
  };

  // Gestion du long press
  const handleLongPress = (product: Product) => {
    // Vibration au long press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedProduct(product);
    
    // Reset animations
    scaleAnim.setValue(0.9);
    opacityAnim.setValue(0);
    slideAnim.setValue(30);
    overlayOpacity.setValue(0);
    
    // Animation d'ouverture plus fluide
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
    // Vibration légère à la fermeture
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animation de fermeture synchronisée
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

  const renderProductItem = ({ item }: { item: Product }) => {
    const statusConfig = getStatusConfig(item.status);
    
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={() => handleLongPress(item)}
        delayLongPress={500}
      >
        <View style={[
          styles.productCard, 
          { 
            backgroundColor: colors.card,
            shadowColor: isDark ? '#000' : '#8E8E93',
          }
        ]}>
          {/* Image du produit */}
          <View style={styles.productImageContainer}>
            <Image 
              source={{ uri: item.image }} 
              style={styles.productImage}
              resizeMode="cover"
            />
            
            {/* Badge de statut */}
            <View style={[
              styles.statusBadge,
              { backgroundColor: statusConfig.color }
            ]}>
              <Ionicons name={statusConfig.icon as any} size={12} color="#FFF" />
              <Text style={styles.statusBadgeText}>
                {statusConfig.label}
              </Text>
            </View>

            {/* Badge de promotion */}
            {item.discount && item.discount > 0 && (
              <View style={[styles.discountBadge, { backgroundColor: colors.tint }]}>
                <Text style={styles.discountText}>-{item.discount}%</Text>
              </View>
            )}
          </View>

          {/* Contenu du produit */}
          <View style={styles.productContent}>
            <Text style={[styles.productCategory, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.category}
            </Text>
            
            <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
              {item.name}
            </Text>

            {/* Prix */}
            <View style={styles.priceContainer}>
              <Text style={[styles.currentPrice, { color: colors.tint }]}>
                ${item.price}
              </Text>
              {item.originalPrice && item.originalPrice > item.price && (
                <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                  ${item.originalPrice}
                </Text>
              )}
            </View>

            {/* Métriques */}
            <View style={styles.metricsContainer}>
              <View style={styles.metric}>
                <Ionicons name="eye-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.metricText, { color: colors.textSecondary }]}>
                  {item.views}
                </Text>
              </View>
              <View style={styles.metric}>
                <Ionicons name="heart-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.metricText, { color: colors.textSecondary }]}>
                  {item.likes}
                </Text>
              </View>
              <View style={styles.metric}>
                <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.metricText, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Modal pour les actions Pinterest-like
  const renderActionModal = () => (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={closeModal}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
        {/* Zone cliquable pour fermer - seulement sur les bords */}
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlayTouchable} />
        </TouchableWithoutFeedback>
        
        {/* Contenu du modal - zone non cliquable pour fermer */}
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
              {/* Carte agrandie avec effet d'ombre */}
              <View style={[
                styles.enlargedCard,
                { 
                  backgroundColor: colors.card,
                }
              ]}>
                {/* Bouton de fermeture */}
                <TouchableOpacity 
                  style={[
                    styles.closeButton,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }
                  ]}
                  onPress={closeModal}
                >
                  <Ionicons name="close" size={20} color={colors.text} />
                </TouchableOpacity>
                
                <Image 
                  source={{ uri: selectedProduct.image }} 
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
                  
                  {/* Informations supplémentaires */}
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
                        {selectedProduct.views} vues
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="heart-outline" size={16} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        {selectedProduct.likes} likes
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Actions */}
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
                    {t('myItems:actions.view', 'Voir')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButtonModal}
                  onPress={() => handleEditProduct(selectedProduct.id)}
                >
                  <Ionicons name="create-outline" size={24} color={colors.tint} />
                  <Text style={[styles.actionText, { color: colors.text }]}>
                    {t('myItems:actions.edit', 'Modifier')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButtonModal}
                  onPress={() => handleDeleteProduct(selectedProduct.id, selectedProduct.name)}
                >
                  <Ionicons name="trash-outline" size={24} color={colors.error} />
                  <Text style={[styles.actionText, { color: colors.error }]}>
                    {t('myItems:actions.delete', 'Supprimer')}
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
        {t('myItems:empty.title', 'Aucun article')}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {t('myItems:empty.subtitle', 'Les articles que vous publiez apparaîtront ici')}
      </Text>
      <CustomButton
        title={t('myItems:empty.addButton', 'Ajouter un article')}
        onPress={() => console.log('Ajouter un article')}
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
          {t('myItems:title', 'Mes articles')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Barre de recherche */}
        <View style={[styles.searchContainer, { 
          backgroundColor: colors.card,
          borderColor: colors.borderInput 
        }]}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t('myItems:searchPlaceholder', 'Rechercher un article...')}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Liste des articles - Grille 2 colonnes */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header
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
  // Search
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
    borderWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 8,
  },
  // Products Grid
  productsGrid: { 
    paddingHorizontal: 10,
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
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
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
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  productContent: {
    padding: 12,
  },
  productCategory: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
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
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 10,
    fontWeight: '500',
  },
  // Modal Styles
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
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
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
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
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
});