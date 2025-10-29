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

const { width } = Dimensions.get('window');

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

interface ProductCardItemProps {
  product: Product;
  onLongPress?: () => void;
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    tint: string;
    success: string;
    warning: string;
    error: string;
    borderInput: string;
  };
  getStatusConfig: (status: string) => {
    color: string;
    icon: string;
    label: string;
  };
}

export default function ProductCardItem({ product, onLongPress, colors, getStatusConfig }: ProductCardItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePress = () => {
    router.push({
      pathname: '/screens/ProductDetailScreen',
      params: { productId: product.id }
    });
  };

  const statusConfig = getStatusConfig(product.status);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      onLongPress={onLongPress}
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
            source={{ uri: product.image }} 
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
          {product.discount && product.discount > 0 && (
            <View style={[styles.discountBadge, { backgroundColor: colors.tint }]}>
              <Text style={styles.discountText}>-{product.discount}%</Text>
            </View>
          )}
        </View>

        {/* Contenu du produit */}
        <View style={styles.productContent}>
          <Text style={[styles.productCategory, { color: colors.textSecondary }]} numberOfLines={1}>
            {product.category}
          </Text>
          
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
            {product.name}
          </Text>

          {/* Prix */}
          <View style={styles.priceContainer}>
            <Text style={[styles.currentPrice, { color: colors.tint }]}>
              ${product.price}
            </Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                ${product.originalPrice}
              </Text>
            )}
          </View>

          {/* Métriques */}
          <View style={styles.metricsContainer}>
            <View style={styles.metric}>
              <Ionicons name="eye-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.metricText, { color: colors.textSecondary }]}>
                {product.views}
              </Text>
            </View>
            <View style={styles.metric}>
              <Ionicons name="heart-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.metricText, { color: colors.textSecondary }]}>
                {product.likes}
              </Text>
            </View>
            <View style={styles.metric}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.metricText, { color: colors.textSecondary }]} numberOfLines={1}>
                {product.location}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productCard: { 
    width: (width - 60) / 2,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
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
});