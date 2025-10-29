import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

// Import des données
import CustomButton from '@/components/CustomButton';
import { featuredProducts } from '@/src/data/products';

const { width, height } = Dimensions.get('window');

// Placeholder de chargement pour les images
const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  
  const scrollX = useRef(new Animated.Value(0)).current;
  const galleryScrollX = useRef(new Animated.Value(0)).current;
  const carouselRef = useRef<FlatList>(null);
  const galleryRef = useRef<FlatList>(null);

  const colors = {
    background: isDark ? Theme.dark.background : Theme.light.background,
    card: isDark ? Theme.dark.card : Theme.light.card,
    text: isDark ? Theme.dark.text : Theme.light.text,
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? Theme.dark.border : Theme.light.border,
    tint: isDark ? Theme.dark.tint : Theme.light.tint,
  };

  // Récupérer le produit correspondant à l'ID
  const product = featuredProducts.find(p => p.id === productId);

  // Gérer le cas où le produit n'est pas trouvé
  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.tint} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Produit non trouvé
          </Text>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.tint }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onGalleryScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: galleryScrollX } } }],
    { useNativeDriver: false }
  );

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  const scrollToIndex = (index: number) => {
    setActiveIndex(index);
    carouselRef.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
  };

  const scrollGalleryToIndex = (index: number) => {
    setGalleryIndex(index);
    galleryRef.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
  };

  // Configuration du layout pour le carousel
  const getItemLayout = (data: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  // Miniatures pour la galerie
  const renderThumbnail = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      style={[
        styles.thumbnail,
        { 
          borderColor: activeIndex === index ? colors.tint : colors.border,
        }
      ]}
      onPress={() => scrollToIndex(index)}
    >
      <Image 
        source={{ uri: item }}
        style={styles.thumbnailImage}
        placeholder={blurhash}
        contentFit="cover"
        transition={300}
      />
      {activeIndex === index && (
        <View style={[styles.thumbnailOverlay, { backgroundColor: colors.tint }]} />
      )}
    </TouchableOpacity>
  );

