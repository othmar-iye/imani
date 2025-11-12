// components/ProductCard.tsx
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  location?: string;
  status?: 'active' | 'sold' | 'pending' | 'rejected';
  views?: number;
  likes?: number;
  discount?: number;
  isFavorite?: boolean;
  description?: string;
}

export interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'search' | 'category' | 'myItems';
  showLocation?: boolean;
  showSavings?: boolean;
  showStatus?: boolean;
  showStats?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  onFavoritePress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'default',
  showLocation = false,
  showSavings = false,
  showStatus = false,
  showStats = false,
  onPress,
  onLongPress,
  onFavoritePress,
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Theme.dark : Theme.light;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigation par défaut
      router.push({
        pathname: '/screens/ProductDetailScreen',
        params: { productId: product.id }
      });
    }
  };

  const handleFavoritePress = () => {
    if (onFavoritePress) {
      onFavoritePress();
    }
    // Sinon, la logique par défaut reste dans le composant parent
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      active: { color: '#34C759', icon: 'checkmark-circle-outline', label: 'Actif' },
      sold: { color: theme.tint, icon: 'cash-outline', label: 'Vendu' },
      pending: { color: '#FFD60A', icon: 'time-outline', label: 'En attente' },
      rejected: { color: '#FF453A', icon: 'close-circle-outline', label: 'Rejeté' },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const shouldShowImageOverlay = variant === 'search' || variant === 'category';
  const savings = product.originalPrice && product.originalPrice > product.price 
    ? product.originalPrice - product.price 
    : 0;

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
      onPress={handlePress}
      onLongPress={onLongPress}
      delayLongPress={500}
    >
      {/* Image Container */}
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: product.image }} 
          style={styles.productImage}
          resizeMode="cover"
        />
        
        {/* Overlay Gradient (pour search/category) */}
        {shouldShowImageOverlay && (
          <View style={[
            styles.imageOverlay,
            { 
              backgroundColor: colorScheme === 'dark' 
                ? 'rgba(0,0,0,0.3)' 
                : 'rgba(255,255,255,0.1)'
            }
          ]} />
        )}
        
        {/* Discount Badge */}
        {product.discount && product.discount > 0 && (
          <View style={[styles.discountBadge, { backgroundColor: theme.tint }]}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        )}
        
        {/* Status Badge (pour myItems) */}
        {showStatus && product.status && (
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusConfig(product.status).color }
          ]}>
            <Ionicons 
              name={getStatusConfig(product.status).icon as any} 
              size={12} 
              color="#fff" 
            />
            <Text style={styles.statusText}>
              {getStatusConfig(product.status).label}
            </Text>
          </View>
        )}
        
        {/* Favorite Button */}
        <TouchableOpacity 
          style={[
            styles.favoriteButton, 
            { 
              backgroundColor: colorScheme === 'dark' 
                ? 'rgba(255,255,255,0.9)' 
                : 'rgba(255,255,255,0.9)',
            }
          ]}
          onPress={handleFavoritePress}
        >
          <Ionicons 
            name={product.isFavorite ? "heart" : "heart-outline"} 
            size={16} 
            color={product.isFavorite ? theme.tint : '#8E8E93'} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <View style={styles.productContent}>
        {/* Category */}
        <Text style={[styles.productCategory, { color: theme.tabIconDefault }]} numberOfLines={1}>
          {product.category}
        </Text>
        
        {/* Product Name */}
        <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
          {product.name}
        </Text>
        
        {/* Price Container */}
        <View style={styles.priceContainer}>
          <Text style={[styles.currentPrice, { color: theme.tint }]}>
            ${product.price}
          </Text>
          {product.originalPrice && product.originalPrice > product.price && (
            <Text style={[styles.originalPrice, { color: theme.tabIconDefault }]}>
              ${product.originalPrice}
            </Text>
          )}
        </View>

        {/* Savings (pour search) */}
        {showSavings && savings > 0 && (
          <View style={styles.savingsContainer}>
            <Text style={[styles.savingsText, { color: theme.tint }]}>
              Économie: ${savings.toFixed(2)}
            </Text>
          </View>
        )}

        {/* Location (pour search/category) */}
        {showLocation && product.location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color={theme.tabIconDefault} />
            <Text style={[styles.locationText, { color: theme.tabIconDefault }]}>
              {product.location}
            </Text>
          </View>
        )}

        {/* Stats (pour myItems) */}
        {showStats && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={12} color={theme.tabIconDefault} />
              <Text style={[styles.statText, { color: theme.tabIconDefault }]}>
                {product.views || 0}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={12} color={theme.tabIconDefault} />
              <Text style={[styles.statText, { color: theme.tabIconDefault }]}>
                {product.likes || 0}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: (Dimensions.get('window').width - 60) / 2,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
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
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
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
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    zIndex: 3,
  },
  statusText: {
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
    shadowOffset: { width: 0, height: 2 },
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
  savingsContainer: {
    marginBottom: 8,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default ProductCard;