//   Au clique d'acheter
    const handleSell = () => {
      
      console.log('Acheter');
      
    };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: 'transparent' }]}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
            <Ionicons name="share-outline" size={18} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
            onPress={toggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={18} 
              color={isFavorite ? '#FF3B30' : '#FFF'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Carousel principal OPTIMISÉ */}
      <View style={styles.carouselContainer}>
        <Animated.FlatList
          ref={carouselRef}
          data={product.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          getItemLayout={getItemLayout}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setActiveIndex(newIndex);
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={styles.imageCard}
              activeOpacity={0.9}
              onPress={() => openGallery(index)}
            >
              <Image 
                source={{ uri: item }}
                style={styles.carouselImage}
                placeholder={blurhash}
                contentFit="cover"
                transition={300}
                priority="high"
              />
              {/* Badge photo avec compteur */}
              <View style={[styles.photoBadge, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                <Ionicons name="images" size={12} color="#FFF" />
                <Text style={styles.photoBadgeText}>
                  {index + 1}/{product.images.length}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
        />
        
        {/* Indicateurs dynamiques */}
        <View style={styles.indicatorsContainer}>
          <View style={styles.indicators}>
            {product.images.map((_, index) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];
              
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [6, 24, 6],
                extrapolate: 'clamp',
              });
              
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.4, 1, 0.4],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      width: dotWidth,
                      opacity,
                      backgroundColor: colors.tint,
                    },
                  ]}
                />
              );
            })}
          </View>
          
          {/* Bouton galerie */}
          <TouchableOpacity 
            style={[styles.galleryButton, { backgroundColor: 'rgba(0,0,0,0.7)' }]}
            onPress={() => openGallery(activeIndex)}
          >
            <Ionicons name="grid" size={16} color="#FFF" />
            <Text style={styles.galleryButtonText}>
              Galerie
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barre de miniatures OPTIMISÉE */}
      {product.images.length > 1 && (
        <View style={styles.thumbnailsContainer}>
          <FlatList
            data={product.images}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderThumbnail}
            keyExtractor={(_, index) => `thumb-${index}`}
            contentContainerStyle={styles.thumbnailsContent}
          />
        </View>
      )}

      {/* Contenu */}
      <ScrollView 
        style={[styles.content, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête produit */}
        <View style={[
          styles.productHeader, 
          { 
            backgroundColor: colors.card,
          }
        ]}>
          <View style={styles.titleSection}>
            <Text style={[styles.productName, { color: colors.text }]}>
              {product.name}
            </Text>
            <Text style={[styles.productCategory, { color: colors.tint }]}>
              {product.category} • {product.views} vues
            </Text>
          </View>
          
          <View style={styles.priceSection}>
            <Text style={[styles.productPrice, { color: colors.tint }]}>
              ${product.price}
            </Text>
            {product.originalPrice > product.price && (
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                ${product.originalPrice}
              </Text>
            )}
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
              {product.discount > 0 ? `-${product.discount}%` : 'Prix ferme'}
            </Text>
          </View>
        </View>


        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {product.description}
          </Text>
        </View>

        {/* Tags d'information */}
        <View style={styles.tagsContainer}>
          <View style={[styles.tag, { backgroundColor: colors.card }]}>
            <Ionicons name="person" size={16} color={colors.tint} />
            <Text style={[styles.tagText, { color: colors.text }]}>
              {product.seller.name}
            </Text>
          </View>
          
          <View style={[styles.tag, { backgroundColor: colors.card }]}>
            <Ionicons name="shield-checkmark" size={16} color={colors.tint} />
            <Text style={[styles.tagText, { color: colors.text }]}>
              Paiement sécurisé
            </Text>
          </View>
          
          <View style={[styles.tag, { backgroundColor: colors.card }]}>
            <Ionicons name="location" size={16} color={colors.tint} />
            <Text style={[styles.tagText, { color: colors.text }]}>
              {product.location}
            </Text>
          </View>
          
          <View style={[styles.tag, { backgroundColor: colors.card }]}>
            <Ionicons name="checkmark-done" size={16} color={colors.tint} />
            <Text style={[styles.tagText, { color: colors.text }]}>
              {product.condition}
            </Text>
          </View>
        </View>


        {/* Vendeur */}
        <View style={[styles.sellerCard, { backgroundColor: colors.card }]}>
          <View style={styles.sellerHeader}>
            <View style={styles.sellerInfo}>
              <View style={[styles.sellerAvatar, { backgroundColor: colors.tint }]}>
                <Text style={styles.sellerInitials}>
                  {product.seller.name.split(' ').map(n => n[0]).join('')}
                </Text>
                {product.seller.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark" size={10} color="#FFF" />
                  </View>
                )}
              </View>
              <View style={styles.sellerDetails}>
                <Text style={[styles.sellerName, { color: colors.text }]}>
                  {product.seller.name}
                </Text>
                <View style={styles.sellerStats}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={[styles.sellerRating, { color: colors.textSecondary }]}>
                    {product.seller.rating} • {product.seller.itemsSold} ventes
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={[styles.sellerMetrics, { borderTopColor: colors.border }]}>
            <View style={styles.metric}>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {product.seller.responseRate}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Taux de réponse
              </Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
            <View style={styles.metric}>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {product.seller.responseTime}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Temps de réponse
              </Text>
            </View>
          </View>
        </View>

        {/* Espace pour les boutons */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Boutons d'action */}
      <View style={[styles.actionBar, { backgroundColor: colors.background }]}>
        
        <CustomButton
            title="Discuter avec le vendeur"
            onPress={handleSell}
            variant="secondary"
            size="large"
        />
       
        <CustomButton
            title="Acheter"
            onPress={handleSell}
            variant="primary"
            size="large"
        />
      </View>

      {/* Modal Galerie Plein Écran OPTIMISÉ */}
      <Modal
        visible={showGallery}
        transparent={true}
        statusBarTranslucent={true}
        animationType="fade"
      >
        <View style={styles.galleryContainer}>
          <StatusBar barStyle="light-content" />
          
          {/* Header galerie */}
          <View style={styles.galleryHeader}>
            <TouchableOpacity 
              style={styles.galleryCloseButton}
              onPress={closeGallery}
            >
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.galleryCounter}>
              {galleryIndex + 1} / {product.images.length}
            </Text>
            <TouchableOpacity 
              style={styles.galleryFavoriteButton}
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? '#FF3B30' : '#FFF'} 
              />
            </TouchableOpacity>
          </View>

          {/* Carousel galerie OPTIMISÉ */}
          <Animated.FlatList
            ref={galleryRef}
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={galleryIndex}
            getItemLayout={getItemLayout}
            onScroll={onGalleryScroll}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setGalleryIndex(newIndex);
            }}
            renderItem={({ item }) => (
              <View style={styles.galleryImageContainer}>
                <Image 
                  source={{ uri: item }}
                  style={styles.galleryImage}
                  placeholder={blurhash}
                  contentFit="contain"
                  transition={300}
                  priority="high"
                />
              </View>
            )}
            keyExtractor={(_, index) => `gallery-${index}`}
          />

          {/* Indicateurs galerie */}
          <View style={styles.galleryIndicators}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.galleryIndicator,
                  { 
                    backgroundColor: galleryIndex === index ? '#FFF' : 'rgba(255,255,255,0.4)',
                  }
                ]}
              />
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Les styles restent identiques...
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    height: height * 0.5,
    position: 'relative',
  },
  imageCard: {
    width: width,
    height: '100%',
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  photoBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  photoBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  indicatorsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 15,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  indicator: {
    height: 3,
    borderRadius: 2,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  galleryButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  thumbnailsContainer: {
    paddingVertical: 15,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  thumbnailsContent: {
    paddingHorizontal: 15,
    gap: 10,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  content: {
    flex: 1,
  },
  productHeader: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
  },
  titleSection: {
    flex: 1,
    marginBottom: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 26,
    fontWeight: '900',
  },
  originalPrice: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  tagsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 10,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  sellerCard: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 8, // Garde elevation pour Android
  },
  sellerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sellerInitials: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  sellerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sellerRating: {
    fontSize: 13,
    fontWeight: '500',
  },
  sellerMetrics: {
    flexDirection: 'row',
    paddingTop: 15,
    borderTopWidth: 1,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  metricDivider: {
    width: 1,
    height: '60%',
    alignSelf: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  // Styles pour la galerie
  galleryContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  galleryHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  galleryCloseButton: {
    padding: 8,
  },
  galleryCounter: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  galleryFavoriteButton: {
    padding: 8,
  },
  galleryImageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryIndicators: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  galleryIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});